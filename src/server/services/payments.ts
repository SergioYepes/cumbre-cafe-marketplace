import { createHash } from "node:crypto";
import type { Payment, PaymentMethod } from "@prisma/client";
import { db } from "../db";
import { badRequest } from "../errors";
import { cancelOrder } from "./orders";

export type PaymentInit =
  | { method: "COD"; paymentId: string; message: string }
  | {
      method: "WOMPI";
      paymentId: string;
      reference: string;
      amountInCents: number;
      currency: "COP";
      publicKey: string | null;
      integritySignature: string | null;
      redirectUrl: string;
      simulated: boolean;
    };

const SUPPORTED: PaymentMethod[] = ["WOMPI", "COD"]; // PAYU, BOLD, BREB: pendientes de integrar

/** Se llama ANTES de reservar stock para no tocar inventario con métodos no disponibles. */
export function assertMethodEnabled(method: PaymentMethod) {
  if (!SUPPORTED.includes(method)) throw badRequest("METHOD_NOT_ENABLED", `Método ${method} aún no habilitado`);
}

/** Prepara el cobro según el método. Para añadir PayU/Bold/Bre-B basta con un nuevo `case`. */
export async function initPayment(payment: Payment, orderNumber: number): Promise<PaymentInit> {
  assertMethodEnabled(payment.method);
  if (payment.method === "COD") {
    return {
      method: "COD",
      paymentId: payment.id,
      message: "Pagas en efectivo al recibir. Te contactaremos para confirmar el pedido.",
    };
  }

  // WOMPI: el widget/checkout necesita referencia, monto en centavos y firma de integridad
  const amountInCents = payment.amountCop * 100;
  const publicKey = process.env.WOMPI_PUBLIC_KEY || null;
  const secret = process.env.WOMPI_INTEGRITY_SECRET || null;
  const integritySignature = secret
    ? createHash("sha256").update(`${payment.id}${amountInCents}COP${secret}`).digest("hex")
    : null;

  await db.payment.update({ where: { id: payment.id }, data: { providerRef: payment.id } });
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return {
    method: "WOMPI",
    paymentId: payment.id,
    reference: payment.id,
    amountInCents,
    currency: "COP",
    publicKey,
    integritySignature,
    redirectUrl: `${base}/pedido/${orderNumber}`,
    simulated: !publicKey || !secret,
  };
}

// ───────── Webhooks Wompi ─────────

type WompiEvent = {
  event: string;
  data: { transaction: { id: string; status: string; reference: string; amount_in_cents: number } } & Record<string, unknown>;
  signature?: { properties: string[]; checksum: string };
  timestamp: number;
};

const getPath = (obj: unknown, path: string) =>
  path.split(".").reduce<unknown>((o, k) => (o as Record<string, unknown> | undefined)?.[k], obj);

export function verifyWompiSignature(evt: WompiEvent): boolean {
  const secret = process.env.WOMPI_EVENTS_SECRET;
  if (!secret) return process.env.NODE_ENV !== "production"; // en dev sin llaves se acepta (simulado)
  if (!evt.signature) return false;
  const concat =
    evt.signature.properties.map((p) => String(getPath(evt.data, p.replace(/^data\./, "")))).join("") +
    evt.timestamp +
    secret;
  return createHash("sha256").update(concat).digest("hex") === evt.signature.checksum;
}

/**
 * Procesa un evento de transacción. Idempotente: el mismo (id, estado) no se aplica dos veces.
 * APPROVED → pedido PAID. DECLINED/VOIDED/ERROR → pedido cancelado y stock devuelto.
 */
export async function processWompiEvent(evt: WompiEvent) {
  if (evt.event !== "transaction.updated") return { ignored: true };
  if (!verifyWompiSignature(evt)) throw badRequest("BAD_SIGNATURE", "Firma inválida");

  const t = evt.data.transaction;
  const externalId = `${t.id}:${t.status}`;

  try {
    await db.webhookEvent.create({ data: { provider: "WOMPI", externalId, payload: evt as object } });
  } catch {
    return { duplicate: true }; // ya procesado
  }

  const payment = await db.payment.findFirst({ where: { id: t.reference, method: "WOMPI" } });
  if (!payment) return { ignored: true, reason: "payment not found" };
  if (payment.amountCop * 100 !== t.amount_in_cents) throw badRequest("AMOUNT_MISMATCH", "Monto no coincide");

  await db.$transaction(async (tx) => {
    if (t.status === "APPROVED") {
      await tx.payment.update({ where: { id: payment.id }, data: { status: "APPROVED", providerRef: t.id } });
      await tx.order.update({ where: { id: payment.orderId }, data: { status: "PAID" } });
    } else if (["DECLINED", "VOIDED", "ERROR"].includes(t.status)) {
      await tx.payment.update({ where: { id: payment.id }, data: { status: "DECLINED", providerRef: t.id } });
      await cancelOrder(tx, payment.orderId);
    }
  });
  await db.webhookEvent.update({
    where: { provider_externalId: { provider: "WOMPI", externalId } },
    data: { processed: true },
  });
  return { processed: true, status: t.status };
}
