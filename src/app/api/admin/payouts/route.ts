import { z } from "zod";
import { route, parseBody, parseQuery } from "@/server/http";
import { requireUser } from "@/server/auth";
import { payoutGenerateSchema } from "@/server/schemas";
import { generatePayouts, listPayouts } from "@/server/services/admin";

const q = z.object({ status: z.enum(["PENDING", "PAID"]).optional() });

export const GET = route(async (req) => {
  await requireUser(req, ["ADMIN"]);
  return listPayouts(parseQuery(req, q).status);
});

export const POST = route(async (req) => {
  await requireUser(req, ["ADMIN"]);
  const created = await generatePayouts(await parseBody(req, payoutGenerateSchema));
  return Response.json({ created: created.length, payouts: created }, { status: 201 });
});
