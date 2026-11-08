import { z } from "zod";
import { route, parseQuery } from "@/server/http";
import { requireUser } from "@/server/auth";
import { listBrandsAdmin } from "@/server/services/admin";

const q = z.object({ status: z.enum(["PENDING", "ACTIVE", "SUSPENDED"]).optional() });

export const GET = route(async (req) => {
  await requireUser(req, ["ADMIN"]);
  return listBrandsAdmin(parseQuery(req, q).status);
});
