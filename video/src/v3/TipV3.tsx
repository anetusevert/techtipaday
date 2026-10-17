import { AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import type { ReactNode } from "react";
import { fDisplay, fMono, fSans } from "./fonts";
import { VisualView } from "../visuals";
import { CaretT } from "../CaretT";
import type { Beat, Piece, V3Props } from "./types";

// Palette: brand navy + caret mint, plus one colour per beat (the pills).
export const K = { bg: "#0b1020", ink: "#eef1f8", mut: "#8f99b3", mint: "#3ee0a0", sel: "rgba(62,224,160,.28)",
  beat: { hook: "#ff6b6b", do: "#3ee0a0", steps: "#6aa8ff", result: "#ffc857", cta: "#3ee0a0" } as Record<Beat, string> };
const LABEL: Record<Beat, string> = { hook: "SOUND FAMILIAR?", do: "DO THIS", steps: "HOW", result: "RESULT", cta: "" };
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** The one spring for every entrance: scale-in + fade. */
export function pop(frame: number, fps: number, delay = 0, damping = 12) {
  return spring({ frame: frame - delay, fps, config: { stiffness: 180, mass: 0.7, damping } });
}
const blinkOn = (f: number) => (f % 24 < 14 ? 1 : 0);

function Caret({ h = 80, color = K.mint }: { h?: number; color?: string }) {
  const f = useCurrentFrame();
  return <span style={{ display: "inline-block", width: h * 0.12, height: h, background: color, borderRadius: 3, marginLeft: 6, verticalAlign: "-0.12em", opacity: blinkOn(f), boxShadow: `0 0 18px ${color}` }} />;
}

function Pill({ beat, children }: { beat: Beat; children: ReactNode }) {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const s = pop(f, fps);
  const c = K.beat[beat];
  return <div style={{ display: "inline-flex", alignItems: "center", gap: 14, padding: "12px 26px 12px 20px", borderRadius: 14, background: `${c}22`, border: `3px solid ${c}`,
    color: c, fontFamily: fMono, fontWeight: 700, fontSize: 34, letterSpacing: 2, transform: `scale(${s})`, transformOrigin: "left center", opacity: s }}>
    <span style={{ width: 12, height: 38, background: c, borderRadius: 2, opacity: blinkOn(f) }} />{children}</div>;
}

/** Hook: words pop in one by one over ~75% of the scene; the last word gets a text-selection highlight. */
function HookText({ text, dur }: { text: string; dur: number }) {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const words = text.split(" "); const per = (dur * 0.75) / words.length;
  return <div style={{ fontFamily: fDisplay, fontWeight: 800, fontSize: 92, lineHeight: 1.06, letterSpacing: -2, color: K.ink }}>
    {words.map((w, i) => { const s = pop(f, fps, i * per); const last = i === words.length - 1;
      return <span key={i} style={{ display: "inline-block", marginRight: 22, transform: `scale(${0.6 + 0.4 * s})`, opacity: Math.min(1, s * 1.4),
        background: last && s > 0.5 ? K.sel : "transparent", color: last ? K.mint : K.ink, borderRadius: 10, padding: last ? "0 10px" : 0 }}>{w}</span>; })}
    <Caret h={84} />
  </div>;
}

/** Steps: mono, typed char by char, numbered. */
function StepText({ text, step, total }: { text: string; step?: number; total: number }) {
  const f = useCurrentFrame();
  const n = Math.floor(interpolate(f, [4, 4 + text.length * 0.9], [0, text.length], clamp));
  return <div>
    <div style={{ fontFamily: fMono, fontSize: 36, color: K.beat.steps, marginBottom: 12 }}>{`> step ${step}/${total}`}</div>
    <div style={{ fontFamily: fSans, fontWeight: 700, fontSize: 68, lineHeight: 1.12, color: K.ink, letterSpacing: -1 }}>{text.slice(0, n)}<Caret h={66} color={K.beat.steps} /></div>
  </div>;
}

function DoText({ text }: { text: string }) {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const s = pop(f, fps, 3, 10);
  return <div style={{ fontFamily: fDisplay, fontWeight: 800, fontSize: 104, lineHeight: 1.02, letterSpacing: -2, color: K.ink, transform: `scale(${0.7 + 0.3 * s})`, transformOrigin: "left center", opacity: s }}>{text}</div>;
}

/** Result: before/after rows then a burst headline. */
function ResultCard({ r, dur }: { r: NonNullable<Piece["result"]>; dur: number }) {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const a = pop(f, fps, 0), b = pop(f, fps, 10), h = pop(f, fps, Math.min(22, dur * 0.35), 9);
  const row = (s: number, label: string, word: string, good: boolean) => (
    <div style={{ display: "flex", alignItems: "center", gap: 30, padding: "30px 40px", borderRadius: 28, background: good ? "rgba(62,224,160,.12)" : "rgba(255,107,107,.10)",
      border: `3px solid ${good ? K.mint : "#ff6b6b"}`, transform: `scale(${s})`, opacity: s, marginBottom: 24 }}>
      <span style={{ fontFamily: fMono, fontSize: 34, color: K.mut, width: 170 }}>{label}</span>
      <span style={{ fontFamily: fDisplay, fontWeight: 800, fontSize: 84, color: good ? K.mint : "#ff6b6b", textDecoration: good ? "none" : "line-through", textDecorationThickness: 6 }}>{word}</span>
      {good && <Caret h={80} />}
    </div>);
  return <div style={{ width: 920 }}>
    {row(a, "BEFORE", r.before, false)}
    {row(b, "AFTER", r.after, true)}
    <div style={{ marginTop: 70, textAlign: "center", fontFamily: fDisplay, fontWeight: 800, fontSize: 120, lineHeight: 1, letterSpacing: -3, color: K.ink,
      transform: `scale(${0.4 + 0.6 * h})`, opacity: h }}>
      <span style={{ background: K.sel, borderRadius: 18, padding: "6px 22px", boxDecorationBreak: "clone", WebkitBoxDecorationBreak: "clone" }}>{r.headline}</span></div>
  </div>;
}

function CtaCard({ url }: { url: string }) {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const s = pop(f, fps, 0, 10);
  const cur = f < 6 ? 0 : f < 30 ? (Math.floor((f - 6) / 6) % 2 === 0 ? 1 : 0) : blinkOn(f);
  const pulse = 1 + 0.025 * Math.sin(f / 7);
  return <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", transform: `scale(${(0.8 + 0.2 * s) * pulse})`, opacity: s, paddingBottom: 160 }}>
    <div style={{ filter: "drop-shadow(0 30px 70px rgba(62,224,160,.25))" }}><CaretT size={340} cursor={cur} /></div>
    <div style={{ fontFamily: fDisplay, fontWeight: 800, fontSize: 110, color: K.ink, letterSpacing: -3, marginTop: 40 }}>TechTip<span style={{ color: K.mint }}>ADay</span></div>
    <div style={{ fontFamily: fSans, fontWeight: 500, fontSize: 52, color: K.ink, marginTop: 18 }}>One tech tip a day</div>
    <div style={{ fontFamily: fMono, fontWeight: 700, fontSize: 50, color: K.bg, background: K.mint, padding: "16px 36px", borderRadius: 16, marginTop: 40 }}>techtipaday.com</div>
  </AbsoluteFill>;
}

/** Text layer for one piece, with a short scale/fade exit. */
function PieceScene({ p, dur, totalSteps, showLabel }: { p: Piece; dur: number; totalSteps: number; showLabel: boolean }) {
  const f = useCurrentFrame();
  const out = interpolate(f, [dur - 6, dur], [1, 0], clamp); const sc = interpolate(f, [dur - 6, dur], [1, 0.94], clamp);
  if (p.beat === "cta") return <CtaCard url="" />;
  return <AbsoluteFill style={{ opacity: out, transform: `scale(${sc})` }}>
    <div style={{ position: "absolute", top: 250, left: 80, right: 80 }}>
      {showLabel && <div style={{ marginBottom: 34 }}><Pill beat={p.beat}>{LABEL[p.beat]}</Pill></div>}
      {!showLabel && <div style={{ height: 96 }} />}
      {p.beat === "hook" && <HookText text={p.text} dur={dur} />}
      {p.beat === "do" && <DoText text={p.text} />}
      {p.beat === "steps" && <StepText text={p.text} step={p.step} total={totalSteps} />}
    </div>
    {p.beat === "result" && p.result && <div style={{ position: "absolute", top: 560, left: 80, right: 80, display: "flex", justifyContent: "center" }}><ResultCard r={p.result} dur={dur} /></div>}
  </AbsoluteFill>;
}

function Sfx({ name, at, volume = 0.5 }: { name: string; at: number; volume?: number }) {
  return <Sequence from={Math.max(0, Math.round(at))} durationInFrames={120} layout="none"><Audio src={staticFile(`audio/${name}.mp3`)} volume={volume} /></Sequence>;
}

/** Intro sting visual: cursor blinks twice on black, then the frame opens. */
function Intro({ until }: { until: number }) {
  const f = useCurrentFrame();
  const o = interpolate(f, [until - 6, until], [1, 0], clamp);
  return <AbsoluteFill style={{ background: K.bg, alignItems: "center", justifyContent: "center", opacity: o }}>
    <div style={{ width: 34, height: 230, borderRadius: 6, background: K.mint, boxShadow: `0 0 50px ${K.mint}`, opacity: f % 12 < 7 ? 1 : 0.1, transform: `scaleY(${1 + f / 60})` }} />
  </AbsoluteFill>;
}

export function TipV3(p: V3Props) {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const ps = p.pieces;
  const end = (i: number) => ps[i + 1]?.start ?? p.total;
  const totalSteps = ps.filter((x) => x.beat === "steps").length;
  const resultAt = ps.find((x) => x.beat === "result")?.start ?? p.voEnd;
  const ctaAt = ps.find((x) => x.beat === "cta")?.start ?? p.voEnd;
  const beatOrder: Beat[] = ["hook", "do", "steps", "result", "cta"];
  const curBeat = ps.filter((x) => x.start <= f).at(-1)?.beat ?? "hook";
  const phoneIn = pop(f, fps, ps[0].start + 4);
  const phoneOut = interpolate(f, [resultAt - 6, resultAt], [1, 0], clamp);
  const bed = interpolate(f, [0, p.voStart, p.voStart + 6, p.voEnd, p.voEnd + 10, p.total - 24, p.total], [0.5, 0.5, 0.1, 0.1, 0.3, 0.3, 0], clamp);
  const hook = ps[0];
  const hookWords = hook.text.split(" ").length; const hookPer = ((end(0) - hook.start) * 0.75) / hookWords;
  const introEnd = ps[0].start;
  return (
    <AbsoluteFill style={{ background: K.bg }}>
      {/* signature backdrop: faint text-line grid + mint glow */}
      <AbsoluteFill style={{ backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,.035) 0 2px, transparent 2px 96px)", }} />
      <AbsoluteFill style={{ background: `radial-gradient(circle at 80% 8%, ${K.beat[curBeat]}26 0%, transparent 45%), radial-gradient(circle at 10% 95%, rgba(62,224,160,.12) 0%, transparent 40%)` }} />
      {/* header */}
      {f < ctaAt && <div style={{ position: "absolute", top: 96, left: 80, right: 80, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}><CaretT size={70} cursor={blinkOn(f)} />
          <span style={{ fontFamily: fDisplay, fontWeight: 800, fontSize: 48, color: K.ink, letterSpacing: -1 }}>TechTip<span style={{ color: K.mint }}>ADay</span></span></div>
        <span style={{ fontFamily: fMono, fontWeight: 700, fontSize: 32, color: K.mut }}>TIP #{String(p.n).padStart(2, "0")}</span>
      </div>}
      {/* phone mock with the caret pointer, persistent from hook to last step */}
      {f < resultAt && <div style={{ position: "absolute", top: 760, left: 0, right: 0, display: "flex", justifyContent: "center", transform: `scale(${(0.6 + 0.4 * phoneIn) * 0.98}) translateY(${(1 - phoneOut) * 60}px)`, transformOrigin: "50% 0%", opacity: Math.min(phoneIn, phoneOut) }}>
        {ps.map((x, i) => x.visual && f >= x.start && f < end(i) ? <Sequence key={i} from={x.start} durationInFrames={end(i) - x.start} layout="none"><VisualView v={x.visual} dur={end(i) - x.start} /></Sequence> : null)}
      </div>}
      {ps.map((x, i) => {
        const showLabel = !(x.beat === "steps" && (x.step ?? 1) > 1);
        return <Sequence key={i} from={x.start} durationInFrames={end(i) - x.start}><PieceScene p={x} dur={end(i) - x.start} totalSteps={totalSteps} showLabel={showLabel} /></Sequence>;
      })}
      {/* beat progress: a "text line" with the caret moving along it */}
      {f < ctaAt && f >= introEnd && <div style={{ position: "absolute", bottom: 120, left: 80, right: 80, display: "flex", gap: 12, alignItems: "center" }}>
        {beatOrder.slice(0, 4).map((b) => { const idx = beatOrder.indexOf(curBeat), me = beatOrder.indexOf(b);
          return <div key={b} style={{ flex: 1, height: 10, borderRadius: 5, background: me < idx ? K.beat[b] : me === idx ? `${K.beat[b]}` : "#ffffff1c", opacity: me === idx ? 0.55 + 0.45 * blinkOn(f) : 1 }} />; })}
      </div>}
      {f < introEnd && <Intro until={introEnd} />}
      {/* audio */}
      <Audio src={staticFile("audio/bed.mp3")} loop volume={bed} />
      <Sequence from={0} durationInFrames={130} layout="none"><Audio src={staticFile("audio/sonic-logo.mp3")} volume={(fr) => interpolate(fr, [p.voStart - 4, p.voStart + 8], [0.85, 0.2], clamp)} /></Sequence>
      <Sfx name="sonic-logo" at={p.voEnd + 4} volume={0.85} />
      {[0, 12].map((k) => <Sfx key={`b${k}`} name="blink" at={k} volume={0.5} />)}
      {p.voFile && <Sequence from={p.voStart} layout="none"><Audio src={staticFile(p.voFile)} volume={1} /></Sequence>}
      {Array.from({ length: hookWords }, (_, i) => <Sfx key={`k${i}`} name="keytap" at={hook.start + i * hookPer} volume={0.35} />)}
      {ps.slice(1).map((x, i) => x.beat !== ps[i].beat ? <Sfx key={`w${i}`} name="whoosh" at={x.start - 4} volume={0.4} /> : <Sfx key={`w${i}`} name="keytap" at={x.start + 2} volume={0.4} />)}
      <Sfx name="chime" at={resultAt + 14} volume={0.5} />
      {[6, 18].map((k) => <Sfx key={`c${k}`} name="blink" at={ctaAt + k} volume={0.45} />)}
    </AbsoluteFill>
  );
}
