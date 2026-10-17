# TechTipADay daily short, v3 (9:16, 1080x1920, ~22-28s)

Patterns adapted from One Agent a Day's playbook; the look, type, palette, sound and voice are ours.

## The arc (fixed, every day: the repetition is the signature)
0. **Intro sting (0.9s):** a mint text cursor blinks twice on navy over the sonic logo's key click.
1. **Pain hook** (coral pill `SOUND FAMILIAR?`): words pop in one by one with a key-tap each; the last word gets a mint text-selection highlight; a caret trails the line. The phone mock acts out the pain.
2. **Do this** (mint pill `DO THIS`): VO says "Here's the fix." + the action; big display line.
3. **Steps** (blue pill `HOW`, `> step n/N`): each step types out in sans with a blue caret while the phone mock performs it. The pointer is always the Caret T.
4. **Result** (amber pill `RESULT`): BEFORE (coral, struck through) / AFTER (mint, with caret) rows, then a burst headline in a selection highlight + success chime.
5. **CTA:** Caret T blinks in, wordmark, "One tech tip a day", `techtipaday.com` button, gentle pulse, sonic logo after the voice ends.

Other constants: header (Caret T + wordmark, `TIP #NN`), faint text-line grid backdrop with a glow tinted by the current beat, a 4-segment beat bar at the bottom in the beat colours. Every entrance uses one spring, `pop()` in `src/v3/TipV3.tsx` (stiffness 180, mass 0.7, damping 9-12): scale-in + fade. Exits are a 6-frame scale/fade, with a whoosh on beat changes.

- Type: **Bricolage Grotesque** (display), **DM Sans** (body), **JetBrains Mono** (machine/pills). OAAD uses a serif + IBM Plex Mono, so don't swap these.
- Palette: navy `#0b1020`, ink `#eef1f8`, caret mint `#3ee0a0`; beats: hook `#ff6b6b`, do `#3ee0a0`, steps `#6aa8ff`, result `#ffc857`.

## Sound
Brand kit in `public/audio/` (see its README), generated once, never regenerated. Voice: `voice.json`, **Bennett - Friendly, Smart Narrator** (`bmAn0TLASQN7ctGBMHgN`), `eleven_v4`, 1 generation, about 440 credits per VO. Never change the voice.
The VO is normalised to -16 LUFS at render; the bed sits around -33 LUFS under the voice, so the voice stays well clear of the music.

## Content fields (lib/tips.ts, `tip.video`, the site ignores them)
```ts
video: {
  hook: "6-12 words, relatable pain, ends on ? or a punch",
  hookLabel: "HIDDEN SETTING",        // optional pill + VO tone by hook style: (default) SOUND FAMILIAR? [exasperated],
                                      // HIDDEN SETTING [intrigued], STOP DOING THIS [firm], YOU'RE DOING IT WRONG [playful]
  lines: [...],                       // legacy v2; used as steps if `steps` is missing
  cta: "One tech tip a day at techtipaday.com",
  hookVisual: { type: "phone-keyboard", action: "miss-taps" },
  doThis: "Hold the spacebar.",       // spoken after "Here's the fix."
  doVisual: { type: "phone-keyboard", action: "hold-space" },
  steps: [{ say: "short step", visual: { ... } }],          // 2-4
  result: { say: "spoken payoff", headline: "2-5 words", before: "teh", after: "the" },
}
```
Visual types are listed in `src/types.ts`: phone-keyboard, phone-settings (settings rows with tap/toggle/reveal, or `mode: "call"` for an incoming call) and laptop (Windows screen: overwrite/keys/panel/paste) are the v3 screen mocks with the Caret T pointer (`src/visuals.tsx`, `src/visuals2.tsx`); shortcut, settings-path and icon are older generic ones. Add new screen mocks there; each should show the Caret T pointer.
Copy rules: whole VO 70 words max (the script warns), hook 6-12 words, short steps, result headline 2-5 words. Captions sound like a person.

## Daily commands (from `video/`)
1. Add the `video` fields to the tip, then `node script.mjs <n|slug>`. This writes `scripts/tip-NN.json` and prints the ElevenLabs prompt (5 emotion-tagged segments: [exasperated] hook, [confident] do, [friendly] steps, [delighted] result, [warm] CTA).
2. ElevenLabs `creative_generate_speech` with `voice_id`/`model_id` from `voice.json`, `generations_count: 1`, prompt = the printed text exactly. Poll `creative_get_flow_run_status`, then `curl -L -o public/vo/tip-NN.mp3 "<content_url>"`. Never re-call to retry.
3. `node render.mjs <n|slug> --out=/workspace/techtipaday/tip-NN-v3.mp4` (`--dry` prints timings only). Timing: word timestamps from `align.py` (faster-whisper tiny.en in `/home/box/whisper-venv`; set it up with `python3 -m venv /home/box/whisper-venv && /home/box/whisper-venv/bin/pip install faster-whisper`). Without it, the fallback splits the pieces into sentences and aligns their length-based estimates to the VO pauses (ffmpeg silencedetect) with a DP. The CTA sonic logo plays after the voice. Takes about 1.5 min.
4. QA: grab 4-5 frames (`ffmpeg -ss <t> -i out.mp4 -frames:v 1 f.png`) for hook, steps, result and CTA, and check loudness (`ffmpeg -i out.mp4 -af ebur128 -f null -`, about -17 LUFS integrated).

Setup: `npm ci` in `video/` (needs ffmpeg; uses google-chrome if present). The v2 composition is still available via `node render-v2.mjs`.
