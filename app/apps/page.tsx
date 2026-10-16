export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd, collectionLd, pageAlternates } from "@/lib/seo";
import { liveAppPages, SITE_URL, tipsForApp } from "@/lib/tips";

export const metadata: Metadata = {
  title: "Apps",
  description: "Tips grouped by the app they use: ChatGPT, Claude, Gemini, and the built-in tools.",
  alternates: pageAlternates("/apps"),
};

export default function AppsIndex() {
  const apps = liveAppPages();
  const url = `${SITE_URL}/apps`;
  const ld = [
    collectionLd({
      name: "Apps",
      description: "Tips grouped by app.",
      url,
      items: apps.map((app) => ({ name: app.h1, url: `${SITE_URL}/apps/${app.slug}` })),
    }),
    breadcrumbLd([
      { name: "Home", url: SITE_URL },
      { name: "Apps", url },
    ]),
  ];
  return (
    <main>
      <JsonLd data={ld} />
      <p className="kicker">Apps</p>
      <h1>Tips by app</h1>
      <p className="dek">Each app page lists the live tips that mention it. The page stays hidden until the first of those tips is published.</p>
      <ul className="link-grid">
        {apps.map((app) => {
          const n = tipsForApp(app.slug).length;
          return (
            <li key={app.slug}>
              <Link href={`/apps/${app.slug}`}>
                <small>
                  {n} {n === 1 ? "tip" : "tips"}
                </small>
                {app.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
