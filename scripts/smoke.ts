/**
 * Prueba de humo end-to-end contra la BD (usa los servicios directamente).
 * Requiere haber corrido `npm run db:seed`. Crea datos con sufijo único y los limpia al final.
 */
import assert from "node:assert/strict";
import { PrismaClient } from "@prisma/client";
import { registerCustomer, authenticate, createAddress, createReview, registerBrand } from "../src/server/services/accounts";
import { listProducts, getProduct, catalogFacets } from "../src/server/services/catalog";
import { createOrder, cancelOrder, cancelOwnOrder } from "../src/server/services/orders";
import { processWompiEvent } from "../src/server/services/payments";
import { updateSubOrder, createProduct } from "../src/server/services/brand";
import { generatePayouts, markPayoutPaid, updateBrandAdmin, platformStats } from "../src/server/services/admin";
import { createSubscription, processDueSubscriptions } from "../src/server/services/subscriptions";
import { AppError } from "../src/server/errors";

const db = new PrismaClient();
const tag = Date.now().toString(36);
let step = 0;
const ok = (msg: string) => console.log(`  ✔ ${++step}. ${msg}`);

async function expectError(code: string, fn: () => Promise<unknown>) {
  try {
    await fn();
  } catch (e) {
    assert.ok(e instanceof AppError, `esperaba AppError(${code}), llegó ${e}`);
    assert.equal((e as AppError).code, code);
    return;
  }
  assert.fail(`esperaba error ${code}`);
}

async function main() {
  console.log("Smoke test backend\n");

  // 1. Catálogo
  const catalog = await listProducts({ page: 1, pageSize: 20 });
  assert.ok(catalog.total >= 6, "faltan productos: corre npm run db:seed");
  ok(`catálogo lista ${catalog.total} productos`);
  const light = await listProducts({ roast: "LIGHT", page: 1, pageSize: 20 });
  assert.ok(light.items.every((p) => p.roast === "LIGHT"));
  ok("filtro por tueste");
  const search = await listProducts({ q: "frambuesa", page: 1, pageSize: 20 });
  assert.ok(search.items.some((p) => p.slug === "pink-bourbon"));
  ok("búsqueda por nota de cata");
  assert.ok((await catalogFacets()).origins.length > 0);
  ok("facets de filtros");

  // 2. Cliente
  const customer = await registerCustomer({ email: `cliente.${tag}@test.co`, name: "Cliente Prueba", password: "Prueba12345" });
  await expectError("EMAIL_TAKEN", () => registerCustomer({ email: `cliente.${tag}@test.co`, name: "x x", password: "Prueba12345" }));
  await expectError("BAD_CREDENTIALS", () => authenticate(customer.email, "incorrecta"));
  assert.equal((await authenticate(customer.email, "Prueba12345")).id, customer.id);
  ok("registro y login (clave incorrecta rechazada)");

  const address = await createAddress(customer.id, { recipient: "Cliente Prueba", phone: "3001234567", department: "Cundinamarca", city: "Bogotá", line1: "Calle 1 # 2-3" });
  assert.equal(address.isDefault, true);
  ok("dirección creada (default)");

  // 3. Checkout multi-marca
  const geisha = await getProduct("geisha-washed");
  const caturra = await getProduct("caturra-honey");
  const vGeisha = geisha.variants.find((v) => v.sku === "AUR-GEI-250")!;
  const vCaturra = caturra.variants.find((v) => v.sku === "SUR-CAT-340")!;
  const stockBefore = { g: vGeisha.stock, c: vCaturra.stock };

  const { order, paymentInit } = await createOrder(customer.id, {
    addressId: address.id,
    paymentMethod: "WOMPI",
    items: [{ variantId: vGeisha.id, quantity: 2 }, { variantId: vCaturra.id, quantity: 1 }],
  });
  assert.equal(order.subOrders.length, 2, "debe dividirse en 2 sub-pedidos");
  assert.equal(order.status, "PENDING_PAYMENT");
  const expectedSubtotal = 2 * 78000 + 42000;
  assert.equal(order.subtotalCop, expectedSubtotal);
  // Finca Aurora: 156.000 >= 120.000 → envío gratis; Tostadores: 42.000 → 12.000
  assert.ok(order.subOrders.some((s) => s.shippingCop === 0), "una marca con envío gratis");
  assert.ok(order.subOrders.some((s) => s.shippingCop === 12000), "una marca con envío cobrado");
  assert.ok(order.subOrders.every((s) => s.commissionCop === Math.round(s.subtotalCop * 0.15)), "comisión 15% plan Básico");
  assert.equal(paymentInit.method, "WOMPI");
  ok("pedido multi-marca dividido, envío y comisión calculados");

  const after = await getProduct("geisha-washed");
  assert.equal(after.variants.find((v) => v.sku === "AUR-GEI-250")!.stock, stockBefore.g - 2);
  ok("stock reservado");

  await expectError("OUT_OF_STOCK", () =>
    createOrder(customer.id, { addressId: address.id, paymentMethod: "WOMPI", items: [{ variantId: vGeisha.id, quantity: 9999 }] }),
  );
  const unchanged = await getProduct("geisha-washed");
  assert.equal(unchanged.variants.find((v) => v.sku === "AUR-GEI-250")!.stock, stockBefore.g - 2);
  ok("stock insuficiente rechazado sin alterar inventario");

  await expectError("METHOD_NOT_ENABLED", () =>
    createOrder(customer.id, { addressId: address.id, paymentMethod: "PAYU", items: [{ variantId: vCaturra.id, quantity: 1 }] }),
  );
  const afterPayu = await getProduct("caturra-honey");
  assert.equal(afterPayu.variants.find((v) => v.sku === "SUR-CAT-340")!.stock, stockBefore.c - 1);
  ok("método no habilitado revierte la transacción");

  // 4. Pago (webhook Wompi simulado, idempotente)
  const payment = order.payments[0];
  const evt = {
    event: "transaction.updated",
    timestamp: Math.floor(Date.now() / 1000),
    data: { transaction: { id: `tx-${tag}`, status: "APPROVED", reference: payment.id, amount_in_cents: payment.amountCop * 100 } },
  };
  await expectError("AMOUNT_MISMATCH", () =>
    processWompiEvent({ ...evt, data: { transaction: { ...evt.data.transaction, id: `bad-${tag}`, amount_in_cents: 1 } } }),
  );
  assert.deepEqual(await processWompiEvent(evt), { processed: true, status: "APPROVED" });
  assert.deepEqual(await processWompiEvent(evt), { duplicate: true });
  const paid = await db.order.findUniqueOrThrow({ where: { id: order.id } });
  assert.equal(paid.status, "PAID");
  ok("webhook APPROVED → pedido PAID; reenvío ignorado; monto alterado rechazado");

  // 5. Cumplimiento por la marca
  const so = order.subOrders[0];
  await expectError("TRACKING_REQUIRED", async () => {
    await updateSubOrder(so.brandId, so.id, { status: "PREPARING" });
    await updateSubOrder(so.brandId, so.id, { status: "SHIPPED" });
  });
  await updateSubOrder(so.brandId, so.id, { status: "SHIPPED", carrier: "Servientrega", trackingNumber: `SV${tag}` });
  await expectError("BAD_TRANSITION", () => updateSubOrder(so.brandId, so.id, { status: "PREPARING" }));
  await updateSubOrder(so.brandId, so.id, { status: "DELIVERED" });
  ok("flujo PREPARING → SHIPPED (guía obligatoria) → DELIVERED");
  await expectError("NOT_FOUND", () => updateSubOrder("otra-marca", order.subOrders[1].id, { status: "PREPARING" }));
  ok("una marca no puede tocar pedidos de otra");

  // 6. Reseña verificada + liquidación
  await expectError("FORBIDDEN", () => createReview(customer.id, so.brandId === order.subOrders[1].brandId ? "caturra-honey" : "tabi-natural", { rating: 5 }));
  ok("reseña sin compra entregada rechazada");

  const delivered = await db.subOrder.findUniqueOrThrow({ where: { id: so.id }, include: { items: { include: { variant: { include: { product: true } } } } } });
  const slug = delivered.items[0].variant.product.slug;
  await createReview(customer.id, slug, { rating: 5, comment: "Excelente" });
  assert.equal((await getProduct(slug)).rating.count >= 1, true);
  ok("reseña verificada creada");

  const payouts = await generatePayouts({ brandId: so.brandId, holdDays: 0 });
  assert.equal(payouts.length, 1);
  const p = payouts[0];
  assert.equal(p.netCop, p.grossCop - p.commissionCop);
  assert.equal((await generatePayouts({ brandId: so.brandId, holdDays: 0 })).length, 0, "no debe liquidar dos veces");
  await markPayoutPaid(p.id);
  await expectError("ALREADY_PAID", () => markPayoutPaid(p.id));
  ok(`liquidación generada (neto ${p.netCop} COP), sin duplicar, pagada una sola vez`);

  // 7. Cancelación devuelve stock
  const { order: o2 } = await createOrder(customer.id, { addressId: address.id, paymentMethod: "COD", items: [{ variantId: vCaturra.id, quantity: 3 }] });
  const mid = await getProduct("caturra-honey");
  const midStock = mid.variants.find((v) => v.sku === "SUR-CAT-340")!.stock;
  await cancelOwnOrder(customer.id, o2.id);
  const restored = await getProduct("caturra-honey");
  assert.equal(restored.variants.find((v) => v.sku === "SUR-CAT-340")!.stock, midStock + 3);
  await db.$transaction((tx) => cancelOrder(tx, o2.id)); // idempotente
  assert.equal((await getProduct("caturra-honey")).variants.find((v) => v.sku === "SUR-CAT-340")!.stock, midStock + 3);
  ok("cancelación contraentrega devuelve stock (idempotente)");

  // 8. Suscripción
  const sub = await createSubscription(customer.id, { variantId: vCaturra.id, addressId: address.id, frequency: "WEEKLY" });
  await db.subscription.update({ where: { id: sub.id }, data: { nextChargeAt: new Date(Date.now() - 1000) } });
  const report = await processDueSubscriptions();
  assert.ok(report.created >= 1);
  const renewed = await db.subscription.findUniqueOrThrow({ where: { id: sub.id } });
  assert.ok(renewed.nextChargeAt > new Date());
  ok("job de suscripciones genera el pedido y reprograma el siguiente cobro");

  // 9. Marca nueva: pendiente → invisible hasta aprobar
  const owner = await registerCustomer({ email: `marca.${tag}@test.co`, name: "Dueño Marca", password: "Prueba12345" });
  const newBrand = await registerBrand(owner.id, { name: `Marca Prueba ${tag}`, city: "Medellín" });
  await createProduct(newBrand.id, {
    name: `Café Test ${tag}`, description: "Café de prueba con notas dulces", origin: "Antioquia", roast: "MEDIUM",
    variants: [{ sku: `TST-${tag}`, weightGrams: 250, priceCop: 30000, stock: 10 }],
  });
  assert.equal((await listProducts({ q: `Café Test ${tag}`, page: 1, pageSize: 5 })).total, 0);
  await updateBrandAdmin(newBrand.id, { status: "ACTIVE" });
  assert.equal((await listProducts({ q: `Café Test ${tag}`, page: 1, pageSize: 5 })).total, 1);
  ok("marca nueva oculta hasta que el admin la aprueba");

  const stats = await platformStats();
  assert.ok(stats.paidOrders >= 1 && stats.commissionCop > 0);
  ok("métricas de plataforma");

  console.log("\n✅ Todo el flujo del backend funciona.");
}

async function cleanup() {
  // Elimina datos creados por esta corrida (los de seed se conservan; stock se restaura al cancelar/compensa)
  const users = await db.user.findMany({ where: { email: { endsWith: `.${tag}@test.co` } }, select: { id: true } });
  const ids = users.map((u) => u.id);
  const orders = await db.order.findMany({ where: { userId: { in: ids } }, select: { id: true } });
  const orderIds = orders.map((o) => o.id);
  // Devolver stock de pedidos no cancelados para no ensuciar el inventario demo
  const active = await db.subOrder.findMany({ where: { orderId: { in: orderIds }, status: { not: "CANCELLED" } }, include: { items: true } });
  for (const s of active) for (const it of s.items) await db.variant.update({ where: { id: it.variantId }, data: { stock: { increment: it.quantity } } });
  const payoutIds = (await db.subOrder.findMany({ where: { orderId: { in: orderIds }, payoutId: { not: null } }, select: { payoutId: true } })).map((s) => s.payoutId!);
  await db.subscription.deleteMany({ where: { userId: { in: ids } } });
  await db.review.deleteMany({ where: { userId: { in: ids } } });
  await db.orderItem.deleteMany({ where: { subOrder: { orderId: { in: orderIds } } } });
  await db.subOrder.deleteMany({ where: { orderId: { in: orderIds } } });
  await db.payment.deleteMany({ where: { orderId: { in: orderIds } } });
  await db.order.deleteMany({ where: { id: { in: orderIds } } });
  await db.payout.deleteMany({ where: { id: { in: payoutIds } } });
  await db.webhookEvent.deleteMany({ where: { externalId: { contains: tag } } });
  await db.address.deleteMany({ where: { userId: { in: ids } } });
  const brands = await db.brand.findMany({ where: { ownerId: { in: ids } }, select: { id: true } });
  await db.product.deleteMany({ where: { brandId: { in: brands.map((b) => b.id) } } });
  await db.brand.deleteMany({ where: { id: { in: brands.map((b) => b.id) } } });
  await db.user.deleteMany({ where: { id: { in: ids } } });
}

main()
  .catch((e) => {
    console.error("\n❌ FALLÓ:", e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await cleanup().catch((e) => console.error("cleanup:", e));
    await db.$disconnect();
  });
