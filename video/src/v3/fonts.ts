// v3 type system (distinct from OAAD's serif + Plex Mono): Bricolage Grotesque display, DM Sans body, JetBrains Mono "machine".
import { loadFont as loadDisplay } from "@remotion/google-fonts/BricolageGrotesque";
import { loadFont as loadSans } from "@remotion/google-fonts/DMSans";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
export const fDisplay = loadDisplay("normal", { weights: ["700", "800"], subsets: ["latin"] }).fontFamily;
export const fSans = loadSans("normal", { weights: ["500", "700"], subsets: ["latin"] }).fontFamily;
export const fMono = loadMono("normal", { weights: ["500", "700"], subsets: ["latin"] }).fontFamily;
