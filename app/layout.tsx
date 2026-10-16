import type { Metadata, Viewport } from "next";
import { Newsreader, Source_Sans_3 } from "next/font/google";
import Link from "next/link";
import Script from "next/script";
import "./globals.css";
import { JsonLd } from "@/components/JsonLd";
import { PwaRegister } from "@/components/PwaRegister";
import { SiteHeader } from "@/components/SiteHeader";
import { pageAlternates } from "@/lib/seo";
import { CATEGORIES } from "@/lib/taxonomy";
import { BEEHIIV_ATTRIBUTION, BEEHIIV_SUBSCRIBE } from "@/lib/newsletter";
import { SITE_DESC, SITE_NAME, SITE_URL } from "@/lib/tips";

const serif = Newsreader({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
  adjustFontFallback: true,
});

const sans = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-sans",
  display: "swap",
  adjustFontFallback: true,
});

export const viewport: Viewport = {
  themeColor: "#eef1f8",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "light",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: { default: `${SITE_NAME}: one tech tip a day`, template: `%s | ${SITE_NAME}` },
  description: SITE_DESC,
  alternates: pageAlternates("/"),
  openGraph: { siteName: SITE_NAME, type: "website", description: SITE_DESC, locale: "en_US" },
  twitter: { card: "summary_large_image" },
  appleWebApp: { capable: true, title: SITE_NAME, statusBarStyle: "default" },
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
      potentialAction: {
        "@type": "SearchAction",
        target: `${SITE_URL}/tips?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
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
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <JsonLd data={graph} />
        <a className="skip" href="#content">
          Skip to content
        </a>
        <SiteHeader />
        <div id="content" tabIndex={-1} className="content-slot">
          {children}
          <footer className="site-footer print-hide">
            <div className="footer-grid">
              <div>
                <h2>TechTipADay</h2>
                <p>One checked tip a day. Tips go live on their Europe/Berlin date and not before.</p>
              </div>
              <div>
                <h2>Browse</h2>
                <Link href="/tips">All tips</Link>
                <Link href="/fix">Fixes</Link>
                <Link href="/apps">Apps</Link>
                <Link href="/categories">Topics</Link>
                <Link href="/sheets">Cheat sheets</Link>
                <Link href="/timeline">Timeline</Link>
              </div>
              <div>
                <h2>Devices</h2>
                {CATEGORIES.filter((category) => !category.path.startsWith("/categories/")).map((category) => (
                  <Link key={category.id} href={category.path}>
                    {category.name}
                  </Link>
                ))}
                <Link href="/about">About</Link>
                <Link href="/subscribe">Subscribe</Link>
                <a href={BEEHIIV_SUBSCRIBE}>Daily email</a>
              </div>
            </div>
            <div className="footer-base">
              <span>© {new Date().getFullYear()} TechTipADay</span>
              <nav aria-label="Feeds">
                <Link href="/llms.txt">llms.txt</Link>
                <Link href="/feed.xml">RSS</Link>
                <Link href="/feed.json">JSON</Link>
                <Link href="/sitemap.xml">Sitemap</Link>
              </nav>
            </div>
          </footer>
        </div>
        <PwaRegister />
        <Script src={BEEHIIV_ATTRIBUTION} strategy="lazyOnload" />
      </body>
    </html>
  );
}
