import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { tips, getTip, SITE_URL, SITE_NAME } from "@/lib/tips";
import Newsletter from "../../Newsletter";

export const dynamicParams = false;
export function generateStaticParams() { return tips.map((t) => ({ slug: t.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const t = getTip((await params).slug); if (!t) return {};
  return { title: t.title, description: t.summary, alternates: { canonical: `/tips/${t.slug}` },
    openGraph: { title: t.title, description: t.summary, type: "article", url: `/tips/${t.slug}`, publishedTime: t.date } };
}

export default async function TipPage({ params }: { params: Promise<{ slug: string }> }) {
  const t = getTip((await params).slug); if (!t) notFound();
  const url = `${SITE_URL}/tips/${t.slug}`;
  const ld = [
    { "@context": "https://schema.org", "@type": "HowTo", name: t.title, description: t.summary, url, datePublished: t.date,
      step: t.steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, text: s })) },
    { "@context": "https://schema.org", "@type": "Article", headline: t.title, description: t.summary, datePublished: t.date,
      mainEntityOfPage: url, publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL } },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: t.title, item: url } ] },
  ];
  const prev = tips.find((x) => x.n === t.n - 1), next = tips.find((x) => x.n === t.n + 1);
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <article>
        <div className="meta">Tip #{t.n} · {t.category} · {t.date} · Works on: {t.devices.join(", ")}</div>
        <h1>{t.title}</h1>
        <p><strong>{t.summary}</strong></p>
        <h2>How to do it</h2>
        <ol className="steps">{t.steps.map((s) => <li key={s}>{s}</li>)}</ol>
        {t.body.map((p) => <p key={p}>{p}</p>)}
      </article>
      <Newsletter />
      <nav className="meta">{prev && <Link href={`/tips/${prev.slug}`}>← {prev.title}</Link>} {next && <> · <Link href={`/tips/${next.slug}`}>{next.title} →</Link></>}</nav>
    </main>
  );
}
