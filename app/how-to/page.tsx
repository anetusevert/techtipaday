export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { comparePath } from "@/lib/compare";
import { breadcrumbLd, collectionLd, pageAlternates } from "@/lib/seo";
import { hubPath, liveCompares, liveHubs, SITE_URL, tipsForHub } from "@/lib/tips";

export const metadata: Metadata = {
  title: "Find a tech tip by task",
  description: "Start with the job, not the device. Tips grouped by task, like speeding up a slow Windows laptop, saving iPhone battery or locking down privacy settings.",
  alternates: pageAlternates("/how-to"),
};

export default function HowToIndex() {
  const hubs = liveHubs();
  const compares = liveCompares();
  const url = `${SITE_URL}/how-to`;
  const ld = [
    collectionLd({
      name: "Find a tech tip by task",
      url,
      description: "Tips grouped by the job you are trying to get done.",
      items: hubs.map((hub) => ({ name: hub.title, url: `${SITE_URL}${hubPath(hub)}` })),
    }),
    breadcrumbLd([
      { name: "Home", url: SITE_URL },
      { name: "By task", url },
    ]),
  ];
  return (
    <main>
      <JsonLd data={ld} />
      <p className="kicker">By task</p>
      <h1>Find a tech tip by task</h1>
      <p className="dek">
        Start with the thing you are trying to do. Each page pulls together the tips for one task, with the short answer first. A task shows up here once at least two tips cover it.
      </p>
      <ul className="link-grid">
        {hubs.map((hub) => {
          const n = tipsForHub(hub.id).length;
          return (
            <li key={hub.id}>
              <Link href={hubPath(hub)}>
                <small>{n} tips</small>
                {hub.title}
              </Link>
            </li>
          );
        })}
      </ul>
      <section className="block">
        <div className="block-head">
          <h2>Comparisons and alternatives</h2>
          <Link href="/compare">See all</Link>
        </div>
        <ul className="link-grid">
          {compares.map((page) => (
            <li key={page.slug}>
              <Link href={comparePath(page)}>
                <small>{page.kind === "alternatives" ? "Alternatives" : "Compare"}</small>
                {page.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
