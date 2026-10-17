export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LandingView } from "@/components/LandingView";
import { pageAlternates } from "@/lib/seo";
import { CATEGORIES } from "@/lib/taxonomy";

/** Topic pages are matched on their path, so /categories/ai-tools finds the "ai" category. */
const topicBySlug = (slug: string) => CATEGORIES.find((c) => c.path === `/categories/${slug}`);
import { liveTopicPages, tipsForCategory } from "@/lib/tips";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const category = topicBySlug((await params).slug);
  if (!category) return { title: "Not found", robots: { index: false, follow: false } };
  return { title: `${category.name} tips`, description: category.intro, alternates: pageAlternates(category.path) };
}

export default async function TopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const category = topicBySlug((await params).slug);
  if (!category) notFound();
  const tips = tipsForCategory(category.id);
  if (!tips.length) notFound();
  const related = liveTopicPages()
    .filter((item) => item.id !== category.id)
    .map((item) => ({ href: item.path, title: item.name, meta: "Topic" }));
  return (
    <LandingView
      kicker="Topic"
      h1={`${category.name} tips`}
      intro={category.intro}
      path={category.path}
      crumbs={[
        { name: "Home", href: "/" },
        { name: "Topics", href: "/categories" },
        { name: category.name, href: category.path },
      ]}
      tips={tips}
      related={related}
      sheetHref={category.sheet}
      sheetLabel={`${category.name} cheat sheet`}
    />
  );
}
