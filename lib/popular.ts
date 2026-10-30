import { SHORTS } from "@/lib/videos";
import { getLiveTip, type Tip } from "@/lib/tips";

/** Live tips ranked by public YouTube Short views (from lib/videos.ts). */
export function mostWatched(limit = 6, exclude?: string): Tip[] {
  return Object.entries(SHORTS)
    .filter(([slug]) => slug !== exclude)
    .sort((a, b) => b[1].views - a[1].views)
    .map(([slug]) => getLiveTip(slug))
    .filter((t): t is Tip => !!t)
    .slice(0, limit);
}
