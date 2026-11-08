"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/";

  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
    const body = mode === "login" ? { email, password } : { name, email, password };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Error al procesar la solicitud");
      } else {
        router.push(next);
        router.refresh();
      }
    } catch {
      setError("Error de red. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const setQuickUser = (mail: string, pass: string) => {
    setEmail(mail);
    setPassword(pass);
    setMode("login");
  };

  return (
    <div
      style={{
        background: "var(--surface)",
        padding: "2.8rem 2.5rem",
        borderRadius: "var(--radius)",
        border: "1px solid var(--line)",
        maxWidth: 480,
        margin: "0 auto",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <span className="logo" style={{ fontSize: "2rem", marginBottom: ".5rem" }}>
          Cumbre<span>.</span>
        </span>
        <h1 style={{ fontSize: "1.8rem", marginTop: ".4rem" }}>
          {mode === "login" ? "Iniciar Sesión" : "Crear Cuenta"}
        </h1>
        <p className="meta" style={{ marginTop: ".3rem" }}>
          {mode === "login"
            ? "Accede a tus pedidos y cafés favoritos"
            : "Regístrate para comprar y suscribirte a lotes frescos"}
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: ".5rem",
          background: "var(--surface-2)",
          padding: ".3rem",
          borderRadius: "999px",
          marginBottom: "1.8rem",
        }}
      >
        <button
          type="button"
          className={`btn-sm ${mode === "login" ? "btn btn-primary" : "btn btn-ghost"}`}
          style={{ borderRadius: "999px", border: "none" }}
          onClick={() => {
            setMode("login");
            setError(null);
          }}
        >
          Iniciar Sesión
        </button>
        <button
          type="button"
          className={`btn-sm ${mode === "register" ? "btn btn-primary" : "btn btn-ghost"}`}
          style={{ borderRadius: "999px", border: "none" }}
          onClick={() => {
            setMode("register");
            setError(null);
          }}
        >
          Registrarme
        </button>
      </div>

      {error && (
        <div
          className="text-bad"
          style={{
            background: "rgba(224, 122, 106, 0.15)",
            border: "1px solid rgba(224, 122, 106, 0.3)",
            padding: ".8rem 1rem",
            borderRadius: "var(--radius-sm)",
            marginBottom: "1.5rem",
            fontSize: ".9rem",
          }}
        >
          ⚠ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1.2rem" }}>
        {mode === "register" && (
          <div>
            <label className="meta" style={{ display: "block", marginBottom: ".4rem" }}>
              Nombre completo *
            </label>
            <input
              type="text"
              required
              placeholder="Ej. Camila Morales"
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
        )}

        <div>
          <label className="meta" style={{ display: "block", marginBottom: ".4rem" }}>
            Correo electrónico *
          </label>
          <input
            type="email"
            required
            placeholder="tu@correo.com"
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
            Contraseña *
          </label>
          <input
            type="password"
            required
            minLength={mode === "register" ? 8 : 1}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary btn-block mt-2"
          style={{ padding: ".85rem" }}
        >
          {loading
            ? "Verificando..."
            : mode === "login"
            ? "Ingresar a mi cuenta"
            : "Completar registro"}
        </button>
      </form>

      {/* Cuentas de prueba */}
      <div
        style={{
          marginTop: "2.2rem",
          paddingTop: "1.5rem",
          borderTop: "1px solid var(--line)",
          fontSize: ".82rem",
        }}
      >
        <span className="meta" style={{ display: "block", marginBottom: ".6rem" }}>
          🔑 Accesos rápidos de prueba (datos demo):
        </span>
        <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
          <button
            type="button"
            className="chip btn-xs"
            onClick={() => setQuickUser("finca.aurora@demo.co", "Demo12345!")}
          >
            Marca Demo
          </button>
          <button
            type="button"
            className="chip btn-xs"
            onClick={() => setQuickUser("admin@cumbre.co", "Admin12345!")}
          >
            Admin
          </button>
        </div>
      </div>
    </div>
  );
}

export default function IngresarPage() {
  return (
    <div className="container-narrow" style={{ padding: "4rem 0 6rem" }}>
      <Suspense fallback={<div className="skeleton" style={{ height: 400, maxWidth: 480, margin: "0 auto" }} />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
