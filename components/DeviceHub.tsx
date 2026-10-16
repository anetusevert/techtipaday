import { notFound } from "next/navigation";
import { LandingView } from "./LandingView";
import { CATEGORIES, type PlatformId, platformById } from "@/lib/taxonomy";
import { hubCards, tipsForPlatform } from "@/lib/tips";

export function DeviceHub({ id }: { id: PlatformId }) {
  const platform = platformById(id);
  if (!platform) notFound();
  const tips = tipsForPlatform(id);
  if (!tips.length) notFound();
  const category = CATEGORIES.find((item) => item.path === platform.path);
  const related = [
    ...CATEGORIES.filter((item) => item.path !== platform.path && !item.path.startsWith("/categories")).map((item) => ({
      href: item.path,
      title: item.name,
      meta: "Device",
    })),
    ...hubCards()
      .slice(0, 4)
      .map(({ hub, count }) => ({
        href: `/fix/${hub.slug}`,
        title: hub.h1,
        meta: `${count} ${count === 1 ? "tip" : "tips"}`,
      })),
  ];
  return (
    <LandingView
      kicker="Device"
      h1={platform.h1}
      intro={platform.intro}
      path={platform.path}
      crumbs={[
        { name: "Home", href: "/" },
        { name: platform.name, href: platform.path },
      ]}
      tips={tips}
      related={related}
      sheetHref={category?.sheet}
      sheetLabel={category ? `${category.name} cheat sheet` : undefined}
    />
  );
}
