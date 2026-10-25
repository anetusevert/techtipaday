// v3 one-command render: node render.mjs <n|slug> [--out=/path.mp4] [--dry]
// Builds the script from lib/tips.ts, snaps timing to VO pauses (ffmpeg silencedetect), renders TipV3.
// Also writes covers/tip-NN-cover.png next to the mp4 (the CoverPoster still, same pixels as frame 0).
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildScript } from "./script.mjs";
const dir = path.dirname(fileURLToPath(import.meta.url));
const FPS = 30, INTRO = 0.9, OUTRO = 4.2, COVER_FRAMES = 18; // 18 frames = 0.6s static poster, then the 0.9s cursor sting; outro = CTA + sonic logo after the voice
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
const cand = merged.map((p) => Math.max(p.s + 0.05, p.e - 0.12)); const cdur = merged.map((p) => p.e - p.s);
// DP over ordered (estimate, pause) pairs: match an estimate to a pause, skip a pause (comma breath), or leave an
// estimate unmatched (the voice ran two sentences together) at a fixed cost.
const K = est.length, N = cand.length, U = 0.7;
const cost = (k, j) => Math.abs(cand[j] - est[k]) - 1.2 * Math.min(cdur[j], 0.5);
const D = Array.from({ length: K + 1 }, () => Array(N + 1).fill(Infinity)); const B = Array.from({ length: K + 1 }, () => Array(N + 1).fill(""));
D[0][0] = 0;
for (let k = 0; k <= K; k++) for (let j = 0; j <= N; j++) { const d = D[k][j]; if (!isFinite(d)) continue;
  if (j < N && d < D[k][j + 1]) { D[k][j + 1] = d; B[k][j + 1] = "skip"; }
  if (k < K && d + U < D[k + 1][j]) { D[k + 1][j] = d + U; B[k + 1][j] = "est"; }
  if (k < K && j < N && Math.abs(cand[j] - est[k]) < 2 && d + cost(k, j) < D[k + 1][j + 1]) { D[k + 1][j + 1] = d + cost(k, j); B[k + 1][j + 1] = "match"; } }
const bounds = Array(K);
for (let k = K, j = N; k > 0 || j > 0;) { const m = B[k][j]; if (m === "skip") j--; else if (m === "est") { bounds[k - 1] = est[k - 1]; k--; } else { bounds[k - 1] = cand[j - 1]; k--; j--; } }
let starts = [0]; for (let i = 1; i < sents.length; i++) if (sents[i].pi !== sents[i - 1].pi) starts.push(bounds[i - 1]);
// Prefer word timestamps (faster-whisper in /home/box/whisper-venv) when available; the pause DP above is the fallback.
const PY = process.env.WHISPER_PY ?? "/home/box/whisper-venv/bin/python";
if (hasVo && fs.existsSync(PY)) { const r = spawnSync(PY, [path.join(dir, "align.py"), vo, JSON.stringify(s.pieces.map((p) => p.say))], { encoding: "utf8" });
  try { const w = JSON.parse(r.stdout.trim().split("\n").at(-1)); if (w.length === s.pieces.length) { starts = w; console.log("Timing: word timestamps"); } } catch { console.warn("⚠ align.py failed, using pause timing", r.stderr?.slice(-300)); } }
const f = (x) => Math.round(x * FPS);
// Poster first, then the sting, then the VO. Alignment stays relative to the voice; only voStart moves.
const voStart = COVER_FRAMES + f(INTRO), voEnd = voStart + f(dur);
const pieces = s.pieces.map((p, i) => ({ ...p, start: voStart + f(starts[i]) }));
const props = { n: s.n, title: s.title, category: s.category, url: s.url, pieces, voStart, voEnd, total: voEnd + f(OUTRO), voFile: hasVo ? `vo/.norm/${s.key}.mp3` : null, coverLine: s.coverLine, coverFrames: COVER_FRAMES };
fs.mkdirSync(path.join(dir, ".cache"), { recursive: true }); const pp = path.join(dir, ".cache", `${s.key}.props.json`); fs.writeFileSync(pp, JSON.stringify(props, null, 2));
const coverProps = { n: s.n, coverLine: s.coverLine, hookLabel: s.hookLabel };
const coverPp = path.join(dir, ".cache", `${s.key}.cover.json`); fs.writeFileSync(coverPp, JSON.stringify(coverProps));
const out = outArg ? path.resolve(outArg.slice(6)) : path.join(dir, "out", `${s.key}.mp4`); fs.mkdirSync(path.dirname(out), { recursive: true });
const coverPng = path.join(path.dirname(out), "covers", `${s.key}-cover.png`);
console.log(`Poster ${COVER_FRAMES}f (${(COVER_FRAMES / FPS).toFixed(2)}s) "${s.coverLine}". VO ${dur.toFixed(2)}s, total ${(props.total / FPS).toFixed(1)}s. Piece starts (s):`, pieces.map((p) => `${p.beat}@${(p.start / FPS).toFixed(2)}`).join(" "));
if (process.argv.includes("--dry")) process.exit(0);
const chrome = ["/usr/bin/google-chrome-stable", "/usr/bin/google-chrome"].find((c) => fs.existsSync(c));
const bin = path.join(dir, "node_modules", ".bin", "remotion");
const browser = chrome ? [`--browser-executable=${chrome}`, "--gl=angle"] : [];
fs.mkdirSync(path.dirname(coverPng), { recursive: true });
const still = spawnSync(bin, ["still", "src/index.ts", "CoverPoster", coverPng, `--props=${coverPp}`, "--frame=0", "--image-format=png", "--overwrite", ...browser], { cwd: dir, stdio: "inherit" });
if (still.status !== 0) process.exit(still.status ?? 1);
console.log(`Cover ${coverPng}`);
const args = ["render", "src/index.ts", "TipV3", out, `--props=${pp}`, "--overwrite", "--concurrency=4", ...browser];
const r = spawnSync(bin, args, { cwd: dir, stdio: "inherit" });
if (r.status === 0) console.log(`\nRendered ${out}`);
process.exit(r.status ?? 1);
