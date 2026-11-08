import { route, parseBody } from "@/server/http";
import { requireUser } from "@/server/auth";
import { addressSchema } from "@/server/schemas";
import { createAddress, listAddresses } from "@/server/services/accounts";

export const GET = route(async (req) => listAddresses((await requireUser(req)).id));

export const POST = route(async (req) => {
  const user = await requireUser(req);
  return Response.json(await createAddress(user.id, await parseBody(req, addressSchema)), { status: 201 });
});
