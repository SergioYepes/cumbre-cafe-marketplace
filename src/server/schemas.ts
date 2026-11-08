import { z } from "zod";

const roast = z.enum(["LIGHT", "MEDIUM_LIGHT", "MEDIUM", "MEDIUM_DARK", "DARK"]);
const grind = z.enum(["WHOLE_BEAN", "ESPRESSO", "FILTER", "FRENCH_PRESS", "MOKA"]);
const frequency = z.enum(["WEEKLY", "BIWEEKLY", "MONTHLY"]);
const placement = z.enum(["HOME_BANNER", "CATEGORY_FEATURED", "SPONSORED_PRODUCT"]);

export const registerSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(80),
  password: z.string().min(8).max(100),
  phone: z.string().min(7).max(20).optional(),
});

export const loginSchema = z.object({ email: z.string().email(), password: z.string().min(1) });

export const addressSchema = z.object({
  label: z.string().max(40).optional(),
  recipient: z.string().min(2),
  phone: z.string().min(7).max(20),
  department: z.string().min(2),
  city: z.string().min(2),
  line1: z.string().min(4),
  line2: z.string().optional(),
  notes: z.string().max(300).optional(),
  isDefault: z.boolean().optional(),
});

export const productQuerySchema = z.object({
  q: z.string().trim().min(1).optional(),
  origin: z.string().optional(),
  roast: roast.optional(),
  process: z.string().optional(),
  brand: z.string().optional(),
  minPrice: z.coerce.number().int().min(0).optional(),
  maxPrice: z.coerce.number().int().min(0).optional(),
  sort: z.enum(["newest", "price_asc", "price_desc", "rating"]).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(48).default(12),
});

export const checkoutSchema = z.object({
  addressId: z.string().min(1),
  paymentMethod: z.enum(["WOMPI", "PAYU", "BOLD", "BREB", "COD"]),
  items: z.array(z.object({ variantId: z.string().min(1), quantity: z.number().int().min(1).max(24) })).min(1).max(50),
});

export const reviewSchema = z.object({ rating: z.number().int().min(1).max(5), comment: z.string().max(1000).optional() });

export const brandRegisterSchema = z.object({
  name: z.string().min(2).max(80),
  city: z.string().min(2),
  story: z.string().max(2000).optional(),
  nit: z.string().optional(),
  invimaRegistry: z.string().optional(),
  logoUrl: z.string().url().optional(),
  coverUrl: z.string().url().optional(),
});

const variantSchema = z.object({
  sku: z.string().min(2),
  weightGrams: z.number().int().min(50).max(5000),
  grind: grind.optional(),
  priceCop: z.number().int().min(1000),
  stock: z.number().int().min(0),
  roastedAt: z.coerce.date().optional(),
  maxFreshDays: z.number().int().min(1).max(120).optional(),
});

export const productSchema = z.object({
  name: z.string().min(2).max(120),
  description: z.string().min(10).max(4000),
  imageUrl: z.string().url().optional(),
  origin: z.string().min(2),
  farm: z.string().optional(),
  altitudeMasl: z.number().int().min(0).max(3500).optional(),
  variety: z.string().optional(),
  process: z.string().optional(),
  roast,
  tastingNotes: z.array(z.string().min(1)).max(8).optional(),
  score: z.number().min(60).max(100).optional(),
  variants: z.array(variantSchema).min(1),
});

export const productUpdateSchema = productSchema.omit({ variants: true }).partial().extend({ active: z.boolean().optional() });
export { variantSchema };

export const variantUpdateSchema = z.object({
  priceCop: z.number().int().min(1000).optional(),
  stock: z.number().int().min(0).optional(),
  roastedAt: z.coerce.date().optional(),
  maxFreshDays: z.number().int().min(1).max(120).optional(),
  active: z.boolean().optional(),
});

export const bulkStockSchema = z.object({
  rows: z.array(z.object({ sku: z.string(), stock: z.number().int().min(0).optional(), priceCop: z.number().int().min(1000).optional() })).min(1).max(1000),
});

export const subOrderUpdateSchema = z.object({
  status: z.enum(["PREPARING", "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED"]),
  carrier: z.string().min(2).optional(),
  trackingNumber: z.string().min(3).optional(),
});

export const campaignSchema = z.object({
  placement,
  productId: z.string().optional(),
  priceCop: z.number().int().min(0),
  startsAt: z.coerce.date(),
  endsAt: z.coerce.date(),
});

export const subscriptionCreateSchema = z.object({
  variantId: z.string(),
  addressId: z.string(),
  frequency,
  paymentToken: z.string().optional(),
});

export const subscriptionUpdateSchema = z.union([
  z.object({ action: z.enum(["pause", "resume", "cancel"]) }),
  z.object({ frequency }),
]);

export const brandAdminUpdateSchema = z.object({
  status: z.enum(["PENDING", "ACTIVE", "SUSPENDED"]).optional(),
  planId: z.string().optional(),
  dispatchHours: z.number().int().min(1).max(240).optional(),
});

export const payoutGenerateSchema = z.object({ brandId: z.string().optional(), holdDays: z.number().int().min(0).max(60).optional() });
