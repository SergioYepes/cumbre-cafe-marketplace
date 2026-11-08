import { Prisma, type PaymentMethod } from "@prisma/client";
import { db } from "../db";
import { badRequest, conflict, forbidden, notFound } from "../errors";
import { config, isFresh } from "../utils";
import { assertMethodEnabled, initPayment, type PaymentInit } from "./payments";

export type CheckoutInput = {
  addressId: string;
  paymentMethod: PaymentMethod;
  items: { variantId: string; quantity: number }[];
};

type Tx = Prisma.TransactionClient;

/**
 * Crea un pedido multi-marca:
 *  - valida marca activa, producto/variante activos, frescura y stock
 *  - descuenta stock de forma atómica (reserva)
 *  - divide en sub-pedidos por marca con envío y comisión (según plan)
 *  - crea el pago pendiente y prepara la pasarela
 * Todo ocurre en una transacción: si algo falla, no se descuenta stock.
 */
export async function createOrder(userId: string, input: CheckoutInput) {
  if (input.items.length === 0) throw badRequest("EMPTY_CART", "El carrito está vacío");
  assertMethodEnabled(input.paymentMethod);

  // Consolidar variantes repetidas
  const qtyByVariant = new Map<string, number>();
  for (const it of input.items) {
    qtyByVariant.set(it.variantId, (qtyByVariant.get(it.variantId) ?? 0) + it.quantity);
  }

  const result = await db.$transaction(async (tx) => {
    const address = await tx.address.findUnique({ where: { id: input.addressId } });
    if (!address || address.userId !== userId) throw notFound("Dirección no encontrada");

    const variants = await tx.variant.findMany({
      where: { id: { in: [...qtyByVariant.keys()] } },
      include: { product: { include: { brand: { include: { plan: true } } } } },
    });
    if (variants.length !== qtyByVariant.size) throw notFound("Algún producto ya no existe");

    // Validaciones de negocio
    for (const v of variants) {
      const qty = qtyByVariant.get(v.id)!;
      const label = `${v.product.name} ${v.weightGrams}g`;
      if (!v.active || !v.product.active) throw conflict("UNAVAILABLE", `${label} no está disponible`);
      if (v.product.brand.status !== "ACTIVE") throw conflict("BRAND_INACTIVE", `${v.product.brand.name} no está vendiendo`);
      if (!isFresh(v.roastedAt, v.maxFreshDays)) throw conflict("NOT_FRESH", `${label}: el lote superó su ventana de frescura`);
      if (v.stock < qty) throw conflict("OUT_OF_STOCK", `${label}: stock insuficiente (${v.stock} disponibles)`);
    }

    // Reserva atómica de stock (protege contra compras concurrentes)
    for (const [variantId, qty] of qtyByVariant) {
      const { count } = await tx.variant.updateMany({
        where: { id: variantId, stock: { gte: qty } },
        data: { stock: { decrement: qty } },
      });
      if (count === 0) throw conflict("OUT_OF_STOCK", "El stock cambió, intenta de nuevo");
    }

    // Agrupar por marca
    const byBrand = new Map<string, typeof variants>();
    for (const v of variants) {
      const list = byBrand.get(v.product.brandId) ?? [];
      list.push(v);
      byBrand.set(v.product.brandId, list);
    }

    let subtotalAll = 0;
    let shippingAll = 0;
    const subOrdersData = [...byBrand.entries()].map(([brandId, vs]) => {
      const brand = vs[0].product.brand;
      const subtotal = vs.reduce((s, v) => s + v.priceCop * qtyByVariant.get(v.id)!, 0);
      const free = brand.freeShippingFromCop !== null && subtotal >= brand.freeShippingFromCop;
      const shipping = free ? 0 : config.defaultShippingCop();
      const bps = brand.plan?.commissionBps ?? config.defaultCommissionBps();
      const commission = Math.round((subtotal * bps) / 10_000);
      subtotalAll += subtotal;
      shippingAll += shipping;
      return {
        brandId,
        subtotalCop: subtotal,
        shippingCop: shipping,
        commissionCop: commission,
        items: {
          create: vs.map((v) => ({
            variantId: v.id,
            productName: `${v.product.name} · ${v.weightGrams} g · ${v.grind}`,
            quantity: qtyByVariant.get(v.id)!,
            unitPriceCop: v.priceCop,
          })),
        },
      };
    });

    const total = subtotalAll + shippingAll;
    if (input.paymentMethod === "COD" && total > config.codMaxTotalCop()) {
      throw badRequest("COD_LIMIT", `Contraentrega disponible hasta ${config.codMaxTotalCop()} COP`);
    }
    if (input.paymentMethod === "COD") await assertCodAllowed(tx, userId);

    const order = await tx.order.create({
      data: {
        userId,
        addressId: address.id,
        status: "PENDING_PAYMENT",
        subtotalCop: subtotalAll,
        shippingCop: shippingAll,
        totalCop: total,
        subOrders: { create: subOrdersData },
        payments: { create: { method: input.paymentMethod, amountCop: total } },
      },
      include: { subOrders: { include: { items: true } }, payments: true },
    });

    return order;
  });

  const payment = result.payments[0];
  let paymentInit: PaymentInit;
  try {
    paymentInit = await initPayment(payment, result.number);
  } catch (e) {
    // Compensación: si la pasarela falla tras reservar, liberar stock y cancelar
    await db.$transaction(async (tx) => {
      await cancelOrder(tx, result.id);
      await tx.payment.update({ where: { id: payment.id }, data: { status: "DECLINED" } });
    });
    throw e;
  }
  return { order: result, paymentInit };
}

/** Antifraude: bloquea contraentrega a clientes con 2+ pedidos COD cancelados. */
async function assertCodAllowed(tx: Tx, userId: string) {
  const failed = await tx.order.count({
    where: { userId, status: "CANCELLED", payments: { some: { method: "COD" } } },
  });
  if (failed >= 2) throw forbidden("Contraentrega no disponible por pedidos fallidos anteriores");
}

/** Cancela el pedido y devuelve el stock reservado. Idempotente. */
export async function cancelOrder(tx: Tx, orderId: string) {
  const order = await tx.order.findUnique({
    where: { id: orderId },
    include: { subOrders: { include: { items: true } } },
  });
  if (!order || order.status === "CANCELLED") return;
  for (const so of order.subOrders) {
    if (so.status === "CANCELLED") continue;
    for (const it of so.items) {
      await tx.variant.update({ where: { id: it.variantId }, data: { stock: { increment: it.quantity } } });
    }
    await tx.subOrder.update({ where: { id: so.id }, data: { status: "CANCELLED" } });
  }
  await tx.order.update({ where: { id: orderId }, data: { status: "CANCELLED" } });
}

export async function listOrders(userId: string) {
  return db.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      payments: true,
      subOrders: { include: { items: true, brand: { select: { name: true, slug: true } } } },
    },
  });
}

export async function getOrder(userId: string, id: string) {
  const order = await db.order.findUnique({
    where: { id },
    include: {
      address: true,
      payments: true,
      subOrders: { include: { items: true, brand: { select: { name: true, slug: true } } } },
    },
  });
  if (!order || order.userId !== userId) throw notFound("Pedido no encontrado");
  return order;
}

export async function getOrderByNumber(userId: string, number: number) {
  const order = await db.order.findUnique({
    where: { number },
    include: {
      address: true,
      payments: true,
      subOrders: { include: { items: true, brand: { select: { name: true, slug: true } } } },
    },
  });
  if (!order || order.userId !== userId) throw notFound("Pedido no encontrado");
  return order;
}

/**
 * Cotiza el carrito sin escribir nada: misma lógica de envío por marca que `createOrder`.
 * Devuelve también problemas por variante (sin stock, no fresca, inactiva) para mostrarlos en la UI.
 */
export async function quoteCart(items: { variantId: string; quantity: number }[]) {
  const qtyByVariant = new Map<string, number>();
  for (const it of items) qtyByVariant.set(it.variantId, (qtyByVariant.get(it.variantId) ?? 0) + it.quantity);

  const variants = await db.variant.findMany({
    where: { id: { in: [...qtyByVariant.keys()] } },
    include: { product: { include: { brand: true } } },
  });

  const issues: { variantId: string; message: string }[] = [];
  for (const id of qtyByVariant.keys()) {
    if (!variants.some((v) => v.id === id)) issues.push({ variantId: id, message: "Este producto ya no existe" });
  }

  const byBrand = new Map<string, { brand: { id: string; name: string; slug: string; freeShippingFromCop: number | null }; subtotalCop: number }>();
  for (const v of variants) {
    const qty = qtyByVariant.get(v.id)!;
    if (!v.active || !v.product.active || v.product.brand.status !== "ACTIVE") {
      issues.push({ variantId: v.id, message: "No disponible" });
      continue;
    }
    if (!isFresh(v.roastedAt, v.maxFreshDays)) {
      issues.push({ variantId: v.id, message: "El lote superó su ventana de frescura" });
      continue;
    }
    if (v.stock < qty) issues.push({ variantId: v.id, message: `Solo quedan ${v.stock} unidades` });
    const b = v.product.brand;
    const entry = byBrand.get(b.id) ?? { brand: { id: b.id, name: b.name, slug: b.slug, freeShippingFromCop: b.freeShippingFromCop }, subtotalCop: 0 };
    entry.subtotalCop += v.priceCop * qty;
    byBrand.set(b.id, entry);
  }

  const brands = [...byBrand.values()].map(({ brand, subtotalCop }) => {
    const free = brand.freeShippingFromCop !== null && subtotalCop >= brand.freeShippingFromCop;
    return {
      ...brand,
      subtotalCop,
      shippingCop: free ? 0 : config.defaultShippingCop(),
      missingForFreeShippingCop: brand.freeShippingFromCop !== null && !free ? brand.freeShippingFromCop - subtotalCop : null,
    };
  });
  const subtotalCop = brands.reduce((s, b) => s + b.subtotalCop, 0);
  const shippingCop = brands.reduce((s, b) => s + b.shippingCop, 0);
  return {
    brands,
    subtotalCop,
    shippingCop,
    totalCop: subtotalCop + shippingCop,
    issues,
    codMaxTotalCop: config.codMaxTotalCop(),
  };
}

/** El cliente cancela mientras el pedido no haya sido pagado ni despachado. */
export async function cancelOwnOrder(userId: string, id: string) {
  await db.$transaction(async (tx) => {
    const order = await tx.order.findUnique({ where: { id }, include: { subOrders: true, payments: true } });
    if (!order || order.userId !== userId) throw notFound("Pedido no encontrado");
    const shipped = order.subOrders.some((s) => ["SHIPPED", "DELIVERED"].includes(s.status));
    if (shipped) throw conflict("ALREADY_SHIPPED", "El pedido ya fue despachado");
    if (order.status === "PAID" && order.payments.some((p) => p.method !== "COD"))
      throw conflict("ALREADY_PAID", "Pedido pagado: solicita la cancelación a soporte");
    await cancelOrder(tx, id);
    await tx.payment.updateMany({ where: { orderId: id, status: "PENDING" }, data: { status: "DECLINED" } });
  });
  return { ok: true };
}
