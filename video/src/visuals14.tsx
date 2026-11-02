// More v3 mocks: an iPhone photo library full of the same picture saved again and again, then Photos' Duplicates
// merging them; Windows 11 voice typing (Windows + H) filling an email while you talk; and macOS window tiling
// (drag to the screen edge, or the green button's Move & Resize menu). The Caret T is always the pointer.
import { interpolate, useCurrentFrame, Easing } from "remotion";
import { C, clamp } from "./theme";
import { fontMono, fontSans } from "./fonts";
import { Finger } from "./visuals";
import type { Visual } from "./types";

const ease = Easing.inOut(Easing.cubic);
const PW = 620, PH = 1000, LW = 940, LH = 600;
type PhoneV = Extract<Visual, { type: "phone-settings" }>;
type LaptopV = Extract<Visual, { type: "laptop" }>;
const BLUE = "#4da3ff", AMBER = "#ffc857";

function Frame({ children, label }: { children: React.ReactNode; label?: string }) {
  return <div style={{ position: "relative", width: PW, height: PH, borderRadius: 72, background: "#0e1428", border: "10px solid #2c3658", boxShadow: "0 40px 100px rgba(0,0,0,.55)", overflow: "hidden" }}>
    <div style={{ position: "absolute", top: 18, left: PW / 2 - 70, width: 140, height: 34, borderRadius: 20, background: "#000", zIndex: 5 }} />
    {label && <div style={{ position: "absolute", top: 82, left: 34, fontFamily: fontMono, fontSize: 26, color: C.mut }}>{label}</div>}
    {children}
  </div>;
}
function Note({ text, good, bottom = 60 }: { text: string; good: boolean; bottom?: number }) {
  return <div style={{ position: "absolute", bottom, left: 30, right: 30, padding: "18px 22px", borderRadius: 18, textAlign: "center", zIndex: 6,
    background: good ? "rgba(62,224,160,.18)" : "rgba(255,107,107,.18)", border: `2px solid ${good ? C.acc : C.warn}`, fontFamily: fontMono, fontSize: 28, color: C.fg }}>{text}</div>;
}
function Pointer({ x, y, press, show = 1 }: { x: number; y: number; press: number; show?: number }) {
  return <div style={{ position: "absolute", left: 0, top: 0, width: LW, height: LH, zIndex: 8 }}><Finger x={x} y={y} press={press} show={show} /></div>;
}

/* A little "photo": a coloured scene so copies read as the same picture. */
const SCENES = [
  ["#ff9a6b", "#ffc857", "#3a2a5e"], // sunset
  ["#4da3ff", "#9fd3ff", "#2f6b3e"], // beach
  ["#b28dff", "#ff6bb5", "#1b2440"], // meme
  ["#3ee0a0", "#c8ffe6", "#25415e"], // park
];
function Pic({ s, size, badge }: { s: number; size: number; badge?: string }) {
  const [a, b, g] = SCENES[s % SCENES.length];
  return <div style={{ position: "relative", width: size, height: size, borderRadius: 10, overflow: "hidden", background: `linear-gradient(180deg, ${b}, ${a})` }}>
    <div style={{ position: "absolute", left: size * 0.6, top: size * 0.18, width: size * 0.22, height: size * 0.22, borderRadius: size, background: "#fffbe8", opacity: 0.85 }} />
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: size * 0.35, background: g }} />
    {badge && <div style={{ position: "absolute", right: 6, top: 6, padding: "2px 8px", borderRadius: 8, background: "rgba(0,0,0,.6)", fontFamily: fontMono, fontSize: 18, color: C.fg }}>{badge}</div>}
  </div>;
}

/** mode "dupes" (iPhone). (no reveal) a camera roll where the same few photos repeat, "Storage almost full"
 *  | "merge" Utilities › Duplicates: sets of copies, Select All, Merge, the sets fold into one each and space comes back. */
export function PhoneDupes({ v, dur }: { v: PhoneV; dur: number }) {
  const f = useCurrentFrame();
  const p = (a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: ease });
  if (v.reveal !== "merge") {
    const order = [0, 2, 0, 1, 2, 2, 0, 3, 1, 2, 0, 1];
    const hl = Math.floor(f / 10) % 4; // pulse one scene at a time: "that's the same photo again"
    return <Frame label="Photos › Library">
      <div style={{ position: "absolute", top: 130, left: 24, right: 24, display: "flex", flexWrap: "wrap", gap: 8 }}>
        {order.map((s, i) => <div key={i} style={{ opacity: interpolate(f, [i * 0.6, i * 0.6 + 4], [0, 1], clamp), outline: s === hl && f > 16 ? `4px solid ${C.warn}` : "none", borderRadius: 10 }}><Pic s={s} size={136} /></div>)}
      </div>
      <div style={{ position: "absolute", top: 730, left: 30, right: 30, padding: "16px 22px", borderRadius: 18, background: "#1c2440", border: `2px solid ${C.warn}`, fontFamily: fontSans, fontSize: 28, color: C.fg }}>
        <b>iPhone Storage Almost Full</b><div style={{ fontSize: 24, color: C.mut, marginTop: 4 }}>You can manage your storage in Settings.</div></div>
      <Note text={v.note ?? "Same photo. Again. And again."} good={false} bottom={40} />
    </Frame>;
  }
  const sets = [{ s: 0, n: 3, size: "9.3 MB" }, { s: 2, n: 3, size: "2.1 MB" }, { s: 1, n: 2, size: "6.8 MB" }, { s: 3, n: 3, size: "9.0 MB" }];
  const sel = p(dur * 0.12, dur * 0.22); const merge = p(dur * 0.5, dur * 0.7);
  const tapSel = interpolate(f, [dur * 0.08, dur * 0.12, dur * 0.18], [0, 1, 0], clamp);
  const tapMerge = interpolate(f, [dur * 0.42, dur * 0.46, dur * 0.52], [0, 1, 0], clamp);
  const fy = f < dur * 0.3 ? 150 : interpolate(p(dur * 0.25, dur * 0.4), [0, 1], [150, 806]);
  const fx = f < dur * 0.3 ? PW - 90 : interpolate(p(dur * 0.25, dur * 0.4), [0, 1], [PW - 90, PW / 2]);
  return <Frame label="Utilities › Duplicates">
    <div style={{ position: "absolute", top: 130, right: 34, fontFamily: fontSans, fontWeight: 700, fontSize: 30, color: sel > 0.5 ? C.acc : BLUE }}>{sel > 0.5 ? "Select All ✓" : "Select"}</div>
    <div style={{ position: "absolute", top: 130, left: 34, fontFamily: fontSans, fontWeight: 700, fontSize: 40, color: C.fg }}>Duplicates</div>
    {sets.map((st, i) => { const shown = Math.max(1, Math.round(interpolate(merge, [0, 1], [st.n, 1])));
      return <div key={i} style={{ position: "absolute", top: 200 + i * 138, left: 24, right: 24, height: 124, borderRadius: 18, padding: "10px 16px", display: "flex", alignItems: "center", gap: 10,
        background: C.panel, border: sel > 0.5 ? `3px solid ${merge > 0.95 ? C.acc : BLUE}` : "3px solid transparent" }}>
        {Array.from({ length: shown }).map((_, k) => <Pic key={k} s={st.s} size={100} badge={merge > 0.95 ? "best" : undefined} />)}
        <div style={{ marginLeft: "auto", textAlign: "right", fontFamily: fontMono, fontSize: 22, color: merge > 0.95 ? C.acc : C.mut }}>{merge > 0.95 ? "merged" : `${st.n} copies`}<br />{st.size}</div>
      </div>; })}
    <div style={{ position: "absolute", top: 768, left: 120, right: 120, height: 76, borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center",
      background: merge > 0.05 ? C.acc : sel > 0.5 ? C.warn : "#2f3a5e", fontFamily: fontSans, fontWeight: 700, fontSize: 32, color: merge > 0.05 || sel > 0.5 ? C.bg : C.fg }}>{merge > 0.95 ? "Merged ✓" : "Merge"}</div>
    <Finger x={fx} y={fy} press={Math.max(tapSel, tapMerge)} show={p(0, 6) * (1 - p(dur * 0.75, dur * 0.85))} />
    <Note text={v.note ?? (merge > 0.95 ? "Best copy kept. The rest: Recently Deleted." : "Your iPhone already grouped them.")} good={merge > 0.5} bottom={34} />
  </Frame>;
}

/* Windows 11 voice typing: an email draft, the voice typing bar under the cursor, words arriving as you talk. */
const SPOKEN = "Hi Sam, quick update on the move. The van is booked for Saturday at nine, and I'll bring the boxes on Friday.";
export function LaptopVoice({ v, dur }: { v: LaptopV; dur: number }) {
  const f = useCurrentFrame();
  const p = (a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: ease });
  const mode = v.mode ?? "slow";
  const keys = v.keys ?? ["⊞ Win", "H"];
  let text = ""; let bar = 0, listening = false, fx = LW * 0.5, fy = LH * 0.5, press = 0, show = 0;
  if (mode === "slow") { // hunting and pecking: three words in the whole beat
    const slow = "Hi Sam, quick upd";
    text = slow.slice(0, Math.floor(interpolate(f, [0, Math.max(dur, 1)], [0, slow.length], clamp)));
  } else if (mode === "click") {
    show = p(0, 6); const mv = p(0, dur * 0.4); fx = interpolate(mv, [0, 1], [LW * 0.8, 120]); fy = interpolate(mv, [0, 1], [LH * 0.85, 222]);
    press = interpolate(f, [dur * 0.45, dur * 0.5, dur * 0.58], [0, 1, 0], clamp);
  } else if (mode === "keys") {
    bar = p(dur * 0.35, dur * 0.5); listening = bar > 0.5;
  } else { // talk / punct
    bar = 1; listening = true;
    const full = mode === "punct" ? SPOKEN : SPOKEN.replace(/[,.]/g, "");
    const startAt = mode === "punct" ? Math.floor(full.length * 0.45) : 0;
    text = full.slice(0, startAt + Math.floor(interpolate(f, [2, dur * 0.85], [0, full.length - startAt], clamp)));
  }
  const pulse = listening ? 1 + 0.12 * Math.sin(f / 3) : 1;
  return <div style={{ width: LW + 80, display: "flex", flexDirection: "column", alignItems: "center", marginTop: 40 }}>
    <div style={{ position: "relative", width: LW, height: LH, borderRadius: 26, border: "12px solid #2c3658", background: "#e9eef8", overflow: "hidden", boxShadow: "0 40px 100px rgba(0,0,0,.55)" }}>
      <div style={{ height: 44, background: "#1a2340", display: "flex", alignItems: "center", padding: "0 20px", fontFamily: fontMono, fontSize: 22, color: C.mut }}>Outlook · New message</div>
      <div style={{ position: "absolute", top: 70, left: 40, right: 40, fontFamily: fontSans, fontSize: 26, color: "#5a6480", borderBottom: "2px solid #c9d2e6", paddingBottom: 10 }}>To: Sam</div>
      <div style={{ position: "absolute", top: 120, left: 40, right: 40, fontFamily: fontSans, fontSize: 26, color: "#5a6480", borderBottom: "2px solid #c9d2e6", paddingBottom: 10 }}>Subject: Moving day</div>
      <div style={{ position: "absolute", top: 200, left: 40, right: 60, fontFamily: fontSans, fontSize: 34, lineHeight: 1.4, color: "#1b2440" }}>
        {text}<span style={{ color: BLUE, opacity: f % 14 < 8 ? 1 : 0 }}>|</span></div>
      {bar > 0 && <div style={{ position: "absolute", left: LW / 2 - 200, bottom: 40 + 20 * (1 - bar), width: 400, height: 86, borderRadius: 20, opacity: bar, background: "#1c2440", border: `2px solid ${listening ? C.acc : "#3a4670"}`, display: "flex", alignItems: "center", gap: 20, padding: "0 24px" }}>
        <div style={{ width: 52, height: 52, borderRadius: 26, background: listening ? BLUE : "#2f3a5e", transform: `scale(${pulse})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>🎙</div>
        <span style={{ fontFamily: fontMono, fontSize: 24, color: C.fg }}>{listening ? "Listening…" : "Voice typing"}</span></div>}
      {mode === "slow" && <div style={{ position: "absolute", bottom: 30, left: 30, right: 30, padding: "12px", borderRadius: 14, textAlign: "center", background: "rgba(255,107,107,.18)", border: `2px solid ${C.warn}`, fontFamily: fontMono, fontSize: 26, color: "#1b2440" }}>{v.items?.[0] ?? "Ten minutes in. Still on line one."}</div>}
      {show > 0 && <Pointer x={fx} y={fy} press={press} show={show} />}
    </div>
    <div style={{ width: LW + 100, height: 26, borderRadius: "0 0 30px 30px", background: "#2c3658" }} />
    {mode === "keys" && <div style={{ display: "flex", gap: 22, marginTop: 50, alignItems: "center" }}>
      {keys.map((k, i) => { const on = f > 6 && f < dur * 0.6;
        return <div key={k} style={{ display: "flex", alignItems: "center", gap: 22 }}>{i > 0 && <span style={{ color: C.mut, fontSize: 56, fontFamily: fontSans }}>+</span>}
          <div style={{ padding: "26px 40px", borderRadius: 22, background: on ? C.acc : C.key, color: on ? C.bg : C.fg, fontFamily: fontSans, fontWeight: 700, fontSize: 54, boxShadow: "0 10px 0 #0a0f1e" }}>{k}</div></div>; })}
    </div>}
  </div>;
}

/* macOS window tiling: a Safari window and a Notes window. */
function MacWin({ x, y, w, h, title, tint, glow = false }: { x: number; y: number; w: number; h: number; title: string; tint: string; glow?: boolean }) {
  return <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 12, background: "#1c2440", border: `2px solid ${glow ? C.acc : "#3a4670"}`, overflow: "hidden", boxShadow: "0 16px 40px rgba(0,0,0,.45)" }}>
    <div style={{ height: 38, background: "#141c36", display: "flex", alignItems: "center", gap: 8, padding: "0 14px" }}>
      {["#ff5f57", "#febc2e", "#28c840"].map((c) => <div key={c} style={{ width: 14, height: 14, borderRadius: 7, background: c }} />)}
      <span style={{ marginLeft: 12, fontFamily: fontSans, fontSize: 20, color: C.mut }}>{title}</span></div>
    {[0, 1, 2, 3].map((k) => <div key={k} style={{ margin: "16px 18px 0", height: 22, width: `${80 - k * 12}%`, borderRadius: 6, background: tint, opacity: 0.5 }} />)}
  </div>;
}
/** action "mactile" (Mac, Sequoia+). mode "mess": two overlapping windows nudged and resized by hand
 *  | "drag": a window dragged to the left edge, the half highlights, it tiles | "menu": hover the green button, Move & Resize, Left
 *  | "both": the second window dragged to the right edge, two halves side by side. */
export function LaptopMacTile({ v, dur }: { v: LaptopV; dur: number }) {
  const f = useCurrentFrame();
  const p = (a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: ease });
  const mode = v.mode ?? "mess";
  const TOP = 34, H = LH - TOP - 8, HALF = LW / 2 - 6;
  const menuBar = <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 30, background: "rgba(20,28,54,.9)", display: "flex", alignItems: "center", gap: 22, padding: "0 18px", fontFamily: fontSans, fontSize: 18, color: C.fg, zIndex: 3 }}><b>Safari</b><span>File</span><span>Edit</span><span>View</span><span>Window</span></div>;
  let a = { x: 120, y: 90, w: 600, h: 380 }, b = { x: 300, y: 150, w: 560, h: 360 }; let zone = 0, fx = LW * 0.5, fy = LH * 0.5, press = 0, show = 0, menu = 0;
  if (mode === "mess") {
    const j = Math.sin(f / 5);
    a = { x: 120 + j * 30, y: 90, w: 600 + j * 40, h: 380 }; b = { x: 300 - j * 20, y: 150 + j * 10, w: 560, h: 360 - j * 20 };
    show = 1; fx = a.x + a.w; fy = a.y + a.h; press = 1;
  } else if (mode === "drag") {
    const d = p(dur * 0.1, dur * 0.55); const snap = p(dur * 0.6, dur * 0.75); zone = d > 0.85 ? 1 - snap : 0;
    const dx = interpolate(d, [0, 1], [120, -260]);
    a = { x: interpolate(snap, [0, 1], [dx, 4]), y: interpolate(snap, [0, 1], [90, TOP]), w: interpolate(snap, [0, 1], [600, HALF]), h: interpolate(snap, [0, 1], [380, H]) };
    show = p(0, 6) * (1 - p(dur * 0.8, dur * 0.9)); fx = interpolate(d, [0, 1], [420, 8]); fy = 110; press = d > 0 && d < 1 ? 1 : interpolate(f, [dur * 0.55, dur * 0.6], [1, 0], clamp);
  } else if (mode === "menu") {
    const mv = p(0, dur * 0.25); menu = p(dur * 0.28, dur * 0.36); const pick = p(dur * 0.55, dur * 0.7);
    show = p(0, 6) * (1 - p(dur * 0.8, dur * 0.9));
    fx = interpolate(mv, [0, 1], [500, a.x + 56]); fy = interpolate(mv, [0, 1], [400, a.y + 19]);
    if (f > dur * 0.4) { const m2 = p(dur * 0.4, dur * 0.5); fx = interpolate(m2, [0, 1], [a.x + 56, a.x + 96]); fy = interpolate(m2, [0, 1], [a.y + 19, a.y + 112]); }
    press = interpolate(f, [dur * 0.5, dur * 0.54, dur * 0.6], [0, 1, 0], clamp);
    if (pick > 0) { menu = 1 - pick; a = { x: interpolate(pick, [0, 1], [a.x, 4]), y: interpolate(pick, [0, 1], [a.y, TOP]), w: interpolate(pick, [0, 1], [a.w, HALF]), h: interpolate(pick, [0, 1], [a.h, H]) }; }
  } else { // both
    a = { x: 4, y: TOP, w: HALF, h: H };
    const d = p(dur * 0.05, dur * 0.4); const snap = p(dur * 0.45, dur * 0.6); zone = d > 0.85 ? 2 * (1 - snap) : 0;
    const bx = interpolate(d, [0, 1], [300, 560]);
    b = { x: interpolate(snap, [0, 1], [bx, LW / 2 + 2]), y: interpolate(snap, [0, 1], [150, TOP]), w: interpolate(snap, [0, 1], [560, HALF]), h: interpolate(snap, [0, 1], [360, H]) };
    show = p(0, 6) * (1 - p(dur * 0.65, dur * 0.75)); fx = interpolate(d, [0, 1], [500, LW - 10]); fy = 168; press = d > 0 && d < 1 ? 1 : 0;
  }
  const tiled = mode === "both" && f > dur * 0.6;
  return <div style={{ width: LW + 80, display: "flex", flexDirection: "column", alignItems: "center", marginTop: 40 }}>
    <div style={{ position: "relative", width: LW, height: LH, borderRadius: 26, border: "12px solid #2c3658", background: "linear-gradient(160deg,#2b3f7a,#14204a)", overflow: "hidden", boxShadow: "0 40px 100px rgba(0,0,0,.55)" }}>
      {menuBar}
      {zone > 0 && <div style={{ position: "absolute", top: TOP, bottom: 8, left: zone >= 1.5 || mode === "both" ? LW / 2 + 2 : 4, width: HALF, borderRadius: 14, background: "rgba(62,224,160,.18)", border: `3px solid ${C.acc}`, opacity: Math.min(1, zone) }} />}
      <MacWin {...b} title="Notes — Packing list" tint={AMBER} glow={tiled} />
      <MacWin {...a} title="Safari — Flights" tint={BLUE} glow={tiled} />
      {menu > 0 && <div style={{ position: "absolute", left: a.x + 40, top: a.y + 40, width: 330, borderRadius: 14, background: "#232c4a", border: "2px solid #3a4670", padding: 14, opacity: menu, zIndex: 6, fontFamily: fontSans, fontSize: 22, color: C.fg }}>
        <div style={{ color: C.mut, fontSize: 18, marginBottom: 10 }}>Move & Resize</div>
        <div style={{ display: "flex", gap: 12 }}>
          {["L", "R", "T", "B"].map((k, i) => <div key={k} style={{ width: 62, height: 44, borderRadius: 8, border: `2px solid ${i === 0 ? C.acc : "#55608a"}`, position: "relative", background: i === 0 && press > 0.3 ? "rgba(62,224,160,.25)" : "transparent" }}>
            <div style={{ position: "absolute", background: i === 0 ? C.acc : "#8b96bb", ...(k === "L" ? { left: 3, top: 3, bottom: 3, width: 26 } : k === "R" ? { right: 3, top: 3, bottom: 3, width: 26 } : k === "T" ? { left: 3, right: 3, top: 3, height: 17 } : { left: 3, right: 3, bottom: 3, height: 17 }) }} /></div>)}
        </div>
        <div style={{ color: C.mut, fontSize: 18, margin: "12px 0 6px" }}>Fill & Arrange</div>
        <div style={{ fontSize: 20 }}>Left & Right · Quarters</div></div>}
      {show > 0 && <Pointer x={fx} y={fy} press={press} show={show} />}
      {mode === "mess" && <div style={{ position: "absolute", bottom: 20, left: 30, right: 30, padding: "12px", borderRadius: 14, textAlign: "center", background: "rgba(255,107,107,.25)", border: `2px solid ${C.warn}`, fontFamily: fontMono, fontSize: 26, color: C.fg, zIndex: 9 }}>{v.items?.[0] ?? "Drag the corner. Too big. Again."}</div>}
    </div>
    <div style={{ width: LW + 100, height: 26, borderRadius: "0 0 30px 30px", background: "#2c3658" }} />
  </div>;
}
