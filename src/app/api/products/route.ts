import { route, parseQuery } from "@/server/http";
import { productQuerySchema } from "@/server/schemas";
import { listProducts } from "@/server/services/catalog";

export const GET = route(async (req) => listProducts(parseQuery(req, productQuerySchema)));
