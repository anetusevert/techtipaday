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
  logReferral(req, pathname);
  return NextResponse.next();
}

const ASSET = /^\/(_next|icons|vo|api)\/|\.(png|jpe?g|svg|ico|webp|js|css|txt|xml|json|woff2?|map|mp4|mp3)$/i;
const BOT = /bot|crawl|spider|slurp|preview|monitor|curl|wget|python|node-fetch|headless/i;

/** One JSON line per human page view that came from another site or carries ?ref= / utm_source,
 *  so Railway deploy logs show which videos and sites send visitors. No cookies, no IPs. */
function logReferral(req: NextRequest, pathname: string) {
  if (req.method !== "GET" || ASSET.test(pathname)) return;
  const ua = req.headers.get("user-agent") || "";
  if (BOT.test(ua)) return;
  const sp = req.nextUrl.searchParams;
  const tag = sp.get("ref") || sp.get("utm_source") || "";
  let from = "";
  try {
    const r = req.headers.get("referer");
    if (r) {
      const h = new URL(r).hostname.replace(/^www\./, "");
      if (h !== "techtipaday.com") from = h;
    }
  } catch {}
  if (!from && !tag) return;
  const device = /iphone|ipad/i.test(ua) ? "ios" : /android/i.test(ua) ? "android" : /mobile/i.test(ua) ? "mobile" : "desktop";
  console.log(JSON.stringify({ evt: "referral", path: pathname, from, tag, device }));
}

export const config = { matcher: "/:path*" };
