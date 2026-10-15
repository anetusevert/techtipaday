export type Segment = { kind: "hook" | "step" | "cta"; text: string; caption?: string; start: number };
export type TipVideoProps = {
  n: number; title: string; category: string; segments: Segment[];
  voStart: number; voEnd: number; total: number; voFile: string | null;
};
