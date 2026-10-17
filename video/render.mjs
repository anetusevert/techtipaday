// v3 one-command render: node render.mjs <n|slug> [--out=/path.mp4] [--frames]
// Builds the script from lib/tips.ts, snaps timing to VO pauses (ffmpeg silencedetect), renders TipV3.
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildScript } from "./script.mjs";
const dir = path.dirname(fileURLToPath(import.meta.url));
const FPS = 30, INTRO = 0.9, OUTRO = 4.2; // intro = cursor-blink sting; outro = CTA card + sonic logo after the voice
const arg = process.argv[2]; if (!arg) { console.error("Usage: node render.mjs <n|slug> [--out=file.mp4]"); process.exit(1); }
const outArg = process.argv.find((a) => a.startsWith("--out="));
const s = await buildScript(arg);
for (const w of s.warn) console.warn(`⚠ ${w}`);
const vo = path.join(dir, "public", "vo", `${s.key}.mp3`); const hasVo = fs.existsSync(vo);
if (!hasVo) console.warn(`⚠ No public/vo/${s.key}.mp3, rendering on estimated timings (fallback only).`);
const dur = hasVo ? Number(spawnSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", vo], { encoding: "utf8" }).stdout) : s.words / 2.5;
// Loudness: normalise the VO to -16 LUFS so it sits well above the ducked bed (-12.9 LUFS source at 0.10 ≈ -33 LUFS).
const voNorm = path.join(dir, "public", "vo", ".norm", `${s.key}.mp3`);
if (hasVo) { fs.mkdirSync(path.dirname(voNorm), { recursive: true });
  spawnSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", "-i", vo, "-af", "loudnorm=I=-16:TP=-1.5:LRA=11", "-ar", "44100", "-b:a", "192k", voNorm]); }
const pauses = [];
if (hasVo) { let a = null; for (const l of spawnSync("ffmpeg", ["-hide_banner", "-i", vo, "-af", "silencedetect=noise=-35dB:d=0.18", "-f", "null", "-"], { encoding: "utf8" }).stderr.split("\n")) {
  const m1 = l.match(/silence_start: ([\d.]+)/), m2 = l.match(/silence_end: ([\d.]+)/); if (m1) a = +m1[1]; if (m2 && a !== null) { pauses.push({ s: a, e: +m2[1] }); a = null; } } }
// Timing: split pieces into sentences, estimate each sentence boundary by text length, then align the
// boundaries in order to the VO pauses (ffmpeg silencedetect) with a small DP, so visuals land on the words.
const sents = s.pieces.flatMap((p, pi) => (p.say.match(/[^.!?]+[.!?]+|[^.!?]+$/g) ?? [p.say]).map((t) => ({ pi, len: t.trim().length })));
const totLen = sents.reduce((x, y) => x + y.len, 0);
const est = []; { let a = 0; for (let i = 0; i < sents.length - 1; i++) { a += sents[i].len; est.push((a / totLen) * dur); } }
const merged = []; for (const p of pauses) { const l = merged.at(-1); if (l && p.s - l.e < 0.3) l.e = p.e; else merged.push({ ...p }); }
const cand = merged.map((p) => Math.max(p.s + 0.05, p.e - 0.12));
let bounds = est;
if (cand.length >= est.length) { // DP: choose est.length ordered pauses minimising total |pause - estimate|
  const K = est.length, N = cand.length, INF = 1e9; const D = Array.from({ length: K + 1 }, () => Array(N + 1).fill(INF)); const B = Array.from({ length: K + 1 }, () => Array(N + 1).fill(0));
  for (let j = 0; j <= N; j++) D[0][j] = 0;
  for (let k = 1; k <= K; k++) for (let j = k; j <= N; j++) { const skip = D[k][j - 1], take = D[k - 1][j - 1] + Math.abs(cand[j - 1] - est[k - 1]); if (take <= skip) { D[k][j] = take; B[k][j] = 1; } else D[k][j] = skip; }
  bounds = []; for (let k = K, j = N; k > 0; j--) if (B[k][j]) { bounds.unshift(cand[j - 1]); k--; }
}
const starts = [0]; for (let i = 1; i < sents.length; i++) if (sents[i].pi !== sents[i - 1].pi) starts.push(bounds[i - 1]);
const f = (x) => Math.round(x * FPS);
const voStart = f(INTRO), voEnd = f(INTRO + dur);
const pieces = s.pieces.map((p, i) => ({ ...p, start: voStart + f(starts[i]) }));
const props = { n: s.n, title: s.title, category: s.category, url: s.url, pieces, voStart, voEnd, total: voEnd + f(OUTRO), voFile: hasVo ? `vo/.norm/${s.key}.mp3` : null };
fs.mkdirSync(path.join(dir, ".cache"), { recursive: true }); const pp = path.join(dir, ".cache", `${s.key}.props.json`); fs.writeFileSync(pp, JSON.stringify(props, null, 2));
const out = outArg ? path.resolve(outArg.slice(6)) : path.join(dir, "out", `${s.key}.mp4`); fs.mkdirSync(path.dirname(out), { recursive: true });
console.log(`VO ${dur.toFixed(2)}s, total ${(props.total / FPS).toFixed(1)}s. Piece starts (s):`, pieces.map((p) => `${p.beat}@${(p.start / FPS).toFixed(2)}`).join(" "));
const args = ["render", "src/index.ts", "TipV3", out, `--props=${pp}`, "--overwrite", "--concurrency=4"];
const chrome = ["/usr/bin/google-chrome-stable", "/usr/bin/google-chrome"].find((c) => fs.existsSync(c)); if (chrome) args.push(`--browser-executable=${chrome}`, "--gl=angle");
const r = spawnSync(path.join(dir, "node_modules", ".bin", "remotion"), args, { cwd: dir, stdio: "inherit" });
if (r.status === 0) console.log(`\nRendered ${out}`);
process.exit(r.status ?? 1);
