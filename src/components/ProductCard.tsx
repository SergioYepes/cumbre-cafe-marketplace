import Link from "next/link";
import type { listProducts } from "@/server/services/catalog";
import { daysSince, formatCop, productImage, ROAST_LABEL, ROAST_LEVEL } from "@/lib/format";
import QuickAdd from "./cart/QuickAdd";
import { RoastMeter, Stars } from "./ui";

export type ProductItem = Awaited<ReturnType<typeof listProducts>>["items"][number];

export default function ProductCard({ p }: { p: ProductItem; index?: number }) {
  const img = productImage(p);
  const v = p.variants.find((x) => x.available) ?? p.variants[0];
  const roastedDays = daysSince(v?.roastedAt ?? null);
  const weightGrams = v?.weightGrams ?? 250;
  const pricePerGram = p.fromPriceCop ? Math.round(p.fromPriceCop / weightGrams) : null;

  return (
    <article className="card">
      <Link href={`/cafes/${p.slug}`} className="card-img" aria-label={p.name}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img} alt={`${p.name} — ${p.brand.name}`} loading="lazy" />
        {p.score && <span className="badge">SCA {p.score} pts</span>}
        {p.sponsored && <span className="badge sponsored">Destacado</span>}
      </Link>

      <div className="card-body">
        <div className="row-flex between" style={{ gap: ".4rem" }}>
          <Link href={`/marcas/${p.brand.slug}`} className="brand-name">
            {p.brand.name}
          </Link>
          <span className="meta" style={{ fontSize: ".76rem" }}>
            📍 {p.origin}
          </span>
        </div>

        <h3>
          <Link href={`/cafes/${p.slug}`}>{p.name}</Link>
        </h3>

        <div className="card-specs-line">
          <span>{p.process || "Lavado"}</span>
          <span>·</span>
          <span>Bolsa {weightGrams} g</span>
          {p.altitudeMasl && (
            <>
              <span>·</span>
              <span>{p.altitudeMasl} m</span>
            </>
          )}
        </div>

        <div className="row-flex" style={{ gap: ".55rem", margin: ".15rem 0" }}>
          <RoastMeter level={ROAST_LEVEL[p.roast]} />
          <span className="meta" style={{ fontSize: ".78rem", fontWeight: 500 }}>
            Tueste {ROAST_LABEL[p.roast].toLowerCase()}
          </span>
          {p.rating.count > 0 && <Stars value={p.rating.avg} count={p.rating.count} />}
        </div>

        <div className="notes">
          {p.tastingNotes.slice(0, 3).map((n) => (
            <span key={n}>{n}</span>
          ))}
        </div>

        {roastedDays !== null && (
          <span className="fresh">
            ✓ Tostado hace {roastedDays} {roastedDays === 1 ? "día" : "días"} · En grano o molido
          </span>
        )}

        <div className="card-foot">
          <div>
            <span className="price">
              {p.variants.length > 1 && <small>desde</small>}
              {p.fromPriceCop !== null ? formatCop(p.fromPriceCop) : "—"}
            </span>
            {pricePerGram && (
              <span className="unit-price">
                ({formatCop(pricePerGram)} / g · IVA incl.)
              </span>
            )}
          </div>
          <QuickAdd
            line={
              v && v.available
                ? {
                    variantId: v.id,
                    productSlug: p.slug,
                    productName: p.name,
                    brandName: p.brand.name,
                    weightGrams: v.weightGrams,
                    grind: v.grind,
                    priceCop: v.priceCop,
                    image: img,
                  }
                : null
            }
          />
        </div>
      </div>
    </article>
  );
}
