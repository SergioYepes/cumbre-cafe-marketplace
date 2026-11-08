import { route, parseBody } from "@/server/http";
import { requireUser } from "@/server/auth";
import { checkoutSchema } from "@/server/schemas";
import { createOrder } from "@/server/services/orders";

export const POST = route(async (req) => {
  const user = await requireUser(req, ["CUSTOMER", "BRAND", "ADMIN"]);
  const { order, paymentInit } = await createOrder(user.id, await parseBody(req, checkoutSchema));
  return Response.json({ order, payment: paymentInit }, { status: 201 });
});
