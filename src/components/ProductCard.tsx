import Link from "next/link";
import type { listProducts } from "@/server/services/catalog";
import { daysSince, formatCop, productImage, ROAST_LABEL, ROAST_LEVEL } from "@/lib/format";
import QuickAdd from "./cart/QuickAdd";
import { RoastMeter, Stars } from "./ui";

export type ProductItem = Awaited<ReturnType<typeof listProducts>>["items"][number];

export default function ProductCard({ p, index = 0 }: { p: ProductItem; index?: number }) {
  const img = productImage(p);
  const v = p.variants.find((x) => x.available);
  const roastedDays = daysSince(v?.roastedAt ?? p.variants[0]?.roastedAt ?? null);
  return (
    <article className="card" style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}>
      <Link href={`/cafes/${p.slug}`} className="card-img" aria-label={p.name}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img} alt={`${p.name} de ${p.brand.name}`} loading="lazy" />
        {p.score && <span className="badge">SCA {p.score}</span>}
        {p.sponsored && <span className="badge sponsored">Patrocinado</span>}
      </Link>
      <div className="card-body">
        <Link href={`/marcas/${p.brand.slug}`} className="brand-name">{p.brand.name}</Link>
        <h3><Link href={`/cafes/${p.slug}`}>{p.name}</Link></h3>
        <span className="meta">
          {p.origin}{p.process ? ` · ${p.process}` : ""}
        </span>
        <div className="row-flex" style={{ gap: ".6rem" }}>
          <RoastMeter level={ROAST_LEVEL[p.roast]} />
          <span className="meta" style={{ fontSize: ".8rem" }}>{ROAST_LABEL[p.roast]}</span>
          {p.rating.count > 0 && <Stars value={p.rating.avg} count={p.rating.count} />}
        </div>
        <div className="notes">
          {p.tastingNotes.slice(0, 3).map((n) => <span key={n}>{n}</span>)}
        </div>
        {roastedDays !== null && <span className="fresh">● Tostado hace {roastedDays} {roastedDays === 1 ? "día" : "días"}</span>}
        <div className="card-foot">
          <span className="price">
            {p.variants.length > 1 && <small>desde</small>}
            {p.fromPriceCop !== null ? formatCop(p.fromPriceCop) : "—"}
          </span>
          <QuickAdd
            line={
              v
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
