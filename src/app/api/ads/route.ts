import { z } from "zod";
import { route, parseQuery } from "@/server/http";
import { activeAds } from "@/server/services/catalog";

const schema = z.object({ placement: z.enum(["HOME_BANNER", "CATEGORY_FEATURED", "SPONSORED_PRODUCT"]) });

export const GET = route(async (req) => activeAds(parseQuery(req, schema).placement));
