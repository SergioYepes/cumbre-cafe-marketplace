"use client";

import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import { useQuote } from "@/components/cart/useQuote";
import { CartLineRow, QuoteSummary } from "@/components/cart/CartDrawer";

export default function CartPage() {
  const { lines, clear } = useCart();
  const { quote, loading } = useQuote(lines, true);
  const issues = new Map(quote?.issues.map((i) => [i.variantId, i.message]));

  return (
    <div className="container" style={{ padding: "2.5rem 0 5rem" }}>
      <nav className="breadcrumbs" aria-label="Navegación">
        <Link href="/">Inicio</Link>
        <span>/</span>
        <span style={{ color: "var(--text)" }}>Carrito de compras</span>
      </nav>

      <header className="page-head" style={{ marginBottom: "2rem" }}>
        <h1 className="page-title">Tu Carrito de Café</h1>
        <p>Revisa tus cafés seleccionados antes de proceder al pago seguro.</p>
      </header>

      {lines.length === 0 ? (
        <div
          className="empty"
          style={{
            textAlign: "center",
            padding: "5rem 2rem",
            background: "var(--surface)",
            borderRadius: "var(--radius)",
            border: "1px solid var(--line)",
            maxWidth: 600,
            margin: "0 auto",
          }}
        >
          <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>☕</div>
          <h2>Tu carrito está vacío</h2>
          <p className="meta" style={{ margin: ".8rem 0 1.8rem" }}>
            Aún no has añadido cafés a tu pedido. Descubre lotes frescos de los mejores tostadores.
          </p>
          <Link href="/cafes" className="btn btn-primary">
            Explorar cafés colombianos
          </Link>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr",
            gap: "2.5rem",
            alignItems: "start",
          }}
        >
          <div
            style={{
              background: "var(--surface)",
              borderRadius: "var(--radius)",
              padding: "1.8rem",
              border: "1px solid var(--line)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem",
                paddingBottom: "1rem",
                borderBottom: "1px solid var(--line)",
              }}
            >
              <h3>Cafés en el pedido ({lines.reduce((s, l) => s + l.quantity, 0)})</h3>
              <button
                onClick={clear}
                className="btn-link"
                style={{ fontSize: ".85rem", color: "var(--bad)" }}
              >
                Vaciar carrito
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {lines.map((line) => (
                <CartLineRow key={line.variantId} line={line} issue={issues.get(line.variantId)} />
              ))}
            </div>
          </div>

          <div
            style={{
              background: "var(--surface)",
              borderRadius: "var(--radius)",
              padding: "1.8rem",
              border: "1px solid var(--line)",
              position: "sticky",
              top: "90px",
            }}
          >
            <h3 style={{ marginBottom: "1.2rem" }}>Resumen del Pedido</h3>
            <QuoteSummary quote={quote} loading={loading} />

            <div style={{ marginTop: "1.8rem", display: "flex", flexDirection: "column", gap: ".8rem" }}>
              <Link href="/checkout" className="btn btn-primary btn-block" id="proceed-checkout-btn">
                Continuar con el pago →
              </Link>
              <Link href="/cafes" className="btn btn-ghost btn-block btn-sm">
                Seguir explorando
              </Link>
            </div>

            <div
              style={{
                marginTop: "1.8rem",
                paddingTop: "1.2rem",
                borderTop: "1px solid var(--line)",
                fontSize: ".82rem",
                color: "var(--faint)",
                lineHeight: 1.5,
              }}
            >
              🔒 Pagos procesados de forma segura con encriptación de 256 bits. Soportamos Wompi, PSE, Nequi, tarjeta y contraentrega.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
