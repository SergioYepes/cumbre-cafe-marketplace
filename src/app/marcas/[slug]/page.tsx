import { notFound } from "next/navigation";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { getBrand, listProducts } from "@/server/services/catalog";
import { formatCop } from "@/lib/format";

export default async function BrandProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let brand;
  let productsData;
  try {
    [brand, productsData] = await Promise.all([
      getBrand(slug),
      listProducts({ brand: slug, page: 1, pageSize: 24 }),
    ]);
  } catch {
    notFound();
  }

  return (
    <div className="container" style={{ padding: "2.5rem 0 5rem" }}>
      <nav className="breadcrumbs" aria-label="Navegación">
        <Link href="/">Inicio</Link>
        <span>/</span>
        <Link href="/marcas">Marcas</Link>
        <span>/</span>
        <span style={{ color: "var(--text)" }}>{brand.name}</span>
      </nav>

      <header
        className="page-head"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "2rem",
          flexWrap: "wrap",
        }}
      >
        <div style={{ maxWidth: 650 }}>
          <span className="eyebrow">Tostaduría Verificada</span>
          <h1 className="page-title">{brand.name}</h1>
          <p className="meta" style={{ fontSize: "1.05rem", margin: ".5rem 0 1rem" }}>
            📍 {brand.city} · Despacho en {brand.dispatchHours} horas máximo
          </p>
          <p>{brand.story || "Pasión por el café colombiano de alta especialidad."}</p>
        </div>

        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--line)",
            borderRadius: "var(--radius-sm)",
            padding: "1.2rem 1.6rem",
            minWidth: 240,
          }}
        >
          <span className="meta" style={{ display: "block", fontSize: ".8rem" }}>
            Política de envíos:
          </span>
          {brand.freeShippingFromCop ? (
            <div style={{ marginTop: ".3rem" }}>
              <span className="tag tag-good" style={{ marginBottom: ".5rem" }}>
                Envío gratis
              </span>
              <p style={{ fontSize: ".88rem", color: "var(--muted)" }}>
                En compras superiores a <strong>{formatCop(brand.freeShippingFromCop)}</strong> en cafés de {brand.name}.
              </p>
            </div>
          ) : (
            <p style={{ fontSize: ".88rem", color: "var(--muted)", marginTop: ".3rem" }}>
              Envíos directos a todo el país.
            </p>
          )}
        </div>
      </header>

      <section style={{ marginTop: "3rem" }}>
        <div className="section-head">
          <div>
            <h2>Cafés de {brand.name}</h2>
            <p>Lotes activos disponibles para despacho inmediato.</p>
          </div>
          <span className="meta">
            {productsData.items.length} {productsData.items.length === 1 ? "café" : "cafés"}
          </span>
        </div>

        {productsData.items.length === 0 ? (
          <div
            style={{
              padding: "3rem",
              background: "var(--surface)",
              borderRadius: "var(--radius)",
              textAlign: "center",
              border: "1px solid var(--line)",
            }}
          >
            <p className="meta">Esta marca no tiene cafés disponibles en este momento.</p>
          </div>
        ) : (
          <div className="grid">
            {productsData.items.map((p, idx) => (
              <ProductCard key={p.id} p={p} index={idx} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
