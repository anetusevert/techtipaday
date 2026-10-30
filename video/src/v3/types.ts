import type { Visual } from "../types";
export type Beat = "hook" | "do" | "steps" | "result" | "cta";
export type Piece = { beat: Beat; say: string; text: string; step?: number; label?: string | null; visual?: Visual | null; /** Optional extra line under the URL on the CTA card (cross-promos). */ note?: string;
  result?: { say: string; headline: string; before: string; after: string }; start: number };
export type V3Props = { n: number; title: string; category: string; url: string; pieces: Piece[];
  voStart: number; voEnd: number; total: number; voFile: string | null;
  /** Static hook-poster frames before the intro sting. 0 keeps the old start. */
  coverFrames?: number;
  /** Resolved 3–7 word poster line. Frame 0 and the CoverPoster still. */
  coverLine?: string; };
