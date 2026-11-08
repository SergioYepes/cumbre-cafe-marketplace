import { route } from "@/server/http";
import { requireUser } from "@/server/auth";
import { platformStats } from "@/server/services/admin";

export const GET = route(async (req) => {
  await requireUser(req, ["ADMIN"]);
  return platformStats();
});
