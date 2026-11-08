import { route, parseBody } from "@/server/http";
import { registerSchema } from "@/server/schemas";
import { registerCustomer } from "@/server/services/accounts";
import { setSessionCookie, signToken } from "@/server/auth";

export const POST = route(async (req) => {
  const user = await registerCustomer(await parseBody(req, registerSchema));
  const token = await signToken({ id: user.id, role: user.role });
  await setSessionCookie(token);
  return Response.json({ user, token }, { status: 201 });
});
