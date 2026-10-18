import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Faq } from "@/components/Faq";
import { JsonLd } from "@/components/JsonLd";
import { Newsletter } from "@/components/Newsletter";
import { TipActions } from "@/components/TipActions";
import { breadcrumbLd, faqLd, metaDescription, pageAlternates } from "@/lib/seo";
import { appBySlug } from "@/lib/landings";
import { comparePath } from "@/lib/compare";
import { categoryById, categoryName, platformById } from "@/lib/taxonomy";
import {
  comparesForTip,
  formatDate,
  formatMinutes,
  getLiveTip,
  seoOf,
  hubPath,
  hubsForTip,
  neighbors,
  relatedTips,
  shareTip,
  SITE_NAME,
  SITE_URL,
  tipUrl,
} from "@/lib/tips";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const tip = getLiveTip((await params).slug);
  if (!tip) return { title: "Not found", robots: { index: false, follow: false } };
  const description = metaDescription(tip.title, tip.seo.answer);
  return {
    title: tip.title,
    description,
    alternates: pageAlternates(`/tips/${tip.slug}`),
    openGraph: {
      title: tip.title,
      description,
      type: "article",
      url: `/tips/${tip.slug}`,
      publishedTime: tip.date,
    },
  };
}

export default async function TipPage({ params }: { params: Promise<{ slug: string }> }) {
  const tip = getLiveTip((await params).slug);
  if (!tip) notFound();
  const url = tipUrl(tip.slug);
  const cat = categoryById(tip.category);
  const { newer, older } = neighbors(tip);
  const related = relatedTips(tip);
  const hubs = hubsForTip(tip);
  const compares = comparesForTip(tip);
  const seo = seoOf(tip);
  const devices = tip.platforms.map((id) => platformById(id)).filter((p) => !!p);
  const crumbs = [
    { name: "Home", href: "/" },
    hubs[0] ? { name: hubs[0].title, href: hubPath(hubs[0]) } : { name: cat?.name ?? categoryName(tip.category), href: cat?.path ?? "/tips" },
    { name: tip.title, href: `/tips/${tip.slug}` },
  ];
  const ld = [
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: tip.title,
      description: tip.seo.answer,
      url,
      totalTime: `PT${tip.minutes}M`,
      datePublished: tip.date,
      inLanguage: "en",
      step: tip.steps.map((step, i) => ({ "@type": "HowToStep", position: i + 1, name: `Step ${i + 1}`, text: step, url: `${url}#step-${i + 1}` })),
    },
    faqLd(seo.faq),
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: tip.title,
      description: tip.seo.answer,
      datePublished: tip.date,
      dateModified: tip.date,
      inLanguage: "en",
      mainEntityOfPage: url,
      about: seo.searchPhrase,
      keywords: [seo.searchPhrase, ...seo.searchAlternates].join(", "),
      publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    },
    breadcrumbLd(crumbs.map((crumb) => ({ name: crumb.name, url: crumb.href === "/" ? SITE_URL : `${SITE_URL}${crumb.href}` }))),
  ];

  return (
    <main className="article">
      <JsonLd data={ld} />
      <nav className="crumbs" aria-label="Breadcrumb">
        {crumbs.map((crumb, index) => (
          <span key={crumb.href}>
            {index > 0 ? <span aria-hidden="true"> / </span> : null}
            {index === crumbs.length - 1 ? <span aria-current="page">{crumb.name}</span> : <Link href={crumb.href}>{crumb.name}</Link>}
          </span>
        ))}
      </nav>
      <p className="kicker">
        <time dateTime={tip.date}>{formatDate(tip.date, { month: "long", day: "numeric", year: "numeric" })}</time>
      </p>
      {tip.displayName ? <p className="display-name">{tip.displayName}</p> : null}
      <h1>{tip.title}</h1>
      <p className="answer">{tip.seo.answer}</p>
      <ul className="badges">
        {cat ? (
          <li>
            <Link href={cat.path}>{cat.name}</Link>
          </li>
        ) : null}
        <li>
          <span>
            {tip.difficulty} · {formatMinutes(tip.minutes)}
          </span>
        </li>
        {tip.devices.map((device) => (
          <li key={device}>
            <span>{device}</span>
          </li>
        ))}
        {(tip.apps ?? []).map((id) => {
          const app = appBySlug(id);
          return app ? (
            <li key={id}>
              <Link href={`/apps/${app.slug}`}>{app.name}</Link>
            </li>
          ) : null;
        })}
        {cat ? (
          <li>
            <Link href={cat.sheet}>Cheat sheet</Link>
          </li>
        ) : null}
      </ul>
      <TipActions tip={shareTip(tip)} />
      <h2>How to do it</h2>
      <ol className="steps">
        {tip.steps.map((step, index) => (
          <li key={step} id={`step-${index + 1}`}>
            <span className="step-no" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <p>{step}</p>
          </li>
        ))}
      </ol>
      <aside className="why use-when">
        <p className="kicker">When it helps</p>
        <p>{seo.useWhen}</p>
        <p className="kicker">Where it falls short</p>
        <p>{seo.notFor}</p>
      </aside>
      {tip.body.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
      {seo.alternatives.length ? (
        <section className="block">
          <h2>Other ways to do it</h2>
          <ul className="alt-list">
            {seo.alternatives.map((alt) => (
              <li key={alt.name}>
                <h3>
                  {alt.name} <small>{alt.kind === "tool" ? "App" : alt.kind === "manual" ? "By hand" : "Built in"}</small>
                </h3>
                <p>
                  <strong>Pick it if</strong> {alt.pickIt.replace(/^./, (c) => c.toLowerCase())}
                </p>
                <p>
                  <strong>Stick with this tip if</strong> {alt.pickThis.replace(/^./, (c) => c.toLowerCase())}
                </p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      <Faq items={seo.faq} />
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
      {hubs.length || devices.length ? (
        <section className="block">
          <h2>Find more by task</h2>
          <ul className="link-grid">
            {hubs.map((hub) => (
              <li key={hub.id}>
                <Link href={hubPath(hub)}>
                  <small>By task</small>
                  {hub.title}
                </Link>
              </li>
            ))}
            {devices.map((device) => (
              <li key={device.id}>
                <Link href={device.path}>
                  <small>Device</small>
                  {device.h1}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      {related.length ? (
        <section className="block">
          <h2>Related tips</h2>
          <ul className="link-grid">
            {related.map((item) => (
              <li key={item.slug}>
                <Link href={`/tips/${item.slug}`}>
                  <small>{categoryName(item.category)}</small>
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      <nav className="neighbors" aria-label="More tips">
        {newer ? (
          <Link href={`/tips/${newer.slug}`}>
            <small>Newer</small>
            {newer.title}
          </Link>
        ) : (
          <Link href="/">
            <small>Today</small>
            Back to the latest tip
          </Link>
        )}
        {older ? (
          <Link href={`/tips/${older.slug}`}>
            <small>Earlier</small>
            {older.title}
          </Link>
        ) : null}
      </nav>
      <Newsletter />
    </main>
  );
}
