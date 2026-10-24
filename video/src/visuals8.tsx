// More v3 mocks: the Android privacy dashboard (who used the mic and camera), the iPhone camera level,
// and Chrome tab search across a crowded tab strip. The Caret T is always the pointer.
import { interpolate, useCurrentFrame, Easing } from "remotion";
import { C, clamp } from "./theme";
import { fontMono, fontSans } from "./fonts";
import { Finger } from "./visuals";
import type { Visual } from "./types";

const ease = Easing.inOut(Easing.cubic);
const PW = 620, PH = 1000, LW = 940, LH = 600;
type PhoneV = Extract<Visual, { type: "phone-settings" }>;
type LaptopV = Extract<Visual, { type: "laptop" }>;
const AMBER = "#ffc857", BLUE = "#4da3ff";

function Frame({ children, label, bg = "#0e1428" }: { children: React.ReactNode; label?: string; bg?: string }) {
  return <div style={{ position: "relative", width: PW, height: PH, borderRadius: 72, background: bg, border: "10px solid #2c3658", boxShadow: "0 40px 100px rgba(0,0,0,.55)", overflow: "hidden" }}>
    <div style={{ position: "absolute", top: 22, left: PW / 2 - 16, width: 32, height: 32, borderRadius: 16, background: "#000", zIndex: 5 }} />
    {label && <div style={{ position: "absolute", top: 82, left: 34, fontFamily: fontMono, fontSize: 26, color: C.mut }}>{label}</div>}
    {children}
  </div>;
}
function Note({ text, good }: { text: string; good: boolean }) {
  return <div style={{ position: "absolute", bottom: 60, left: 30, right: 30, padding: "18px 22px", borderRadius: 18, textAlign: "center", zIndex: 4,
    background: good ? "rgba(62,224,160,.18)" : "rgba(255,107,107,.18)", border: `2px solid ${good ? C.acc : C.warn}`, fontFamily: fontMono, fontSize: 28, color: C.fg }}>{text}</div>;
}

/** mode "privacy" (Android). (no reveal) the green camera/mic dot pops up while you're just scrolling
 *  | "dashboard" the Privacy dashboard ring: location, camera, microphone | "list" the microphone timeline, a shopping app at 2:14 am
 *  | "deny" that app's microphone permission set to Don't allow. */
export function PhonePrivacy({ v, dur }: { v: PhoneV; dur: number }) {
  const f = useCurrentFrame();
  const p = (a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: ease });
  const r = v.reveal;
  let fx = PW * 0.7, fy = PH - 150, press = 0, show = 0;
  if (!r) {
    const dot = f > 8 ? (f % 24 < 16 ? 1 : 0.35) : 0;
    const scroll = (f * 4) % 260;
    return <Frame>
      <div style={{ position: "absolute", top: 26, right: 44, width: 26, height: 26, borderRadius: 13, background: C.acc, opacity: dot, boxShadow: dot > 0.5 ? `0 0 24px 8px rgba(62,224,160,.6)` : "none", zIndex: 6 }} />
      <div style={{ position: "absolute", top: 70, left: 0, right: 0, bottom: 0, overflow: "hidden" }}>
        {Array.from({ length: 7 }, (_, i) => <div key={i} style={{ position: "absolute", left: 26, right: 26, top: i * 260 - scroll, height: 230, borderRadius: 24, background: C.panel, padding: 24 }}>
          <div style={{ width: 160, height: 26, borderRadius: 8, background: "#3a4566" }} />
          <div style={{ width: "100%", height: 120, marginTop: 20, borderRadius: 14, background: ["#2b3a63", "#3b2f55", "#24423b"][i % 3] }} />
        </div>)}
      </div>
      <div style={{ position: "absolute", top: 92, right: 26, padding: "14px 20px", borderRadius: 18, background: "rgba(11,16,32,.92)", border: `2px solid ${C.acc}`, fontFamily: fontSans, fontSize: 30, color: C.fg, zIndex: 6, opacity: interpolate(f, [14, 22], [0, 1], clamp) }}>
        🎙 Microphone in use</div>
      <Note text={v.note ?? "Just scrolling. Who's listening?"} good={false} />
    </Frame>;
  }
  if (r === "dashboard") {
    const g = p(4, dur * 0.6);
    const segs: [string, number, string][] = [["Location", 0.45, BLUE], ["Camera", 0.2, AMBER], ["Microphone", 0.35, C.acc]];
    let acc = 0;
    const stops = segs.map(([, w, c]) => { const a = acc; acc += w; return `${c} ${a * 360 * g}deg ${acc * 360 * g}deg`; }).join(", ");
    const rows: [string, string, string][] = [["Location", "Used by 4 apps", BLUE], ["Camera", "Used by 2 apps", AMBER], ["Microphone", "Used by 3 apps", C.acc]];
    return <Frame label={v.path.join(" › ")}>
      <div style={{ position: "absolute", top: 140, left: 34, fontFamily: fontSans, fontWeight: 700, fontSize: 52, color: C.fg }}>Privacy dashboard</div>
      <div style={{ position: "absolute", top: 230, left: PW / 2 - 150, width: 300, height: 300, borderRadius: 150, background: `conic-gradient(${stops}, #2a3354 ${360 * g}deg 360deg)` }}>
        <div style={{ position: "absolute", inset: 34, borderRadius: 120, background: "#0e1428", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: fontSans, color: C.fg }}>
          <div style={{ fontSize: 26, color: C.mut }}>Past</div><div style={{ fontSize: 50, fontWeight: 700 }}>7 days</div></div>
      </div>
      {rows.map(([t, s, c], i) => { const o = p(dur * 0.25 + i * 6, dur * 0.25 + i * 6 + 10);
        return <div key={t} style={{ position: "absolute", top: 580 + i * 112, left: 26, right: 26, height: 96, borderRadius: 22, background: C.panel, padding: "0 28px", display: "flex", alignItems: "center", gap: 22, opacity: o, transform: `translateY(${(1 - o) * 30}px)` }}>
          <div style={{ width: 22, height: 22, borderRadius: 11, background: c }} />
          <div><div style={{ fontFamily: fontSans, fontSize: 34, color: C.fg, fontWeight: 700 }}>{t}</div><div style={{ fontFamily: fontMono, fontSize: 22, color: C.mut }}>{s}</div></div>
        </div>; })}
    </Frame>;
  }
  if (r === "list") {
    const items: [string, string, boolean][] = [["Gboard", "8:12 am · voice typing", false], ["WhatsApp", "1:40 pm · call", false], ["ShopNow", "2:14 am · in background", true], ["Recorder", "Yesterday", false]];
    show = p(0, 6); const mv = p(dur * 0.35, dur * 0.6); fy = interpolate(mv, [0, 1], [PH - 150, 260 + 2 * 120 + 50]); fx = interpolate(mv, [0, 1], [PW * 0.75, PW * 0.82]);
    press = interpolate(f, [dur * 0.62, dur * 0.67, dur * 0.74], [0, 1, 0], clamp);
    const hi = p(dur * 0.2, dur * 0.32);
    return <Frame label={v.path.join(" › ")}>
      <div style={{ position: "absolute", top: 140, left: 34, fontFamily: fontSans, fontWeight: 700, fontSize: 52, color: C.fg }}>Microphone</div>
      {items.map(([a, t, bad], i) => { const o = p(i * 4, i * 4 + 10);
        return <div key={a} style={{ position: "absolute", top: 240 + i * 120, left: 26, right: 26, height: 104, borderRadius: 22, padding: "0 28px", display: "flex", alignItems: "center", gap: 22, opacity: o,
          background: bad && hi > 0.5 ? "rgba(255,107,107,.16)" : C.panel, border: bad && hi > 0.5 ? `3px solid ${C.warn}` : "3px solid transparent" }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: ["#4da3ff", "#25d366", "#e8603d", "#b05cd6"][i], display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fontSans, fontWeight: 800, fontSize: 30, color: "#fff" }}>{a[0]}</div>
          <div><div style={{ fontFamily: fontSans, fontSize: 34, color: C.fg, fontWeight: 700 }}>{a}</div>
            <div style={{ fontFamily: fontMono, fontSize: 22, color: bad && hi > 0.5 ? C.warn : C.mut }}>{t}</div></div>
        </div>; })}
      {hi > 0.5 && <Note text="2:14 am? I was asleep." good={false} />}
      <Finger x={fx} y={fy} press={press} show={show} />
    </Frame>;
  }
  // deny
  const opts = ["Allow only while using the app", "Ask every time", "Don't allow"];
  show = p(0, 6); const mv = p(0, dur * 0.35); fx = interpolate(mv, [0, 1], [PW * 0.75, PW * 0.8]); fy = interpolate(mv, [0, 1], [PH - 150, 300 + 2 * 110 + 46]);
  press = interpolate(f, [dur * 0.38, dur * 0.44, dur * 0.52], [0, 1, 0], clamp); const done = p(dur * 0.44, dur * 0.5);
  return <Frame label={v.path.join(" › ")}>
    <div style={{ position: "absolute", top: 140, left: 34, fontFamily: fontSans, fontWeight: 700, fontSize: 48, color: C.fg }}>Microphone access</div>
    <div style={{ position: "absolute", top: 210, left: 34, fontFamily: fontMono, fontSize: 24, color: C.mut }}>for this app</div>
    {opts.map((o, i) => { const sel = done > 0.5 ? i === 2 : i === 0;
      return <div key={o} style={{ position: "absolute", top: 300 + i * 110, left: 26, right: 26, height: 92, borderRadius: 22, padding: "0 26px", display: "flex", alignItems: "center", gap: 22,
        background: sel && i === 2 ? "rgba(62,224,160,.16)" : C.panel, border: sel && i === 2 ? `3px solid ${C.acc}` : "3px solid transparent", fontFamily: fontSans, fontSize: 32, color: C.fg }}>
        <div style={{ width: 36, height: 36, borderRadius: 18, border: `4px solid ${sel ? C.acc : "#5d6584"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {sel && <div style={{ width: 16, height: 16, borderRadius: 8, background: C.acc }} />}</div>{o}</div>; })}
    {done > 0.5 && <Note text="Mic off for ShopNow" good />}
    <Finger x={fx} y={fy} press={press} show={show} />
  </Frame>;
}

/** mode "level" (iPhone Camera). (no reveal) a tilted beach horizon, photo comes out crooked
 *  | "on" the broken level line appears, then joins and turns yellow as the phone straightens
 *  | "tilt" phone tilts back and forth, the line snaps yellow at level. */
export function PhoneLevel({ v, dur }: { v: PhoneV; dur: number }) {
  const f = useCurrentFrame();
  const p = (a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: ease });
  const r = v.reveal;
  let tilt = -7;
  if (r === "on") tilt = interpolate(p(dur * 0.12, dur * 0.42), [0, 1], [-7, 0]);
  if (r === "tilt") tilt = interpolate(f, [0, dur * 0.2, dur * 0.38, dur * 0.5], [5, -4, 1.5, 0], { ...clamp, easing: ease });
  const level = r && Math.abs(tilt) < 0.6;
  const shot = !r ? interpolate(f % 40, [0, 3, 10], [0, 0.7, 0], clamp) * (f > 10 ? 1 : 0) : 0;
  const vf = { x: 0, y: 150, w: PW - 20, h: 640 };
  const gap = level ? 0 : 60;
  return <Frame bg="#000">
    <div style={{ position: "absolute", left: vf.x, top: vf.y, width: vf.w, height: vf.h, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: -200, right: -200, top: -200, bottom: -200, transform: `rotate(${tilt}deg)` }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: "52%", background: "linear-gradient(180deg,#f6a26b 0%,#f9d27a 70%,#fbe7a8 100%)" }} />
        <div style={{ position: "absolute", left: "50%", top: "40%", width: 120, height: 120, marginLeft: -60, borderRadius: 60, background: "#fff3c4" }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: "52%", bottom: 0, background: "linear-gradient(180deg,#2c6f9e 0%,#173a5c 100%)" }} />
      </div>
      {r && <div style={{ position: "absolute", top: vf.h / 2 - 3, left: 0, right: 0, height: 6, zIndex: 3 }}>
        {level ? <div style={{ position: "absolute", left: vf.w / 2 - 150, width: 300, height: 8, borderRadius: 4, background: AMBER, boxShadow: `0 0 20px ${AMBER}` }} />
          : <>
            <div style={{ position: "absolute", left: vf.w / 2 - 150 - gap / 2, width: 100, height: 4, background: "#fff", transform: `rotate(${-tilt}deg)` }} />
            <div style={{ position: "absolute", left: vf.w / 2 - 50, width: 100, height: 4, background: "#fff" }} />
            <div style={{ position: "absolute", left: vf.w / 2 + 50 + gap / 2, width: 100, height: 4, background: "#fff", transform: `rotate(${-tilt}deg)` }} />
          </>}
      </div>}
      <div style={{ position: "absolute", inset: 0, background: `rgba(255,255,255,${shot})`, zIndex: 4 }} />
    </div>
    <div style={{ position: "absolute", top: 90, left: 0, right: 0, textAlign: "center", fontFamily: fontSans, fontWeight: 700, fontSize: 26, color: AMBER, letterSpacing: 2 }}>PHOTO</div>
    <div style={{ position: "absolute", bottom: 60, left: PW / 2 - 60, width: 120, height: 120, borderRadius: 60, border: "6px solid #fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 96, height: 96, borderRadius: 48, background: "#fff" }} /></div>
    {!r && <div style={{ position: "absolute", top: 170, left: 30, right: 30, padding: "14px 18px", borderRadius: 16, textAlign: "center", background: "rgba(255,107,107,.2)", border: `2px solid ${C.warn}`, fontFamily: fontMono, fontSize: 26, color: C.fg }}>{v.note ?? "Crooked. Again."}</div>}
    {r && level && <div style={{ position: "absolute", top: 170, left: 30, right: 30, padding: "14px 18px", borderRadius: 16, textAlign: "center", background: "rgba(62,224,160,.18)", border: `2px solid ${C.acc}`, fontFamily: fontMono, fontSize: 26, color: C.fg }}>{v.note ?? "Yellow line = level"}</div>}
  </Frame>;
}

/** action "tabsearch" (Chrome). mode crowded (30 tiny tabs, the pointer hunts) | open (the tab search box drops down)
 *  | keys (shortcut pressed, box opens) | type (a word filters the list) | jump (Enter, that tab is in front). */
export function LaptopTabSearch({ v, dur }: { v: LaptopV; dur: number }) {
  const f = useCurrentFrame();
  const p = (a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: ease });
  const mode = v.mode ?? "open";
  const all = ["Inbox (214)", "Flights to Lisbon", "Hotel booking", "Google Docs", "YouTube", "Amazon cart", "Recipe: lasagne", "Bank", "Maps", "Calendar", "Slack", "Jira board", "News", "Reddit", "Wikipedia", "Weather"];
  const n = 30; const tw = (LW - 40) / n;
  const word = "lasagne"; const typed = mode === "type" ? word.slice(0, Math.floor(p(4, dur * 0.6) * word.length)) : mode === "jump" ? word : "";
  const box = mode === "open" ? p(dur * 0.15, dur * 0.35) : mode === "keys" ? p(dur * 0.35, dur * 0.5) : mode === "type" ? 1 : mode === "jump" ? 1 - p(dur * 0.3, dur * 0.42) : 0;
  const list = typed ? all.filter((t) => t.toLowerCase().includes(typed)) : all.slice(0, 6);
  const jumped = mode === "jump" && f > dur * 0.35;
  const activeTitle = jumped ? "Recipe: lasagne" : "Inbox (214)";
  let fx = LW * 0.5, fy = LH * 0.6, press = 0, show = 0;
  if (mode === "crowded") { show = 1; fx = 60 + ((Math.sin(f / 9) + 1) / 2) * (LW - 120); fy = 32 + Math.sin(f / 4) * 6; }
  const keyOn = mode === "keys" ? (f > dur * 0.25 && f < dur * 0.6 ? 1 : 0) : mode === "jump" ? (f > dur * 0.2 && f < dur * 0.4 ? 1 : 0) : 0;
  const keys = mode === "jump" ? ["Enter"] : v.keys ?? ["Ctrl", "Shift", "A"];
  return <div style={{ width: LW + 80, display: "flex", flexDirection: "column", alignItems: "center", marginTop: 40 }}>
    <div style={{ position: "relative", width: LW, height: LH, borderRadius: 26, border: "12px solid #2c3658", background: "#0f1730", overflow: "hidden", boxShadow: "0 40px 100px rgba(0,0,0,.55)" }}>
      <div style={{ display: "flex", gap: 2, padding: "12px 20px 0", background: "#141c36", height: 56 }}>
        {Array.from({ length: n }, (_, i) => { const act = jumped ? i === 6 : i === 0;
          return <div key={i} style={{ width: tw - 2, height: 44, borderRadius: "10px 10px 0 0", background: act ? "#26304f" : "#1a2340", display: "flex", alignItems: "center", justifyContent: "center",
            border: act && jumped ? `2px solid ${C.acc}` : "2px solid transparent" }}>
            <div style={{ width: 14, height: 14, borderRadius: 4, background: ["#4da3ff", "#e8603d", "#25d366", "#ffc857", "#b05cd6"][i % 5] }} /></div>; })}
      </div>
      <div style={{ position: "absolute", top: 80, left: 30, right: 30, padding: "14px 20px", borderRadius: 12, background: "#1c2440", fontFamily: fontMono, fontSize: 22, color: C.mut }}>{jumped ? "https://example.com/recipes/lasagne" : "https://mail.example.com/inbox"}</div>
      <div style={{ position: "absolute", top: 160, left: 30, right: 30, fontFamily: fontSans, fontWeight: 700, fontSize: 44, color: jumped ? C.acc : C.fg }}>{activeTitle}</div>
      {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", top: 240 + i * 60, left: 30, width: [820, 640, 720][i], height: 26, borderRadius: 8, background: "#232c4a" }} />)}
      {mode === "crowded" && <div style={{ position: "absolute", bottom: 30, left: 30, right: 30, padding: "16px 22px", borderRadius: 14, background: "rgba(255,107,107,.18)", border: `2px solid ${C.warn}`, fontFamily: fontSans, fontSize: 28, color: C.fg }}>{`30 tabs. Which one was the recipe?`}</div>}
      {box > 0 && <div style={{ position: "absolute", top: 62, right: 30, width: 480, borderRadius: 16, background: "#1c2440", border: `2px solid ${BLUE}`, padding: 14, opacity: box, transform: `scale(${0.85 + 0.15 * box})`, transformOrigin: "100% 0", zIndex: 5 }}>
        <div style={{ padding: "12px 16px", borderRadius: 10, background: "#0f1730", fontFamily: fontSans, fontSize: 26, color: typed ? C.fg : C.mut }}>{typed || "Search tabs"}<span style={{ display: "inline-block", width: 3, height: 28, marginLeft: 2, background: BLUE, verticalAlign: "-5px", opacity: f % 24 < 14 ? 1 : 0 }} /></div>
        {list.map((t, i) => <div key={t} style={{ marginTop: 8, padding: "10px 16px", borderRadius: 10, background: typed && i === 0 ? "rgba(62,224,160,.22)" : "#232c4a", border: typed && i === 0 ? `2px solid ${C.acc}` : "2px solid transparent", fontFamily: fontSans, fontSize: 24, color: C.fg }}>{t}</div>)}
      </div>}
      {show > 0 && <div style={{ position: "absolute", left: 0, top: 0, width: LW, height: LH, zIndex: 8 }}><Finger x={fx} y={fy} press={press} show={show} /></div>}
    </div>
    <div style={{ width: LW + 100, height: 26, borderRadius: "0 0 30px 30px", background: "#2c3658" }} />
    {(mode === "keys" || mode === "jump") && <div style={{ display: "flex", gap: 18, marginTop: 50, alignItems: "center" }}>
      {keys.map((k, i) => <div key={k + i} style={{ display: "flex", alignItems: "center", gap: 18 }}>{i > 0 && <span style={{ color: C.mut, fontSize: 52, fontFamily: fontSans }}>+</span>}
        <div style={{ padding: "22px 32px", borderRadius: 22, background: keyOn > 0.5 ? C.acc : C.key, color: keyOn > 0.5 ? C.bg : C.fg, fontFamily: fontSans, fontWeight: 700, fontSize: 48,
          boxShadow: `0 ${keyOn > 0.5 ? 4 : 10}px 0 #0a0f1e`, transform: `translateY(${keyOn > 0.5 ? 6 : 0}px)` }}>{k}</div></div>)}
    </div>}
  </div>;
}
