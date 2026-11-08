import { ZodError, type ZodType } from "zod";
import { Prisma } from "@prisma/client";
import { AppError } from "./errors";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Ctx = { params: Promise<any> };
type Handler = (req: Request, ctx: Ctx) => Promise<unknown>;

/** Envuelve un handler: serializa JSON y traduce errores a respuestas HTTP. */
export function route(handler: Handler) {
  return async (req: Request, ctx: Ctx): Promise<Response> => {
    try {
      const result = await handler(req, ctx);
      if (result instanceof Response) return result;
      return Response.json(result ?? { ok: true });
    } catch (e) {
      if (e instanceof AppError) {
        return Response.json({ error: { code: e.code, message: e.message } }, { status: e.status });
      }
      if (e instanceof ZodError) {
        return Response.json(
          { error: { code: "VALIDATION", message: "Datos inválidos", issues: e.issues } },
          { status: 400 },
        );
      }
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
        return Response.json({ error: { code: "DUPLICATE", message: "El registro ya existe" } }, { status: 409 });
      }
      console.error("[api] error no controlado", e);
      return Response.json({ error: { code: "INTERNAL", message: "Error interno" } }, { status: 500 });
    }
  };
}

export async function parseBody<T>(req: Request, schema: ZodType<T>): Promise<T> {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    json = {};
  }
  return schema.parse(json);
}

export function parseQuery<T>(req: Request, schema: ZodType<T>): T {
  const params = Object.fromEntries(new URL(req.url).searchParams);
  return schema.parse(params);
}
