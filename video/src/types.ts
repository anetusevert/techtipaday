/** Per-segment visual, chosen in scripts/<slug>.json. Add new types in src/visuals.tsx. */
export type Visual =
  | { type: "phone-keyboard"; action: "miss-taps" | "hold-space" | "trackpad" | "glide-fix" | "swipe-space"; platform?: "ios" | "android"; text?: string; typo?: string; fix?: string }
  | { type: "shortcut"; keys: string[]; label?: string }
  | { type: "settings-path"; path: string[]; platform?: string }
  | { type: "icon"; icon: string; label?: string }
  | { type: "brand" }
  | { type: "phone-settings"; mode?: "settings" | "call" | "circle" | "screenshot" | "scan" | "snatch" | "taps" | "scales" | "slowmo" | "charge" | "dim" | "lock" | "spam" | "data" | "flash" | "photo"; path: string[]; rows: string[]; tap?: string; toggle?: boolean; toggleOff?: boolean; reveal?: string; caller?: string; note?: string }
  | { type: "laptop"; action: "overwrite" | "keys" | "panel" | "paste" | "frozen" | "settings" | "taskbar" | "tabs" | "snip" | "boot" | "emoji" | "passwords" | "snap"; items?: string[]; keys?: string[]; mode?: string;
      app?: string; path?: string[]; rows?: string[]; tap?: string; toggle?: boolean; toggleOff?: boolean }; // frozen/taskbar use app; settings uses path/rows/tap/toggle(/toggleOff); boot uses items
export type Segment = { kind: "hook" | "step" | "cta"; text: string; visual?: Visual; start: number };
export type TipVideoProps = {
  n: number; title: string; category: string; segments: Segment[];
  voStart: number; voEnd: number; total: number; voFile: string | null;
};
