import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Outfit } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { SITE_DESC, SITE_NAME, SITE_URL } from "@/lib/tips";
import { pageAlternates } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { MotionRoot } from "@/components/MotionRoot";
import { PwaRegister } from "@/components/PwaRegister";
import { SiteChrome } from "@/components/SiteChrome";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["500", "700", "800"],
  variable: "--font-outfit",
  display: "swap",
  adjustFontFallback: true,
});

const plex = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-plex",
  display: "swap",
  adjustFontFallback: true,
  preload: false,
});

export const viewport: Viewport = {
  themeColor: "#0b1020",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: { default: `${SITE_NAME}: one tech tip a day`, template: `%s | ${SITE_NAME}` },
  description: SITE_DESC,
  alternates: pageAlternates("/"),
  openGraph: { siteName: SITE_NAME, type: "website", description: SITE_DESC, locale: "en_US" },
  twitter: { card: "summary_large_image" },
  appleWebApp: { capable: true, title: SITE_NAME, statusBarStyle: "black-translucent" },
  formatDetection: { telephone: false },
};

const graph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
      description: SITE_DESC,
      publisher: { "@id": `${SITE_URL}/#org` },
    },
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#org`,
      name: SITE_NAME,
      url: SITE_URL,
      description: SITE_DESC,
      logo: `${SITE_URL}/icons/icon-512.png`,
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${outfit.variable} ${plex.variable}`}>
      <body>
        <JsonLd data={graph} />
        <MotionRoot>
          <a className="skip" href="#content">
            Skip to content
          </a>
          <SiteChrome />
          <div id="content" tabIndex={-1} className="content-slot">
            {children}
            <footer className="site-footer">
              <div className="footer-row">
                <span>© {new Date().getFullYear()} TechTipADay</span>
                <nav aria-label="Site">
                  <Link href="/about">About</Link>
                  <a href="/llms.txt">llms.txt</a>
                  <a href="/feed.xml">RSS</a>
                  <a href="/feed.json">JSON</a>
                  <a href="/sitemap.xml">Sitemap</a>
                </nav>
              </div>
            </footer>
          </div>
          <PwaRegister />
        </MotionRoot>
      </body>
    </html>
  );
}
