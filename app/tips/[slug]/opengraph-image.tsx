import { ImageResponse } from "next/og";
import { getLiveTip } from "@/lib/tips";
import { categoryName } from "@/lib/taxonomy";

export const alt = "TechTipADay tip";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Per-tip share card: device, the tip title and the site, in the brand navy and green. */
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const tip = getLiveTip((await params).slug);
  const title = tip?.title ?? "One tech tip a day";
  const kicker = tip ? `${categoryName(tip.category)} · ${tip.minutes} min` : "TechTipADay";
  const fontSize = title.length > 60 ? 64 : title.length > 42 ? 74 : 84;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "64px 72px", background: "linear-gradient(160deg, #0b1020 0%, #121a33 70%, #0f2a2a 100%)", color: "#f3f5fb", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, background: "#0b1020", border: "3px solid #3ee0a0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, fontWeight: 800 }}>T</div>
          <div style={{ display: "flex", fontSize: 36, fontWeight: 700 }}>
            TechTip<span style={{ color: "#3ee0a0" }}>ADay</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ display: "flex", fontSize: 28, color: "#3ee0a0", textTransform: "uppercase", letterSpacing: 3 }}>{kicker}</div>
          <div style={{ display: "flex", fontSize, fontWeight: 800, lineHeight: 1.08 }}>{title}</div>
        </div>
        <div style={{ display: "flex", fontSize: 30, color: "#aab3cc" }}>techtipaday.com · one tech tip a day, step by step</div>
      </div>
    ),
    size,
  );
}
