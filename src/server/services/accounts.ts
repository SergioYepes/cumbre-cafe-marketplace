import { db } from "../db";
import { AppError, conflict, forbidden, notFound } from "../errors";
import { hashPassword, verifyPassword } from "../password";
import { slugify } from "../utils";

export async function registerCustomer(input: { email: string; name: string; password: string; phone?: string }) {
  const email = input.email.toLowerCase();
  const exists = await db.user.findUnique({ where: { email } });
  if (exists) throw conflict("EMAIL_TAKEN", "Ya existe una cuenta con ese correo");
  const user = await db.user.create({
    data: { email, name: input.name, phone: input.phone, passwordHash: hashPassword(input.password) },
  });
  return publicUser(user);
}

export async function authenticate(email: string, password: string) {
  const user = await db.user.findUnique({ where: { email: email.toLowerCase() } });
  // Mismo mensaje para email inexistente o clave incorrecta
  if (!user || !verifyPassword(password, user.passwordHash)) {
    throw new AppError(401, "BAD_CREDENTIALS", "Correo o contraseña incorrectos");
  }
  return publicUser(user);
}

export const publicUser = (u: { id: string; email: string; name: string; phone: string | null; role: "CUSTOMER" | "BRAND" | "ADMIN" }) => ({
  id: u.id,
  email: u.email,
  name: u.name,
  phone: u.phone,
  role: u.role,
});

export async function me(userId: string) {
  const user = await db.user.findUnique({ where: { id: userId }, include: { brand: { select: { id: true, slug: true, name: true, status: true } } } });
  if (!user) throw notFound("Usuario no encontrado");
  return { ...publicUser(user), brand: user.brand };
}

// ───────── Direcciones ─────────

export const listAddresses = (userId: string) =>
  db.address.findMany({ where: { userId }, orderBy: [{ isDefault: "desc" }, { id: "desc" }] });

export async function createAddress(
  userId: string,
  data: { label?: string; recipient: string; phone: string; department: string; city: string; line1: string; line2?: string; notes?: string; isDefault?: boolean },
) {
  const count = await db.address.count({ where: { userId } });
  const isDefault = data.isDefault ?? count === 0;
  return db.$transaction(async (tx) => {
    if (isDefault) await tx.address.updateMany({ where: { userId }, data: { isDefault: false } });
    return tx.address.create({ data: { ...data, userId, isDefault } });
  });
}

export async function deleteAddress(userId: string, id: string) {
  const a = await db.address.findUnique({ where: { id }, include: { _count: { select: { orders: true, subscriptions: true } } } });
  if (!a || a.userId !== userId) throw notFound("Dirección no encontrada");
  if (a._count.orders > 0 || a._count.subscriptions > 0) throw forbidden("La dirección está asociada a pedidos o suscripciones");
  await db.address.delete({ where: { id } });
}

// ───────── Reseñas ─────────

/** Solo compradores verificados: debe tener un sub-pedido ENTREGADO con ese producto. */
export async function createReview(userId: string, slug: string, data: { rating: number; comment?: string }) {
  const product = await db.product.findUnique({ where: { slug } });
  if (!product) throw notFound("Producto no encontrado");
  const bought = await db.orderItem.findFirst({
    where: {
      variant: { productId: product.id },
      subOrder: { status: "DELIVERED", order: { userId } },
    },
  });
  if (!bought) throw forbidden("Solo puedes reseñar productos que ya recibiste");
  return db.review.upsert({
    where: { productId_userId: { productId: product.id, userId } },
    create: { productId: product.id, userId, ...data },
    update: data,
  });
}

// ───────── Registro de marca ─────────

export async function registerBrand(
  userId: string,
  data: { name: string; city: string; story?: string; nit?: string; invimaRegistry?: string; logoUrl?: string; coverUrl?: string },
) {
  const existing = await db.brand.findUnique({ where: { ownerId: userId } });
  if (existing) throw conflict("BRAND_EXISTS", "Ya tienes una marca registrada");
  const plan = await db.brandPlan.findUnique({ where: { name: "Básico" } });

  let slug = slugify(data.name);
  if (await db.brand.findUnique({ where: { slug } })) slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`;

  return db.$transaction(async (tx) => {
    await tx.user.update({ where: { id: userId }, data: { role: "BRAND" } });
    return tx.brand.create({
      data: { ...data, slug, ownerId: userId, planId: plan?.id, status: "PENDING" },
    });
  });
}
