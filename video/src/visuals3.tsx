// More v3 mocks: a Chrome window whose tab closes / comes back, a region screenshot, and Circle to Search on a phone.
import { interpolate, useCurrentFrame, Easing } from "remotion";
import { C, clamp } from "./theme";
import { fontMono, fontSans } from "./fonts";
import { Finger } from "./visuals";
import type { Visual } from "./types";

const ease = Easing.inOut(Easing.cubic);
const LW = 940, LH = 600;
type LaptopV = Extract<Visual, { type: "laptop" }>;

function Keys({ keys, on }: { keys: string[]; on: number }) {
  return <div style={{ display: "flex", gap: 18, marginTop: 50, alignItems: "center" }}>
    {keys.map((k, i) => <div key={k + i} style={{ display: "flex", alignItems: "center", gap: 18 }}>{i > 0 && <span style={{ color: C.mut, fontSize: 52, fontFamily: fontSans }}>+</span>}
      <div style={{ padding: "22px 32px", borderRadius: 22, background: on > 0.5 ? C.acc : C.key, color: on > 0.5 ? C.bg : C.fg, fontFamily: fontSans, fontWeight: 700, fontSize: 48,
        boxShadow: `0 ${on > 0.5 ? 4 : 10}px 0 #0a0f1e`, transform: `translateY(${on > 0.5 ? 6 : 0}px)` }}>{k}</div></div>)}
  </div>;
}

function Screen({ children, title }: { children: React.ReactNode; title: string }) {
  return <>
    <div style={{ position: "relative", width: LW, height: LH, borderRadius: 26, border: "12px solid #2c3658", background: "#0f1730", overflow: "hidden", boxShadow: "0 40px 100px rgba(0,0,0,.55)" }}>
      <div style={{ height: 44, background: "#1a2340", display: "flex", alignItems: "center", padding: "0 20px", fontFamily: fontMono, fontSize: 22, color: C.mut }}>{title}</div>
      {children}
    </div>
    <div style={{ width: LW + 100, height: 26, borderRadius: "0 0 30px 30px", background: "#2c3658" }} />
  </>;
}

/** action "tabs": mode close (a tab is closed by accident) | reopen (keys pressed, tab pops back) | multi (several come back) */
export function LaptopTabs({ v, dur }: { v: LaptopV; dur: number }) {
  const f = useCurrentFrame();
  const p = (a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: ease });
  const tabs = v.items ?? ["Flights to Lisbon", "Hotel booking", "Google Docs", "YouTube"];
  const mode = v.mode ?? "close";
  const keyOn = mode === "close" ? 0 : (f > 6 && f < dur * 0.5 ? 1 : 0) || (mode === "multi" && f % 20 < 7 ? 1 : 0);
  // how many of the tabs are visible
  let visible = tabs.length, back = 0, fx = LW * 0.4, fy = LH * 0.6, press = 0, show = 0;
  if (mode === "close") { const x = p(dur * 0.2, dur * 0.4); visible = x > 0.5 ? 2 : tabs.length; show = 1; fx = interpolate(p(0, dur * 0.2), [0, 1], [LW * 0.6, 2 * 210 + 175]); fy = 66; press = interpolate(f, [dur * 0.2, dur * 0.25, dur * 0.32], [0, 1, 0], clamp); }
  else if (mode === "reopen") { back = p(dur * 0.3, dur * 0.45); visible = back > 0.5 ? 3 : 2; }
  else { visible = Math.min(tabs.length, 2 + Math.floor(p(0, dur * 0.8) * (tabs.length - 1))); }
  const active = Math.min(visible - 1, tabs.length - 1);
  return <div style={{ width: LW + 80, display: "flex", flexDirection: "column", alignItems: "center" }}>
    <Screen title={`Chrome · ${mode === "close" ? "oops" : "Ctrl+Shift+T"}`}>
      <div style={{ display: "flex", gap: 8, padding: "12px 14px 0", background: "#141c36" }}>
        {tabs.slice(0, visible).map((t, i) => <div key={t} style={{ width: 210, padding: "12px 16px", borderRadius: "14px 14px 0 0", background: i === active ? "#26304f" : "#1a2340",
          border: i === 2 && back > 0 ? `2px solid ${C.acc}` : "2px solid transparent", fontFamily: fontSans, fontSize: 22, color: C.fg, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          transform: i === 2 && mode === "reopen" ? `scale(${0.7 + 0.3 * back})` : "none" }}>{t}<span style={{ float: "right", color: C.mut }}>×</span></div>)}
      </div>
      <div style={{ position: "absolute", top: 108, left: 30, right: 30, padding: "14px 20px", borderRadius: 12, background: "#1c2440", fontFamily: fontMono, fontSize: 22, color: C.mut }}>{`https://example.com/${tabs[active].toLowerCase().replace(/[^a-z]+/g, "-")}`}</div>
      <div style={{ position: "absolute", top: 190, left: 30, right: 30, fontFamily: fontSans, fontWeight: 700, fontSize: 44, color: C.fg }}>{tabs[active]}</div>
      {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", top: 270 + i * 60, left: 30, width: [820, 640, 720][i], height: 26, borderRadius: 8, background: "#232c4a" }} />)}
      {mode === "close" && visible < tabs.length && <div style={{ position: "absolute", bottom: 30, left: 30, right: 30, padding: "16px 22px", borderRadius: 14, background: "rgba(255,107,107,.18)", border: `2px solid ${C.warn}`, fontFamily: fontSans, fontSize: 28, color: C.fg }}>Wait… that was the booking tab.</div>}
      {show > 0 && <div style={{ position: "absolute", left: 0, top: 0, width: LW, height: LH }}><Finger x={fx} y={fy} press={press} show={show} /></div>}
    </Screen>
    {mode !== "close" && <Keys keys={v.keys ?? ["Ctrl", "Shift", "T"]} on={keyOn} />}
  </div>;
}

/** action "snip": mode full (the old way: full screenshot + crop) | keys | drag (crosshair drags a region) | done (saved to clipboard) */
export function LaptopSnip({ v, dur }: { v: LaptopV; dur: number }) {
  const f = useCurrentFrame();
  const p = (a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: ease });
  const mode = v.mode ?? "drag";
  const x0 = 180, y0 = 150; const d = mode === "drag" ? p(dur * 0.15, dur * 0.75) : mode === "done" ? 1 : 0;
  const w = 520 * d, h = 300 * d;
  const flash = mode === "full" ? interpolate(f % 30, [0, 3, 10], [0, 0.8, 0], clamp) : 0;
  return <div style={{ width: LW + 80, display: "flex", flexDirection: "column", alignItems: "center" }}>
    <Screen title={v.app ?? "Photos · Windows 11"}>
      <div style={{ position: "absolute", top: 70, left: 30, right: 30, fontFamily: fontSans, fontWeight: 700, fontSize: 38, color: C.fg }}>Order #4471 confirmed</div>
      {[0, 1, 2, 3, 4].map((i) => <div key={i} style={{ position: "absolute", top: 150 + i * 70, left: 200, width: [460, 380, 420, 300, 440][i], height: 30, borderRadius: 8, background: i === 1 ? "#3a4670" : "#232c4a" }} />)}
      {(mode === "drag" || mode === "keys") && <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.35)" }} />}
      {mode === "full" && <><div style={{ position: "absolute", inset: 0, background: `rgba(255,255,255,${flash})` }} />
        <div style={{ position: "absolute", bottom: 30, left: 30, right: 30, padding: "16px 22px", borderRadius: 14, background: "rgba(255,107,107,.18)", border: `2px solid ${C.warn}`, fontFamily: fontSans, fontSize: 28, color: C.fg }}>{`Screenshot ${12 + Math.floor(f / 30)}.png · now crop it…`}</div></>}
      {d > 0 && <div style={{ position: "absolute", left: x0, top: y0, width: w, height: h, border: `4px dashed ${C.acc}`, background: mode === "done" ? "rgba(62,224,160,.12)" : "rgba(62,224,160,.06)", boxShadow: "0 0 0 2000px rgba(0,0,0,.15)" }} />}
      {mode === "drag" && <div style={{ position: "absolute", left: 0, top: 0, width: LW, height: LH }}><Finger x={x0 + w} y={y0 + h} press={1} show={1} /></div>}
      {mode === "done" && <div style={{ position: "absolute", bottom: 30, right: 30, padding: "16px 22px", borderRadius: 14, background: "rgba(62,224,160,.18)", border: `2px solid ${C.acc}`, fontFamily: fontSans, fontSize: 28, color: C.fg }}>Copied to clipboard ✓</div>}
    </Screen>
    {(mode === "keys" || mode === "drag") && <Keys keys={v.keys ?? ["⊞ Win", "Shift", "S"]} on={mode === "keys" ? (f > 6 ? 1 : 0) : 0} />}
  </div>;
}

/** Phone Circle to Search: a photo of sneakers, the caret circles it, results slide up. */
export function PhoneCircle({ dur, mode }: { dur: number; mode: "circle" | "screenshot" }) {
  const f = useCurrentFrame();
  const p = (a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: ease });
  const PW = 620, PH = 1000;
  const t = p(dur * 0.1, dur * 0.6); const res = mode === "circle" ? p(dur * 0.6, dur * 0.8) : 0;
  const cx = PW / 2, cy = 400, r = 150; const ang = t * Math.PI * 2 - Math.PI / 2;
  const flash = mode === "screenshot" ? interpolate(f % 24, [0, 2, 8], [0, 0.7, 0], clamp) : 0;
  return <div style={{ position: "relative", width: PW, height: PH, borderRadius: 72, background: "#0e1428", border: "10px solid #2c3658", boxShadow: "0 40px 100px rgba(0,0,0,.55)", overflow: "hidden" }}>
    <div style={{ position: "absolute", top: 18, left: PW / 2 - 70, width: 140, height: 34, borderRadius: 20, background: "#000" }} />
    <div style={{ position: "absolute", top: 82, left: 34, fontFamily: fontMono, fontSize: 26, color: C.mut }}>Instagram · Android</div>
    <div style={{ position: "absolute", top: 140, left: 26, right: 26, height: 520, borderRadius: 26, background: "linear-gradient(160deg,#3b2a5c,#1d2a4f)" }} />
    <div style={{ position: "absolute", top: 330, left: cx - 120, width: 240, height: 120, borderRadius: "60px 60px 30px 30px", background: "#ff8a5c" }} />
    <div style={{ position: "absolute", top: 430, left: cx - 140, width: 280, height: 30, borderRadius: 15, background: "#eef1f8" }} />
    {mode === "circle" && t > 0 && <svg width={PW} height={PH} style={{ position: "absolute", left: 0, top: 0 }}>
      <path d={`M ${cx} ${cy - r} A ${r} ${r} 0 ${t > 0.5 ? 1 : 0} 1 ${cx + r * Math.cos(ang)} ${cy + r * Math.sin(ang)}`} stroke={C.acc} strokeWidth={10} fill="none" strokeLinecap="round" style={{ filter: `drop-shadow(0 0 12px ${C.acc})` }} /></svg>}
    {mode === "circle" && t < 1 && <Finger x={cx + r * Math.cos(ang)} y={cy + r * Math.sin(ang)} press={1} show={p(0, 6)} />}
    {mode === "screenshot" && <><div style={{ position: "absolute", inset: 0, background: `rgba(255,255,255,${flash})` }} />
      <div style={{ position: "absolute", bottom: 60, left: 30, right: 30, padding: "18px 22px", borderRadius: 18, background: "rgba(255,107,107,.18)", border: `2px solid ${C.warn}`, fontFamily: fontSans, fontSize: 28, color: C.fg }}>{`Screenshots: ${240 + Math.floor(f / 24)} · "search later"`}</div></>}
    {res > 0 && <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 330, transform: `translateY(${(1 - res) * 330}px)`, background: "#1c2440", borderRadius: "36px 36px 0 0", padding: 30 }}>
      <div style={{ fontFamily: fontMono, fontSize: 24, color: C.acc }}>VISUAL MATCHES</div>
      {["Retro runner sneaker · €89", "Same shoe, 3 shops", "Similar styles"].map((x) => <div key={x} style={{ marginTop: 16, padding: "16px 20px", borderRadius: 16, background: "#232c4a", fontFamily: fontSans, fontSize: 28, color: C.fg }}>{x}</div>)}
    </div>}
  </div>;
}
