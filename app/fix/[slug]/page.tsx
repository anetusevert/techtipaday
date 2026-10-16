export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LandingView } from "@/components/LandingView";
import { pageAlternates } from "@/lib/seo";
import { fixPage, relatedFixes, tipsForFix } from "@/lib/tips";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const page = fixPage((await params).slug);
  const tips = page ? tipsForFix(page.slug) : [];
  if (!page || !tips.length) return { title: "Not found", robots: { index: false, follow: false } };
  return { title: page.title, description: page.intro, alternates: pageAlternates(page.path) };
}

export default async function FixPage({ params }: { params: Promise<{ slug: string }> }) {
  const page = fixPage((await params).slug);
  if (!page) notFound();
  const tips = tipsForFix(page.slug);
  if (!tips.length) notFound();
  const related = relatedFixes(page.slug).map((item) => ({
    href: item.page.path,
    title: item.page.h1,
    meta: `${item.count} ${item.count === 1 ? "tip" : "tips"}`,
  }));
  return (
    <LandingView
      kicker="Fix"
      h1={page.h1}
      intro={page.intro}
      path={page.path}
      crumbs={[
        { name: "Home", href: "/" },
        { name: "Fixes", href: "/fix" },
        { name: page.h1, href: page.path },
      ]}
      tips={tips}
      related={related}
    />
  );
}
