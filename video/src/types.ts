/** Per-segment visual, chosen in scripts/<slug>.json. Add new types in src/visuals.tsx. */
export type Visual =
  | { type: "phone-keyboard"; action: "miss-taps" | "hold-space" | "trackpad" | "glide-fix" | "swipe-space"; platform?: "ios" | "android"; text?: string; typo?: string; fix?: string }
  | { type: "shortcut"; keys: string[]; label?: string }
  | { type: "settings-path"; path: string[]; platform?: string }
  | { type: "icon"; icon: string; label?: string }
  | { type: "brand" };
export type Segment = { kind: "hook" | "step" | "cta"; text: string; visual?: Visual; start: number };
export type TipVideoProps = {
  n: number; title: string; category: string; segments: Segment[];
  voStart: number; voEnd: number; total: number; voFile: string | null;
};
