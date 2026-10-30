import type { Short } from "@/lib/videos";
import { SOCIAL } from "@/lib/social";

/** The tip's YouTube Short, lazy-loaded, plus follow links. */
export function TipVideo({ short, title }: { short: Short; title: string }) {
  const yt = SOCIAL[0];
  return (
    <section className="block tip-video" aria-labelledby="watch">
      <h2 id="watch">Watch it in 20 seconds</h2>
      <div className="tip-video-frame">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${short.id}?rel=0`}
          title={`${title} (YouTube Short)`}
          loading="lazy"
          allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
      <p className="tip-video-links">
        <a href={`https://www.youtube.com/shorts/${short.id}`}>Open on YouTube</a>
        <span aria-hidden="true"> · </span>
        <a href={yt.follow}>Subscribe for one tip a day</a>
        {SOCIAL.slice(1).map((s) => (
          <span key={s.id}>
            <span aria-hidden="true"> · </span>
            <a href={s.follow}>{s.name}</a>
          </span>
        ))}
      </p>
    </section>
  );
}
