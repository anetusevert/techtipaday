import { Composition } from "remotion";
import { TipVideo } from "./TipVideo";
import type { TipVideoProps } from "./types";
export const FPS = 30;
const def: TipVideoProps = { n: 1, title: "Sample tip", category: "Phone", voStart: 36, voEnd: 600, total: 720, voFile: null,
  segments: [{ kind: "hook", text: "A relatable problem?", start: 0 }, { kind: "step", text: "Do this.", start: 150 }, { kind: "cta", text: "One tech tip a day at techtipaday.com", start: 500 }] };
export function RemotionRoot() {
  return <Composition id="TipVideo" component={TipVideo} durationInFrames={def.total} fps={FPS} width={1080} height={1920}
    defaultProps={def} calculateMetadata={({ props }) => ({ durationInFrames: props.total })} />;
}
