"use client";

import { useMemo, useState } from "react";
import ProductCard, { type ProductItem } from "./ProductCard";

const ROAST_OPTIONS = [
  { key: "ALL", label: "Todos los perfiles" },
  { key: "LIGHT", label: "Tueste claro" },
  { key: "MEDIUM", label: "Tueste medio" },
  { key: "MEDIUM_DARK", label: "Medio oscuro / Espresso" },
] as const;

export default function Catalog({ initialProducts = [] }: { initialProducts?: ProductItem[] }) {
  const [selectedRoast, setSelectedRoast] = useState<string>("ALL");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return initialProducts.filter((p) => {
      const matchRoast =
        selectedRoast === "ALL" ||
        p.roast === selectedRoast ||
        (selectedRoast === "MEDIUM_DARK" && (p.roast === "MEDIUM_DARK" || p.roast === "DARK"));

      if (!matchRoast) return false;

      if (!search.trim()) return true;
      const term = search.toLowerCase();
      return (
        p.name.toLowerCase().includes(term) ||
        p.brand.name.toLowerCase().includes(term) ||
        p.origin.toLowerCase().includes(term) ||
        p.tastingNotes.some((n) => n.toLowerCase().includes(term)) ||
        (p.process && p.process.toLowerCase().includes(term))
      );
    });
  }, [initialProducts, selectedRoast, search]);

  return (
    <div className="catalog-container">
      <div className="toolbar" style={{ marginBottom: "1.8rem" }}>
        <div className="chips" role="group" aria-label="Filtrar por perfil de tueste">
          {ROAST_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              id={`filter-${opt.key.toLowerCase()}`}
              className={`chip ${selectedRoast === opt.key ? "active" : ""}`}
              onClick={() => setSelectedRoast(opt.key)}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="hero-search" style={{ margin: 0, minWidth: 260, maxWidth: 360, width: "100%" }}>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ opacity: 0.6 }}
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="search"
            placeholder="Buscar por nota, origen, variedad..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Buscar café"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="btn-xs"
              style={{ color: "var(--faint)", cursor: "pointer" }}
              aria-label="Limpiar búsqueda"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div
          className="empty"
          style={{
            textAlign: "center",
            padding: "4rem 1.5rem",
            background: "var(--surface)",
            borderRadius: "var(--radius)",
            border: "1px solid var(--line)",
          }}
        >
          <div style={{ fontSize: "2.8rem", marginBottom: "0.8rem" }}>☕</div>
          <h3>No encontramos cafés para esta búsqueda</h3>
          <p className="meta" style={{ marginTop: ".4rem" }}>
            Prueba seleccionando otro tueste o limpiando el filtro de búsqueda.
          </p>
          <button
            className="btn btn-ghost btn-sm mt-3"
            onClick={() => {
              setSelectedRoast("ALL");
              setSearch("");
            }}
          >
            Ver todos los cafés
          </button>
        </div>
      ) : (
        <div className="grid">
          {filtered.map((product, idx) => (
            <ProductCard key={product.id} p={product} index={idx} />
          ))}
        </div>
      )}
    </div>
  );
}
