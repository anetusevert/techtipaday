import { byNewest, SITE_DESC, SITE_NAME, SITE_URL, tipUrl } from "@/lib/tips";

export const revalidate = 3600;

export function GET() {
  const tips = byNewest();
  const lines = [
    `# ${SITE_NAME}`,
    "",
    `> ${SITE_DESC}`,
    "",
    "Tips are published on their calendar date in Europe/Berlin. This file, the HTML pages, the sitemap, the RSS and JSON feeds, and the MCP tools omit a tip until that date. Requesting a future tip URL returns 404.",
    "",
    `- Site: ${SITE_URL}`,
    `- Today: ${SITE_URL}`,
    `- All tips: ${SITE_URL}/tips`,
    `- Timeline: ${SITE_URL}/timeline`,
    `- Subscribe: ${SITE_URL}/subscribe`,
    `- About: ${SITE_URL}/about`,
    `- MCP endpoint (read-only, JSON-RPC over HTTP): ${SITE_URL}/api/mcp`,
    `- RSS: ${SITE_URL}/feed.xml`,
    `- JSON Feed: ${SITE_URL}/feed.json`,
    `- Sitemap: ${SITE_URL}/sitemap.xml`,
    "",
    "MCP tools: get_latest_tip, list_tips, get_tip (argument: slug). get_tip returns not found for unknown or future slugs.",
    "",
    "## Tips",
    "",
  ];
  if (!tips.length) lines.push("No tip has been published yet.", "");
  for (const tip of tips) {
    lines.push(
      `### Tip #${tip.n}: ${tip.title}`,
      "",
      `- Date: ${tip.date}`,
      `- Category: ${tip.category}`,
      `- Devices: ${tip.devices.join(", ")}`,
      `- URL: ${tipUrl(tip.slug)}`,
      `- Summary: ${tip.summary}`,
      "- Steps:",
      ...tip.steps.map((step, index) => `  ${index + 1}. ${step}`),
      "- Notes:",
      ...tip.body.map((paragraph) => `  ${paragraph}`),
      "",
    );
  }
  return new Response(lines.join("\n"), { headers: { "content-type": "text/plain; charset=utf-8" } });
}
