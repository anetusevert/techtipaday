import { interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { C, clamp } from "./theme";
import { fontMono, fontSans } from "./fonts";
import type { Visual } from "./types";
import { CaretT } from "./CaretT";

const ease = Easing.inOut(Easing.cubic);
const DEFAULT_TEXT = "Meet me at the cafe at 7, I'll bring teh charger.";

/* ---------- Phone + keyboard ---------- */
const ROWS = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];
const PW = 620, PH = 1000, KB_TOP = 560;

function Finger({ x, y, press, show = 1 }: { x: number; y: number; press: number; show?: number }) {
  return <div style={{ position: "absolute", left: x - 42, top: y - 42, width: 84, height: 84, opacity: show, borderRadius: 22,
    transform: `scale(${1 - press * 0.12})`, boxShadow: `0 0 0 ${press * 20}px rgba(62,224,160,${0.35 * press}), 0 10px 30px rgba(0,0,0,.5)` }}>
    <CaretT size={84} /></div>;
}

function TextField({ text, cursor, typo, fixed, fix, wrongAt }: { text: string; cursor: number; typo?: string; fixed: number; fix?: string; wrongAt?: number }) {
  // Render text with a caret at character index `cursor` (fractional = glide between chars).
  const ti = typo ? text.indexOf(typo) : -1;
  const shown = fixed > 0.5 && typo && fix ? text.replace(typo, fix) : text;
  const chars = [...shown];
  const ci = Math.round(cursor);
  return (
    <div style={{ fontFamily: fontSans, fontSize: 40, lineHeight: 1.45, color: C.fg, padding: "26px 30px", background: C.panel, borderRadius: 26, minHeight: 230 }}>
      {chars.map((ch, i) => {
        const inTypo = ti >= 0 && i >= ti && i < ti + (typo?.length ?? 0);
        return <span key={i} style={{ position: "relative", background: inTypo ? (fixed > 0.5 ? "rgba(62,224,160,.35)" : "rgba(255,107,107,.30)") : "transparent",
          borderBottom: inTypo && fixed <= 0.5 ? `3px dotted ${C.warn}` : "none", borderRadius: 4 }}>
          {i === ci && <Caret wrong={wrongAt === i} />}{ch}</span>;
      })}
      {ci >= chars.length && <span style={{ position: "relative" }}><Caret />&nbsp;</span>}
    </div>
  );
}
function Caret({ wrong }: { wrong?: boolean }) {
  const f = useCurrentFrame();
  return <span style={{ position: "absolute", left: -4, top: 2, width: 8, height: 54, borderRadius: 4, background: wrong ? C.warn : "#4da3ff", boxShadow: `0 0 16px ${wrong ? C.warn : "#4da3ff"}`, opacity: f % 30 < 22 ? 1 : 0.5 }} />;
}

function Keyboard({ blank, spaceHeld, spaceLabel }: { blank: number; spaceHeld: number; spaceLabel: string }) {
  const kw = 52, gap = 8;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: KB_TOP, bottom: 0, background: "#151b30", padding: "26px 14px", borderRadius: "0 0 64px 64px" }}>
      {ROWS.map((r, ri) => (
        <div key={r} style={{ display: "flex", justifyContent: "center", gap, marginBottom: 14 }}>
          {[...r].map((k) => <div key={k} style={{ width: kw, height: 74, borderRadius: 10, background: C.key, color: C.fg, fontFamily: fontSans, fontSize: 32,
            display: "flex", alignItems: "center", justifyContent: "center", opacity: 1 - blank * 0.75 }}><span style={{ opacity: 1 - blank }}>{k}</span></div>)}
        </div>
      ))}
      <div style={{ display: "flex", justifyContent: "center", gap }}>
        <div style={{ width: 110, height: 74, borderRadius: 10, background: C.key, opacity: 1 - blank * 0.75 }} />
        <div style={{ width: 330, height: 74, borderRadius: 10, background: spaceHeld > 0 ? `rgba(62,224,160,${0.25 + spaceHeld * 0.5})` : C.key,
          color: C.fg, fontFamily: fontSans, fontSize: 28, display: "flex", alignItems: "center", justifyContent: "center", opacity: 1 - blank * 0.4 }}>{spaceLabel}</div>
        <div style={{ width: 110, height: 74, borderRadius: 10, background: C.key, opacity: 1 - blank * 0.75 }} />
      </div>
    </div>
  );
}
// Spacebar centre in phone coordinates
const SPACE = { x: PW / 2, y: KB_TOP + 26 + 3 * 88 + 37 };

function PhoneKeyboard({ v, dur }: { v: Extract<Visual, { type: "phone-keyboard" }>; dur: number }) {
  const f = useCurrentFrame();
  const text = v.text ?? DEFAULT_TEXT; const typo = v.typo ?? "teh"; const fix = v.fix ?? "the";
  const tIdx = text.indexOf(typo);
  const end = text.length;
  const p = (a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: ease });
  let cursor = end, blank = 0, held = 0, fixed = 0, fx = SPACE.x, fy = SPACE.y, press = 0, show = 0, wrongAt: number | undefined;
  let label = v.platform === "android" ? "Gboard" : "space";
  switch (v.action) {
    case "miss-taps": { // finger stabs at the typo and lands one char off, twice
      const taps = [[0.15, tIdx - 2], [0.5, tIdx + 4], [0.8, tIdx - 1]] as const;
      show = 1; fx = 380; fy = 330; cursor = end;
      for (const [at, idx] of taps) { const t0 = at * dur; if (f >= t0) { cursor = idx; wrongAt = idx; } press = Math.max(press, interpolate(f, [t0 - 4, t0, t0 + 6], [0, 1, 0], clamp)); }
      fx = 380 + Math.sin(f / 6) * 22; fy = 300 + Math.cos(f / 7) * 10; break; }
    case "hold-space": {
      show = p(0, 8); press = p(6, 14); held = p(10, 30); blank = p(18, 34); label = held > 0.7 ? "" : label; break; }
    case "trackpad": { // keys blank, finger roams, caret follows
      blank = 1; held = 1; show = 1; press = 1; label = "";
      const k = f / Math.max(dur, 1);
      cursor = interpolate(k, [0, 0.35, 0.7, 1], [end, 8, 30, end - 10], clamp);
      fx = SPACE.x + interpolate(k, [0, 0.35, 0.7, 1], [0, -200, 120, 60], clamp); fy = SPACE.y + interpolate(k, [0, 0.35, 0.7, 1], [0, -150, -60, -20], clamp); break; }
    case "glide-fix": {
      blank = 1 - p(dur * 0.65, dur * 0.8); held = 1 - p(dur * 0.6, dur * 0.7); show = 1 - p(dur * 0.6, dur * 0.7); press = 1; label = "";
      const g = p(0, dur * 0.55);
      cursor = interpolate(g, [0, 1], [end, tIdx + typo.length]);
      fx = SPACE.x + interpolate(g, [0, 1], [180, 40]); fy = SPACE.y - 40;
      fixed = p(dur * 0.6, dur * 0.62); if (fixed > 0.5) cursor = tIdx + fix.length; break; }
    case "swipe-space": {
      label = "← Gboard →"; show = 1; press = 1; held = 0.6;
      const s = interpolate(f, [0, dur * 0.35, dur * 0.7, dur], [0, -1, 1, 0.3], { ...clamp, easing: ease });
      fx = SPACE.x + s * 120; cursor = Math.max(0, tIdx + typo.length + Math.round(s * 6)); break; }
  }
  return (
    <div style={{ position: "relative", width: PW, height: PH, borderRadius: 72, background: "#0e1428", border: "10px solid #2c3658", boxShadow: "0 40px 100px rgba(0,0,0,.55)", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 18, left: PW / 2 - 70, width: 140, height: 34, borderRadius: 20, background: "#000" }} />
      <div style={{ position: "absolute", top: 82, left: 30, fontFamily: fontMono, fontSize: 26, color: C.mut }}>{v.platform === "android" ? "Messages · Android" : "Messages · iPhone"}</div>
      <div style={{ position: "absolute", top: 140, left: 26, right: 26 }}><TextField text={text} cursor={cursor} typo={typo} fixed={fixed} fix={fix} wrongAt={wrongAt} /></div>
      <Keyboard blank={blank} spaceHeld={held} spaceLabel={label} />
      {blank > 0.6 && <div style={{ position: "absolute", top: KB_TOP + 200, width: "100%", textAlign: "center", fontFamily: fontMono, fontSize: 30, color: C.acc, opacity: (blank - 0.6) * 2.5 }}>TRACKPAD MODE</div>}
      <Finger x={fx} y={fy} press={press} show={show} />
    </div>
  );
}

/* ---------- Generic visuals for other tips ---------- */
function Shortcut({ v }: { v: Extract<Visual, { type: "shortcut" }> }) {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  return <div style={{ textAlign: "center" }}>
    <div style={{ display: "flex", gap: 24, justifyContent: "center", alignItems: "center" }}>
      {v.keys.map((k, i) => { const s = spring({ frame: f - i * 8, fps, config: { damping: 12 } }); const down = interpolate(f, [v.keys.length * 8 + 10, v.keys.length * 8 + 16], [0, 1], clamp);
        return <div key={k} style={{ display: "flex", alignItems: "center", gap: 24 }}>{i > 0 && <span style={{ color: C.mut, fontSize: 60, fontFamily: fontSans }}>+</span>}
          <div style={{ transform: `scale(${s}) translateY(${down * 10}px)`, minWidth: 150, padding: "34px 30px", borderRadius: 24, background: down > 0.5 ? C.acc : C.key, color: down > 0.5 ? C.bg : C.fg,
            boxShadow: `0 ${14 - down * 10}px 0 #0a0f1e`, fontFamily: fontSans, fontWeight: 700, fontSize: 56 }}>{k}</div></div>; })}
    </div>
    {v.label && <div style={{ marginTop: 50, fontFamily: fontMono, color: C.mut, fontSize: 36 }}>{v.label}</div>}
  </div>;
}
function SettingsPath({ v }: { v: Extract<Visual, { type: "settings-path" }> }) {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  return <div style={{ width: 760 }}>
    {v.platform && <div style={{ fontFamily: fontMono, color: C.mut, fontSize: 32, marginBottom: 20 }}>{v.platform}</div>}
    {v.path.map((s, i) => { const on = spring({ frame: f - i * 12, fps, config: { damping: 14 } }); const last = i === v.path.length - 1;
      return <div key={i} style={{ opacity: on, transform: `translateX(${(1 - on) * 60}px)`, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "30px 36px", marginBottom: 16,
        borderRadius: 22, background: last ? "rgba(62,224,160,.18)" : C.panel, border: last ? `3px solid ${C.acc}` : "3px solid transparent", fontFamily: fontSans, fontSize: 46, color: C.fg }}>
        <span>{s}</span><span style={{ color: C.mut }}>›</span></div>; })}
  </div>;
}
function Icon({ v }: { v: Extract<Visual, { type: "icon" }> }) {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const s = spring({ frame: f, fps, config: { damping: 10 } });
  return <div style={{ textAlign: "center", transform: `scale(${s})` }}><div style={{ fontSize: 260 }}>{v.icon}</div>
    {v.label && <div style={{ fontFamily: fontSans, fontWeight: 700, fontSize: 52, color: C.fg }}>{v.label}</div>}</div>;
}
function Brand() {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const s = spring({ frame: f, fps, config: { damping: 11 } });
  // cursor blinks in: off, on, off, on, then steady blink
  const cur = f < 10 ? 0 : f < 40 ? (Math.floor((f - 10) / 6) % 2 === 0 ? 1 : 0) : (f % 30 < 20 ? 1 : 0);
  return <div style={{ textAlign: "center", transform: `scale(${0.8 + s * 0.2})`, opacity: s }}>
    <div style={{ width: 320, margin: "0 auto 40px", filter: "drop-shadow(0 30px 60px rgba(0,0,0,.5))" }}><CaretT size={320} cursor={cur} /></div>
    <div style={{ fontFamily: fontSans, fontWeight: 800, fontSize: 96, color: C.fg }}>TechTip<span style={{ color: C.acc }}>ADay</span></div>
    <div style={{ fontFamily: fontMono, fontSize: 42, color: C.mut, marginTop: 10 }}>techtipaday.com</div></div>;
}

export function VisualView({ v, dur }: { v?: Visual; dur: number }) {
  if (!v) return null;
  switch (v.type) {
    case "phone-keyboard": return <PhoneKeyboard v={v} dur={dur} />;
    case "shortcut": return <Shortcut v={v} />;
    case "settings-path": return <SettingsPath v={v} />;
    case "icon": return <Icon v={v} />;
    case "brand": return <Brand />;
  }
}
