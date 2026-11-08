import { route, parseBody } from "@/server/http";
import { requireBrand } from "@/server/auth";
import { variantUpdateSchema } from "@/server/schemas";
import { updateVariant } from "@/server/services/brand";

export const PATCH = route(async (req, { params }) => {
  const { brand } = await requireBrand(req);
  return updateVariant(brand.id, (await params).id, await parseBody(req, variantUpdateSchema));
});
