export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd, collectionLd, pageAlternates } from "@/lib/seo";
import { CATEGORIES } from "@/lib/taxonomy";
import { SITE_URL, tipsForCategory } from "@/lib/tips";

export const metadata: Metadata = {
  title: "Topics",
  description: "TechTipADay topics, from iPhone and Android to privacy and AI tools.",
  alternates: pageAlternates("/categories"),
};

export default function CategoriesPage() {
  const topics = CATEGORIES.map((category) => ({ category, n: tipsForCategory(category.id).length })).filter((item) => item.n > 0);
  const url = `${SITE_URL}/categories`;
  const ld = [
    collectionLd({
      name: "Topics",
      description: "TechTipADay topics.",
      url,
      items: topics.map(({ category }) => ({ name: category.name, url: `${SITE_URL}${category.path}` })),
    }),
    breadcrumbLd([
      { name: "Home", url: SITE_URL },
      { name: "Topics", url },
    ]),
  ];
  return (
    <main>
      <JsonLd data={ld} />
      <p className="kicker">Topics</p>
      <h1>Browse by topic</h1>
      <p className="dek">Device hubs and the subjects that cut across them. Counts are live tips only.</p>
      <ul className="hub-grid">
        {topics.map(({ category, n }) => (
          <li key={category.id}>
            <Link href={category.path}>
              <small>
                {n} {n === 1 ? "tip" : "tips"}
              </small>
              <strong>{category.name}</strong>
              {category.blurb}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
