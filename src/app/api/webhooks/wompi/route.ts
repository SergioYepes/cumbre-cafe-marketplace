import { route } from "@/server/http";
import { processWompiEvent } from "@/server/services/payments";

export const POST = route(async (req) => {
  const evt = await req.json();
  return processWompiEvent(evt);
});
