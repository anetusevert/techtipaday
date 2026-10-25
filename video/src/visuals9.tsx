// More v3 mocks: an iPhone home screen that goes grayscale (and back with a triple-click), the Gboard clipboard
// that keeps your last copies, and Chrome notification spam with the permission prompt. The Caret T is always the pointer.
import { interpolate, useCurrentFrame, Easing } from "remotion";
import { C, clamp } from "./theme";
import { fontMono, fontSans } from "./fonts";
import { Finger } from "./visuals";
import type { Visual } from "./types";

const ease = Easing.inOut(Easing.cubic);
const PW = 620, PH = 1000, LW = 940, LH = 600;
type PhoneV = Extract<Visual, { type: "phone-settings" }>;
type LaptopV = Extract<Visual, { type: "laptop" }>;
const BLUE = "#4da3ff";

function Frame({ children, label, bg = "#0e1428", filter }: { children: React.ReactNode; label?: string; bg?: string; filter?: string }) {
  return <div style={{ position: "relative", width: PW, height: PH, borderRadius: 72, background: bg, border: "10px solid #2c3658", boxShadow: "0 40px 100px rgba(0,0,0,.55)", overflow: "hidden" }}>
    <div style={{ position: "absolute", top: 18, left: PW / 2 - 70, width: 140, height: 34, borderRadius: 20, background: "#000", zIndex: 5 }} />
    {label && <div style={{ position: "absolute", top: 82, left: 34, fontFamily: fontMono, fontSize: 26, color: C.mut }}>{label}</div>}
    <div style={{ position: "absolute", inset: 0, filter }}>{children}</div>
  </div>;
}
function Note({ text, good }: { text: string; good: boolean }) {
  return <div style={{ position: "absolute", bottom: 60, left: 30, right: 30, padding: "18px 22px", borderRadius: 18, textAlign: "center", zIndex: 6,
    background: good ? "rgba(62,224,160,.18)" : "rgba(255,107,107,.18)", border: `2px solid ${good ? C.acc : C.warn}`, fontFamily: fontMono, fontSize: 28, color: C.fg }}>{text}</div>;
}

const APPS: [string, string, number][] = [["#ff2d55", "♥", 12], ["#e1306c", "◎", 38], ["#ff0000", "▶", 7], ["#25d366", "✆", 21], ["#1877f2", "f", 9], ["#000000", "♪", 64], ["#ffcc00", "✉", 3], ["#ff9500", "★", 0],
  ["#5856d6", "◆", 0], ["#34c759", "$", 2], ["#af52de", "✦", 15], ["#ff3b30", "●", 99], ["#0a84ff", "✈", 0], ["#ff6b00", "⌂", 5], ["#30b0c7", "☁", 0], ["#bf5af2", "♫", 4]];
function HomeGrid({ wiggle = 0 }: { wiggle?: number }) {
  const f = useCurrentFrame();
  return <div style={{ position: "absolute", top: 110, left: 40, right: 40, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", rowGap: 46, columnGap: 30 }}>
    {APPS.map(([c, g, badge], i) => <div key={i} style={{ position: "relative", width: 112, height: 112, borderRadius: 28, background: c, display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: fontSans, fontWeight: 800, fontSize: 54, color: "#fff", boxShadow: `0 8px 24px ${c}66`, transform: `scale(${1 + wiggle * 0.04 * Math.sin(f / 4 + i)})` }}>{g}
      {badge > 0 && <div style={{ position: "absolute", top: -12, right: -12, minWidth: 44, height: 44, borderRadius: 22, padding: "0 10px", background: "#ff3b30", border: "3px solid #0e1428",
        fontFamily: fontSans, fontSize: 24, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{badge + Math.floor(f / 20) * (i % 3 === 0 ? 1 : 0)}</div>}
    </div>)}
  </div>;
}

/** mode "gray" (iPhone). (no reveal) a loud home screen, badges ticking up, the pointer keeps opening apps
 *  | "on" the same screen fades to grayscale | "triple" the side button is pressed three times and colour flips back. */
export function PhoneGray({ v, dur }: { v: PhoneV; dur: number }) {
  const f = useCurrentFrame();
  const p = (a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: ease });
  const r = v.reveal;
  if (!r) {
    const cyc = f % 30; const target = Math.floor(f / 30) % 4; const tgt = [1, 5, 2, 11][target];
    const fx = 40 + (tgt % 4) * 142 + 56, fy = 110 + Math.floor(tgt / 4) * 158 + 56;
    const press = interpolate(cyc, [12, 16, 22], [0, 1, 0], clamp);
    return <Frame>
      <HomeGrid wiggle={1} />
      <Finger x={fx} y={fy} press={press} show={p(0, 6)} />
      <Note text={v.note ?? "Just one more scroll…"} good={false} />
    </Frame>;
  }
  if (r === "on") {
    const g = p(dur * 0.15, dur * 0.55);
    return <Frame filter={`grayscale(${g})`}>
      <HomeGrid />
      {g > 0.9 && <Note text={v.note ?? "Grayscale on. Way less shiny."} good />}
    </Frame>;
  }
  // triple: three presses on the side button, colour comes back, then gray again
  const presses = [0.15, 0.24, 0.33].map((t) => interpolate(f, [dur * t, dur * t + 3, dur * t + 7], [0, 1, 0], clamp));
  const press = Math.max(...presses);
  const colour = f > dur * 0.36 && f < dur * 0.72;
  const count = presses.filter((_, i) => f > dur * [0.15, 0.24, 0.33][i]).length;
  return <div style={{ position: "relative", width: PW + 40, height: PH }}>
    <Frame filter={colour ? "none" : "grayscale(1)"}>
      <HomeGrid />
      <div style={{ position: "absolute", top: 130 + 4 * 158, left: 30, right: 30, textAlign: "center", fontFamily: fontMono, fontSize: 30, color: C.fg, zIndex: 6 }}>{count > 0 ? `click ×${count}` : "triple-click the side button"}</div>
      <Note text={colour ? "Colour back for the photo" : "Gray again. Done."} good />
    </Frame>
    <div style={{ position: "absolute", left: PW - 4, top: 240, width: 24 - press * 8, height: 150, borderRadius: 8, background: press > 0.3 ? C.acc : "#3a4566", boxShadow: press > 0.3 ? `0 0 30px ${C.acc}` : "none" }} />
  </div>;
}

/** mode "clip" (Android, Gboard). (no reveal) copy a code, copy an address, the code is gone
 *  | "icon" the keyboard toolbar with the clipboard icon pulsing | "panel" tap it, recent copies appear
 *  | "paste" tap the code, it lands in the box | "pin" hold a clip and pin it. */
export function PhoneClip({ v, dur }: { v: PhoneV; dur: number }) {
  const f = useCurrentFrame();
  const p = (a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: ease });
  const r = v.reveal;
  const clips = ["12 Elm Street, Flat 3", "482913", "https://shop.example.com/order", "See you at 7"];
  const kbTop = 520;
  const field = (text: string, good = false) => <div style={{ position: "absolute", top: 300, left: 30, right: 30, padding: "22px 24px", borderRadius: 18, background: C.panel, border: `3px solid ${good ? C.acc : "#3a4566"}`, fontFamily: fontSans, fontSize: 34, color: text ? C.fg : C.mut }}>
    {text || "Enter code"}<span style={{ display: "inline-block", width: 3, height: 36, marginLeft: 3, background: BLUE, verticalAlign: "-6px", opacity: f % 24 < 14 ? 1 : 0 }} /></div>;
  const head = <div style={{ position: "absolute", top: 140, left: 34, fontFamily: fontSans, fontWeight: 700, fontSize: 46, color: C.fg }}>Verify your login</div>;
  if (!r) {
    const step = f < dur * 0.4 ? 0 : 1;
    return <Frame>
      {head}{field(f > dur * 0.65 ? "12 Elm Street, Flat 3" : "")}
      <div style={{ position: "absolute", top: 450, left: 30, right: 30, padding: "16px 20px", borderRadius: 14, background: "#1c2440", border: `2px solid ${BLUE}`, fontFamily: fontMono, fontSize: 26, color: C.fg, opacity: p(4, 10) }}>
        {step === 0 ? "Copied: 482913" : "Copied: 12 Elm Street, Flat 3"}</div>
      {f > dur * 0.65 && <Note text={v.note ?? "Wait, where did the code go?"} good={false} />}
    </Frame>;
  }
  const icons = ["☺", "📋", "⚙", "G", "🎙"]; const iconX = (i: number) => 40 + i * 110 + 40;
  const panel = r === "icon" ? 0 : r === "panel" ? p(dur * 0.4, dur * 0.52) : 1;
  let fx = PW * 0.7, fy = PH - 120, press = 0, show = p(0, 6), pasted = "", pinned = false, menu = 0;
  if (r === "icon") show = 0;
  if (r === "panel") { const m = p(0, dur * 0.32); fx = interpolate(m, [0, 1], [PW * 0.7, iconX(1)]); fy = interpolate(m, [0, 1], [PH - 120, kbTop + 40]); press = interpolate(f, [dur * 0.34, dur * 0.4, dur * 0.48], [0, 1, 0], clamp); }
  const chipY = (i: number) => kbTop + 110 + i * 86;
  if (r === "paste") { const m = p(0, dur * 0.35); fx = interpolate(m, [0, 1], [PW * 0.7, PW * 0.4]); fy = interpolate(m, [0, 1], [PH - 120, chipY(1) + 36]); press = interpolate(f, [dur * 0.38, dur * 0.44, dur * 0.52], [0, 1, 0], clamp); if (f > dur * 0.44) pasted = "482913"; }
  if (r === "pin") { const m = p(0, dur * 0.3); fx = interpolate(m, [0, 1], [PW * 0.7, PW * 0.4]); fy = interpolate(m, [0, 1], [PH - 120, chipY(1) + 36]); press = f > dur * 0.32 && f < dur * 0.6 ? 1 : 0; menu = p(dur * 0.45, dur * 0.55); pinned = f > dur * 0.68; pasted = "482913"; }
  const pulse = r === "icon" ? 0.5 + 0.5 * Math.sin(f / 4) : 0;
  return <Frame>
    {head}{field(pasted, !!pasted)}
    <div style={{ position: "absolute", top: kbTop, left: 0, right: 0, bottom: 0, background: "#1a2138", borderTop: "2px solid #2c3658" }}>
      <div style={{ display: "flex", height: 80, alignItems: "center" }}>
        {icons.map((ic, i) => <div key={i} style={{ position: "absolute", left: iconX(i) - 34, top: 6, width: 68, height: 68, borderRadius: 34, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, color: C.fg, fontFamily: fontSans,
          background: i === 1 && (panel > 0.5 || pulse > 0) ? `rgba(62,224,160,${panel > 0.5 ? 0.3 : 0.15 + 0.3 * pulse})` : "transparent", border: i === 1 && r === "icon" ? `3px solid ${C.acc}` : "3px solid transparent" }}>{ic}</div>)}
      </div>
      {panel < 1 && Array.from({ length: 3 }, (_, row) => <div key={row} style={{ display: "flex", gap: 10, padding: "10px 20px", justifyContent: "center", opacity: 1 - panel }}>
        {Array.from({ length: 10 - row }, (_, k) => <div key={k} style={{ width: 48, height: 66, borderRadius: 10, background: C.key, color: C.fg, fontFamily: fontSans, fontSize: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>{"qwertyuiopasdfghjklzxcvbnm"[[0, 10, 19][row] + k] ?? ""}</div>)}
      </div>)}
      {panel > 0 && <div style={{ position: "absolute", top: 90, left: 20, right: 20, opacity: panel }}>
        <div style={{ fontFamily: fontMono, fontSize: 22, color: C.acc, marginBottom: 12 }}>CLIPBOARD · last hour</div>
        {clips.map((c, i) => { const hit = i === 1 && (r === "paste" || r === "pin") && f > dur * 0.4;
          return <div key={c} style={{ position: "relative", height: 74, marginBottom: 12, borderRadius: 14, padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", fontFamily: fontSans, fontSize: 28, color: C.fg,
            background: hit ? "rgba(62,224,160,.2)" : "#232c4a", border: hit ? `2px solid ${C.acc}` : "2px solid transparent", whiteSpace: "nowrap", overflow: "hidden" }}>
            <span>{c}</span>{i === 1 && pinned && <span style={{ fontSize: 28, color: C.acc }}>📌</span>}</div>; })}
      </div>}
      {menu > 0 && !pinned && <div style={{ position: "absolute", top: 90 + 34 + 86 + 60, left: PW * 0.45, width: 200, borderRadius: 14, background: "#2a3354", border: "2px solid #4a5680", opacity: menu, fontFamily: fontSans, fontSize: 28, color: C.fg, zIndex: 4 }}>
        {["Pin", "Delete"].map((m, i) => <div key={m} style={{ padding: "14px 20px", color: i === 0 ? C.acc : C.fg, fontWeight: i === 0 ? 700 : 400 }}>{m}</div>)}
      </div>}
    </div>
    {r === "pin" && pinned && <Note text="Pinned. It stays past the hour." good />}
    {r === "paste" && pasted && <Note text="Code's back. Pasted." good />}
    <Finger x={fx} y={fy} press={press} show={show} />
  </Frame>;
}

/** action "notifs" (Chrome on a laptop). mode "spam" junk notifications pile up in the corner
 *  | "prompt" a site asks to show notifications and the pointer clicks Block | "quiet" the desktop with nothing popping up. */
export function LaptopNotifs({ v, dur }: { v: LaptopV; dur: number }) {
  const f = useCurrentFrame();
  const p = (a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: ease });
  const mode = v.mode ?? "spam";
  const junk = ["🎁 You've won a new iPhone!", "⚠ Your PC may be infected", "🔥 Hot singles near you", "💸 Claim your refund now", "📰 You won't believe this"];
  const shown = mode === "spam" ? Math.min(junk.length, 1 + Math.floor(f / Math.max(6, dur / 6))) : 0;
  let fx = LW * 0.6, fy = LH * 0.7, press = 0, show = 0;
  const blocked = mode === "prompt" && f > dur * 0.5;
  if (mode === "prompt") { show = p(0, 6); const m = p(0, dur * 0.4); fx = interpolate(m, [0, 1], [LW * 0.6, 30 + 300]); fy = interpolate(m, [0, 1], [LH * 0.75, 132 + 140]); press = interpolate(f, [dur * 0.42, dur * 0.48, dur * 0.56], [0, 1, 0], clamp); }
  const promptO = mode === "prompt" ? p(2, 10) * (1 - p(dur * 0.55, dur * 0.65)) : 0;
  return <div style={{ width: LW + 80, display: "flex", flexDirection: "column", alignItems: "center", marginTop: 40 }}>
    <div style={{ position: "relative", width: LW, height: LH, borderRadius: 26, border: "12px solid #2c3658", background: "#0f1730", overflow: "hidden", boxShadow: "0 40px 100px rgba(0,0,0,.55)" }}>
      <div style={{ height: 50, background: "#141c36", display: "flex", alignItems: "flex-end", padding: "0 20px", gap: 6 }}>
        <div style={{ width: 220, height: 40, borderRadius: "10px 10px 0 0", background: "#26304f", fontFamily: fontSans, fontSize: 20, color: C.fg, display: "flex", alignItems: "center", padding: "0 14px" }}>{mode === "quiet" ? "Inbox" : "Daily News Now"}</div>
      </div>
      <div style={{ position: "absolute", top: 62, left: 30, right: 30, padding: "12px 20px", borderRadius: 12, background: "#1c2440", fontFamily: fontMono, fontSize: 22, color: C.mut }}>{mode === "quiet" ? "https://mail.example.com" : "https://daily-news-now.example"}</div>
      {[0, 1, 2, 3].map((i) => <div key={i} style={{ position: "absolute", top: 150 + i * 56, left: 30, width: [820, 640, 720, 560][i], height: 26, borderRadius: 8, background: "#232c4a" }} />)}
      {promptO > 0 && <div style={{ position: "absolute", top: 118, left: 30, width: 460, padding: 22, borderRadius: 16, background: "#1c2440", border: `2px solid ${BLUE}`, opacity: promptO, zIndex: 5 }}>
        <div style={{ fontFamily: fontSans, fontSize: 26, color: C.fg }}>daily-news-now.example wants to</div>
        <div style={{ fontFamily: fontSans, fontSize: 26, color: C.fg, marginTop: 6 }}>🔔 Show notifications</div>
        <div style={{ display: "flex", gap: 16, marginTop: 20, justifyContent: "flex-end" }}>
          <div style={{ padding: "12px 26px", borderRadius: 22, border: `2px solid ${blocked || press > 0.3 ? C.acc : "#4a5680"}`, background: blocked || press > 0.3 ? "rgba(62,224,160,.25)" : "transparent", fontFamily: fontSans, fontSize: 26, color: C.fg, fontWeight: 700 }}>Block</div>
          <div style={{ padding: "12px 26px", borderRadius: 22, background: "#2a3354", fontFamily: fontSans, fontSize: 26, color: C.mut }}>Allow</div>
        </div>
      </div>}
      {mode === "spam" && junk.slice(0, shown).map((j, i) => { const o = interpolate(f, [i * Math.max(6, dur / 6), i * Math.max(6, dur / 6) + 6], [0, 1], clamp);
        return <div key={j} style={{ position: "absolute", right: 24, bottom: 70 + (shown - 1 - i) * 82, width: 430, height: 72, borderRadius: 14, background: "#222b48", border: "2px solid #3a4670", padding: "0 18px", display: "flex", alignItems: "center", gap: 12,
          fontFamily: fontSans, fontSize: 24, color: C.fg, opacity: o, transform: `translateX(${(1 - o) * 120}px)`, boxShadow: "0 10px 30px rgba(0,0,0,.4)" }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: "#e8a33d", flex: "none" }} /><span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{j}</span></div>; })}
      {mode === "spam" && f > dur * 0.6 && <div style={{ position: "absolute", top: 150, left: 30, padding: "14px 20px", borderRadius: 14, background: "rgba(255,107,107,.18)", border: `2px solid ${C.warn}`, fontFamily: fontSans, fontSize: 28, color: C.fg }}>{v.items?.[0] ?? "Where are these coming from?"}</div>}
      {(blocked || mode === "quiet") && <div style={{ position: "absolute", bottom: 80, left: 30, right: 30, padding: "16px 22px", borderRadius: 14, background: "rgba(62,224,160,.18)", border: `2px solid ${C.acc}`, fontFamily: fontSans, fontSize: 28, color: C.fg, opacity: mode === "quiet" ? p(4, 12) : p(dur * 0.55, dur * 0.65) }}>
        {mode === "quiet" ? "No pop-ups. Mail still gets through." : "Blocked. Nothing in the corner."}</div>}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 50, background: "#141c36" }} />
      {show > 0 && <div style={{ position: "absolute", left: 0, top: 0, width: LW, height: LH, zIndex: 8 }}><Finger x={fx} y={fy} press={press} show={show} /></div>}
    </div>
    <div style={{ width: LW + 100, height: 26, borderRadius: "0 0 30px 30px", background: "#2c3658" }} />
  </div>;
}
