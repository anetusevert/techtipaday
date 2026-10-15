// Caret T brand mark (from brand/cursor-symbol.svg): a T with a green text cursor. `cursor` 0..1 controls the cursor's visibility (for blink-in).
export function CaretT({ size, cursor = 1, bg = true }: { size: number; cursor?: number; bg?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block" }}>
      {bg && <rect x="4" y="4" width="92" height="92" rx="22" fill="#0b1020" stroke="#2c3658" strokeWidth="3" />}
      <path d="M24 28 H62 M43 28 V76" stroke="#eef1f8" strokeWidth="11" strokeLinecap="round" />
      <rect x="58" y="50" width="16" height="26" rx="3" fill="#3ee0a0" opacity={cursor} />
    </svg>
  );
}
