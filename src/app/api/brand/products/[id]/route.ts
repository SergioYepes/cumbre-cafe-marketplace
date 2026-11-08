import { route, parseBody } from "@/server/http";
import { requireBrand } from "@/server/auth";
import { productUpdateSchema } from "@/server/schemas";
import { updateProduct } from "@/server/services/brand";

export const PATCH = route(async (req, { params }) => {
  const { brand } = await requireBrand(req);
  return updateProduct(brand.id, (await params).id, await parseBody(req, productUpdateSchema));
});
