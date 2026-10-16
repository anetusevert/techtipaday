import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { JsonLd } from "@/components/JsonLd";
import { Newsletter } from "@/components/Newsletter";
import { Reveal } from "@/components/Reveal";
import { TipActions } from "@/components/TipActions";
import { pageAlternates } from "@/lib/seo";
import { byNewest, formatDate, getLiveTip, shareTip, SITE_NAME, SITE_URL, tipUrl } from "@/lib/tips";

// Rendered per request so a future slug 404s until its calendar date, then resolves
// without waiting for a rebuild or a cached 404.
export const dynamic = "force-dynamic";

async function resolveLive(slug: string) {
  return getLiveTip(slug);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const tip = await resolveLive((await params).slug);
  if (!tip) return { title: "Not found", robots: { index: false, follow: false } };
  return {
    title: tip.title,
    description: tip.summary,
    alternates: pageAlternates(`/tips/${tip.slug}`),
    openGraph: {
      title: tip.title,
      description: tip.summary,
      type: "article",
      url: `/tips/${tip.slug}`,
      publishedTime: tip.date,
    },
  };
}

export default async function TipPage({ params }: { params: Promise<{ slug: string }> }) {
  const tip = await resolveLive((await params).slug);
  if (!tip) notFound();
  const url = tipUrl(tip.slug);
  const live = byNewest();
  const index = live.findIndex((item) => item.slug === tip.slug);
  const newer = index > 0 ? live[index - 1] : undefined;
  const older = index >= 0 && index < live.length - 1 ? live[index + 1] : undefined;
  const ld = [
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: tip.title,
      description: tip.summary,
      url,
      datePublished: tip.date,
      inLanguage: "en",
      step: tip.steps.map((step, i) => ({ "@type": "HowToStep", position: i + 1, text: step })),
    },
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: tip.title,
      description: tip.summary,
      datePublished: tip.date,
      dateModified: tip.date,
      inLanguage: "en",
      mainEntityOfPage: url,
      publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: tip.title, item: url },
      ],
    },
  ];

  return (
    <main>
      <JsonLd data={ld} />
      <article className="article">
        <p className="eyebrow">
          <Link href="/" transitionTypes={["nav-back"]}>
            Today
          </Link>
          <span aria-hidden="true"> / </span>
          Tip #{tip.n} · {tip.category} · <time dateTime={tip.date}>{formatDate(tip.date)}</time>
        </p>
        <ViewTransition name={`tip-title-${tip.slug}`} share="morph" default="none">
          <h1>{tip.title}</h1>
        </ViewTransition>
        <p className="summary">
          <strong>{tip.summary}</strong>
        </p>
        <ul className="device-list">
          {tip.devices.map((device) => (
            <li key={device}>{device}</li>
          ))}
        </ul>
        <TipActions tip={shareTip(tip)} />
        <h2>How to do it</h2>
        <ol className="steps">
          {tip.steps.map((step, index) => (
            <li key={step}>
              <span className="step-n" aria-hidden="true">
                {index + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
        {tip.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        <nav className="neighbors" aria-label="More tips">
          {newer ? (
            <Link href={`/tips/${newer.slug}`} transitionTypes={["nav-forward"]}>
              <small>Newer</small>
              {newer.title}
            </Link>
          ) : (
            <Link href="/" transitionTypes={["nav-back"]}>
              <small>Today</small>
              Back to the latest tip
            </Link>
          )}
          {older ? (
            <Link href={`/tips/${older.slug}`} transitionTypes={["nav-back"]}>
              <small>Earlier</small>
              {older.title}
            </Link>
          ) : null}
        </nav>
      </article>
      <Reveal>
        <Newsletter level={2} />
      </Reveal>
    </main>
  );
}
