export const revalidate = 3600;
import type { MetadataRoute } from "next";
import { byNewest, SITE_URL } from "@/lib/tips";
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: SITE_URL, changeFrequency: "daily", priority: 1 }, { url: `${SITE_URL}/about` },
    ...byNewest().map((t) => ({ url: `${SITE_URL}/tips/${t.slug}`, lastModified: t.date, changeFrequency: "monthly" as const, priority: 0.8 }))];
}
