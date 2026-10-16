import Link from "next/link";
import { JsonLd } from "./JsonLd";
import { Newsletter } from "./Newsletter";
import { TipRiver } from "./TipRiver";
import { breadcrumbLd, collectionLd } from "@/lib/seo";
import { SITE_URL, tipUrl, type Tip } from "@/lib/tips";

export function LandingView({
  kicker,
  h1,
  intro,
  path,
  crumbs,
  tips,
  related,
  sheetHref,
  sheetLabel,
}: {
  kicker: string;
  h1: string;
  intro: string;
  path: string;
  crumbs: { name: string; href: string }[];
  tips: Tip[];
  related: { href: string; title: string; meta: string }[];
  sheetHref?: string;
  sheetLabel?: string;
}) {
  const url = `${SITE_URL}${path}`;
  const ld = [
    collectionLd({
      name: h1,
      description: intro,
      url,
      items: tips.map((tip) => ({ name: tip.title, url: tipUrl(tip.slug) })),
    }),
    breadcrumbLd(crumbs.map((crumb) => ({ name: crumb.name, url: crumb.href.startsWith("http") ? crumb.href : `${SITE_URL}${crumb.href}` }))),
  ];
  return (
    <main>
      <JsonLd data={ld} />
      <nav className="crumbs" aria-label="Breadcrumb">
        {crumbs.map((crumb, index) => (
          <span key={crumb.href}>
            {index > 0 ? <span aria-hidden="true"> / </span> : null}
            {index === crumbs.length - 1 ? <span aria-current="page">{crumb.name}</span> : <Link href={crumb.href}>{crumb.name}</Link>}
          </span>
        ))}
      </nav>
      <p className="kicker">{kicker}</p>
      <h1>{h1}</h1>
      <p className="dek">{intro}</p>
      <p className="count-line">
        {tips.length} {tips.length === 1 ? "live tip" : "live tips"}
        {tips[0] ? (
          <>
            {" "}
            · newest <time dateTime={tips[0].date}>{tips[0].date}</time>
          </>
        ) : null}
      </p>
      {sheetHref ? (
        <p className="sheet-link">
          <Link href={sheetHref}>{sheetLabel ?? "Printable cheat sheet"}</Link>
        </p>
      ) : null}
      <TipRiver tips={tips} />
      {related.length ? (
        <section className="block">
          <h2>Keep going</h2>
          <ul className="link-grid">
            {related.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>
                  <small>{item.meta}</small>
                  {item.title}
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
