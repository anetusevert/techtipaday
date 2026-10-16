import { byNewest, SITE_DESC, SITE_NAME, SITE_URL, tipUrl, type Tip } from "./tips";

export function xmlEscape(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function tipText(t: Tip) {
  return [
    t.summary,
    "",
    `Why it matters: ${t.why}`,
    `Difficulty: ${t.difficulty}. About ${t.minutes} min.`,
    "",
    "How to do it:",
    ...t.steps.map((s, i) => `${i + 1}. ${s}`),
    "",
    ...t.body,
  ].join("\n");
}

function rfc822(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d, 12, 0, 0)).toUTCString();
}

export function rssXml() {
  const items = byNewest()
    .map((t) => {
      const url = tipUrl(t.slug);
      return `    <item>
      <title>${xmlEscape(t.title)}</title>
      <link>${xmlEscape(url)}</link>
      <guid isPermaLink="true">${xmlEscape(url)}</guid>
      <pubDate>${rfc822(t.date)}</pubDate>
      <category>${xmlEscape(t.category)}</category>
      <description>${xmlEscape(tipText(t))}</description>
    </item>`;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${xmlEscape(SITE_NAME)}</title>
    <link>${xmlEscape(SITE_URL)}</link>
    <description>${xmlEscape(SITE_DESC)}</description>
    <language>en</language>
${items}
  </channel>
</rss>
`;
}

export function jsonFeed() {
  return {
    version: "https://jsonfeed.org/version/1.1",
    title: SITE_NAME,
    home_page_url: SITE_URL,
    feed_url: `${SITE_URL}/feed.json`,
    description: SITE_DESC,
    language: "en",
    items: byNewest().map((t) => ({
      id: tipUrl(t.slug),
      url: tipUrl(t.slug),
      title: t.title,
      summary: t.summary,
      content_text: tipText(t),
      date_published: `${t.date}T00:00:00Z`,
      tags: [t.category, t.difficulty, ...t.platforms, ...t.devices, t.task.slug],
      authors: [{ name: SITE_NAME }],
    })),
  };
}
