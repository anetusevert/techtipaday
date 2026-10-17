export const dynamic = "force-dynamic";

import type { MetadataRoute } from "next";
import { comparePath } from "@/lib/compare";
import { CATEGORIES } from "@/lib/taxonomy";
import {
  byNewest,
  hubPath,
  indexableAppPages,
  liveCompares,
  liveDevicePages,
  liveHubs,
  liveTopicPages,
  SITE_URL,
  tipsForCategory,
  tipsForHub,
} from "@/lib/tips";

/** Every indexable page, www URLs only. Thin pages (below MIN_HUB_TIPS) are left out on purpose. */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/tips`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/how-to`, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/compare`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/apps`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/categories`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/sheets`, changeFrequency: "weekly", priority: 0.5 },
    { url: `${SITE_URL}/timeline`, changeFrequency: "daily", priority: 0.4 },
    { url: `${SITE_URL}/subscribe`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/about`, changeFrequency: "yearly", priority: 0.3 },
  ];
  return [
    ...staticPages,
    ...liveDevicePages().map((device) => ({ url: `${SITE_URL}${device.path}`, changeFrequency: "daily" as const, priority: 0.8 })),
    ...liveTopicPages().map((topic) => ({ url: `${SITE_URL}${topic.path}`, changeFrequency: "daily" as const, priority: 0.7 })),
    ...liveHubs().map((hub) => ({
      url: `${SITE_URL}${hubPath(hub)}`,
      lastModified: tipsForHub(hub.id)[0]?.date,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...liveCompares().map((page) => ({
      url: `${SITE_URL}${comparePath(page)}`,
      lastModified: page.checked,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...indexableAppPages().map((app) => ({ url: `${SITE_URL}/apps/${app.slug}`, changeFrequency: "weekly" as const, priority: 0.6 })),
    ...CATEGORIES.filter((category) => tipsForCategory(category.id).length > 0).map((category) => ({
      url: `${SITE_URL}${category.sheet}`,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    })),
    ...byNewest().map((tip) => ({
      url: `${SITE_URL}/tips/${tip.slug}`,
      lastModified: tip.date,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
