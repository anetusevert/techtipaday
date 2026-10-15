import { AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { fontMono, fontSans } from "./fonts";
import { C, clamp } from "./theme";
import { VisualView } from "./visuals";
import { CaretT } from "./CaretT";
import type { Segment, TipVideoProps } from "./types";

function Logo({ size = 54 }: { size?: number }) {
  const f = useCurrentFrame();
  const cur = f < 8 ? 0 : f < 32 ? (Math.floor((f - 8) / 6) % 2 === 0 ? 1 : 0) : (f % 30 < 20 ? 1 : 0);
  return <div style={{ display: "flex", alignItems: "center", gap: 16 }}><CaretT size={size * 1.25} cursor={cur} /><div style={{ fontFamily: fontSans, fontWeight: 800, fontSize: size, color: C.fg, letterSpacing: -1 }}>TechTip<span style={{ color: C.acc }}>ADay</span></div></div>;
}

function Scene({ seg, stepNo, dur }: { seg: Segment; stepNo: number; dur: number }) {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const inS = spring({ frame: f, fps, config: { damping: 15 } });
  const out = interpolate(f, [dur - 7, dur], [1, 0], clamp);
  const words = seg.text.split(" ");
  const hook = seg.kind === "hook";
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <div style={{ position: "absolute", top: 290, left: 80, right: 80, minHeight: 300, transform: `translateY(${(1 - inS) * 40}px)`, opacity: inS }}>
        {seg.kind === "step" && <div style={{ fontFamily: fontMono, color: C.acc, fontSize: 38, marginBottom: 14 }}>STEP {stepNo}</div>}
        <div style={{ fontFamily: fontSans, fontWeight: hook ? 800 : 700, color: C.fg, fontSize: hook ? 76 : 64, lineHeight: 1.12, letterSpacing: -1 }}>
          {words.map((w, i) => <span key={i} style={{ opacity: 0.25 + 0.75 * interpolate(f, [i * 2.4, i * 2.4 + 6], [0, 1], clamp) }}>{w} </span>)}
        </div>
      </div>
      <div style={{ position: "absolute", top: seg.visual?.type === "phone-keyboard" ? 680 : 760, left: 0, right: 0, bottom: 200, display: "flex", justifyContent: "center", alignItems: seg.visual?.type === "phone-keyboard" ? "flex-start" : "center",
        transform: `scale(${0.9 + inS * 0.1})`, opacity: inS }}>
        <VisualView v={seg.visual} dur={dur} />
      </div>
    </AbsoluteFill>
  );
}

function Sfx({ name, at, volume = 0.5 }: { name: string; at: number; volume?: number }) {
  return <Sequence from={Math.max(0, at)} durationInFrames={90} layout="none"><Audio src={staticFile(`sound/${name}.mp3`)} volume={volume} /></Sequence>;
}

export function TipVideo(p: TipVideoProps) {
  const f = useCurrentFrame();
  const segs = p.segments; let step = 0;
  const steps = segs.filter((s) => s.kind === "step");
  const ctaAt = segs.find((s) => s.kind === "cta")?.start ?? p.voEnd;
  const bed = interpolate(f, [0, p.voStart, p.voEnd, p.voEnd + 8, p.total - 20, p.total], [0.5, 0.14, 0.14, 0.35, 0.35, 0], clamp);
  const curStep = steps.filter((s) => s.start <= f).length;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 35%, #1b2650 0%, ${C.bg} 65%)` }}>
      <AbsoluteFill style={{ padding: "90px 80px 0", flexDirection: "row", justifyContent: "space-between", height: 200 }}>
        <Logo />
        <div style={{ fontFamily: fontMono, fontSize: 34, color: C.bg, background: C.acc, borderRadius: 999, padding: "10px 26px", height: 62 }}>TIP #{String(p.n).padStart(2, "0")}</div>
      </AbsoluteFill>
      <div style={{ position: "absolute", top: 196, left: 80, fontFamily: fontMono, fontSize: 30, color: C.mut, textTransform: "uppercase" }}>{p.category}</div>
      {segs.map((s, i) => {
        const end = segs[i + 1]?.start ?? p.total; if (s.kind === "step") step++;
        return <Sequence key={i} from={s.start} durationInFrames={end - s.start}><Scene seg={s} stepNo={step} dur={end - s.start} /></Sequence>;
      })}
      {/* step progress pills */}
      <div style={{ position: "absolute", bottom: 110, left: 80, right: 80, display: "flex", gap: 14, opacity: f < ctaAt ? 1 : 0 }}>
        {steps.map((_, i) => <div key={i} style={{ flex: 1, height: 12, borderRadius: 6, background: i < curStep ? C.acc : "#ffffff22" }} />)}
      </div>
      <Audio src={staticFile("sound/bed.mp3")} loop volume={bed} />
      <Sfx name="sting" at={0} volume={0.8} />
      <Sfx name="sting" at={ctaAt + 4} volume={0.8} />
      {p.voFile && <Sequence from={p.voStart} layout="none"><Audio src={staticFile(p.voFile)} volume={1} /></Sequence>}
      {segs.slice(1).filter((s) => s.kind === "step").map((s, i) => <Sfx key={i} name="swoosh" at={s.start - 3} volume={0.35} />)}
      {segs.flatMap((s, i) => s.visual?.type === "phone-keyboard" && s.visual.action === "miss-taps"
        ? [0.15, 0.5, 0.8].map((k) => <Sfx key={`t${i}${k}`} name="tick" at={s.start + Math.round(k * ((segs[i + 1]?.start ?? p.total) - s.start))} volume={0.5} />) : [])}
      {segs.flatMap((s, i) => s.visual?.type === "phone-keyboard" && s.visual.action === "glide-fix"
        ? [<Sfx key={`s${i}`} name="success" at={s.start + Math.round(0.6 * ((segs[i + 1]?.start ?? p.total) - s.start))} volume={0.45} />] : [])}
    </AbsoluteFill>
  );
}
