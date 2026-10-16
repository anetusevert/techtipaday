"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import type { ShareTip } from "@/lib/tips";

function plain(t: ShareTip) {
  return [
    `TechTipADay · ${t.title}`,
    "",
    t.summary,
    "",
    `Why it matters: ${t.why}`,
    "",
    "How to do it:",
    ...t.steps.map((s, i) => `${i + 1}. ${s}`),
    "",
    ...t.body,
    "",
    t.url,
  ].join("\n");
}

async function writeText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.left = "-9999px";
      document.body.appendChild(area);
      area.select();
      const ok = document.execCommand("copy");
      area.remove();
      return ok;
    } catch {
      return false;
    }
  }
}

export function TipActions({ tip, readHref }: { tip: ShareTip; readHref?: string }) {
  const [status, setStatus] = useState("");
  const [sheet, setSheet] = useState(false);
  const [canShare, setCanShare] = useState(false);
  const [mounted, setMounted] = useState(false);
  const titleId = useId();
  const sheetRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
    setCanShare(typeof navigator.share === "function");
  }, []);

  useEffect(() => {
    if (!sheet) return;
    const dialog = sheetRef.current;
    const previous = document.activeElement as HTMLElement | null;
    dialog?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setSheet(false);
        return;
      }
      if (event.key !== "Tab" || !dialog) return;
      const nodes = [...dialog.querySelectorAll<HTMLElement>("button, a[href], input, textarea, select")].filter(
        (node) => !node.hasAttribute("disabled"),
      );
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      (previous && previous !== document.body ? previous : triggerRef.current)?.focus();
    };
  }, [sheet]);

  async function copy(text: string, message: string) {
    const ok = await writeText(text);
    setStatus(ok ? message : "Couldn't copy. Select the link in the share sheet.");
    if (!ok) setSheet(true);
  }

  async function share() {
    const data = { title: tip.title, text: `${tip.title} — ${tip.summary}`, url: tip.url };
    if (canShare) {
      try {
        await navigator.share(data);
        setStatus("Share sheet opened");
      } catch (error) {
        if ((error as Error).name !== "AbortError") setSheet(true);
      }
      return;
    }
    setSheet(true);
  }

  return (
    <div className="action-block">
      <div className="actions">
        {readHref ? (
          <Link className="btn btn-primary" href={readHref}>
            Read the tip
          </Link>
        ) : null}
        <button type="button" className="btn btn-ghost" onClick={() => copy(plain(tip), "Copied the tip")}>
          Copy
        </button>
        <button
          ref={triggerRef}
          type="button"
          className="btn btn-ghost"
          aria-expanded={sheet}
          aria-haspopup={canShare ? undefined : "dialog"}
          onClick={share}
        >
          Share
        </button>
      </div>
      <p className="action-status" role="status">
        {status}
      </p>
      {mounted && sheet
        ? createPortal(
            <div className="sheet-root">
              <button type="button" className="sheet-backdrop" aria-label="Close share sheet" tabIndex={-1} onClick={() => setSheet(false)} />
              <div ref={sheetRef} className="share-sheet" role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1}>
                <h2 id={titleId}>Share this tip</h2>
                <p className="share-title">{tip.title}</p>
                <p className="share-url">{tip.url}</p>
                <div className="stack">
                  <button type="button" className="btn btn-primary" onClick={() => copy(plain(tip), "Copied the tip")}>
                    Copy tip text
                  </button>
                  <button type="button" className="btn btn-ghost" onClick={() => copy(tip.url, "Copied the link")}>
                    Copy link
                  </button>
                  <button type="button" className="btn btn-ghost" onClick={() => setSheet(false)}>
                    Close
                  </button>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
