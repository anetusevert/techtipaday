import Link from "next/link";
import { formatDate, type Tip } from "@/lib/tips";

const WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function Month({ month, tips }: { month: string; tips: Tip[] }) {
  const [y, m] = month.split("-").map(Number);
  const first = new Date(Date.UTC(y, m - 1, 1));
  const start = first.getUTCDay();
  const days = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const byDate = new Map(tips.map((tip) => [tip.date, tip]));
  const label = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric", timeZone: "UTC" }).format(first);
  const cells: Array<number | null> = [...Array(start).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];

  return (
    <section className="calendar" aria-label={label}>
      <p className="cal-title">{label}</p>
      <div className="cal-grid">
        {WEEK.map((day) => (
          <div key={day} className="cal-wd">
            <span className="sr">{day}</span>
            <span aria-hidden="true">{day.slice(0, 1)}</span>
          </div>
        ))}
        {cells.map((day, index) => {
          if (day == null) return <span key={`pad-${index}`} className="cal-pad" aria-hidden="true" />;
          const iso = `${month}-${String(day).padStart(2, "0")}`;
          const tip = byDate.get(iso);
          if (!tip) return <span key={iso} className="cal-day">{day}</span>;
          return (
            <Link
              key={iso}
              href={`/tips/${tip.slug}`}
              className="cal-day live"
              aria-label={`${formatDate(tip.date, { month: "long", day: "numeric" })}: ${tip.title}`}
              transitionTypes={["nav-forward"]}
            >
              {day}
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export function Calendar({ tips }: { tips: Tip[] }) {
  const months = new Set<string>();
  const anchor = tips[0]?.date;
  if (anchor) months.add(anchor.slice(0, 7));
  for (const tip of tips) months.add(tip.date.slice(0, 7));
  const ordered = [...months].sort();
  if (!ordered.length) {
    return <p className="lede">The calendar fills in as tips go live. Nothing is listed before its date.</p>;
  }
  return (
    <div className="calendars">
      {ordered.map((month) => (
        <Month key={month} month={month} tips={tips} />
      ))}
    </div>
  );
}
