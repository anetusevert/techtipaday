"use client";

import { LazyMotion, MotionConfig, domAnimation } from "framer-motion";

/** Framer Motion for the whole app. Reduced motion follows the OS setting. */
export function MotionRoot({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation} strict>
        {children}
      </LazyMotion>
    </MotionConfig>
  );
}
