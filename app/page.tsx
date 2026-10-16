export const revalidate = 3600;

import Link from "next/link";
import { ViewTransition } from "react";
import { Calendar } from "@/components/Calendar";
import { JsonLd } from "@/components/JsonLd";
import { Newsletter } from "@/components/Newsletter";
import { PhoneMock } from "@/components/PhoneMock";
import { Reveal, Rise } from "@/components/Reveal";
import { TipActions } from "@/components/TipActions";
import { TipCard } from "@/components/TipCard";
import { pageAlternates } from "@/lib/seo";
import { byNewest, formatDate, shareTip, SITE_DESC, streakOf, tipUrl } from "@/lib/tips";

export const metadata = {
  alternates: pageAlternates("/"),
  description: SITE_DESC,
};

export default function Home() {
  const list = byNewest();
  const today = list[0];
  const rest = list.slice(1);
  const streak = streakOf(list);
  const ld = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "TechTipADay tips",
    itemListElement: list.map((tip, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: tip.title,
      url: tipUrl(tip.slug),
    })),
  };

  return (
    <main>
      <JsonLd data={ld} />
      <section className="hero" aria-labelledby="today-heading">
        <p className="watermark" aria-hidden="true">
          {String(list.length).padStart(2, "0")}
        </p>
        <div className="hero-copy">
          <p className="eyebrow">
            <i className="caret-inline" aria-hidden="true" /> Today
          </p>
          <h1 id="today-heading">
            One tech tip a day
            <i className="caret-inline" aria-hidden="true" />
          </h1>
          <p className="lede">{SITE_DESC}</p>
          <p className="stat">
            <strong>{String(list.length).padStart(2, "0")}</strong>
            <span>{list.length === 1 ? "tip published" : "tips published"}</span>
            <strong>{String(streak).padStart(2, "0")}</strong>
            <span>day streak</span>
          </p>
        </div>
        <PhoneMock title={today?.title ?? "A tip unlocks today"} />
        {today ? (
          <Rise className="hero-card">
            <article className="today-card">
              <p className="eyebrow">
                <i className="caret-inline" aria-hidden="true" /> Tip #{today.n} · {today.category} ·{" "}
                <time dateTime={today.date}>{formatDate(today.date)}</time>
              </p>
              <ViewTransition name={`tip-title-${today.slug}`} share="morph" default="none">
                <h2>
                  <Link href={`/tips/${today.slug}`} transitionTypes={["nav-forward"]}>
                    {today.title}
                  </Link>
                </h2>
              </ViewTransition>
              <p className="summary">{today.summary}</p>
              <p className="works">Works on {today.devices.join(", ")}</p>
              <TipActions tip={shareTip(today)} readHref={`/tips/${today.slug}`} />
              <h3 className="how">How to do it</h3>
              <p className="swipe-hint">Swipe sideways. Each step is on its own card.</p>
              <div className="deck-fade">
                <ol className="step-deck" tabIndex={0} aria-label="Steps">
                  {today.steps.map((step, index) => (
                    <li key={step}>
                      <span className="step-n" aria-hidden="true">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <p>{step}</p>
                    </li>
                  ))}
                </ol>
              </div>
              {today.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </article>
          </Rise>
        ) : (
          <article className="today-card hero-card">
            <h2>The first tip lands soon</h2>
            <p>A new phone, AI, or everyday-tech tip unlocks each day. Nothing is listed before its date.</p>
          </article>
        )}
      </section>

      {rest.length > 0 ? (
        <section className="block">
          <div className="block-head">
            <h2>Earlier tips</h2>
            <Link href="/tips" transitionTypes={["nav-tab"]}>
              All tips
            </Link>
          </div>
          <div className="deck-fade">
            <ul className="tip-deck">
              {rest.map((tip) => (
                <li key={tip.slug}>
                  <TipCard tip={tip} share={shareTip(tip)} level={3} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <div className="home-split">
        <Reveal>
          <section className="block">
            <div className="block-head">
              <h2>Timeline</h2>
              <Link href="/timeline" transitionTypes={["nav-tab"]}>
                Full calendar
              </Link>
            </div>
            <Calendar tips={list} />
          </section>
        </Reveal>
        <Reveal>
          <Newsletter />
        </Reveal>
      </div>
    </main>
  );
}
