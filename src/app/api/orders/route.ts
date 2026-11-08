import { route } from "@/server/http";
import { requireUser } from "@/server/auth";
import { listOrders } from "@/server/services/orders";

export const GET = route(async (req) => listOrders((await requireUser(req)).id));
