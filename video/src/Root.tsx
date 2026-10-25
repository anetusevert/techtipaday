import { Composition } from "remotion";
import { TipVideo } from "./TipVideo";
import { CoverPoster } from "./v3/CoverPoster";
import type { CoverPosterProps } from "./v3/CoverPoster";
import { TipV3 } from "./v3/TipV3";
import type { TipVideoProps } from "./types";
import type { V3Props } from "./v3/types";
export const FPS = 30;
const COVER = 18; // 0.6s static poster before the 0.9s intro sting
const def: TipVideoProps = { n: 1, title: "Sample tip", category: "Phone", voStart: 36, voEnd: 600, total: 720, voFile: null,
  segments: [{ kind: "hook", text: "A relatable problem?", start: 0 }, { kind: "step", text: "Do this.", start: 150 }, { kind: "cta", text: "One tech tip a day at techtipaday.com", start: 500 }] };
const def3: V3Props = { n: 1, title: "Sample", category: "phone", url: "techtipaday.com", voStart: 27 + COVER, voEnd: 600 + COVER, total: 720 + COVER, voFile: null,
  coverLine: "Stop missing every typo", coverFrames: COVER,
  pieces: [{ beat: "hook", say: "", text: "Still tapping on typos and missing every time?", start: 27 + COVER }, { beat: "do", say: "", text: "Hold the spacebar.", start: 150 + COVER },
    { beat: "result", say: "", text: "Fixed", result: { say: "", headline: "Fixed in one slide", before: "teh", after: "the" }, start: 400 + COVER }, { beat: "cta", say: "", text: "", start: 600 + COVER }] };
const defCover: CoverPosterProps = { n: 1, coverLine: "Stop missing every typo", hookLabel: null };
export function RemotionRoot() {
  return <>
    <Composition id="TipV3" component={TipV3} durationInFrames={def3.total} fps={FPS} width={1080} height={1920} defaultProps={def3} calculateMetadata={({ props }) => ({ durationInFrames: props.total })} />
    <Composition id="CoverPoster" component={CoverPoster} durationInFrames={1} fps={FPS} width={1080} height={1920} defaultProps={defCover} />
    <Composition id="TipVideo" component={TipVideo} durationInFrames={def.total} fps={FPS} width={1080} height={1920} defaultProps={def} calculateMetadata={({ props }) => ({ durationInFrames: props.total })} />
  </>;
}
