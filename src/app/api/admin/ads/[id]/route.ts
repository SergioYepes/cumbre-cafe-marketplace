import { z } from "zod";
import { route, parseBody } from "@/server/http";
import { requireUser } from "@/server/auth";
import { setCampaignActive } from "@/server/services/admin";

export const PATCH = route(async (req, { params }) => {
  await requireUser(req, ["ADMIN"]);
  const { active } = await parseBody(req, z.object({ active: z.boolean() }));
  return setCampaignActive((await params).id, active);
});
