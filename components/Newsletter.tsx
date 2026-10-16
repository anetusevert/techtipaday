import { BeehiivEmbed } from "./BeehiivEmbed";
import { BEEHIIV_SUBSCRIBE } from "@/lib/newsletter";

export function Newsletter({ level = 2 }: { level?: 1 | 2 }) {
  const Title = level === 1 ? "h1" : "h2";
  const emailId = level === 1 ? "subscribe-email" : "email";
  const hintId = level === 1 ? "subscribe-note" : "news-note";

  return (
    <section className="news print-hide" id="newsletter" aria-labelledby="newsletter-title">
      <p className="kicker">Tomorrow, a day early</p>
      <Title id="newsletter-title">Get tomorrow&apos;s tip a day early</Title>
      <p className="dek">
        One email, the evening before the tip goes on the site. The same short tip. No digest, no thread, no upsell.
      </p>
      <form className="news-form" action={BEEHIIV_SUBSCRIBE} method="get" target="_blank" aria-describedby={hintId}>
        <div className="field">
          <label htmlFor={emailId}>Email address</label>
          <input id={emailId} name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
        </div>
        <button type="submit" className="btn btn-primary">
          Send me tomorrow&apos;s tip
        </button>
      </form>
      <p id={hintId} className="note">
        Opens the Beehiiv signup in a new tab and sends your address in the link. Finish there to join the list.
      </p>
      <BeehiivEmbed />
      <p className="note subscribe-fallback">
        <a href={BEEHIIV_SUBSCRIBE}>Subscribe on the newsletter page</a>
        <span className="subscribe-url">{BEEHIIV_SUBSCRIBE}</span>
      </p>
    </section>
  );
}
