export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd, collectionLd, pageAlternates } from "@/lib/seo";
import { CATEGORIES } from "@/lib/taxonomy";
import { SITE_URL, tipsForCategory } from "@/lib/tips";

export const metadata: Metadata = {
  title: "Cheat sheets",
  description: "Printable HTML cheat sheets, one per TechTipADay topic.",
  alternates: pageAlternates("/sheets"),
};

export default function SheetsIndex() {
  const sheets = CATEGORIES.filter((category) => tipsForCategory(category.id).length > 0);
  const url = `${SITE_URL}/sheets`;
  const ld = [
    collectionLd({
      name: "Cheat sheets",
      description: "Printable checklists for each topic.",
      url,
      items: sheets.map((category) => ({ name: `${category.name} cheat sheet`, url: `${SITE_URL}${category.sheet}` })),
    }),
    breadcrumbLd([
      { name: "Home", url: SITE_URL },
      { name: "Cheat sheets", url },
    ]),
  ];
  return (
    <main>
      <JsonLd data={ld} />
      <p className="kicker">Printable</p>
      <h1>Cheat sheets</h1>
      <p className="dek">One HTML page per topic. Open it and print. Each sheet lists only tips that are already live.</p>
      <ul className="link-grid">
        {sheets.map((category) => (
          <li key={category.id}>
            <Link href={category.sheet}>
              <small>{tipsForCategory(category.id).length} tips</small>
              {category.name} cheat sheet
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
