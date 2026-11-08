import type { GrindType, RoastLevel, SubOrderStatus } from "@prisma/client";
import { db } from "../db";
import { badRequest, conflict, forbidden, notFound } from "../errors";
import { slugify } from "../utils";

type VariantInput = {
  sku: string;
  weightGrams: number;
  grind?: GrindType;
  priceCop: number;
  stock: number;
  roastedAt?: Date;
  maxFreshDays?: number;
};

export type ProductInput = {
  name: string;
  description: string;
  imageUrl?: string;
  origin: string;
  farm?: string;
  altitudeMasl?: number;
  variety?: string;
  process?: string;
  roast: RoastLevel;
  tastingNotes?: string[];
  score?: number;
  variants: VariantInput[];
};

export const brandProducts = (brandId: string) =>
  db.product.findMany({ where: { brandId }, orderBy: { createdAt: "desc" }, include: { variants: true } });

export async function createProduct(brandId: string, input: ProductInput) {
  const { variants, ...data } = input;
  let slug = slugify(`${data.name}`);
  if (await db.product.findUnique({ where: { slug } })) slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`;
  return db.product.create({
    data: { ...data, tastingNotes: (data.tastingNotes ?? []).map((n) => n.toLowerCase()), brandId, slug, variants: { create: variants } },
    include: { variants: true },
  });
}

async function ownProduct(brandId: string, id: string) {
  const p = await db.product.findUnique({ where: { id } });
  if (!p || p.brandId !== brandId) throw notFound("Producto no encontrado");
  return p;
}

export async function updateProduct(brandId: string, id: string, data: Partial<Omit<ProductInput, "variants">> & { active?: boolean }) {
  await ownProduct(brandId, id);
  return db.product.update({ where: { id }, data });
}

export async function addVariant(brandId: string, productId: string, v: VariantInput) {
  await ownProduct(brandId, productId);
  return db.variant.create({ data: { ...v, productId } });
}

export async function updateVariant(
  brandId: string,
  id: string,
  data: { priceCop?: number; stock?: number; roastedAt?: Date; maxFreshDays?: number; active?: boolean },
) {
  const v = await db.variant.findUnique({ where: { id }, include: { product: true } });
  if (!v || v.product.brandId !== brandId) throw notFound("Variante no encontrada");
  return db.variant.update({ where: { id }, data });
}

/** Importación masiva (CSV ya parseado): upsert por SKU para actualizar precio/stock rápido. */
export async function bulkUpdateStock(brandId: string, rows: { sku: string; stock?: number; priceCop?: number }[]) {
  const results = { updated: 0, notFound: [] as string[] };
  for (const r of rows) {
    const v = await db.variant.findUnique({ where: { sku: r.sku }, include: { product: true } });
    if (!v || v.product.brandId !== brandId) {
      results.notFound.push(r.sku);
      continue;
    }
    await db.variant.update({ where: { id: v.id }, data: { stock: r.stock, priceCop: r.priceCop } });
    results.updated++;
  }
  return results;
}

// ───────── Cumplimiento de pedidos ─────────

export const brandSubOrders = (brandId: string, status?: SubOrderStatus) =>
  db.subOrder.findMany({
    where: { brandId, ...(status ? { status } : {}), order: { status: { not: "CANCELLED" } } },
    orderBy: { order: { createdAt: "desc" } },
    include: {
      items: true,
      order: {
        select: {
          number: true, createdAt: true, status: true,
          address: { select: { recipient: true, phone: true, department: true, city: true, line1: true, line2: true, notes: true } },
          payments: { select: { method: true, status: true } },
        },
      },
    },
  });

const FLOW: Record<SubOrderStatus, SubOrderStatus[]> = {
  PENDING: ["PREPARING", "CANCELLED"],
  PREPARING: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED", "RETURNED"],
  DELIVERED: ["RETURNED"],
  CANCELLED: [],
  RETURNED: [],
};

/**
 * Transiciones del sub-pedido por la marca.
 * Reglas: solo se prepara/despacha si el pedido está PAGADO o es contraentrega;
 * para despachar se exige transportadora y guía; al cancelar se devuelve el stock.
 */
export async function updateSubOrder(
  brandId: string,
  id: string,
  input: { status: SubOrderStatus; carrier?: string; trackingNumber?: string },
) {
  return db.$transaction(async (tx) => {
    const so = await tx.subOrder.findUnique({
      where: { id },
      include: { items: true, order: { include: { payments: true, subOrders: true } } },
    });
    if (!so || so.brandId !== brandId) throw notFound("Sub-pedido no encontrado");
    if (!FLOW[so.status].includes(input.status)) {
      throw conflict("BAD_TRANSITION", `No se puede pasar de ${so.status} a ${input.status}`);
    }

    const isCod = so.order.payments.some((p) => p.method === "COD");
    if (["PREPARING", "SHIPPED"].includes(input.status) && so.order.status !== "PAID" && !isCod) {
      throw forbidden("El pedido aún no está pagado");
    }
    if (input.status === "SHIPPED" && (!input.carrier || !input.trackingNumber)) {
      throw badRequest("TRACKING_REQUIRED", "Indica transportadora y número de guía");
    }

    const data: Record<string, unknown> = { status: input.status };
    if (input.status === "SHIPPED") Object.assign(data, { carrier: input.carrier, trackingNumber: input.trackingNumber, shippedAt: new Date() });
    if (input.status === "DELIVERED") data.deliveredAt = new Date();

    if (input.status === "CANCELLED") {
      for (const it of so.items) {
        await tx.variant.update({ where: { id: it.variantId }, data: { stock: { increment: it.quantity } } });
      }
    }
    const updated = await tx.subOrder.update({ where: { id }, data });

    // Contraentrega: cuando todo lo no cancelado fue entregado, el pago se confirma
    const siblings = so.order.subOrders.map((s) => (s.id === id ? input.status : s.status));
    const active = siblings.filter((s) => s !== "CANCELLED" && s !== "RETURNED");
    if (isCod && active.length > 0 && active.every((s) => s === "DELIVERED")) {
      await tx.payment.updateMany({ where: { orderId: so.orderId, method: "COD" }, data: { status: "APPROVED" } });
      await tx.order.update({ where: { id: so.orderId }, data: { status: "PAID" } });
    }
    if (siblings.every((s) => s === "CANCELLED")) {
      await tx.order.update({ where: { id: so.orderId }, data: { status: "CANCELLED" } });
    }
    return updated;
  });
}

// ───────── Liquidaciones y métricas ─────────

export const brandPayouts = (brandId: string) =>
  db.payout.findMany({ where: { brandId }, orderBy: { periodEnd: "desc" } });

export async function brandSummary(brandId: string) {
  const [delivered, pending, products] = await Promise.all([
    db.subOrder.aggregate({ where: { brandId, status: "DELIVERED" }, _sum: { subtotalCop: true, commissionCop: true }, _count: true }),
    db.subOrder.count({ where: { brandId, status: { in: ["PENDING", "PREPARING"] }, order: { status: { not: "CANCELLED" } } } }),
    db.product.count({ where: { brandId } }),
  ]);
  return {
    deliveredOrders: delivered._count,
    salesCop: delivered._sum.subtotalCop ?? 0,
    commissionCop: delivered._sum.commissionCop ?? 0,
    pendingToShip: pending,
    products,
  };
}

// ───────── Publicidad ─────────

export async function createCampaign(
  brandId: string,
  data: { placement: "HOME_BANNER" | "CATEGORY_FEATURED" | "SPONSORED_PRODUCT"; productId?: string; priceCop: number; startsAt: Date; endsAt: Date },
) {
  if (data.endsAt <= data.startsAt) throw badRequest("BAD_DATES", "La fecha final debe ser posterior a la inicial");
  if (data.placement === "SPONSORED_PRODUCT") {
    if (!data.productId) throw badRequest("PRODUCT_REQUIRED", "Selecciona el producto a patrocinar");
    await ownProduct(brandId, data.productId);
  }
  // Nace inactiva: el admin la activa tras confirmar el pago de la campaña
  return db.adCampaign.create({ data: { ...data, brandId, active: false } });
}

export const brandCampaigns = (brandId: string) =>
  db.adCampaign.findMany({ where: { brandId }, orderBy: { startsAt: "desc" } });
