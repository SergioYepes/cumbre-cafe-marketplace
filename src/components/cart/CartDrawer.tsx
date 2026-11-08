"use client";

import Link from "next/link";
import { useEffect } from "react";
import { formatCop, GRIND_LABEL } from "@/lib/format";
import { useCart, type CartLine } from "./CartProvider";
import { useQuote, type Quote } from "./useQuote";
import { CloseIcon } from "../Icons";

export function CartLineRow({ line, issue }: { line: CartLine; issue?: string }) {
  const { setQty, remove } = useCart();
  return (
    <div className="line">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={line.image} alt="" />
      <div>
        <span className="brand-name">{line.brandName}</span>
        <h4>
          <Link href={`/cafes/${line.productSlug}`}>{line.productName}</Link>
        </h4>
        <span className="meta">
          {line.weightGrams} g · {GRIND_LABEL[line.grind] ?? line.grind}
        </span>
        {issue && <div className="text-bad" style={{ fontSize: ".8rem", marginTop: ".2rem" }}>⚠ {issue}</div>}
      </div>
      <div className="line-actions">
        <strong className="mono">{formatCop(line.priceCop * line.quantity)}</strong>
        <div className="qty qty-sm">
          <button aria-label="Quitar uno" onClick={() => setQty(line.variantId, line.quantity - 1)}>−</button>
          <span>{line.quantity}</span>
          <button aria-label="Añadir uno" onClick={() => setQty(line.variantId, line.quantity + 1)}>+</button>
        </div>
        <button className="remove" onClick={() => remove(line.variantId)}>Eliminar</button>
      </div>
    </div>
  );
}

export function QuoteSummary({ quote, loading }: { quote: Quote | null; loading: boolean }) {
  if (!quote) return <div className="skeleton" style={{ height: 90 }} />;
  return (
    <div className="summary" style={{ opacity: loading ? 0.6 : 1, transition: "opacity .2s" }}>
      <div className="row"><span>Subtotal</span><strong className="mono">{formatCop(quote.subtotalCop)}</strong></div>
      {quote.brands.map((b) => (
        <div key={b.id}>
          <div className="row">
            <span>Envío · {b.name}</span>
            <strong className="mono">{b.shippingCop === 0 ? <span className="text-good">Gratis</span> : formatCop(b.shippingCop)}</strong>
          </div>
          {b.missingForFreeShippingCop !== null && b.freeShippingFromCop && (
            <div style={{ fontSize: ".78rem", color: "var(--faint)", marginTop: ".2rem" }}>
              Te faltan {formatCop(b.missingForFreeShippingCop)} para envío gratis
              <div className="ship-progress"><i style={{ width: `${Math.min(100, (b.subtotalCop / b.freeShippingFromCop) * 100)}%` }} /></div>
            </div>
          )}
        </div>
      ))}
      <div className="row total"><span>Total</span><strong className="mono">{formatCop(quote.totalCop)}</strong></div>
    </div>
  );
}

export default function CartDrawer() {
  const { lines, drawerOpen, closeDrawer } = useCart();
  const { quote, loading } = useQuote(lines, drawerOpen);

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeDrawer();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [drawerOpen, closeDrawer]);

  if (!drawerOpen) return null;
  const issues = new Map(quote?.issues.map((i) => [i.variantId, i.message]));

  return (
    <>
      <div className="drawer-backdrop" onClick={closeDrawer} />
      <aside className="drawer" role="dialog" aria-label="Carrito" id="cart-drawer">
        <div className="drawer-head">
          <h2>Tu carrito</h2>
          <button className="icon-btn" onClick={closeDrawer} aria-label="Cerrar carrito"><CloseIcon /></button>
        </div>
        <div className="drawer-body">
          {lines.length === 0 ? (
            <div className="empty">
              <div className="big">☕</div>
              <h3>Tu carrito está vacío</h3>
              <p>Explora cafés de origen de tostadores colombianos.</p>
              <Link href="/cafes" className="btn btn-primary mt-3" onClick={closeDrawer}>Explorar cafés</Link>
            </div>
          ) : (
            lines.map((l) => <CartLineRow key={l.variantId} line={l} issue={issues.get(l.variantId)} />)
          )}
        </div>
        {lines.length > 0 && (
          <div className="drawer-foot">
            <QuoteSummary quote={quote} loading={loading} />
            <Link href="/checkout" className="btn btn-primary btn-block" id="drawer-checkout" onClick={closeDrawer}>
              Ir a pagar
            </Link>
            <Link href="/carrito" className="btn btn-ghost btn-block btn-sm" onClick={closeDrawer}>Ver carrito</Link>
          </div>
        )}
      </aside>
    </>
  );
}
