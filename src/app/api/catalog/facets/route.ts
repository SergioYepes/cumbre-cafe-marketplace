import { route } from "@/server/http";
import { catalogFacets } from "@/server/services/catalog";

export const GET = route(async () => catalogFacets());
