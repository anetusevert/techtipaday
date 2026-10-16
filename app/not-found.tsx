import Link from "next/link";

export default function NotFound() {
  return (
    <main className="article">
      <p className="kicker">404</p>
      <h1>That page isn&apos;t here</h1>
      <p>Tips and the pages that list them go live on their date. A future tip stays hidden until then. If the address is wrong, it was never a page.</p>
      <p>
        <Link className="btn btn-primary" href="/">
          Back to today
        </Link>
      </p>
    </main>
  );
}
