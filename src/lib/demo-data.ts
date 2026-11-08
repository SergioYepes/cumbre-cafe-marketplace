export type DemoProduct = {
  id: string;
  name: string;
  brand: string;
  origin: string;
  process: string;
  roast: string;
  notes: string[];
  priceCop: number;
  weight: string;
  roastedDaysAgo: number;
  score: number;
  sponsored?: boolean;
  gradient: string;
  emoji: string;
};

export const demoProducts: DemoProduct[] = [
  { id: "1", name: "Geisha Washed", brand: "Finca Aurora", origin: "Huila", process: "Lavado", roast: "Claro", notes: ["Jazmín", "Bergamota", "Durazno"], priceCop: 78000, weight: "250 g", roastedDaysAgo: 3, score: 89, sponsored: true, gradient: "linear-gradient(135deg,#3b2a1c,#7a4a2a)", emoji: "☕" },
  { id: "2", name: "Caturra Honey", brand: "Tostadores del Sur", origin: "Nariño", process: "Honey", roast: "Medio", notes: ["Panela", "Mandarina", "Cacao"], priceCop: 42000, weight: "340 g", roastedDaysAgo: 5, score: 85, gradient: "linear-gradient(135deg,#40281a,#a05d2c)", emoji: "🫘" },
  { id: "3", name: "Pink Bourbon", brand: "Altura Café", origin: "Huila", process: "Natural", roast: "Claro", notes: ["Frambuesa", "Rosas", "Miel"], priceCop: 65000, weight: "250 g", roastedDaysAgo: 2, score: 87, gradient: "linear-gradient(135deg,#3a1f24,#9c4a52)", emoji: "☕" },
  { id: "4", name: "Castillo Espresso", brand: "Tostadores del Sur", origin: "Cauca", process: "Lavado", roast: "Medio-oscuro", notes: ["Chocolate", "Nuez", "Caramelo"], priceCop: 38000, weight: "500 g", roastedDaysAgo: 6, score: 83, gradient: "linear-gradient(135deg,#2a1b12,#5e3b24)", emoji: "🫘" },
  { id: "5", name: "Sidra Anaeróbico", brand: "Finca Aurora", origin: "Quindío", process: "Anaeróbico", roast: "Claro", notes: ["Vino tinto", "Cereza", "Canela"], priceCop: 95000, weight: "250 g", roastedDaysAgo: 4, score: 90, gradient: "linear-gradient(135deg,#2c1226,#7d2d5a)", emoji: "☕" },
  { id: "6", name: "Tabi Natural", brand: "Altura Café", origin: "Santander", process: "Natural", roast: "Medio", notes: ["Mango", "Panela", "Flor de naranjo"], priceCop: 52000, weight: "340 g", roastedDaysAgo: 7, score: 86, gradient: "linear-gradient(135deg,#3a2a12,#b07a2a)", emoji: "🫘" },
];

export const demoBrands = [
  { name: "Finca Aurora", city: "Pitalito, Huila", blurb: "Lotes exóticos de microproductores familiares.", color: "#e0a458" },
  { name: "Tostadores del Sur", city: "Pasto, Nariño", blurb: "Tueste artesanal, café de altura del sur colombiano.", color: "#c76b3a" },
  { name: "Altura Café", city: "Bogotá", blurb: "Selección de cosechas y perfiles de tueste claros.", color: "#d9c3a0" },
];

export const roastFilters = ["Todos", "Claro", "Medio", "Medio-oscuro"];

export const formatCop = (n: number) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);
