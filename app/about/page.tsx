import Link from "next/link";
import { pageAlternates } from "@/lib/seo";

export const metadata = {
  title: "About",
  description: "What TechTipADay is and how tips are picked.",
  alternates: pageAlternates("/about"),
};

export default function About() {
  return (
    <main className="article">
      <p className="eyebrow">
        <i className="caret-inline" aria-hidden="true" /> About
      </p>
      <h1>About TechTipADay</h1>
      <p>One small, useful tech tip every day: phone tricks, AI tools, and the everyday stuff on your laptop and in your browser.</p>
      <p>
        Every tip is something you can try in under a minute. We note which devices and versions it works on, because menus move around between updates. If a tip stops working, tell us and we&apos;ll fix the page.
      </p>
      <p>Tips show up on their date and not before. The archive, the feeds, and the read-only MCP server all follow that rule.</p>
      <ul className="promise">
        <li>
          <Link href="/tips">All live tips</Link>
        </li>
        <li>
          <Link href="/timeline">Timeline</Link>
        </li>
        <li>
          <a href="/llms.txt">llms.txt</a> for agents and chatbots
        </li>
        <li>
          <a href="/feed.xml">RSS</a> and <a href="/feed.json">JSON Feed</a>
        </li>
        <li>
          <a href="/api/mcp">MCP endpoint</a>, read-only
        </li>
      </ul>
    </main>
  );
}
