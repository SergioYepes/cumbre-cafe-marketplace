import { route, parseBody } from "@/server/http";
import { requireBrand } from "@/server/auth";
import { variantSchema } from "@/server/schemas";
import { addVariant } from "@/server/services/brand";

export const POST = route(async (req, { params }) => {
  const { brand } = await requireBrand(req);
  return Response.json(await addVariant(brand.id, (await params).id, await parseBody(req, variantSchema)), { status: 201 });
});
