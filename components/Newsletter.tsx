export function Newsletter({ level = 2 }: { level?: 1 | 2 }) {
  const Title = level === 1 ? "h1" : "h2";
  return (
    <section className="news-card" id="newsletter" aria-labelledby="newsletter-title">
      <p className="eyebrow">
        <i className="caret-inline" aria-hidden="true" /> Subscribe
      </p>
      <Title id="newsletter-title">Get the tip in your inbox</Title>
      <p className="lede">One email a day. One tip. Unsubscribe anytime. The list is launching soon, so this form is not collecting addresses yet.</p>
      <ul className="promise">
        <li>The same short tip as the site</li>
        <li>Which phones and apps it works on</li>
        <li>No digest, no thread, no upsell</li>
      </ul>
      <form className="news-form" aria-describedby="news-note">
        <div className="field">
          <label htmlFor="email">Email address</label>
          <input id="email" name="email" type="email" autoComplete="email" disabled />
        </div>
        <button type="submit" className="btn primary" disabled>
          Coming soon
        </button>
      </form>
      <p id="news-note" className="meta">
        The newsletter is launching soon. Nothing is sent until then.
      </p>
    </section>
  );
}
