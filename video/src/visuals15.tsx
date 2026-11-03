// More v3 mocks: an iPhone screen that stays blue-white at midnight, then Night Shift warming it on a schedule
// (and the colour temperature slider), and Chrome turning the page you're on into a QR code instead of reading
// a long link out loud. The Caret T is always the pointer.
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

function Frame({ children, label, bg = "#0e1428" }: { children: React.ReactNode; label?: string; bg?: string }) {
  return <div style={{ position: "relative", width: PW, height: PH, borderRadius: 72, background: bg, border: "10px solid #2c3658", boxShadow: "0 40px 100px rgba(0,0,0,.55)", overflow: "hidden" }}>
    <div style={{ position: "absolute", top: 18, left: PW / 2 - 70, width: 140, height: 34, borderRadius: 20, background: "#000", zIndex: 5 }} />
    {label && <div style={{ position: "absolute", top: 82, left: 34, fontFamily: fontMono, fontSize: 26, color: C.mut, zIndex: 4 }}>{label}</div>}
    {children}
  </div>;
}
function Note({ text, good, bottom = 60 }: { text: string; good: boolean; bottom?: number }) {
  return <div style={{ position: "absolute", bottom, left: 30, right: 30, padding: "18px 22px", borderRadius: 18, textAlign: "center", zIndex: 6,
    background: good ? "#123a33f2" : "#3a1a26f2", border: `2px solid ${good ? C.acc : C.warn}`, fontFamily: fontMono, fontSize: 28, color: C.fg }}>{text}</div>;
}
function LaptopShell({ children, title, bg = "#0f1730" }: { children: React.ReactNode; title: string; bg?: string }) {
  return <div style={{ width: LW + 80, display: "flex", flexDirection: "column", alignItems: "center", marginTop: 40 }}>
    <div style={{ position: "relative", width: LW, height: LH, borderRadius: 26, border: "12px solid #2c3658", background: bg, overflow: "hidden", boxShadow: "0 40px 100px rgba(0,0,0,.55)" }}>
      <div style={{ height: 44, background: "#1a2340", display: "flex", alignItems: "center", padding: "0 20px", fontFamily: fontMono, fontSize: 22, color: C.mut }}>{title}</div>
      {children}
    </div>
    <div style={{ width: LW + 100, height: 26, borderRadius: "0 0 30px 30px", background: "#2c3658" }} />
  </div>;
}
function Pointer({ x, y, press, show = 1 }: { x: number; y: number; press: number; show?: number }) {
  return <div style={{ position: "absolute", left: 0, top: 0, width: LW, height: LH, zIndex: 8 }}><Finger x={x} y={y} press={press} show={show} /></div>;
}

/** mode "warm" (iPhone). (no reveal) a bright blue-white page glowing at 23:40 in a dark room
 *  | "warm" the screen eases to amber with a Night Shift · Sunset to Sunrise banner
 *  | "slider" the Color Temperature slider is dragged from Less Warm to More Warm, the page warms with it. */
export function PhoneWarm({ v, dur }: { v: PhoneV; dur: number }) {
  const f = useCurrentFrame();
  const p = (a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: ease });
  const page = (warm: number) => {
    const bg = `rgb(${Math.round(interpolate(warm, [0, 1], [236, 255]))},${Math.round(interpolate(warm, [0, 1], [242, 214]))},${Math.round(interpolate(warm, [0, 1], [255, 160]))})`;
    return <>
      <div style={{ position: "absolute", inset: 0, background: bg }} />
      <div style={{ position: "absolute", top: 140, left: 40, right: 40, fontFamily: fontSans, fontWeight: 700, fontSize: 44, color: "#1a1f33" }}>Messages</div>
      {Array.from({ length: 9 }, (_, i) => <div key={i} style={{ position: "absolute", top: 230 + i * 62, left: i % 2 ? 160 : 40, width: [360, 300, 380, 260, 340, 280, 390, 240, 320][i], height: 44, borderRadius: 22,
        background: i % 2 ? (warm > 0.5 ? "#d9a35a" : BLUE) : (warm > 0.5 ? "#e8c89a" : "#d6dcea") }} />)}
    </>;
  };
  if (!v.reveal) {
    const glow = 0.5 + 0.5 * Math.abs(Math.sin(f / 9));
    return <Frame label={v.path[0] ?? "23:40 · lights off"}>
      {page(0)}
      <div style={{ position: "absolute", inset: 0, boxShadow: `inset 0 0 ${70 + 70 * glow}px rgba(160,200,255,${0.55 * glow})`, zIndex: 3 }} />
      <Note text={v.note ?? "Midnight. Blue-white glare."} good={false} />
    </Frame>;
  }
  if (v.reveal === "slider") {
    const drag = p(dur * 0.15, dur * 0.6); const warm = interpolate(drag, [0, 1], [0.35, 1]);
    const sx0 = 70, sx1 = PW - 70, kx = interpolate(drag, [0, 1], [sx0 + (sx1 - sx0) * 0.3, sx1 - 10]), sy = 720;
    return <Frame label="Night Shift">
      {page(warm)}
      <div style={{ position: "absolute", left: 24, right: 24, top: 640, height: 200, borderRadius: 26, background: "#141c36f2", zIndex: 4 }}>
        <div style={{ position: "absolute", top: 18, left: 30, fontFamily: fontMono, fontSize: 24, color: C.mut }}>COLOR TEMPERATURE</div>
        <div style={{ position: "absolute", top: 70, left: 46, right: 46, height: 12, borderRadius: 6, background: `linear-gradient(90deg, #9fc2ff, ${AMBER})` }} />
        <div style={{ position: "absolute", top: 120, left: 30, fontFamily: fontSans, fontSize: 26, color: C.fg }}>Less Warm</div>
        <div style={{ position: "absolute", top: 120, right: 30, fontFamily: fontSans, fontSize: 26, color: AMBER }}>More Warm</div>
      </div>
      <div style={{ position: "absolute", left: kx - 22, top: sy - 22 - 4, width: 44, height: 44, borderRadius: 22, background: "#fff", boxShadow: "0 4px 12px rgba(0,0,0,.4)", zIndex: 5 }} />
      <div style={{ position: "absolute", inset: 0, zIndex: 7 }}><Finger x={kx} y={sy - 4} press={drag > 0 && drag < 1 ? 1 : 0} show={1 - p(dur * 0.7, dur * 0.8)} /></div>
    </Frame>;
  }
  const warm = p(dur * 0.15, dur * 0.55);
  return <Frame label={v.path[0] ?? "20:14 · sunset"}>
    {page(warm)}
    <div style={{ position: "absolute", top: 86, right: 30, padding: "10px 18px", borderRadius: 16, background: "#141c36f2", fontFamily: fontMono, fontSize: 22, color: AMBER, opacity: p(0, dur * 0.15), zIndex: 4 }}>☾ Night Shift</div>
    {warm > 0.6 && <Note text={v.note ?? "Sunset to Sunrise · on by itself"} good />}
  </Frame>;
}

/* A fake but QR-looking grid, deterministic. */
function QR({ size }: { size: number }) {
  const n = 25, cell = size / n;
  const on = (x: number, y: number) => {
    const finder = (cx: number, cy: number) => x >= cx && x < cx + 7 && y >= cy && y < cy + 7 && (x === cx || x === cx + 6 || y === cy || y === cy + 6 || (x >= cx + 2 && x <= cx + 4 && y >= cy + 2 && y <= cy + 4));
    if (x < 8 && y < 8) return finder(0, 0); if (x >= n - 8 && y < 8) return finder(n - 7, 0); if (x < 8 && y >= n - 8) return finder(0, n - 7);
    return ((x * 7 + y * 13 + x * y * 3) % 5) < 2;
  };
  const cells = [];
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (on(x, y)) cells.push(<div key={`${x}-${y}`} style={{ position: "absolute", left: x * cell, top: y * cell, width: cell + 0.5, height: cell + 0.5, background: "#0b1020" }} />);
  return <div style={{ position: "relative", width: size, height: size, background: "#fff", outline: "14px solid #fff" }}>{cells}</div>;
}

/** action "qr" (Chrome on a computer). mode "spell": a long URL read out letter by letter, the friend's phone still typing it
 *  | "menu": the three-dot menu opens and Cast, save, and share is clicked | "create": its submenu, Create QR code clicked
 *  | "scan": the QR code panel next to a phone that scans it and opens the page. */
export function LaptopQR({ v, dur }: { v: LaptopV; dur: number }) {
  const f = useCurrentFrame();
  const p = (a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: ease });
  const url = "recipes.example.com/lasagne?id=48213&ref=share";
  const page = <>
    <div style={{ position: "absolute", top: 44, left: 0, right: 0, height: 48, background: "#141c36", display: "flex", alignItems: "center", padding: "0 18px", gap: 14, fontFamily: fontMono, fontSize: 20, color: C.fg }}>
      <div style={{ flex: 1, height: 32, borderRadius: 16, background: "#0b1020", display: "flex", alignItems: "center", padding: "0 16px", color: C.mut }}>{url}</div>
      <div style={{ width: 36, textAlign: "center", fontSize: 30, color: C.fg }}>⋮</div>
    </div>
    <div style={{ position: "absolute", top: 120, left: 50, fontFamily: fontSans, fontWeight: 700, fontSize: 46, color: C.fg }}>Grandma's lasagne</div>
    {[520, 460, 500, 380].map((w, i) => <div key={i} style={{ position: "absolute", top: 210 + i * 52, left: 50, width: w, height: 22, borderRadius: 8, background: "#2f3a5e" }} />)}
  </>;
  if (v.mode === "spell") {
    const typed = Math.floor(interpolate(f, [0, dur * 0.9], [0, 22], clamp));
    return <LaptopShell title="Chrome">
      {page}
      <div style={{ position: "absolute", right: 40, top: 150, width: 260, height: 380, borderRadius: 34, background: "#0e1428", border: "6px solid #2c3658", padding: 18 }}>
        <div style={{ fontFamily: fontMono, fontSize: 18, color: C.mut, marginTop: 20 }}>friend's phone</div>
        <div style={{ marginTop: 16, padding: "10px 12px", borderRadius: 12, background: "#1c2440", fontFamily: fontMono, fontSize: 18, color: C.fg, wordBreak: "break-all" }}>{url.slice(0, typed)}<span style={{ color: C.acc }}>|</span></div>
        <div style={{ marginTop: 14, fontFamily: fontMono, fontSize: 18, color: C.warn }}>{typed > 14 ? "\"was that a dash?\"" : "\"r… e… c…\""}</div>
      </div>
      <div style={{ position: "absolute", bottom: 30, left: 30, right: 330, padding: "14px", borderRadius: 14, textAlign: "center", background: "rgba(255,107,107,.18)", border: `2px solid ${C.warn}`, fontFamily: fontMono, fontSize: 24, color: C.fg }}>{v.items?.[0] ?? "Ampersand. No, the and sign."}</div>
    </LaptopShell>;
  }
  if (v.mode === "menu" || v.mode === "create") {
    const sub = v.mode === "create";
    const open = sub ? 1 : p(dur * 0.2, dur * 0.3);
    const rows = ["New tab", "History", "Downloads", "Passwords and autofill", "Print…", "Cast, save, and share", "Settings"];
    const subRows = ["Cast…", "Save page as…", "Create shortcut…", "Copy link", "Create QR code"];
    const mx = LW - 330, my = 92, rh = 50;
    const tgtX = sub ? mx - 300 + 150 : mx + 150, tgtY = sub ? my + 5 * rh + 4 * rh + 25 : my + 5 * rh + 25;
    const dots = { x: LW - 38, y: 68 }, row5 = { x: mx + 150, y: my + 5 * rh + 25 }, qrRow = { x: mx - 300 + 140, y: my + 5 * rh + 4 * rh + 25 };
    const m1 = p(0, dur * 0.18), m2 = p(dur * 0.3, dur * 0.5);
    const from = sub ? row5 : { x: LW * 0.4, y: LH * 0.6 };
    const mid = sub ? row5 : dots, to = sub ? qrRow : row5;
    const x = sub ? interpolate(m2, [0, 1], [from.x, to.x]) : m2 > 0 ? interpolate(m2, [0, 1], [mid.x, to.x]) : interpolate(m1, [0, 1], [from.x, mid.x]);
    const y = sub ? interpolate(m2, [0, 1], [from.y, to.y]) : m2 > 0 ? interpolate(m2, [0, 1], [mid.y, to.y]) : interpolate(m1, [0, 1], [from.y, mid.y]);
    const press = interpolate(f, [dur * 0.55, dur * 0.6, dur * 0.68], [0, 1, 0], clamp) + (sub ? 0 : interpolate(f, [dur * 0.18, dur * 0.22, dur * 0.28], [0, 1, 0], clamp));
    const hit = f > dur * 0.58;
    return <LaptopShell title="Chrome">
      {page}
      <div style={{ position: "absolute", left: mx, top: my, width: 320, borderRadius: 12, background: "#1c2440", border: "2px solid #3a4670", opacity: open, zIndex: 4 }}>
        {rows.map((r, i) => <div key={r} style={{ height: rh, display: "flex", alignItems: "center", padding: "0 18px", fontFamily: fontSans, fontSize: 22, color: C.fg,
          background: i === 5 && (sub || hit) ? "rgba(77,163,255,.25)" : "transparent" }}>{r}{i === 5 && <span style={{ marginLeft: "auto", color: C.mut }}>›</span>}</div>)}
      </div>
      {(sub || hit) && <div style={{ position: "absolute", left: mx - 300, top: my + 5 * rh, width: 290, borderRadius: 12, background: "#1c2440", border: "2px solid #3a4670", zIndex: 5 }}>
        {subRows.map((r, i) => <div key={r} style={{ height: rh, display: "flex", alignItems: "center", padding: "0 18px", fontFamily: fontSans, fontSize: 22, color: C.fg,
          background: sub && i === 4 && hit ? "rgba(62,224,160,.25)" : "transparent", border: sub && i === 4 ? `2px solid ${hit ? C.acc : "transparent"}` : "none", borderRadius: 8 }}>{r}</div>)}
      </div>}
      <Pointer x={x} y={y} press={Math.min(1, press)} />
    </LaptopShell>;
  }
  // scan
  const show = p(0, dur * 0.15), phone = p(dur * 0.25, dur * 0.45), opened = p(dur * 0.6, dur * 0.72);
  return <LaptopShell title="Chrome">
    {page}
    <div style={{ position: "absolute", left: 60, top: 110, width: 380, height: 450, borderRadius: 16, background: "#1c2440", border: "2px solid #3a4670", opacity: show, zIndex: 4, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ alignSelf: "flex-start", margin: "16px 20px", fontFamily: fontSans, fontWeight: 700, fontSize: 24, color: C.fg }}>Scan QR code</div>
      <QR size={250} />
      <div style={{ marginTop: 30, padding: "8px 26px", borderRadius: 18, background: BLUE, fontFamily: fontSans, fontSize: 20, color: "#fff" }}>Download</div>
    </div>
    <div style={{ position: "absolute", right: 70, top: interpolate(phone, [0, 1], [LH, 120]), width: 250, height: 420, borderRadius: 34, background: "#0e1428", border: "6px solid #2c3658", overflow: "hidden", zIndex: 5 }}>
      {opened < 0.5 ? <>
        <div style={{ position: "absolute", inset: 40, border: `4px solid ${C.acc}`, borderRadius: 18 }} />
        <div style={{ position: "absolute", left: 40, right: 40, top: interpolate(f % 30, [0, 30], [50, 330]), height: 4, background: C.acc }} />
        <div style={{ position: "absolute", bottom: 14, left: 0, right: 0, textAlign: "center", fontFamily: fontMono, fontSize: 18, color: C.mut }}>Camera</div>
      </> : <div style={{ padding: 18, opacity: opened }}>
        <div style={{ marginTop: 26, fontFamily: fontSans, fontWeight: 700, fontSize: 24, color: C.fg }}>Grandma's lasagne</div>
        {[180, 150, 190, 120].map((w, i) => <div key={i} style={{ marginTop: 16, width: w, height: 14, borderRadius: 6, background: "#2f3a5e" }} />)}
      </div>}
    </div>
    {opened > 0.5 && <div style={{ position: "absolute", bottom: 26, right: 60, padding: "12px 18px", borderRadius: 14, background: "rgba(62,224,160,.18)", border: `2px solid ${C.acc}`, fontFamily: fontMono, fontSize: 22, color: C.fg, zIndex: 6 }}>{v.items?.[1] ?? "Opened. Nobody typed a thing."}</div>}
  </LaptopShell>;
}
