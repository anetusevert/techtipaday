export const revalidate = 3600;
import Link from "next/link";
import { byNewest, SITE_DESC } from "@/lib/tips";
import Newsletter from "./Newsletter";

export default function Home() {
  const list = byNewest();
  const [today, ...rest] = list;
  return (
    <main>
      <h1>One tech tip a day</h1>
      <p className="meta">{SITE_DESC}</p>
      <article className="card"><div className="meta">Tip #{today.n} · {today.category}</div>
        <h2><Link href={`/tips/${today.slug}`}>{today.title}</Link></h2><p>{today.summary}</p></article>
      <Newsletter />
      <h2>All tips</h2>
      {rest.map((t) => (
        <article className="card" key={t.slug}><div className="meta">Tip #{t.n} · {t.category}</div>
          <h2><Link href={`/tips/${t.slug}`}>{t.title}</Link></h2><p>{t.summary}</p></article>
      ))}
    </main>
  );
}
