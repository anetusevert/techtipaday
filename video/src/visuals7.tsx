// More v3 mocks: an iPhone lying face down on silent (or blinking its LED for a call), a photo of a router sticker whose
// Wi-Fi key gets retyped badly (or copied with Live Text / Google Lens), and Windows 11 Snap layouts. The Caret T is always the pointer.
import { interpolate, useCurrentFrame, Easing } from "remotion";
import { C, clamp } from "./theme";
import { fontMono, fontSans } from "./fonts";
import { Finger } from "./visuals";
import type { Visual } from "./types";

const ease = Easing.inOut(Easing.cubic);
const PW = 620, PH = 1000, LW = 940, LH = 600;
type PhoneV = Extract<Visual, { type: "phone-settings" }>;
type LaptopV = Extract<Visual, { type: "laptop" }>;

function Frame({ children, label, bg = "#0e1428", notch = true }: { children: React.ReactNode; label?: string; bg?: string; notch?: boolean }) {
  return <div style={{ position: "relative", width: PW, height: PH, borderRadius: 72, background: bg, border: "10px solid #2c3658", boxShadow: "0 40px 100px rgba(0,0,0,.55)", overflow: "hidden" }}>
    {notch && <div style={{ position: "absolute", top: 18, left: PW / 2 - 70, width: 140, height: 34, borderRadius: 20, background: "#000", zIndex: 5 }} />}
    {label && <div style={{ position: "absolute", top: 82, left: 34, fontFamily: fontMono, fontSize: 26, color: C.mut }}>{label}</div>}
    {children}
  </div>;
}
function Note({ text, good }: { text: string; good: boolean }) {
  return <div style={{ position: "absolute", bottom: 60, left: 30, right: 30, padding: "18px 22px", borderRadius: 18, textAlign: "center", zIndex: 4,
    background: good ? "rgba(62,224,160,.18)" : "rgba(255,107,107,.18)", border: `2px solid ${good ? C.acc : C.warn}`, fontFamily: fontMono, fontSize: 28, color: C.fg }}>{text}</div>;
}

/** mode "flash": the back of an iPhone, face down on silent while a call comes in unnoticed. reveal "on" blinks the LED with every ring. */
export function PhoneFlash({ v, dur }: { v: PhoneV; dur: number }) {
  const f = useCurrentFrame();
  const on = v.reveal === "on";
  const missed = Math.min(3, 1 + Math.floor((f / Math.max(dur, 1)) * 3));
  const blink = on && f > 6 ? (f % 18 < 6 ? 1 : f % 18 < 9 ? 0.4 : 0) : 0;
  const bx = 46, by = 46, bs = 250; const led = { x: bx + 186, y: by + 64 };
  const ring = (f % 30) / 30;
  return <Frame bg="#1a2036" notch={false}>
    <div style={{ position: "absolute", left: bx, top: by, width: bs, height: bs, borderRadius: 60, background: "#232b47", border: "3px solid #313b5e" }}>
      {[[34, 34], [34, 140], [140, 88]].map(([x, y], i) => <div key={i} style={{ position: "absolute", left: x, top: y, width: 82, height: 82, borderRadius: 41, background: "#0b0f1d", border: "8px solid #3a4566" }} />)}
      <div style={{ position: "absolute", left: led.x - bx - 20, top: led.y - by - 20, width: 40, height: 40, borderRadius: 20, background: blink > 0 ? "#fffbe8" : "#5d6584", boxShadow: blink > 0 ? `0 0 ${60 * blink}px ${30 * blink}px rgba(255,248,214,${0.9 * blink})` : "none" }} />
    </div>
    {blink > 0 && <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at ${led.x}px ${led.y}px, rgba(255,250,225,${0.55 * blink}) 0%, rgba(255,250,225,${0.18 * blink}) 30%, rgba(255,250,225,0) 62%)`, zIndex: 2 }} />}
    <div style={{ position: "absolute", top: 120, right: 40, padding: "8px 18px", borderRadius: 14, border: `2px solid ${C.warn}`, color: C.warn, fontFamily: fontMono, fontSize: 26 }}>silent</div>
    <div style={{ position: "absolute", top: 370, left: 0, right: 0, textAlign: "center", fontFamily: fontMono, fontSize: 26, color: C.mut }}>{v.path[0] ?? "on silent · face down"}</div>
    <div style={{ position: "absolute", top: 440, left: 60, right: 60, height: 150, borderRadius: 26, background: C.panel, display: "flex", alignItems: "center", gap: 24, padding: "0 28px", zIndex: 3 }}>
      <div style={{ position: "relative", width: 84, height: 84 }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 42, background: "#4da3ff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fontSans, fontWeight: 800, fontSize: 40, color: "#0b1020" }}>M</div>
        <div style={{ position: "absolute", inset: -12 - ring * 22, borderRadius: 80, border: `3px solid rgba(77,163,255,${0.6 * (1 - ring)})` }} />
      </div>
      <div><div style={{ fontFamily: fontSans, fontWeight: 700, fontSize: 38, color: C.fg }}>Mum</div>
        <div style={{ fontFamily: fontMono, fontSize: 24, color: on ? C.acc : C.mut, marginTop: 6 }}>{on ? "calling · flash on" : "calling · no sound"}</div></div>
    </div>
    {!on && <div style={{ position: "absolute", top: 630, left: 0, right: 0, textAlign: "center", fontFamily: fontSans, fontWeight: 700, fontSize: 44, color: C.warn, zIndex: 3 }}>{`${missed} missed call${missed > 1 ? "s" : ""}`}</div>}
    {on && <div style={{ position: "absolute", top: 630, left: 0, right: 0, textAlign: "center", fontFamily: fontSans, fontWeight: 700, fontSize: 44, color: C.acc, zIndex: 3, opacity: interpolate(f, [8, 18], [0, 1], clamp) }}>you see it ring</div>}
    <Note text={v.note ?? (on ? "LED Flash for Alerts · on" : "Silent, face down, missed")} good={on} />
  </Frame>;
}

/** mode "photo": a photo of a router sticker with a Wi-Fi key.
 *  (no reveal) retyping it by hand with a typo | "hold" Live Text: press and hold, Copy | "lens" Google Photos toolbar, tap Lens
 *  | "select" Lens Text tab, the key is selected and copied | "copied" the key lands in a note, no typing. */
export function PhotoText({ v, dur }: { v: PhoneV; dur: number }) {
  const f = useCurrentFrame();
  const p = (a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: ease });
  const r = v.reveal;
  const KEY = "7Kq9-mX2p-4Lw8", TYPO = "7Kq9-mX2p-4Iw8";
  const ph = { x: 26, y: 140, w: PW - 52, h: 420 };
  const keyBox = { x: ph.x + 70, y: ph.y + 190, w: 420, h: 62 };
  let fx = PW * 0.7, fy = PH - 150, press = 0, show = 0;
  let sel = 0, menu = 0, copied = 0, lensBar = 0, lensHit = 0, scan = 0, tabs = 0;
  if (r === "hold") {
    show = p(0, 6); const mv = p(0, dur * 0.25); fx = interpolate(mv, [0, 1], [PW * 0.7, keyBox.x + 210]); fy = interpolate(mv, [0, 1], [PH - 150, keyBox.y + 40]);
    press = interpolate(f, [dur * 0.25, dur * 0.3, dur * 0.5, dur * 0.55], [0, 1, 1, 0], clamp); sel = p(dur * 0.3, dur * 0.45); menu = p(dur * 0.48, dur * 0.56);
    const toCopy = p(dur * 0.58, dur * 0.7); if (toCopy > 0) { fx = interpolate(toCopy, [0, 1], [keyBox.x + 210, keyBox.x + 70]); fy = interpolate(toCopy, [0, 1], [keyBox.y + 40, keyBox.y - 44]); }
    press = Math.max(press, interpolate(f, [dur * 0.72, dur * 0.76, dur * 0.82], [0, 1, 0], clamp)); copied = p(dur * 0.78, dur * 0.86);
  } else if (r === "lens") {
    lensBar = 1; show = p(0, 6); const mv = p(0, dur * 0.35); fx = interpolate(mv, [0, 1], [PW * 0.75, PW / 2 + 70]); fy = interpolate(mv, [0, 1], [PH - 300, PH - 110]);
    press = interpolate(f, [dur * 0.38, dur * 0.44, dur * 0.52], [0, 1, 0], clamp); lensHit = p(dur * 0.44, dur * 0.5); scan = p(dur * 0.5, dur * 0.95);
  } else if (r === "select") {
    tabs = 1; sel = p(dur * 0.12, dur * 0.3); show = p(0, 6);
    const mv = p(0, dur * 0.4); fx = interpolate(mv, [0, 1], [PW * 0.7, PW / 2]); fy = interpolate(mv, [0, 1], [PH - 300, PH - 210]);
    press = interpolate(f, [dur * 0.45, dur * 0.5, dur * 0.58], [0, 1, 0], clamp); copied = p(dur * 0.52, dur * 0.6);
  } else if (r === "copied") { sel = 1; copied = 1; }
  const typed = !r ? Math.floor(p(4, dur * 0.7) * TYPO.length) : 0;
  const pasteIn = r === "copied" ? p(dur * 0.1, dur * 0.35) : 0;
  return <Frame label={v.path.join(" › ")}>
    <div style={{ position: "absolute", left: ph.x, top: ph.y, width: ph.w, height: ph.h, borderRadius: 24, overflow: "hidden", background: "linear-gradient(160deg,#3b3f52 0%,#262a3a 100%)" }}>
      <div style={{ position: "absolute", left: 40, top: 40, width: ph.w - 80, height: ph.h - 80, borderRadius: 14, background: "#e9ebf1", transform: "rotate(-2deg)", padding: "26px 30px", fontFamily: fontMono, color: "#1c2133" }}>
        <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: 2 }}>HOME ROUTER AX3000</div>
        <div style={{ fontSize: 22, marginTop: 18 }}>Wi-Fi: HOME-5G-4F21</div>
        <div style={{ fontSize: 22, marginTop: 30, color: "#4a5068" }}>Wi-Fi key</div>
        <div style={{ position: "relative", display: "inline-block", fontSize: 40, fontWeight: 700, marginTop: 4, padding: "2px 6px", borderRadius: 6,
          background: sel > 0 ? `rgba(62,224,160,${0.55 * sel})` : "transparent", boxShadow: tabs ? `0 0 0 3px rgba(77,163,255,.8)` : "none" }}>{KEY}</div>
        <div style={{ fontSize: 20, marginTop: 26, color: "#4a5068" }}>S/N 2X8841-0093 · Admin: 192.168.1.1</div>
      </div>
      {scan > 0 && scan < 1 && <div style={{ position: "absolute", left: 0, right: 0, top: scan * ph.h - 20, height: 40, background: "linear-gradient(180deg,rgba(77,163,255,0),rgba(77,163,255,.55),rgba(77,163,255,0))" }} />}
      {menu > 0 && <div style={{ position: "absolute", left: 80, top: 150, display: "flex", borderRadius: 14, overflow: "hidden", background: "#1c2440", border: "2px solid #3a4670", opacity: menu, transform: `scale(${0.85 + 0.15 * menu})`, fontFamily: fontSans, fontSize: 28 }}>
        {["Copy", "Select All", "Look Up"].map((t, i) => <div key={t} style={{ padding: "12px 20px", color: C.fg, background: i === 0 && copied > 0 ? "rgba(62,224,160,.35)" : "transparent", borderLeft: i ? "2px solid #3a4670" : "none" }}>{t}</div>)}
      </div>}
    </div>
    {!r && <div style={{ position: "absolute", top: 600, left: 26, right: 26, padding: "22px 26px", borderRadius: 22, background: C.panel }}>
      <div style={{ fontFamily: fontMono, fontSize: 22, color: C.mut }}>Enter password</div>
      <div style={{ fontFamily: fontMono, fontSize: 44, color: C.fg, marginTop: 8 }}>{[...TYPO.slice(0, typed)].map((ch, i) => <span key={i} style={{ color: i === 11 ? C.warn : C.fg, background: i === 11 ? "rgba(255,107,107,.25)" : "transparent" }}>{ch}</span>)}
        <span style={{ display: "inline-block", width: 4, height: 44, background: "#4da3ff", verticalAlign: "-6px", opacity: f % 24 < 14 ? 1 : 0 }} /></div>
    </div>}
    {r === "copied" && <div style={{ position: "absolute", top: 600, left: 26, right: 26, padding: "22px 26px", borderRadius: 22, background: "rgba(62,224,160,.12)", border: `3px solid ${C.acc}`, opacity: pasteIn, transform: `translateY(${(1 - pasteIn) * -60}px)` }}>
      <div style={{ fontFamily: fontMono, fontSize: 22, color: C.mut }}>Enter password</div>
      <div style={{ fontFamily: fontMono, fontSize: 44, color: C.acc, marginTop: 8 }}>{KEY}</div>
    </div>}
    {lensBar > 0 && <div style={{ position: "absolute", left: 26, right: 26, bottom: 70, height: 110, borderRadius: 24, background: C.panel, display: "flex", justifyContent: "space-around", alignItems: "center", fontFamily: fontSans, fontSize: 28, color: C.fg }}>
      {["Share", "Edit", "Lens", "Delete"].map((t) => <div key={t} style={{ padding: "12px 18px", borderRadius: 14, background: t === "Lens" && lensHit > 0.5 ? "rgba(62,224,160,.25)" : "transparent", border: t === "Lens" && lensHit > 0.5 ? `2px solid ${C.acc}` : "2px solid transparent" }}>{t}</div>)}
    </div>}
    {lensBar > 0 && scan > 0.2 && <div style={{ position: "absolute", top: 600, left: 0, right: 0, textAlign: "center", fontFamily: fontMono, fontSize: 28, color: "#4da3ff", opacity: p(dur * 0.55, dur * 0.65) }}>Lens is reading the photo…</div>}
    {tabs > 0 && <>
      <div style={{ position: "absolute", top: 600, left: 26, right: 26, display: "flex", justifyContent: "center", gap: 16, fontFamily: fontSans, fontSize: 30 }}>
        {["Search", "Text", "Translate"].map((t) => <div key={t} style={{ padding: "12px 26px", borderRadius: 30, color: t === "Text" ? "#0b1020" : C.fg, background: t === "Text" ? "#4da3ff" : C.panel, fontWeight: t === "Text" ? 700 : 400 }}>{t}</div>)}
      </div>
      <div style={{ position: "absolute", left: PW / 2 - 120, top: PH - 250, width: 240, height: 84, borderRadius: 42, background: copied > 0.5 ? C.acc : "#2a3354", color: copied > 0.5 ? "#0b1020" : C.fg,
        display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fontSans, fontWeight: 700, fontSize: 34 }}>{copied > 0.5 ? "✓ Copied" : "Copy text"}</div>
    </>}
    {r === "hold" && copied > 0 && <div style={{ position: "absolute", top: 620, left: 0, right: 0, textAlign: "center", fontFamily: fontSans, fontWeight: 700, fontSize: 40, color: C.acc, opacity: copied }}>Copied</div>}
    {!r && <Note text={v.note ?? (typed >= TYPO.length ? "Wrong password. Again." : "Squint, type, repeat")} good={false} />}
    {r === "copied" && <Note text={v.note ?? "Pasted straight from the photo"} good />}
    {show > 0 && <Finger x={fx} y={fy} press={press} show={show} />}
  </Frame>;
}

/* ---------- Windows 11 Snap layouts ---------- */
type Box = { x: number; y: number; w: number; h: number };
const SH = LH - 56; // screen height above the taskbar
const HALF_L: Box = { x: 8, y: 8, w: LW / 2 - 12, h: SH - 16 }, HALF_R: Box = { x: LW / 2 + 4, y: 8, w: LW / 2 - 12, h: SH - 16 };
const mix = (a: Box, b: Box, t: number): Box => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, w: a.w + (b.w - a.w) * t, h: a.h + (b.h - a.h) * t });
function Win({ b, title, color, kind, hi = 0, z = 1 }: { b: Box; title: string; color: string; kind: "doc" | "sheet"; hi?: number; z?: number }) {
  return <div style={{ position: "absolute", left: b.x, top: b.y, width: b.w, height: b.h, borderRadius: 12, background: "#1c2440", overflow: "hidden", zIndex: z,
    border: `3px solid ${hi > 0.5 ? C.acc : "#3a4670"}`, boxShadow: "0 16px 40px rgba(0,0,0,.45)" }}>
    <div style={{ height: 40, background: color, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 0 0 16px", fontFamily: fontSans, fontWeight: 700, fontSize: 20, color: "#fff" }}>
      <span style={{ whiteSpace: "nowrap" }}>{title}</span>
      <div style={{ display: "flex" }}>{["–", "▢", "✕"].map((c) => <div key={c} style={{ width: 44, textAlign: "center", fontSize: 20 }}>{c}</div>)}</div>
    </div>
    {kind === "doc" ? Array.from({ length: 9 }, (_, i) => <div key={i} style={{ margin: "14px 18px 0", height: 12, borderRadius: 6, width: `${[88, 76, 92, 60, 84, 70, 90, 66, 50][i]}%`, background: "#3a4566" }} />)
      : <div style={{ margin: 14, display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 6 }}>{Array.from({ length: 28 }, (_, i) => <div key={i} style={{ height: 26, borderRadius: 4, background: i < 4 ? "#2f6b4f" : "#2a3354" }} />)}</div>}
  </div>;
}
function SnapGrid({ x, y, show, pick }: { x: number; y: number; show: number; pick: number }) {
  const lay: [number, number][][] = [[[0, 0.5], [0.5, 0.5]], [[0, 0.66], [0.66, 0.34]], [[0, 0.33], [0.33, 0.34], [0.67, 0.33]], [[0, 0.25], [0.25, 0.5], [0.75, 0.25]]];
  return <div style={{ position: "absolute", left: x, top: y, width: 330, padding: 14, borderRadius: 16, background: "#141c36", border: "2px solid #3a4670", zIndex: 6, opacity: show,
    transform: `scale(${0.85 + 0.15 * show})`, transformOrigin: "80% 0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
    {lay.map((zones, li) => <div key={li} style={{ position: "relative", height: 64, borderRadius: 8, background: "#232c4a" }}>
      {zones.map(([l, w], zi) => <div key={zi} style={{ position: "absolute", top: 5, bottom: 5, left: `calc(${l * 100}% + 4px)`, width: `calc(${w * 100}% - 8px)`, borderRadius: 5,
        background: li === 0 && zi === 0 && pick > 0 ? `rgba(62,224,160,${0.4 + 0.5 * pick})` : "#3a4670" }} />)}
    </div>)}
  </div>;
}
/** action "snap" (Windows 11). mode drag (dragging and resizing by hand, still overlapping) | done (both windows click into halves)
 *  | grid (hover maximize, the layout grid opens) | zone (click the left zone, the window snaps, Snap Assist offers the rest)
 *  | fill (pick the other window for the right half) | keys (Windows + Left arrow snaps it to the left half). */
export function LaptopSnap({ v, dur }: { v: LaptopV; dur: number }) {
  const f = useCurrentFrame();
  const p = (a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: ease });
  const mode = v.mode ?? "grid";
  const A0: Box = { x: 150, y: 50, w: 560, h: 380 }, B0: Box = { x: 300, y: 110, w: 560, h: 380 };
  let A = A0, B = B0, aHi = 0, bHi = 0, grid = 0, pick = 0, assist = 0, bZ = 1, aZ = 2;
  let fx = LW * 0.7, fy = LH * 0.8, press = 0, show = 0; let below: React.ReactNode = null; let note = "";
  const maxBtn = (b: Box) => ({ x: b.x + b.w - 66, y: b.y + 20 });
  if (mode === "drag") {
    const t = f / Math.max(dur, 1);
    const wob = Math.sin(f / 5) * 26;
    A = { x: 120 + t * 90 + wob, y: 60 + Math.cos(f / 6) * 14, w: 560 - t * 140 + Math.sin(f / 7) * 30, h: 380 };
    show = p(0, 6); fx = A.x + 120; fy = A.y + 20; press = 1;
    note = "Still overlapping";
  } else if (mode === "done") {
    const t = p(dur * 0.1, dur * 0.4); A = mix(A0, HALF_L, t); const t2 = p(dur * 0.25, dur * 0.55); B = mix(B0, HALF_R, t2); aHi = t; bHi = t2;
  } else if (mode === "grid") {
    const mb = maxBtn(A0); show = p(0, 6); const mv = p(0, dur * 0.4); fx = interpolate(mv, [0, 1], [LW * 0.4, mb.x]); fy = interpolate(mv, [0, 1], [LH * 0.75, mb.y]);
    grid = p(dur * 0.45, dur * 0.6); pick = p(dur * 0.75, dur * 0.85);
  } else if (mode === "zone") {
    const mb = maxBtn(A0); grid = 1 - p(dur * 0.4, dur * 0.48); show = 1;
    const tz = { x: mb.x - 248 + 14 + 40, y: mb.y + 24 + 14 + 32 };
    const mv = p(0, dur * 0.25); fx = interpolate(mv, [0, 1], [mb.x, tz.x]); fy = interpolate(mv, [0, 1], [mb.y, tz.y]); pick = 1;
    press = interpolate(f, [dur * 0.28, dur * 0.33, dur * 0.4], [0, 1, 0], clamp);
    const snap = p(dur * 0.38, dur * 0.55); A = mix(A0, HALF_L, snap); aHi = snap; B = { ...B0, w: 0, h: 0 }; assist = p(dur * 0.55, dur * 0.7);
    if (snap > 0) { fx = interpolate(snap, [0, 1], [tz.x, LW * 0.3]); fy = interpolate(snap, [0, 1], [tz.y, LH * 0.6]); }
  } else if (mode === "fill") {
    A = HALF_L; aHi = 1; assist = 1 - p(dur * 0.5, dur * 0.58); show = p(0, 6);
    const thumb = { x: HALF_R.x + 40 + 90, y: 150 + 60 };
    const mv = p(0, dur * 0.35); fx = interpolate(mv, [0, 1], [LW * 0.3, thumb.x]); fy = interpolate(mv, [0, 1], [LH * 0.7, thumb.y]);
    press = interpolate(f, [dur * 0.38, dur * 0.44, dur * 0.52], [0, 1, 0], clamp);
    const fill = p(dur * 0.5, dur * 0.68); B = fill > 0 ? mix({ x: thumb.x - 90, y: thumb.y - 60, w: 180, h: 120 }, HALF_R, fill) : { ...B0, w: 0, h: 0 }; bHi = fill; bZ = 3;
    if (fill > 0) { fx = interpolate(fill, [0, 1], [thumb.x, LW * 0.75]); fy = interpolate(fill, [0, 1], [thumb.y, LH * 0.8]); }
  } else { // keys
    const hit = interpolate(f, [dur * 0.3, dur * 0.34, dur * 0.44], [0, 1, 0], clamp); const snap = p(dur * 0.36, dur * 0.52);
    A = mix(A0, HALF_L, snap); aHi = snap; B = { ...B0, w: 0, h: 0 }; assist = p(dur * 0.55, dur * 0.7);
    below = <div style={{ display: "flex", gap: 22, marginTop: 50, alignItems: "center" }}>
      {(v.keys ?? ["⊞ Win", "←"]).map((k, i) => <div key={k} style={{ display: "flex", alignItems: "center", gap: 22 }}>{i > 0 && <span style={{ color: C.mut, fontSize: 60, fontFamily: fontSans }}>+</span>}
        <div style={{ padding: "24px 38px", borderRadius: 22, background: hit > 0.3 ? C.acc : C.key, color: hit > 0.3 ? C.bg : C.fg, fontFamily: fontSans, fontWeight: 700, fontSize: 54, boxShadow: `0 ${hit > 0.3 ? 4 : 10}px 0 #0a0f1e`, transform: `translateY(${hit > 0.3 ? 6 : 0}px)` }}>{k}</div></div>)}
    </div>;
  }
  const mb = maxBtn(A0);
  return <div style={{ width: LW + 80, display: "flex", flexDirection: "column", alignItems: "center", marginTop: 40 }}>
    <div style={{ position: "relative", width: LW, height: LH, borderRadius: 26, border: "12px solid #2c3658", background: "linear-gradient(140deg,#16254a 0%,#0f1730 70%)", overflow: "hidden", boxShadow: "0 40px 100px rgba(0,0,0,.55)" }}>
      {B.w > 0 && <Win b={B} title="Budget.xlsx" color="#21a366" kind="sheet" hi={bHi} z={bZ} />}
      <Win b={A} title="Report.docx" color="#2b6fd6" kind="doc" hi={aHi} z={aZ} />
      {mode === "drag" && <div style={{ position: "absolute", left: A.x + A.w - 10, top: A.y + A.h - 10, width: 24, height: 24, borderRight: `4px solid ${C.warn}`, borderBottom: `4px solid ${C.warn}`, zIndex: 4 }} />}
      {(mode === "grid" || mode === "zone") && grid > 0 && <SnapGrid x={mb.x - 248} y={mb.y + 24} show={grid} pick={pick} />}
      {assist > 0 && <div style={{ position: "absolute", left: HALF_R.x, top: HALF_R.y, width: HALF_R.w, height: HALF_R.h, borderRadius: 12, background: "rgba(20,28,54,.85)", border: "2px dashed #4da3ff", opacity: assist, zIndex: 2 }}>
        <div style={{ margin: "26px 0 0 40px", fontFamily: fontMono, fontSize: 20, color: "#4da3ff" }}>Pick a window</div>
        {[["Budget.xlsx", "#21a366"], ["Photos", "#b05cd6"]].map(([t, c], i) => <div key={t} style={{ position: "absolute", left: 40 + i * 210, top: 90, width: 180, height: 120, borderRadius: 10, background: "#1c2440", border: "2px solid #3a4670", overflow: "hidden" }}>
          <div style={{ height: 26, background: c, fontFamily: fontSans, fontSize: 15, color: "#fff", padding: "3px 10px", fontWeight: 700 }}>{t}</div></div>)}
      </div>}
      {note && <div style={{ position: "absolute", left: 30, right: 30, bottom: 72, padding: "12px 20px", borderRadius: 14, textAlign: "center", zIndex: 5, background: "rgba(255,107,107,.18)", border: `2px solid ${C.warn}`, fontFamily: fontMono, fontSize: 24, color: C.fg }}>{note}</div>}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 56, background: "#141c36", display: "flex", justifyContent: "center", alignItems: "center", gap: 18, zIndex: 5 }}>
        {["#4da3ff", "#2b6fd6", "#21a366", "#b05cd6", "#2f3a5e"].map((c, i) => <div key={i} style={{ width: 32, height: 32, borderRadius: 8, background: c }} />)}
      </div>
      {show > 0 && <div style={{ position: "absolute", left: 0, top: 0, width: LW, height: LH, zIndex: 8 }}><Finger x={fx} y={fy} press={press} show={show} /></div>}
    </div>
    <div style={{ width: LW + 100, height: 26, borderRadius: "0 0 30px 30px", background: "#2c3658" }} />
    {below}
  </div>;
}
