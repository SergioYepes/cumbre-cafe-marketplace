import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Cumbre — Café de especialidad",
    short_name: "Cumbre",
    description: "Marketplace de café de especialidad colombiano",
    start_url: "/",
    display: "standalone",
    background_color: "#120d0a",
    theme_color: "#120d0a",
    lang: "es-CO",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
