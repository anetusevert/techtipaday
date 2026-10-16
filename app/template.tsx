import { ViewTransition } from "react";

const motion = {
  "nav-forward": "nav-forward",
  "nav-back": "nav-back",
  "nav-tab": "nav-tab",
  default: "none",
} as const;

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter={motion} exit={motion} default="none">
      {children}
    </ViewTransition>
  );
}
