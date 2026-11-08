import { route, parseBody } from "@/server/http";
import { loginSchema } from "@/server/schemas";
import { authenticate } from "@/server/services/accounts";
import { setSessionCookie, signToken } from "@/server/auth";

export const POST = route(async (req) => {
  const { email, password } = await parseBody(req, loginSchema);
  const user = await authenticate(email, password);
  const token = await signToken({ id: user.id, role: user.role });
  await setSessionCookie(token);
  return { user, token };
});
