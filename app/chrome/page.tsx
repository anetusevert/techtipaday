export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { DeviceHub } from "@/components/DeviceHub";
import { pageAlternates } from "@/lib/seo";
import { platformById } from "@/lib/taxonomy";

const platform = platformById("chrome")!;

export const metadata: Metadata = {
  title: platform.title,
  description: platform.intro,
  alternates: pageAlternates(platform.path),
};

export default function Page() {
  return <DeviceHub id="chrome" />;
}
