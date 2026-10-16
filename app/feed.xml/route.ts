import { rssXml } from "@/lib/feed";

export const revalidate = 3600;

export function GET() {
  return new Response(rssXml(), {
    headers: { "content-type": "application/rss+xml; charset=utf-8" },
  });
}
