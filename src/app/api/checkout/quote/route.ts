import { z } from "zod";
import { route, parseBody } from "@/server/http";
import { quoteCart } from "@/server/services/orders";

const schema = z.object({
  items: z.array(z.object({ variantId: z.string().min(1), quantity: z.number().int().min(1).max(24) })).max(50),
});

/** Cotización pública del carrito (no requiere sesión, no escribe nada). */
export const POST = route(async (req) => {
  const { items } = await parseBody(req, schema);
  return quoteCart(items);
});
