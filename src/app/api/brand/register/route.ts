import { route, parseBody } from "@/server/http";
import { requireUser } from "@/server/auth";
import { brandRegisterSchema } from "@/server/schemas";
import { registerBrand } from "@/server/services/accounts";
import { signToken, setSessionCookie } from "@/server/auth";

export const POST = route(async (req) => {
  const user = await requireUser(req, ["CUSTOMER"]);
  const brand = await registerBrand(user.id, await parseBody(req, brandRegisterSchema));
  // El rol cambió a BRAND: renovar token
  const token = await signToken({ id: user.id, role: "BRAND" });
  await setSessionCookie(token);
  return Response.json({ brand, token }, { status: 201 });
});
