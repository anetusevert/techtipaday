// More v3 mocks: an Android screen that goes dark mid-recipe and the Screen attention switch that keeps it on while you look;
// iPhone text replacement typing a whole email address from "@@"; the iPhone one-handed keyboard (hold the globe key, pick
// the right-hand layout, tap the arrow to go back); a chatbot that asks three questions before it answers; and a Mac Finder
// window that reveals the Path Bar so you can see (and jump) the full folder path.
// The Caret T is always the pointer.
import { interpolate, useCurrentFrame, Easing } from "remotion";
import { C, clamp } from "./theme";
import { fontMono, fontSans } from "./fonts";
import { Finger } from "./visuals";
import type { Visual } from "./types";

const ease = Easing.inOut(Easing.cubic);
const PW = 620, PH = 1000;
type PhoneV = Extract<Visual, { type: "phone-settings" }>;
const BLUE = "#4da3ff";

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

/* ---------- Android screen timeout + Screen attention ---------- */
const RECIPE = ["200 g flour", "2 eggs", "300 ml milk", "pinch of salt"];
function RecipePage() {
  return <div style={{ position: "absolute", top: 130, left: 0, right: 0, bottom: 0, background: "#fbf7ef" }}>
    <div style={{ padding: "26px 34px 6px", fontFamily: fontSans, fontWeight: 800, fontSize: 44, color: "#1a1f33" }}>Pancakes</div>
    <div style={{ padding: "0 34px 18px", fontFamily: fontMono, fontSize: 22, color: "#8a7a5a" }}>Step 4 of 7</div>
    {RECIPE.map((r, i) => <div key={r} style={{ margin: "0 34px 12px", fontFamily: fontSans, fontSize: 32, color: "#1a1f33" }}>• {r}</div>)}
    <div style={{ margin: "18px 34px", fontFamily: fontSans, fontSize: 30, lineHeight: 1.4, color: "#3a3f55" }}>Whisk until smooth, then rest the batter for ten minutes before the pan goes on.</div>
  </div>;
}
/** mode "awake" (Android). (no reveal) a recipe dims and the screen goes black mid-step | "attention" the Screen timeout page:
 *  30 seconds picked, Screen attention switched on | "reading" the recipe stays lit with the eye badge while the untouched timer runs. */
export function PhoneAwake({ v, dur }: { v: PhoneV; dur: number }) {
  const f = useCurrentFrame();
  const p = (a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: ease });
  if (!v.reveal) {
    const dim = p(dur * 0.2, dur * 0.45), off = p(dur * 0.45, dur * 0.55);
    const secs = Math.max(0, 3 - Math.floor(interpolate(f, [0, dur * 0.45], [0, 3], clamp)));
    return <Frame label={v.path[0] ?? "Recipe · step 4"}>
      <RecipePage />
      <div style={{ position: "absolute", inset: 0, background: `rgba(0,0,0,${dim * 0.55 + off * 0.45})`, zIndex: 3 }} />
      {off < 0.5 && <div style={{ position: "absolute", top: 140, right: 30, padding: "6px 14px", borderRadius: 10, background: "#1a1f33cc", fontFamily: fontMono, fontSize: 22, color: "#ffc857", zIndex: 4 }}>{`screen off in 0:0${secs}`}</div>}
      {off > 0.5 && <Tap x={PW / 2} y={500} at={0.8} dur={dur} />}
      {off > 0.5 && <Note text={v.note ?? "Flour on my hands. Screen's gone."} good={false} />}
    </Frame>;
  }
  if (v.reveal === "attention") {
    const opts = ["15 seconds", "30 seconds", "1 minute", "2 minutes", "5 minutes", "10 minutes"];
    const on = p(dur * 0.55, dur * 0.62); const top = 190, rh = 68, swTop = top + opts.length * rh + 40;
    return <Frame label="Display & touch › Screen timeout">
      <div style={{ position: "absolute", top: top - 50, left: 34, fontFamily: fontSans, fontWeight: 700, fontSize: 40, color: C.fg }}>Screen timeout</div>
      {opts.map((o, i) => <div key={o} style={{ position: "absolute", top: top + 10 + i * rh, left: 34, right: 34, height: rh, display: "flex", alignItems: "center", gap: 20, fontFamily: fontSans, fontSize: 30, color: C.fg }}>
        <div style={{ width: 32, height: 32, borderRadius: 16, border: `4px solid ${i === 1 ? C.acc : "#5a6488"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {i === 1 && <div style={{ width: 14, height: 14, borderRadius: 7, background: C.acc }} />}</div>{o}</div>)}
      <div style={{ position: "absolute", top: swTop, left: 26, right: 26, padding: "22px 26px", borderRadius: 24, background: on > 0.5 ? "rgba(62,224,160,.14)" : C.panel, border: `3px solid ${on > 0.5 ? C.acc : "transparent"}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div><div style={{ fontFamily: fontSans, fontWeight: 700, fontSize: 32, color: C.fg }}>Screen attention</div>
          <div style={{ fontFamily: fontSans, fontSize: 22, color: C.mut, marginTop: 6 }}>Stays on while you look at it</div></div>
        <Switch on={on} /></div>
      <Tap x={PW - 26 - 26 - 48} y={swTop + 50} at={0.5} dur={dur} />
    </Frame>;
  }
  // reading
  const t = Math.floor(interpolate(f, [0, dur], [140, 180], clamp));
  const pulse = 0.6 + 0.4 * Math.abs(Math.sin(f / 10));
  return <Frame label={v.path[0] ?? "Recipe · step 4"}>
    <RecipePage />
    <div style={{ position: "absolute", top: 136, right: 26, padding: "8px 16px", borderRadius: 14, background: "#123a33", border: `2px solid ${C.acc}`, fontFamily: fontMono, fontSize: 22, color: C.acc, opacity: pulse, zIndex: 4 }}>👁 looking · stays on</div>
    <Note text={v.note ?? `Not touched for ${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}. Still on.`} good />
  </Frame>;
}

/* ---------- iPhone text replacement ---------- */
const EMAIL = "sam.miller.1987@gmail.com";
function Keyboard({ top = 640 }: { top?: number }) {
  const rows = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];
  return <div style={{ position: "absolute", left: 0, right: 0, top, bottom: 0, background: "#1a2140", padding: "18px 10px" }}>
    {rows.map((r, i) => <div key={r} style={{ display: "flex", justifyContent: "center", gap: 7, marginBottom: 12 }}>
      {[...r].map((k) => <div key={k} style={{ width: 52, height: 64, borderRadius: 10, background: C.key, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fontSans, fontSize: 28, color: C.fg }}>{k}</div>)}</div>)}
    <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
      <div style={{ width: 90, height: 64, borderRadius: 10, background: C.keyHi, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fontSans, fontSize: 24, color: C.fg }}>123</div>
      <div style={{ width: 320, height: 64, borderRadius: 10, background: C.key, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fontSans, fontSize: 24, color: C.mut }}>space</div>
      <div style={{ width: 120, height: 64, borderRadius: 10, background: C.keyHi, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fontSans, fontSize: 24, color: C.fg }}>return</div></div>
  </div>;
}
function ToField({ text, hi, caret = true }: { text: string; hi?: boolean; caret?: boolean }) {
  const f = useCurrentFrame();
  return <div style={{ position: "absolute", top: 150, left: 26, right: 26, padding: "26px 24px", borderRadius: 22, background: C.panel, fontFamily: fontSans, fontSize: 32, color: C.fg, minHeight: 60 }}>
    <span style={{ color: C.mut }}>To: </span><span style={{ background: hi ? "rgba(62,224,160,.3)" : "transparent", borderRadius: 6 }}>{text}</span>
    {caret && <span style={{ color: C.acc, opacity: f % 20 < 12 ? 1 : 0 }}>|</span>}
    <div style={{ marginTop: 22, paddingTop: 18, borderTop: "2px solid #2c3658", color: C.mut, fontSize: 28 }}>Subject: Flat viewing Saturday</div>
  </div>;
}
function KeyTaps({ dur, from, to }: { dur: number; from: number; to: number }) {
  const f = useCurrentFrame();
  const n = Math.floor(f / 5); const xs = [120, 400, 260, 500, 180, 330, 450, 90];
  const press = (f % 5) < 2 ? 1 : 0; const on = f > dur * from && f < dur * to;
  return on ? <div style={{ position: "absolute", inset: 0, zIndex: 8 }}><Finger x={xs[n % xs.length]} y={700 + (n % 3) * 76} press={press} show={1} /></div> : null;
}
/** mode "textrep" (iPhone). (no reveal) a whole email address typed key by key with a typo | "add" New Replacement: Phrase gets
 *  the address, Shortcut gets "@@", Save tapped | "expand" "@@" + space turns into the full address. */
export function PhoneTextRep({ v, dur }: { v: PhoneV; dur: number }) {
  const f = useCurrentFrame();
  const p = (a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: ease });
  if (!v.reveal) {
    const wrong = "sam.miller.1987@gmial.co";
    const n = Math.floor(interpolate(f, [0, dur * 0.7], [0, wrong.length], clamp));
    return <Frame label="Mail · New Message">
      <ToField text={wrong.slice(0, n)} />
      {n >= wrong.length && <div style={{ position: "absolute", top: 170, right: 46, fontFamily: fontMono, fontSize: 24, color: C.warn }}>gmial?</div>}
      <Keyboard /><KeyTaps dur={dur} from={0} to={0.7} />
      {f > dur * 0.72 && <Note text={v.note ?? "Third typo. Same address."} good={false} bottom={390} />}
    </Frame>;
  }
  if (v.reveal === "add") {
    const a = Math.floor(interpolate(f, [dur * 0.05, dur * 0.45], [0, EMAIL.length], clamp));
    const s = Math.floor(interpolate(f, [dur * 0.5, dur * 0.62], [0, 2], clamp)); const saved = f > dur * 0.8;
    const field = (label: string, val: string, active: boolean) => <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "22px 24px", borderBottom: "2px solid #2c3658" }}>
      <span style={{ width: 150, fontFamily: fontSans, fontSize: 28, color: C.mut }}>{label}</span>
      <span style={{ fontFamily: fontSans, fontSize: 28, color: C.fg }}>{val}{active && <span style={{ color: C.acc, opacity: f % 20 < 12 ? 1 : 0 }}>|</span>}</span></div>;
    return <Frame label="Keyboard › Text Replacement">
      <div style={{ position: "absolute", top: 140, left: 26, right: 26, display: "flex", justifyContent: "space-between", fontFamily: fontSans, fontSize: 30 }}>
        <span style={{ color: BLUE }}>‹ Back</span><b style={{ color: C.fg }}>Text Replacement</b>
        <span style={{ color: saved ? C.bg : BLUE, background: saved ? C.acc : "transparent", padding: "0 12px", borderRadius: 8, fontWeight: 700 }}>Save</span></div>
      <div style={{ position: "absolute", top: 220, left: 26, right: 26, borderRadius: 22, background: C.panel, overflow: "hidden" }}>
        {field("Phrase", EMAIL.slice(0, a), f < dur * 0.48)}{field("Shortcut", "@@".slice(0, s), f >= dur * 0.48 && !saved)}</div>
      <Keyboard top={680} />
      <Tap x={PW - 60} y={160} at={0.72} dur={dur} from={[PW * 0.6, 760]} />
      {saved && <Note text="@@  →  your whole address" good bottom={360} />}
    </Frame>;
  }
  // expand
  const typed = Math.floor(interpolate(f, [dur * 0.05, dur * 0.25], [0, 2], clamp));
  const boom = f > dur * 0.38;
  return <Frame label="Mail · New Message">
    <ToField text={boom ? EMAIL : "@@".slice(0, typed)} hi={boom} />
    <Keyboard /><KeyTaps dur={dur} from={0} to={0.3} />
    {!boom && f > dur * 0.28 && <div style={{ position: "absolute", inset: 0, zIndex: 8 }}><Finger x={PW / 2} y={640 + 18 + 3 * 76 + 32} press={1} show={1} /></div>}
    {boom && <Note text={v.note ?? "@@ + space. Spelled right."} good bottom={390} />}
  </Frame>;
}

/* ---------- iPhone one-handed keyboard ---------- */
const KROWS = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];
function OneKeyboard({ shrink, side = 1, arrowHi = false }: { shrink: number; side?: number; arrowHi?: boolean }) {
  const top = 600, full = PW - 20, w = full * (1 - 0.2 * shrink), left = 10 + (side > 0 ? (full - w) : 0);
  const kw = (w - 9 * 6 - 12) / 10;
  return <div style={{ position: "absolute", left: 0, right: 0, top, bottom: 0, background: "#1a2140" }}>
    {shrink > 0.05 && <div style={{ position: "absolute", top: 120, left: side > 0 ? 18 : PW - 18 - 70, width: 70, height: 120, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center",
      opacity: shrink, background: arrowHi ? C.acc : "transparent", color: arrowHi ? C.bg : C.mut, fontFamily: fontSans, fontWeight: 700, fontSize: 56 }}>{side > 0 ? "‹" : "›"}</div>}
    <div style={{ position: "absolute", left, width: w, top: 16 }}>
      {KROWS.map((r) => <div key={r} style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 12 }}>
        {[...r].map((k) => <div key={k} style={{ width: kw, height: 66, borderRadius: 10, background: C.key, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fontSans, fontSize: 28, color: C.fg }}>{k}</div>)}</div>)}
      <div style={{ display: "flex", justifyContent: "center", gap: 6 }}>
        <div style={{ width: kw * 1.4, height: 66, borderRadius: 10, background: C.keyHi, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30 }}>🌐</div>
        <div style={{ flex: 1, height: 66, borderRadius: 10, background: C.key, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fontSans, fontSize: 24, color: C.mut }}>space</div>
        <div style={{ width: kw * 2.2, height: 66, borderRadius: 10, background: C.keyHi, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fontSans, fontSize: 22, color: C.fg }}>return</div></div>
    </div>
  </div>;
}
function Bubble({ text }: { text: string }) {
  const f = useCurrentFrame();
  return <div style={{ position: "absolute", top: 160, left: 26, right: 26 }}>
    <div style={{ display: "inline-block", maxWidth: 420, padding: "16px 22px", borderRadius: 26, background: "#2a3354", fontFamily: fontSans, fontSize: 30, color: C.fg }}>Where are you? Table's ready 🍝</div>
    <div style={{ position: "absolute", top: 330, left: 0, right: 0, padding: "18px 22px", borderRadius: 26, background: C.panel, fontFamily: fontSans, fontSize: 30, color: C.fg }}>{text}<span style={{ color: C.acc, opacity: f % 20 < 12 ? 1 : 0 }}>|</span></div>
  </div>;
}
function Popup({ pick }: { pick: number }) {
  const icons = ["⇤", "▭", "⇥"];
  return <div style={{ position: "absolute", left: 20, top: 600 - 130, display: "flex", gap: 14, padding: 14, borderRadius: 24, background: "#3a4670", zIndex: 6, boxShadow: "0 12px 40px rgba(0,0,0,.5)" }}>
    {icons.map((ic, i) => <div key={ic} style={{ width: 100, height: 84, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fontSans, fontWeight: 700, fontSize: 44,
      background: i === 2 && pick > 0.5 ? C.acc : i === 1 && pick <= 0.5 ? "#5a6698" : "transparent", color: i === 2 && pick > 0.5 ? C.bg : C.fg }}>{ic}</div>)}
  </div>;
}
/** mode "onehand" (iPhone). (no reveal) a thumb from the right edge strains for the Q | "hold" the globe key is held and the three
 *  layouts pop up | "pick" the finger slides to the right-hand layout and the keyboard squeezes right | "small" typing with every key in
 *  reach, arrow on the left | "back" the arrow is tapped and the keyboard goes full width again. */
export function PhoneOneHand({ v, dur }: { v: PhoneV; dur: number }) {
  const f = useCurrentFrame();
  const p = (a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: ease });
  const globe: [number, number] = [10 + 16 + 30, 600 + 16 + 3 * 78 + 33];
  if (!v.reveal) {
    const reach = Math.abs(Math.sin(f / 9));
    return <Frame label="Messages">
      <Bubble text="On my wa" /><OneKeyboard shrink={0} />
      <div style={{ position: "absolute", inset: 0, zIndex: 8 }}><Finger x={interpolate(reach, [0, 1], [PW - 70, 150])} y={interpolate(reach, [0, 1], [PH - 120, 650])} press={0} show={1} /></div>
      <div style={{ position: "absolute", left: 30, top: 640, width: 60, height: 70, borderRadius: 12, border: `3px dashed ${C.warn}`, zIndex: 7 }} />
      <Note text={v.note ?? "Thumb can't reach the Q."} good={false} bottom={420} />
    </Frame>;
  }
  if (v.reveal === "hold" || v.reveal === "pick") {
    const pickNow = v.reveal === "pick"; const pop = pickNow ? 1 : p(dur * 0.3, dur * 0.42);
    const slide = pickNow ? p(dur * 0.1, dur * 0.35) : 0; const sq = pickNow ? p(dur * 0.45, dur * 0.7) : 0;
    const fx = pickNow ? interpolate(slide, [0, 1], [globe[0], 20 + 14 + 2 * 114 + 50]) : interpolate(p(0, dur * 0.25), [0, 1], [PW * 0.7, globe[0]]);
    const fy = pickNow ? interpolate(slide, [0, 1], [globe[1], 600 - 130 + 56]) : interpolate(p(0, dur * 0.25), [0, 1], [PH - 140, globe[1]]);
    return <Frame label="Messages">
      <Bubble text="On my wa" /><OneKeyboard shrink={sq} />
      {pop > 0 && sq < 0.5 && <div style={{ opacity: pop }}><Popup pick={slide} /></div>}
      <div style={{ position: "absolute", inset: 0, zIndex: 8 }}><Finger x={fx} y={fy} press={sq > 0.5 ? 0 : (pickNow || f > dur * 0.25 ? 1 : 0)} show={1 - sq * 0.8} /></div>
      {!pickNow && <div style={{ position: "absolute", left: 40, top: 600 - 190, fontFamily: fontMono, fontSize: 24, color: C.acc, opacity: pop }}>hold 🌐</div>}
    </Frame>;
  }
  if (v.reveal === "back") {
    const grow = p(dur * 0.45, dur * 0.7);
    return <Frame label="Messages">
      <Bubble text="On my way, 5 min!" /><OneKeyboard shrink={1 - grow} arrowHi={f > dur * 0.35 && grow < 0.5} />
      <Tap x={18 + 35} y={600 + 180} at={0.35} dur={dur} />
    </Frame>;
  }
  // small
  const msg = "On my way, 5 min!"; const n = Math.floor(interpolate(f, [0, dur * 0.7], [8, msg.length], clamp));
  const k = Math.floor(f / 5); const press = f % 5 < 2 ? 1 : 0;
  const xs = [260, 420, 340, 520, 300, 460, 380];
  return <Frame label="Messages">
    <Bubble text={msg.slice(0, n)} /><OneKeyboard shrink={1} />
    <div style={{ position: "absolute", inset: 0, zIndex: 8 }}><Finger x={xs[k % xs.length]} y={650 + (k % 3) * 78} press={f < dur * 0.7 ? press : 0} show={1} /></div>
    {f > dur * 0.7 && <Note text={v.note ?? "Every key in reach."} good bottom={420} />}
  </Frame>;
}

/* ---------- Chatbot that asks first ---------- */
function Msg({ me, children, top, o = 1 }: { me?: boolean; children: React.ReactNode; top: number; o?: number }) {
  return <div style={{ position: "absolute", top, left: me ? 110 : 26, right: me ? 26 : 90, opacity: o, transform: `translateY(${(1 - o) * 20}px)`, display: "flex", justifyContent: me ? "flex-end" : "flex-start" }}>
    <div style={{ padding: "16px 22px", borderRadius: 24, background: me ? "#2f5bd3" : C.panel, fontFamily: fontSans, fontSize: 27, lineHeight: 1.35, color: C.fg }}>{children}</div></div>;
}
const LINE = "Before you answer, ask me up to 3 questions.";
/** mode "chat". (no reveal) "Plan me a weekend in Lisbon" gets a generic list | "rule" the one line on a big card | "line" the line is
 *  typed at the end of the prompt and sent | "asks" three short questions pop in | "fit" the answers go in and the plan fits them. */
export function PhoneChat({ v, dur }: { v: PhoneV; dur: number }) {
  const f = useCurrentFrame();
  const p = (a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: ease });
  const label = v.path[0] ?? "Chatbot";
  if (!v.reveal) {
    const a = p(dur * 0.2, dur * 0.35);
    return <Frame label={label}>
      <Msg me top={150}>Plan me a weekend in Lisbon</Msg>
      <Msg top={260} o={a}><div>Day 1: Visit the main sights and try the local food.</div><div style={{ marginTop: 10 }}>Day 2: Explore more neighbourhoods and enjoy the views.</div><div style={{ marginTop: 10 }}>Tip: Wear comfortable shoes!</div></Msg>
      {f > dur * 0.5 && <Note text={v.note ?? "Could be for anyone."} good={false} />}
    </Frame>;
  }
  if (v.reveal === "rule") {
    const pop = p(0, dur * 0.2);
    return <Frame label={label}>
      <div style={{ position: "absolute", top: 300, left: 36, right: 36, padding: "40px 34px", borderRadius: 30, background: C.panel, border: `4px solid ${C.acc}`, transform: `scale(${0.9 + 0.1 * pop})`, opacity: pop }}>
        <div style={{ fontFamily: fontMono, fontSize: 24, color: C.acc, marginBottom: 18 }}>add to the end of any prompt</div>
        <div style={{ fontFamily: fontSans, fontWeight: 700, fontSize: 44, lineHeight: 1.25, color: C.fg }}>"{LINE}"</div></div>
    </Frame>;
  }
  if (v.reveal === "line") {
    const n = Math.floor(interpolate(f, [dur * 0.05, dur * 0.65], [0, LINE.length], clamp)); const sent = f > dur * 0.8;
    return <Frame label={label}>
      {sent ? <Msg me top={150}>Plan me a weekend in Lisbon. <span style={{ background: "rgba(62,224,160,.35)", borderRadius: 6 }}>{LINE}</span></Msg> : null}
      {!sent && <div style={{ position: "absolute", left: 22, right: 22, bottom: 50, padding: "20px 24px", borderRadius: 28, background: C.panel, border: `3px solid ${C.acc}`, fontFamily: fontSans, fontSize: 28, lineHeight: 1.35, color: C.fg }}>
        Plan me a weekend in Lisbon. <span style={{ background: "rgba(62,224,160,.3)", borderRadius: 6 }}>{LINE.slice(0, n)}</span><span style={{ color: C.acc, opacity: f % 20 < 12 ? 1 : 0 }}>|</span>
        <div style={{ position: "absolute", right: 16, bottom: 14, width: 56, height: 56, borderRadius: 28, background: C.acc, color: C.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, fontWeight: 700 }}>↑</div></div>}
      {!sent && <Tap x={PW - 22 - 16 - 28 - 10} y={PH - 50 - 14 - 28 - 20} at={0.7} dur={dur} />}
    </Frame>;
  }
  if (v.reveal === "asks") {
    const qs = ["1. What's your budget?", "2. Who's coming?", "3. Beaches or museums?"];
    return <Frame label={label}>
      <Msg me top={150}>Plan me a weekend in Lisbon. Before you answer, ask me up to 3 questions.</Msg>
      <Msg top={340} o={p(dur * 0.05, dur * 0.15)}><div>Happy to. Quick ones first:</div>
        {qs.map((q, i) => <div key={q} style={{ marginTop: 12, opacity: p(dur * (0.15 + i * 0.18), dur * (0.25 + i * 0.18)), fontWeight: 700 }}>{q}</div>)}</Msg>
    </Frame>;
  }
  // fit
  const a = p(dur * 0.3, dur * 0.45);
  return <Frame label={label}>
    <Msg me top={150}>€400, me and two kids, beaches</Msg>
    <Msg top={260} o={a}><div><b>Sat:</b> train to Cascais, beach day, kids' menu lunch by the sand.</div><div style={{ marginTop: 10 }}><b>Sun:</b> Oceanário in the morning, tram 28 after.</div><div style={{ marginTop: 10 }}><b>Budget:</b> about €380 with the flat.</div></Msg>
    {f > dur * 0.6 && <Note text={v.note ?? "Now it's my weekend."} good />}
  </Frame>;
}


/* ---------- Mac Finder Path Bar ---------- */
const LW = 940, LH = 600;
type LaptopV = Extract<Visual, { type: "laptop" }>;
function Pointer({ x, y, press, show = 1 }: { x: number; y: number; press: number; show?: number }) {
  return <div style={{ position: "absolute", left: 0, top: 0, width: LW, height: LH, zIndex: 8 }}><Finger x={x} y={y} press={press} show={show} /></div>;
}
/** action "finderpath" (Mac). mode "lost": Finder open in a nested Downloads folder with no path bar and a confused note
 *  | "menu": View menu open, Show Path Bar highlighted and clicked | "bar": path bar visible at the bottom, pointer double-clicks Users. */
export function LaptopFinderPath({ v, dur }: { v: LaptopV; dur: number }) {
  const f = useCurrentFrame();
  const p = (a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: ease });
  const mode = v.mode ?? "lost";
  const crumbs = ["Macintosh HD", "Users", "alex", "Downloads", "Invoices"];
  const files = ["Q3-report.pdf", "receipt-4412.png", "photo-dump.zip", "notes.txt"];
  const menuBar = (
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 30, background: "rgba(20,28,54,.95)", display: "flex", alignItems: "center", gap: 22, padding: "0 18px", fontFamily: fontSans, fontSize: 18, color: C.fg, zIndex: 5 }}>
      <b>Finder</b><span>File</span><span>Edit</span><span style={{ color: mode === "menu" ? C.acc : C.fg }}>View</span><span>Go</span><span>Window</span>
    </div>
  );
  const sidebar = (
    <div style={{ position: "absolute", top: 30, left: 0, bottom: 0, width: 180, background: "#141c36", borderRight: "2px solid #2a3355", padding: "18px 14px", fontFamily: fontSans, fontSize: 22, color: C.mut }}>
      {["Favorites", "AirDrop", "Recents", "Downloads", "Documents"].map((n, i) => (
        <div key={n} style={{ padding: "10px 12px", borderRadius: 10, marginBottom: 4, background: n === "Downloads" ? "rgba(62,224,160,.16)" : "transparent", color: n === "Downloads" ? C.fg : C.mut }}>{i === 0 ? n : `📁 ${n}`}</div>
      ))}
    </div>
  );
  const titlebar = (
    <div style={{ position: "absolute", top: 30, left: 180, right: 0, height: 44, background: "#1a2340", display: "flex", alignItems: "center", gap: 10, padding: "0 18px", borderBottom: "2px solid #2a3355" }}>
      {["#ff5f57", "#febc2e", "#28c840"].map((c) => <div key={c} style={{ width: 14, height: 14, borderRadius: 7, background: c }} />)}
      <span style={{ marginLeft: 14, fontFamily: fontSans, fontSize: 24, color: C.fg }}>Invoices</span>
    </div>
  );
  const fileGrid = (
    <div style={{ position: "absolute", top: 90, left: 200, right: 24, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      {files.map((name) => (
        <div key={name} style={{ padding: "18px 16px", borderRadius: 14, background: C.panel, fontFamily: fontSans, fontSize: 24, color: C.fg }}>📄 {name}</div>
      ))}
    </div>
  );
  let pathBar = null as React.ReactNode;
  let menu = null as React.ReactNode;
  let note = "";
  let good = false;
  let fx = LW * 0.55, fy = LH * 0.45, press = 0, show = 0;

  if (mode === "lost") {
    note = v.items?.[0] ?? "Which Downloads is this?";
    show = 0;
  } else if (mode === "menu") {
    const open = p(dur * 0.1, dur * 0.25);
    const pick = p(dur * 0.45, dur * 0.55);
    press = interpolate(f, [dur * 0.5, dur * 0.55, dur * 0.62], [0, 1, 0], clamp);
    show = p(0, 6) * (1 - p(dur * 0.75, dur * 0.9));
    fx = interpolate(p(0, dur * 0.35), [0, 1], [500, 210]);
    fy = interpolate(p(0, dur * 0.35), [0, 1], [400, 168]);
    menu = (
      <div style={{ position: "absolute", top: 34, left: 150, width: 280, borderRadius: 12, background: "#232c4a", border: "2px solid #3a4670", padding: 10, opacity: open, zIndex: 6, fontFamily: fontSans, fontSize: 22, color: C.fg }}>
        {["as Icons", "as List", "as Columns", "Show Path Bar", "Show Status Bar"].map((row, i) => (
          <div key={row} style={{ padding: "10px 14px", borderRadius: 8, background: i === 3 && pick > 0.3 ? "rgba(62,224,160,.22)" : "transparent", color: i === 3 ? C.acc : C.fg }}>{row}</div>
        ))}
      </div>
    );
    note = "View › Show Path Bar";
    good = pick > 0.5;
  } else {
    // bar
    const jump = p(dur * 0.35, dur * 0.5);
    press = interpolate(f, [dur * 0.4, dur * 0.45, dur * 0.55], [0, 1, 0], clamp);
    show = p(0, 6) * (1 - p(dur * 0.7, dur * 0.85));
    fx = interpolate(p(0, dur * 0.3), [0, 1], [700, 310]);
    fy = interpolate(p(0, dur * 0.3), [0, 1], [300, LH - 36]);
    pathBar = (
      <div style={{ position: "absolute", left: 180, right: 0, bottom: 0, height: 48, background: "#141c36", borderTop: "2px solid #2a3355", display: "flex", alignItems: "center", gap: 8, padding: "0 16px", fontFamily: fontSans, fontSize: 20, color: C.fg, zIndex: 4 }}>
        {crumbs.map((c, i) => (
          <div key={c} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {i > 0 && <span style={{ color: C.mut }}>›</span>}
            <span style={{ padding: "4px 10px", borderRadius: 8, background: i === 1 && jump > 0.4 ? "rgba(62,224,160,.25)" : "transparent", border: i === 1 && jump > 0.4 ? `2px solid ${C.acc}` : "2px solid transparent" }}>{c}</span>
          </div>
        ))}
      </div>
    );
    note = jump > 0.5 ? "Jumped up to Users" : "Path bar is on";
    good = true;
  }

  return <div style={{ width: LW + 80, display: "flex", flexDirection: "column", alignItems: "center", marginTop: 40 }}>
    <div style={{ position: "relative", width: LW, height: LH, borderRadius: 26, border: "12px solid #2c3658", background: "linear-gradient(160deg,#2b3f7a,#14204a)", overflow: "hidden", boxShadow: "0 40px 100px rgba(0,0,0,.55)" }}>
      {menuBar}{sidebar}{titlebar}{fileGrid}{pathBar}{menu}
      {show > 0 && <Pointer x={fx} y={fy} press={press} show={show} />}
      {note && <div style={{ position: "absolute", bottom: mode === "bar" ? 60 : 20, left: 200, right: 24, padding: "12px", borderRadius: 14, textAlign: "center", background: good ? "rgba(62,224,160,.18)" : "rgba(255,107,107,.18)", border: `2px solid ${good ? C.acc : C.warn}`, fontFamily: fontMono, fontSize: 26, color: C.fg, zIndex: 7 }}>{note}</div>}
    </div>
    <div style={{ width: LW + 100, height: 26, borderRadius: "0 0 30px 30px", background: "#2c3658" }} />
  </div>;
}
