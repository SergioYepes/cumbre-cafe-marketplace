import { route } from "@/server/http";
import { requireUser } from "@/server/auth";
import { getOrder } from "@/server/services/orders";

export const GET = route(async (req, { params }) => getOrder((await requireUser(req)).id, (await params).id));
