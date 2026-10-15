# TechTipADay daily short (9:16, ~20s)
Structure: hook → 2-4 steps → CTA. Each segment has on-screen text plus a `visual` that acts out the step, timed to the voiceover.
Audio is TechTipADay's own, separate from One Agent a Day: `public/sound/bed.mp3` (25s ElevenLabs Music instrumental), `sting.mp3` (ElevenLabs SFX),
tick/swoosh/success (made with ffmpeg). Never regenerate these sounds; reuse them every day.
Brand mark: Caret T (`src/CaretT.tsx`, from brand/cursor-symbol.svg). It is the header logo, the pointer in the phone graphics, and blinks in on the end card.

## scripts/<slug>.json
{ n, title, category, segments: [{ kind: hook|step|cta, text, visual }] }
visual types (src/visuals.tsx, add more there):
- phone-keyboard: action miss-taps | hold-space | trackpad | glide-fix | swipe-space; optional platform, text, typo, fix
- shortcut: keys ["Ctrl","Shift","T"], label
- settings-path: path ["Settings","Wi-Fi","(i)","Password"], platform
- icon: icon (emoji), label
- brand: the end card (Caret T blinks in)

## Steps
1. Write the JSON. Keep the voiceover at or under 60 words.
2. ElevenLabs `creative_generate_speech`: use the voice and model in voice.json, generations_count 1, prompt = the segment texts separated by blank lines, with [tags]. Download it to public/vo/<slug>.mp3.
3. `node render.mjs <slug> --out=/workspace/techtipaday/<slug>.mp4`. Segment start times line up with the pauses in the voiceover.
