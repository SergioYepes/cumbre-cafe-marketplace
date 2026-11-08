export const slugify = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const num = (name: string, fallback: number) => {
  const v = Number(process.env[name]);
  return Number.isFinite(v) && process.env[name] !== undefined && process.env[name] !== "" ? v : fallback;
};

export const config = {
  defaultCommissionBps: () => num("DEFAULT_COMMISSION_BPS", 1500),
  payoutHoldDays: () => num("PAYOUT_HOLD_DAYS", 3),
  defaultShippingCop: () => num("DEFAULT_SHIPPING_COP", 12000),
  codMaxTotalCop: () => num("COD_MAX_TOTAL_COP", 300000),
};

export const addDays = (d: Date, days: number) => new Date(d.getTime() + days * 86_400_000);

/** Un lote es fresco si se tostó hace menos de `maxFreshDays` días. Sin fecha de tueste → se asume fresco. */
export function isFresh(roastedAt: Date | null, maxFreshDays: number, now = new Date()) {
  if (!roastedAt) return true;
  return addDays(roastedAt, maxFreshDays) >= now;
}
