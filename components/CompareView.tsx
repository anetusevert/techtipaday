import Link from "next/link";
import { Faq } from "@/components/Faq";
import { JsonLd } from "@/components/JsonLd";
import { Newsletter } from "@/components/Newsletter";
import { COMPARE_KIND_LABEL, comparePath, type ComparePage, type CompareOption } from "@/lib/compare";
import { hubById } from "@/lib/landings";
import { breadcrumbLd, faqLd, itemListLd, metaDescription, slugify } from "@/lib/seo";
import { formatDate, getLiveTip, hubPath, isHubLive, liveCompares, SITE_NAME, SITE_URL, tipsForCompare } from "@/lib/tips";
import type { Metadata } from "next";
import { pageAlternates } from "@/lib/seo";

export function compareMetadata(page: ComparePage | undefined): Metadata {
  if (!page) return { title: "Not found", robots: { index: false, follow: false } };
  const description = metaDescription(page.title, page.answer);
  const path = comparePath(page);
  return {
    title: page.title,
    description,
    alternates: pageAlternates(path),
    openGraph: { title: page.title, description, type: "article", url: path },
  };
}

function optionHref(option: CompareOption) {
  if (option.affiliateUrl) return { href: option.affiliateUrl, rel: "sponsored noopener", external: true, label: `Visit ${option.name}` };
  if (option.tip && getLiveTip(option.tip)) return { href: `/tips/${option.tip}`, rel: undefined, external: false, label: "How to set it up" };
  if (option.url) return { href: option.url, rel: "noopener", external: true, label: `${option.name} website` };
  return undefined;
}

export function CompareView({ page }: { page: ComparePage }) {
  const alt = page.kind === "alternatives";
  const path = comparePath(page);
  const url = `${SITE_URL}${path}`;
  const tips = tipsForCompare(page.slug);
  const hubs = (page.intents ?? []).map((id) => hubById(id)).filter((hub) => !!hub && isHubLive(hub));
  const others = liveCompares().filter((item) => item.slug !== page.slug).slice(0, 4);
  const ld = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: page.title,
      url,
      description: page.answer,
      dateModified: page.checked,
      inLanguage: "en",
      about: page.options.map((option) => ({ "@type": "Thing", name: option.name })),
      publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    },
    itemListLd({
      name: page.title,
      url,
      items: page.options.map((option) => ({
        name: option.name,
        url: option.tip ? `${SITE_URL}/tips/${option.tip}` : option.url ?? url,
      })),
    }),
    faqLd(page.faq),
    breadcrumbLd([
      { name: "Home", url: SITE_URL },
      { name: "Compare", url: `${SITE_URL}/compare` },
      { name: page.title, url },
    ]),
  ];
  return (
    <main className="article compare">
      <JsonLd data={ld} />
      <nav className="crumbs" aria-label="Breadcrumb">
        <span>
          <Link href="/">Home</Link>
        </span>
        <span>
          <span aria-hidden="true"> / </span>
          <Link href="/compare">Compare</Link>
        </span>
        <span>
          <span aria-hidden="true"> / </span>
          <span aria-current="page">{page.title}</span>
        </span>
      </nav>
      <p className="kicker">
        {COMPARE_KIND_LABEL[page.kind]} · checked <time dateTime={page.checked}>{formatDate(page.checked, { month: "long", day: "numeric", year: "numeric" })}</time>
      </p>
      <h1>{page.title}</h1>
      <section aria-labelledby="verdict-title">
        <h2 id="verdict-title" className="sr">The verdict</h2>
        <p className="answer">
          <strong>The verdict: </strong>
          {page.answer}
        </p>
      </section>

      <h2>Side by side</h2>
      <div className="table-wrap" role="region" aria-label={`${page.title} table`} tabIndex={0}>
        <table className="compare-table">
          <thead>
            <tr>
              <th scope="col">
                <span className="sr">Feature</span>
              </th>
              {page.options.map((option) => (
                <th key={option.name} scope="col">
                  {option.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {page.rows.map((row) => (
              <tr key={row.label}>
                <th scope="row">{row.label}</th>
                {row.values.map((value, index) => (
                  <td key={page.options[index].name}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Which one to pick</h2>
      <ul className="verdict">
        {page.verdict.map((line) => (
          <li key={line.pick}>
            <strong>Pick {line.pick}</strong> if {line.when}
          </li>
        ))}
      </ul>

      <h2>{alt ? "The alternatives" : "The options"}</h2>
      <div className="option-grid">
        {page.options.map((option) => {
          const link = optionHref(option);
          return (
            <section key={option.name} className="option-card" aria-labelledby={`opt-${slugify(option.name)}`}>
              <h3 id={`opt-${slugify(option.name)}`}>{option.name}</h3>
              <p className="option-price">{option.price}</p>
              <p>
                <strong>Best for:</strong> {option.bestFor}
              </p>
              <div className="pros-cons">
                <div>
                  <p className="kicker">Good</p>
                  <ul>
                    {option.pros.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="kicker">Not so good</p>
                  <ul>
                    {option.cons.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
              {link ? (
                link.external ? (
                  <a className="btn btn-ghost" href={link.href} rel={link.rel} target="_blank">
                    {link.label}
                  </a>
                ) : (
                  <Link className="btn btn-ghost" href={link.href}>
                    {link.label}
                  </Link>
                )
              ) : null}
            </section>
          );
        })}
      </div>

      <Faq items={page.faq} />

      {tips.length || hubs.length ? (
        <section className="block">
          <h2>Related tips</h2>
          <ul className="link-grid">
            {tips.map((tip) => (
              <li key={tip.slug}>
                <Link href={`/tips/${tip.slug}`}>
                  <small>Tip</small>
                  {tip.title}
                </Link>
              </li>
            ))}
            {hubs.map((hub) =>
              hub ? (
                <li key={hub.id}>
                  <Link href={hubPath(hub)}>
                    <small>Guide</small>
                    {hub.title}
                  </Link>
                </li>
              ) : null,
            )}
          </ul>
        </section>
      ) : null}
      {others.length ? (
        <section className="block">
          <h2>More comparisons and alternatives</h2>
          <ul className="link-grid">
            {others.map((item) => (
              <li key={item.slug}>
                <Link href={comparePath(item)}>
                  <small>{COMPARE_KIND_LABEL[item.kind]}</small>
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      <p className="note">No one paid to be on this page. If we ever add affiliate links, they will be marked.</p>
      <Newsletter />
    </main>
  );
}
