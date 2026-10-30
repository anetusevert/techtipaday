// Build a v3 script from a tip's content file (lib/tips.ts -> tip.video).
// Usage: node script.mjs <n|slug>   -> scripts/tip-NN.json, prints the ElevenLabs prompt.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { build } from "esbuild";
import { coverLineFromHook } from "./cover.mjs";

const dir = path.dirname(fileURLToPath(import.meta.url));
const MAX_WORDS = 70;
const CTA_SAY = "One tech tip a day, at techtipaday dot com.";
const DO_LEAD = "Here's the fix.";

export async function loadTips() {
  const out = path.join(dir, ".cache", "tips.mjs");
  fs.mkdirSync(path.dirname(out), { recursive: true });
  await build({ entryPoints: [path.join(dir, "..", "lib", "tips.ts")], bundle: true, platform: "node", format: "esm", outfile: out, logLevel: "error" });
  return (await import(pathToFileURL(out).href + `?t=${Date.now()}`)).tips;
}

export function keyFor(tip) { return `tip-${String(tip.n).padStart(2, "0")}`; }

export async function buildScript(arg) {
  const tips = await loadTips();
  const tip = tips.find((t) => String(t.n) === String(arg) || t.slug === arg);
  if (!tip) throw new Error(`No tip "${arg}"`);
  const v = tip.video;
  if (!v) throw new Error(`Tip ${tip.n} has no video fields (tip.video). See VIDEO.md.`);
  const steps = v.steps ?? v.lines.slice(1).map((say) => ({ say }));
  const doThis = v.doThis ?? v.lines[0];
  const result = v.result ?? { say: "Done. That's it.", headline: "Done", before: "before", after: "after" };
  // pieces = timed on-screen units; beats group them for the VO prompt
  const pieces = [
    { beat: "hook", say: v.hook, text: v.hook, label: v.hookLabel ?? null, visual: v.hookVisual ?? null },
    { beat: "do", say: `${DO_LEAD} ${doThis}`, text: doThis, visual: v.doVisual ?? steps[0]?.visual ?? null },
    ...steps.map((s, i) => ({ beat: "steps", say: s.say, text: s.say, step: i + 1, visual: s.visual ?? null })),
    { beat: "result", say: result.say, text: result.headline, result },
    { beat: "cta", say: v.ctaSay ?? CTA_SAY, text: "One tech tip a day", ...(v.ctaNote ? { note: v.ctaNote } : {}) },
  ];
  const hookTag = { "HIDDEN SETTING": "[intrigued]", "STOP DOING THIS": "[firm]", "YOU'RE DOING IT WRONG": "[playful]" }[v.hookLabel] ?? "[exasperated]";
  const tags = { hook: hookTag, do: "[confident]", steps: "[friendly]", result: "[delighted]", cta: "[warm]" };
  const beats = [];
  for (const p of pieces) { const b = beats.at(-1); if (b && b.beat === p.beat) b.text += ` ${p.say}`; else beats.push({ beat: p.beat, text: p.say }); }
  const prompt = beats.map((b) => `${tags[b.beat]} ${b.text}`).join("\n\n");
  const words = pieces.map((p) => p.say).join(" ").split(/\s+/).length;
  const hookWords = v.hook.split(/\s+/).length;
  const explicitCover = typeof v.coverLine === "string" ? v.coverLine.trim() : "";
  const derivedCover = explicitCover ? null : coverLineFromHook(v.hook);
  const coverLine = explicitCover || derivedCover.line;
  const coverWords = coverLine.replace(/[.!?]+$/g, "").split(/\s+/).filter(Boolean);
  const warn = [];
  if (words > MAX_WORDS) warn.push(`VO is ${words} words (> ${MAX_WORDS})`);
  if (hookWords < 6 || hookWords > 12) warn.push(`hook is ${hookWords} words (want 6-12)`);
  const hw = result.headline.split(/\s+/).length; if (hw < 2 || hw > 5) warn.push(`result headline is ${hw} words (want 2-5)`);
  if (explicitCover && (coverWords.length < 3 || coverWords.length > 7)) warn.push(`coverLine is ${coverWords.length} words (want 3-7)`);
  if (!explicitCover && derivedCover.chopped) warn.push(`coverLine derived by shortening the hook: "${coverLine}". Set video.coverLine (3-7 short words).`);
  if (coverLine.length > 42) warn.push(`coverLine is ${coverLine.length} characters; it may be tight at grid size`);
  return { key: keyFor(tip), n: tip.n, slug: tip.slug, title: tip.title, category: tip.category, url: `https://www.techtipaday.com/tips/${tip.slug}`, pieces, words, warn, elevenlabsPrompt: prompt, coverLine, hookLabel: v.hookLabel ?? null };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const arg = process.argv[2]; if (!arg) { console.error("Usage: node script.mjs <n|slug>"); process.exit(1); }
  const s = await buildScript(arg);
  fs.mkdirSync(path.join(dir, "scripts"), { recursive: true });
  fs.writeFileSync(path.join(dir, "scripts", `${s.key}.json`), JSON.stringify(s, null, 2) + "\n");
  for (const w of s.warn) console.warn(`⚠ ${w}`);
  console.log(`Wrote scripts/${s.key}.json (${s.words} words)\n\nElevenLabs prompt (voice.json):\n\n${s.elevenlabsPrompt}`);
}
