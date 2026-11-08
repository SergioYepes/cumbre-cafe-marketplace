import type { SubscriptionFrequency } from "@prisma/client";
import { db } from "../db";
import { conflict, notFound } from "../errors";
import { addDays } from "../utils";
import { createOrder } from "./orders";

const DAYS: Record<SubscriptionFrequency, number> = { WEEKLY: 7, BIWEEKLY: 14, MONTHLY: 30 };

export async function createSubscription(
  userId: string,
  data: { variantId: string; addressId: string; frequency: SubscriptionFrequency; paymentToken?: string },
) {
  const [variant, address] = await Promise.all([
    db.variant.findUnique({ where: { id: data.variantId }, include: { product: { include: { brand: true } } } }),
    db.address.findUnique({ where: { id: data.addressId } }),
  ]);
  if (!variant || !variant.active || variant.product.brand.status !== "ACTIVE") throw notFound("Producto no disponible");
  if (!address || address.userId !== userId) throw notFound("Dirección no encontrada");
  return db.subscription.create({
    data: { ...data, userId, nextChargeAt: addDays(new Date(), DAYS[data.frequency]) },
  });
}

export const listSubscriptions = (userId: string) =>
  db.subscription.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { variant: { include: { product: { select: { name: true, slug: true, brand: { select: { name: true } } } } } } },
  });

export async function updateSubscription(
  userId: string,
  id: string,
  action: "pause" | "resume" | "cancel" | { frequency: SubscriptionFrequency },
) {
  const s = await db.subscription.findUnique({ where: { id } });
  if (!s || s.userId !== userId) throw notFound("Suscripción no encontrada");
  if (s.status === "CANCELLED") throw conflict("CANCELLED", "La suscripción está cancelada");
  if (action === "pause") return db.subscription.update({ where: { id }, data: { status: "PAUSED" } });
  if (action === "cancel") return db.subscription.update({ where: { id }, data: { status: "CANCELLED" } });
  if (action === "resume")
    return db.subscription.update({ where: { id }, data: { status: "ACTIVE", nextChargeAt: addDays(new Date(), DAYS[s.frequency]) } });
  return db.subscription.update({ where: { id }, data: { frequency: action.frequency } });
}

/**
 * Job (cron): genera el pedido de cada suscripción vencida.
 * El pedido queda PENDING_PAYMENT con pago Wompi pendiente.
 * TODO (al integrar Wompi real): cobrar automáticamente con `paymentToken` (payment_source) vía API de transacciones.
 * Si el producto no está disponible (stock/frescura/marca) se omite y se reintenta en el próximo ciclo del job.
 */
export async function processDueSubscriptions(now = new Date()) {
  const due = await db.subscription.findMany({ where: { status: "ACTIVE", nextChargeAt: { lte: now } } });
  const report = { created: 0, skipped: [] as { id: string; reason: string }[] };
  for (const s of due) {
    try {
      await createOrder(s.userId, {
        addressId: s.addressId,
        paymentMethod: "WOMPI",
        items: [{ variantId: s.variantId, quantity: 1 }],
      });
      await db.subscription.update({ where: { id: s.id }, data: { nextChargeAt: addDays(now, DAYS[s.frequency]) } });
      report.created++;
    } catch (e) {
      report.skipped.push({ id: s.id, reason: e instanceof Error ? e.message : "error" });
    }
  }
  return report;
}
