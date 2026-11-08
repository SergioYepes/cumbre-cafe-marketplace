import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { catalogFacets, listProducts } from "@/server/services/catalog";
import { ROAST_LABEL } from "@/lib/format";
import type { RoastLevel } from "@prisma/client";

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    roast?: string;
    origin?: string;
    process?: string;
    brand?: string;
    sort?: "newest" | "price_asc" | "price_desc" | "rating";
    page?: string;
  }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const roast = params.roast as RoastLevel | undefined;

  const [productsData, facets] = await Promise.all([
    listProducts({
      page,
      pageSize: 24,
      q: params.q,
      roast,
      origin: params.origin,
      process: params.process,
      brand: params.brand,
      sort: params.sort,
    }),
    catalogFacets(),
  ]);

  const activeFiltersCount = [params.roast, params.origin, params.process, params.brand, params.q].filter(Boolean).length;

  return (
    <div className="container" style={{ padding: "2.5rem 0 5rem" }}>
      <nav className="breadcrumbs" aria-label="Navegación">
        <Link href="/">Inicio</Link>
        <span>/</span>
        <span style={{ color: "var(--text)" }}>Catálogo de Cafés</span>
      </nav>

      <header className="page-head">
        <span className="eyebrow">Catálogo Oficial</span>
        <h1 className="page-title">Cafés de Especialidad de Colombia</h1>
        <p>
          Explora lotes de orígenes colombianos, tostados por micro-tostadores certificados y enviados
          en su ventana óptima de frescura.
        </p>
      </header>

      <div className="catalog">
        <aside className="filters">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontSize: "1.1rem" }}>Filtros</h3>
            {activeFiltersCount > 0 && (
              <Link href="/cafes" className="btn-link" style={{ fontSize: ".8rem" }}>
                Limpiar ({activeFiltersCount})
              </Link>
            )}
          </div>

          <div>
            <h4>Perfil de Tueste</h4>
            <div className="filter-list">
              <Link href="/cafes" className={!params.roast ? "active" : ""}>
                <span>Todos los tuestes</span>
              </Link>
              {facets.roasts.map((r) => (
                <Link
                  key={r}
                  href={`/cafes?${new URLSearchParams({ ...params, roast: r, page: "1" }).toString()}`}
                  className={params.roast === r ? "active" : ""}
                >
                  {ROAST_LABEL[r] ?? r}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4>Origen / Departamento</h4>
            <div className="filter-list">
              {facets.origins.map((o) => (
                <Link
                  key={o.value}
                  href={`/cafes?${new URLSearchParams({ ...params, origin: o.value, page: "1" }).toString()}`}
                  className={params.origin?.toLowerCase() === o.value.toLowerCase() ? "active" : ""}
                >
                  <span>{o.value}</span>
                  <span>{o.count}</span>
                </Link>
              ))}
            </div>
          </div>

          {facets.processes.filter((p): p is { value: string; count: number } => Boolean(p.value)).length > 0 && (
            <div>
              <h4>Proceso de Beneficio</h4>
              <div className="filter-list">
                {facets.processes
                  .filter((p): p is { value: string; count: number } => Boolean(p.value))
                  .map((p) => (
                    <Link
                      key={p.value}
                      href={`/cafes?${new URLSearchParams({ ...params, process: p.value, page: "1" }).toString()}`}
                      className={params.process?.toLowerCase() === p.value.toLowerCase() ? "active" : ""}
                    >
                      <span>{p.value}</span>
                      <span>{p.count}</span>
                    </Link>
                  ))}
              </div>
            </div>
          )}
        </aside>

        <div>
          <div className="toolbar">
            <span className="meta">
              Mostrando <strong>{productsData.items.length}</strong> de{" "}
              <strong>{productsData.total}</strong> cafés
            </span>

            <div style={{ display: "flex", gap: ".6rem", alignItems: "center" }}>
              <span className="meta" style={{ fontSize: ".85rem" }}>
                Ordenar:
              </span>
              <div className="chips" style={{ margin: 0 }}>
                <Link
                  href={`/cafes?${new URLSearchParams({ ...params, sort: "newest", page: "1" }).toString()}`}
                  className={`chip btn-xs ${!params.sort || params.sort === "newest" ? "active" : ""}`}
                >
                  Más recientes
                </Link>
                <Link
                  href={`/cafes?${new URLSearchParams({ ...params, sort: "rating", page: "1" }).toString()}`}
                  className={`chip btn-xs ${params.sort === "rating" ? "active" : ""}`}
                >
                  Puntaje SCA
                </Link>
                <Link
                  href={`/cafes?${new URLSearchParams({ ...params, sort: "price_asc", page: "1" }).toString()}`}
                  className={`chip btn-xs ${params.sort === "price_asc" ? "active" : ""}`}
                >
                  Precio: menor a mayor
                </Link>
              </div>
            </div>
          </div>

          {productsData.items.length === 0 ? (
            <div
              className="empty"
              style={{
                textAlign: "center",
                padding: "4rem 2rem",
                background: "var(--surface)",
                borderRadius: "var(--radius)",
                border: "1px solid var(--line)",
              }}
            >
              <div style={{ fontSize: "2.8rem", marginBottom: "0.8rem" }}>☕</div>
              <h3>No se encontraron cafés con estos filtros</h3>
              <p className="meta" style={{ marginTop: ".4rem" }}>
                Intenta ajustando los filtros laterales o explorando todos los orígenes.
              </p>
              <Link href="/cafes" className="btn btn-primary btn-sm mt-3">
                Ver todos los cafés
              </Link>
            </div>
          ) : (
            <div className="grid">
              {productsData.items.map((p, idx) => (
                <ProductCard key={p.id} p={p} index={idx} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
