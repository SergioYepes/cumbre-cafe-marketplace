import { route } from "@/server/http";
import { requireUser } from "@/server/auth";
import { markPayoutPaid } from "@/server/services/admin";

export const POST = route(async (req, { params }) => {
  await requireUser(req, ["ADMIN"]);
  return markPayoutPaid((await params).id);
});
