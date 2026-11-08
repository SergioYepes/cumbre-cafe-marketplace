import { z } from "zod";
import { route, parseQuery } from "@/server/http";
import { requireBrand } from "@/server/auth";
import { brandSubOrders } from "@/server/services/brand";

const q = z.object({ status: z.enum(["PENDING", "PREPARING", "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED"]).optional() });

export const GET = route(async (req) => {
  const { brand } = await requireBrand(req);
  return brandSubOrders(brand.id, parseQuery(req, q).status);
});
