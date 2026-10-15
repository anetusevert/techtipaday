// Render a TechTipADay short: node render.mjs <slug> [--out=file.mp4]
// Needs scripts/<slug>.json ({ n, title, category, segments:[{kind,text}] }) and public/vo/<slug>.mp3.
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const dir = path.dirname(fileURLToPath(import.meta.url));
const FPS = 30, INTRO = 1.2, OUTRO = 4.0;
const slug = process.argv[2]; if (!slug) { console.error("Usage: node render.mjs <slug>"); process.exit(1); }
const outArg = process.argv.find((a) => a.startsWith("--out="));
const script = JSON.parse(fs.readFileSync(path.join(dir, "scripts", `${slug}.json`), "utf8"));
const vo = path.join(dir, "public", "vo", `${slug}.mp3`); const hasVo = fs.existsSync(vo);
const dur = hasVo ? Number(spawnSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", vo], { encoding: "utf8" }).stdout) : 20;
const pauses = [];
if (hasVo) { let s = null; for (const l of spawnSync("ffmpeg", ["-hide_banner", "-i", vo, "-af", "silencedetect=noise=-35dB:d=0.2", "-f", "null", "-"], { encoding: "utf8" }).stderr.split("\n")) {
  const a = l.match(/silence_start: ([\d.]+)/), b = l.match(/silence_end: ([\d.]+)/); if (a) s = +a[1]; if (b && s !== null) { pauses.push((s + +b[1]) / 2); s = null; } } }
const lens = script.segments.map((x) => x.text.length), tot = lens.reduce((a, b) => a + b, 0);
const starts = [0]; let acc = 0;
for (let i = 0; i < lens.length - 1; i++) { acc += lens[i]; const g = (acc / tot) * dur;
  const near = pauses.filter((p) => p > starts[i] + 0.8 && Math.abs(p - g) < 1.5).sort((a, b) => Math.abs(a - g) - Math.abs(b - g))[0]; starts.push(near ?? g); }
const f = (s) => Math.round(s * FPS);
const props = { n: script.n, title: script.title, category: script.category,
  segments: script.segments.map((s, i) => ({ ...s, start: i === 0 ? 0 : f(INTRO + starts[i]) })),
  voStart: f(INTRO), voEnd: f(INTRO + dur), total: f(INTRO + dur + OUTRO), voFile: hasVo ? `vo/${slug}.mp3` : null };
fs.mkdirSync(path.join(dir, ".cache"), { recursive: true }); const pp = path.join(dir, ".cache", `${slug}.json`); fs.writeFileSync(pp, JSON.stringify(props, null, 2));
const out = outArg ? path.resolve(outArg.slice(6)) : path.join(dir, "out", `${slug}.mp4`); fs.mkdirSync(path.dirname(out), { recursive: true });
const args = ["render", "src/index.ts", "TipVideo", out, `--props=${pp}`, "--overwrite", "--concurrency=4"];
const chrome = ["/usr/bin/google-chrome-stable", "/usr/bin/google-chrome"].find((c) => fs.existsSync(c)); if (chrome) args.push(`--browser-executable=${chrome}`, "--gl=angle");
console.log("Segments (s):", props.segments.map((s) => (s.start / FPS).toFixed(2)).join(", "));
const r = spawnSync(path.join(dir, "node_modules", ".bin", "remotion"), args, { cwd: dir, stdio: "inherit" }); process.exit(r.status ?? 1);
