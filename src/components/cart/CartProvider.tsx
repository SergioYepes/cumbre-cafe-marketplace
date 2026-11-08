"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, useSyncExternalStore } from "react";

export type CartLine = {
  variantId: string;
  quantity: number;
  // Snapshot para pintar el carrito sin pedir al servidor; el precio real se recalcula al cotizar
  productSlug: string;
  productName: string;
  brandName: string;
  weightGrams: number;
  grind: string;
  priceCop: number;
  image: string;
};

type CartCtx = {
  lines: CartLine[];
  count: number;
  ready: boolean;
  add: (line: Omit<CartLine, "quantity">, qty?: number) => void;
  setQty: (variantId: string, qty: number) => void;
  remove: (variantId: string) => void;
  clear: () => void;
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
};

const KEY = "cumbre.cart.v1";
const Ctx = createContext<CartCtx | null>(null);

const subscribeNoop = () => () => {};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  // true solo en el cliente: evita desajustes de hidratación al leer localStorage
  const hydrated = useSyncExternalStore(subscribeNoop, () => true, () => false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- sincroniza estado con localStorage al montar
      if (raw) setLines(JSON.parse(raw));
    } catch {
      /* carrito corrupto: se ignora */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(KEY, JSON.stringify(lines));
  }, [lines, loaded]);

  const add = useCallback((line: Omit<CartLine, "quantity">, qty = 1) => {
    setLines((prev) => {
      const found = prev.find((l) => l.variantId === line.variantId);
      if (found) return prev.map((l) => (l.variantId === line.variantId ? { ...l, ...line, quantity: Math.min(24, l.quantity + qty) } : l));
      return [...prev, { ...line, quantity: qty }];
    });
    setDrawerOpen(true);
  }, []);

  const setQty = useCallback((variantId: string, qty: number) => {
    setLines((prev) => (qty <= 0 ? prev.filter((l) => l.variantId !== variantId) : prev.map((l) => (l.variantId === variantId ? { ...l, quantity: Math.min(24, qty) } : l))));
  }, []);

  const remove = useCallback((variantId: string) => setLines((prev) => prev.filter((l) => l.variantId !== variantId)), []);
  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartCtx>(
    () => ({
      lines,
      count: lines.reduce((s, l) => s + l.quantity, 0),
      ready: hydrated && loaded,
      add,
      setQty,
      remove,
      clear,
      drawerOpen,
      openDrawer: () => setDrawerOpen(true),
      closeDrawer: () => setDrawerOpen(false),
    }),
    [lines, hydrated, loaded, add, setQty, remove, clear, drawerOpen],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart fuera de CartProvider");
  return c;
}
