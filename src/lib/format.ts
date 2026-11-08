/** Utilidades de presentación compartidas (seguras para cliente y servidor). */

export const formatCop = (n: number) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);

export const formatDate = (d: Date | string) =>
  new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "short", year: "numeric" }).format(new Date(d));

export const formatDateTime = (d: Date | string) =>
  new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(d));

export const daysSince = (d: Date | string | null) =>
  d ? Math.max(0, Math.floor((Date.now() - new Date(d).getTime()) / 86_400_000)) : null;

export const ROAST_LABEL: Record<string, string> = {
  LIGHT: "Claro",
  MEDIUM_LIGHT: "Medio claro",
  MEDIUM: "Medio",
  MEDIUM_DARK: "Medio oscuro",
  DARK: "Oscuro",
};

export const ROAST_LEVEL: Record<string, number> = { LIGHT: 1, MEDIUM_LIGHT: 2, MEDIUM: 3, MEDIUM_DARK: 4, DARK: 5 };

export const GRIND_LABEL: Record<string, string> = {
  WHOLE_BEAN: "Grano entero",
  ESPRESSO: "Molido espresso",
  FILTER: "Molido filtro",
  FRENCH_PRESS: "Prensa francesa",
  MOKA: "Moka",
};

export const ORDER_STATUS: Record<string, { label: string; tone: Tone }> = {
  CREATED: { label: "Creado", tone: "muted" },
  PENDING_PAYMENT: { label: "Pendiente de pago", tone: "warn" },
  PAID: { label: "Pagado", tone: "good" },
  CANCELLED: { label: "Cancelado", tone: "bad" },
};

export const SUBORDER_STATUS: Record<string, { label: string; tone: Tone }> = {
  PENDING: { label: "Pendiente", tone: "warn" },
  PREPARING: { label: "Preparando", tone: "info" },
  SHIPPED: { label: "Enviado", tone: "info" },
  DELIVERED: { label: "Entregado", tone: "good" },
  CANCELLED: { label: "Cancelado", tone: "bad" },
  RETURNED: { label: "Devuelto", tone: "bad" },
};

export const PAYMENT_METHOD: Record<string, string> = {
  WOMPI: "Wompi (tarjeta, PSE, Nequi)",
  PAYU: "PayU",
  BOLD: "Bold",
  BREB: "Bre-B",
  COD: "Contraentrega",
};

export const PAYMENT_STATUS: Record<string, { label: string; tone: Tone }> = {
  PENDING: { label: "Pendiente", tone: "warn" },
  APPROVED: { label: "Aprobado", tone: "good" },
  DECLINED: { label: "Rechazado", tone: "bad" },
  REFUNDED: { label: "Reembolsado", tone: "muted" },
};

export const BRAND_STATUS: Record<string, { label: string; tone: Tone }> = {
  PENDING: { label: "En revisión", tone: "warn" },
  ACTIVE: { label: "Activa", tone: "good" },
  SUSPENDED: { label: "Suspendida", tone: "bad" },
};

export const FREQUENCY_LABEL: Record<string, string> = { WEEKLY: "Semanal", BIWEEKLY: "Quincenal", MONTHLY: "Mensual" };

export const SUB_STATUS: Record<string, { label: string; tone: Tone }> = {
  ACTIVE: { label: "Activa", tone: "good" },
  PAUSED: { label: "Pausada", tone: "warn" },
  CANCELLED: { label: "Cancelada", tone: "bad" },
};

export const PLACEMENT_LABEL: Record<string, string> = {
  HOME_BANNER: "Banner en inicio",
  CATEGORY_FEATURED: "Destacado en categoría",
  SPONSORED_PRODUCT: "Producto patrocinado",
};

export type Tone = "good" | "warn" | "bad" | "info" | "muted";

/** Imagen de respaldo según el tueste cuando la marca aún no sube foto. */
export function productImage(p: { imageUrl?: string | null; roast: string }) {
  if (p.imageUrl) return p.imageUrl;
  const lvl = ROAST_LEVEL[p.roast] ?? 3;
  return lvl <= 2 ? "/images/products/light.jpg" : lvl === 3 ? "/images/products/medium.jpg" : "/images/products/dark.jpg";
}

export const DEPARTMENTS = [
  "Amazonas", "Antioquia", "Arauca", "Atlántico", "Bogotá D.C.", "Bolívar", "Boyacá", "Caldas", "Caquetá", "Casanare",
  "Cauca", "Cesar", "Chocó", "Córdoba", "Cundinamarca", "Guainía", "Guaviare", "Huila", "La Guajira", "Magdalena",
  "Meta", "Nariño", "Norte de Santander", "Putumayo", "Quindío", "Risaralda", "San Andrés", "Santander", "Sucre",
  "Tolima", "Valle del Cauca", "Vaupés", "Vichada",
];
