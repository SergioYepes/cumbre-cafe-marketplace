import Link from "next/link";
import { listBrands } from "@/server/services/catalog";
import { demoBrands } from "@/lib/demo-data";

export default async function BrandsPage() {
  let brands: { id: string; name: string; slug: string; city: string; story: string | null; _count?: { products: number } }[] = [];
  try {
    brands = await listBrands();
  } catch (err) {
    console.error("Error cargando marcas:", err);
  }

  const brandColors = ["#e0a458", "#c76b3a", "#d9c3a0", "#8fbf8a", "#8fb3d9"];

  return (
    <div className="container" style={{ padding: "2.5rem 0 5rem" }}>
      <nav className="breadcrumbs" aria-label="Navegación">
        <Link href="/">Inicio</Link>
        <span>/</span>
        <span style={{ color: "var(--text)" }}>Nuestras Marcas</span>
      </nav>

      <header className="page-head">
        <span className="eyebrow">Productores y Tostadores</span>
        <h1 className="page-title">Marcas de Café de Especialidad</h1>
        <p>
          Conoce a los tostadores artesanales y familias productoras detrás de cada microlote. Cada
          marca tuesta sobre pedido y despacha directo desde su tostaduría.
        </p>
      </header>

      <div className="brands" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))" }}>
        {brands.length > 0
          ? brands.map((b, i) => (
              <article className="brand-card" key={b.id || b.slug}>
                <div
                  className="mark"
                  style={{ background: brandColors[i % brandColors.length] }}
                >
                  {b.name[0]}
                </div>
                <h3>
                  <Link href={`/marcas/${b.slug}`}>{b.name}</Link>
                </h3>
                <span className="meta">{b.city}</span>
                <p>{b.story || "Tueste artesanal de café colombiano de origen."}</p>
                <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "1rem" }}>
                  <span className="meta faint" style={{ fontSize: "0.85rem" }}>
                    {b._count?.products ?? 0} cafés disponibles
                  </span>
                  <Link href={`/marcas/${b.slug}`} className="btn-link" style={{ fontSize: "0.85rem" }}>
                    Ver cafés →
                  </Link>
                </div>
              </article>
            ))
          : demoBrands.map((b, i) => (
              <article className="brand-card" key={b.name}>
                <div className="mark" style={{ background: b.color }}>
                  {b.name[0]}
                </div>
                <h3>{b.name}</h3>
                <span className="meta">{b.city}</span>
                <p>{b.blurb}</p>
              </article>
            ))}
      </div>
    </div>
  );
}
