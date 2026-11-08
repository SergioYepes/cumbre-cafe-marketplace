import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { Role } from "@prisma/client";
import { db } from "./db";
import { forbidden, unauthorized } from "./errors";

const COOKIE = "session";
const MAX_AGE = 60 * 60 * 24 * 7;

const secret = () => {
  const s = process.env.AUTH_SECRET ?? "cumbre-dev-auth-secret-key-super-secure-2026";
  return new TextEncoder().encode(s);
};

export type SessionUser = { id: string; role: Role };

export async function signToken(user: SessionUser) {
  return new SignJWT({ role: user.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secret());
}

export async function verifyToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, secret());
    if (!payload.sub) return null;
    return { id: payload.sub, role: payload.role as Role };
  } catch {
    return null;
  }
}

export async function setSessionCookie(token: string) {
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function clearSessionCookie() {
  (await cookies()).delete(COOKIE);
}

/** Acepta cookie de sesión (web) o `Authorization: Bearer` (app nativa futura). */
export async function currentUser(req: Request): Promise<SessionUser | null> {
  const bearer = req.headers.get("authorization");
  if (bearer?.startsWith("Bearer ")) return verifyToken(bearer.slice(7));
  const token = (await cookies()).get(COOKIE)?.value;
  return token ? verifyToken(token) : null;
}

/** Sesión desde la cookie (para Server Components y layouts, sin Request). */
export async function getSession(): Promise<SessionUser | null> {
  try {
    const token = (await cookies()).get(COOKIE)?.value;
    return token ? verifyToken(token) : null;
  } catch {
    return null;
  }
}

/** Obtiene el usuario para la cabecera (HeaderUser) de forma segura. */
export async function getHeaderUser(): Promise<{ name: string; email: string; role: Role } | null> {
  try {
    const session = await getSession();
    if (!session) return null;
    return await db.user.findUnique({
      where: { id: session.id },
      select: { name: true, email: true, role: true },
    });
  } catch {
    return null;
  }
}

export async function requireUser(req: Request, roles?: Role[]): Promise<SessionUser> {
  const user = await currentUser(req);
  if (!user) throw unauthorized();
  if (roles && !roles.includes(user.role)) throw forbidden();
  return user;
}

/** Usuario con rol BRAND + su marca. */
export async function requireBrand(req: Request) {
  const user = await requireUser(req, ["BRAND"]);
  const brand = await db.brand.findUnique({ where: { ownerId: user.id } });
  if (!brand) throw forbidden("No tienes una marca registrada");
  return { user, brand };
}
