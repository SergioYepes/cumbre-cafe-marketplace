"use client";

import { useState } from "react";
import Link from "next/link";

export default function VenderPage() {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");
  const [nit, setNit] = useState("");
  const [invima, setInvima] = useState("");
  const [story, setStory] = useState("");
  const [plan, setPlan] = useState("Basico");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simular registro / llamada a API
    await new Promise((r) => setTimeout(r, 600));
    setSubmitted(true);
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="container-narrow" style={{ padding: "5rem 0 7rem", textAlign: "center" }}>
        <div
          style={{
            background: "var(--surface)",
            padding: "3.5rem 2.5rem",
            borderRadius: "var(--radius)",
            border: "1px solid var(--line)",
          }}
        >
          <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>🌱☕</div>
          <span className="eyebrow" style={{ marginBottom: "1rem" }}>
            Solicitud Recibida
          </span>
          <h1 style={{ fontSize: "2.3rem", marginBottom: ".8rem" }}>
            ¡Gracias por querer formar parte de Cumbre!
          </h1>
          <p className="meta" style={{ fontSize: "1.05rem", marginBottom: "2rem" }}>
            Hemos recibido el registro para la marca <strong>{name}</strong> ({city}). Nuestro
            equipo de curaduría de café revisará tus datos y se pondrá en contacto al correo{" "}
            <strong>{email}</strong> en menos de 24 horas hábiles.
          </p>

          <div
            style={{
              background: "var(--bg-soft)",
              padding: "1.2rem",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--line)",
              fontSize: ".85rem",
              color: "var(--muted)",
              marginBottom: "2rem",
            }}
          >
            📋 <strong>Próximos pasos:</strong> Te enviaremos una guía para cargar tus lotes,
            configurar tus tiempos de tueste y SLA de despacho directo.
          </div>

          <Link href="/" className="btn btn-primary">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: "2.5rem 0 5rem" }}>
      <nav className="breadcrumbs" aria-label="Navegación">
        <Link href="/">Inicio</Link>
        <span>/</span>
        <span style={{ color: "var(--text)" }}>Vende en Cumbre</span>
      </nav>

      <header className="page-head" style={{ textAlign: "center", maxWidth: 750, margin: "0 auto 3.5rem" }}>
        <span className="eyebrow">Para Tostadores y Familias Productoras</span>
        <h1 className="page-title">Vende tu Café de Especialidad en Cumbre</h1>
        <p>
          Conéctate directamente con miles de entusiastas del buen café en Colombia. Tú seleccionas,
          tuestas y despachas; nosotros nos encargamos de los pagos, la tecnología y el alcance de tu marca.
        </p>
      </header>

      {/* Propuesta de valor */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1.5rem",
          marginBottom: "4rem",
        }}
      >
        <div style={{ background: "var(--surface)", padding: "1.8rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--line)" }}>
          <strong style={{ fontSize: "1.2rem", color: "var(--accent)", display: "block", marginBottom: ".4rem" }}>
            📦 Despacho directo
          </strong>
          <p className="meta">
            El café no se almacena en bodegas centrales. El cliente recibe tu grano fresco, tostado días antes de ser enviado.
          </p>
        </div>

        <div style={{ background: "var(--surface)", padding: "1.8rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--line)" }}>
          <strong style={{ fontSize: "1.2rem", color: "var(--accent)", display: "block", marginBottom: ".4rem" }}>
            💳 Pagos y recaudo seguro
          </strong>
          <p className="meta">
            Aceptamos Wompi, PSE, tarjetas de crédito, débito, Nequi y contraentrega sin complicaciones técnicas para ti.
          </p>
        </div>

        <div style={{ background: "var(--surface)", padding: "1.8rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--line)" }}>
          <strong style={{ fontSize: "1.2rem", color: "var(--accent)", display: "block", marginBottom: ".4rem" }}>
            📊 Liquidaciones periódicas
          </strong>
          <p className="meta">
            Portal propio para gestionar tus inventarios, ver órdenes en tiempo real y recibir transferencias periódicas transparentes.
          </p>
        </div>
      </div>

      {/* Formulario */}
      <div className="container-narrow">
        <div
          style={{
            background: "var(--surface)",
            padding: "2.5rem",
            borderRadius: "var(--radius)",
            border: "1px solid var(--line)",
          }}
        >
          <h2 style={{ fontSize: "1.8rem", marginBottom: ".5rem" }}>Registrar mi Tostaduría o Finca</h2>
          <p className="meta" style={{ marginBottom: "2rem" }}>
            Completa la información básica para iniciar el proceso de verificación.
          </p>

          <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1.2rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label className="meta" style={{ display: "block", marginBottom: ".4rem" }}>
                  Nombre de la marca o finca *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Café Finca Los Andes"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                  Ciudad / Municipio sede *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Manizales, Caldas"
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

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label className="meta" style={{ display: "block", marginBottom: ".4rem" }}>
                  Correo de contacto comercial *
                </label>
                <input
                  type="email"
                  required
                  placeholder="contacto@mimarca.co"
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

              <div>
                <label className="meta" style={{ display: "block", marginBottom: ".4rem" }}>
                  NIT o Cédula tributaria
                </label>
                <input
                  type="text"
                  placeholder="Ej. 901234567-1"
                  value={nit}
                  onChange={(e) => setNit(e.target.value)}
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

            <div>
              <label className="meta" style={{ display: "block", marginBottom: ".4rem" }}>
                Registro INVIMA / Notificación sanitaria (si aplica)
              </label>
              <input
                type="text"
                placeholder="Ej. NSA-0012345-2022"
                value={invima}
                onChange={(e) => setInvima(e.target.value)}
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
                Cuéntanos brevemente sobre tus cafés y métodos de tueste
              </label>
              <textarea
                rows={3}
                placeholder="Orígenes que manejas, variedades (Geisha, Bourbon, Castillo), altitud y tu filosofía de tueste..."
                value={story}
                onChange={(e) => setStory(e.target.value)}
                style={{
                  width: "100%",
                  padding: ".75rem 1rem",
                  borderRadius: "var(--radius-sm)",
                  background: "var(--surface-2)",
                  border: "1px solid var(--line)",
                  color: "var(--text)",
                  font: "inherit",
                  resize: "vertical",
                }}
              />
            </div>

            <div>
              <label className="meta" style={{ display: "block", marginBottom: ".6rem" }}>
                Plan de alianza preferido:
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <label
                  style={{
                    padding: "1rem",
                    borderRadius: "var(--radius-sm)",
                    border: `1px solid ${plan === "Basico" ? "var(--accent)" : "var(--line)"}`,
                    background: plan === "Basico" ? "var(--accent-soft)" : "var(--surface-2)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: ".8rem",
                  }}
                >
                  <input
                    type="radio"
                    name="brandPlan"
                    value="Basico"
                    checked={plan === "Basico"}
                    onChange={() => setPlan("Basico")}
                    style={{ marginTop: ".2rem" }}
                  />
                  <div>
                    <strong>Plan Básico</strong>
                    <div style={{ fontSize: ".85rem", color: "var(--muted)", marginTop: ".2rem" }}>
                      $0 cuota mensual · 15% comisión por venta
                    </div>
                  </div>
                </label>

                <label
                  style={{
                    padding: "1rem",
                    borderRadius: "var(--radius-sm)",
                    border: `1px solid ${plan === "Pro" ? "var(--accent)" : "var(--line)"}`,
                    background: plan === "Pro" ? "var(--accent-soft)" : "var(--surface-2)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: ".8rem",
                  }}
                >
                  <input
                    type="radio"
                    name="brandPlan"
                    value="Pro"
                    checked={plan === "Pro"}
                    onChange={() => setPlan("Pro")}
                    style={{ marginTop: ".2rem" }}
                  />
                  <div>
                    <strong>Plan Pro</strong>
                    <div style={{ fontSize: ".85rem", color: "var(--muted)", marginTop: ".2rem" }}>
                      $49.000 / mes · 10% comisión reducida
                    </div>
                  </div>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-block mt-3"
              style={{ padding: "1rem" }}
            >
              {loading ? "Enviando solicitud..." : "Enviar Solicitud de Registro"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
