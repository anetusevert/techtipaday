import Link from "next/link";
import { categoryById, categoryName } from "@/lib/taxonomy";
import { formatDate, formatMinutes, type Tip } from "@/lib/tips";

export function TipRiver({ tips, labelledBy }: { tips: Tip[]; labelledBy?: string }) {
  if (!tips.length) return <p className="empty">Nothing in the archive matches that yet.</p>;
  return (
    <ol className="river" aria-labelledby={labelledBy}>
      {tips.map((tip) => {
        const cat = categoryById(tip.category);
        return (
          <li key={tip.slug}>
            <Link href={`/tips/${tip.slug}`}>
              <time dateTime={tip.date}>{formatDate(tip.date, { month: "short", day: "numeric" })}</time>
              <span className="cat">
                <i style={{ background: cat?.color ?? "#0b1020" }} aria-hidden="true" />
                {categoryName(tip.category)}
              </span>
              <span className="river-title">{tip.title}</span>
              <span className="river-hook">{tip.summary}</span>
              <span className="river-meta">
                {tip.difficulty} · {formatMinutes(tip.minutes)}
              </span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
