import { byNewest, SITE_URL, SITE_NAME, SITE_DESC } from "@/lib/tips";
export const revalidate = 3600;
export function GET() {
  const lines = [`# ${SITE_NAME}`, "", `> ${SITE_DESC}`, "",
    `MCP endpoint (read-only, JSON-RPC over HTTP): ${SITE_URL}/api/mcp`, "", "## Tips", "",
    ...byNewest().map((t) => `- [${t.title}](${SITE_URL}/tips/${t.slug}): ${t.summary} Steps: ${t.steps.join(" ")}`)];
  return new Response(lines.join("\n") + "\n", { headers: { "content-type": "text/plain; charset=utf-8" } });
}
