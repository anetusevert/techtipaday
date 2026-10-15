import { AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { fontMono, fontSans } from "./fonts";
import type { Segment, TipVideoProps } from "./types";

const C = { bg: "#0b1020", bg2: "#141a2e", fg: "#eef1f8", mut: "#9aa3ba", acc: "#3ee0a0" };
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

function Logo({ size = 54 }: { size?: number }) {
  return <div style={{ fontFamily: fontSans, fontWeight: 800, fontSize: size, color: C.fg, letterSpacing: -1 }}>TechTip<span style={{ color: C.acc }}>ADay</span></div>;
}

function Card({ seg, idx, stepNo, end }: { seg: Segment; idx: number; stepNo: number; end: number }) {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const inS = spring({ frame: f, fps, config: { damping: 14 } });
  const out = interpolate(f, [end - seg.start - 8, end - seg.start], [1, 0], clamp);
  const isHook = seg.kind === "hook"; const isCta = seg.kind === "cta";
  const words = seg.text.split(" ");
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 90, opacity: out }}>
      <div style={{ transform: `translateY(${(1 - inS) * 80}px) scale(${0.92 + inS * 0.08})`, opacity: inS, width: "100%",
        background: isHook ? "transparent" : C.bg2, borderRadius: 48, padding: isHook ? 0 : 70,
        border: isCta ? `4px solid ${C.acc}` : "none", boxShadow: isHook ? "none" : "0 30px 80px rgba(0,0,0,.45)" }}>
        {seg.kind === "step" && <div style={{ fontFamily: fontMono, color: C.acc, fontSize: 40, marginBottom: 26 }}>STEP {stepNo}</div>}
        <div style={{ fontFamily: fontSans, fontWeight: isHook ? 800 : 700, color: C.fg, fontSize: isHook ? 96 : 76, lineHeight: 1.12, letterSpacing: -1 }}>
          {words.map((w, i) => {
            const on = interpolate(f, [i * 2.2, i * 2.2 + 6], [0, 1], clamp);
            return <span key={i} style={{ opacity: 0.25 + on * 0.75 }}>{w} </span>;
          })}
        </div>
        {isCta && <div style={{ marginTop: 40 }}><Logo size={70} /><div style={{ fontFamily: fontMono, color: C.mut, fontSize: 38, marginTop: 10 }}>techtipaday.com</div></div>}
      </div>
    </AbsoluteFill>
  );
}

function Sfx({ name, at, volume = 0.6 }: { name: string; at: number; volume?: number }) {
  return <Sequence from={at} durationInFrames={60} layout="none"><Audio src={staticFile(`audio/${name}.mp3`)} volume={volume} /></Sequence>;
}

export function TipVideo(p: TipVideoProps) {
  const f = useCurrentFrame();
  const segs = p.segments; let step = 0;
  const progress = interpolate(f, [0, p.total], [0, 1], clamp);
  const ctaAt = segs.find((s) => s.kind === "cta")?.start ?? p.voEnd;
  const bed = interpolate(f, [0, p.voStart, p.voEnd, p.voEnd + 10], [0.35, 0.12, 0.12, 0.3], clamp);
  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 20%, #1b2650 0%, ${C.bg} 60%)` }}>
      <AbsoluteFill style={{ padding: "90px 90px 0", flexDirection: "row", justifyContent: "space-between", height: 200 }}>
        <Logo />
        <div style={{ fontFamily: fontMono, fontSize: 36, color: C.bg, background: C.acc, borderRadius: 999, padding: "10px 26px", height: 64 }}>TIP #{String(p.n).padStart(2, "0")}</div>
      </AbsoluteFill>
      <div style={{ position: "absolute", top: 200, left: 90, fontFamily: fontMono, fontSize: 32, color: C.mut, textTransform: "uppercase" }}>{p.category}</div>
      {segs.map((s, i) => {
        const end = segs[i + 1]?.start ?? p.total; if (s.kind === "step") step++;
        return <Sequence key={i} from={s.start} durationInFrames={end - s.start}><Card seg={s} idx={i} stepNo={step} end={end} /></Sequence>;
      })}
      <div style={{ position: "absolute", bottom: 120, left: 90, right: 90, height: 10, borderRadius: 5, background: "#ffffff22" }}>
        <div style={{ width: `${progress * 100}%`, height: "100%", borderRadius: 5, background: C.acc }} />
      </div>
      <Audio src={staticFile("audio/bed.mp3")} loop volume={bed} />
      <Audio src={staticFile("audio/jingle.mp3")} volume={(x) => interpolate(x, [p.voStart - 4, p.voStart + 8], [0.9, 0.2], clamp)} />
      <Sequence from={p.voEnd} layout="none"><Audio src={staticFile("audio/jingle.mp3")} volume={0.9} /></Sequence>
      {p.voFile && <Sequence from={p.voStart} layout="none"><Audio src={staticFile(p.voFile)} volume={1} /></Sequence>}
      {segs.slice(1).map((s, i) => <Sfx key={i} name={s.kind === "cta" ? "ding" : "whoosh"} at={Math.max(0, s.start - 4)} volume={0.45} />)}
      <Sfx name="pop" at={ctaAt + 14} volume={0.5} />
    </AbsoluteFill>
  );
}
