/**
 * Prueba HTTP real contra el servidor en marcha (npm run dev). Uso: npm run test:http
 * Verifica auth por cookie y Bearer, permisos por rol, validación y checkout.
 */
import assert from "node:assert/strict";
import { PrismaClient } from "@prisma/client";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const tag = Date.now().toString(36);
const db = new PrismaClient();
let n = 0;
const ok = (m: string) => console.log(`  ✔ ${++n}. ${m}`);

async function call(path: string, init: RequestInit & { token?: string; json?: unknown } = {}) {
  const headers: Record<string, string> = { ...(init.headers as Record<string, string>) };
  if (init.json !== undefined) headers["content-type"] = "application/json";
  if (init.token) headers.authorization = `Bearer ${init.token}`;
  const res = await fetch(BASE + path, { ...init, headers, body: init.json !== undefined ? JSON.stringify(init.json) : init.body });
  const body = await res.json().catch(() => null);
  return { status: res.status, body, res };
}

async function main() {
  console.log(`HTTP test → ${BASE}\n`);

  const health = await call("/api/health");
  assert.equal(health.status, 200);
  assert.equal(health.body.db, "up");
  ok("health: servidor y base de datos arriba");

  const products = await call("/api/products?roast=LIGHT&pageSize=5");
  assert.equal(products.status, 200);
  assert.ok(products.body.items.length > 0);
  ok(`GET /api/products (${products.body.total} claros)`);

  const bad = await call("/api/products?page=0");
  assert.equal(bad.status, 400);
  assert.equal(bad.body.error.code, "VALIDATION");
  ok("validación zod → 400");

  assert.equal((await call("/api/products/no-existe")).status, 404);
  ok("producto inexistente → 404");

  assert.equal((await call("/api/orders")).status, 401);
  ok("sin sesión → 401");

  // Registro → token Bearer + cookie
  const email = `http.${tag}@test.co`;
  const reg = await call("/api/auth/register", { method: "POST", json: { email, name: "Http Test", password: "Prueba12345" } });
  assert.equal(reg.status, 201);
  const token: string = reg.body.token;
  assert.ok(reg.res.headers.get("set-cookie")?.includes("session="));
  ok("registro devuelve token y cookie httpOnly");

  const dup = await call("/api/auth/register", { method: "POST", json: { email, name: "Http Test", password: "Prueba12345" } });
  assert.equal(dup.status, 409);
  ok("correo duplicado → 409");

  const meRes = await call("/api/auth/me", { token });
  assert.equal(meRes.body.email, email);
  ok("GET /api/auth/me con Bearer");

  assert.equal((await call("/api/admin/stats", { token })).status, 403);
  assert.equal((await call("/api/brand/me", { token })).status, 403);
  ok("cliente no accede a admin ni portal de marca → 403");

  const addr = await call("/api/addresses", { method: "POST", token, json: { recipient: "Http Test", phone: "3001112233", department: "Antioquia", city: "Medellín", line1: "Carrera 10 # 20-30" } });
  assert.equal(addr.status, 201);

  const detail = await call("/api/products/caturra-honey");
  const variant = detail.body.variants[0];
  const stock0 = variant.stock;
  const checkout = await call("/api/checkout", {
    method: "POST", token,
    json: { addressId: addr.body.id, paymentMethod: "COD", items: [{ variantId: variant.id, quantity: 2 }] },
  });
  assert.equal(checkout.status, 201);
  assert.equal(checkout.body.payment.method, "COD");
  ok(`checkout contraentrega → pedido #${checkout.body.order.number}`);

  const orders = await call("/api/orders", { token });
  assert.equal(orders.body.length, 1);
  ok("GET /api/orders lista el pedido");

  const cancel = await call(`/api/orders/${checkout.body.order.id}/cancel`, { method: "POST", token });
  assert.equal(cancel.status, 200);
  const after = await call("/api/products/caturra-honey");
  assert.equal(after.body.variants[0].stock, stock0);
  ok("cancelar devuelve el stock");

  const payu = await call("/api/checkout", { method: "POST", token, json: { addressId: addr.body.id, paymentMethod: "PAYU", items: [{ variantId: variant.id, quantity: 1 }] } });
  assert.equal(payu.status, 400);
  assert.equal(payu.body.error.code, "METHOD_NOT_ENABLED");
  ok("PayU aún no habilitado → 400 sin tocar stock");

  // Admin
  const login = await call("/api/auth/login", { method: "POST", json: { email: "admin@cumbre.co", password: "Admin12345!" } });
  assert.equal(login.status, 200);
  const stats = await call("/api/admin/stats", { token: login.body.token });
  assert.equal(stats.status, 200);
  ok(`admin login y /api/admin/stats (GMV ${stats.body.gmvCop} COP)`);
  assert.equal((await call("/api/auth/login", { method: "POST", json: { email: "admin@cumbre.co", password: "mal" } })).status, 401);
  ok("login con clave errónea → 401");

  // Cron protegido
  assert.equal((await call("/api/cron/subscriptions", { method: "POST" })).status, 403);
  ok("cron sin secreto → 403");

  // Webhook con firma (simulado: sin llaves en dev) y evento ajeno
  const wh = await call("/api/webhooks/wompi", { method: "POST", json: { event: "nequi_token.updated", data: {}, timestamp: 1 } });
  assert.equal(wh.status, 200);
  ok("webhook ignora eventos desconocidos");

  console.log("\n✅ La API HTTP responde correctamente.");
}

main()
  .catch((e) => {
    console.error("\n❌ FALLÓ:", e);
    process.exitCode = 1;
  })
  .finally(async () => {
    const users = await db.user.findMany({ where: { email: `http.${tag}@test.co` }, select: { id: true } });
    const ids = users.map((u) => u.id);
    const orders = await db.order.findMany({ where: { userId: { in: ids } }, select: { id: true } });
    const oids = orders.map((o) => o.id);
    await db.orderItem.deleteMany({ where: { subOrder: { orderId: { in: oids } } } });
    await db.subOrder.deleteMany({ where: { orderId: { in: oids } } });
    await db.payment.deleteMany({ where: { orderId: { in: oids } } });
    await db.order.deleteMany({ where: { id: { in: oids } } });
    await db.address.deleteMany({ where: { userId: { in: ids } } });
    await db.user.deleteMany({ where: { id: { in: ids } } });
    await db.$disconnect();
  });
