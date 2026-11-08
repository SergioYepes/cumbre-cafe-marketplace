import { route } from "@/server/http";
import { requireUser } from "@/server/auth";
import { me } from "@/server/services/accounts";

export const GET = route(async (req) => {
  const user = await requireUser(req);
  return me(user.id);
});
