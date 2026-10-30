// v3 mock for the text-replacement prompt tip: typing ";fix" in a chat expands into a whole saved prompt,
// and the iPhone Text Replacement "New" screen with the prompt pasted as the Phrase. The Caret T is the pointer.
import { interpolate, useCurrentFrame, Easing } from "remotion";
import { C, clamp } from "./theme";
import { fontMono, fontSans } from "./fonts";
import { Finger } from "./visuals";
import type { Visual } from "./types";

const ease = Easing.inOut(Easing.cubic);
const PW = 620, PH = 1000;
type PhoneV = Extract<Visual, { type: "phone-settings" }>;
const PROMPT = "You debug prompts. You are practical and specific. You treat a bad model answer like a bug report: find the line in the prompt that caused it, fix that line, and leave working parts alone.";

function Frame({ children, label }: { children: React.ReactNode; label?: string }) {
  return <div style={{ position: "relative", width: PW, height: PH, borderRadius: 72, background: "#0e1428", border: "10px solid #2c3658", boxShadow: "0 40px 100px rgba(0,0,0,.55)", overflow: "hidden" }}>
    <div style={{ position: "absolute", top: 18, left: PW / 2 - 70, width: 140, height: 34, borderRadius: 20, background: "#000", zIndex: 5 }} />
    {label && <div style={{ position: "absolute", top: 82, left: 34, fontFamily: fontMono, fontSize: 26, color: C.mut }}>{label}</div>}
    {children}
  </div>;
}
function Note({ text, good, bottom = 60 }: { text: string; good: boolean; bottom?: number }) {
  return <div style={{ position: "absolute", bottom, left: 30, right: 30, padding: "18px 22px", borderRadius: 18, textAlign: "center", zIndex: 6,
    background: good ? "rgba(62,224,160,.18)" : "rgba(255,107,107,.18)", border: `2px solid ${good ? C.acc : C.warn}`, fontFamily: fontMono, fontSize: 28, color: C.fg }}>{text}</div>;
}
function Keys({ hot }: { hot: string }) {
  const rows = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];
  return <div style={{ position: "absolute", top: 640, left: 0, right: 0, bottom: 0, background: "#151c34", paddingTop: 16 }}>
    {rows.map((r) => <div key={r} style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 12 }}>
      {r.split("").map((k) => <div key={k} style={{ width: 50, height: 62, borderRadius: 10, background: k === hot ? C.keyHi : C.key, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fontSans, fontSize: 30, color: C.fg }}>{k}</div>)}
    </div>)}
    <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 12 }}>
      <div style={{ width: 120, height: 62, borderRadius: 10, background: hot === ";" ? C.keyHi : C.key, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fontSans, fontSize: 28, color: C.fg }}>123</div>
      <div style={{ width: 300, height: 62, borderRadius: 10, background: hot === " " ? C.keyHi : C.key, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fontSans, fontSize: 26, color: C.mut }}>space</div>
    </div>
  </div>;
}

/** mode "expand" (iPhone). (no reveal) a chat box: ";fix" is typed, space, and it swells into the saved prompt
 *  | "form" Text Replacement › New: the prompt lands in Phrase, then ";fix" is typed into Shortcut. */
export function PhoneExpand({ v, dur }: { v: PhoneV; dur: number }) {
  const f = useCurrentFrame();
  const p = (a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: ease });
  if (v.reveal === "form") {
    const pasted = p(dur * 0.1, dur * 0.3);
    const sc = Math.min(4, Math.floor(interpolate(f, [dur * 0.45, dur * 0.75], [0, 4.99], clamp)));
    const saved = p(dur * 0.8, dur * 0.88);
    return <Frame label="Text Replacement › New">
      <div style={{ position: "absolute", top: 140, left: 34, right: 34, display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: fontSans, fontSize: 32 }}>
        <span style={{ color: C.mut }}>Cancel</span><b style={{ color: C.fg, fontSize: 40 }}>New</b><span style={{ color: saved > 0.5 ? C.acc : "#4da3ff", fontWeight: 700 }}>Save</span></div>
      <div style={{ position: "absolute", top: 230, left: 26, right: 26, borderRadius: 22, background: C.panel, padding: "20px 26px", border: pasted > 0.5 && sc === 0 ? `3px solid ${C.acc}` : "3px solid transparent" }}>
        <div style={{ fontFamily: fontMono, fontSize: 24, color: C.mut }}>Phrase</div>
        <div style={{ fontFamily: fontSans, fontSize: 28, lineHeight: 1.3, color: C.fg, marginTop: 8, height: 220, overflow: "hidden", opacity: pasted }}>{PROMPT.slice(0, 150)}…</div>
      </div>
      <div style={{ position: "absolute", top: 560, left: 26, right: 26, height: 92, borderRadius: 22, background: C.panel, padding: "0 26px", display: "flex", alignItems: "center", gap: 20, border: sc > 0 ? `3px solid ${C.acc}` : "3px solid transparent" }}>
        <span style={{ fontFamily: fontMono, fontSize: 24, color: C.mut }}>Shortcut</span>
        <span style={{ fontFamily: fontMono, fontWeight: 700, fontSize: 40, color: C.acc }}>{";fix".slice(0, sc)}<span style={{ opacity: f % 14 < 8 ? 1 : 0 }}>|</span></span></div>
      {pasted > 0.05 && pasted < 0.95 && <div style={{ position: "absolute", top: 200, left: 220, padding: "10px 22px", borderRadius: 14, background: "#2c3658", fontFamily: fontSans, fontSize: 28, color: C.fg }}>Paste</div>}
      <Finger x={sc > 0 ? PW * 0.6 : PW * 0.45} y={sc > 0 ? 606 : 330} press={interpolate(f, [dur * 0.12, dur * 0.16, dur * 0.2], [0, 1, 0], clamp)} show={p(0, 6)} />
      <Note text={v.note ?? (saved > 0.5 ? "Saved. Four keys from now on." : "Paste the whole prompt here.")} good bottom={140} />
    </Frame>;
  }
  // chat: type ";fix", hit space, the prompt pours in
  const typed = ";fix";
  const n = Math.min(4, Math.floor(interpolate(f, [dur * 0.08, dur * 0.38], [0, 4.99], clamp)));
  const space = f > dur * 0.42;
  const grow = p(dur * 0.44, dur * 0.72);
  const shown = Math.round(grow * 175);
  const hot = !space ? typed[Math.max(0, n - 1)] ?? "" : grow < 0.1 ? " " : "";
  return <Frame label="Chat">
    <div style={{ position: "absolute", top: 140, left: 34, fontFamily: fontSans, fontWeight: 700, fontSize: 44, color: C.fg }}>New chat</div>
    <div style={{ position: "absolute", top: 230, left: 24, right: 24, padding: "20px 24px", borderRadius: 24, background: C.panel, border: grow > 0.05 ? `3px solid ${C.acc}` : "3px solid transparent", fontFamily: grow > 0.05 ? fontSans : fontMono, fontSize: grow > 0.05 ? 27 : 44, lineHeight: 1.3, color: C.fg, height: grow > 0.05 ? 240 : 70, overflow: "hidden" }}>
      {grow > 0.05 ? <>{PROMPT.slice(0, shown)}{shown >= 175 ? "…" : ""}</> : <span style={{ color: C.acc, fontWeight: 700 }}>{typed.slice(0, n)}</span>}<span style={{ color: C.acc, opacity: f % 14 < 8 ? 1 : 0 }}>|</span></div>
    <Keys hot={hot} />
    <Note text={v.note ?? (grow > 0.5 ? "4 keys → 2,394 characters" : "Type ;fix and a space…")} good={grow > 0.5} bottom={380} />
  </Frame>;
}
