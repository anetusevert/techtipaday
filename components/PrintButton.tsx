"use client";

export function PrintButton() {
  return (
    <button type="button" className="btn btn-ghost print-hide" onClick={() => window.print()}>
      Print this page
    </button>
  );
}
