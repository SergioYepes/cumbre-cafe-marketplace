"use client";

import { useState } from "react";
import Link from "next/link";
import { formatCop, GRIND_LABEL } from "@/lib/format";

const FREQUENCIES = [
  { key: "WEEKLY", label: "Semanal", discount: "15% dto.", blurb: "Ideal para consumidores diarios y oficinas" },
  { key: "BIWEEKLY", label: "Quincenal", discount: "10% dto.", blurb: "El ritmo favorito de los entusiastas del café", popular: true },
  { key: "MONTHLY", label: "Mensual", discount: "5% dto.", blurb: "Para disfrutar con calma cada fin de semana" },
];

const ROAST_PROFILES = [
  { key: "LIGHT", name: "Explorador de Claros", notes: "Floral, frutal, acidez brillante y dulce", desc: "Variedades exóticas como Geisha, Sidra y Pink Bourbon." },
  { key: "MEDIUM", name: "Equilibrio Perfecto", notes: "Panela, cítricos dulces y chocolate con leche", desc: "Cafés balanceados ideales para filtro y prensa." },
  { key: "MEDIUM_DARK", name: "Intenso y Achocolatado", notes: "Cacao amargo, nueces tostadas y caramelo", desc: "Cuerpo pronunciado diseñado para máquinas de espresso y moka." },
];

export default function SubscriptionPage() {
  const [selectedFreq, setSelectedFreq] = useState("BIWEEKLY");
  const [selectedProfile, setSelectedProfile] = useState("MEDIUM");
  const [selectedGrind, setSelectedGrind] = useState("WHOLE_BEAN");
  const [bags, setBags] = useState(2);
  const [subscribed, setSubscribed] = useState(false);

  const pricePerBag = 46000;
  const discountMultiplier = selectedFreq === "WEEKLY" ? 0.85 : selectedFreq === "BIWEEKLY" ? 0.9 : 0.95;
  const totalPrice = Math.round(pricePerBag * bags * discountMultiplier);

  const handleSubscribe = () => {
    setSubscribed(true);
  };

  if (subscribed) {
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
          <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>☕🎉</div>
          <span className="eyebrow" style={{ marginBottom: "1rem" }}>
            Suscripción Configurada
          </span>
          <h1 style={{ fontSize: "2.4rem", marginBottom: ".8rem" }}>
            ¡Bienvenido al Club de Café Cumbre!
          </h1>
          <p className="meta" style={{ fontSize: "1.1rem", marginBottom: "2rem" }}>
            Tu plan de café fresco ha sido registrado con frecuencia{" "}
            <strong>{FREQUENCIES.find((f) => f.key === selectedFreq)?.label.toLowerCase()}</strong>.
          </p>

          <div
            style={{
              background: "var(--bg-soft)",
              padding: "1.5rem",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--line)",
              textAlign: "left",
              margin: "2rem 0",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: ".6rem" }}>
              <span>Perfil seleccionado:</span>
              <strong>{ROAST_PROFILES.find((p) => p.key === selectedProfile)?.name}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: ".6rem" }}>
              <span>Molienda:</span>
              <strong>{GRIND_LABEL[selectedGrind]}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: ".6rem" }}>
              <span>Bolsas por ciclo:</span>
              <strong>{bags} bolsas (250g c/u)</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: ".8rem", paddingTop: ".8rem", borderTop: "1px solid var(--line)" }}>
              <span>Precio estimado por envío:</span>
              <strong className="mono" style={{ fontSize: "1.2rem", color: "var(--accent)" }}>
                {formatCop(totalPrice)}
              </strong>
            </div>
          </div>

          <p className="faint" style={{ fontSize: ".85rem", marginBottom: "2rem" }}>
            ℹ️ Recuerda que en Cumbre puedes pausar, cambiar de perfil o cancelar tu suscripción
            en cualquier momento sin penalidad alguna.
          </p>

          <Link href="/cafes" className="btn btn-primary">
            Explorar más cafés
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
        <span style={{ color: "var(--text)" }}>Suscripción de Café</span>
      </nav>

      <header className="page-head" style={{ textAlign: "center", maxWidth: 700, margin: "0 auto 3rem" }}>
        <span className="eyebrow">Café Fresco Sin Complicaciones</span>
        <h1 className="page-title">Suscripción de Café Colombiano</h1>
        <p>
          Recibe en tu casa u oficina café tostado días antes por los mejores tostadores del país.
          Rotación continua de micro-lotes para que siempre descubras un sabor nuevo.
        </p>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "3rem", alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
          {/* Paso 1: Frecuencia */}
          <div
            style={{
              background: "var(--surface)",
              padding: "2rem",
              borderRadius: "var(--radius)",
              border: "1px solid var(--line)",
            }}
          >
            <h3 style={{ marginBottom: "1.2rem" }}>1. Elige la Frecuencia</h3>
            <div style={{ display: "grid", gap: "1rem" }}>
              {FREQUENCIES.map((f) => (
                <div
                  key={f.key}
                  onClick={() => setSelectedFreq(f.key)}
                  style={{
                    padding: "1.2rem 1.4rem",
                    borderRadius: "var(--radius-sm)",
                    border: `1px solid ${selectedFreq === f.key ? "var(--accent)" : "var(--line)"}`,
                    background: selectedFreq === f.key ? "var(--accent-soft)" : "var(--surface-2)",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    transition: "all .2s",
                  }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: ".6rem" }}>
                      <strong style={{ fontSize: "1.1rem" }}>{f.label}</strong>
                      <span className="tag tag-good">{f.discount}</span>
                      {f.popular && <span className="tag tag-warn">Más popular</span>}
                    </div>
                    <p className="meta" style={{ marginTop: ".3rem" }}>{f.blurb}</p>
                  </div>
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      border: `2px solid ${selectedFreq === f.key ? "var(--accent)" : "var(--line-strong)"}`,
                      background: selectedFreq === f.key ? "var(--accent)" : "transparent",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Paso 2: Perfil */}
          <div
            style={{
              background: "var(--surface)",
              padding: "2rem",
              borderRadius: "var(--radius)",
              border: "1px solid var(--line)",
            }}
          >
            <h3 style={{ marginBottom: "1.2rem" }}>2. Selecciona tu Perfil Preferido</h3>
            <div style={{ display: "grid", gap: "1rem" }}>
              {ROAST_PROFILES.map((p) => (
                <div
                  key={p.key}
                  onClick={() => setSelectedProfile(p.key)}
                  style={{
                    padding: "1.2rem 1.4rem",
                    borderRadius: "var(--radius-sm)",
                    border: `1px solid ${selectedProfile === p.key ? "var(--accent)" : "var(--line)"}`,
                    background: selectedProfile === p.key ? "var(--accent-soft)" : "var(--surface-2)",
                    cursor: "pointer",
                    transition: "all .2s",
                  }}
                >
                  <strong style={{ fontSize: "1.1rem", display: "block" }}>{p.name}</strong>
                  <span className="meta" style={{ display: "block", color: "var(--accent)", margin: ".2rem 0" }}>
                    Notas: {p.notes}
                  </span>
                  <p className="meta" style={{ fontSize: ".88rem" }}>{p.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Paso 3: Molienda y Bolsas */}
          <div
            style={{
              background: "var(--surface)",
              padding: "2rem",
              borderRadius: "var(--radius)",
              border: "1px solid var(--line)",
            }}
          >
            <h3 style={{ marginBottom: "1.2rem" }}>3. Molienda y Cantidad</h3>
            <div style={{ marginBottom: "1.5rem" }}>
              <label className="meta" style={{ display: "block", marginBottom: ".6rem", fontWeight: 600 }}>
                Tipo de molienda:
              </label>
              <div className="chips">
                {Object.entries(GRIND_LABEL).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    className={`chip ${selectedGrind === key ? "active" : ""}`}
                    onClick={() => setSelectedGrind(key)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="meta" style={{ display: "block", marginBottom: ".6rem", fontWeight: 600 }}>
                Bolsas de 250g por entrega:
              </label>
              <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                <div className="qty">
                  <button type="button" onClick={() => setBags((b) => Math.max(1, b - 1))}>
                    −
                  </button>
                  <span>{bags}</span>
                  <button type="button" onClick={() => setBags((b) => Math.min(8, b + 1))}>
                    +
                  </button>
                </div>
                <span className="meta">{bags * 250} gramos en total</span>
              </div>
            </div>
          </div>
        </div>

        {/* Columna Resumen */}
        <div
          style={{
            background: "var(--surface)",
            padding: "2rem",
            borderRadius: "var(--radius)",
            border: "1px solid var(--line)",
            position: "sticky",
            top: "90px",
          }}
        >
          <h3 style={{ marginBottom: "1.2rem" }}>Resumen de Suscripción</h3>

          <div style={{ display: "flex", flexDirection: "column", gap: ".8rem", marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span className="meta">Frecuencia:</span>
              <strong>{FREQUENCIES.find((f) => f.key === selectedFreq)?.label}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span className="meta">Perfil:</span>
              <strong>{ROAST_PROFILES.find((p) => p.key === selectedProfile)?.name}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span className="meta">Molienda:</span>
              <span>{GRIND_LABEL[selectedGrind]}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span className="meta">Cantidad:</span>
              <span>{bags} bolsas ({bags * 250}g)</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "1rem", borderTop: "1px solid var(--line)" }}>
              <span>Total por envío:</span>
              <strong className="mono price" style={{ fontSize: "1.8rem" }}>
                {formatCop(totalPrice)}
              </strong>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-primary btn-block"
            id="start-sub-btn"
            onClick={handleSubscribe}
            style={{ padding: "1rem", fontSize: "1.05rem" }}
          >
            Activar Suscripción
          </button>

          <ul
            style={{
              marginTop: "2rem",
              paddingTop: "1.5rem",
              borderTop: "1px solid var(--line)",
              listStyle: "none",
              display: "flex",
              flexDirection: "column",
              gap: ".6rem",
              fontSize: ".85rem",
              color: "var(--muted)",
            }}
          >
            <li>✨ Envío garantizado de lotes recién tostados</li>
            <li>🔄 Rotación entre tostadores verificados</li>
            <li>⏸️ Pausa o cancela cuando quieras sin penalidad</li>
            <li>💳 Cobro automático recurrente seguro</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
