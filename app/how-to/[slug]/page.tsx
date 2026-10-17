export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Faq } from "@/components/Faq";
import { JsonLd } from "@/components/JsonLd";
import { Newsletter } from "@/components/Newsletter";
import { COMPARES, comparePath } from "@/lib/compare";
import { hubBySlug } from "@/lib/landings";
import { breadcrumbLd, collectionLd, faqLd, metaDescription, pageAlternates } from "@/lib/seo";
import { categoryName, PLATFORMS } from "@/lib/taxonomy";
import { formatMinutes, hubFaq, hubPath, isHubLive, relatedHubs, seoOf, SITE_URL, tipsForHub, tipUrl } from "@/lib/tips";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const hub = hubBySlug((await params).slug);
  if (!hub || !isHubLive(hub)) return { title: "Not found", robots: { index: false, follow: false } };
  const description = metaDescription(hub.title, hub.intro);
  return {
    title: hub.title,
    description,
    alternates: pageAlternates(hubPath(hub)),
    openGraph: { title: hub.title, description, url: hubPath(hub) },
  };
}

export default async function HowToPage({ params }: { params: Promise<{ slug: string }> }) {
  const hub = hubBySlug((await params).slug);
  // A hub is published only once it has MIN_HUB_TIPS live tips. Before that it 404s.
  if (!hub || !isHubLive(hub)) notFound();
  const tips = tipsForHub(hub.id);
  const faq = hubFaq(hub);
  const path = hubPath(hub);
  const url = `${SITE_URL}${path}`;
  const related = relatedHubs(hub);
  const compares = COMPARES.filter((page) => page.intents?.includes(hub.id));
  const platforms = PLATFORMS.filter((platform) => tips.some((tip) => tip.platforms.includes(platform.id)));
  const ld = [
    collectionLd({ name: hub.title, url, description: hub.intro, items: tips.map((tip) => ({ name: tip.title, url: tipUrl(tip.slug) })) }),
    breadcrumbLd([
      { name: "Home", url: SITE_URL },
      { name: "By task", url: `${SITE_URL}/how-to` },
      { name: hub.title, url },
    ]),
    faqLd(faq),
  ];
  return (
    <main className="article">
      <JsonLd data={ld} />
      <nav className="crumbs" aria-label="Breadcrumb">
        <span>
          <Link href="/">Home</Link>
        </span>
        <span>
          <span aria-hidden="true"> / </span>
          <Link href="/how-to">By task</Link>
        </span>
        <span>
          <span aria-hidden="true"> / </span>
          <span aria-current="page">{hub.title}</span>
        </span>
      </nav>
      <p className="kicker">By task · {tips.length} tips</p>
      <h1>{hub.title}</h1>
      <p className="dek">{hub.intro}</p>
      <ol className="guide-list">
        {tips.map((tip, index) => (
          <li key={tip.slug}>
            <span className="guide-no" aria-hidden="true">
              {index + 1}
            </span>
            <div>
              <h2>
                <Link href={`/tips/${tip.slug}`}>{tip.title}</Link>
              </h2>
              <p>{seoOf(tip).answer}</p>
              <p className="guide-note">
                <strong>Use it when:</strong> {seoOf(tip).useWhen}
              </p>
              <p className="guide-meta">
                {categoryName(tip.category)} · {tip.difficulty} · {formatMinutes(tip.minutes)} ·{" "}
                <Link href={`/tips/${tip.slug}`}>Full steps</Link>
              </p>
            </div>
          </li>
        ))}
      </ol>
      <Faq items={faq} />
      {compares.length ? (
        <section className="block">
          <h2>Compare the options</h2>
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
      ) : null}
      {related.length ? (
        <section className="block">
          <h2>Related tasks</h2>
          <ul className="link-grid">
            {related.map((item) => (
              <li key={item.hub.id}>
                <Link href={hubPath(item.hub)}>
                  <small>{item.count} tips</small>
                  {item.hub.title}
                </Link>
              </li>
            ))}
            {platforms.map((platform) => (
              <li key={platform.id}>
                <Link href={platform.path}>
                  <small>Device</small>
                  {platform.h1}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      <Newsletter />
    </main>
  );
}
