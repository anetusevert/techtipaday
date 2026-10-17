import type { Visual } from "../types";
export type Beat = "hook" | "do" | "steps" | "result" | "cta";
export type Piece = { beat: Beat; say: string; text: string; step?: number; visual?: Visual | null;
  result?: { say: string; headline: string; before: string; after: string }; start: number };
export type V3Props = { n: number; title: string; category: string; url: string; pieces: Piece[];
  voStart: number; voEnd: number; total: number; voFile: string | null };
