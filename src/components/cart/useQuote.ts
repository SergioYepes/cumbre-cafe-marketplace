"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { CartLine } from "./CartProvider";

export type Quote = {
  brands: { id: string; name: string; slug: string; subtotalCop: number; shippingCop: number; freeShippingFromCop: number | null; missingForFreeShippingCop: number | null }[];
  subtotalCop: number;
  shippingCop: number;
  totalCop: number;
  issues: { variantId: string; message: string }[];
  codMaxTotalCop: number;
};

/** Cotiza el carrito en el servidor (envío por marca, stock, frescura) cada vez que cambia. */
export function useQuote(lines: CartLine[], enabled = true) {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(false);
  const key = lines.map((l) => `${l.variantId}:${l.quantity}`).join("|");

  useEffect(() => {
    if (!enabled) return;
    if (!key) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reinicia la cotización al vaciar el carrito
      setQuote(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    const t = setTimeout(() => {
      const items = key.split("|").map((s) => {
        const [variantId, q] = s.split(":");
        return { variantId, quantity: Number(q) };
      });
      api<Quote>("/api/checkout/quote", { body: { items } })
        .then((q) => !cancelled && setQuote(q))
        .catch(() => !cancelled && setQuote(null))
        .finally(() => !cancelled && setLoading(false));
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [key, enabled]);

  return { quote, loading };
}
