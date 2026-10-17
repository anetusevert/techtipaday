import { buildLlms } from "@/lib/llms";

export const dynamic = "force-dynamic";

export function GET() {
  return new Response(buildLlms(false), { headers: { "content-type": "text/plain; charset=utf-8" } });
}
