import type { MetadataRoute } from "next";
import { SITE_DESC, SITE_NAME } from "@/lib/tips";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME}: one tech tip a day`,
    short_name: SITE_NAME,
    description: SITE_DESC,
    id: "/",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#0b1020",
    theme_color: "#0b1020",
    lang: "en",
    categories: ["education", "utilities"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
