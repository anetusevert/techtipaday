export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CompareView, compareMetadata } from "@/components/CompareView";
import { compareBySlug } from "@/lib/compare";

const find = (slug: string) => {
  const page = compareBySlug(slug);
  return page && page.kind !== "alternatives" ? page : undefined;
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  return compareMetadata(find((await params).slug));
}

export default async function ComparePage({ params }: { params: Promise<{ slug: string }> }) {
  const page = find((await params).slug);
  if (!page) notFound();
  return <CompareView page={page} />;
}
