import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { SITE_URL, SITE_NAME, SITE_DESC } from "@/lib/tips";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME}: one tech tip a day`, template: `%s | ${SITE_NAME}` },
  description: SITE_DESC,
  alternates: { canonical: "/", types: { "text/plain": "/llms.txt" } },
  openGraph: { siteName: SITE_NAME, type: "website", description: SITE_DESC },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const org = { "@context": "https://schema.org", "@type": "WebSite", name: SITE_NAME, url: SITE_URL, description: SITE_DESC };
  return (
    <html lang="en"><body>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }} />
      <header className="site"><Link href="/" className="logo" aria-label="TechTipADay home"><img src="/logo-lockup-dark.svg" alt="TechTipADay" height={36} style={{ display: "block", height: 36, width: "auto" }} /></Link><nav><Link href="/about">About</Link></nav></header>
      {children}
      <footer className="site"><span>© {new Date().getFullYear()} TechTipADay</span><span><a href="/llms.txt">llms.txt</a> · <a href="/sitemap.xml">sitemap</a></span></footer>
    </body></html>
  );
}
