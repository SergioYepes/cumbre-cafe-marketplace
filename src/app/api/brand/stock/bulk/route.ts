import { route, parseBody } from "@/server/http";
import { requireBrand } from "@/server/auth";
import { bulkStockSchema } from "@/server/schemas";
import { bulkUpdateStock } from "@/server/services/brand";

export const POST = route(async (req) => {
  const { brand } = await requireBrand(req);
  return bulkUpdateStock(brand.id, (await parseBody(req, bulkStockSchema)).rows);
});
