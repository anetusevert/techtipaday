// More v3 mocks: a keyboard that buzzes or clicks on every key (and then goes quiet), an Android "storage full"
// warning that Files by Google clears, the iPhone battery icon without and with its percentage, Low Power Mode
// stretching the last 20%, tracking pop-ups that stop, a lock screen buried in notifications vs one Scheduled
// Summary, Chrome translating a page, Windows toasts silenced by Do not disturb, a frozen Mac app and Force Quit,
// File Explorer windows folding into tabs, and Snipping Tool's Text actions copying text out of a screenshot.
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
function Pointer({ x, y, press, show = 1 }: { x: number; y: number; press: number; show?: number }) {
  return <div style={{ position: "absolute", left: 0, top: 0, width: LW, height: LH, zIndex: 8 }}><Finger x={x} y={y} press={press} show={show} /></div>;
}

/** mode "keyfeel" (iPhone or Android keyboard). (no reveal) every key press shows a buzz/click burst, caller = "click" or "bzz"
 *  | "quiet" the same typing, no bursts. */
export function PhoneKeyFeel({ v, dur }: { v: PhoneV; dur: number }) {
  const f = useCurrentFrame();
  const msg = "on my way, be there in 5";
  const n = Math.min(msg.length, Math.floor(f / 2.2));
  const quiet = v.reveal === "quiet";
  const word = v.caller ?? "bzz";
  const rows = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];
  const ch = msg[Math.max(0, n - 1)] ?? "a";
  const tap = f % 2.2 < 1.2;
  return <Frame label="Messages">
    <div style={{ position: "absolute", top: 160, right: 34, maxWidth: 440, padding: "18px 24px", borderRadius: 26, background: BLUE, fontFamily: fontSans, fontSize: 32, color: "#fff" }}>Where are you?</div>
    <div style={{ position: "absolute", top: 470, left: 24, right: 24, padding: "18px 22px", borderRadius: 24, background: C.panel, fontFamily: fontSans, fontSize: 32, color: C.fg, minHeight: 40 }}>{msg.slice(0, n)}<span style={{ color: C.acc }}>|</span></div>
    <div style={{ position: "absolute", top: 580, left: 0, right: 0, bottom: 0, background: "#151c34", paddingTop: 20 }}>
      {rows.map((r, ri) => <div key={r} style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 14 }}>
        {r.split("").map((k) => { const hot = tap && k === ch;
          return <div key={k} style={{ position: "relative", width: 50, height: 66, borderRadius: 10, background: hot ? C.keyHi : C.key, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fontSans, fontSize: 30, color: C.fg }}>{k}
            {hot && !quiet && <div style={{ position: "absolute", top: -54, left: -30, width: 110, textAlign: "center", fontFamily: fontMono, fontWeight: 700, fontSize: 28, color: C.warn }}>{word}</div>}</div>; })}
      </div>)}
    </div>
    {!quiet && <div style={{ position: "absolute", top: 260, left: 0, right: 0, textAlign: "center", fontFamily: fontMono, fontSize: 30, color: C.warn, opacity: 0.6 + 0.4 * Math.sin(f / 2) }}>{`${word} ${word} ${word}…`}</div>}
    <Note text={v.note ?? (quiet ? "Silent typing. Finally." : "Every. Single. Letter.")} good={quiet} bottom={420} />
  </Frame>;
}

/** mode "storage" (Android). (no reveal) "Storage almost full" with the bar at 97% and a failed photo
 *  | "freed" Files by Google's Clean card, the bar falls to 61% and "8.4 GB freed". */
export function PhoneStorage({ v, dur }: { v: PhoneV; dur: number }) {
  const f = useCurrentFrame();
  const p = (a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: ease });
  const freed = v.reveal === "freed" ? p(dur * 0.25, dur * 0.6) : 0;
  const pct = Math.round(interpolate(freed, [0, 1], [97, 61]));
  const col = pct > 90 ? C.warn : C.acc;
  return <Frame label={v.reveal ? "Files by Google › Clean" : "Camera"}>
    {!v.reveal && <div style={{ position: "absolute", top: 140, left: 30, right: 30, padding: "22px 24px", borderRadius: 22, background: "#1c2440", border: `2px solid ${C.warn}`, fontFamily: fontSans, fontSize: 30, color: C.fg }}>
      <b>Storage space running out</b><div style={{ fontSize: 26, color: C.mut, marginTop: 6 }}>Couldn't save photo. Free up space to keep using the camera.</div></div>}
    {v.reveal && <div style={{ position: "absolute", top: 140, left: 30, right: 30, padding: "22px 24px", borderRadius: 22, background: C.panel, fontFamily: fontSans, fontSize: 30, color: C.fg }}>
      <b>Junk files</b> <span style={{ color: C.mut }}>· 3.1 GB</span><br /><b>Duplicate files</b> <span style={{ color: C.mut }}>· 2.6 GB</span><br /><b>Old screenshots</b> <span style={{ color: C.mut }}>· 2.7 GB</span></div>}
    <div style={{ position: "absolute", top: 420, left: 30, fontFamily: fontSans, fontSize: 30, color: C.mut }}>Storage used</div>
    <div style={{ position: "absolute", top: 470, left: 30, right: 30, height: 60, borderRadius: 14, background: "#1a2340", overflow: "hidden" }}><div style={{ width: `${pct}%`, height: "100%", background: col }} /></div>
    <div style={{ position: "absolute", top: 550, left: 30, fontFamily: fontMono, fontWeight: 700, fontSize: 84, color: col }}>{pct}%</div>
    {freed > 0.9 && <div style={{ position: "absolute", top: 680, left: 30, right: 30, textAlign: "center", fontFamily: fontSans, fontWeight: 700, fontSize: 40, color: C.acc }}>8.4 GB freed</div>}
    <Note text={v.note ?? (v.reveal ? "Photos and chats untouched." : "Again? I only have 30 apps…")} good={!!v.reveal} />
  </Frame>;
}

/** mode "pct" (iPhone). (no reveal) a tiny battery icon, a magnifier hovers, "is that 30%? 10%?"
 *  | "on" the number appears inside the icon. */
export function PhonePct({ v, dur }: { v: PhoneV; dur: number }) {
  const f = useCurrentFrame();
  const p = (a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: ease });
  const on = v.reveal === "on" ? p(dur * 0.25, dur * 0.4) : 0;
  const guesses = ["30%?", "15%?", "40%?"]; const g = guesses[Math.floor(f / 14) % 3];
  return <Frame>
    <div style={{ position: "absolute", top: 70, left: 40, right: 40, display: "flex", justifyContent: "space-between", fontFamily: fontSans, fontWeight: 700, fontSize: 30, color: C.fg }}>
      <span>9:41</span><span style={{ display: "flex", gap: 10, alignItems: "center" }}>▂▄▆
        <span style={{ position: "relative", width: 66, height: 32, borderRadius: 9, border: `3px solid ${C.fg}`, display: "inline-flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
          <span style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "27%", background: on > 0.5 ? C.fg : AMBER, opacity: on > 0.5 ? 0.35 : 1 }} />
          {on > 0.5 && <span style={{ position: "relative", fontSize: 20, fontWeight: 800, color: C.fg }}>27</span>}</span></span></div>
    <div style={{ position: "absolute", top: 160, right: 40, width: 280, height: 280, borderRadius: 140, border: `8px solid ${on > 0.5 ? C.acc : C.mut}`, background: "#0e1428ee", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "relative", width: 200, height: 96, borderRadius: 22, border: `7px solid ${C.fg}`, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "27%", background: on > 0.5 ? "rgba(238,241,248,.35)" : AMBER }} />
        {on > 0.5 && <span style={{ position: "relative", fontFamily: fontSans, fontWeight: 800, fontSize: 60, color: C.fg }}>27</span>}</div></div>
    {on < 0.5 && <div style={{ position: "absolute", top: 480, left: 0, right: 0, textAlign: "center", fontFamily: fontMono, fontWeight: 700, fontSize: 70, color: C.warn }}>{g}</div>}
    {on > 0.5 && <div style={{ position: "absolute", top: 480, left: 0, right: 0, textAlign: "center", fontFamily: fontMono, fontWeight: 700, fontSize: 70, color: C.acc }}>27%</div>}
    <Note text={v.note ?? (on > 0.5 ? "The exact number, always." : "Is that a third? A tenth?")} good={on > 0.5} />
  </Frame>;
}

/** mode "lowpower" (iPhone). (no reveal) 20% left, hours from home, the estimate keeps falling
 *  | "on" the battery turns yellow and the estimate stretches. */
export function PhoneLowPower({ v, dur }: { v: PhoneV; dur: number }) {
  const f = useCurrentFrame();
  const p = (a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: ease });
  const on = v.reveal === "on" ? p(dur * 0.2, dur * 0.4) : 0;
  const hrs = on > 0.5 ? interpolate(on, [0.5, 1], [1.5, 2.5]) : interpolate(p(0, dur), [0, 1], [2, 1]);
  const h = Math.floor(hrs), m = Math.round((hrs - h) * 60 / 5) * 5;
  const col = on > 0.5 ? AMBER : C.warn;
  return <Frame label="Battery">
    <div style={{ position: "absolute", top: 180, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
      <div style={{ position: "relative", width: 300, height: 140, borderRadius: 30, border: `9px solid ${C.fg}`, padding: 9, boxSizing: "border-box" }}><div style={{ width: "20%", height: "100%", borderRadius: 14, background: col }} /></div>
      <div style={{ width: 16, height: 50, marginTop: 45, borderRadius: 5, background: C.fg }} /></div>
    <div style={{ position: "absolute", top: 370, left: 0, right: 0, textAlign: "center", fontFamily: fontMono, fontWeight: 700, fontSize: 90, color: col }}>20%</div>
    <div style={{ position: "absolute", top: 500, left: 0, right: 0, textAlign: "center", fontFamily: fontSans, fontSize: 34, color: C.fg }}>About {h}h {String(m).padStart(2, "0")}m left</div>
    {on > 0.5 && <div style={{ position: "absolute", top: 570, left: 0, right: 0, textAlign: "center", fontFamily: fontMono, fontSize: 28, color: AMBER }}>Low Power Mode on</div>}
    <Note text={v.note ?? (on > 0.5 ? "Makes it home. Just." : "Still 3 hours till home.")} good={on > 0.5} />
  </Frame>;
}

/** mode "track" (iPhone). (no reveal) "Allow … to track your activity?" pops up app after app
 *  | "off" one switch, the prompts stop and a list shows every app told no. */
export function PhoneTrack({ v, dur }: { v: PhoneV; dur: number }) {
  const f = useCurrentFrame();
  const p = (a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: ease });
  const apps = ["ShopNow", "Puzzle Pop", "NewsDaily", "FitTrack"];
  if (!v.reveal) {
    const step = Math.max(10, dur / 4); const i = Math.floor(f / step) % apps.length; const o = interpolate(f % step, [0, 5], [0.4, 1], clamp);
    return <Frame label={apps[i]}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.45)" }} />
      <div style={{ position: "absolute", top: 280, left: 60, right: 60, padding: "30px 26px", borderRadius: 26, background: "#232c4a", opacity: o, transform: `scale(${0.9 + 0.1 * o})`, textAlign: "center", fontFamily: fontSans, color: C.fg }}>
        <div style={{ fontWeight: 700, fontSize: 32 }}>Allow "{apps[i]}" to track your activity across other companies' apps and websites?</div>
        <div style={{ marginTop: 26, padding: "16px", borderRadius: 14, background: "#2f3a5e", fontSize: 30, color: BLUE }}>Ask App Not to Track</div>
        <div style={{ marginTop: 12, padding: "16px", borderRadius: 14, background: "#2f3a5e", fontSize: 30, color: BLUE }}>Allow</div></div>
      <Note text={v.note ?? `Pop-up #${1 + Math.floor(f / step)} today.`} good={false} />
    </Frame>;
  }
  const off = p(dur * 0.15, dur * 0.3);
  return <Frame label="Privacy & Security › Tracking">
    <div style={{ position: "absolute", top: 140, left: 24, right: 24, height: 90, borderRadius: 18, padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", background: C.panel, fontFamily: fontSans, fontSize: 28, color: C.fg }}>
      <span>Allow Apps to Request to Track</span>
      <div style={{ width: 90, height: 52, borderRadius: 26, background: off > 0.5 ? "#3a4670" : C.acc, position: "relative" }}><div style={{ position: "absolute", top: 4, left: off > 0.5 ? 4 : 42, width: 44, height: 44, borderRadius: 22, background: "#fff" }} /></div></div>
    {apps.map((a, i) => <div key={a} style={{ position: "absolute", top: 270 + i * 86, left: 24, right: 24, height: 72, borderRadius: 14, padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#151d38", fontFamily: fontSans, fontSize: 28, color: C.fg, opacity: off > 0.5 ? interpolate(f, [dur * 0.32 + i * 4, dur * 0.38 + i * 4], [0, 1], clamp) : 0 }}>
      <span>{a}</span><span style={{ fontFamily: fontMono, fontSize: 24, color: C.acc }}>told no</span></div>)}
    <Finger x={PW - 90} y={185} press={interpolate(f, [dur * 0.1, dur * 0.15, dur * 0.22], [0, 1, 0], clamp)} show={1 - p(dur * 0.4, dur * 0.5)} />
    <Note text={v.note ?? "No more pop-ups. Every app gets a no."} good />
  </Frame>;
}

/** mode "summary" (iPhone). (no reveal) the lock screen fills with app notifications one after another
 *  | "on" they fold into one "Your Morning Summary" card at 8:00, messages still come through. */
export function PhoneSummary({ v, dur }: { v: PhoneV; dur: number }) {
  const f = useCurrentFrame();
  const p = (a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: ease });
  const notes = ["ShopNow: Flash sale ends tonight", "NewsDaily: 5 stories for you", "Puzzle Pop: Your lives are full!", "FitTrack: Time to move", "Streamly: New episode out", "ShopNow: Still thinking about it?"];
  const head = <div style={{ position: "absolute", top: 110, left: 0, right: 0, textAlign: "center", fontFamily: fontSans, fontWeight: 700, fontSize: 110, color: C.fg }}>{v.reveal ? "8:00" : "7:12"}</div>;
  if (!v.reveal) {
    const step = Math.max(5, dur / 7); const n = Math.min(notes.length, 1 + Math.floor(f / step));
    return <Frame bg="#101830">{head}
      {notes.slice(0, n).map((t, i) => <div key={t} style={{ position: "absolute", top: 290 + i * 88, left: 26, right: 26, height: 76, borderRadius: 18, padding: "0 22px", display: "flex", alignItems: "center", background: "#1c2440ee", fontFamily: fontSans, fontSize: 25, color: C.fg, opacity: interpolate(f, [i * step, i * step + 4], [0, 1], clamp) }}>{t}</div>)}
      <Note text={v.note ?? "Buzz. Buzz. Buzz. Before breakfast."} good={false} />
    </Frame>;
  }
  const fold = p(dur * 0.15, dur * 0.4);
  return <Frame bg="#101830">{head}
    <div style={{ position: "absolute", top: 300, left: 26, right: 26, padding: "24px", borderRadius: 24, background: "#1c2440", border: `2px solid ${C.acc}`, opacity: fold, fontFamily: fontSans, color: C.fg }}>
      <div style={{ fontFamily: fontMono, fontSize: 22, color: C.acc }}>SCHEDULED SUMMARY</div>
      <div style={{ fontWeight: 700, fontSize: 36, marginTop: 8 }}>Your Morning Summary</div>
      <div style={{ fontSize: 26, color: C.mut, marginTop: 8 }}>23 notifications from 6 apps</div></div>
    <div style={{ position: "absolute", top: 520, left: 26, right: 26, height: 80, borderRadius: 18, padding: "0 22px", display: "flex", alignItems: "center", background: "#1c2440ee", fontFamily: fontSans, fontSize: 26, color: C.fg, opacity: p(dur * 0.5, dur * 0.6) }}>💬 Mum: still on for lunch?</div>
    <Note text={v.note ?? "One card, when you want it."} good />
  </Frame>;
}

/** action "translate" (Chrome). mode "foreign": a page in German you can't read | "english": the translate icon is clicked and the text flips to English. */
export function LaptopTranslate({ v, dur }: { v: LaptopV; dur: number }) {
  const f = useCurrentFrame();
  const p = (a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: ease });
  const de = ["Rückgabe innerhalb von 30 Tagen", "Versandkosten werden nicht erstattet", "Bitte Originalverpackung verwenden", "Rücksendeetikett anfordern"];
  const en = ["Returns within 30 days", "Shipping costs are not refunded", "Please use the original packaging", "Request a return label"];
  const tr = v.mode === "english" ? p(dur * 0.35, dur * 0.5) : 0;
  const press = v.mode === "english" ? interpolate(f, [dur * 0.25, dur * 0.3, dur * 0.36], [0, 1, 0], clamp) : 0;
  const move = p(0, dur * 0.25);
  return <LaptopShell title="shop.example.de/rueckgabe">
    <div style={{ position: "absolute", top: 8, right: 20, width: 34, height: 28, borderRadius: 6, background: press > 0.3 || tr > 0.5 ? BLUE : "#2f3a5e", fontFamily: fontSans, fontSize: 18, fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 3 }}>文A</div>
    <div style={{ position: "absolute", top: 80, left: 50, fontFamily: fontSans, fontWeight: 700, fontSize: 46, color: C.fg }}>{tr > 0.5 ? "Returns" : "Rücksendungen"}</div>
    {(tr > 0.5 ? en : de).map((t, i) => <div key={i} style={{ position: "absolute", top: 170 + i * 74, left: 50, right: 50, fontFamily: fontSans, fontSize: 32, color: tr > 0.5 ? C.fg : C.mut }}>• {t}</div>)}
    {tr > 0.5 && <div style={{ position: "absolute", top: 54, right: 20, padding: "8px 16px", borderRadius: 10, background: "#1c2440", border: `2px solid ${C.acc}`, fontFamily: fontMono, fontSize: 20, color: C.acc }}>Translated from German</div>}
    {v.mode !== "english" && <div style={{ position: "absolute", bottom: 30, left: 30, right: 30, padding: "14px", borderRadius: 14, textAlign: "center", background: "rgba(255,107,107,.18)", border: `2px solid ${C.warn}`, fontFamily: fontMono, fontSize: 26, color: C.fg }}>{v.items?.[0] ?? "Copy, paste, translate… line by line?"}</div>}
    {v.mode === "english" && <Pointer x={interpolate(move, [0, 1], [LW * 0.5, LW - 38])} y={interpolate(move, [0, 1], [LH * 0.6, 22])} press={press} show={1 - p(dur * 0.6, dur * 0.7)} />}
  </LaptopShell>;
}

/** action "windnd" (Windows 11). mode "toasts": notification toasts stack up over a slideshow
 *  | "quiet": Do not disturb on (bell with z), toasts go straight to the notification centre. */
export function LaptopWinDnd({ v, dur }: { v: LaptopV; dur: number }) {
  const f = useCurrentFrame();
  const p = (a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: ease });
  const toasts = ["Teams: Are you joining?", "Outlook: 3 new emails", "Spotify: New release", "Windows Update: Restart required"];
  const quiet = v.mode === "quiet" ? p(dur * 0.15, dur * 0.3) > 0.5 : false;
  const step = Math.max(6, dur / 5); const n = Math.min(toasts.length, 1 + Math.floor(f / step));
  return <LaptopShell title="Quarterly review.pptx — Slide Show" bg="#e9eef8">
    <div style={{ position: "absolute", top: 110, left: 70, fontFamily: fontSans, fontWeight: 700, fontSize: 54, color: "#1b2440" }}>Q3 results</div>
    {[300, 380, 260].map((w, i) => <div key={i} style={{ position: "absolute", top: 220 + i * 60, left: 70, width: w, height: 26, borderRadius: 6, background: "#b8c4dc" }} />)}
    {!quiet && toasts.slice(0, n).map((t, i) => <div key={t} style={{ position: "absolute", right: 18, bottom: 70 + i * 92, width: 420, height: 80, borderRadius: 12, padding: "0 20px", display: "flex", alignItems: "center", background: "#1c2440", border: "2px solid #3a4670", fontFamily: fontSans, fontSize: 24, color: C.fg, opacity: interpolate(f, [i * step, i * step + 4], [0, 1], clamp) }}>{t}</div>)}
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 52, background: "#1a2340", display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 18, padding: "0 22px", fontFamily: fontMono, fontSize: 24, color: C.fg }}>
      {quiet && <span style={{ color: C.acc }}>🔕 Do not disturb</span>}<span>14:02</span></div>
    {quiet && <div style={{ position: "absolute", top: 130, right: 40, padding: "16px 22px", borderRadius: 14, background: "rgba(62,224,160,.18)", border: `2px solid ${C.acc}`, fontFamily: fontMono, fontSize: 24, color: "#1b2440" }}>{v.items?.[1] ?? "4 notifications waiting, quietly"}</div>}
    {!quiet && <div style={{ position: "absolute", top: 130, right: 40, padding: "16px 22px", borderRadius: 14, background: "rgba(255,107,107,.25)", border: `2px solid ${C.warn}`, fontFamily: fontMono, fontSize: 24, color: "#1b2440" }}>{v.items?.[0] ?? "Whole room can read these."}</div>}
  </LaptopShell>;
}

/** action "macfrozen" (Mac). mode "beachball": an app stuck with the spinning wheel, clicks do nothing
 *  | "forcequit": the Force Quit Applications window, the stuck app marked "(Not Responding)" and Force Quit pressed. */
export function LaptopMacFrozen({ v, dur }: { v: LaptopV; dur: number }) {
  const f = useCurrentFrame();
  const p = (a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: ease });
  const wheel = <div style={{ width: 70, height: 70, borderRadius: 35, background: "conic-gradient(#ff6b6b,#ffc857,#3ee0a0,#4da3ff,#b28dff,#ff6b6b)", transform: `rotate(${f * 18}deg)` }} />;
  if (v.mode !== "forcequit") {
    return <LaptopShell title="Pages — Essay draft">
      <div style={{ position: "absolute", top: 80, left: 60, right: 60, bottom: 60, borderRadius: 12, background: "#e9eef8", opacity: 0.7 }}>
        {[600, 680, 520, 640, 580].map((w, i) => <div key={i} style={{ margin: "28px 40px 0", width: w, height: 18, borderRadius: 5, background: "#b8c4dc" }} />)}</div>
      <div style={{ position: "absolute", top: 260, left: LW / 2 - 35 }}>{wheel}</div>
      <div style={{ position: "absolute", bottom: 24, left: 30, right: 30, padding: "12px", borderRadius: 14, textAlign: "center", background: "rgba(255,107,107,.18)", border: `2px solid ${C.warn}`, fontFamily: fontMono, fontSize: 26, color: C.fg }}>{v.items?.[0] ?? `Click ×${1 + Math.floor(f / 10)}. Nothing.`}</div>
    </LaptopShell>;
  }
  const press = interpolate(f, [dur * 0.4, dur * 0.46, dur * 0.54], [0, 1, 0], clamp); const gone = p(dur * 0.5, dur * 0.6);
  const apps = ["Pages (Not Responding)", "Safari", "Mail", "Finder"];
  const move = p(dur * 0.05, dur * 0.35);
  return <LaptopShell title="Force Quit Applications  ⌥⌘⎋">
    {apps.map((a, i) => { if (i === 0 && gone > 0.9) return null; const sel = i === 0;
      return <div key={a} style={{ position: "absolute", top: 80 + (i - (gone > 0.9 ? 1 : 0)) * 74, left: 40, right: 40, height: 62, borderRadius: 10, padding: "0 20px", display: "flex", alignItems: "center", background: sel ? BLUE : C.panel, opacity: sel ? 1 - gone : 1, fontFamily: fontSans, fontSize: 28, color: sel ? "#fff" : C.fg }}>{a}</div>; })}
    <div style={{ position: "absolute", bottom: 40, right: 40, padding: "14px 30px", borderRadius: 12, background: press > 0.3 ? C.acc : "#2f3a5e", fontFamily: fontSans, fontWeight: 700, fontSize: 28, color: press > 0.3 ? C.bg : C.fg }}>Force Quit</div>
    <Pointer x={interpolate(move, [0, 1], [LW * 0.4, LW - 140])} y={interpolate(move, [0, 1], [LH * 0.4, LH - 66])} press={press} show={1 - p(dur * 0.7, dur * 0.8)} />
  </LaptopShell>;
}

/** action "explorer" (Windows 11). mode "windows": four Explorer windows piled on top of each other
 *  | "tabs": they fold into one window with four tabs. */
export function LaptopExplorer({ v, dur }: { v: LaptopV; dur: number }) {
  const f = useCurrentFrame();
  const p = (a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: ease });
  const names = ["Downloads", "Documents", "Photos", "Invoices"];
  const t = v.mode === "tabs" ? p(dur * 0.15, dur * 0.45) : 0;
  const jiggle = v.mode === "tabs" ? 0 : Math.sin(f / 4) * 6;
  return <div style={{ width: LW + 80, display: "flex", flexDirection: "column", alignItems: "center", marginTop: 40 }}>
    <div style={{ position: "relative", width: LW, height: LH, borderRadius: 26, border: "12px solid #2c3658", background: "linear-gradient(160deg,#1b2a55,#0f1730)", overflow: "hidden", boxShadow: "0 40px 100px rgba(0,0,0,.55)" }}>
      {names.map((n, i) => { const x = interpolate(t, [0, 1], [40 + i * 110, 40]), y = interpolate(t, [0, 1], [30 + i * 80, 30]);
        return <div key={n} style={{ position: "absolute", left: x + (i === 3 ? jiggle : 0), top: y, width: 560, height: 340, borderRadius: 12, background: "#1c2440", border: "2px solid #3a4670", opacity: t > 0.9 && i > 0 ? 0 : 1 }}>
          <div style={{ height: 46, display: "flex", alignItems: "flex-end", gap: 6, padding: "0 10px", background: "#141c36", borderRadius: "10px 10px 0 0" }}>
            {(t > 0.9 ? names : [n]).map((m, j) => <div key={m} style={{ padding: "8px 16px", borderRadius: "8px 8px 0 0", background: j === 0 ? "#1c2440" : "#232c4a", fontFamily: fontSans, fontSize: 20, color: C.fg }}>📁 {m}</div>)}
            {t > 0.9 && <div style={{ padding: "8px 14px", fontFamily: fontSans, fontSize: 22, color: C.mut }}>+</div>}</div>
          {[0, 1, 2].map((k) => <div key={k} style={{ margin: "18px 20px 0", height: 40, borderRadius: 8, background: "#232c4a" }} />)}
        </div>; })}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 52, background: "#141c36", display: "flex", justifyContent: "center", alignItems: "center", gap: 14 }}>
        {[0, 1, 2, 3, 4].map((i) => <div key={i} style={{ position: "relative", width: 38, height: 38, borderRadius: 8, background: i === 1 ? "#ffc857" : "#2f3a5e" }}>{i === 1 && <div style={{ position: "absolute", bottom: -8, left: 4, right: 4, height: 4, borderRadius: 2, background: C.fg }} />}</div>)}</div>
    </div>
    <div style={{ width: LW + 100, height: 26, borderRadius: "0 0 30px 30px", background: "#2c3658" }} />
    <div style={{ marginTop: 34, padding: "16px 26px", borderRadius: 16, background: t > 0.9 ? "rgba(62,224,160,.18)" : "rgba(255,107,107,.18)", border: `2px solid ${t > 0.9 ? C.acc : C.warn}`, fontFamily: fontMono, fontSize: 28, color: C.fg }}>
      {t > 0.9 ? (v.items?.[1] ?? "One window. Four folders.") : (v.items?.[0] ?? "Which window was Downloads?")}</div>
  </div>;
}

/** action "textact" (Windows 11 Snipping Tool). mode "retype": an error message screenshot, someone types it out by hand, with typos
 *  | "copied": Text actions highlights every line and "Copied" appears. */
export function LaptopTextAct({ v, dur }: { v: LaptopV; dur: number }) {
  const f = useCurrentFrame();
  const p = (a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: ease });
  const lines = ["Error 0x80070643", "Installation failed for KB5034441", "Contact support with code WU-2291-B"];
  const shot = (hi: number) => <div style={{ position: "absolute", top: 70, left: 40, width: 520, padding: "20px 24px", borderRadius: 12, background: "#e9eef8", fontFamily: fontMono, fontSize: 24, color: "#1b2440" }}>
    {lines.map((l, i) => <div key={l} style={{ marginTop: i ? 10 : 0, background: hi > 0.5 ? "rgba(77,163,255,.35)" : "transparent" }}>{l}</div>)}</div>;
  if (v.mode !== "copied") {
    const typed = "Eror 0x8007O643 Instalation fa".slice(0, Math.floor(f / 2.5));
    return <LaptopShell title="Snipping Tool">
      {shot(0)}
      <div style={{ position: "absolute", top: 300, left: 40, right: 40, padding: "18px 22px", borderRadius: 12, background: C.panel, fontFamily: fontMono, fontSize: 26, color: C.fg }}>Email to IT: {typed}<span style={{ color: C.acc }}>|</span></div>
      <div style={{ position: "absolute", bottom: 26, left: 30, right: 30, padding: "12px", borderRadius: 14, textAlign: "center", background: "rgba(255,107,107,.18)", border: `2px solid ${C.warn}`, fontFamily: fontMono, fontSize: 26, color: C.fg }}>{v.items?.[0] ?? "Retyping it. With typos."}</div>
    </LaptopShell>;
  }
  const press = interpolate(f, [dur * 0.3, dur * 0.36, dur * 0.44], [0, 1, 0], clamp); const hi = p(dur * 0.38, dur * 0.48); const move = p(0, dur * 0.28);
  return <LaptopShell title="Snipping Tool">
    <div style={{ position: "absolute", top: 4, right: 30, padding: "6px 16px", borderRadius: 8, background: press > 0.3 || hi > 0.5 ? BLUE : "#2f3a5e", fontFamily: fontSans, fontSize: 20, color: "#fff", zIndex: 3 }}>Text actions</div>
    {shot(hi)}
    {hi > 0.5 && <div style={{ position: "absolute", top: 70, right: 40, padding: "12px 20px", borderRadius: 12, background: "#1c2440", border: `2px solid ${C.acc}`, fontFamily: fontSans, fontSize: 24, color: C.acc }}>Copy all text ✓</div>}
    {hi > 0.9 && <div style={{ position: "absolute", top: 300, left: 40, right: 40, padding: "18px 22px", borderRadius: 12, background: C.panel, fontFamily: fontMono, fontSize: 24, color: C.fg }}>Email to IT: {lines.join(" ")}</div>}
    <Pointer x={interpolate(move, [0, 1], [LW * 0.4, LW - 110])} y={interpolate(move, [0, 1], [LH * 0.6, 22])} press={press} show={1 - p(dur * 0.6, dur * 0.7)} />
  </LaptopShell>;
}
