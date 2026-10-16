export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { Filters } from "@/components/Filters";
import { JsonLd } from "@/components/JsonLd";
import { SearchForm } from "@/components/SearchForm";
import { TipRiver } from "@/components/TipRiver";
import { breadcrumbLd, collectionLd, pageAlternates } from "@/lib/seo";
import {
  byNewest,
  filterTips,
  isCategory,
  isDifficulty,
  isPlatform,
  searchPages,
  SITE_DESC,
  SITE_URL,
  tipUrl,
  type TipQuery,
} from "@/lib/tips";
import Link from "next/link";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<TipQuery>;
}): Promise<Metadata> {
  const query = await searchParams;
  const title = query.q ? `Search: ${query.q}` : query.sort === "popular" ? "Popular tips" : "All tips";
  return {
    title,
    description: `Every live TechTipADay tip. ${SITE_DESC}`,
    alternates: pageAlternates("/tips"),
    robots: query.q ? { index: false, follow: true } : undefined,
  };
}

export default async function TipsPage({ searchParams }: { searchParams: Promise<TipQuery> }) {
  const raw = await searchParams;
  const query: TipQuery = {
    q: raw.q?.toString(),
    platform: isPlatform(raw.platform) ? raw.platform : undefined,
    difficulty: isDifficulty(raw.difficulty) ? raw.difficulty : undefined,
    sort: raw.sort === "popular" ? "popular" : undefined,
    category: isCategory(raw.category) ? raw.category : undefined,
  };
  const list = filterTips(byNewest(), query);
  const pages = query.q ? searchPages(query.q) : [];
  const url = `${SITE_URL}/tips`;
  const ld = [
    collectionLd({
      name: "All tips",
      description: SITE_DESC,
      url,
      items: list.map((tip) => ({ name: tip.title, url: tipUrl(tip.slug) })),
    }),
    breadcrumbLd([
      { name: "Home", url: SITE_URL },
      { name: "Tips", url },
    ]),
  ];

  return (
    <main>
      <JsonLd data={ld} />
      <p className="kicker">Archive</p>
      <h1>{query.sort === "popular" ? "Popular tips" : "All tips"}</h1>
      <p className="dek">Every tip here is already live. Future days stay off the list and return 404 until their date.</p>
      <SearchForm q={query.q ?? ""} labelled />
      <Filters query={query} counts={{ label: "tips", n: list.length }} />
      {pages.length ? (
        <section className="block">
          <h2>Matching pages</h2>
          <ul className="link-grid">
            {pages.map((page) => (
              <li key={page.href}>
                <Link href={page.href}>
                  <small>{page.kind}</small>
                  {page.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      <TipRiver tips={list} />
    </main>
  );
}
