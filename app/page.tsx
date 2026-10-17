export const dynamic = "force-dynamic";

import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { Newsletter } from "@/components/Newsletter";
import { TipActions } from "@/components/TipActions";
import { TipRiver } from "@/components/TipRiver";
import { collectionLd } from "@/lib/seo";
import { categoryById } from "@/lib/taxonomy";
import {
  byNewest,
  formatDate,
  formatMinutes,
  freshness,
  hubCards,
  liveAppPages,
  popularTips,
  shareTip,
  SITE_URL,
  tipUrl,
} from "@/lib/tips";

export default function Home() {
  const list = byNewest();
  const today = list[0];
  const fresh = freshness(list);
  const cat = today ? categoryById(today.category) : undefined;
  const hubs = hubCards().sort((a, b) => b.count - a.count).slice(0, 6);
  const apps = liveAppPages().slice(0, 6);
  const popular = popularTips(4);
  const ld = collectionLd({
    name: "TechTipADay",
    description: "Live tech tips, newest first.",
    url: SITE_URL,
    items: list.slice(0, 24).map((tip) => ({ name: tip.title, url: tipUrl(tip.slug) })),
  });

  return (
    <main>
      <JsonLd data={ld} />
      <p className="dateline">
        <time dateTime={fresh.today}>
          {formatDate(fresh.today, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
        </time>
        <span>Europe/Berlin</span>
        <span>
          <strong>{fresh.newToday}</strong> new today
        </span>
        <span>
          <strong>{fresh.addedWeek}</strong> added this week
        </span>
        <span>
          <strong>{fresh.total}</strong> in the archive
        </span>
        <span>
          <strong>{fresh.streak}</strong> days in a row
        </span>
      </p>

      {today ? (
        <article className="feature">
          <p className="kicker">Tip of the day</p>
          <h1>
            <Link href={`/tips/${today.slug}`}>{today.title}</Link>
          </h1>
          <p className="dek">{today.summary}</p>
          <ul className="badges">
            <li>
              <Link href={cat?.path ?? "/tips"}>{cat?.name}</Link>
            </li>
            <li>
              <span>
                {today.difficulty} · {formatMinutes(today.minutes)}
              </span>
            </li>
            <li>
              <span>{today.devices.join(" · ")}</span>
            </li>
          </ul>
          <aside className="why">
            <p className="kicker">Why it matters</p>
            <p>{today.why}</p>
          </aside>
          <TipActions tip={shareTip(today)} readHref={`/tips/${today.slug}`} />
        </article>
      ) : (
        <article className="feature">
          <h1>The first tip lands soon</h1>
          <p className="dek">A new tip unlocks each day. Nothing is listed before its date.</p>
        </article>
      )}

      <Newsletter />

      <section className="block">
        <div className="block-head">
          <h2 id="latest">Latest</h2>
          <Link href="/tips">All tips</Link>
        </div>
        <TipRiver tips={list.slice(0, 12)} labelledBy="latest" />
      </section>

      <section className="block">
        <div className="block-head">
          <h2>Find one by task</h2>
          <Link href="/how-to">All tasks</Link>
        </div>
        <ul className="hub-grid">
          {hubs.map(({ hub, count }) => (
            <li key={hub.slug}>
              <Link href={`/how-to/${hub.slug}`}>
                <small>
                  {count} {count === 1 ? "tip" : "tips"}
                </small>
                <strong>{hub.title}</strong>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="block">
        <div className="block-head">
          <h2>Popular</h2>
          <Link href="/tips?sort=popular">Shortlist</Link>
        </div>
        <p className="note">An editor&apos;s shortlist of tips worth keeping. Not a ranking and not based on views.</p>
        <TipRiver tips={popular} />
      </section>

      <section className="block">
        <div className="block-head">
          <h2>By app</h2>
          <Link href="/apps">All apps</Link>
        </div>
        <ul className="link-grid">
          {apps.map((app) => (
            <li key={app.slug}>
              <Link href={`/apps/${app.slug}`}>
                <small>App</small>
                {app.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
