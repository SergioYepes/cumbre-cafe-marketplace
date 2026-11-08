import { route, parseBody } from "@/server/http";
import { requireUser } from "@/server/auth";
import { brandAdminUpdateSchema } from "@/server/schemas";
import { updateBrandAdmin } from "@/server/services/admin";

export const PATCH = route(async (req, { params }) => {
  await requireUser(req, ["ADMIN"]);
  return updateBrandAdmin((await params).id, await parseBody(req, brandAdminUpdateSchema));
});
