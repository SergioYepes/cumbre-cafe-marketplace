"use client";

import { useCart, type CartLine } from "./CartProvider";

/** Botón de compra rápida de la tarjeta de producto. */
export default function QuickAdd({ line, disabled }: { line: Omit<CartLine, "quantity"> | null; disabled?: boolean }) {
  const { add } = useCart();
  return (
    <button
      className="add"
      id={line ? `add-${line.variantId}` : undefined}
      disabled={disabled || !line}
      onClick={() => line && add(line)}
    >
      {disabled || !line ? "Agotado" : "+ Agregar"}
    </button>
  );
}
