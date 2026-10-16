export function Newsletter({ level = 2 }: { level?: 1 | 2 }) {
  const Title = level === 1 ? "h1" : "h2";
  return (
    <section className="news print-hide" id="newsletter" aria-labelledby="newsletter-title">
      <p className="kicker">Tomorrow, a day early</p>
      <Title id="newsletter-title">Get tomorrow&apos;s tip a day early</Title>
      <p className="dek">
        One email, the evening before the tip goes on the site. The same short tip. No digest, no thread, no upsell.
      </p>
      <form className="news-form" aria-describedby="news-note">
        <div className="field">
          <label htmlFor="email">Email address</label>
          <input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" disabled />
        </div>
        <button type="submit" className="btn btn-primary" disabled>
          Coming soon
        </button>
      </form>
      <p id="news-note" className="note">
        The list is not open yet, so this form does not collect addresses. Nothing is stored.
      </p>
    </section>
  );
}
