import Link from "next/link";
import { pageAlternates } from "@/lib/seo";

export const metadata = {
  title: "About",
  description: "What TechTipADay is, how tips are chosen, and when they go live.",
  alternates: pageAlternates("/about"),
};

export default function About() {
  return (
    <main className="article">
      <p className="kicker">About</p>
      <h1>A daily desk for small tech fixes</h1>
      <p>
        TechTipADay publishes one short tip a day: a phone setting, a keyboard shortcut, or a better way to ask an AI tool. The aim is something you can try in a few minutes and check on the screen.
      </p>
      <p>
        Menu names are written for the versions people actually have: iOS 18 and iOS 26, Android 15 and 16 on Pixel phones, current macOS, Windows 11, desktop Chrome, and ChatGPT, Claude, and Gemini. Where a brand renames a menu, the step says so. If a path is uncertain, it does not get a page.
      </p>
      <p>
        A tip goes live on its calendar date in Europe/Berlin, and not before. The homepage, the archive, the task pages, the cheat sheets, the feeds, the sitemap, llms.txt, and the read-only MCP server all follow that rule. A future URL returns 404.
      </p>
      <p>
        Counts on the site are counts of tips: new today, added this week, the size of the archive, and how many days in a row a tip has shipped. Popular is an editor&apos;s shortlist. There are no view counts, ratings, or testimonials.
      </p>
      <h2>Where to look</h2>
      <ul className="promise">
        <li>
          <Link href="/tips">All live tips</Link>, with search and filters
        </li>
        <li>
          <Link href="/how-to">Tips by task</Link>, like a slow laptop or a phone battery
        </li>
        <li>
          <Link href="/compare">Comparisons and alternatives</Link>, including when the built-in setting is enough
        </li>
        <li>
          <Link href="/apps">Apps</Link> such as ChatGPT and Gboard
        </li>
        <li>
          <Link href="/sheets">Printable cheat sheets</Link>
        </li>
        <li>
          <Link href="/subscribe">Get tomorrow&apos;s tip a day early</Link>
        </li>
        <li>
          <a href="/llms.txt">llms.txt</a>, <a href="/feed.xml">RSS</a>, <a href="/feed.json">JSON Feed</a>
        </li>
        <li>
          <a href="/api/mcp">MCP endpoint</a>, read-only
        </li>
      </ul>
    </main>
  );
}
