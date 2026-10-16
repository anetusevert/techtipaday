export const dynamic = "force-dynamic";

import Link from "next/link";
import { Calendar } from "@/components/Calendar";
import { pageAlternates } from "@/lib/seo";
import { byNewest, formatDate, SITE_DESC } from "@/lib/tips";
import { categoryName } from "@/lib/taxonomy";

export const metadata = {
  title: "Timeline",
  description: `The TechTipADay calendar. ${SITE_DESC} A day links to its tip once that tip is live.`,
  alternates: pageAlternates("/timeline"),
};

export default function TimelinePage() {
  const list = byNewest();
  const chronological = [...list].sort((a, b) => (a.date < b.date ? -1 : 1));

  return (
    <main>
      <p className="kicker">Archive</p>
      <h1>Timeline</h1>
      <p className="dek">One day, one tip. Upcoming tips stay off the calendar until their date.</p>
      <Calendar tips={list} />
      <section className="block">
        <h2>Published</h2>
        <ol className="river">
          {chronological.map((tip) => (
            <li key={tip.slug}>
              <Link href={`/tips/${tip.slug}`}>
                <time dateTime={tip.date}>{formatDate(tip.date, { month: "long", day: "numeric" })}</time>
                <span className="cat">{categoryName(tip.category)}</span>
                <span className="river-title">{tip.title}</span>
                <span className="river-hook">{tip.summary}</span>
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
