import { route } from "@/server/http";
import { getProduct } from "@/server/services/catalog";

export const GET = route(async (_req, { params }) => getProduct((await params).slug));
