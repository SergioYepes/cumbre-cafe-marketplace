import type { BrandStatus, SubOrderStatus } from "@prisma/client";
import { db } from "../db";
import { conflict, notFound } from "../errors";
import { addDays, config } from "../utils";

export const listBrandsAdmin = (status?: BrandStatus) =>
  db.brand.findMany({
    where: status ? { status } : {},
    orderBy: { createdAt: "desc" },
    include: { plan: true, owner: { select: { email: true, name: true, phone: true } } },
  });

export async function updateBrandAdmin(id: string, data: { status?: BrandStatus; planId?: string; dispatchHours?: number }) {
  const b = await db.brand.findUnique({ where: { id } });
  if (!b) throw notFound("Marca no encontrada");
  return db.brand.update({ where: { id }, data });
}

export const listPlans = () => db.brandPlan.findMany({ orderBy: { monthlyFeeCop: "asc" } });

export async function setCampaignActive(id: string, active: boolean) {
  return db.adCampaign.update({ where: { id }, data: { active } });
}

export const listCampaignsAdmin = () =>
  db.adCampaign.findMany({
    orderBy: [{ active: "asc" }, { startsAt: "desc" }],
    include: { brand: { select: { name: true, slug: true } } },
  });

/**
 * Genera liquidaciones por marca con los sub-pedidos ENTREGADOS aún sin liquidar
 * y fuera del periodo de garantía (`holdDays`).
 *
 * Cálculo:
 *  - Pago en línea: la plataforma cobró → debe a la marca (subtotal + envío − comisión).
 *  - Contraentrega: la marca ya cobró el efectivo → solo debe la comisión (resta del neto).
 *  `netCop` puede ser negativo (la marca debe saldo a la plataforma; se compensa en la siguiente).
 */
export async function generatePayouts(opts: { brandId?: string; holdDays?: number } = {}) {
  const hold = opts.holdDays ?? config.payoutHoldDays();
  const cutoff = addDays(new Date(), -hold);

  const pending = await db.subOrder.findMany({
    where: {
      status: "DELIVERED" as SubOrderStatus,
      payoutId: null,
      deliveredAt: { lte: cutoff },
      ...(opts.brandId ? { brandId: opts.brandId } : {}),
    },
    include: { order: { include: { payments: true } } },
  });

  const byBrand = new Map<string, typeof pending>();
  for (const s of pending) byBrand.set(s.brandId, [...(byBrand.get(s.brandId) ?? []), s]);

  const created = [];
  for (const [brandId, subs] of byBrand) {
    let gross = 0;
    let commission = 0;
    let net = 0;
    for (const s of subs) {
      const cod = s.order.payments.some((p) => p.method === "COD");
      commission += s.commissionCop;
      if (cod) {
        net -= s.commissionCop;
      } else {
        gross += s.subtotalCop + s.shippingCop;
        net += s.subtotalCop + s.shippingCop - s.commissionCop;
      }
    }
    const dates = subs.map((s) => s.deliveredAt!.getTime());
    const payout = await db.$transaction(async (tx) => {
      const p = await tx.payout.create({
        data: {
          brandId,
          periodStart: new Date(Math.min(...dates)),
          periodEnd: new Date(Math.max(...dates)),
          grossCop: gross,
          commissionCop: commission,
          netCop: net,
        },
      });
      await tx.subOrder.updateMany({ where: { id: { in: subs.map((s) => s.id) } }, data: { payoutId: p.id } });
      return p;
    });
    created.push(payout);
  }
  return created;
}

export const listPayouts = (status?: "PENDING" | "PAID") =>
  db.payout.findMany({
    where: status ? { status } : {},
    orderBy: { periodEnd: "desc" },
    include: { brand: { select: { name: true, nit: true } }, _count: { select: { subOrders: true } } },
  });

export async function markPayoutPaid(id: string) {
  const p = await db.payout.findUnique({ where: { id } });
  if (!p) throw notFound("Liquidación no encontrada");
  if (p.status === "PAID") throw conflict("ALREADY_PAID", "La liquidación ya fue pagada");
  return db.payout.update({ where: { id }, data: { status: "PAID", paidAt: new Date() } });
}

/** Métricas de plataforma para el panel de administración. */
export async function platformStats() {
  const [orders, gmv, brands, pendingBrands, payoutsPending] = await Promise.all([
    db.order.count({ where: { status: "PAID" } }),
    db.order.aggregate({ where: { status: "PAID" }, _sum: { totalCop: true } }),
    db.brand.count({ where: { status: "ACTIVE" } }),
    db.brand.count({ where: { status: "PENDING" } }),
    db.payout.aggregate({ where: { status: "PENDING" }, _sum: { netCop: true } }),
  ]);
  const commission = await db.subOrder.aggregate({
    where: { order: { status: "PAID" } },
    _sum: { commissionCop: true },
  });
  return {
    paidOrders: orders,
    gmvCop: gmv._sum.totalCop ?? 0,
    commissionCop: commission._sum.commissionCop ?? 0,
    activeBrands: brands,
    pendingBrands,
    payoutsPendingCop: payoutsPending._sum.netCop ?? 0,
  };
}
