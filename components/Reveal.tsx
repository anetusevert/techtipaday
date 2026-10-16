"use client";

import { m } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

/** Scroll reveal. Transform only, so the text is in the HTML and visible before JS. */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <m.div
      className={className}
      initial={{ y: 16 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, margin: "0px 0px -48px 0px" }}
      transition={{ duration: 0.55, delay, ease }}
    >
      {children}
    </m.div>
  );
}

/** Entrance for the hero card. Same rule: nudge on Y, never hide with opacity. */
export function Rise({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <m.div
      className={className}
      initial={{ y: 14 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, delay, ease }}
    >
      {children}
    </m.div>
  );
}
