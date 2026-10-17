import { appBySlug } from "@/lib/landings";
import { BEEHIIV_FORM_ID, BEEHIIV_PUBLICATION, BEEHIIV_SUBSCRIBE, beehiivSubscribeUrl } from "@/lib/newsletter";
import { categoryName } from "@/lib/taxonomy";
import { comparePath } from "@/lib/compare";
import { byNewest, comparesForTip, hubPath, hubsForTip, liveAppPages, liveCompares, liveHubs, seoOf, SITE_DESC, SITE_NAME, SITE_URL, tipsForHub, tipUrl } from "@/lib/tips";

/** Builds /llms.txt (index: one line per tip) and /llms-full.txt (every tip in full). */
export function buildLlms(full: boolean) {
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
    `- Find by task: ${SITE_URL}/how-to`,
    `- Comparisons and alternatives: ${SITE_URL}/compare`,
    full ? `- Short index: ${SITE_URL}/llms.txt` : `- Every tip in full, with FAQ and alternatives: ${SITE_URL}/llms-full.txt`,
    `- Apps: ${SITE_URL}/apps`,
    `- Topics: ${SITE_URL}/categories`,
    `- Cheat sheets: ${SITE_URL}/sheets`,
    `- Timeline: ${SITE_URL}/timeline`,
    `- Subscribe: ${SITE_URL}/subscribe`,
    `- Daily email: ${BEEHIIV_SUBSCRIBE}`,
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
    "## Newsletter",
    "",
    `The free daily email is a beehiiv publication at ${BEEHIIV_PUBLICATION}. The free plan has no API, and server-side POSTs are blocked. Every visible email signup embeds beehiiv form ${BEEHIIV_FORM_ID} or opens the subscribe page in a new tab with the address in the email query parameter. JavaScript is not required for that handoff.`,
    "",
    `- ${BEEHIIV_SUBSCRIBE}`,
    `- With an address: ${beehiivSubscribeUrl("you@example.com")}`,
    `- Publication: ${BEEHIIV_PUBLICATION}`,
    `- On this site: ${SITE_URL}/subscribe`,
    "",
    "## How pages are built",
    "",
    "Each tip page answers one search phrase. The H1 and URL use that phrase, the short answer comes first, then numbered steps, when to use it, other ways to do it and a FAQ. Task pages (/how-to) collect two or more tips for one job. Comparisons (/compare) put two or more options side by side with a written verdict. Alternatives pages (/alternatives) list other ways to get the same thing done.",
    "",
    "## Find by task",
    "",
  ];
  for (const hub of liveHubs()) {
    lines.push(`- ${hub.title} (${tipsForHub(hub.id).length} tips): ${SITE_URL}${hubPath(hub)}`);
  }
  lines.push("", "## Comparisons", "");
  for (const page of liveCompares().filter((item) => item.kind !== "alternatives")) {
    lines.push(`- ${page.title}: ${SITE_URL}${comparePath(page)}`, `  Verdict: ${page.answer}`);
  }
  lines.push("", "## Alternatives", "");
  for (const page of liveCompares().filter((item) => item.kind === "alternatives")) {
    lines.push(`- ${page.title}: ${SITE_URL}${comparePath(page)}`, `  ${page.answer}`);
  }
  lines.push("", "## Live app pages", "");
  for (const app of liveAppPages()) {
    lines.push(`- ${app.name}: ${SITE_URL}/apps/${app.slug}`);
  }
  lines.push("", "## Tips", "");
  if (!tips.length) lines.push("No tip has been published yet.", "");
  if (!full) {
    for (const tip of tips) {
      const seo = seoOf(tip);
      lines.push(`- ${tip.title}: ${tipUrl(tip.slug)}`, `  Search phrase: ${seo.searchPhrase}. ${seo.answer}`);
    }
    return lines.join("\n");
  }
  for (const tip of tips) {
    const seo = seoOf(tip);
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
      `- Search phrase: ${seo.searchPhrase}`,
      `- Also searched as: ${seo.searchAlternates.join("; ")}`,
      `- Short answer: ${seo.answer}`,
      `- Use it when: ${seo.useWhen}`,
      `- Where it falls short: ${seo.notFor}`,
      ...hubsForTip(tip).map((hub) => `- Task: ${hub.title} (${SITE_URL}${hubPath(hub)})`),
      ...comparesForTip(tip).map((page) => `- Compare: ${page.title} (${SITE_URL}${comparePath(page)})`),
      apps ? `- Apps: ${apps}` : "- Apps: none",
      `- URL: ${tipUrl(tip.slug)}`,
      `- Summary: ${tip.summary}`,
      "- Steps:",
      ...tip.steps.map((step, index) => `  ${index + 1}. ${step}`),
      "- Notes:",
      ...tip.body.map((paragraph) => `  ${paragraph}`),
      "- FAQ:",
      ...seo.faq.flatMap((item) => [`  Q: ${item.q}`, `  A: ${item.a}`]),
      ...(seo.alternatives.length
        ? ["- Alternatives:", ...seo.alternatives.map((alt) => `  ${alt.name} (${alt.kind}): pick it if ${alt.pickIt.replace(/^./, (c) => c.toLowerCase())} Stick with this tip if ${alt.pickThis.replace(/^./, (c) => c.toLowerCase())}`)]
        : []),
      "",
    );
  }
  return lines.join("\n");
}
