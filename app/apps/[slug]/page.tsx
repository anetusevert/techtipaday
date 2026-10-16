export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LandingView } from "@/components/LandingView";
import { appBySlug } from "@/lib/landings";
import { pageAlternates } from "@/lib/seo";
import { liveAppPages, tipsForApp } from "@/lib/tips";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const app = appBySlug((await params).slug);
  const tips = app ? tipsForApp(app.slug) : [];
  if (!app || !tips.length) return { title: "Not found", robots: { index: false, follow: false } };
  return { title: app.title, description: app.intro, alternates: pageAlternates(`/apps/${app.slug}`) };
}

export default async function AppPage({ params }: { params: Promise<{ slug: string }> }) {
  const app = appBySlug((await params).slug);
  if (!app) notFound();
  const tips = tipsForApp(app.slug);
  if (!tips.length) notFound();
  const related = liveAppPages()
    .filter((item) => item.slug !== app.slug)
    .slice(0, 6)
    .map((item) => ({ href: `/apps/${item.slug}`, title: item.name, meta: "App" }));
  return (
    <LandingView
      kicker="App"
      h1={app.h1}
      intro={app.intro}
      path={`/apps/${app.slug}`}
      crumbs={[
        { name: "Home", href: "/" },
        { name: "Apps", href: "/apps" },
        { name: app.name, href: `/apps/${app.slug}` },
      ]}
      tips={tips}
      related={related}
    />
  );
}
