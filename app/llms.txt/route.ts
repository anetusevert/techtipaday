import { appBySlug } from "@/lib/landings";
import { categoryName } from "@/lib/taxonomy";
import { byNewest, liveAppPages, liveFixPages, SITE_DESC, SITE_NAME, SITE_URL, tipUrl } from "@/lib/tips";

export const dynamic = "force-dynamic";

export function GET() {
  const tips = byNewest();
  const lines = [
    `# ${SITE_NAME}`,
    "",
    `> ${SITE_DESC}`,
    "",
    "Tips are published on their calendar date in Europe/Berlin. This file, the HTML pages, the sitemap, the RSS and JSON feeds, and the MCP tools omit a tip until that date. Requesting a future tip URL returns 404.",
    "",
    "Counts on the site are counts of published tips. There are no view counts, ratings, or testimonials.",
    "",
    `- Site: ${SITE_URL}`,
    `- Today: ${SITE_URL}`,
    `- All tips: ${SITE_URL}/tips`,
    `- Fixes: ${SITE_URL}/fix`,
    `- Apps: ${SITE_URL}/apps`,
    `- Topics: ${SITE_URL}/categories`,
    `- Cheat sheets: ${SITE_URL}/sheets`,
    `- Timeline: ${SITE_URL}/timeline`,
    `- Subscribe: ${SITE_URL}/subscribe`,
    `- About: ${SITE_URL}/about`,
    `- iPhone: ${SITE_URL}/iphone`,
    `- Android: ${SITE_URL}/android`,
    `- Mac: ${SITE_URL}/mac`,
    `- Windows: ${SITE_URL}/windows`,
    `- Chrome: ${SITE_URL}/chrome`,
    `- MCP endpoint (read-only, JSON-RPC over HTTP): ${SITE_URL}/api/mcp`,
    `- RSS: ${SITE_URL}/feed.xml`,
    `- JSON Feed: ${SITE_URL}/feed.json`,
    `- Sitemap: ${SITE_URL}/sitemap.xml`,
    "",
    "MCP tools: get_latest_tip, list_tips, get_tip (argument: slug). get_tip returns not found for unknown or future slugs.",
    "",
    "## Live task pages",
    "",
  ];
  for (const page of liveFixPages()) {
    lines.push(`- ${page.h1}: ${SITE_URL}${page.path}`);
  }
  lines.push("", "## Live app pages", "");
  for (const app of liveAppPages()) {
    lines.push(`- ${app.name}: ${SITE_URL}/apps/${app.slug}`);
  }
  lines.push("", "## Tips", "");
  if (!tips.length) lines.push("No tip has been published yet.", "");
  for (const tip of tips) {
    const apps = (tip.apps ?? []).map((id) => appBySlug(id)?.name ?? id).join(", ");
    lines.push(
      `### ${tip.title}`,
      "",
      `- Date: ${tip.date}`,
      `- Category: ${categoryName(tip.category)}`,
      `- Devices: ${tip.devices.join(", ") || "Any"}`,
      `- Difficulty: ${tip.difficulty}`,
      `- Time: about ${tip.minutes} min`,
      `- Why it matters: ${tip.why}`,
      `- Task: ${tip.task.h1} (${SITE_URL}/fix/${tip.task.slug})`,
      apps ? `- Apps: ${apps}` : "- Apps: none",
      `- URL: ${tipUrl(tip.slug)}`,
      `- Summary: ${tip.summary}`,
      "- Steps:",
      ...tip.steps.map((step, index) => `  ${index + 1}. ${step}`),
      "- Notes:",
      ...tip.body.map((paragraph) => `  ${paragraph}`),
      "",
    );
  }
  return new Response(lines.join("\n"), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
