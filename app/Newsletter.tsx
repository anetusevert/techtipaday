export default function Newsletter() {
  return (
    <section className="card" id="newsletter">
      <h2>Get the tip in your inbox</h2>
      <p className="meta">The newsletter is launching soon. One email a day, one tip, unsubscribe anytime.</p>
      <form className="news" action="#" aria-disabled="true">
        <input type="email" placeholder="you@example.com" aria-label="Email address" disabled />
        <button type="button" disabled>Coming soon</button>
      </form>
    </section>
  );
}
