import { notFound } from "next/navigation";
import Link from "next/link";
import { getProduct } from "@/server/services/catalog";
import { daysSince, formatCop, productImage, ROAST_LABEL, ROAST_LEVEL } from "@/lib/format";
import { RoastMeter, Stars } from "@/components/ui";
import ProductBuyBox from "@/components/ProductBuyBox";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let product;
  try {
    product = await getProduct(slug);
  } catch {
    notFound();
  }

  const img = productImage(product);
  const activeVariant = product.variants.find((v) => v.available) ?? product.variants[0];
  const roastedDays = daysSince(activeVariant?.roastedAt ?? null);

  return (
    <div className="container" style={{ padding: "2.5rem 0 5rem" }}>
      <nav className="breadcrumbs" aria-label="Ruta de navegación">
        <Link href="/">Inicio</Link>
        <span>/</span>
        <Link href="/cafes">Cafés</Link>
        <span>/</span>
        <span style={{ color: "var(--text)" }}>{product.name}</span>
      </nav>

      <div className="pdp">
        <div className="pdp-media">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img} alt={`${product.name} de ${product.brand.name}`} />
          {product.score && (
            <span className="badge" style={{ fontSize: ".85rem", padding: ".35rem .9rem" }}>
              SCA {product.score} pts
            </span>
          )}
          {product.sponsored && (
            <span className="badge sponsored" style={{ fontSize: ".85rem" }}>
              Patrocinado
            </span>
          )}
        </div>

        <div className="pdp-info">
          <Link
            href={`/marcas/${product.brand.slug}`}
            className="brand-name"
            style={{ fontSize: ".85rem", letterSpacing: ".15em" }}
          >
            {product.brand.name} · {product.brand.city}
          </Link>

          <h1>{product.name}</h1>

          <div className="row-flex" style={{ gap: "1rem", margin: ".6rem 0 1.2rem", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
              <RoastMeter level={ROAST_LEVEL[product.roast]} />
              <span className="meta">{ROAST_LABEL[product.roast]}</span>
            </div>

            {product.rating.count > 0 ? (
              <div style={{ display: "flex", alignItems: "center", gap: ".4rem" }}>
                <Stars value={product.rating.avg} count={product.rating.count} />
                <span className="meta">({product.rating.avg.toFixed(1)})</span>
              </div>
            ) : (
              <span className="meta faint">★ Lote reciente</span>
            )}

            {roastedDays !== null && (
              <span className="fresh" style={{ fontWeight: 500 }}>
                ● Tostado hace {roastedDays} {roastedDays === 1 ? "día" : "días"}
              </span>
            )}
          </div>

          <p className="lead">{product.description}</p>

          <div style={{ margin: "1rem 0" }}>
            <span className="meta" style={{ display: "block", marginBottom: ".4rem", fontSize: ".8rem" }}>
              Notas de cata:
            </span>
            <div className="notes">
              {product.tastingNotes.map((note) => (
                <span
                  key={note}
                  style={{ fontSize: ".85rem", padding: ".35rem .9rem", background: "var(--surface-3)" }}
                >
                  {note}
                </span>
              ))}
            </div>
          </div>

          <dl className="specs">
            <div>
              <dt>Origen / Región</dt>
              <dd>{product.origin}</dd>
            </div>
            <div>
              <dt>Finca / Productor</dt>
              <dd>{product.farm || "Asociación de caficultores"}</dd>
            </div>
            <div>
              <dt>Variedad</dt>
              <dd>{product.variety || "Arábica de altura"}</dd>
            </div>
            <div>
              <dt>Proceso de beneficio</dt>
              <dd>{product.process || "Lavado tradicional"}</dd>
            </div>
            <div>
              <dt>Altitud</dt>
              <dd>{product.altitudeMasl ? `${product.altitudeMasl} msnm` : "1.600+ msnm"}</dd>
            </div>
            <div>
              <dt>Puntaje en taza</dt>
              <dd>{product.score ? `${product.score} SCA` : "Especialidad 84+"}</dd>
            </div>
          </dl>

          <ProductBuyBox
            productId={product.id}
            productSlug={product.slug}
            productName={product.name}
            brandName={product.brand.name}
            imageUrl={img}
            variants={product.variants}
          />

          <div className="info-strip">
            <div>
              <strong>🚀 Despacho en 48h</strong>
              Directo desde la tostaduría de {product.brand.name}.
            </div>
            <div>
              <strong>📦 Empaque tricapa</strong>
              Válvula desgasificadora para máxima conservación.
            </div>
            <div>
              <strong>☕ Tueste fresco</strong>
              Garantía de sabor y frescura en cada taza.
            </div>
          </div>
        </div>
      </div>

      <section className="section-sm" style={{ borderTop: "1px solid var(--line)", marginTop: "4rem" }}>
        <div className="section-head">
          <div>
            <h2>Reseñas y experiencia de cata</h2>
            <p>Opiniones verificadas de amantes del buen café.</p>
          </div>
        </div>

        {product.reviews.length === 0 ? (
          <div
            style={{
              padding: "2.5rem",
              background: "var(--surface)",
              borderRadius: "var(--radius)",
              border: "1px solid var(--line)",
              textAlign: "center",
            }}
          >
            <p className="meta">Aún no hay reseñas registradas para este lote.</p>
            <p className="faint" style={{ fontSize: ".85rem", marginTop: ".3rem" }}>
              Las reseñas sólo pueden ser publicadas por clientes verificados tras recibir su pedido.
            </p>
          </div>
        ) : (
          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
            {product.reviews.map((rev) => (
              <article
                key={rev.id}
                style={{
                  background: "var(--surface)",
                  padding: "1.2rem",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--line)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: ".4rem" }}>
                  <strong>{rev.author}</strong>
                  <span className="stars">{"★".repeat(rev.rating)}</span>
                </div>
                <p style={{ fontSize: ".9rem", color: "var(--muted)" }}>{rev.comment}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
