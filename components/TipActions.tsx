"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { AnimatePresence, m } from "framer-motion";
import type { ShareTip } from "@/lib/tips";

const ease = [0.22, 1, 0.36, 1] as const;

function plain(t: ShareTip) {
  return [
    `TechTipADay · Tip #${t.n}`,
    t.title,
    "",
    t.summary,
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
          <Link className="btn primary" href={readHref} transitionTypes={["nav-forward"]}>
            Read<span className="sr"> the full tip</span>
          </Link>
        ) : null}
        <m.button type="button" className="btn ghost" whileTap={{ scale: 0.97 }} onClick={() => copy(plain(tip), "Copied the tip")}>
          Copy<span className="sr"> the full tip</span>
        </m.button>
        <m.button
          ref={triggerRef}
          type="button"
          className="btn ghost"
          whileTap={{ scale: 0.97 }}
          aria-expanded={sheet}
          aria-haspopup={canShare ? undefined : "dialog"}
          onClick={share}
        >
          Share<span className="sr"> this tip</span>
        </m.button>
      </div>
      <p className="action-status" role="status">
        {status}
      </p>
      {mounted
        ? createPortal(
            <AnimatePresence>
              {sheet ? (
                <div className="sheet-root">
                  <m.button
                    type="button"
                    className="sheet-backdrop"
                    aria-label="Close share sheet"
                    tabIndex={-1}
                    onClick={() => setSheet(false)}
                    initial={{ opacity: 0.45 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0.45 }}
                  />
                  <m.div
                    ref={sheetRef}
                    className="sheet"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby={titleId}
                    tabIndex={-1}
                    initial={{ y: 28 }}
                    animate={{ y: 0 }}
                    exit={{ y: 20 }}
                    transition={{ duration: 0.28, ease }}
                  >
                    <div className="sheet-handle" aria-hidden="true" />
                    <h2 id={titleId}>Share this tip</h2>
                    <p className="sheet-title">{tip.title}</p>
                    <p className="share-url">{tip.url}</p>
                    <div className="stack">
                      <button type="button" className="btn primary" onClick={() => copy(plain(tip), "Copied the tip")}>
                        Copy tip text
                      </button>
                      <button type="button" className="btn ghost" onClick={() => copy(tip.url, "Copied the link")}>
                        Copy link
                      </button>
                      <button type="button" className="btn ghost" onClick={() => setSheet(false)}>
                        Close
                      </button>
                    </div>
                  </m.div>
                </div>
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}
    </div>
  );
}
