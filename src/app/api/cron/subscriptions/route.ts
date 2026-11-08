import { route } from "@/server/http";
import { forbidden } from "@/server/errors";
import { processDueSubscriptions } from "@/server/services/subscriptions";

export const POST = route(async (req) => {
  if (req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) throw forbidden();
  return processDueSubscriptions();
});
