import { rssXml } from "@/lib/feed";

export const dynamic = "force-dynamic";

export function GET() {
  return new Response(rssXml(), {
    headers: { "content-type": "application/rss+xml; charset=utf-8" },
  });
}
