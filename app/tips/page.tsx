export const revalidate = 3600;

import type { Metadata } from "next";
import Link from "next/link";
import { TipCard } from "@/components/TipCard";
import { pageAlternates } from "@/lib/seo";
import { byNewest, CATEGORIES, isCategory, shareTip, SITE_DESC } from "@/lib/tips";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}): Promise<Metadata> {
  const { category } = await searchParams;
  const active = isCategory(category) ? category : undefined;
  const title = active ? `${active} tips` : "All tips";
  const path = active ? `/tips?category=${encodeURIComponent(active)}` : "/tips";
  return {
    title,
    description: active ? `${SITE_DESC} Filtered to ${active}.` : `Every live TechTipADay tip. ${SITE_DESC}`,
    alternates: pageAlternates(path),
  };
}

export default async function TipsPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  const active = isCategory(category) ? category : undefined;
  const all = byNewest();
  const list = active ? all.filter((tip) => tip.category === active) : all;

  return (
    <main>
      <p className="eyebrow">
        <i className="caret-inline" aria-hidden="true" /> Archive
      </p>
      <h1>{active ? `${active} tips` : "All tips"}</h1>
      <p className="lede">Swipe the cards. Every tip here is already live. Future days stay off the list.</p>
      <ul className="filters">
        <li>
          <Link href="/tips" aria-current={active ? undefined : "page"} transitionTypes={["nav-tab"]}>
            All
          </Link>
        </li>
        {CATEGORIES.map((item) => (
          <li key={item}>
            <Link
              href={`/tips?category=${encodeURIComponent(item)}`}
              aria-current={active === item ? "page" : undefined}
              transitionTypes={["nav-tab"]}
            >
              {item}
            </Link>
          </li>
        ))}
      </ul>
      {list.length ? (
        <div className="deck-fade">
          <ul className="tip-deck">
            {list.map((tip) => (
              <li key={tip.slug}>
                <TipCard tip={tip} share={shareTip(tip)} />
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="empty">No {active ?? ""} tips published yet. A new one unlocks each day.</p>
      )}
    </main>
  );
}
