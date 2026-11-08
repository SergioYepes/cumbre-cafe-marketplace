import { route } from "@/server/http";
import { listBrands } from "@/server/services/catalog";

export const GET = route(async () => listBrands());
