/** Íconos SVG en línea (trazo, heredan currentColor). */
type P = { className?: string };
const base = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, viewBox: "0 0 24 24" };

export const BagIcon = (p: P) => (
  <svg {...base} {...p} aria-hidden><path d="M6 7h12l1 13H5L6 7Z" /><path d="M9 7a3 3 0 0 1 6 0" /></svg>
);
export const UserIcon = (p: P) => (
  <svg {...base} {...p} aria-hidden><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>
);
export const MenuIcon = (p: P) => (
  <svg {...base} {...p} aria-hidden><path d="M4 7h16M4 12h16M4 17h16" /></svg>
);
export const CloseIcon = (p: P) => (
  <svg {...base} {...p} aria-hidden><path d="M6 6l12 12M18 6 6 18" /></svg>
);
export const SearchIcon = (p: P) => (
  <svg {...base} {...p} aria-hidden><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
);
export const ChartIcon = (p: P) => (
  <svg {...base} {...p} aria-hidden><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></svg>
);
export const BoxIcon = (p: P) => (
  <svg {...base} {...p} aria-hidden><path d="M21 8 12 3 3 8v8l9 5 9-5V8Z" /><path d="m3 8 9 5 9-5M12 13v8" /></svg>
);
export const TruckIcon = (p: P) => (
  <svg {...base} {...p} aria-hidden><path d="M3 6h11v10H3zM14 10h4l3 3v3h-7" /><circle cx="7" cy="18" r="2" /><circle cx="17" cy="18" r="2" /></svg>
);
export const WalletIcon = (p: P) => (
  <svg {...base} {...p} aria-hidden><rect x="3" y="6" width="18" height="14" rx="2" /><path d="M3 10h18M16 15h2" /></svg>
);
export const MegaphoneIcon = (p: P) => (
  <svg {...base} {...p} aria-hidden><path d="M3 11v2a1 1 0 0 0 1 1h3l6 4V6L7 10H4a1 1 0 0 0-1 1ZM17 9a4 4 0 0 1 0 6" /></svg>
);
export const StoreIcon = (p: P) => (
  <svg {...base} {...p} aria-hidden><path d="M4 10v10h16V10M3 4h18l-1 6H4L3 4ZM9 20v-6h6v6" /></svg>
);
export const RepeatIcon = (p: P) => (
  <svg {...base} {...p} aria-hidden><path d="M17 2l4 4-4 4" /><path d="M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4" /><path d="M21 13v2a3 3 0 0 1-3 3H3" /></svg>
);
export const PinIcon = (p: P) => (
  <svg {...base} {...p} aria-hidden><path d="M12 21s-7-6.5-7-12a7 7 0 0 1 14 0c0 5.5-7 12-7 12Z" /><circle cx="12" cy="9" r="2.5" /></svg>
);
export const ReceiptIcon = (p: P) => (
  <svg {...base} {...p} aria-hidden><path d="M5 3h14v18l-3-2-2 2-2-2-2 2-2-2-3 2V3Z" /><path d="M9 8h6M9 12h6" /></svg>
);
export const ShieldIcon = (p: P) => (
  <svg {...base} {...p} aria-hidden><path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Z" /><path d="m9 12 2 2 4-4" /></svg>
);

export const CumbreLogo = ({ size = 34, className }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    className={className}
    aria-label="Logo de Cumbre"
    role="img"
  >
    <rect x="2" y="2" width="60" height="60" rx="10" fill="#181310" stroke="#B84A27" strokeWidth="2.5" />
    <circle cx="32" cy="20" r="6.5" fill="#D9822B" fillOpacity="0.22" stroke="#D9822B" strokeWidth="2" />
    <path d="M30.5 14.5C32.5 17.5 31.5 21.5 33.5 25.5" stroke="#D9822B" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M10 47L23 27L33 38L42 28L54 47H10Z" fill="#B84A27" fillOpacity="0.28" />
    <path d="M10 47L23 27L33 38L42 28L54 47" stroke="#FAF7F2" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14 52H50" stroke="#D9822B" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);

