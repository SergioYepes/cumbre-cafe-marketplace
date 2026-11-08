import { route, parseBody } from "@/server/http";
import { requireBrand } from "@/server/auth";
import { campaignSchema } from "@/server/schemas";
import { brandCampaigns, createCampaign } from "@/server/services/brand";

export const GET = route(async (req) => brandCampaigns((await requireBrand(req)).brand.id));

export const POST = route(async (req) => {
  const { brand } = await requireBrand(req);
  return Response.json(await createCampaign(brand.id, await parseBody(req, campaignSchema)), { status: 201 });
});
