import { jsonFeed } from "@/lib/feed";

export const dynamic = "force-dynamic";

export function GET() {
  return Response.json(jsonFeed(), {
    headers: { "content-type": "application/feed+json; charset=utf-8" },
  });
}
