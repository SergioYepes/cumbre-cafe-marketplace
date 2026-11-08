import { route } from "@/server/http";
import { requireUser } from "@/server/auth";
import { deleteAddress } from "@/server/services/accounts";

export const DELETE = route(async (req, { params }) => {
  const user = await requireUser(req);
  await deleteAddress(user.id, (await params).id);
  return { ok: true };
});
