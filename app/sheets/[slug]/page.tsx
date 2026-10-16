export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { PrintButton } from "@/components/PrintButton";
import { breadcrumbLd, pageAlternates } from "@/lib/seo";
import { categoryById } from "@/lib/taxonomy";
import { formatMinutes, SITE_NAME, SITE_URL, tipsForCategory } from "@/lib/tips";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const category = categoryById((await params).slug);
  if (!category) return { title: "Not found", robots: { index: false, follow: false } };
  return {
    title: `${category.name} cheat sheet`,
    description: category.sheetIntro,
    alternates: pageAlternates(category.sheet),
  };
}

export default async function SheetPage({ params }: { params: Promise<{ slug: string }> }) {
  const category = categoryById((await params).slug);
  if (!category) notFound();
  const tips = tipsForCategory(category.id);
  if (!tips.length) notFound();
  const url = `${SITE_URL}${category.sheet}`;
  const ld = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: `${category.name} cheat sheet`,
      description: category.sheetIntro,
      url,
      inLanguage: "en",
      publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `${category.name} cheat sheet`,
      itemListElement: tips.map((tip, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: tip.title,
        url: `${SITE_URL}/tips/${tip.slug}`,
      })),
    },
    breadcrumbLd([
      { name: "Home", url: SITE_URL },
      { name: "Cheat sheets", url: `${SITE_URL}/sheets` },
      { name: category.name, url },
    ]),
  ];
  return (
    <main className="article">
      <JsonLd data={ld} />
      <nav className="crumbs print-hide" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span aria-hidden="true"> / </span>
        <Link href="/sheets">Cheat sheets</Link>
        <span aria-hidden="true"> / </span>
        <span aria-current="page">{category.name}</span>
      </nav>
      <p className="kicker">{SITE_NAME}</p>
      <h1>{category.name} cheat sheet</h1>
      <p className="dek">{category.sheetIntro}</p>
      <p className="count-line print-hide">
        <PrintButton /> <Link href={category.path}>Read the {category.name} tips</Link>
      </p>
      <ol className="checklist">
        {tips.map((tip) => (
          <li key={tip.slug}>
            <h2>{tip.title}</h2>
            <p>
              {tip.summary} {tip.difficulty}. About {formatMinutes(tip.minutes)}. {tip.devices.join(", ")}.
            </p>
            <p>
              <strong>Why it matters.</strong> {tip.why}
            </p>
            <ol>
              {tip.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            <p className="print-hide">
              <Link href={`/tips/${tip.slug}`}>Full tip</Link>
            </p>
          </li>
        ))}
      </ol>
    </main>
  );
}
