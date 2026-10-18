# Word-level alignment: python align.py <vo.mp3> '<json list of piece texts>' -> JSON list of piece start times (s).
# faster-whisper (base.en float32 on CPU; int8 and small.en produced garbage here) word timestamps, aligned to the script with difflib so misheard words don't shift pieces.
import difflib, json, os, re, subprocess, sys
import numpy as np
from faster_whisper import WhisperModel
vo, pieces = sys.argv[1], json.loads(sys.argv[2])
model = WhisperModel(os.environ.get("WHISPER_MODEL", "base.en"), device="cpu", compute_type="float32")
pcm = subprocess.run(["ffmpeg", "-v", "error", "-i", vo, "-f", "s16le", "-ac", "1", "-ar", "16000", "-"], capture_output=True, check=True).stdout
audio = np.frombuffer(pcm, np.int16).astype(np.float32) / 32768.0
segs, _ = model.transcribe(audio, word_timestamps=True, language="en", condition_on_previous_text=False)
words = [w for s in segs for w in s.words if re.search(r"\w", w.word)]
def norm(t):
    t = t.lower().replace("-", " ").replace("dot com", "dotcom").replace(".com", "dotcom")
    return re.findall(r"[a-z0-9']+", t)
hyp = [(norm(w.word) or [""])[0] for w in words]
ref, owner = [], []
for i, p in enumerate(pieces):
    for w in norm(p): ref.append(w); owner.append(i)
m = {}
for a, b, n in difflib.SequenceMatcher(None, ref, hyp, autojunk=False).get_matching_blocks():
    for k in range(n): m[a + k] = b + k
dur = words[-1].end if words else 1.0
times = []
for k in range(len(ref)):  # time for every ref word: matched -> word start; else interpolate between neighbours
    times.append(words[m[k]].start if k in m else None)
known = [(k, t) for k, t in enumerate(times) if t is not None]
for k in range(len(times)):
    if times[k] is None:
        lo = max([x for x in known if x[0] < k], default=(-1, 0.0), key=lambda x: x[0]); hi = min([x for x in known if x[0] > k], default=(len(ref), dur), key=lambda x: x[0])
        times[k] = lo[1] + (hi[1] - lo[1]) * (k - lo[0]) / (hi[0] - lo[0])
starts = [0.0]
for i in range(1, len(pieces)):
    k = owner.index(i); starts.append(max(starts[-1] + 0.3, times[k] - 0.08))
print(json.dumps(starts))
