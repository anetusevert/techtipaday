# TechTipADay daily short (9:16, ~20-25s)
Structure: hook → 2-4 steps → CTA "One tech tip a day at techtipaday dot com". Audio kit in public/audio (reused from One Agent a Day; never regenerate).
1. Write `scripts/<slug>.json` (n, title, category, segments [{kind: hook|step|cta, text}]). Keep VO ≤ 60 words.
2. ElevenLabs `creative_generate_speech`, voice/model from voice.json, generations_count 1, prompt = segments joined by blank lines with [tags]; CTA line: "One tech tip a day, at techtip a day dot com!". Download to public/vo/<slug>.mp3.
3. `node render.mjs <slug> --out=/workspace/techtipaday/<slug>.mp4` (segment timing snaps to VO pauses).
