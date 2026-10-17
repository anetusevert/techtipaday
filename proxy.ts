import { NextResponse, type NextRequest } from "next/server";
import { legacyRedirect } from "@/lib/tips";

// 301 non-canonical hosts to www, and old paths (renamed tips, /fix, /best, bare /alternatives) to their new home.
const CANONICAL = "www.techtipaday.com";
const REDIRECT_HOSTS = new Set([
  "techtipaday.com",
  "web-production-136d2d.up.railway.app",
]);
const LOCAL = /^(localhost|127\.0\.0\.1)$/;

export function proxy(req: NextRequest) {
  const rawHost = req.headers.get("x-forwarded-host") || req.headers.get("host") || "";
  const host = rawHost.split(":")[0].toLowerCase();
  const { pathname, search } = req.nextUrl;
  const legacy = pathname.startsWith("/tips/") || pathname.startsWith("/fix") || pathname === "/best" || pathname === "/alternatives" || pathname === "/guides";
  const moved = legacy ? legacyRedirect(pathname) : undefined;
  if (REDIRECT_HOSTS.has(host) || moved) {
    const origin = LOCAL.test(host) ? `http://${rawHost}` : `https://${CANONICAL}`;
    return NextResponse.redirect(new URL((moved ?? pathname) + search, origin), 301);
  }
  return NextResponse.next();
}

export const config = { matcher: "/:path*" };
