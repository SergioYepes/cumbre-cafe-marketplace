import { route, parseBody } from "@/server/http";
import { requireUser } from "@/server/auth";
import { subscriptionUpdateSchema } from "@/server/schemas";
import { updateSubscription } from "@/server/services/subscriptions";

export const PATCH = route(async (req, { params }) => {
  const user = await requireUser(req);
  const body = await parseBody(req, subscriptionUpdateSchema);
  return updateSubscription(user.id, (await params).id, "action" in body ? body.action : { frequency: body.frequency });
});
