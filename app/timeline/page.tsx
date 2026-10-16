export const revalidate = 3600;

import Link from "next/link";
import { ViewTransition } from "react";
import { Calendar } from "@/components/Calendar";
import { Reveal } from "@/components/Reveal";
import { pageAlternates } from "@/lib/seo";
import { byNewest, formatDate, SITE_DESC } from "@/lib/tips";

export const metadata = {
  title: "Timeline",
  description: `The TechTipADay calendar. ${SITE_DESC} Days light up when a tip goes live.`,
  alternates: pageAlternates("/timeline"),
};

export default function TimelinePage() {
  const list = byNewest();
  const chronological = [...list].sort((a, b) => a.n - b.n);

  return (
    <main>
      <p className="eyebrow">
        <i className="caret-inline" aria-hidden="true" /> Drops
      </p>
      <h1>Timeline</h1>
      <p className="lede">One square lights up each day a tip ships. Upcoming tips stay blank until their date.</p>
      <div className="timeline-layout">
        <Reveal>
          <Calendar tips={list} />
        </Reveal>
        <section className="block">
        <h2>Published</h2>
        {chronological.length ? (
          <ol className="time-list">
            {chronological.map((tip, index) => (
              <li key={tip.slug}>
                <div className="rail" aria-hidden="true">
                  <i />
                </div>
                <Reveal className="time-body" delay={Math.min(index * 0.04, 0.24)}>
                  <time dateTime={tip.date}>{formatDate(tip.date, { month: "long", day: "numeric" })}</time>
                  <p className="eyebrow">{tip.category}</p>
                  <ViewTransition name={`tip-title-${tip.slug}`} share="morph" default="none">
                    <h3>
                      <Link href={`/tips/${tip.slug}`} transitionTypes={["nav-forward"]}>
                        {tip.title}
                      </Link>
                    </h3>
                  </ViewTransition>
                  <p>{tip.summary}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        ) : (
          <p className="empty">Nothing published yet.</p>
        )}
        </section>
      </div>
    </main>
  );
}
