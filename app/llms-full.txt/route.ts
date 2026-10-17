import { buildLlms } from "@/lib/llms";

export const dynamic = "force-dynamic";

export function GET() {
  return new Response(buildLlms(true), { headers: { "content-type": "text/plain; charset=utf-8" } });
}
