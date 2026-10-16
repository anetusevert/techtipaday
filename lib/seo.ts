import type { Metadata } from "next";

export const feedTypes = {
  "text/plain": "/llms.txt",
  "application/rss+xml": "/feed.xml",
  "application/feed+json": "/feed.json",
} as const;

/** Canonical plus feed alternates. Child `alternates` replace the layout's, so every page sets both. */
export function pageAlternates(canonical: string): Metadata["alternates"] {
  return { canonical, types: { ...feedTypes } };
}

export function collectionLd(opts: { name: string; url: string; description: string; items: { name: string; url: string }[] }) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: opts.name,
    description: opts.description,
    url: opts.url,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: opts.items.length,
      itemListElement: opts.items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        url: item.url,
      })),
    },
  };
}

export function breadcrumbLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
