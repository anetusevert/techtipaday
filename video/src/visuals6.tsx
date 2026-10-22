// More v3 mocks: Android recent calls full of spam (or filtered away), an iPhone quietly burning mobile data on bad Wi-Fi
// (or staying on Wi-Fi), and Chrome's Password Checkup on a laptop. The Caret T is always the pointer.
import { interpolate, useCurrentFrame, Easing } from "remotion";
import { C, clamp } from "./theme";
import { fontMono, fontSans } from "./fonts";
import { Finger } from "./visuals";
import type { Visual } from "./types";

const ease = Easing.inOut(Easing.cubic);
const PW = 620, PH = 1000, LW = 940, LH = 600;
type PhoneV = Extract<Visual, { type: "phone-settings" }>;
type LaptopV = Extract<Visual, { type: "laptop" }>;

function Frame({ children, label, bg = "#0e1428" }: { children: React.ReactNode; label?: string; bg?: string }) {
  return <div style={{ position: "relative", width: PW, height: PH, borderRadius: 72, background: bg, border: "10px solid #2c3658", boxShadow: "0 40px 100px rgba(0,0,0,.55)", overflow: "hidden" }}>
    <div style={{ position: "absolute", top: 18, left: PW / 2 - 70, width: 140, height: 34, borderRadius: 20, background: "#000", zIndex: 5 }} />
    {label && <div style={{ position: "absolute", top: 82, left: 34, fontFamily: fontMono, fontSize: 26, color: C.mut }}>{label}</div>}
    {children}
  </div>;
}
function Note({ text, good }: { text: string; good: boolean }) {
  return <div style={{ position: "absolute", bottom: 60, left: 30, right: 30, padding: "18px 22px", borderRadius: 18, textAlign: "center", zIndex: 4,
    background: good ? "rgba(62,224,160,.18)" : "rgba(255,107,107,.18)", border: `2px solid ${good ? C.acc : C.warn}`, fontFamily: fontMono, fontSize: 28, color: C.fg }}>{text}</div>;
}

/** mode "spam": Android Recents full of "Suspected spam" calls. reveal "filtered" folds them into one quiet Spam row. */
export function PhoneSpam({ v, dur }: { v: PhoneV; dur: number }) {
  const f = useCurrentFrame();
  const p = (a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: ease });
  const filtered = v.reveal === "filtered";
  const calls: [string, string, boolean][] = [["Suspected spam", "+1 (602) 555-0148 · 9:12", true], ["Mum", "mobile · 8:40", false], ["Suspected spam", "+1 (480) 555-0177 · 8:05", true],
    ["Suspected spam", "+1 (623) 555-0102 · 7:51", true], ["Dentist", "office · yesterday", false]];
  const fold = filtered ? p(dur * 0.25, dur * 0.5) : 0;
  let y = 230; const rows: React.ReactNode[] = [];
  calls.forEach(([name, sub, spam], i) => {
    const inn = filtered ? 1 : p(2 + i * 6, 12 + i * 6);
    const h = spam ? 120 * (1 - fold) : 120;
    if (h > 2) rows.push(<div key={i} style={{ position: "absolute", top: y, left: 26, right: 26, height: h - 12, borderRadius: 22, padding: "0 24px", overflow: "hidden", display: "flex", alignItems: "center", gap: 20,
      background: spam ? "rgba(255,107,107,.14)" : C.panel, opacity: inn * (spam ? 1 - fold : 1), border: spam ? `2px solid ${C.warn}` : "2px solid transparent" }}>
      <div style={{ width: 64, height: 64, borderRadius: 32, flexShrink: 0, background: spam ? C.warn : "#4da3ff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fontSans, fontWeight: 800, fontSize: 32, color: "#0b1020" }}>{spam ? "!" : name[0]}</div>
      <div><div style={{ fontFamily: fontSans, fontWeight: 700, fontSize: 34, color: spam ? C.warn : C.fg }}>{name}</div>
        <div style={{ fontFamily: fontMono, fontSize: 22, color: C.mut, marginTop: 4 }}>{sub}</div></div>
    </div>);
    y += h;
  });
  const ring = !filtered && f % 30 < 15;
  return <Frame label={v.path.join(" › ")}>
    <div style={{ position: "absolute", top: 140, left: 34, fontFamily: fontSans, fontWeight: 700, fontSize: 52, color: C.fg }}>Recents</div>
    {rows}
    {filtered && fold > 0.5 && <div style={{ position: "absolute", top: y + 8, left: 26, right: 26, height: 96, borderRadius: 22, padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between",
      background: "rgba(62,224,160,.16)", border: `3px solid ${C.acc}`, opacity: p(dur * 0.45, dur * 0.6), fontFamily: fontSans, fontSize: 32, color: C.fg }}>
      <span>Spam · 3 filtered</span><span style={{ fontFamily: fontMono, fontSize: 24, color: C.acc }}>no ring</span></div>}
    {!filtered && <div style={{ position: "absolute", top: 150, right: 40, fontFamily: fontMono, fontSize: 26, color: ring ? C.warn : C.mut }}>{ring ? "ringing…" : "3 missed"}</div>}
    <Note text={v.note ?? (filtered ? "Filter spam calls · on" : "Ringing all morning")} good={filtered} />
  </Frame>;
}

/** mode "data": an iPhone on weak Wi-Fi while the mobile data counter climbs (Wi-Fi Assist). reveal "off" keeps it on Wi-Fi and the counter stops. */
export function PhoneData({ v, dur }: { v: PhoneV; dur: number }) {
  const f = useCurrentFrame();
  const p = (a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: ease });
  const off = v.reveal === "off";
  const used = off ? 2.4 : interpolate(f, [0, dur], [0.8, 2.4], clamp);
  const left = Math.max(0, 3 - used);
  const onCell = !off && f % 40 > 8;
  const settle = off ? p(dur * 0.15, dur * 0.4) : 0;
  const bars = (n: number, color: string) => <div style={{ display: "flex", gap: 5, alignItems: "flex-end" }}>{[0, 1, 2, 3].map((i) => <div key={i} style={{ width: 10, height: 12 + i * 8, borderRadius: 3, background: i < n ? color : "#3a4566" }} />)}</div>;
  return <Frame label={v.path[0] ?? "Home · iPhone"}>
    <div style={{ position: "absolute", top: 140, left: 34, right: 34, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ display: "flex", gap: 14, alignItems: "center", fontFamily: fontMono, fontSize: 28 }}>
        <span style={{ color: off || !onCell ? C.acc : C.mut }}>Wi-Fi</span>{bars(off ? 3 : 1, off || !onCell ? C.acc : C.mut)}</div>
      <div style={{ padding: "6px 16px", borderRadius: 12, fontFamily: fontMono, fontSize: 28, background: onCell ? "rgba(255,107,107,.22)" : "transparent", color: onCell ? C.warn : C.mut, border: `2px solid ${onCell ? C.warn : "#3a4566"}` }}>5G</div>
    </div>
    <div style={{ position: "absolute", top: 240, left: 34, right: 34, height: 260, borderRadius: 28, background: C.panel, padding: "26px 30px" }}>
      <div style={{ fontFamily: fontMono, fontSize: 24, color: C.mut }}>Mobile data this month</div>
      <div style={{ fontFamily: fontSans, fontWeight: 800, fontSize: 84, color: off ? C.fg : C.warn, marginTop: 10 }}>{`${used.toFixed(1)} GB`}</div>
      <div style={{ marginTop: 18, height: 26, borderRadius: 13, background: "#2a3354", overflow: "hidden" }}><div style={{ width: `${(used / 3) * 100}%`, height: "100%", background: off ? C.acc : C.warn }} /></div>
      <div style={{ fontFamily: fontMono, fontSize: 22, color: C.mut, marginTop: 12 }}>{`of 3 GB · ${left.toFixed(1)} GB left`}</div>
    </div>
    <div style={{ position: "absolute", top: 540, left: 34, right: 34, height: 110, borderRadius: 24, padding: "0 28px", display: "flex", alignItems: "center", justifyContent: "space-between",
      background: off ? "rgba(62,224,160,.16)" : "#1c2440", border: `3px solid ${off ? C.acc : "transparent"}`, fontFamily: fontSans, fontSize: 34, color: C.fg, opacity: off ? settle : 1 }}>
      <span>Wi-Fi Assist</span><span style={{ fontFamily: fontMono, fontSize: 26, color: off ? C.acc : C.warn }}>{off ? "Off" : `On · ${used.toFixed(1)} GB`}</span></div>
    <Note text={v.note ?? (off ? "Stays on your Wi-Fi" : "Weak Wi-Fi? It quietly uses 5G")} good={off} />
  </Frame>;
}

/** action "passwords": Chrome on a laptop. mode reuse (same password on every site + a breach headline) | scan (Checkup runs, results count up)
 *  | fix (compromised list; the caret clicks Change password and the row turns safe). */
export function LaptopPasswords({ v, dur }: { v: LaptopV; dur: number }) {
  const f = useCurrentFrame();
  const p = (a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: ease });
  const mode = v.mode ?? "scan";
  let body: React.ReactNode = null; let fx = LW * 0.7, fy = LH * 0.8, press = 0, show = 0;
  const title = mode === "reuse" ? "Chrome · signing in" : "Chrome · Google Password Manager › Checkup";
  if (mode === "reuse") {
    const sites = ["shop-online.com", "streamflix.com", "pizza-now.com"];
    const shown = Math.min(3, 1 + Math.floor(p(0, dur * 0.6) * 3));
    const news = p(dur * 0.6, dur * 0.75);
    body = <>
      {sites.slice(0, shown).map((s, i) => <div key={s} style={{ position: "absolute", top: 70 + i * 120, left: 30, right: 30, height: 100, borderRadius: 16, background: C.panel, padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontFamily: fontSans, fontWeight: 700, fontSize: 30, color: C.fg }}>{s}</span>
        <span style={{ fontFamily: fontMono, fontSize: 28, color: C.warn, padding: "8px 18px", borderRadius: 10, background: "#232c4a" }}>Summer2019!</span></div>)}
      {news > 0 && <div style={{ position: "absolute", top: 440, left: 30, right: 30, padding: "14px 22px", borderRadius: 14, background: "rgba(255,107,107,.2)", border: `2px solid ${C.warn}`, opacity: news,
        transform: `scale(${0.9 + 0.1 * news})`, fontFamily: fontSans, fontWeight: 700, fontSize: 28, color: C.fg }}>News: pizza-now.com breach, 2.6M passwords leaked</div>}
    </>;
  } else if (mode === "scan") {
    const run = p(dur * 0.1, dur * 0.55); const res = p(dur * 0.55, dur * 0.7);
    const items: [string, number, string][] = [["Compromised passwords", 3, C.warn], ["Reused passwords", 5, "#ffc857"], ["Weak passwords", 2, "#ffc857"]];
    body = <>
      <div style={{ position: "absolute", top: 70, left: 34, fontFamily: fontSans, fontWeight: 700, fontSize: 42, color: C.fg }}>Password Checkup</div>
      <div style={{ position: "absolute", top: 140, left: 34, right: 34, height: 22, borderRadius: 11, background: "#2a3354", overflow: "hidden" }}><div style={{ width: `${run * 100}%`, height: "100%", background: C.acc }} /></div>
      <div style={{ position: "absolute", top: 172, left: 34, fontFamily: fontMono, fontSize: 22, color: C.mut }}>{res > 0 ? "Checked 48 passwords" : `Checking ${Math.round(run * 48)} of 48…`}</div>
      {items.map(([t, n, col], i) => <div key={t} style={{ position: "absolute", top: 220 + i * 92, left: 26, right: 26, height: 78, borderRadius: 16, padding: "0 26px", display: "flex", alignItems: "center", justifyContent: "space-between",
        background: C.panel, opacity: p(dur * 0.55 + i * 4, dur * 0.62 + i * 4), fontFamily: fontSans, fontSize: 32, color: C.fg }}>
        <span>{t}</span><span style={{ fontFamily: fontSans, fontWeight: 800, fontSize: 40, color: col }}>{n}</span></div>)}
    </>;
  } else { // fix
    const rows = ["pizza-now.com", "shop-online.com", "streamflix.com"];
    const move = p(0, dur * 0.35); show = p(0, 6); const btnX = LW - 170, btnY = 150 + 44;
    const lift = p(dur * 0.58, dur * 0.72); // move off the button so "Safe" stays visible
    fx = interpolate(move, [0, 1], [LW * 0.5, btnX]) - lift * 60; fy = interpolate(move, [0, 1], [LH - 90, btnY]) + lift * 330;
    press = interpolate(f, [dur * 0.38, dur * 0.44, dur * 0.52], [0, 1, 0], clamp); const done = p(dur * 0.46, dur * 0.56);
    body = <>
      <div style={{ position: "absolute", top: 66, left: 34, fontFamily: fontSans, fontWeight: 700, fontSize: 40, color: C.fg }}>{done > 0.5 ? "2 compromised passwords" : "3 compromised passwords"}</div>
      {rows.map((r, i) => { const fixed = i === 0 && done > 0.5;
        return <div key={r} style={{ position: "absolute", top: 150 + i * 104, left: 26, right: 26, height: 88, borderRadius: 16, padding: "0 22px 0 26px", display: "flex", alignItems: "center", justifyContent: "space-between",
          background: fixed ? "rgba(62,224,160,.16)" : "rgba(255,107,107,.12)", border: `3px solid ${fixed ? C.acc : "transparent"}` }}>
          <div><div style={{ fontFamily: fontSans, fontWeight: 700, fontSize: 30, color: C.fg }}>{r}</div>
            <div style={{ fontFamily: fontMono, fontSize: 20, color: fixed ? C.acc : C.warn, marginTop: 4 }}>{fixed ? "new password saved" : "found in a data breach"}</div></div>
          <div style={{ padding: "12px 20px", borderRadius: 12, fontFamily: fontSans, fontWeight: 700, fontSize: 24, background: fixed ? "transparent" : "#4da3ff", color: fixed ? C.acc : "#0b1020" }}>{fixed ? "✓ Safe" : "Change password"}</div>
        </div>; })}
    </>;
  }
  return <div style={{ width: LW + 80, display: "flex", flexDirection: "column", alignItems: "center", marginTop: 40 }}>
    <div style={{ position: "relative", width: LW, height: LH, borderRadius: 26, border: "12px solid #2c3658", background: "#0f1730", overflow: "hidden", boxShadow: "0 40px 100px rgba(0,0,0,.55)" }}>
      <div style={{ height: 44, background: "#1a2340", display: "flex", alignItems: "center", padding: "0 20px", fontFamily: fontMono, fontSize: 22, color: C.mut }}>{title}</div>
      {body}
      {show > 0 && <div style={{ position: "absolute", left: 0, top: 0, width: LW, height: LH }}><Finger x={fx} y={fy} press={press} show={show} /></div>}
    </div>
    <div style={{ width: LW + 100, height: 26, borderRadius: "0 0 30px 30px", background: "#2c3658" }} />
  </div>;
}
