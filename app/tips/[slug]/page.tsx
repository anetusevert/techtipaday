import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { Newsletter } from "@/components/Newsletter";
import { TipActions } from "@/components/TipActions";
import { breadcrumbLd, pageAlternates } from "@/lib/seo";
import { appBySlug } from "@/lib/landings";
import { categoryById, categoryName } from "@/lib/taxonomy";
import {
  fixPage,
  formatDate,
  formatMinutes,
  getLiveTip,
  neighbors,
  relatedTips,
  shareTip,
  SITE_NAME,
  SITE_URL,
  tipUrl,
  tipsForFix,
} from "@/lib/tips";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const tip = getLiveTip((await params).slug);
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
  const tip = getLiveTip((await params).slug);
  if (!tip) notFound();
  const url = tipUrl(tip.slug);
  const cat = categoryById(tip.category);
  const { newer, older } = neighbors(tip);
  const related = relatedTips(tip);
  const task = fixPage(tip.task.slug);
  const taskLive = tipsForFix(tip.task.slug).length > 0;
  const crumbs = [
    { name: "Home", href: "/" },
    { name: cat?.name ?? categoryName(tip.category), href: cat?.path ?? "/tips" },
    { name: tip.title, href: `/tips/${tip.slug}` },
  ];
  const ld = [
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: tip.title,
      description: tip.summary,
      url,
      totalTime: `PT${tip.minutes}M`,
      datePublished: tip.date,
      inLanguage: "en",
      step: tip.steps.map((step, i) => ({ "@type": "HowToStep", position: i + 1, name: `Step ${i + 1}`, text: step })),
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
      <h1>{tip.title}</h1>
      <p className="dek">{tip.summary}</p>
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
        {task && taskLive ? (
          <li>
            <Link href={task.path}>Fix: {task.h1.replace(/^How to /, "")}</Link>
          </li>
        ) : null}
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
      <aside className="why">
        <p className="kicker">Why it matters</p>
        <p>{tip.why}</p>
      </aside>
      <TipActions tip={shareTip(tip)} />
      <h2>How to do it</h2>
      <ol className="steps">
        {tip.steps.map((step, index) => (
          <li key={step}>
            <span className="step-no" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <p>{step}</p>
          </li>
        ))}
      </ol>
      {tip.body.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
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
