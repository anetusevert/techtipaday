import { loadFont as loadSans } from "@remotion/google-fonts/Outfit";
import { loadFont as loadMono } from "@remotion/google-fonts/IBMPlexMono";
export const fontSans = loadSans("normal", { weights: ["500", "700", "800"], subsets: ["latin"] }).fontFamily;
export const fontMono = loadMono("normal", { weights: ["500"], subsets: ["latin"] }).fontFamily;
