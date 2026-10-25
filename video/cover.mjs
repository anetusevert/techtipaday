// Poster headline from tip.video.coverLine, or 3–7 words derived from the hook.
// The poster paints the last word in mint, so the line should end on the point.

const FILLER = new Set("every just again instead later very really actually single ever time you've they're been".split(" "));
// Glue rarely ends a thought. "in" / "on" are left out so "log in" and "tap on" can end a line.
const GLUE = new Set("a an the and or to of for with so at if when from by like into over is that can't don't won't".split(" "));
const OPEN_END = new Set("your you them on".split(" "));
const LEADS = [
  /^(still|just)\s+/i,
  /^(want to know|there's|there is|you've been|you have been)\s+/i,
  /^(your\s+\S+(?:\s+\S+){0,1}\s+)(has|can|keeps)\s+(?:a\s+|an\s+)?/i,
];

function tokens(s) {
  return s.replace(/[,:;]/g, "").trim().split(/\s+/).filter(Boolean);
}
function cap(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
function bare(w) {
  return w.toLowerCase().replace(/[^a-z0-9']/g, "");
}
function badEnd(w) {
  const b = bare(w);
  return !b || FILLER.has(b) || GLUE.has(b) || OPEN_END.has(b);
}

function stripLead(words) {
  let w = words;
  const s = w.join(" ");
  for (const p of LEADS) {
    const m = s.match(p);
    if (!m) continue;
    const rest = tokens(s.slice(m[0].length));
    if (rest.length >= 3) { w = rest; break; }
  }
  if (w.length > 7 && GLUE.has(bare(w[0]))) {
    const rest = w.slice(1);
    if (rest.length >= 3) w = rest;
  }
  return w;
}

/** Highest-scoring 3–7 word window. Longer windows win a tie, then an earlier start. */
function bestCut(words, question) {
  let best = null;
  for (let n = Math.min(7, words.length); n >= 3; n--) {
    for (let i = 0; i <= words.length - n; i++) {
      const slice = words.slice(i, i + n);
      if (badEnd(slice[n - 1])) continue;
      const start = bare(slice[0]);
      let score = n >= 4 && n <= 6 ? 18 : n === 7 ? 14 : 8;
      if (i === 0) score += 7;
      const keepsEnd = i + n === words.length;
      if (keepsEnd) score += question ? 10 : 6;
      if (i !== 0 && (GLUE.has(start) || FILLER.has(start))) score -= 10;
      for (const w of slice) {
        const b = bare(w);
        if (FILLER.has(b)) score -= 7;
        else if (GLUE.has(b)) score -= 2;
      }
      if (!best || score > best.score) best = { slice, score, keepsEnd };
    }
  }
  return best;
}

function fromSentence(sentence, depth = 0) {
  // A comma often starts a weaker tail ("..., letter by letter"). Keep the left clause when it already makes a poster line.
  if (depth === 0 && sentence.includes(",")) {
    const left = fromSentence(sentence.split(/,\s+/)[0], 1);
    if (left && left.score >= 24 && left.slice.length >= 4) return left;
  }
  const question = /\?\s*$/.test(sentence);
  const all = tokens(sentence.replace(/[.!?]+$/g, ""));
  if (all.length >= 3 && all.length <= 7 && !badEnd(all[all.length - 1])) {
    return { slice: all, question, chopped: false, score: 100 };
  }
  const stripped = stripLead(all);
  if (stripped.join(" ") !== all.join(" ") && stripped.length >= 3 && stripped.length <= 7 && !badEnd(stripped[stripped.length - 1])) {
    const keepsEnd = bare(stripped[stripped.length - 1]) === bare(all[all.length - 1]);
    return { slice: stripped, question: question && keepsEnd, chopped: true, score: 80 };
  }
  const cut = bestCut(stripped.length ? stripped : all, question);
  if (!cut) return null;
  return { slice: cut.slice, question: question && cut.keepsEnd, chopped: true, score: cut.score };
}

/**
 * @param {string} hook
 * @returns {{ line: string, chopped: boolean }}
 * chopped = words were dropped (set coverLine when the derived line is weak).
 */
export function coverLineFromHook(hook) {
  const clean = String(hook ?? "").replace(/\s+/g, " ").trim();
  const sentences = clean.split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter(Boolean);
  const ranked = sentences.map(fromSentence).filter(Boolean);
  // The first sentence is the pain. Keep it unless it barely scored.
  const first = ranked[0];
  const pick = first && (first.score >= 24 || !first.chopped) ? first : ranked.sort((a, b) => b.score - a.score)[0];
  const slice = pick?.slice?.length ? pick.slice : tokens(clean).slice(0, 3);
  let line = cap(slice.join(" "));
  if (pick?.question) line += "?";
  return { line, chopped: pick ? pick.chopped : true };
}
