// More v3 phone mocks: Build number tapped 7 times, Developer options animation scales, an app opening in slow motion,
// and a phone charging past (or stopping at) a charge limit. The Caret T is always the pointer.
import { interpolate, useCurrentFrame, Easing } from "remotion";
import { C, clamp } from "./theme";
import { fontMono, fontSans } from "./fonts";
import { Finger } from "./visuals";
import type { Visual } from "./types";

const ease = Easing.inOut(Easing.cubic);
const PW = 620, PH = 1000;
type PhoneV = Extract<Visual, { type: "phone-settings" }>;

function Frame({ children, label, bg = "#0e1428" }: { children: React.ReactNode; label?: string; bg?: string }) {
  return <div style={{ position: "relative", width: PW, height: PH, borderRadius: 72, background: bg, border: "10px solid #2c3658", boxShadow: "0 40px 100px rgba(0,0,0,.55)", overflow: "hidden" }}>
    <div style={{ position: "absolute", top: 18, left: PW / 2 - 70, width: 140, height: 34, borderRadius: 20, background: "#000" }} />
    {label && <div style={{ position: "absolute", top: 82, left: 34, fontFamily: fontMono, fontSize: 26, color: C.mut }}>{label}</div>}
    {children}
  </div>;
}
function Title({ text }: { text: string }) {
  return <div style={{ position: "absolute", top: 140, left: 34, fontFamily: fontSans, fontWeight: 700, fontSize: 52, color: C.fg }}>{text}</div>;
}
const rowStyle = (hit: boolean, top: number): React.CSSProperties => ({ position: "absolute", top, left: 26, right: 26, height: 92, borderRadius: 22, padding: "0 28px", display: "flex", alignItems: "center",
  justifyContent: "space-between", background: hit ? "rgba(62,224,160,.16)" : C.panel, border: hit ? `3px solid ${C.acc}` : "3px solid transparent", fontFamily: fontSans, fontSize: 34, color: C.fg });

/** mode "taps": the caret taps the tap row seven times; a toast counts down to "You are now a developer!". */
export function PhoneTaps({ v, dur }: { v: PhoneV; dur: number }) {
  const f = useCurrentFrame();
  const p = (a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: ease });
  const rows = v.rows; const ti = Math.max(0, rows.indexOf(v.tap ?? rows[rows.length - 1]));
  const rowY = (i: number) => 230 + i * 104;
  const move = p(0, dur * 0.2); const t0 = dur * 0.22, t1 = dur * 0.78; const per = (t1 - t0) / 7;
  const taps = f < t0 ? 0 : Math.min(7, 1 + Math.floor((f - t0) / per));
  const press = f >= t0 && f < t1 ? interpolate((f - t0) % per, [0, per * 0.3, per * 0.8], [0, 1, 0], clamp) : 0;
  const done = taps >= 7 && f > t1 - per * 0.2;
  const toast = taps === 0 ? "" : done ? "You are now a developer!" : `You are now ${7 - taps} step${7 - taps === 1 ? "" : "s"} away from being a developer.`;
  const fx = interpolate(move, [0, 1], [PW * 0.75, PW * 0.64]), fy = interpolate(move, [0, 1], [PH - 160, rowY(ti) + 46]);
  return <Frame label={v.path.join(" › ")}>
    <Title text={v.path[v.path.length - 1]} />
    {rows.map((r, i) => <div key={r} style={rowStyle(i === ti && taps > 0, rowY(i))}><span>{r}</span>
      {i === ti && taps > 0 ? <span style={{ fontFamily: fontMono, fontSize: 30, color: C.acc }}>{`×${taps}`}</span> : <span style={{ color: C.mut, fontSize: 28 }}>{i === ti ? "BP2A.250805" : ""}</span>}</div>)}
    {toast && <div style={{ position: "absolute", bottom: 60, left: 40, right: 40, padding: "18px 24px", borderRadius: 40, textAlign: "center", background: done ? "rgba(62,224,160,.22)" : "#2a3354",
      border: done ? `3px solid ${C.acc}` : "3px solid transparent", fontFamily: fontSans, fontSize: done ? 34 : 28, fontWeight: done ? 700 : 400, color: done ? C.acc : C.fg }}>{toast}</div>}
    <Finger x={fx} y={fy} press={press} show={p(0, 6)} />
  </Frame>;
}

/** mode "scales": the three Developer options animation scales flip from 1x to 0.5x one after another. */
export function PhoneScales({ v, dur }: { v: PhoneV; dur: number }) {
  const f = useCurrentFrame();
  const p = (a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: ease });
  const rows = v.rows.length ? v.rows : ["Window animation scale", "Transition animation scale", "Animator duration scale"];
  const rowY = (i: number) => 300 + i * 150;
  const at = (i: number) => dur * (0.18 + i * 0.24); // when row i is tapped
  const k = rows.findIndex((_, i) => f < at(i) + dur * 0.06); const cur = k < 0 ? rows.length - 1 : k;
  const prev = Math.max(0, cur - 1);
  const mv = cur === 0 ? p(0, at(0)) : p(at(prev) + dur * 0.08, at(cur));
  const fromY = cur === 0 ? PH - 160 : rowY(prev) + 70, toY = rowY(cur) + 70;
  const fx = interpolate(mv, [0, 1], [cur === 0 ? PW * 0.75 : PW - 95, PW - 95]); const fy = interpolate(mv, [0, 1], [fromY, toY]);
  const press = Math.max(...rows.map((_, i) => interpolate(f, [at(i) - 2, at(i) + 2, at(i) + 7], [0, 1, 0], clamp)));
  return <Frame label={v.path.join(" › ")}>
    <Title text={v.path[v.path.length - 1] ?? "Developer options"} />
    <div style={{ position: "absolute", top: 230, left: 34, fontFamily: fontMono, fontSize: 24, color: C.acc }}>DRAWING</div>
    {rows.map((r, i) => { const set = f >= at(i) + 2;
      return <div key={r} style={{ ...rowStyle(set, rowY(i)), height: 124, flexDirection: "column", alignItems: "flex-start", justifyContent: "center", gap: 6 }}>
        <span style={{ fontSize: 32 }}>{r}</span>
        <span style={{ fontFamily: fontMono, fontSize: 30, color: set ? C.acc : C.mut }}>{set ? "Animation scale .5x" : "Animation scale 1x"}</span>
      </div>; })}
    <Finger x={fx} y={fy} press={press} show={p(0, 6)} />
  </Frame>;
}

/** mode "slowmo": an app zooms open from the home screen. Without reveal it crawls (1x, a beat too long);
 *  reveal "fast" plays it at half the time and loops. */
export function PhoneSlowmo({ v, dur }: { v: PhoneV; dur: number }) {
  const f = useCurrentFrame();
  const fast = v.reveal === "fast";
  const cycle = fast ? 16 : 34; const hold = fast ? 10 : 18; const len = cycle + hold;
  const t = f % len; const o = interpolate(t, [4, 4 + cycle], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const icon = { x: 2 * 140 + 60, y: 420, s: 96 };
  const x = interpolate(o, [0, 1], [icon.x, 0]), y = interpolate(o, [0, 1], [icon.y, 0]);
  const w = interpolate(o, [0, 1], [icon.s, PW - 20]), h = interpolate(o, [0, 1], [icon.s, PH - 20]);
  const colors = ["#4da3ff", "#21a366", "#ff8a5c", "#8a7cff", "#ffc857", "#5865f2", "#ff6b6b", "#3ee0a0"];
  const ms = Math.round((fast ? 175 : 350) * Math.min(1, t / (4 + cycle)));
  return <Frame label={v.path[0] ?? "Home · Android"}>
    {Array.from({ length: 12 }, (_, i) => <div key={i} style={{ position: "absolute", left: 60 + (i % 4) * 140, top: 180 + Math.floor(i / 4) * 240, width: 96, height: 96, borderRadius: 30, background: colors[i % colors.length], opacity: 0.85 }} />)}
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: interpolate(o, [0, 1], [30, 60]), background: "#1c2440", border: `3px solid ${colors[2]}`, overflow: "hidden" }}>
      {o > 0.6 && <div style={{ padding: 60, paddingTop: 120, opacity: interpolate(o, [0.6, 1], [0, 1]), fontFamily: fontSans, fontWeight: 700, fontSize: 48, color: C.fg }}>{v.note ?? "Messages"}
        {[0, 1, 2, 3].map((i) => <div key={i} style={{ marginTop: 34, width: [420, 340, 380, 260][i], height: 28, borderRadius: 10, background: "#2a3354" }} />)}</div>}
    </div>
    <div style={{ position: "absolute", bottom: 60, left: 30, right: 30, padding: "18px 22px", borderRadius: 18, background: fast ? "rgba(62,224,160,.18)" : "rgba(255,107,107,.18)",
      border: `2px solid ${fast ? C.acc : C.warn}`, fontFamily: fontMono, fontSize: 28, color: C.fg }}>{`${fast ? "animation .5x" : "animation 1x"} · ${ms} ms`}</div>
    <Finger x={icon.x + 48} y={icon.y + 48} press={interpolate(t, [0, 3, 8], [0, 1, 0], clamp)} show={interpolate(t, [0, 2, cycle * 0.5, cycle * 0.5 + 4], [0, 1, 1, 0], clamp)} />
  </Frame>;
}

/** mode "charge": plugged in overnight. Without reveal the battery fills to 100% and sits there warm;
 *  reveal "limit" fills to 80% and holds with "Charging on hold". */
export function PhoneCharge({ v, dur }: { v: PhoneV; dur: number }) {
  const f = useCurrentFrame();
  const limit = v.reveal === "limit";
  const target = limit ? 80 : 100;
  const pct = Math.round(interpolate(f, [4, dur * 0.65], [62, target], { ...clamp, easing: Easing.out(Easing.cubic) }));
  const full = pct >= target;
  const clock = `0${Math.min(6, 1 + Math.floor(interpolate(f, [0, dur], [0, 6], clamp)))}:${String(Math.floor((f * 7) % 60)).padStart(2, "0")}`;
  const col = limit ? C.acc : full ? C.warn : C.acc;
  return <Frame bg="#070b16">
    <div style={{ position: "absolute", top: 120, width: "100%", textAlign: "center", fontFamily: fontSans, fontWeight: 700, fontSize: 120, color: C.fg }}>{clock}</div>
    <div style={{ position: "absolute", top: 270, width: "100%", textAlign: "center", fontFamily: fontMono, fontSize: 26, color: C.mut }}>{v.path[0] ?? "plugged in all night"}</div>
    <div style={{ position: "absolute", top: 400, left: PW / 2 - 150, width: 300, height: 140, borderRadius: 28, border: `8px solid ${col}`, padding: 10 }}>
      <div style={{ width: `${pct}%`, height: "100%", borderRadius: 16, background: col, opacity: 0.9 }} />
      <div style={{ position: "absolute", right: -26, top: 40, width: 16, height: 44, borderRadius: 6, background: col }} />
    </div>
    <div style={{ position: "absolute", top: 580, width: "100%", textAlign: "center", fontFamily: fontSans, fontWeight: 800, fontSize: 84, color: col }}>{`${pct}%`}</div>
    {full && <div style={{ position: "absolute", bottom: 80, left: 40, right: 40, padding: "18px 22px", borderRadius: 18, textAlign: "center", background: limit ? "rgba(62,224,160,.18)" : "rgba(255,107,107,.18)",
      border: `2px solid ${limit ? C.acc : C.warn}`, fontFamily: fontSans, fontSize: 30, color: C.fg }}>{v.note ?? (limit ? "Charging on hold at 80%" : "Sitting at 100% for 5 hours · warm")}</div>}
  </Frame>;
}
