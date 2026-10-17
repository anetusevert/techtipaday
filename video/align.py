# Word-level alignment: python align.py <vo.mp3> '<json list of piece texts>' -> JSON list of piece start times (s).
# Uses faster-whisper (tiny.en, CPU). Pieces are matched by word count, so the transcript only needs to be close.
import json, re, subprocess, sys
import numpy as np
from faster_whisper import WhisperModel
vo, pieces = sys.argv[1], json.loads(sys.argv[2])
model = WhisperModel("tiny.en", device="cpu", compute_type="int8")
pcm = subprocess.run(["ffmpeg", "-v", "error", "-i", vo, "-f", "s16le", "-ac", "1", "-ar", "16000", "-"], capture_output=True, check=True).stdout
audio = np.frombuffer(pcm, np.int16).astype(np.float32) / 32768.0
segs, _ = model.transcribe(audio, word_timestamps=True, language="en")
words = [w for s in segs for w in s.words if re.search(r"\w", w.word)]
norm = lambda t: [x for x in re.findall(r"[a-z0-9']+", t.lower().replace("-", " ").replace("dot com", "dotcom").replace(".com", "dotcom"))]
counts = [len(norm(p)) for p in pieces]
hyp = [(norm(w.word) or [""])[0] for w in words]
first = [norm(p)[0] for p in pieces]
# sequential: expected start = previous start + previous piece's word count; snap to the nearest word that
# matches the piece's first word within +-3 words, never going backwards.
starts, prev = [0], 0
for i in range(1, len(pieces)):
    exp = prev + counts[i - 1]
    cands = [j for j in range(max(prev + 1, exp - 3), min(len(hyp), exp + 4)) if hyp[j] == first[i]]
    j = min(cands, key=lambda j: abs(j - exp)) if cands else min(max(prev + 1, exp), len(hyp) - 1)
    starts.append(j); prev = j
print(json.dumps([0.0] + [max(0.0, words[j].start - 0.08) for j in starts[1:]]))
