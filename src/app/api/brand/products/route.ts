import { route, parseBody } from "@/server/http";
import { requireBrand } from "@/server/auth";
import { productSchema } from "@/server/schemas";
import { brandProducts, createProduct } from "@/server/services/brand";

export const GET = route(async (req) => brandProducts((await requireBrand(req)).brand.id));

export const POST = route(async (req) => {
  const { brand } = await requireBrand(req);
  return Response.json(await createProduct(brand.id, await parseBody(req, productSchema)), { status: 201 });
});
