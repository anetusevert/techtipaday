"use client";

import { useEffect, useRef } from "react";
import { BEEHIIV_FORM_ID, BEEHIIV_LOADER } from "@/lib/newsletter";

const IFRAME_TITLE = "Subscribe to the TechTipADay newsletter";

/** Beehiiv's loader renders the form next to this script. The free plan has no API. */
export function BeehiivEmbed() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const labelFrames = () => {
      root.querySelectorAll("iframe").forEach((frame) => {
        if (!frame.getAttribute("title")) frame.setAttribute("title", IFRAME_TITLE);
      });
    };
    const observer = new MutationObserver(labelFrames);
    observer.observe(root, { childList: true, subtree: true });

    if (!root.querySelector("script[data-beehiiv-form]")) {
      const script = document.createElement("script");
      script.async = true;
      script.src = BEEHIIV_LOADER;
      script.dataset.beehiivForm = BEEHIIV_FORM_ID;
      root.appendChild(script);
    }
    labelFrames();

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="newsletter-embed">
      <script async src={BEEHIIV_LOADER} data-beehiiv-form={BEEHIIV_FORM_ID} />
    </div>
  );
}
