// More v3 mocks: an iPhone battery that drains by lunch and the Battery list that names the app, Android one-handed
// mode pulling the screen into reach, a 2am buzzing phone that goes quiet with a Do Not Disturb schedule, an Android
// app timer that pauses the app, a Windows screen that warms up after dark, the Mac Passwords app showing a saved
// Wi-Fi password, Chrome tabs going to sleep with Memory Saver, and an iPhone hotspot a laptop can finally see.
// The Caret T is always the pointer.
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
    {label && <div style={{ position: "absolute", top: 82, left: 34, fontFamily: fontMono, fontSize: 26, color: C.mut }}>{label}</div>}
    {children}
  </div>;
}
function Note({ text, good, bottom = 60 }: { text: string; good: boolean; bottom?: number }) {
  return <div style={{ position: "absolute", bottom, left: 30, right: 30, padding: "18px 22px", borderRadius: 18, textAlign: "center", zIndex: 6,
    background: good ? "rgba(62,224,160,.18)" : "rgba(255,107,107,.18)", border: `2px solid ${good ? C.acc : C.warn}`, fontFamily: fontMono, fontSize: 28, color: C.fg }}>{text}</div>;
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
function Qr({ size }: { size: number }) {
  const n = 21, c = size / n;
  const on = (x: number, y: number) => { const fin = (a: number, b: number) => x >= a && x < a + 7 && y >= b && y < b + 7 && (x === a || x === a + 6 || y === b || y === b + 6 || (x >= a + 2 && x <= a + 4 && y >= b + 2 && y <= b + 4));
    if (x < 8 && y < 8) return fin(0, 0); if (x > 12 && y < 8) return fin(14, 0); if (x < 8 && y > 12) return fin(0, 14); return ((x * 11 + y * 5 + x * y) % 5) < 2; };
  return <div style={{ position: "relative", width: size, height: size, background: "#fff", borderRadius: 10, padding: 10, boxSizing: "content-box" }}>
    {Array.from({ length: n * n }, (_, i) => { const x = i % n, y = Math.floor(i / n); return on(x, y) ? <div key={i} style={{ position: "absolute", left: 10 + x * c, top: 10 + y * c, width: c, height: c, background: "#0b1020" }} /> : null; })}
  </div>;
}
function Battery({ pct, w = 260 }: { pct: number; w?: number }) {
  const col = pct <= 20 ? C.warn : pct <= 40 ? AMBER : C.acc;
  return <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
    <div style={{ position: "relative", width: w, height: w * 0.48, borderRadius: w * 0.1, border: `${w * 0.03}px solid ${C.fg}`, padding: w * 0.03, boxSizing: "border-box" }}>
      <div style={{ width: `${pct}%`, height: "100%", borderRadius: w * 0.05, background: col }} /></div>
    <div style={{ width: w * 0.05, height: w * 0.18, borderRadius: 4, background: C.fg }} />
  </div>;
}

/** mode "battery" (iPhone). (no reveal) the battery falls from 100% to 19% while the clock only reaches lunch
 *  | "list" Settings > Battery, apps sorted by use, the top one (Scrollr) is flagged as the drain. */
export function PhoneBattery({ v, dur }: { v: PhoneV; dur: number }) {
  const f = useCurrentFrame();
  const p = (a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: ease });
  if (!v.reveal) {
    const t = p(0, dur * 0.7); const pct = Math.round(interpolate(t, [0, 1], [100, 19]));
    const mins = Math.round(interpolate(t, [0, 1], [8 * 60, 12 * 60 + 40])); const clock = `${Math.floor(mins / 60)}:${String(mins % 60).padStart(2, "0")}`;
    return <Frame>
      <div style={{ position: "absolute", top: 150, left: 0, right: 0, textAlign: "center", fontFamily: fontSans, fontWeight: 700, fontSize: 110, color: C.fg }}>{clock}</div>
      <div style={{ position: "absolute", top: 300, left: 0, right: 0, display: "flex", justifyContent: "center" }}><Battery pct={pct} /></div>
      <div style={{ position: "absolute", top: 460, left: 0, right: 0, textAlign: "center", fontFamily: fontMono, fontWeight: 700, fontSize: 90, color: pct <= 20 ? C.warn : C.fg }}>{pct}%</div>
      {pct <= 20 && <div style={{ position: "absolute", top: 600, left: 40, right: 40, padding: "20px 24px", borderRadius: 22, background: "#1c2440ee", fontFamily: fontSans, fontSize: 30, color: C.fg }}>
        <b>Low Battery</b><div style={{ color: C.mut, fontSize: 26, marginTop: 6 }}>20% of battery remaining</div></div>}
      <Note text={v.note ?? "Barely touched it all morning."} good={false} />
    </Frame>;
  }
  const apps: [string, number, string][] = [["Scrollr", 41, "#ff2d55"], ["Maps", 14, "#34c759"], ["Messages", 9, "#30d158"], ["Camera", 6, "#8e8e93"], ["Mail", 4, "#0a84ff"]];
  const flag = p(dur * 0.35, dur * 0.5);
  return <Frame label="Settings › Battery">
    <div style={{ position: "absolute", top: 130, left: 34, fontFamily: fontSans, fontWeight: 700, fontSize: 46, color: C.fg }}>Battery</div>
    <div style={{ position: "absolute", top: 210, left: 34, right: 34, height: 120, display: "flex", alignItems: "flex-end", gap: 8 }}>
      {Array.from({ length: 24 }, (_, i) => <div key={i} style={{ flex: 1, height: `${[30, 25, 20, 18, 60, 80, 90, 85, 95, 70, 40, 20][i % 12]}%`, borderRadius: 4, background: i < 12 ? C.acc : "#2f3a5e", opacity: interpolate(f, [i, i + 6], [0, 1], clamp) }} />)}
    </div>
    <div style={{ position: "absolute", top: 360, left: 34, fontFamily: fontMono, fontSize: 24, color: C.mut }}>BATTERY USAGE BY APP</div>
    {apps.map(([n, pct, col], i) => { const hot = i === 0 && flag > 0.5; const o = interpolate(f, [4 + i * 4, 10 + i * 4], [0, 1], clamp);
      return <div key={n} style={{ position: "absolute", top: 410 + i * 92, left: 24, right: 24, height: 80, borderRadius: 18, padding: "0 22px", display: "flex", alignItems: "center", gap: 20, opacity: o,
        background: hot ? "rgba(255,107,107,.16)" : C.panel, border: `3px solid ${hot ? C.warn : "transparent"}`, fontFamily: fontSans, fontSize: 32, color: C.fg }}>
        <div style={{ width: 50, height: 50, borderRadius: 14, background: col }} /><span style={{ flex: 1 }}>{n}</span>
        <span style={{ fontFamily: fontMono, fontSize: 30, color: hot ? C.warn : C.mut, fontWeight: hot ? 700 : 400 }}>{pct}%</span></div>; })}
    {flag > 0.5 && <div style={{ position: "absolute", top: 382, right: 40, fontFamily: fontMono, fontSize: 24, color: C.warn, opacity: flag }}>↓ mostly background</div>}
    <Finger x={PW - 110} y={410 + 40} press={interpolate(f, [dur * 0.3, dur * 0.36, dur * 0.44], [0, 1, 0], clamp)} show={p(dur * 0.1, dur * 0.2) * (1 - p(dur * 0.6, dur * 0.7))} />
  </Frame>;
}

/** mode "reach" (Android or iPhone). (no reveal) the pointer strains for the top row and falls short, the phone wobbles
 *  | "drop" a swipe at the bottom edge pulls the whole screen down so the top is in reach. */
export function PhoneReach({ v, dur }: { v: PhoneV; dur: number }) {
  const f = useCurrentFrame();
  const p = (a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: ease });
  const drop = v.reveal === "drop" ? p(dur * 0.25, dur * 0.45) : 0;
  const screen = <div style={{ position: "absolute", left: 0, right: 0, top: 70 + drop * 400, height: PH }}>
    <div style={{ margin: "0 24px", padding: "22px 24px", borderRadius: 22, background: C.panel, fontFamily: fontSans, fontSize: 30, color: C.fg, display: "flex", justifyContent: "space-between" }}>
      <span>← Back</span><span style={{ color: BLUE }}>Search</span></div>
    {["New message from Sam", "Delivery arriving today", "Your photos are ready"].map((t, i) => <div key={t} style={{ margin: "18px 24px 0", padding: "24px", borderRadius: 18, background: "#1a2340", fontFamily: fontSans, fontSize: 28, color: C.fg }}>{t}</div>)}
    {[0, 1, 2, 3].map((i) => <div key={i} style={{ margin: "18px 24px 0", height: 70, borderRadius: 14, background: "#151d38" }} />)}
  </div>;
  if (!v.reveal) {
    const cyc = Math.max(12, dur / 2.2); const t = (f % cyc) / cyc; const reach = Math.sin(Math.min(1, t * 1.6) * Math.PI);
    const wob = Math.sin(f / 2.5) * 3 * reach;
    return <div style={{ transform: `rotate(${wob}deg)` }}><Frame>
      {screen}
      <div style={{ position: "absolute", left: 0, right: 0, top: 70, height: 110, border: `4px dashed ${C.warn}`, borderRadius: 24, margin: "0 14px" }} />
      <Finger x={PW * 0.32} y={interpolate(reach, [0, 1], [PH - 140, 360])} press={0} show={p(0, 6)} />
      <Note text={v.note ?? "Thumb: nope. Other hand: busy."} good={false} />
    </Frame></div>;
  }
  const swipe = p(dur * 0.05, dur * 0.25); const tap = interpolate(f, [dur * 0.55, dur * 0.6, dur * 0.68], [0, 1, 0], clamp);
  const fx = PW * 0.5, fy = drop < 0.99 ? interpolate(swipe, [0, 1], [PH - 110, PH - 30]) : interpolate(p(dur * 0.45, dur * 0.55), [0, 1], [PH - 60, 70 + 400 + 50]);
  return <Frame>
    {drop > 0 && <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 70 + 400 * drop, background: "#0a0f1e" }} />}
    {screen}
    <Finger x={fx} y={fy} press={tap} show={p(0, 6)} />
    {drop > 0.9 && <Note text={v.note ?? "Top row, right under your thumb."} good bottom={drop > 0.9 ? 40 : 60} />}
  </Frame>;
}

/** mode "night" (Android). (no reveal) 2:13 am, group-chat notifications stack up and the phone buzzes
 *  | "quiet" a moon, Do Not Disturb until 7:00, the same messages arrive silently, a favourite's call still rings. */
export function PhoneNight({ v, dur }: { v: PhoneV; dur: number }) {
  const f = useCurrentFrame();
  const p = (a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: ease });
  const msgs = ["Group chat: lol 😂", "Group chat: did u see this", "Shop: 40% off ends soon", "Group chat: 😂😂😂", "Game: Your crops are ready"];
  const step = Math.max(6, dur / 6);
  if (!v.reveal) {
    const shown = Math.min(msgs.length, 1 + Math.floor(f / step)); const buzz = f % step < 6 ? Math.sin(f * 3) * 10 : 0;
    return <div style={{ transform: `translateX(${buzz}px)` }}><Frame bg="#070b18">
      <div style={{ position: "absolute", top: 130, left: 0, right: 0, textAlign: "center", fontFamily: fontSans, fontWeight: 700, fontSize: 120, color: C.fg }}>2:13</div>
      {msgs.slice(0, shown).map((m, i) => <div key={m} style={{ position: "absolute", top: 330 + i * 100, left: 30, right: 30, height: 84, borderRadius: 20, padding: "0 24px", display: "flex", alignItems: "center",
        background: "#1c2440ee", fontFamily: fontSans, fontSize: 28, color: C.fg, opacity: interpolate(f, [i * step, i * step + 5], [0, 1], clamp) }}>{m}</div>)}
      <div style={{ position: "absolute", top: 260, right: 40, fontFamily: fontMono, fontSize: 30, color: C.warn }}>bzzz</div>
      <Note text={v.note ?? "You: trying to sleep."} good={false} />
    </Frame></div>;
  }
  const on = p(0, dur * 0.25); const shown = Math.min(msgs.length, Math.floor(p(dur * 0.25, dur * 0.7) * msgs.length));
  return <Frame bg="#070b18">
    <div style={{ position: "absolute", top: 130, left: 0, right: 0, textAlign: "center", fontFamily: fontSans, fontWeight: 700, fontSize: 120, color: C.fg }}>2:13</div>
    <div style={{ position: "absolute", top: 280, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 14, alignItems: "center", opacity: on, fontFamily: fontMono, fontSize: 28, color: C.acc }}>
      <span style={{ fontSize: 40 }}>☾</span>Do Not Disturb until 7:00</div>
    <div style={{ position: "absolute", top: 360, left: 30, right: 30, padding: "18px 24px", borderRadius: 20, background: "#141c36", fontFamily: fontSans, fontSize: 26, color: C.mut, opacity: shown > 0 ? 1 : 0 }}>
      {shown} notifications, silenced</div>
    {f > dur * 0.72 && <div style={{ position: "absolute", top: 470, left: 30, right: 30, padding: "22px 24px", borderRadius: 20, background: "rgba(62,224,160,.16)", border: `2px solid ${C.acc}`, fontFamily: fontSans, fontSize: 30, color: C.fg }}>
      📞 Mum <span style={{ color: C.mut, fontSize: 24 }}>· favourite, still rings</span></div>}
    <Note text={v.note ?? "Alarm still rings at 7."} good />
  </Frame>;
}

/** mode "timer" (Android). (no reveal) one app's usage counter races from 5 minutes to almost 3 hours
 *  | "paused" the app icon grays out with an hourglass: App paused, limit reached. */
export function PhoneTimer({ v, dur }: { v: PhoneV; dur: number }) {
  const f = useCurrentFrame();
  const p = (a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: ease });
  if (!v.reveal) {
    const m = Math.round(interpolate(p(0, dur * 0.75), [0, 1], [5, 167])); const txt = m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m}m`;
    return <Frame>
      <div style={{ position: "absolute", top: 140, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <div style={{ width: 170, height: 170, borderRadius: 44, background: "#ff2d55", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fontSans, fontWeight: 800, fontSize: 80, color: "#fff" }}>∞</div></div>
      <div style={{ position: "absolute", top: 340, left: 0, right: 0, textAlign: "center", fontFamily: fontSans, fontSize: 34, color: C.mut }}>Scrollr · today</div>
      <div style={{ position: "absolute", top: 400, left: 0, right: 0, textAlign: "center", fontFamily: fontMono, fontWeight: 700, fontSize: 110, color: m > 60 ? C.warn : C.fg }}>{txt}</div>
      <div style={{ position: "absolute", top: 560, left: 0, right: 0, textAlign: "center", fontFamily: fontSans, fontSize: 30, color: C.mut }}>"just five minutes"</div>
      <Note text={v.note ?? "Where did the evening go?"} good={false} />
    </Frame>;
  }
  const g = p(dur * 0.2, dur * 0.45);
  return <Frame>
    <div style={{ position: "absolute", top: 140, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
      <div style={{ position: "relative", width: 170, height: 170, borderRadius: 44, background: "#ff2d55", filter: `grayscale(${g})`, opacity: 1 - 0.4 * g, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fontSans, fontWeight: 800, fontSize: 80, color: "#fff" }}>∞</div>
      {g > 0.5 && <div style={{ position: "absolute", top: 120, left: PW / 2 + 40, width: 70, height: 70, borderRadius: 35, background: AMBER, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>⏳</div>}
    </div>
    <div style={{ position: "absolute", top: 360, left: 0, right: 0, textAlign: "center", fontFamily: fontSans, fontWeight: 700, fontSize: 44, color: C.fg, opacity: g }}>App paused</div>
    <div style={{ position: "absolute", top: 430, left: 40, right: 40, textAlign: "center", fontFamily: fontSans, fontSize: 30, color: C.mut, opacity: g }}>Your 30 min Scrollr timer ran out. It'll start again tomorrow.</div>
    <Note text={v.note ?? "30 minutes, then it's done."} good />
  </Frame>;
}

/** action "nightlight" (Windows 11). mode "cold": a glaring blue-white screen at 23:40 | "warm": the same screen eases to amber, schedule shown. */
export function LaptopNightLight({ v, dur }: { v: LaptopV; dur: number }) {
  const f = useCurrentFrame();
  const p = (a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: ease });
  const warm = v.mode === "warm" ? p(dur * 0.15, dur * 0.55) : 0;
  const glare = v.mode === "warm" ? 0 : 0.5 + 0.5 * Math.abs(Math.sin(f / 10));
  return <div style={{ width: LW + 80, display: "flex", flexDirection: "column", alignItems: "center", marginTop: 40 }}>
    <div style={{ position: "relative", width: LW, height: LH, borderRadius: 26, border: "12px solid #2c3658", overflow: "hidden", background: "#e9f1ff",
      boxShadow: `0 0 ${120 * glare + 40}px rgba(170,205,255,${0.35 + 0.35 * glare * (1 - warm)}), 0 40px 100px rgba(0,0,0,.55)` }}>
      <div style={{ height: 44, background: "#d4e2fb", display: "flex", alignItems: "center", padding: "0 20px", fontFamily: fontMono, fontSize: 22, color: "#405070" }}>Document1 · Word</div>
      {[560, 700, 640, 720, 500, 680, 610].map((w, i) => <div key={i} style={{ margin: "26px 60px 0", width: w, height: 20, borderRadius: 6, background: "#b8c8e6" }} />)}
      <div style={{ position: "absolute", inset: 0, background: `rgba(255,150,40,${0.42 * warm})`, mixBlendMode: "multiply" }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 52, background: "#1a2340", display: "flex", justifyContent: "flex-end", alignItems: "center", padding: "0 24px", gap: 22, fontFamily: fontMono, fontSize: 24, color: C.fg }}>
        {warm > 0.5 && <span style={{ color: AMBER }}>☾ Night light on · sunset to sunrise</span>}<span>23:40</span></div>
    </div>
    <div style={{ width: LW + 100, height: 26, borderRadius: "0 0 30px 30px", background: "#2c3658" }} />
    <div style={{ marginTop: 40, padding: "16px 26px", borderRadius: 16, background: warm > 0.5 ? "rgba(62,224,160,.18)" : "rgba(255,107,107,.18)", border: `2px solid ${warm > 0.5 ? C.acc : C.warn}`, fontFamily: fontMono, fontSize: 28, color: C.fg }}>
      {warm > 0.5 ? (v.items?.[1] ?? "Warm after dark, on its own.") : (v.items?.[0] ?? "Midnight. Eyes: wide awake.")}</div>
  </div>;
}

/** action "macwifi" (Mac). mode "ask": a guest's phone asks for the Wi-Fi password, wrong guesses
 *  | "app": the Passwords app, the pointer clicks Wi-Fi in the sidebar | "show": the network's password is revealed with a QR code. */
export function LaptopMacWifi({ v, dur }: { v: LaptopV; dur: number }) {
  const f = useCurrentFrame();
  const p = (a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: ease });
  const mode = v.mode ?? "ask";
  if (mode === "ask") {
    const tries = ["sunflower", "Sunflower42", "password1"]; const step = Math.max(8, dur / 3.2); const t = Math.min(tries.length - 1, Math.floor(f / step));
    const shake = f % Math.floor(step) < 6 ? Math.sin(f * 2) * 8 : 0;
    return <Frame label="Guest's phone">
      <div style={{ position: "absolute", top: 160, left: 34, fontFamily: fontSans, fontWeight: 700, fontSize: 44, color: C.fg }}>Enter password</div>
      <div style={{ position: "absolute", top: 230, left: 34, fontFamily: fontSans, fontSize: 32, color: C.mut }}>for "Home-5G"</div>
      <div style={{ position: "absolute", top: 320, left: 30, right: 30, padding: "24px", borderRadius: 18, background: C.panel, border: `2px solid ${C.warn}`, fontFamily: fontMono, fontSize: 34, color: C.fg, transform: `translateX(${shake}px)` }}>{tries[t]}</div>
      <div style={{ position: "absolute", top: 430, left: 34, fontFamily: fontSans, fontSize: 30, color: C.warn }}>Incorrect password</div>
      <Note text={v.items?.[0] ?? "\"It's on the router… somewhere?\""} good={false} />
    </Frame>;
  }
  const side = ["All", "Passkeys", "Codes", "Wi-Fi", "Security"];
  const nets = ["Home-5G", "Cafe Guest", "Office-WiFi", "Hotel Lobby"];
  const sidebar = (hiWifi: boolean) => <div style={{ position: "absolute", top: 44, left: 0, bottom: 0, width: 250, background: "#141c36", padding: "24px 14px" }}>
    {side.map((s) => <div key={s} style={{ height: 60, marginBottom: 8, borderRadius: 12, padding: "0 18px", display: "flex", alignItems: "center", fontFamily: fontSans, fontSize: 28, color: C.fg,
      background: s === "Wi-Fi" && hiWifi ? BLUE : "transparent" }}>{s === "Wi-Fi" ? "📶 " : ""}{s}</div>)}
  </div>;
  if (mode === "app") {
    const move = p(0, dur * 0.35); const press = interpolate(f, [dur * 0.38, dur * 0.44, dur * 0.52], [0, 1, 0], clamp); const hit = f > dur * 0.44;
    const fx = interpolate(move, [0, 1], [LW * 0.6, 130]), fy = interpolate(move, [0, 1], [LH * 0.7, 44 + 24 + 3 * 68 + 30]);
    return <LaptopShell title="Passwords">
      {sidebar(hit)}
      {hit && nets.map((n, i) => <div key={n} style={{ position: "absolute", top: 80 + i * 88, left: 280, right: 26, height: 74, borderRadius: 14, padding: "0 24px", display: "flex", alignItems: "center",
        background: C.panel, fontFamily: fontSans, fontSize: 30, color: C.fg, opacity: interpolate(f, [dur * 0.45 + i * 3, dur * 0.5 + i * 3], [0, 1], clamp) }}>📶 {n}</div>)}
      {!hit && <div style={{ position: "absolute", top: 260, left: 280, right: 26, textAlign: "center", fontFamily: fontSans, fontSize: 30, color: C.mut }}>macOS Sequoia and later</div>}
      <div style={{ position: "absolute", left: 0, top: 0, width: LW, height: LH, zIndex: 8 }}><Finger x={fx} y={fy} press={press} show={p(0, 6) * (1 - p(dur * 0.75, dur * 0.85))} /></div>
    </LaptopShell>;
  }
  const move = p(0, dur * 0.3); const press = interpolate(f, [dur * 0.33, dur * 0.39, dur * 0.46], [0, 1, 0], clamp); const shown = p(dur * 0.4, dur * 0.5);
  const fx = interpolate(move, [0, 1], [LW * 0.4, 560]), fy = interpolate(move, [0, 1], [LH - 80, 250]);
  return <LaptopShell title="Passwords · Wi-Fi › Home-5G">
    {sidebar(true)}
    <div style={{ position: "absolute", top: 80, left: 290, fontFamily: fontSans, fontWeight: 700, fontSize: 44, color: C.fg }}>📶 Home-5G</div>
    <div style={{ position: "absolute", top: 210, left: 280, width: shown > 0.5 ? 340 : 620, height: 80, borderRadius: 14, padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between",
      background: shown > 0.5 ? "rgba(62,224,160,.16)" : C.panel, border: `3px solid ${shown > 0.5 ? C.acc : "transparent"}`, fontFamily: fontMono, fontSize: 32, color: C.fg }}>
      <span>{shown > 0.5 ? "sunflower42" : "••••••••••"}</span></div>
    <div style={{ position: "absolute", top: 180, left: 290, fontFamily: fontSans, fontSize: 22, color: C.mut }}>Password</div>
    <div style={{ position: "absolute", top: 320, left: 280, padding: "14px 22px", borderRadius: 12, background: "#2f3a5e", fontFamily: fontSans, fontSize: 26, color: C.fg }}>Show Network QR Code</div>
    {shown > 0 && <div style={{ position: "absolute", top: 90, right: 40, display: "flex", flexDirection: "column", alignItems: "center", gap: 12, opacity: shown }}>
      <Qr size={220} /><div style={{ fontFamily: fontMono, fontSize: 22, color: C.acc }}>scan to join</div></div>}
    {shown < 0.5 && <div style={{ position: "absolute", left: 0, top: 0, width: LW, height: LH, zIndex: 8 }}><Finger x={fx} y={fy} press={press} show={p(0, 6)} /></div>}
  </LaptopShell>;
}

/** action "memory" (Chrome). mode "slow": a strip of tabs, the memory meter in the red, a spinning loader
 *  | "saver": the tabs you aren't using fade to sleep and the meter drops. */
export function LaptopMemory({ v, dur }: { v: LaptopV; dur: number }) {
  const f = useCurrentFrame();
  const p = (a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: ease });
  const saver = v.mode === "saver" ? p(dur * 0.15, dur * 0.55) : 0;
  const n = 14; const mem = Math.round(interpolate(saver, [0, 1], [v.mode === "saver" ? 94 : interpolate(p(0, dur * 0.6), [0, 1], [71, 96]), 52]));
  const col = mem > 85 ? C.warn : mem > 65 ? AMBER : C.acc;
  return <LaptopShell title="Chrome">
    <div style={{ position: "absolute", top: 44, left: 0, right: 0, height: 52, background: "#141c36", display: "flex", gap: 4, padding: "8px 10px 0" }}>
      {Array.from({ length: n }, (_, i) => { const asleep = i > 0 && i / n < saver * 1.1;
        return <div key={i} style={{ flex: 1, borderRadius: "10px 10px 0 0", background: i === 0 ? "#2a3354" : "#1d2647", opacity: asleep ? 0.35 : 1, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: C.mut }}>{asleep ? "z" : "●"}</div>; })}
    </div>
    <div style={{ position: "absolute", top: 130, left: 60, fontFamily: fontSans, fontSize: 30, color: C.mut }}>Memory in use</div>
    <div style={{ position: "absolute", top: 180, left: 60, right: 60, height: 70, borderRadius: 16, background: "#1a2340", overflow: "hidden" }}>
      <div style={{ width: `${mem}%`, height: "100%", background: col }} /></div>
    <div style={{ position: "absolute", top: 270, left: 60, fontFamily: fontMono, fontWeight: 700, fontSize: 90, color: col }}>{mem}%</div>
    {v.mode !== "saver" && <div style={{ position: "absolute", top: 290, right: 90, width: 80, height: 80, borderRadius: 40, border: "10px solid #2f3a5e", borderTopColor: C.warn, transform: `rotate(${f * 14}deg)` }} />}
    <div style={{ position: "absolute", bottom: 40, left: 40, right: 40, padding: "16px 22px", borderRadius: 14, textAlign: "center", fontFamily: fontMono, fontSize: 28, color: C.fg,
      background: saver > 0.5 ? "rgba(62,224,160,.18)" : "rgba(255,107,107,.18)", border: `2px solid ${saver > 0.5 ? C.acc : C.warn}` }}>
      {saver > 0.5 ? (v.items?.[1] ?? "13 tabs asleep. Click one, it wakes up.") : (v.items?.[0] ?? "Fan: full blast. Typing: lagging.")}</div>
  </LaptopShell>;
}

/** action "hotspot" (laptop Wi-Fi list). mode "missing": the list refreshes and the iPhone hotspot never shows
 *  | "found": after Maximize Compatibility, "Sam's iPhone" pops into the list and the pointer joins it. */
export function LaptopHotspot({ v, dur }: { v: LaptopV; dur: number }) {
  const f = useCurrentFrame();
  const p = (a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: ease });
  const others = ["Neighbour-5G", "FRITZ!Box 7530", "Cafe Guest"];
  const found = v.mode === "found" ? p(dur * 0.2, dur * 0.35) : 0;
  const spin = v.mode !== "found" || found < 0.5;
  const list = found > 0.5 ? ["📱 Sam's iPhone", ...others] : others;
  const press = v.mode === "found" ? interpolate(f, [dur * 0.55, dur * 0.6, dur * 0.68], [0, 1, 0], clamp) : 0;
  const joined = v.mode === "found" && f > dur * 0.6;
  const move = p(dur * 0.35, dur * 0.55);
  return <LaptopShell title="Wi-Fi networks">
    <div style={{ position: "absolute", top: 66, left: 34, fontFamily: fontSans, fontWeight: 700, fontSize: 42, color: C.fg }}>Available networks</div>
    {spin && <div style={{ position: "absolute", top: 70, right: 50, width: 48, height: 48, borderRadius: 24, border: "7px solid #2f3a5e", borderTopColor: BLUE, transform: `rotate(${f * 14}deg)` }} />}
    {list.map((n, i) => { const hot = found > 0.5 && i === 0;
      return <div key={n} style={{ position: "absolute", top: 140 + i * 86, left: 26, right: 26, height: 74, borderRadius: 16, padding: "0 26px", display: "flex", alignItems: "center", justifyContent: "space-between",
        background: hot ? "rgba(62,224,160,.16)" : C.panel, border: `3px solid ${hot ? C.acc : "transparent"}`, fontFamily: fontSans, fontSize: 30, color: C.fg }}>
        <span>{n.startsWith("📱") ? n : `📶 ${n}`}</span>{hot && <span style={{ fontFamily: fontMono, fontSize: 24, color: C.acc }}>{joined ? "connected" : "2.4 GHz"}</span>}</div>; })}
    {v.mode !== "found" && <div style={{ position: "absolute", bottom: 36, left: 30, right: 30, padding: "16px 22px", borderRadius: 14, textAlign: "center", fontFamily: fontMono, fontSize: 28, color: C.fg, background: "rgba(255,107,107,.18)", border: `2px solid ${C.warn}` }}>
      {v.items?.[0] ?? `Refresh #${1 + Math.floor(f / 20)}. Still no iPhone.`}</div>}
    {v.mode === "found" && <div style={{ position: "absolute", left: 0, top: 0, width: LW, height: LH, zIndex: 8 }}><Finger x={interpolate(move, [0, 1], [LW * 0.6, LW - 200])} y={interpolate(move, [0, 1], [LH - 60, 177])} press={press} show={p(dur * 0.3, dur * 0.38) * (1 - p(dur * 0.8, dur * 0.9))} /></div>}
  </LaptopShell>;
}
