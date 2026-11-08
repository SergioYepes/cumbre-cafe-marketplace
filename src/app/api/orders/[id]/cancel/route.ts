import { route } from "@/server/http";
import { requireUser } from "@/server/auth";
import { cancelOwnOrder } from "@/server/services/orders";

export const POST = route(async (req, { params }) => cancelOwnOrder((await requireUser(req)).id, (await params).id));
