// v3 screen mocks: phone settings / incoming call, and a laptop (Windows) screen. The Caret T is always the pointer.
import { interpolate, useCurrentFrame, Easing } from "remotion";
import { C, clamp } from "./theme";
import { fontMono, fontSans } from "./fonts";
import { Finger } from "./visuals";
import type { Visual } from "./types";
import { LaptopBoot, LaptopSnip, LaptopTabs, PhoneScan, PhoneCircle, PhoneSnatch } from "./visuals3";
import { PhoneTaps, PhoneScales, PhoneSlowmo, PhoneCharge } from "./visuals4";
import { PhoneDim, PhoneLock, LaptopEmoji } from "./visuals5";
import { PhoneSpam, PhoneData, LaptopPasswords } from "./visuals6";
import { PhoneFlash, PhotoText, LaptopSnap } from "./visuals7";
import { PhonePrivacy, PhoneLevel, LaptopTabSearch } from "./visuals8";
import { PhoneGray, PhoneClip, LaptopNotifs } from "./visuals9";
import { LaptopWifiKey, PhoneShare, PhoneLoc, LaptopCorners } from "./visuals10";
import { PhoneBattery, PhoneReach, PhoneNight, PhoneTimer, LaptopNightLight, LaptopMacWifi, LaptopMemory, LaptopHotspot } from "./visuals11";
import { PhoneKeyFeel, PhoneStorage, PhonePct, PhoneLowPower, PhoneTrack, PhoneSummary, LaptopTranslate, LaptopWinDnd, LaptopMacFrozen, LaptopExplorer, LaptopTextAct } from "./visuals12";

const ease = Easing.inOut(Easing.cubic);
const PW = 620, PH = 1000;

function PhoneFrame({ children, label }: { children: React.ReactNode; label?: string }) {
  return <div style={{ position: "relative", width: PW, height: PH, borderRadius: 72, background: "#0e1428", border: "10px solid #2c3658", boxShadow: "0 40px 100px rgba(0,0,0,.55)", overflow: "hidden" }}>
    <div style={{ position: "absolute", top: 18, left: PW / 2 - 70, width: 140, height: 34, borderRadius: 20, background: "#000" }} />
    {label && <div style={{ position: "absolute", top: 82, left: 34, fontFamily: fontMono, fontSize: 26, color: C.mut }}>{label}</div>}
    {children}
  </div>;
}

function Switch({ on }: { on: number }) {
  return <div style={{ width: 96, height: 56, borderRadius: 28, background: on > 0.5 ? C.acc : "#3a4566", position: "relative", transition: "none" }}>
    <div style={{ position: "absolute", top: 5, left: 5 + on * 40, width: 46, height: 46, borderRadius: 23, background: "#fff" }} /></div>;
}

export function PhoneSettings({ v, dur }: { v: Extract<Visual, { type: "phone-settings" }>; dur: number }) {
  const f = useCurrentFrame();
  const p = (a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: ease });
  if (v.mode === "circle" || v.mode === "screenshot") return <PhoneCircle dur={dur} mode={v.mode} />;
  if (v.mode === "scan") return <PhoneScan v={v} dur={dur} />;
  if (v.mode === "snatch") return <PhoneSnatch v={v} dur={dur} />;
  if (v.mode === "taps") return <PhoneTaps v={v} dur={dur} />;
  if (v.mode === "scales") return <PhoneScales v={v} dur={dur} />;
  if (v.mode === "slowmo") return <PhoneSlowmo v={v} dur={dur} />;
  if (v.mode === "charge") return <PhoneCharge v={v} dur={dur} />;
  if (v.mode === "dim") return <PhoneDim v={v} dur={dur} />;
  if (v.mode === "lock") return <PhoneLock v={v} dur={dur} />;
  if (v.mode === "spam") return <PhoneSpam v={v} dur={dur} />;
  if (v.mode === "data") return <PhoneData v={v} dur={dur} />;
  if (v.mode === "flash") return <PhoneFlash v={v} dur={dur} />;
  if (v.mode === "photo") return <PhotoText v={v} dur={dur} />;
  if (v.mode === "privacy") return <PhonePrivacy v={v} dur={dur} />;
  if (v.mode === "level") return <PhoneLevel v={v} dur={dur} />;
  if (v.mode === "gray") return <PhoneGray v={v} dur={dur} />;
  if (v.mode === "clip") return <PhoneClip v={v} dur={dur} />;
  if (v.mode === "share") return <PhoneShare v={v} dur={dur} />;
  if (v.mode === "loc") return <PhoneLoc v={v} dur={dur} />;
  if (v.mode === "battery") return <PhoneBattery v={v} dur={dur} />;
  if (v.mode === "reach") return <PhoneReach v={v} dur={dur} />;
  if (v.mode === "night") return <PhoneNight v={v} dur={dur} />;
  if (v.mode === "timer") return <PhoneTimer v={v} dur={dur} />;
  if (v.mode === "keyfeel") return <PhoneKeyFeel v={v} dur={dur} />;
  if (v.mode === "storage") return <PhoneStorage v={v} dur={dur} />;
  if (v.mode === "pct") return <PhonePct v={v} dur={dur} />;
  if (v.mode === "lowpower") return <PhoneLowPower v={v} dur={dur} />;
  if (v.mode === "track") return <PhoneTrack v={v} dur={dur} />;
  if (v.mode === "summary") return <PhoneSummary v={v} dur={dur} />;
  if (v.mode === "call") { // incoming call that keeps ringing
    const ring = 1 + 0.06 * Math.sin(f / 3);
    return <PhoneFrame>
      <div style={{ position: "absolute", top: 170, width: "100%", textAlign: "center", fontFamily: fontSans, color: C.fg }}>
        <div style={{ fontSize: 30, color: C.mut }}>incoming call</div>
        <div style={{ fontSize: 58, fontWeight: 700, marginTop: 14 }}>{v.caller ?? "+1 (415) 555-0199"}</div>
        <div style={{ fontSize: 32, color: C.warn, marginTop: 10 }}>{v.note ?? "Potential spam"}</div>
      </div>
      <div style={{ position: "absolute", bottom: 150, left: 70, width: 130, height: 130, borderRadius: 65, background: C.warn, transform: `scale(${ring})` }} />
      <div style={{ position: "absolute", bottom: 150, right: 70, width: 130, height: 130, borderRadius: 65, background: C.acc, transform: `scale(${ring})` }} />
      <div style={{ position: "absolute", bottom: 90, width: "100%", textAlign: "center", fontFamily: fontMono, fontSize: 26, color: C.mut }}>{`missed calls today: ${3 + Math.floor(f / 25)}`}</div>
    </PhoneFrame>;
  }
  const rows = v.rows; const ti = Math.max(0, rows.indexOf(v.tap ?? rows[0]));
  const rowY = (i: number) => 230 + i * 104;
  const move = p(0, dur * 0.35); const press = interpolate(f, [dur * 0.38, dur * 0.44, dur * 0.52], [0, 1, 0], clamp);
  const done = p(dur * 0.44, dur * 0.5);
  const lift = v.toggle ? p(dur * 0.55, dur * 0.7) : 0; // after a toggle, move off the switch so it stays visible
  const fx = interpolate(move, [0, 1], [PW * 0.75, v.toggle ? PW - 110 : PW * 0.45]) - lift * 90; const fy = interpolate(move, [0, 1], [PH - 160, rowY(ti) + 46]) + lift * 100;
  return <PhoneFrame label={v.path.join(" › ")}>
    <div style={{ position: "absolute", top: 140, left: 34, fontFamily: fontSans, fontWeight: 700, fontSize: 52, color: C.fg }}>{v.path[v.path.length - 1]}</div>
    {rows.map((r, i) => { const hit = i === ti;
      return <div key={r} style={{ position: "absolute", top: rowY(i), left: 26, right: 26, height: 92, borderRadius: 22, padding: "0 28px", display: "flex", alignItems: "center", justifyContent: "space-between",
        background: hit && done > 0.5 ? "rgba(62,224,160,.16)" : C.panel, border: hit && done > 0.5 ? `3px solid ${C.acc}` : "3px solid transparent", fontFamily: fontSans, fontSize: 36, color: C.fg }}>
        <span>{hit && v.reveal ? (done > 0.5 ? v.reveal : "Password") : r}</span>
        {hit && v.toggle ? <Switch on={v.toggleOff ? 1 - done : done} /> : hit && v.reveal ? <span style={{ fontFamily: fontMono, color: done > 0.5 ? C.acc : C.mut, fontSize: 34 }}>{done > 0.5 ? "copy" : "••••••••"}</span> : <span style={{ color: C.mut }}>›</span>}
      </div>; })}
    <Finger x={fx} y={fy} press={press} show={p(0, 6)} />
  </PhoneFrame>;
}

/* ---------- Laptop (Windows 11) ---------- */
const LW = 940, LH = 600;
export function Laptop({ v, dur }: { v: Extract<Visual, { type: "laptop" }>; dur: number }) {
  const f = useCurrentFrame();
  if (v.action === "tabs") return <LaptopTabs v={v} dur={dur} />;
  if (v.action === "snip") return <LaptopSnip v={v} dur={dur} />;
  if (v.action === "boot") return <LaptopBoot v={v} dur={dur} />;
  if (v.action === "emoji") return <LaptopEmoji v={v} dur={dur} />;
  if (v.action === "passwords") return <LaptopPasswords v={v} dur={dur} />;
  if (v.action === "snap") return <LaptopSnap v={v} dur={dur} />;
  if (v.action === "tabsearch") return <LaptopTabSearch v={v} dur={dur} />;
  if (v.action === "notifs") return <LaptopNotifs v={v} dur={dur} />;
  if (v.action === "wifikey") return <LaptopWifiKey v={v} dur={dur} />;
  if (v.action === "corners") return <LaptopCorners v={v} dur={dur} />;
  if (v.action === "nightlight") return <LaptopNightLight v={v} dur={dur} />;
  if (v.action === "macwifi") return <LaptopMacWifi v={v} dur={dur} />;
  if (v.action === "memory") return <LaptopMemory v={v} dur={dur} />;
  if (v.action === "hotspot") return <LaptopHotspot v={v} dur={dur} />;
  if (v.action === "translate") return <LaptopTranslate v={v} dur={dur} />;
  if (v.action === "windnd") return <LaptopWinDnd v={v} dur={dur} />;
  if (v.action === "macfrozen") return <LaptopMacFrozen v={v} dur={dur} />;
  if (v.action === "explorer") return <LaptopExplorer v={v} dur={dur} />;
  if (v.action === "textact") return <LaptopTextAct v={v} dur={dur} />;
  if (v.action === "frozen" || v.action === "settings" || v.action === "taskbar") return <LaptopApps v={v} dur={dur} />;
  const p = (a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: ease });
  const items = v.items ?? ["Meeting moved to 3pm", "https://techtipaday.com", "Flight AB123, seat 14C", "Invoice #4471"];
  let doc = "Notes:\n"; let toast = ""; let panel = 0; let keys = 0; let pick = -1; let fx = LW * 0.7, fy = LH * 0.8, press = 0, show = 0;
  switch (v.action) {
    case "overwrite": { // copies keep replacing each other
      const k = Math.min(items.length - 1, Math.floor((f / Math.max(dur, 1)) * items.length));
      toast = `Copied: "${items[k]}"`; doc = `Notes:\nPasted: ${items[k]}\n\n(the earlier copies are gone)`; break; }
    case "keys": keys = p(4, 14); panel = p(dur * 0.4, dur * 0.55); break;
    case "panel": panel = 1; show = 1; fx = interpolate(p(0, dur * 0.5), [0, 1], [LW * 0.3, LW - 210]); fy = interpolate(p(0, dur * 0.5), [0, 1], [LH * 0.8, 150 + 2 * 78]);
      press = interpolate(f, [dur * 0.55, dur * 0.6, dur * 0.68], [0, 1, 0], clamp); pick = f > dur * 0.6 ? 2 : -1; if (pick >= 0) doc = `Notes:\n${items[2]}`; break;
    case "paste": doc = `Notes:\n${items.slice(0, Math.max(1, Math.ceil(p(0, dur * 0.8) * items.length))).join("\n")}`; break;
  }
  return <div style={{ width: LW + 80, display: "flex", flexDirection: "column", alignItems: "center" }}>
    <div style={{ position: "relative", width: LW, height: LH, borderRadius: 26, border: "12px solid #2c3658", background: "#0f1730", overflow: "hidden", boxShadow: "0 40px 100px rgba(0,0,0,.55)" }}>
      <div style={{ height: 44, background: "#1a2340", display: "flex", alignItems: "center", padding: "0 20px", fontFamily: fontMono, fontSize: 22, color: C.mut }}>Notepad · Windows 11</div>
      <div style={{ padding: "24px 30px", fontFamily: fontSans, fontSize: 32, lineHeight: 1.4, color: C.fg, whiteSpace: "pre-wrap" }}>{doc}<span style={{ display: "inline-block", width: 4, height: 34, background: C.acc, verticalAlign: "-6px", opacity: f % 24 < 14 ? 1 : 0 }} /></div>
      {toast && <div style={{ position: "absolute", bottom: 70, left: 30, right: 30, padding: "16px 22px", borderRadius: 14, background: "rgba(255,107,107,.18)", border: `2px solid ${C.warn}`, fontFamily: fontMono, fontSize: 24, color: C.fg }}>{toast}</div>}
      {panel > 0 && <div style={{ position: "absolute", top: 60, right: 24, width: 400, borderRadius: 18, background: "#1c2440", border: "2px solid #3a4670", padding: 14, opacity: panel, transform: `scale(${0.85 + 0.15 * panel})`, transformOrigin: "100% 0" }}>
        <div style={{ fontFamily: fontMono, fontSize: 20, color: C.acc, marginBottom: 8 }}>CLIPBOARD HISTORY</div>
        {items.map((it, i) => <div key={i} style={{ padding: "14px 16px", marginBottom: 8, borderRadius: 12, background: i === pick ? "rgba(62,224,160,.25)" : "#232c4a", border: i === pick ? `2px solid ${C.acc}` : "2px solid transparent", fontFamily: fontSans, fontSize: 22, color: C.fg, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{it}</div>)}
      </div>}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 44, background: "#141c36", display: "flex", justifyContent: "center", alignItems: "center", gap: 14 }}>
        {[0, 1, 2, 3, 4].map((i) => <div key={i} style={{ width: 26, height: 26, borderRadius: 6, background: i === 0 ? "#4da3ff" : "#2f3a5e" }} />)}
      </div>
      {show > 0 && <div style={{ position: "absolute", left: 0, top: 0, width: LW, height: LH }}><Finger x={fx} y={fy} press={press} show={show} /></div>}
    </div>
    <div style={{ width: LW + 100, height: 26, borderRadius: "0 0 30px 30px", background: "#2c3658" }} />
    {(v.action === "keys" || v.action === "overwrite") && <div style={{ display: "flex", gap: 22, marginTop: 50, alignItems: "center" }}>
      {(v.action === "keys" ? ["⊞ Win", "V"] : ["Ctrl", "C"]).map((k, i) => <div key={k} style={{ display: "flex", alignItems: "center", gap: 22 }}>{i > 0 && <span style={{ color: C.mut, fontSize: 56, fontFamily: fontSans }}>+</span>}
        <div style={{ padding: "26px 40px", borderRadius: 22, background: (v.action === "keys" ? keys : (f % 30 < 8 ? 1 : 0)) > 0.5 ? C.acc : C.key, color: (v.action === "keys" ? keys : (f % 30 < 8 ? 1 : 0)) > 0.5 ? C.bg : C.fg,
          fontFamily: fontSans, fontWeight: 700, fontSize: 54, boxShadow: "0 10px 0 #0a0f1e" }}>{k}</div></div>)}
    </div>}
  </div>;
}

/* Laptop screens for a frozen app, Windows Settings rows and the taskbar End task menu. */
function Spinner({ x, y, size = 70 }: { x: number; y: number; size?: number }) {
  const f = useCurrentFrame();
  return <div style={{ position: "absolute", left: x - size / 2, top: y - size / 2, width: size, height: size, borderRadius: size / 2,
    border: `8px solid rgba(255,255,255,.18)`, borderTopColor: "#4da3ff", transform: `rotate(${f * 14}deg)` }} />;
}
function FrozenApp({ app, fade = 0 }: { app: string; fade?: number }) {
  const f = useCurrentFrame();
  return <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 56, opacity: 1 - fade, transform: `scale(${1 - 0.08 * fade})` }}>
    <div style={{ height: 44, background: "#1a2340", display: "flex", alignItems: "center", padding: "0 20px", fontFamily: fontMono, fontSize: 22, color: C.warn }}>{`Budget.xlsx · ${app} (Not Responding)`}</div>
    <div style={{ position: "absolute", top: 44, left: 0, right: 0, bottom: 0, backgroundImage: "repeating-linear-gradient(0deg, #2a3456 0 2px, transparent 2px 46px), repeating-linear-gradient(90deg, #2a3456 0 2px, transparent 2px 150px)" }} />
    <div style={{ position: "absolute", top: 44, left: 0, right: 0, bottom: 0, background: "rgba(238,241,248,.16)" }} />
    <div style={{ position: "absolute", top: 200, left: 0, right: 0, textAlign: "center", fontFamily: fontSans, fontWeight: 700, fontSize: 34, color: C.fg, opacity: 0.7 + 0.3 * Math.sin(f / 5) }}>Not Responding</div>
    <Spinner x={LW / 2} y={320} />
  </div>;
}
function LaptopApps({ v, dur }: { v: Extract<Visual, { type: "laptop" }>; dur: number }) {
  const f = useCurrentFrame();
  const p = (a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: ease });
  const app = v.app ?? "Excel";
  const icons = 5, iconW = 38, gap = 18, appIdx = 2;
  const iconX = (i: number) => (LW - (icons * iconW + (icons - 1) * gap)) / 2 + i * (iconW + gap) + iconW / 2;
  let screen: React.ReactNode = null; let fx = LW * 0.75, fy = LH * 0.8, press = 0, show = 0; let below: React.ReactNode = null;
  if (v.action === "frozen") {
    screen = <FrozenApp app={app} />;
    const hit = f % 18 < 6 ? 1 : 0;
    below = <div style={{ display: "flex", gap: 18, marginTop: 50, alignItems: "center" }}>
      {["Ctrl", "Alt", "Delete"].map((k, i) => <div key={k} style={{ display: "flex", alignItems: "center", gap: 18 }}>{i > 0 && <span style={{ color: C.mut, fontSize: 56, fontFamily: fontSans }}>+</span>}
        <div style={{ padding: "24px 34px", borderRadius: 22, background: hit ? C.warn : C.key, color: hit ? C.bg : C.fg, fontFamily: fontSans, fontWeight: 700, fontSize: 50, boxShadow: `0 ${hit ? 4 : 10}px 0 #0a0f1e`, transform: `translateY(${hit ? 6 : 0}px)` }}>{k}</div></div>)}
    </div>;
  } else if (v.action === "settings") {
    const rows = v.rows ?? ["System"]; const ti = Math.max(0, rows.indexOf(v.tap ?? rows[0]));
    const rowY = (i: number) => 150 + i * 88;
    const move = p(0, dur * 0.35); press = interpolate(f, [dur * 0.38, dur * 0.44, dur * 0.52], [0, 1, 0], clamp); const done = p(dur * 0.44, dur * 0.5);
    const lift = v.toggle ? p(dur * 0.55, dur * 0.7) : 0; // move off the switch after the toggle
    show = p(0, 6); fx = interpolate(move, [0, 1], [LW * 0.7, v.toggle ? LW - 110 : LW * 0.45]) - lift * 110; fy = interpolate(move, [0, 1], [LH - 90, rowY(ti) + 38]) + lift * 90;
    const path = v.path ?? ["Settings"];
    screen = <>
      <div style={{ height: 44, background: "#1a2340", display: "flex", alignItems: "center", padding: "0 20px", fontFamily: fontMono, fontSize: 22, color: C.mut }}>{`${v.app ?? "Settings"} · ${path.join(" › ")}`}</div>
      <div style={{ position: "absolute", top: 66, left: 34, fontFamily: fontSans, fontWeight: 700, fontSize: 44, color: C.fg }}>{path[path.length - 1]}</div>
      {rows.map((r, i) => { const hit = i === ti;
        return <div key={r} style={{ position: "absolute", top: rowY(i), left: 26, right: 26, height: 76, borderRadius: 16, padding: "0 26px", display: "flex", alignItems: "center", justifyContent: "space-between",
          background: hit && done > 0.5 ? "rgba(62,224,160,.16)" : C.panel, border: hit && done > 0.5 ? `3px solid ${C.acc}` : "3px solid transparent", fontFamily: fontSans, fontSize: 32, color: C.fg }}>
          <span>{r}</span>{hit && v.toggle ? <Switch on={v.toggleOff ? 1 - done : done} /> : <span style={{ color: C.mut }}>›</span>}</div>; })}
    </>;
  } else { // taskbar: right-click the app icon, pick End task, the frozen window disappears
    const items = [app, "Pin to taskbar", "Close window", "End task"];
    const toIcon = p(0, dur * 0.25); const menu = p(dur * 0.3, dur * 0.38); const toEnd = p(dur * 0.42, dur * 0.58); const gone = p(dur * 0.66, dur * 0.76);
    const mx = iconX(appIdx) - 40, menuBottom = 74, itemH = 58, menuTop = LH - menuBottom - items.length * itemH - 20;
    show = 1;
    fx = interpolate(toIcon, [0, 1], [LW * 0.72, iconX(appIdx) + 10]); fy = interpolate(toIcon, [0, 1], [LH * 0.55, LH - 44]);
    if (toEnd > 0) { fx = interpolate(toEnd, [0, 1], [iconX(appIdx) + 10, mx + 130]); fy = interpolate(toEnd, [0, 1], [LH - 44, menuTop + 10 + 3 * itemH + itemH / 2]); }
    press = Math.max(interpolate(f, [dur * 0.24, dur * 0.28, dur * 0.34], [0, 1, 0], clamp), interpolate(f, [dur * 0.6, dur * 0.64, dur * 0.7], [0, 1, 0], clamp));
    const picked = f > dur * 0.62;
    screen = <>
      {gone < 1 && <FrozenApp app={app} fade={gone} />}
      {gone > 0 && <div style={{ position: "absolute", top: 150, left: 0, right: 0, textAlign: "center", fontFamily: fontSans, fontWeight: 700, fontSize: 40, color: C.acc, opacity: gone }}>{`${app} closed`}</div>}
      {menu > 0 && gone < 1 && <div style={{ position: "absolute", left: mx - 120, top: menuTop, width: 360, borderRadius: 16, background: "#1c2440", border: "2px solid #3a4670", padding: 10,
        opacity: menu * (1 - gone), transform: `scale(${0.85 + 0.15 * menu})`, transformOrigin: "50% 100%" }}>
        {items.map((it, i) => { const end = i === items.length - 1;
          return <div key={it} style={{ height: itemH - 6, marginBottom: 6, borderRadius: 10, padding: "0 18px", display: "flex", alignItems: "center", fontFamily: fontSans, fontSize: 28,
            color: end ? C.warn : C.fg, fontWeight: end ? 700 : 400, background: end && (picked || toEnd > 0.9) ? "rgba(255,107,107,.22)" : i === 0 ? "transparent" : "#232c4a", border: end && picked ? `2px solid ${C.warn}` : "2px solid transparent" }}>{it}</div>; })}
      </div>}
    </>;
  }
  const bar = v.action === "taskbar";
  // 40px lower than the Notepad mock so a four-line hook clears the screen edge
  return <div style={{ width: LW + 80, display: "flex", flexDirection: "column", alignItems: "center", marginTop: 40 }}>
    <div style={{ position: "relative", width: LW, height: LH, borderRadius: 26, border: "12px solid #2c3658", background: "#0f1730", overflow: "hidden", boxShadow: "0 40px 100px rgba(0,0,0,.55)" }}>
      {screen}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 56, background: "#141c36", display: "flex", justifyContent: "center", alignItems: "center", gap }}>
        {Array.from({ length: icons }, (_, i) => <div key={i} style={{ width: iconW, height: iconW, borderRadius: 8, background: i === 0 ? "#4da3ff" : i === appIdx ? (app === "Chrome" ? "#e8a33d" : app === "Excel" ? "#21a366" : "#2f3a5e") : "#2f3a5e",
          boxShadow: bar && i === appIdx ? `0 0 0 3px ${C.acc}` : "none", fontFamily: fontSans, fontWeight: 800, fontSize: 24, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>{i === appIdx && app === "Excel" ? "X" : ""}</div>)}
      </div>
      {show > 0 && <div style={{ position: "absolute", left: 0, top: 0, width: LW, height: LH }}><Finger x={fx} y={fy} press={press} show={show} /></div>}
    </div>
    <div style={{ width: LW + 100, height: 26, borderRadius: "0 0 30px 30px", background: "#2c3658" }} />
    {below}
  </div>;
}
