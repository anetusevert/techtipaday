import { tips, byNewest, getTip, isLive, SITE_URL, categoryName } from "@/lib/tips";
const tools = [
  { name: "get_latest_tip", description: "Get today's TechTipADay tip.", inputSchema: { type: "object", properties: {} } },
  { name: "list_tips", description: "List all live tips (title, slug, category, date, url).", inputSchema: { type: "object", properties: {} } },
  { name: "get_tip", description: "Get one live tip with steps by slug. Future-dated tips return not found.", inputSchema: { type: "object", properties: { slug: { type: "string" } }, required: ["slug"] } },
];
const full = (t: (typeof tips)[number]) => ({
  ...t,
  category: categoryName(t.category),
  categorySlug: t.category,
  url: `${SITE_URL}/tips/${t.slug}`,
  video: undefined,
});
export async function POST(req: Request) {
  const m = await req.json().catch(() => null);
  if (!m) return Response.json({ jsonrpc: "2.0", id: null, error: { code: -32700, message: "Parse error" } }, { status: 400 });
  const ok = (result: unknown) => Response.json({ jsonrpc: "2.0", id: m.id, result });
  if (m.id === undefined) return new Response(null, { status: 202 });
  switch (m.method) {
    case "initialize": return ok({ protocolVersion: m.params?.protocolVersion || "2025-06-18", capabilities: { tools: {} }, serverInfo: { name: "techtipaday", version: "0.1.0" } });
    case "ping": return ok({});
    case "tools/list": return ok({ tools });
    case "tools/call": {
      const n = m.params?.name; let data: unknown;
      if (n === "get_latest_tip") { const t = byNewest()[0]; data = t ? full(t) : { error: "no tip published yet" }; }
      else if (n === "list_tips") data = byNewest().map((t) => ({ title: t.title, slug: t.slug, category: categoryName(t.category), date: t.date, difficulty: t.difficulty, url: `${SITE_URL}/tips/${t.slug}` }));
      else if (n === "get_tip") { const t = getTip(m.params?.arguments?.slug); data = t && isLive(t) ? full(t) : { error: "not found" }; }
      else return Response.json({ jsonrpc: "2.0", id: m.id, error: { code: -32602, message: "Unknown tool" } });
      return ok({ content: [{ type: "text", text: JSON.stringify(data, null, 2) }] });
    }
    default: return Response.json({ jsonrpc: "2.0", id: m.id, error: { code: -32601, message: "Method not found" } });
  }
}
export function GET() { return Response.json({ name: "techtipaday", transport: "streamable-http", tools: tools.map((t) => t.name) }); }
