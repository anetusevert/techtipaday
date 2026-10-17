export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { COMPARE_KIND_LABEL, comparePath } from "@/lib/compare";
import { breadcrumbLd, collectionLd, pageAlternates } from "@/lib/seo";
import { liveCompares, SITE_URL } from "@/lib/tips";

export const metadata: Metadata = {
  title: "Tech comparisons and alternatives",
  description: "Honest side-by-side comparisons, like Google Photos vs iCloud Photos or CCleaner vs Storage Sense, plus alternatives pages. Each one ends with a plain verdict.",
  alternates: pageAlternates("/compare"),
};

export default function CompareIndex() {
  const all = liveCompares();
  const compares = all.filter((page) => page.kind !== "alternatives");
  const alternatives = all.filter((page) => page.kind === "alternatives");
  const url = `${SITE_URL}/compare`;
  const ld = [
    collectionLd({
      name: "Tech comparisons and alternatives",
      url,
      description: "Side-by-side comparisons and alternatives pages, each with a written verdict.",
      items: all.map((page) => ({ name: page.title, url: `${SITE_URL}${comparePath(page)}` })),
    }),
    breadcrumbLd([
      { name: "Home", url: SITE_URL },
      { name: "Compare", url },
    ]),
  ];
  return (
    <main>
      <JsonLd data={ld} />
      <p className="kicker">Compare</p>
      <h1>Tech comparisons and alternatives</h1>
      <p className="dek">
        Side-by-side looks at the things people search before they install something. Often the setting you already have is enough, and these pages say so.
      </p>
      <ul className="link-grid">
        {compares.map((page) => (
          <li key={page.slug}>
            <Link href={comparePath(page)}>
              <small>{COMPARE_KIND_LABEL[page.kind]}</small>
              {page.title}
            </Link>
          </li>
        ))}
      </ul>
      {alternatives.length ? (
        <section className="block">
          <h2 id="alternatives">Alternatives</h2>
          <ul className="link-grid">
            {alternatives.map((page) => (
              <li key={page.slug}>
                <Link href={comparePath(page)}>
                  <small>Alternatives</small>
                  {page.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </main>
  );
}
