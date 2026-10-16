export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd, collectionLd, pageAlternates } from "@/lib/seo";
import { liveFixPages, SITE_URL, tipsForFix } from "@/lib/tips";

export const metadata: Metadata = {
  title: "Fixes",
  description: "Task pages for the TechTipADay library. Each one lists the live tips for that job.",
  alternates: pageAlternates("/fix"),
};

export default function FixIndex() {
  const pages = liveFixPages();
  const url = `${SITE_URL}/fix`;
  const ld = [
    collectionLd({
      name: "Fixes",
      description: "Task pages for live tips.",
      url,
      items: pages.map((page) => ({ name: page.h1, url: `${SITE_URL}${page.path}` })),
    }),
    breadcrumbLd([
      { name: "Home", url: SITE_URL },
      { name: "Fixes", url },
    ]),
  ];
  return (
    <main>
      <JsonLd data={ld} />
      <p className="kicker">Tasks</p>
      <h1>Fixes</h1>
      <p className="dek">
        One page per job, such as a slow Wi-Fi network or a closed browser tab. A page appears when at least one matching tip is live.
      </p>
      <ul className="link-grid">
        {pages.map((page) => {
          const n = tipsForFix(page.slug).length;
          return (
            <li key={page.slug}>
              <Link href={page.path}>
                <small>
                  {n} {n === 1 ? "tip" : "tips"}
                </small>
                {page.h1}
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
