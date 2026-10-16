import { jsonFeed } from "@/lib/feed";

export const revalidate = 3600;

export function GET() {
  return Response.json(jsonFeed(), {
    headers: { "content-type": "application/feed+json; charset=utf-8" },
  });
}
