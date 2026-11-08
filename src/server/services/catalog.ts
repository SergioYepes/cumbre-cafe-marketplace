import { Prisma, type GrindType, type RoastLevel } from "@prisma/client";
import { db } from "../db";
import { notFound } from "../errors";
import { isFresh } from "../utils";

const FALLBACK_BRANDS = [
  {
    id: "brand-aurora",
    slug: "finca-aurora",
    name: "Finca Aurora",
    story: "Lotes exóticos de microproductores familiares cultivados entre 1.750 y 2.050 m s. n. m. en el sur del Huila.",
    logoUrl: null,
    coverUrl: null,
    city: "Pitalito, Huila",
    dispatchHours: 24,
    freeShippingFromCop: 90000,
    _count: { products: 2 },
  },
  {
    id: "brand-sur",
    slug: "tostadores-del-sur",
    name: "Tostadores del Sur",
    story: "Tueste artesanal en pequeños lotes de café volcánico de altura del macizo nariñense y caucano.",
    logoUrl: null,
    coverUrl: null,
    city: "Pasto, Nariño",
    dispatchHours: 48,
    freeShippingFromCop: 85000,
    _count: { products: 2 },
  },
  {
    id: "brand-altura",
    slug: "altura-cafe",
    name: "Altura Café",
    story: "Curaduría de cosechas frescas y perfiles de tueste claros y medios desde nuestra tostaduría en Bogotá.",
    logoUrl: null,
    coverUrl: null,
    city: "Bogotá D.C.",
    dispatchHours: 24,
    freeShippingFromCop: 80000,
    _count: { products: 2 },
  },
];

function buildFallbackProducts() {
  const daysAgo = (d: number) => new Date(Date.now() - d * 86_400_000);
  const raw = [
    {
      id: "demo-1",
      slug: "geisha-washed-huila",
      name: "Geisha Washed",
      description: "Microlote de variedad Geisha cultivado a 1.950 m s. n. m. en Pitalito, Huila. Taza limpia, sedosa y profundamente floral.",
      imageUrl: "/images/products/light.jpg",
      origin: "Huila",
      farm: "Vereda El Mirador",
      altitudeMasl: 1950,
      variety: "Geisha",
      process: "Lavado",
      roast: "LIGHT" as RoastLevel,
      tastingNotes: ["jazmín", "bergamota", "durazno"],
      score: 89,
      brand: { name: "Finca Aurora", slug: "finca-aurora", city: "Pitalito, Huila", logoUrl: null },
      rating: { avg: 4.9, count: 18 },
      sponsored: true,
      priceCop: 78000,
      weightGrams: 250,
      roastedDays: 3,
    },
    {
      id: "demo-2",
      slug: "caturra-honey-narino",
      name: "Caturra Honey",
      description: "Cultivado en suelos volcánicos de Buesaco, Nariño. Proceso enmielado que resalta la dulzura de panela y cítricos dulces.",
      imageUrl: "/images/products/medium.jpg",
      origin: "Nariño",
      farm: "La Cabaña",
      altitudeMasl: 2050,
      variety: "Caturra",
      process: "Honey",
      roast: "MEDIUM" as RoastLevel,
      tastingNotes: ["panela", "mandarina", "cacao"],
      score: 85.5,
      brand: { name: "Tostadores del Sur", slug: "tostadores-del-sur", city: "Pasto, Nariño", logoUrl: null },
      rating: { avg: 4.7, count: 24 },
      sponsored: false,
      priceCop: 42000,
      weightGrams: 340,
      roastedDays: 4,
    },
    {
      id: "demo-3",
      slug: "pink-bourbon-natural",
      name: "Pink Bourbon Natural",
      description: "Borbón Rosado secado al sol en camas africanas durante 22 días. Perfil frutal vibrante con cuerpo cremoso.",
      imageUrl: "/images/products/light.jpg",
      origin: "Huila",
      farm: "San Adolfo",
      altitudeMasl: 1820,
      variety: "Borbón Rosado",
      process: "Natural",
      roast: "LIGHT" as RoastLevel,
      tastingNotes: ["frambuesa", "rosas", "miel"],
      score: 87.5,
      brand: { name: "Altura Café", slug: "altura-cafe", city: "Bogotá D.C.", logoUrl: null },
      rating: { avg: 4.8, count: 15 },
      sponsored: false,
      priceCop: 65000,
      weightGrams: 250,
      roastedDays: 2,
    },
    {
      id: "demo-4",
      slug: "castillo-espresso-cauca",
      name: "Castillo Espresso",
      description: "Tueste medio-oscuro desarrollado especialmente para máquinas de espresso, prensa francesa y moka italiana.",
      imageUrl: "/images/products/dark.jpg",
      origin: "Cauca",
      farm: "El Tambo",
      altitudeMasl: 1750,
      variety: "Castillo",
      process: "Lavado",
      roast: "MEDIUM_DARK" as RoastLevel,
      tastingNotes: ["chocolate", "nuez", "caramelo"],
      score: 84,
      brand: { name: "Tostadores del Sur", slug: "tostadores-del-sur", city: "Pasto, Nariño", logoUrl: null },
      rating: { avg: 4.6, count: 31 },
      sponsored: false,
      priceCop: 38000,
      weightGrams: 500,
      roastedDays: 5,
    },
    {
      id: "demo-5",
      slug: "sidra-anaerobico-quindio",
      name: "Sidra Anaeróbico",
      description: "Fermentación anaeróbica de 72 horas en mosto de cereza. Complejo, exótico y con final prolongado a frutos rojos.",
      imageUrl: "/images/products/light.jpg",
      origin: "Quindío",
      farm: "Buenavista",
      altitudeMasl: 1880,
      variety: "Sidra",
      process: "Anaeróbico",
      roast: "LIGHT" as RoastLevel,
      tastingNotes: ["vino tinto", "cereza", "canela"],
      score: 90,
      brand: { name: "Finca Aurora", slug: "finca-aurora", city: "Pitalito, Huila", logoUrl: null },
      rating: { avg: 5.0, count: 12 },
      sponsored: true,
      priceCop: 95000,
      weightGrams: 250,
      roastedDays: 3,
    },
    {
      id: "demo-6",
      slug: "tabi-natural-santander",
      name: "Tabi Natural",
      description: "Cultivado bajo sombrío de bosque nativo en Santander. Dulzura tropical con acidez suave y cuerpo redondo.",
      imageUrl: "/images/products/medium.jpg",
      origin: "Santander",
      farm: "Mesa de los Santos",
      altitudeMasl: 1680,
      variety: "Tabi",
      process: "Natural",
      roast: "MEDIUM" as RoastLevel,
      tastingNotes: ["mango", "panela", "flor de naranjo"],
      score: 86,
      brand: { name: "Altura Café", slug: "altura-cafe", city: "Bogotá D.C.", logoUrl: null },
      rating: { avg: 4.8, count: 19 },
      sponsored: false,
      priceCop: 52000,
      weightGrams: 340,
      roastedDays: 6,
    },
  ];

  return raw.map((item) => {
    const roastedAt = daysAgo(item.roastedDays);
    const variants = [
      {
        id: `${item.id}-wb`,
        sku: `${item.slug.toUpperCase()}-WB`,
        weightGrams: item.weightGrams,
        grind: "WHOLE_BEAN" as GrindType,
        priceCop: item.priceCop,
        stock: 20,
        roastedAt,
        fresh: true,
        available: true,
      },
      {
        id: `${item.id}-flt`,
        sku: `${item.slug.toUpperCase()}-FLT`,
        weightGrams: item.weightGrams,
        grind: "FILTER" as GrindType,
        priceCop: item.priceCop,
        stock: 15,
        roastedAt,
        fresh: true,
        available: true,
      },
    ];
    return {
      ...item,
      fromPriceCop: item.priceCop,
      variants,
    };
  });
}

export type ProductQuery = {
  q?: string;
  origin?: string;
  roast?: "LIGHT" | "MEDIUM_LIGHT" | "MEDIUM" | "MEDIUM_DARK" | "DARK";
  process?: string;
  brand?: string; // slug
  minPrice?: number;
  maxPrice?: number;
  sort?: "newest" | "price_asc" | "price_desc" | "rating";
  page: number;
  pageSize: number;
};

const productInclude = {
  brand: { select: { name: true, slug: true, city: true, logoUrl: true } },
  variants: { where: { active: true }, orderBy: { priceCop: "asc" as const } },
} satisfies Prisma.ProductInclude;

type ProductRow = Prisma.ProductGetPayload<{ include: typeof productInclude }>;

async function ratings(productIds: string[]) {
  if (productIds.length === 0) return new Map<string, { avg: number; count: number }>();
  const rows = await db.review.groupBy({
    by: ["productId"],
    where: { productId: { in: productIds } },
    _avg: { rating: true },
    _count: { _all: true },
  });
  return new Map(rows.map((r) => [r.productId, { avg: Math.round((r._avg.rating ?? 0) * 10) / 10, count: r._count._all }]));
}

async function sponsoredIds() {
  const now = new Date();
  const ads = await db.adCampaign.findMany({
    where: { active: true, placement: "SPONSORED_PRODUCT", startsAt: { lte: now }, endsAt: { gte: now }, productId: { not: null } },
    select: { productId: true },
  });
  return new Set(ads.map((a) => a.productId!));
}

function present(p: ProductRow, rating?: { avg: number; count: number }, sponsored = false) {
  const now = new Date();
  const variants = p.variants.map((v) => ({
    id: v.id,
    sku: v.sku,
    weightGrams: v.weightGrams,
    grind: v.grind,
    priceCop: v.priceCop,
    stock: v.stock,
    roastedAt: v.roastedAt,
    fresh: isFresh(v.roastedAt, v.maxFreshDays, now),
    available: v.stock > 0 && isFresh(v.roastedAt, v.maxFreshDays, now),
  }));
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    description: p.description,
    imageUrl: p.imageUrl,
    origin: p.origin,
    farm: p.farm,
    altitudeMasl: p.altitudeMasl,
    variety: p.variety,
    process: p.process,
    roast: p.roast,
    tastingNotes: p.tastingNotes,
    score: p.score,
    brand: p.brand,
    rating: rating ?? { avg: 0, count: 0 },
    sponsored,
    fromPriceCop: variants.length ? Math.min(...variants.map((v) => v.priceCop)) : null,
    variants,
  };
}

export async function listProducts(q: ProductQuery) {
  try {
    const where: Prisma.ProductWhereInput = {
      active: true,
      brand: { status: "ACTIVE", ...(q.brand ? { slug: q.brand } : {}) },
      variants: {
        some: {
          active: true,
          ...(q.minPrice || q.maxPrice ? { priceCop: { gte: q.minPrice, lte: q.maxPrice } } : {}),
        },
      },
      ...(q.origin ? { origin: { equals: q.origin, mode: "insensitive" } } : {}),
      ...(q.roast ? { roast: q.roast } : {}),
      ...(q.process ? { process: { equals: q.process, mode: "insensitive" } } : {}),
      ...(q.q
        ? {
            OR: [
              { name: { contains: q.q, mode: "insensitive" } },
              { description: { contains: q.q, mode: "insensitive" } },
              { origin: { contains: q.q, mode: "insensitive" } },
              { tastingNotes: { has: q.q.toLowerCase() } },
              { brand: { name: { contains: q.q, mode: "insensitive" } } },
            ],
          }
        : {}),
    };

    const orderBy: Prisma.ProductOrderByWithRelationInput =
      q.sort === "rating" ? { score: "desc" } : { createdAt: "desc" };

    const [total, rows, sponsored] = await Promise.all([
      db.product.count({ where }),
      db.product.findMany({
        where,
        orderBy,
        include: productInclude,
        skip: (q.page - 1) * q.pageSize,
        take: q.pageSize,
      }),
      sponsoredIds(),
    ]);

    if (total > 0) {
      const rated = await ratings(rows.map((r) => r.id));
      let items = rows.map((r) => present(r, rated.get(r.id), sponsored.has(r.id)));
      if (q.sort === "price_asc") items.sort((a, b) => (a.fromPriceCop ?? 0) - (b.fromPriceCop ?? 0));
      if (q.sort === "price_desc") items.sort((a, b) => (b.fromPriceCop ?? 0) - (a.fromPriceCop ?? 0));
      items = [...items.filter((i) => i.sponsored), ...items.filter((i) => !i.sponsored)];

      return { items, page: q.page, pageSize: q.pageSize, total, totalPages: Math.ceil(total / q.pageSize) };
    }
  } catch {
    // Fallback a catálogo demostrativo cuando no hay BD conectada
  }

  let items = buildFallbackProducts();
  if (q.brand) items = items.filter((i) => i.brand.slug === q.brand);
  if (q.origin) items = items.filter((i) => i.origin.toLowerCase() === q.origin!.toLowerCase());
  if (q.roast) items = items.filter((i) => i.roast === q.roast);
  if (q.process) items = items.filter((i) => i.process?.toLowerCase() === q.process!.toLowerCase());
  if (q.q) {
    const s = q.q.toLowerCase();
    items = items.filter(
      (i) =>
        i.name.toLowerCase().includes(s) ||
        i.origin.toLowerCase().includes(s) ||
        i.brand.name.toLowerCase().includes(s) ||
        i.tastingNotes.some((n) => n.toLowerCase().includes(s))
    );
  }
  if (q.sort === "price_asc") items.sort((a, b) => (a.fromPriceCop ?? 0) - (b.fromPriceCop ?? 0));
  if (q.sort === "price_desc") items.sort((a, b) => (b.fromPriceCop ?? 0) - (a.fromPriceCop ?? 0));
  if (q.sort === "rating") items.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

  return {
    items,
    page: 1,
    pageSize: q.pageSize,
    total: items.length,
    totalPages: 1,
  };
}

export async function getProduct(slug: string) {
  try {
    const p = await db.product.findFirst({
      where: { slug, active: true, brand: { status: "ACTIVE" } },
      include: {
        ...productInclude,
        reviews: { orderBy: { createdAt: "desc" }, take: 20, include: { user: { select: { name: true } } } },
      },
    });
    if (p) {
      const [rated, sponsored] = await Promise.all([ratings([p.id]), sponsoredIds()]);
      return {
        ...present(p, rated.get(p.id), sponsored.has(p.id)),
        reviews: p.reviews.map((r) => ({
          id: r.id,
          rating: r.rating,
          comment: r.comment,
          author: r.user.name.split(" ")[0],
          createdAt: r.createdAt,
        })),
      };
    }
  } catch {
    // Fallback demostrativo
  }

  const fallback = buildFallbackProducts().find((x) => x.slug === slug);
  if (!fallback) throw notFound("Producto no encontrado");
  return {
    ...fallback,
    reviews: [
      {
        id: "rev-1",
        rating: 5,
        comment: "Excelente frescura de tueste y aroma increíble desde que se abre la bolsa.",
        author: "Camila",
        createdAt: new Date(Date.now() - 2 * 86_400_000),
      },
    ],
  };
}

export async function listBrands() {
  try {
    const rows = await db.brand.findMany({
      where: { status: "ACTIVE" },
      orderBy: { name: "asc" },
      select: { id: true, slug: true, name: true, story: true, logoUrl: true, coverUrl: true, city: true, _count: { select: { products: true } } },
    });
    if (rows.length > 0) return rows;
  } catch {
    // Fallback demostrativo
  }
  return FALLBACK_BRANDS;
}

export async function getBrand(slug: string) {
  try {
    const b = await db.brand.findFirst({
      where: { slug, status: "ACTIVE" },
      select: {
        id: true, slug: true, name: true, story: true, logoUrl: true, coverUrl: true, city: true,
        dispatchHours: true, freeShippingFromCop: true,
      },
    });
    if (b) return b;
  } catch {
    // Fallback demostrativo
  }
  const fb = FALLBACK_BRANDS.find((x) => x.slug === slug);
  if (!fb) throw notFound("Marca no encontrada");
  return fb;
}

/** Valores disponibles para construir los filtros del catálogo. */
export async function catalogFacets() {
  try {
    const [origins, processes] = await Promise.all([
      db.product.groupBy({ by: ["origin"], where: { active: true, brand: { status: "ACTIVE" } }, _count: { _all: true } }),
      db.product.groupBy({ by: ["process"], where: { active: true, brand: { status: "ACTIVE" }, process: { not: null } }, _count: { _all: true } }),
    ]);
    if (origins.length > 0) {
      return {
        origins: origins.map((o) => ({ value: o.origin, count: o._count._all })),
        processes: processes.map((o) => ({ value: o.process, count: o._count._all })),
        roasts: ["LIGHT", "MEDIUM_LIGHT", "MEDIUM", "MEDIUM_DARK", "DARK"],
      };
    }
  } catch {
    // Fallback demostrativo
  }
  return {
    origins: [
      { value: "Huila", count: 2 },
      { value: "Nariño", count: 1 },
      { value: "Cauca", count: 1 },
      { value: "Quindío", count: 1 },
      { value: "Santander", count: 1 },
    ],
    processes: [
      { value: "Lavado", count: 2 },
      { value: "Natural", count: 2 },
      { value: "Honey", count: 1 },
      { value: "Anaeróbico", count: 1 },
    ],
    roasts: ["LIGHT", "MEDIUM", "MEDIUM_DARK"],
  };
}

/** Anuncios vigentes por ubicación (banner home / destacados por categoría). */
export async function activeAds(placement: "HOME_BANNER" | "CATEGORY_FEATURED" | "SPONSORED_PRODUCT") {
  const now = new Date();
  return db.adCampaign.findMany({
    where: { placement, active: true, startsAt: { lte: now }, endsAt: { gte: now }, brand: { status: "ACTIVE" } },
    include: { brand: { select: { name: true, slug: true, logoUrl: true } } },
    orderBy: { priceCop: "desc" },
  });
}
