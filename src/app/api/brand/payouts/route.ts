import { route } from "@/server/http";
import { requireBrand } from "@/server/auth";
import { brandPayouts } from "@/server/services/brand";

export const GET = route(async (req) => brandPayouts((await requireBrand(req)).brand.id));
