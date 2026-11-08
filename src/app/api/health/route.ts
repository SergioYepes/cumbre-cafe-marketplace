import { db } from "@/server/db";
import { route } from "@/server/http";

export const dynamic = "force-dynamic";

export const GET = route(async () => {
  await db.$queryRaw`SELECT 1`;
  return { status: "ok", db: "up", time: new Date().toISOString() };
});
