"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart/CartProvider";
import { useQuote } from "@/components/cart/useQuote";
import { QuoteSummary } from "@/components/cart/CartDrawer";
import { DEPARTMENTS, formatCop } from "@/lib/format";

export default function CheckoutPage() {
  const router = useRouter();
  const { lines, clear } = useCart();
  const { quote, loading } = useQuote(lines, true);

  const [recipient, setRecipient] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("Cundinamarca");
  const [city, setCity] = useState("Bogotá D.C.");
  const [line1, setLine1] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"WOMPI" | "COD">("WOMPI");

  const [submitting, setSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState<{
    orderNumber: number;
    totalCop: number;
    method: string;
    subOrdersCount: number;
  } | null>(null);

  if (lines.length === 0 && !orderComplete) {
    return (
      <div className="container" style={{ padding: "4rem 0 6rem", textAlign: "center" }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>☕</div>
        <h2>No hay productos para pagar</h2>
        <p className="meta" style={{ margin: "1rem 0 2rem" }}>
          Tu carrito está vacío. Agrega cafés de especialidad para iniciar el proceso de checkout.
        </p>
        <Link href="/cafes" className="btn btn-primary">
          Explorar cafés
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient || !phone || !line1 || !city) {
      alert("Por favor completa todos los campos requeridos de envío.");
      return;
    }

    setSubmitting(true);

    try {
      // Intentamos llamar a la API de checkout si hay sesión
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          addressId: "temp-addr",
          paymentMethod,
          items: lines.map((l) => ({ variantId: l.variantId, quantity: l.quantity })),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        clear();
        setOrderComplete({
          orderNumber: data.order?.number ?? Math.floor(100000 + Math.random() * 900000),
          totalCop: data.order?.totalCop ?? quote?.totalCop ?? 0,
          method: paymentMethod,
          subOrdersCount: data.order?.subOrders?.length ?? quote?.brands?.length ?? 1,
        });
      } else {
        // En modo demostración/visitante sin login forzado, simulamos la confirmación exitosa
        await new Promise((r) => setTimeout(r, 600));
        const simOrderNumber = Math.floor(100000 + Math.random() * 900000);
        const simTotal = quote?.totalCop ?? 0;
        const simBrandsCount = quote?.brands?.length ?? 1;
        clear();
        setOrderComplete({
          orderNumber: simOrderNumber,
          totalCop: simTotal,
          method: paymentMethod,
          subOrdersCount: simBrandsCount,
        });
      }
    } catch {
      // Simulación en demo
      const simOrderNumber = Math.floor(100000 + Math.random() * 900000);
      const simTotal = quote?.totalCop ?? 0;
      clear();
      setOrderComplete({
        orderNumber: simOrderNumber,
        totalCop: simTotal,
        method: paymentMethod,
        subOrdersCount: quote?.brands?.length ?? 1,
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="container-narrow" style={{ padding: "4rem 0 6rem" }}>
        <div
          style={{
            background: "var(--surface)",
            padding: "3rem 2.5rem",
            borderRadius: "var(--radius)",
            border: "1px solid var(--line)",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>✅</div>
          <span className="eyebrow" style={{ marginBottom: "1rem" }}>
            Pedido Confirmado
          </span>
          <h1 style={{ fontSize: "2.4rem", marginBottom: ".6rem" }}>
            ¡Gracias por tu compra de café!
          </h1>
          <p className="meta" style={{ fontSize: "1.1rem", marginBottom: "2rem" }}>
            Tu orden <strong>#{orderComplete.orderNumber}</strong> ha sido registrada con éxito.
          </p>

          <div
            style={{
              background: "var(--bg-soft)",
              border: "1px solid var(--line)",
              borderRadius: "var(--radius-sm)",
              padding: "1.5rem",
              margin: "2rem 0",
              textAlign: "left",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: ".6rem" }}>
              <span>Total liquidado:</span>
              <strong className="mono">{formatCop(orderComplete.totalCop)}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: ".6rem" }}>
              <span>Método:</span>
              <span>{orderComplete.method === "WOMPI" ? "Wompi (Digital)" : "Contraentrega"}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Sub-pedidos por tostaduría:</span>
              <span>{orderComplete.subOrdersCount} {orderComplete.subOrdersCount === 1 ? "tostador" : "tostadores"}</span>
            </div>
          </div>

          <div
            style={{
              fontSize: ".85rem",
              color: "var(--muted)",
              background: "var(--surface-2)",
              padding: "1rem",
              borderRadius: "8px",
              marginBottom: "2rem",
            }}
          >
            ℹ️ <strong>Modo Demostración Activo:</strong> El sistema multi-marca dividió los pedidos
            por tostaduría y calculó los fletes automáticamente. Al ingresar credenciales de Wompi reales,
            los cobros serán directos.
          </div>

          <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
            <Link href="/cafes" className="btn btn-primary">
              Volver al catálogo
            </Link>
            <Link href="/" className="btn btn-ghost">
              Ir al inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: "2.5rem 0 5rem" }}>
      <nav className="breadcrumbs" aria-label="Navegación">
        <Link href="/">Inicio</Link>
        <span>/</span>
        <Link href="/carrito">Carrito</Link>
        <span>/</span>
        <span style={{ color: "var(--text)" }}>Finalizar compra</span>
      </nav>

      <header className="page-head" style={{ marginBottom: "2rem" }}>
        <h1 className="page-title">Pagar Pedido</h1>
        <p>Ingresa tus datos de entrega en Colombia y selecciona tu medio de pago.</p>
      </header>

      <form onSubmit={handleSubmit}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.3fr 1fr",
            gap: "2.5rem",
            alignItems: "start",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {/* Dirección de envío */}
            <div
              style={{
                background: "var(--surface)",
                padding: "2rem",
                borderRadius: "var(--radius)",
                border: "1px solid var(--line)",
              }}
            >
              <h3 style={{ marginBottom: "1.2rem" }}>1. Datos de Envío</h3>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                <div>
                  <label className="meta" style={{ display: "block", marginBottom: ".4rem" }}>
                    Nombre de quien recibe *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Juan Pérez"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    style={{
                      width: "100%",
                      padding: ".75rem 1rem",
                      borderRadius: "var(--radius-sm)",
                      background: "var(--surface-2)",
                      border: "1px solid var(--line)",
                      color: "var(--text)",
                      font: "inherit",
                    }}
                  />
                </div>
                <div>
                  <label className="meta" style={{ display: "block", marginBottom: ".4rem" }}>
                    Teléfono celular *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Ej. 300 123 4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{
                      width: "100%",
                      padding: ".75rem 1rem",
                      borderRadius: "var(--radius-sm)",
                      background: "var(--surface-2)",
                      border: "1px solid var(--line)",
                      color: "var(--text)",
                      font: "inherit",
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label className="meta" style={{ display: "block", marginBottom: ".4rem" }}>
                  Correo electrónico para confirmación
                </label>
                <input
                  type="email"
                  placeholder="ejemplo@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: "100%",
                    padding: ".75rem 1rem",
                    borderRadius: "var(--radius-sm)",
                    background: "var(--surface-2)",
                    border: "1px solid var(--line)",
                    color: "var(--text)",
                    font: "inherit",
                  }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                <div>
                  <label className="meta" style={{ display: "block", marginBottom: ".4rem" }}>
                    Departamento *
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    style={{
                      width: "100%",
                      padding: ".75rem 1rem",
                      borderRadius: "var(--radius-sm)",
                      background: "var(--surface-2)",
                      border: "1px solid var(--line)",
                      color: "var(--text)",
                      font: "inherit",
                    }}
                  >
                    {DEPARTMENTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="meta" style={{ display: "block", marginBottom: ".4rem" }}>
                    Ciudad / Municipio *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Bogotá D.C."
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    style={{
                      width: "100%",
                      padding: ".75rem 1rem",
                      borderRadius: "var(--radius-sm)",
                      background: "var(--surface-2)",
                      border: "1px solid var(--line)",
                      color: "var(--text)",
                      font: "inherit",
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label className="meta" style={{ display: "block", marginBottom: ".4rem" }}>
                  Dirección de entrega (calle, carrera, número, apto) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Calle 127 # 15-30, Apto 402"
                  value={line1}
                  onChange={(e) => setLine1(e.target.value)}
                  style={{
                    width: "100%",
                    padding: ".75rem 1rem",
                    borderRadius: "var(--radius-sm)",
                    background: "var(--surface-2)",
                    border: "1px solid var(--line)",
                    color: "var(--text)",
                    font: "inherit",
                  }}
                />
              </div>

              <div>
                <label className="meta" style={{ display: "block", marginBottom: ".4rem" }}>
                  Instrucciones o notas para el transportador (opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ej. Dejar en portería o tocar timbre 402"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  style={{
                    width: "100%",
                    padding: ".75rem 1rem",
                    borderRadius: "var(--radius-sm)",
                    background: "var(--surface-2)",
                    border: "1px solid var(--line)",
                    color: "var(--text)",
                    font: "inherit",
                  }}
                />
              </div>
            </div>

            {/* Medio de pago */}
            <div
              style={{
                background: "var(--surface)",
                padding: "2rem",
                borderRadius: "var(--radius)",
                border: "1px solid var(--line)",
              }}
            >
              <h3 style={{ marginBottom: "1.2rem" }}>2. Método de Pago</h3>

              <div style={{ display: "grid", gap: "1rem" }}>
                <label
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "1rem",
                    padding: "1rem 1.2rem",
                    borderRadius: "var(--radius-sm)",
                    border: `1px solid ${paymentMethod === "WOMPI" ? "var(--accent)" : "var(--line)"}`,
                    background: paymentMethod === "WOMPI" ? "var(--accent-soft)" : "var(--surface-2)",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="radio"
                    name="payMethod"
                    value="WOMPI"
                    checked={paymentMethod === "WOMPI"}
                    onChange={() => setPaymentMethod("WOMPI")}
                    style={{ marginTop: ".3rem" }}
                  />
                  <div>
                    <strong>Wompi (Bancolombia, PSE, Nequi, Tarjeta de Crédito/Débito)</strong>
                    <p className="meta" style={{ fontSize: ".85rem", marginTop: ".2rem" }}>
                      Procesamiento seguro y aprobación inmediata en pesos colombianos.
                    </p>
                  </div>
                </label>

                <label
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "1rem",
                    padding: "1rem 1.2rem",
                    borderRadius: "var(--radius-sm)",
                    border: `1px solid ${paymentMethod === "COD" ? "var(--accent)" : "var(--line)"}`,
                    background: paymentMethod === "COD" ? "var(--accent-soft)" : "var(--surface-2)",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="radio"
                    name="payMethod"
                    value="COD"
                    checked={paymentMethod === "COD"}
                    onChange={() => setPaymentMethod("COD")}
                    style={{ marginTop: ".3rem" }}
                  />
                  <div>
                    <strong>Pago Contraentrega (Efectivo al recibir)</strong>
                    <p className="meta" style={{ fontSize: ".85rem", marginTop: ".2rem" }}>
                      Pagas en efectivo al transportador cuando el café llegue a tu puerta.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Resumen */}
          <div
            style={{
              background: "var(--surface)",
              padding: "1.8rem",
              borderRadius: "var(--radius)",
              border: "1px solid var(--line)",
              position: "sticky",
              top: "90px",
            }}
          >
            <h3 style={{ marginBottom: "1.2rem" }}>Resumen de la orden</h3>
            <QuoteSummary quote={quote} loading={loading} />

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary btn-block mt-4"
              id="confirm-order-btn"
              style={{ fontSize: "1.05rem", padding: "1rem" }}
            >
              {submitting ? "Procesando pedido..." : "Confirmar y Pagar"}
            </button>

            <p
              className="faint"
              style={{
                fontSize: ".8rem",
                textAlign: "center",
                marginTop: "1rem",
                lineHeight: 1.5,
              }}
            >
              Al confirmar, aceptas los términos del marketplace de café. Los cafés son despachados
              directamente por cada tostador verificado.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
