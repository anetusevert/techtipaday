import { AbsoluteFill } from "remotion";
import { CaretT } from "../CaretT";
import { fDisplay, fMono } from "./fonts";

// Same palette as K in TipV3. Kept local so this still doesn't import the composition.
const bg = "#0b1020";
const ink = "#eef1f8";
const mut = "#8f99b3";
const mint = "#3ee0a0";
const sel = "rgba(62,224,160,.28)";
const hook = "#ff6b6b";

export type CoverPosterProps = {
  n: number;
  /** 3–7 short words. The last word is the mint highlight. */
  coverLine: string;
  hookLabel?: string | null;
};

/** Split 3–7 words into 2 or 3 rows, keeping rows close in length. Longer rows win a tie. */
export function coverRows(coverLine: string): string[][] {
  const words = coverLine.replace(/\s+/g, " ").trim().split(" ").filter(Boolean);
  if (words.length <= 2) return [words];
  const width = (row: string[]) => row.join(" ").length;
  const partitions = (rows: number) => {
    const out: string[][][] = [];
    const rec = (start: number, left: number, acc: string[][]) => {
      if (left === 1) { out.push([...acc, words.slice(start)]); return; }
      for (let i = start + 1; i <= words.length - (left - 1); i++) {
        acc.push(words.slice(start, i));
        rec(i, left - 1, acc);
        acc.pop();
      }
    };
    rec(0, rows, []);
    return out;
  };
  const uneven = (rows: string[][]) => {
    const lens = rows.map(width);
    const max = Math.max(...lens);
    const min = Math.min(...lens);
    return max * 100 + (max - min) * 6;
  };
  const best = (n: number) => partitions(n).sort((a, b) => uneven(a) - uneven(b))[0];
  const two = best(2);
  const max2 = Math.max(...two.map(width));
  if (words.length >= 6 || max2 > 16) {
    const three = best(3);
    if (three && Math.max(...three.map(width)) <= max2 - 3) return three;
  }
  return two;
}

function fontSizeFor(rows: string[][]) {
  const longest = Math.max(...rows.map((r) => r.join(" ").length), 1);
  // ~0.56em per character in Bricolage Grotesque 800, inside a 920px column.
  return Math.round(Math.min(168, Math.max(104, 940 / (longest * 0.56))));
}

/** Static hook poster. No springs, no blink: frame 0 is the finished cover. */
export function CoverPoster({ n, coverLine, hookLabel }: CoverPosterProps) {
  const rows = coverRows(coverLine);
  const fontSize = fontSizeFor(rows);
  const label = hookLabel?.trim() || "SOUND FAMILIAR?";
  const c = hook;
  return (
    <AbsoluteFill style={{ background: bg }}>
      <AbsoluteFill style={{ backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,.035) 0 2px, transparent 2px 96px)" }} />
      <AbsoluteFill style={{ background: `radial-gradient(circle at 80% 8%, ${c}26 0%, transparent 46%), radial-gradient(circle at 10% 96%, rgba(62,224,160,.14) 0%, transparent 42%)` }} />
      <div style={{ position: "absolute", top: 96, left: 80, right: 80, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <CaretT size={70} cursor={1} />
          <span style={{ fontFamily: fDisplay, fontWeight: 800, fontSize: 48, color: ink, letterSpacing: -1 }}>TechTip<span style={{ color: mint }}>ADay</span></span>
        </div>
        <span style={{ fontFamily: fMono, fontWeight: 700, fontSize: 32, color: mut }}>TIP #{String(n).padStart(2, "0")}</span>
      </div>
      <div style={{ position: "absolute", top: 250, left: 76, right: 76, bottom: 140, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", alignSelf: "flex-start", gap: 14, padding: "14px 28px 14px 22px", borderRadius: 14, background: `${c}22`, border: `3px solid ${c}`, color: c, fontFamily: fMono, fontWeight: 700, fontSize: 36, letterSpacing: 2, marginBottom: 48 }}>
          <span style={{ width: 12, height: 40, background: c, borderRadius: 2 }} />
          {label}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: Math.round(fontSize * 0.06) }}>
          {rows.map((row, ri) => {
            const lastRow = ri === rows.length - 1;
            return (
              <div key={ri} style={{ display: "flex", flexWrap: "nowrap", alignItems: "center", gap: Math.round(fontSize * 0.18), fontFamily: fDisplay, fontWeight: 800, fontSize, lineHeight: 0.98, letterSpacing: -3, color: ink }}>
                {row.map((w, wi) => {
                  const last = lastRow && wi === row.length - 1;
                  return <span key={wi} style={last ? { color: mint, background: sel, borderRadius: 18, padding: "2px 18px 8px" } : undefined}>{w}</span>;
                })}
                {lastRow && <span style={{ width: Math.round(fontSize * 0.09), height: Math.round(fontSize * 0.78), background: mint, borderRadius: 4, boxShadow: `0 0 22px ${mint}`, flex: "0 0 auto" }} />}
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
}
