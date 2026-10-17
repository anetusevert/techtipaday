# TechTipADay brand audio kit (v3). Generated once, reuse forever.

Made with ElevenLabs on 2026-10-18 (flow `TPzJKWm5ZJ6nnZmEZFrv`, about 550 credits). **Do not regenerate.** Same sounds every day = the sonic moat.

| File | Model | Prompt (short) | Use |
| --- | --- | --- | --- |
| `sonic-logo.mp3` | eleven_music_v2_5 | mechanical key click, two cursor-blink ticks, warm Rhodes maj7 chord swell with sub and shimmer | sonic logo: open (ducks under the VO) and after the VO on the CTA card. Trimmed to 4.0s with a fade; untrimmed take in `../../kit-src/sonic-logo-raw-9s.mp3` |
| `bed.mp3` | eleven_music_v2_5, 32s | 122 BPM lo-fi house: swung drums, soft four-on-the-floor, filtered Rhodes, deep bass, vinyl texture | music bed, looped; 0.5 in the intro, ducked to 0.1 under the voice, 0.3 on the CTA, fades out |
| `keytap.mp3` | eleven_text_to_sound_v2 | single crisp mechanical key tap | each hook word, each new step |
| `blink.mp3` | eleven_text_to_sound_v2 | tiny digital cursor-blink tick | intro cursor blinks, CTA cursor blink-in |
| `whoosh.mp3` | eleven_text_to_sound_v2 | quick airy whoosh | beat changes |
| `chime.mp3` | eleven_text_to_sound_v2 | warm two-note rising mallet chime | result reveal |

`public/sound/` is the retired v2 kit (only the v2 composition uses it).
Voiceovers live in `../vo/tip-NN.mp3`; `render.mjs` writes a -16 LUFS copy to `../vo/.norm/` (gitignored).
