import { route, parseBody } from "@/server/http";
import { requireUser } from "@/server/auth";
import { subscriptionCreateSchema } from "@/server/schemas";
import { createSubscription, listSubscriptions } from "@/server/services/subscriptions";

export const GET = route(async (req) => listSubscriptions((await requireUser(req)).id));

export const POST = route(async (req) => {
  const user = await requireUser(req);
  return Response.json(await createSubscription(user.id, await parseBody(req, subscriptionCreateSchema)), { status: 201 });
});
