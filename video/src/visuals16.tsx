// More v3 mocks: iPhone text that is too small in one app and the Control Center Text Size control set to "this app only";
// an Android app full of ad banners that go away with Private DNS; an iPhone that sees the Wi-Fi but won't join until it
// forgets the network; and Spotlight on a Mac opening an app (and doing a sum) from the keyboard. The Caret T is always the pointer.
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
function Switch({ on }: { on: number }) {
  return <div style={{ width: 96, height: 56, borderRadius: 28, background: on > 0.5 ? C.acc : "#3a4566", position: "relative" }}>
    <div style={{ position: "absolute", top: 5, left: 5 + on * 40, width: 46, height: 46, borderRadius: 23, background: "#fff" }} /></div>;
}
function Tap({ x, y, at, dur, from }: { x: number; y: number; at: number; dur: number; from?: [number, number] }) {
  const f = useCurrentFrame();
  const m = interpolate(f, [0, dur * at], [0, 1], { ...clamp, easing: ease });
  const press = interpolate(f, [dur * at, dur * (at + 0.05), dur * (at + 0.12)], [0, 1, 0], clamp);
  const [x0, y0] = from ?? [PW * 0.7, PH - 140];
  return <div style={{ position: "absolute", inset: 0, zIndex: 8 }}><Finger x={interpolate(m, [0, 1], [x0, x])} y={interpolate(m, [0, 1], [y0, y])} press={press} show={interpolate(f, [0, 6], [0, 1], clamp)} /></div>;
}

/* ---------- iPhone text size, per app ---------- */
const MAIL = ["Hi! Quick one about Saturday.", "Can you bring the folding chairs?", "Dinner is at 7, parking is round", "the back by the bins. See you!"];
function MailPage({ size }: { size: number }) {
  return <div style={{ position: "absolute", top: 130, left: 0, right: 0, bottom: 0, background: "#f4f6fb" }}>
    <div style={{ padding: "26px 34px 10px", fontFamily: fontSans, fontWeight: 700, fontSize: 24 + size * 0.6, color: "#1a1f33" }}>Re: Saturday</div>
    <div style={{ padding: "0 34px", fontFamily: fontSans, fontSize: 18 + size * 0.5, color: "#5a6380" }}>From: Aunt Rosa</div>
    <div style={{ padding: "18px 34px", fontFamily: fontSans, fontSize: size, lineHeight: 1.35, color: "#1a1f33" }}>{MAIL.join(" ")}</div>
  </div>;
}
/** mode "textsize" (iPhone). (no reveal) a mail in tiny text, squint note | "cc" Control Center grid, the aA Text Size tile tapped
 *  | "control" the Text Size slider with the "Mail Only" switch, dragged up | "big" the same mail in big text, other apps untouched. */
export function PhoneTextSize({ v, dur }: { v: PhoneV; dur: number }) {
  const f = useCurrentFrame();
  const p = (a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: ease });
  if (!v.reveal) {
    const squint = 1 + 0.02 * Math.sin(f / 6);
    return <Frame label={v.path[0] ?? "Mail"}>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${squint})` }}><MailPage size={17} /></div>
      <Note text={v.note ?? "Glasses on. Still squinting."} good={false} />
    </Frame>;
  }
  if (v.reveal === "cc") {
    const tiles = ["✈", "📶", "ᛒ", "🔦", "⏱", "aA", "🌙", "📷"];
    const ti = 5, cols = 4, tx = (i: number) => 50 + (i % cols) * 135, ty = (i: number) => 300 + Math.floor(i / cols) * 150;
    const hit = f > dur * 0.5;
    return <Frame label="Control Center" bg="#141c36">
      {tiles.map((t, i) => <div key={i} style={{ position: "absolute", left: tx(i), top: ty(i), width: 115, height: 115, borderRadius: 30, display: "flex", alignItems: "center", justifyContent: "center",
        background: i === ti && hit ? C.acc : "#2a3354", color: i === ti && hit ? C.bg : C.fg, fontFamily: fontSans, fontWeight: 700, fontSize: i === ti ? 46 : 44,
        border: i === ti ? `3px solid ${C.acc}` : "3px solid transparent" }}>{t}</div>)}
      <div style={{ position: "absolute", left: 50, top: 640, fontFamily: fontMono, fontSize: 26, color: hit ? C.acc : C.mut }}>{hit ? "Text Size" : "swipe down from the top right"}</div>
      <Tap x={tx(ti) + 58} y={ty(ti) + 58} at={0.42} dur={dur} />
    </Frame>;
  }
  if (v.reveal === "control") {
    const only = p(dur * 0.12, dur * 0.22); const drag = p(dur * 0.35, dur * 0.75);
    const trackTop = 200, trackH = 520, lvl = interpolate(drag, [0, 1], [0.3, 0.85]);
    const knobY = trackTop + trackH * (1 - lvl);
    const fingerX = interpolate(f, [0, dur * 0.12, dur * 0.3], [PW * 0.7, PW / 2 - 60, PW / 2], clamp);
    const fingerY = f < dur * 0.3 ? interpolate(f, [0, dur * 0.12], [PH - 140, 860], clamp) : knobY + 10;
    const press = f < dur * 0.3 ? interpolate(f, [dur * 0.12, dur * 0.16, dur * 0.22], [0, 1, 0], clamp) : (drag > 0 && drag < 1 ? 1 : 0);
    return <Frame label="Text Size" bg="#141c36">
      <div style={{ position: "absolute", left: PW / 2 - 90, top: trackTop, width: 180, height: trackH, borderRadius: 50, background: "#2a3354", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: trackH * lvl, background: "#eef1f8" }} />
        {[0, 1, 2, 3, 4, 5].map((i) => <div key={i} style={{ position: "absolute", left: 80, top: 40 + i * 85, width: 20, height: 4, background: "#8a93ad" }} />)}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: trackTop - 70, textAlign: "center", fontFamily: fontSans, fontWeight: 700, fontSize: 30 + 30 * lvl, color: C.fg }}>aA</div>
      <div style={{ position: "absolute", left: 60, right: 60, top: 800, height: 110, borderRadius: 55, background: "#2a3354", display: "flex", alignItems: "center", padding: 8 }}>
        <div style={{ position: "absolute", top: 8, bottom: 8, left: 8 + only * ((PW - 120) / 2 - 8), width: (PW - 120) / 2 - 8, borderRadius: 48, background: only > 0.5 ? C.acc : "#3a4670" }} />
        <div style={{ flex: 1, textAlign: "center", zIndex: 2, fontFamily: fontSans, fontSize: 30, fontWeight: 700, color: only > 0.5 ? C.mut : C.fg }}>All Apps</div>
        <div style={{ flex: 1, textAlign: "center", zIndex: 2, fontFamily: fontSans, fontSize: 30, fontWeight: 700, color: only > 0.5 ? C.bg : C.mut }}>Mail Only</div>
      </div>
      <div style={{ position: "absolute", inset: 0, zIndex: 8 }}><Finger x={fingerX + (f < dur * 0.3 ? 80 : 0)} y={fingerY} press={press} show={p(0, 6) * (1 - p(dur * 0.85, dur * 0.95))} /></div>
    </Frame>;
  }
  // big
  const grow = p(0, dur * 0.35);
  return <Frame label="Mail">
    <MailPage size={interpolate(grow, [0, 1], [17, 34])} />
    {grow > 0.9 && <Note text={v.note ?? "Mail: big. Everything else: as it was."} good />}
  </Frame>;
}

/* ---------- Android Private DNS ---------- */
function AppPage({ ads }: { ads: number }) {
  const f = useCurrentFrame();
  const ad = (top: number, txt: string, i: number) => <div key={i} style={{ position: "absolute", top, left: 26, right: 26, height: 120, borderRadius: 16, opacity: ads, transform: `scale(${0.9 + 0.1 * ads})`,
    background: i % 2 ? "#ffb84d" : "#ff6b9a", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 22px", fontFamily: fontSans, fontWeight: 800, fontSize: 32, color: "#1a1f33", zIndex: 3 }}>
    <span>{txt}</span><span style={{ fontFamily: fontMono, fontSize: 20, padding: "4px 10px", borderRadius: 8, background: "#0002" }}>Ad ✕</span></div>;
  return <div style={{ position: "absolute", top: 130, left: 0, right: 0, bottom: 0, background: "#f4f6fb" }}>
    <div style={{ padding: "24px 34px", fontFamily: fontSans, fontWeight: 700, fontSize: 40, color: "#1a1f33" }}>Weather · Berlin</div>
    <div style={{ position: "absolute", top: 110, left: 34, fontFamily: fontSans, fontWeight: 800, fontSize: 120, color: "#1a1f33" }}>9°</div>
    {[0, 1, 2, 3, 4].map((i) => <div key={i} style={{ position: "absolute", top: 300 + i * 90, left: 34, width: [480, 400, 450, 360, 420][i], height: 30, borderRadius: 10, background: "#d6dcea" }} />)}
    {ad(260 + Math.sin(f / 5) * 3, "WIN A FREE PHONE!!", 0)}
    {ad(560, "Hot singles in your area", 1)}
    {ads > 0 && <div style={{ position: "absolute", left: 60, right: 60, top: 360, height: 220, borderRadius: 20, background: "#1a1f33", opacity: ads, zIndex: 4, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 }}>
      <div style={{ fontFamily: fontSans, fontWeight: 800, fontSize: 34, color: "#fff" }}>Play now! 🎮</div>
      <div style={{ fontFamily: fontMono, fontSize: 22, color: "#9aa3ba" }}>{`skip in ${Math.max(1, 5 - Math.floor(f / 20))}`}</div></div>}
  </div>;
}
/** mode "dns" (Android). (no reveal) a weather app buried in banners and a pop-up | "clean" the banners fade out, note
 *  | "host" the Private DNS dialog: provider hostname picked, dns.adguard-dns.com typed, Save tapped. */
export function PhoneDns({ v, dur }: { v: PhoneV; dur: number }) {
  const f = useCurrentFrame();
  const p = (a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: ease });
  if (!v.reveal) return <Frame label={v.path[0] ?? "Weather"}><AppPage ads={1} /><Note text={v.note ?? "I just wanted the weather."} good={false} /></Frame>;
  if (v.reveal === "clean") {
    const gone = p(dur * 0.15, dur * 0.45);
    return <Frame label="Weather"><AppPage ads={1 - gone} />{gone > 0.9 && <Note text={v.note ?? "Same app. Most ads gone."} good />}</Frame>;
  }
  const host = "dns.adguard-dns.com"; const typed = Math.floor(interpolate(f, [dur * 0.2, dur * 0.65], [0, host.length], clamp));
  const saved = f > dur * 0.78;
  const opts = ["Off", "Automatic", "Private DNS provider hostname"];
  return <Frame label="Network & internet › Private DNS">
    <div style={{ position: "absolute", left: 30, right: 30, top: 200, borderRadius: 28, background: C.panel, padding: "30px 30px 26px" }}>
      <div style={{ fontFamily: fontSans, fontWeight: 700, fontSize: 40, color: C.fg, marginBottom: 20 }}>Private DNS</div>
      {opts.map((o, i) => <div key={o} style={{ display: "flex", alignItems: "center", gap: 20, height: 74, fontFamily: fontSans, fontSize: 30, color: C.fg }}>
        <div style={{ width: 34, height: 34, borderRadius: 17, border: `4px solid ${i === 2 ? C.acc : "#5a6488"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {i === 2 && <div style={{ width: 16, height: 16, borderRadius: 8, background: C.acc }} />}</div><span>{o}</span></div>)}
      <div style={{ marginTop: 14, padding: "18px 20px", borderRadius: 14, background: "#0f1730", border: `3px solid ${C.acc}`, fontFamily: fontMono, fontSize: 30, color: C.fg }}>
        {host.slice(0, typed)}<span style={{ color: C.acc, opacity: f % 20 < 12 ? 1 : 0 }}>|</span></div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 40, marginTop: 26, fontFamily: fontSans, fontWeight: 700, fontSize: 30 }}>
        <span style={{ color: C.mut }}>Cancel</span><span style={{ color: saved ? C.bg : C.acc, background: saved ? C.acc : "transparent", padding: "6px 20px", borderRadius: 12 }}>Save</span></div>
    </div>
    <Tap x={PW - 110} y={200 + 30 + 60 + 3 * 74 + 14 + 76 + 26 + 40} at={0.72} dur={dur} />
    {saved && <Note text="Private DNS: dns.adguard-dns.com" good />}
  </Frame>;
}

/* ---------- iPhone Wi-Fi that won't join ---------- */
const NETS = ["Home-5G", "Vodafone-2.4", "FRITZ!Box 7590", "DIRECT-Printer"];
function WifiList({ joining, tapInfo, connected, dur }: { joining?: boolean; tapInfo?: boolean; connected?: boolean; dur: number }) {
  const f = useCurrentFrame();
  return <>
    <div style={{ position: "absolute", top: 140, left: 34, fontFamily: fontSans, fontWeight: 700, fontSize: 52, color: C.fg }}>Wi-Fi</div>
    {NETS.map((n, i) => <div key={n} style={{ position: "absolute", top: 240 + i * 104, left: 26, right: 26, height: 92, borderRadius: 22, padding: "0 28px", display: "flex", alignItems: "center", justifyContent: "space-between",
      background: i === 0 && connected ? "rgba(62,224,160,.16)" : C.panel, border: i === 0 && (connected || tapInfo) ? `3px solid ${C.acc}` : "3px solid transparent", fontFamily: fontSans, fontSize: 34, color: C.fg }}>
      <span>{i === 0 && connected ? "✓ " : ""}{n}</span>
      <span style={{ display: "flex", gap: 18, alignItems: "center" }}>
        {i === 0 && joining && <span style={{ display: "inline-block", width: 34, height: 34, borderRadius: 17, border: "5px solid #3a4670", borderTopColor: BLUE, transform: `rotate(${f * 14}deg)` }} />}
        <span style={{ fontSize: 28 }}>📶</span>
        <span style={{ width: 40, height: 40, borderRadius: 20, border: `3px solid ${BLUE}`, color: BLUE, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fontSans, fontWeight: 700, fontSize: 24 }}>i</span></span>
    </div>)}
    {tapInfo && <Tap x={PW - 26 - 28 - 20} y={240 + 46} at={0.4} dur={dur} />}
  </>;
}
/** mode "wifijoin" (iPhone). (no reveal) Home-5G spins on "joining" and fails with Unable to join | "info" the (i) next to it is tapped
 *  | "forget" its page, Forget This Network tapped and confirmed | "joined" the password is typed fresh and it connects. */
export function PhoneWifiJoin({ v, dur }: { v: PhoneV; dur: number }) {
  const f = useCurrentFrame();
  const p = (a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: ease });
  if (!v.reveal) {
    const fail = p(dur * 0.45, dur * 0.55);
    return <Frame label="Settings › Wi-Fi">
      <WifiList joining={fail < 0.5} dur={dur} />
      {fail > 0 && <div style={{ position: "absolute", left: 70, right: 70, top: 380, padding: "30px 26px", borderRadius: 26, background: "#232c4af5", opacity: fail, transform: `scale(${0.9 + 0.1 * fail})`, textAlign: "center", zIndex: 6 }}>
        <div style={{ fontFamily: fontSans, fontWeight: 700, fontSize: 34, color: C.fg }}>Unable to join the network "Home-5G"</div>
        <div style={{ marginTop: 22, fontFamily: fontSans, fontWeight: 700, fontSize: 32, color: BLUE }}>OK</div></div>}
      <Note text={v.note ?? "Full bars. Won't join. Third try."} good={false} />
    </Frame>;
  }
  if (v.reveal === "info") return <Frame label="Settings › Wi-Fi"><WifiList tapInfo dur={dur} /></Frame>;
  if (v.reveal === "forget") {
    const sheet = p(dur * 0.55, dur * 0.65); const done = f > dur * 0.85;
    return <Frame label="Wi-Fi › Home-5G">
      <div style={{ position: "absolute", top: 140, left: 34, fontFamily: fontSans, fontWeight: 700, fontSize: 52, color: C.fg }}>Home-5G</div>
      <div style={{ position: "absolute", top: 240, left: 26, right: 26, height: 92, borderRadius: 22, padding: "0 28px", display: "flex", alignItems: "center", background: f > dur * 0.4 ? "rgba(255,107,107,.18)" : C.panel,
        border: f > dur * 0.4 ? `3px solid ${C.warn}` : "3px solid transparent", fontFamily: fontSans, fontSize: 34, color: C.warn }}>Forget This Network</div>
      {["Auto-Join", "Password", "Private Wi-Fi Address"].map((r, i) => <div key={r} style={{ position: "absolute", top: 360 + i * 104, left: 26, right: 26, height: 92, borderRadius: 22, padding: "0 28px", display: "flex", alignItems: "center", background: C.panel, fontFamily: fontSans, fontSize: 34, color: C.fg }}>{r}</div>)}
      {sheet > 0 && <div style={{ position: "absolute", left: 50, right: 50, top: 420, padding: "30px 26px", borderRadius: 26, background: "#232c4af5", opacity: sheet, textAlign: "center", zIndex: 6 }}>
        <div style={{ fontFamily: fontSans, fontWeight: 700, fontSize: 32, color: C.fg }}>Forget Wi-Fi Network "Home-5G"?</div>
        <div style={{ display: "flex", justifyContent: "space-around", marginTop: 26, fontFamily: fontSans, fontWeight: 700, fontSize: 32 }}><span style={{ color: BLUE }}>Cancel</span>
          <span style={{ color: done ? C.bg : C.warn, background: done ? C.warn : "transparent", padding: "4px 18px", borderRadius: 10 }}>Forget</span></div></div>}
      {f < dur * 0.55 ? <Tap x={PW / 2} y={240 + 46} at={0.35} dur={dur} /> : <div style={{ position: "absolute", inset: 0, zIndex: 8 }}><Finger x={PW / 2 + 110} y={420 + 130} press={interpolate(f, [dur * 0.78, dur * 0.83, dur * 0.9], [0, 1, 0], clamp)} show={1} /></div>}
    </Frame>;
  }
  // joined
  const pw = "sunflower42"; const typed = Math.floor(interpolate(f, [dur * 0.05, dur * 0.45], [0, pw.length], clamp)); const ok = f > dur * 0.55;
  return <Frame label="Settings › Wi-Fi">
    {!ok ? <div style={{ position: "absolute", left: 30, right: 30, top: 200, borderRadius: 28, background: C.panel, padding: 30 }}>
      <div style={{ fontFamily: fontSans, fontWeight: 700, fontSize: 34, color: C.fg }}>Enter the password for "Home-5G"</div>
      <div style={{ marginTop: 24, padding: "18px 20px", borderRadius: 14, background: "#0f1730", border: `3px solid ${C.acc}`, fontFamily: fontMono, fontSize: 32, color: C.fg }}>{"•".repeat(typed)}<span style={{ color: C.acc }}>|</span></div>
      <div style={{ marginTop: 22, textAlign: "right", fontFamily: fontSans, fontWeight: 700, fontSize: 32, color: BLUE }}>Join</div></div>
      : <WifiList connected dur={dur} />}
    {ok && <Note text={v.note ?? "Connected. First try."} good />}
  </Frame>;
}

/* ---------- Mac Spotlight ---------- */
function MacDesk({ children }: { children: React.ReactNode }) {
  return <div style={{ width: LW + 80, display: "flex", flexDirection: "column", alignItems: "center", marginTop: 40 }}>
    <div style={{ position: "relative", width: LW, height: LH, borderRadius: 26, border: "12px solid #2c3658", background: "linear-gradient(160deg,#1b2a55,#0f1730)", overflow: "hidden", boxShadow: "0 40px 100px rgba(0,0,0,.55)" }}>
      <div style={{ height: 36, background: "#141c36cc", display: "flex", alignItems: "center", gap: 26, padding: "0 20px", fontFamily: fontSans, fontSize: 22, color: C.fg }}>
        <span style={{ fontSize: 26 }}>●</span><b>Finder</b><span>File</span><span>Edit</span><span>View</span><span style={{ marginLeft: "auto" }}>🔍</span></div>
      {children}
    </div>
    <div style={{ width: LW + 100, height: 26, borderRadius: "0 0 30px 30px", background: "#2c3658" }} />
  </div>;
}
const DOCK = ["#4da3ff", "#3ee0a0", "#ffc857", "#ff6b6b", "#b28dff", "#ff9f43", "#54d2ff", "#9aa3ba", "#f78fb3", "#7bed9f", "#70a1ff", "#eccc68"];
function Dock({ hover = -1 }: { hover?: number }) {
  return <div style={{ position: "absolute", bottom: 12, left: LW / 2 - 380, width: 760, height: 70, borderRadius: 20, background: "#ffffff1a", display: "flex", gap: 10, alignItems: "flex-end", justifyContent: "center", padding: "0 10px 10px" }}>
    {DOCK.map((c, i) => { const s = hover < 0 ? 1 : Math.max(1, 1.6 - 0.25 * Math.abs(i - hover)); return <div key={i} style={{ width: 46 * s, height: 46 * s, borderRadius: 12 * s, background: c }} />; })}</div>;
}
function SpotlightBar({ text, result, sub, hit }: { text: string; result?: string; sub?: string; hit?: boolean }) {
  const f = useCurrentFrame();
  return <div style={{ position: "absolute", top: 110, left: LW / 2 - 330, width: 660, borderRadius: 22, background: "#232c4af5", border: "2px solid #3a4670", overflow: "hidden", zIndex: 5 }}>
    <div style={{ height: 80, display: "flex", alignItems: "center", gap: 18, padding: "0 26px", fontFamily: fontSans, fontSize: 38, color: C.fg }}>
      <span style={{ color: C.mut }}>🔍</span><span>{text || <span style={{ color: C.mut }}>Spotlight Search</span>}</span><span style={{ marginLeft: -12, color: C.acc, opacity: f % 20 < 12 ? 1 : 0 }}>|</span></div>
    {result && <div style={{ height: 80, display: "flex", alignItems: "center", gap: 20, padding: "0 26px", background: hit ? "rgba(62,224,160,.25)" : "rgba(77,163,255,.22)", borderTop: "2px solid #3a4670", fontFamily: fontSans, fontSize: 32, color: C.fg }}>
      <div style={{ width: 46, height: 46, borderRadius: 12, background: "#b28dff" }} /><b>{result}</b><span style={{ marginLeft: "auto", color: C.mut, fontSize: 24 }}>{sub}</span></div>}
  </div>;
}
function Keys({ keys, lit }: { keys: string[]; lit: number }) {
  return <div style={{ display: "flex", gap: 22, marginTop: 50, alignItems: "center" }}>
    {keys.map((k, i) => <div key={k} style={{ display: "flex", alignItems: "center", gap: 22 }}>{i > 0 && <span style={{ color: C.mut, fontSize: 56, fontFamily: fontSans }}>+</span>}
      <div style={{ padding: "26px 40px", borderRadius: 22, background: lit > 0.5 ? C.acc : C.key, color: lit > 0.5 ? C.bg : C.fg, fontFamily: fontSans, fontWeight: 700, fontSize: 54, boxShadow: "0 10px 0 #0a0f1e" }}>{k}</div></div>)}
  </div>;
}
/** action "spotlight" (Mac). mode "dock": the pointer sweeps the Dock looking for one app | "keys": Command + Space lights up and
 *  Spotlight opens | "type": "sla" types and Slack is the top hit | "open": Return, the Slack window opens | "math": 18*1.2 = 21.6. */
export function LaptopSpotlight({ v, dur }: { v: LaptopV; dur: number }) {
  const f = useCurrentFrame();
  const p = (a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: ease });
  const mode = v.mode ?? "dock";
  if (mode === "dock") {
    const hover = interpolate(Math.sin(f / 12), [-1, 1], [0, DOCK.length - 1]);
    const x = LW / 2 - 380 + 10 + 28 + hover * 56;
    return <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}><MacDesk>
      <Dock hover={hover} />
      <div style={{ position: "absolute", left: 0, top: 0, width: LW, height: LH, zIndex: 8 }}><Finger x={x} y={LH - 70} press={0} show={1} /></div>
      <div style={{ position: "absolute", top: 120, left: 60, right: 60, padding: "16px 22px", borderRadius: 14, textAlign: "center", background: "rgba(255,107,107,.18)", border: `2px solid ${C.warn}`, fontFamily: fontMono, fontSize: 28, color: C.fg }}>{v.items?.[0] ?? "Which one was Slack again?"}</div>
    </MacDesk></div>;
  }
  if (mode === "keys") {
    const lit = p(4, 12); const open = p(dur * 0.35, dur * 0.5);
    return <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}><MacDesk><Dock />{open > 0 && <div style={{ opacity: open }}><SpotlightBar text="" /></div>}</MacDesk><Keys keys={["⌘ Command", "Space"]} lit={lit} /></div>;
  }
  if (mode === "math") {
    const q = "18*1.2"; const t = Math.floor(interpolate(f, [dur * 0.05, dur * 0.4], [0, q.length], clamp));
    return <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}><MacDesk><Dock />
      <SpotlightBar text={q.slice(0, t)} result={t >= q.length ? "= 21.6" : undefined} sub="Calculator" hit={f > dur * 0.6} /></MacDesk></div>;
  }
  const q = "sla"; const t = mode === "open" ? 3 : Math.floor(interpolate(f, [dur * 0.1, dur * 0.5], [0, 3], clamp));
  const opened = mode === "open" ? p(dur * 0.35, dur * 0.55) : 0;
  return <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}><MacDesk><Dock />
    {opened < 1 && <div style={{ opacity: 1 - opened }}><SpotlightBar text={q.slice(0, t)} result={t >= 2 ? "Slack" : undefined} sub="Application" hit={mode === "open"} /></div>}
    {opened > 0 && <div style={{ position: "absolute", top: 70, left: 80, right: 80, bottom: 100, borderRadius: 16, background: "#232c4a", border: "2px solid #3a4670", opacity: opened, transform: `scale(${0.85 + 0.15 * opened})`, zIndex: 6 }}>
      <div style={{ height: 34, borderRadius: "14px 14px 0 0", background: "#2a3354", display: "flex", gap: 10, alignItems: "center", padding: "0 14px" }}>{["#ff5f57", "#febc2e", "#28c840"].map((c) => <div key={c} style={{ width: 14, height: 14, borderRadius: 7, background: c }} />)}
        <span style={{ marginLeft: 16, fontFamily: fontSans, fontSize: 20, color: C.mut }}>Slack</span></div>
      <div style={{ position: "absolute", top: 34, left: 0, bottom: 0, width: 180, background: "#3b2a5a" }} />
      {[0, 1, 2, 3].map((i) => <div key={i} style={{ position: "absolute", top: 70 + i * 70, left: 210, width: [420, 340, 380, 260][i], height: 22, borderRadius: 6, background: "#33406a" }} />)}
    </div>}
  </MacDesk>{mode === "open" && <Keys keys={["Return ↵"]} lit={f < dur * 0.4 ? p(2, 8) : 0} />}</div>;
}
