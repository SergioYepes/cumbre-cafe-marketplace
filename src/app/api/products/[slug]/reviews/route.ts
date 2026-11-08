import { route, parseBody } from "@/server/http";
import { requireUser } from "@/server/auth";
import { reviewSchema } from "@/server/schemas";
import { createReview } from "@/server/services/accounts";

export const POST = route(async (req, { params }) => {
  const user = await requireUser(req);
  const review = await createReview(user.id, (await params).slug, await parseBody(req, reviewSchema));
  return Response.json(review, { status: 201 });
});
