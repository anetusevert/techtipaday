import { NextResponse, type NextRequest } from "next/server";

// 301 non-canonical hosts to www.
const CANONICAL = "www.techtipaday.com";
const REDIRECT_HOSTS = new Set([
  "techtipaday.com",
  "web-production-136d2d.up.railway.app",
]);

export function proxy(req: NextRequest) {
  const host = (req.headers.get("x-forwarded-host") || req.headers.get("host") || "").split(":")[0].toLowerCase();
  if (REDIRECT_HOSTS.has(host)) {
    const url = new URL(req.nextUrl.pathname + req.nextUrl.search, `https://${CANONICAL}`);
    return NextResponse.redirect(url, 301);
  }
  return NextResponse.next();
}

export const config = { matcher: "/:path*" };
