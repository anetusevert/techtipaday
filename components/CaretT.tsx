/** Caret T: navy tile, off-white T, green cursor. The cursor blinks in CSS. */
export function CaretT({ size = 36 }: { size?: number }) {
  return (
    <svg className="caret-mark" width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      <rect x="4" y="4" width="92" height="92" rx="22" fill="#0b1020" />
      <path d="M24 28 H62 M43 28 V76" stroke="#eef1f8" strokeWidth="11" strokeLinecap="round" fill="none" />
      <rect className="caret-cursor" x="58" y="50" width="16" height="26" rx="3" fill="#3ee0a0" />
    </svg>
  );
}
