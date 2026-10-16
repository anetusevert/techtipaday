import Link from "next/link";

export default function NotFound() {
  return (
    <main className="article">
      <p className="eyebrow">404</p>
      <h1>That page isn&apos;t here</h1>
      <p>Tips only go live on their date, so a future tip stays hidden until then. If the address is wrong, it was never a tip.</p>
      <p>
        <Link className="btn primary" href="/" transitionTypes={["nav-back"]}>
          Back to today
        </Link>
      </p>
    </main>
  );
}
