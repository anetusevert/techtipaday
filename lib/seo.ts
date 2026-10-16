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
