import { route, parseBody } from "@/server/http";
import { requireBrand } from "@/server/auth";
import { subOrderUpdateSchema } from "@/server/schemas";
import { updateSubOrder } from "@/server/services/brand";

export const PATCH = route(async (req, { params }) => {
  const { brand } = await requireBrand(req);
  return updateSubOrder(brand.id, (await params).id, await parseBody(req, subOrderUpdateSchema));
});
