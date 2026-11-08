import { route } from "@/server/http";
import { requireBrand } from "@/server/auth";
import { brandSummary } from "@/server/services/brand";

export const GET = route(async (req) => {
  const { brand } = await requireBrand(req);
  return { brand, summary: await brandSummary(brand.id) };
});
