"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { m } from "framer-motion";
import { CaretT } from "./CaretT";

const tabs = [
  { href: "/", label: "Today", transition: "nav-back", match: (p: string) => p === "/", icon: TodayIcon },
  { href: "/tips", label: "Tips", transition: "nav-tab", match: (p: string) => p.startsWith("/tips"), icon: TipsIcon },
  { href: "/timeline", label: "Timeline", transition: "nav-tab", match: (p: string) => p.startsWith("/timeline"), icon: TimeIcon },
  { href: "/subscribe", label: "Subscribe", transition: "nav-tab", match: (p: string) => p.startsWith("/subscribe"), icon: MailIcon },
] as const;

export function SiteChrome() {
  const path = usePathname();
  return (
    <header className="site-header" style={{ viewTransitionName: "site-header" }}>
      <div className="chrome">
        <Link href="/" className="brand" aria-label="TechTipADay, home" transitionTypes={["nav-back"]}>
          <CaretT />
          <span className="wordmark">
            TechTip<span>ADay</span>
          </span>
        </Link>
        <Link
          href="/about"
          className="about-link"
          transitionTypes={["nav-forward"]}
          aria-current={path === "/about" ? "page" : undefined}
        >
          About
        </Link>
        <nav className="tabs" aria-label="Primary" style={{ viewTransitionName: "site-tabs" }}>
          {tabs.map((tab) => {
            const on = tab.match(path);
            const Icon = tab.icon;
            return (
              <m.div key={tab.href} className="tab-wrap" whileTap={{ scale: 0.96 }}>
                <Link
                  href={tab.href}
                  className="tab"
                  aria-current={on ? "page" : undefined}
                  transitionTypes={[tab.transition]}
                >
                  <Icon />
                  <span>{tab.label}</span>
                </Link>
              </m.div>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

function TodayIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="4" width="16" height="16" rx="4" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 9.5h8M12 9.5V16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <rect x="14.2" y="12.2" width="2.4" height="3.8" rx="0.4" fill="currentColor" />
    </svg>
  );
}

function TipsIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 7h12M6 12h12M6 17h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function TimeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="5" width="16" height="15" rx="3" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 3.5v3M16 3.5v3M4 10h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3.5" y="5.5" width="17" height="13" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M4.5 7l7.5 6 7.5-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
