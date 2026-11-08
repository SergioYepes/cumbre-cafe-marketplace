/**
 * Seed idempotente: planes, admin y marcas/cafés de demostración.
 * Ejecutar: npm run db:seed
 * Para pasar a datos reales basta con no ejecutar el seed (o `npm run db:seed -- --plans-only`)
 * y registrar marcas reales desde /api/brand/register.
 */
import { PrismaClient, type RoastLevel } from "@prisma/client";
import { hashPassword } from "../src/server/password";

const db = new PrismaClient();
const plansOnly = process.argv.includes("--plans-only");

const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000);

const demoBrands = [
  {
    email: "finca.aurora@demo.co", name: "Finca Aurora", slug: "finca-aurora", city: "Pitalito, Huila",
    story: "Lotes exóticos de microproductores familiares del sur del Huila.",
    products: [
      { slug: "geisha-washed", name: "Geisha Washed", origin: "Huila", process: "Lavado", roast: "LIGHT" as RoastLevel, notes: ["jazmín", "bergamota", "durazno"], score: 89, variety: "Geisha", alt: 1750, variants: [{ sku: "AUR-GEI-250", w: 250, price: 78000 }, { sku: "AUR-GEI-500", w: 500, price: 148000 }] },
      { slug: "sidra-anaerobico", name: "Sidra Anaeróbico", origin: "Quindío", process: "Anaeróbico", roast: "LIGHT" as RoastLevel, notes: ["vino tinto", "cereza", "canela"], score: 90, variety: "Sidra", alt: 1650, variants: [{ sku: "AUR-SID-250", w: 250, price: 95000 }] },
    ],
  },
  {
    email: "tostadores.sur@demo.co", name: "Tostadores del Sur", slug: "tostadores-del-sur", city: "Pasto, Nariño",
    story: "Tueste artesanal de café de altura del sur colombiano.",
    products: [
      { slug: "caturra-honey", name: "Caturra Honey", origin: "Nariño", process: "Honey", roast: "MEDIUM" as RoastLevel, notes: ["panela", "mandarina", "cacao"], score: 85, variety: "Caturra", alt: 1900, variants: [{ sku: "SUR-CAT-340", w: 340, price: 42000 }, { sku: "SUR-CAT-1000", w: 1000, price: 112000 }] },
      { slug: "castillo-espresso", name: "Castillo Espresso", origin: "Cauca", process: "Lavado", roast: "MEDIUM_DARK" as RoastLevel, notes: ["chocolate", "nuez", "caramelo"], score: 83, variety: "Castillo", alt: 1700, variants: [{ sku: "SUR-CAS-500", w: 500, price: 38000 }] },
    ],
  },
  {
    email: "altura.cafe@demo.co", name: "Altura Café", slug: "altura-cafe", city: "Bogotá",
    story: "Selección de cosechas y perfiles de tueste claros.",
    products: [
      { slug: "pink-bourbon", name: "Pink Bourbon", origin: "Huila", process: "Natural", roast: "LIGHT" as RoastLevel, notes: ["frambuesa", "rosas", "miel"], score: 87, variety: "Pink Bourbon", alt: 1800, variants: [{ sku: "ALT-PBO-250", w: 250, price: 65000 }] },
      { slug: "tabi-natural", name: "Tabi Natural", origin: "Santander", process: "Natural", roast: "MEDIUM" as RoastLevel, notes: ["mango", "panela", "flor de naranjo"], score: 86, variety: "Tabi", alt: 1600, variants: [{ sku: "ALT-TAB-340", w: 340, price: 52000 }] },
    ],
  },
];

async function main() {
  // Planes (necesarios también en producción)
  const basic = await db.brandPlan.upsert({ where: { name: "Básico" }, update: {}, create: { name: "Básico", monthlyFeeCop: 0, commissionBps: 1500 } });
  await db.brandPlan.upsert({ where: { name: "Pro" }, update: {}, create: { name: "Pro", monthlyFeeCop: 49000, commissionBps: 1000 } });
  console.log("✔ Planes");
  if (plansOnly) return;

  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@cumbre.co";
  const adminPass = process.env.ADMIN_PASSWORD ?? "Admin12345!";
  await db.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: { email: adminEmail, name: "Administrador", passwordHash: hashPassword(adminPass), role: "ADMIN" },
  });
  console.log(`✔ Admin: ${adminEmail}`);

  for (const b of demoBrands) {
    const owner = await db.user.upsert({
      where: { email: b.email },
      update: {},
      create: { email: b.email, name: b.name, passwordHash: hashPassword("Demo12345!"), role: "BRAND" },
    });
    const brand = await db.brand.upsert({
      where: { slug: b.slug },
      update: {},
      create: { ownerId: owner.id, slug: b.slug, name: b.name, story: b.story, city: b.city, status: "ACTIVE", planId: basic.id, freeShippingFromCop: 120000 },
    });
    for (const p of b.products) {
      const product = await db.product.upsert({
        where: { slug: p.slug },
        update: {},
        create: {
          brandId: brand.id, slug: p.slug, name: p.name,
          description: `${p.name} de ${p.origin}. Proceso ${p.process.toLowerCase()}, notas de ${p.notes.join(", ")}.`,
          origin: p.origin, process: p.process, roast: p.roast, tastingNotes: p.notes, score: p.score, variety: p.variety, altitudeMasl: p.alt,
        },
      });
      for (const v of p.variants) {
        await db.variant.upsert({
          where: { sku: v.sku },
          update: {},
          create: { productId: product.id, sku: v.sku, weightGrams: v.w, priceCop: v.price, stock: 40, roastedAt: daysAgo(3), maxFreshDays: 45 },
        });
      }
    }
  }
  console.log("✔ Marcas y cafés de demostración");
}

main().finally(() => db.$disconnect());
