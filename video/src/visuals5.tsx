// More v3 mocks: an iPhone screen that keeps dimming (or holds steady), an Android lock screen with message previews
// (or hidden), and the Windows emoji / symbols panel in Notepad. The Caret T is always the pointer.
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

/** mode "dim": reading on an iPhone while the screen slowly darkens. reveal "steady" holds the brightness where it was set. */
export function PhoneDim({ v, dur }: { v: PhoneV; dur: number }) {
  const f = useCurrentFrame();
  const p = (a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: ease });
  const steady = v.reveal === "steady";
  const level = steady ? interpolate(p(dur * 0.1, dur * 0.4), [0, 1], [0.3, 0.75]) : interpolate(p(4, dur * 0.85), [0, 1], [0.75, 0.2]);
  const shade = (1 - level) * 0.8;
  const pct = Math.round(level * 100);
  const drag = steady ? p(dur * 0.1, dur * 0.4) : 0;
  const barTop = 200, barH = 420, sx = PW - 70;
  return <Frame label={v.path[0] ?? "reading in bed"} bg="#18213d">
    <div style={{ position: "absolute", top: 140, left: 40, right: 110, fontFamily: fontSans, fontWeight: 700, fontSize: 44, color: C.fg }}>Chapter 3</div>
    {Array.from({ length: 11 }, (_, i) => <div key={i} style={{ position: "absolute", top: 230 + i * 56, left: 40, width: [420, 380, 440, 400, 300, 430, 410, 360, 440, 390, 260][i], height: 22, borderRadius: 8, background: "#5a6690" }} />)}
    <div style={{ position: "absolute", inset: 0, background: `rgba(0,0,0,${shade})` }} />
    <div style={{ position: "absolute", left: sx - 30, top: barTop, width: 60, height: barH, borderRadius: 30, background: "rgba(255,255,255,.14)", overflow: "hidden", zIndex: 3 }}>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: barH * level, background: steady ? C.acc : "#ffc857" }} />
    </div>
    <div style={{ position: "absolute", left: sx - 30, top: barTop + barH + 14, width: 60, textAlign: "center", fontFamily: fontMono, fontSize: 24, color: C.fg, zIndex: 3 }}>{`${pct}%`}</div>
    <Note text={v.note ?? (steady ? "Auto-Brightness off · stays put" : `dimming by itself · ${pct}%`)} good={steady} />
    {steady && <div style={{ position: "absolute", inset: 0, zIndex: 4 }}><Finger x={sx} y={barTop + barH * (1 - level)} press={drag > 0 && drag < 1 ? 1 : 0} show={p(0, 6)} /></div>}
  </Frame>;
}

/** mode "lock": Android lock screen with message previews anyone can read. reveal "hidden" fades the previews out. */
export function PhoneLock({ v, dur }: { v: PhoneV; dur: number }) {
  const f = useCurrentFrame();
  const p = (a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: ease });
  const hidden = v.reveal === "hidden";
  const cards = [["Messages · Mum", "Your bank PIN is 4471, don't lose it"], ["Bank", "Your login code is 482913"], ["Dr. Patel", "Your test results are in"]];
  const gone = hidden ? p(dur * 0.3, dur * 0.5) : 0;
  const peek = hidden ? 0 : p(dur * 0.45, dur * 0.6);
  return <Frame bg="#0a0f1f">
    <div style={{ position: "absolute", top: 110, width: "100%", textAlign: "center", fontFamily: fontSans, fontWeight: 700, fontSize: 130, color: C.fg }}>9:41</div>
    <div style={{ position: "absolute", top: 270, width: "100%", textAlign: "center", fontFamily: fontSans, fontSize: 30, color: C.mut }}>Fri, 23 Oct · locked</div>
    {cards.map(([app, text], i) => { const inn = hidden ? 1 : p(4 + i * 8, 14 + i * 8);
      return <div key={app} style={{ position: "absolute", top: 360 + i * 150, left: 30, right: 30, height: 130, borderRadius: 28, padding: "18px 24px", background: "#1c2440",
        opacity: inn * (1 - gone), transform: `translateY(${(1 - inn) * 30 - gone * 20}px)`, border: peek > 0.5 && i === 0 ? `3px solid ${C.warn}` : "3px solid transparent" }}>
        <div style={{ fontFamily: fontMono, fontSize: 24, color: C.mut }}>{app}</div>
        <div style={{ fontFamily: fontSans, fontSize: 32, color: C.fg, marginTop: 10, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{text}</div>
      </div>; })}
    {(hidden ? gone > 0.5 : peek > 0) && <Note text={v.note ?? (hidden ? "Nothing on show until you unlock" : "Anyone at the table can read this")} good={hidden} />}
    {!hidden && <div style={{ position: "absolute", inset: 0 }}><Finger x={interpolate(peek, [0, 1], [PW * 0.75, PW * 0.6])} y={interpolate(peek, [0, 1], [PH - 140, 460])} press={0} show={peek} /></div>}
  </Frame>;
}

/** action "emoji": Notepad on Windows 11. mode hunt (googling how to type a symbol) | keys (Win + . opens the panel on the emoji tab)
 *  | tab (the caret clicks the symbols tab) | pick (the caret clicks the em dash and it lands in the text). keys overrides the keycaps. */
export function LaptopEmoji({ v, dur }: { v: LaptopV; dur: number }) {
  const f = useCurrentFrame();
  const p = (a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: ease });
  const mode = v.mode ?? "keys";
  const syms = v.items ?? ["—", "–", "é", "©", "€", "→", "°", "½", "±", "×", "✓", "™"];
  const panel = mode === "hunt" ? 0 : mode === "keys" ? p(dur * 0.3, dur * 0.45) : 1;
  const onSymbols = mode === "pick" || (mode === "tab" && f > dur * 0.5);
  const keyOn = mode === "keys" && f > 6 && f < dur * 0.6 ? 1 : 0;
  const px = 430, py = 120, pw = 470, cell = 98;
  const tabX = px + 340, tabY = py + 40;
  const pickIdx = 0, cellX = (i: number) => px + 22 + (i % 4) * (cell + 10) + cell / 2, cellY = (i: number) => py + 96 + Math.floor(i / 4) * (cell - 6) + cell / 2 - 10;
  let fx = LW * 0.6, fy = LH * 0.8, press = 0, show = 0;
  if (mode === "tab") { const m = p(0, dur * 0.4); show = p(0, 6); fx = interpolate(m, [0, 1], [LW * 0.55, tabX]); fy = interpolate(m, [0, 1], [LH * 0.85, tabY]); press = interpolate(f, [dur * 0.42, dur * 0.48, dur * 0.56], [0, 1, 0], clamp); }
  if (mode === "pick") { const m = p(0, dur * 0.4); show = p(0, 6); fx = interpolate(m, [0, 1], [LW * 0.5, cellX(pickIdx)]); fy = interpolate(m, [0, 1], [LH * 0.85, cellY(pickIdx)]); press = interpolate(f, [dur * 0.42, dur * 0.48, dur * 0.56], [0, 1, 0], clamp); }
  const picked = mode === "pick" && f > dur * 0.48;
  const doc = `Notes:\nMeeting moved to 3pm${picked ? ` ${syms[pickIdx]} ` : " "}`;
  const searches = Math.min(3, 1 + Math.floor(f / 30));
  return <div style={{ width: LW + 80, display: "flex", flexDirection: "column", alignItems: "center", marginTop: 40 }}>
    <div style={{ position: "relative", width: LW, height: LH, borderRadius: 26, border: "12px solid #2c3658", background: "#0f1730", overflow: "hidden", boxShadow: "0 40px 100px rgba(0,0,0,.55)" }}>
      <div style={{ height: 44, background: "#1a2340", display: "flex", alignItems: "center", padding: "0 20px", fontFamily: fontMono, fontSize: 22, color: C.mut }}>Notepad · Windows 11</div>
      <div style={{ padding: "24px 30px", fontFamily: fontSans, fontSize: 32, lineHeight: 1.4, color: C.fg, whiteSpace: "pre-wrap" }}>{doc}<span style={{ display: "inline-block", width: 4, height: 34, background: C.acc, verticalAlign: "-6px", opacity: f % 24 < 14 ? 1 : 0 }} /></div>
      {mode === "hunt" && <div style={{ position: "absolute", top: 200, left: 30, right: 30 }}>
        {["how to type an em dash on windows", "how to type é on a keyboard", "copy paste © symbol"].slice(0, searches).map((s, i) =>
          <div key={s} style={{ marginBottom: 14, padding: "14px 20px", borderRadius: 14, background: "#1c2440", border: "2px solid #3a4670", fontFamily: fontSans, fontSize: 28, color: C.fg }}>{`Google: ${s}`}</div>)}
        <div style={{ marginTop: 6, padding: "14px 20px", borderRadius: 14, background: "rgba(255,107,107,.18)", border: `2px solid ${C.warn}`, fontFamily: fontMono, fontSize: 24, color: C.fg }}>{`copy, switch back, paste · try ${searches}`}</div>
      </div>}
      {panel > 0 && <div style={{ position: "absolute", left: px, top: py, width: pw, borderRadius: 18, background: "#1c2440", border: "2px solid #3a4670", padding: "14px 22px 18px", opacity: panel, transform: `scale(${0.85 + 0.15 * panel})`, transformOrigin: "0 0" }}>
        <div style={{ display: "flex", gap: 14, alignItems: "center", fontFamily: fontMono, fontSize: 22, marginBottom: 14 }}>
          {["Emoji", "GIF", "Ω Symbols"].map((t, i) => { const on = onSymbols ? i === 2 : i === 0;
            return <div key={t} style={{ padding: "8px 14px", borderRadius: 10, background: on ? "rgba(62,224,160,.2)" : "transparent", color: on ? C.acc : C.mut, border: on ? `2px solid ${C.acc}` : "2px solid transparent" }}>{t}</div>; })}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {Array.from({ length: 12 }, (_, i) => { const hit = picked && i === pickIdx;
            return <div key={i} style={{ width: cell, height: cell - 16, borderRadius: 14, background: hit ? "rgba(62,224,160,.25)" : "#232c4a", border: hit ? `2px solid ${C.acc}` : "2px solid transparent",
              display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fontSans, fontWeight: 700, fontSize: 44, color: C.fg }}>
              {onSymbols ? syms[i % syms.length] : <div style={{ width: 52, height: 52, borderRadius: 26, background: ["#ffc857", "#ffb340", "#ffd36b"][i % 3], position: "relative" }}>
                <div style={{ position: "absolute", top: 16, left: 14, width: 7, height: 9, borderRadius: 4, background: "#3a2a00" }} /><div style={{ position: "absolute", top: 16, right: 14, width: 7, height: 9, borderRadius: 4, background: "#3a2a00" }} />
                <div style={{ position: "absolute", bottom: 11, left: 15, width: 22, height: 10, borderRadius: "0 0 12px 12px", background: "#3a2a00" }} /></div>}
            </div>; })}
        </div>
      </div>}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 44, background: "#141c36", display: "flex", justifyContent: "center", alignItems: "center", gap: 14 }}>
        {[0, 1, 2, 3, 4].map((i) => <div key={i} style={{ width: 26, height: 26, borderRadius: 6, background: i === 0 ? "#4da3ff" : "#2f3a5e" }} />)}
      </div>
      {show > 0 && <div style={{ position: "absolute", left: 0, top: 0, width: LW, height: LH }}><Finger x={fx} y={fy} press={press} show={show} /></div>}
    </div>
    <div style={{ width: LW + 100, height: 26, borderRadius: "0 0 30px 30px", background: "#2c3658" }} />
    {mode === "keys" && <div style={{ display: "flex", gap: 22, marginTop: 50, alignItems: "center" }}>
      {(v.keys ?? ["⊞ Win", "."]).map((k, i) => <div key={k} style={{ display: "flex", alignItems: "center", gap: 22 }}>{i > 0 && <span style={{ color: C.mut, fontSize: 56, fontFamily: fontSans }}>+</span>}
        <div style={{ padding: "26px 40px", minWidth: 60, textAlign: "center", borderRadius: 22, background: keyOn ? C.acc : C.key, color: keyOn ? C.bg : C.fg, fontFamily: fontSans, fontWeight: 700, fontSize: 54,
          boxShadow: `0 ${keyOn ? 4 : 10}px 0 #0a0f1e`, transform: `translateY(${keyOn ? 6 : 0}px)` }}>{k}</div></div>)}
    </div>}
  </div>;
}
