import Link from "next/link";
import { ViewTransition } from "react";
import { formatDate, type ShareTip, type Tip } from "@/lib/tips";
import { TipActions } from "./TipActions";

export function TipCard({ tip, share, level = 2 }: { tip: Tip; share: ShareTip; level?: 2 | 3 }) {
  const Title = level === 2 ? "h2" : "h3";
  return (
    <article className="tip-card">
      <p className="eyebrow">
        Tip #{tip.n} · {tip.category} · <time dateTime={tip.date}>{formatDate(tip.date)}</time>
      </p>
      <ViewTransition name={`tip-title-${tip.slug}`} share="morph" default="none">
        <Title className="tip-title">
          <Link href={`/tips/${tip.slug}`} transitionTypes={["nav-forward"]}>
            {tip.title}
          </Link>
        </Title>
      </ViewTransition>
      <p>{tip.summary}</p>
      <p className="works">Works on {tip.devices.join(", ")}</p>
      <TipActions tip={share} readHref={`/tips/${tip.slug}`} />
    </article>
  );
}
