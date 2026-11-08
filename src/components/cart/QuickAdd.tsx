"use client";

import { useCart, type CartLine } from "./CartProvider";

/** Botón compacto "Añadir" de la tarjeta: agrega la variante más económica disponible. */
export default function QuickAdd({ line, disabled }: { line: Omit<CartLine, "quantity"> | null; disabled?: boolean }) {
  const { add } = useCart();
  return (
    <button
      className="add"
      id={line ? `add-${line.variantId}` : undefined}
      disabled={disabled || !line}
      onClick={() => line && add(line)}
    >
      {disabled || !line ? "Agotado" : "Añadir"}
    </button>
  );
}
