"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Today", match: (p: string) => p === "/" },
  { href: "/tips", label: "Tips", match: (p: string) => p.startsWith("/tips") },
  { href: "/how-to", label: "By task", match: (p: string) => p.startsWith("/how-to") || p.startsWith("/compare") || p.startsWith("/alternatives") },
  { href: "/apps", label: "Apps", match: (p: string) => p.startsWith("/apps") },
  { href: "/about", label: "About", match: (p: string) => p.startsWith("/about") },
] as const;

export function NavLinks() {
  const path = usePathname();
  return (
    <nav className="nav" aria-label="Primary">
      {links.map((link) => {
        const on = link.match(path);
        return (
          <Link key={link.href} href={link.href} aria-current={on ? "page" : undefined}>
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
