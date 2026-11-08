import { route } from "@/server/http";
import { getBrand } from "@/server/services/catalog";

export const GET = route(async (_req, { params }) => getBrand((await params).slug));
