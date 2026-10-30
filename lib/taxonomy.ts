export const CATEGORY_IDS = [
  "iphone",
  "android",
  "mac",
  "windows",
  "browser",
  "ai",
  "wifi",
  "privacy",
  "productivity",
] as const;

export type CategoryId = (typeof CATEGORY_IDS)[number];

export const PLATFORM_IDS = ["iphone", "android", "mac", "windows", "chrome"] as const;
export type PlatformId = (typeof PLATFORM_IDS)[number];

export type Difficulty = "Easy" | "Moderate";

export type FaqItem = { q: string; a: string };

export type TipAlternative = {
  /** A named app, the built-in setting on another device, or the manual way. */
  name: string;
  kind: "tool" | "built-in" | "manual";
  /** When the alternative is the better pick. Be fair. */
  pickIt: string;
  /** When this tip is the better pick. */
  pickThis: string;
};

/**
 * Search fields for one tip. The daily routine fills these in for every new tip.
 * Missing optional fields fall back to generated text (seoOf in lib/tips.ts). See docs/SEO.md.
 */
export type TipSeo = {
  /** The exact phrase a person would type, lowercase. `slug` is slugify(searchPhrase) and `title` reads as the same words. */
  searchPhrase: string;
  /** 2-3 other ways people search for the same job. Used in llms.txt, search and JSON-LD, never stuffed into copy. */
  searchAlternates: string[];
  /** One to three sentences that answer the phrase outright. Shown first and used in the meta description. */
  answer: string;
  /** Two or three real follow-up questions. Rendered on the page and as FAQPage JSON-LD. */
  faq?: FaqItem[];
  /** The moment this tip helps. Fallback: `why`. */
  useWhen?: string;
  /** A real limit. Fallback: a line naming the devices it was written for. */
  notFor?: string;
  /** Other ways to get the same job done. Shown on the tip page and in llms-full.txt. */
  alternatives?: TipAlternative[];
  /** Slugs of /compare or /alternatives pages (lib/compare.ts). Unknown slugs fail the build. */
  compareWith?: string[];
};

/** Screen-mock action for the video (video/src/types.ts lists the types). */
export type TipVideoVisual = { type: string; [key: string]: unknown };
export type TipVideo = {
  /** 6-12 words, a relatable pain ending on a question or punch. */
  hook: string;
  /** Hook pill text, by hook style (default SOUND FAMILIAR?), e.g. HIDDEN SETTING, STOP DOING THIS. */
  hookLabel?: string;
  /** 3–7 short words for the grid cover (frame 0). Derived from `hook` when omitted. See video/VIDEO.md. */
  coverLine?: string;
  /** Legacy v2 lines; used as steps when `steps` is missing. */
  lines: string[];
  cta: string;
  /** Beat 2, spoken after "Here's the fix." e.g. "Hold the spacebar." */
  doThis?: string;
  /** Beat 3: 2-4 short spoken steps, each with an optional screen-mock visual. */
  steps?: { say: string; visual?: TipVideoVisual }[];
  /** Beat 4: spoken line, 2-5 word headline, before/after labels. */
  result?: { say: string; headline: string; before: string; after: string };
  /** Visual under the hook and the "do this" beat. */
  hookVisual?: TipVideoVisual;
  doVisual?: TipVideoVisual;
  /** Cross-promo only: replaces the spoken CTA line. Keep the techtipaday.com mention. */
  ctaSay?: string;
  /** Cross-promo only: one extra line under techtipaday.com on the end card. */
  ctaNote?: string;
};

export type Tip = {
  n: number;
  /** URL slug: slugify(seo.searchPhrase). Never change it without adding the old path to redirectFrom. */
  slug: string;
  /** Publication day, YYYY-MM-DD, Europe/Berlin. This is the tip's publishedAt. */
  date: string;
  /** Title tag and H1. Same words as seo.searchPhrase, with normal capitalisation. */
  title: string;
  /** Catchy human headline shown above the H1 and on cards. The H1, title tag and slug keep the plain search wording. */
  displayName?: string;
  /** One-line hook for cards and feeds. */
  summary: string;
  category: CategoryId;
  /** Extra topic hubs this tip also lists on. Device hubs use `platforms`. */
  also?: CategoryId[];
  platforms: PlatformId[];
  devices: string[];
  difficulty: Difficulty;
  minutes: number;
  why: string;
  /** Intent hub ids from lib/landings.ts (HUBS), 1-3. Unknown ids fail the build. A hub goes live once it has MIN_HUB_TIPS live tips. */
  intents?: string[];
  apps?: string[];
  /** Old paths that 301 to this tip. */
  redirectFrom?: string[];
  seo: TipSeo;
  steps: string[];
  body: string[];
  /** Optional outside resource the tip uses (e.g. a prompt page). Rendered as a linked block after the steps. */
  source?: { kicker: string; label: string; url: string; note: string };
  /** Editor's shortlist. Not a view count. */
  pick?: boolean;
  /** Daily short. v3 fields drive video/script.mjs (see video/VIDEO.md). Not rendered on the site. */
  video?: TipVideo;
};

export type TipDraft = Omit<Tip, "n" | "date">;

export type Category = {
  id: CategoryId;
  name: string;
  path: string;
  sheet: string;
  color: string;
  blurb: string;
  intro: string;
  sheetIntro: string;
};

export const CATEGORIES: Category[] = [
  {
    id: "iphone",
    name: "iPhone",
    path: "/iphone",
    sheet: "/sheets/iphone",
    color: "#0a4fd4",
    blurb: "Settings paths for iOS 18 and iOS 26.",
    intro:
      "iPhone tips with the menu names used on iOS 18 and iOS 26. Each one is a short change you can check on the screen, from the keyboard and the battery to privacy switches that are easy to miss.",
    sheetIntro:
      "A one-page iPhone checklist. Paths are the ones used on iOS 18 and iOS 26. If a row is missing on your phone, use the search field at the top of Settings.",
  },
  {
    id: "android",
    name: "Android",
    path: "/android",
    sheet: "/sheets/android",
    color: "#1b7f3a",
    blurb: "Pixel paths for Android 15 and 16, with Samsung notes.",
    intro:
      "Android tips aimed at Pixel phones on Android 15 and 16. Samsung and other brands rename a few menus, and the steps say so when the difference is a known one. If a switch is not there, the phone does not have that feature.",
    sheetIntro:
      "A printable Android checklist for Pixel phones on Android 15 and 16. Samsung paths are noted where they differ. Skip a row if the menu is not on your phone.",
  },
  {
    id: "mac",
    name: "Mac",
    path: "/mac",
    sheet: "/sheets/mac",
    color: "#5b4db8",
    blurb: "System Settings, Finder, and the shortcuts that stayed put.",
    intro:
      "Mac tips for current macOS, including macOS Tahoe. The menus live in System Settings, not the old System Preferences app. Shortcuts are the ones that have not moved in years.",
    sheetIntro:
      "A printable Mac checklist. System Settings paths match current macOS. Shortcuts use the Command key.",
  },
  {
    id: "windows",
    name: "Windows",
    path: "/windows",
    sheet: "/sheets/windows",
    color: "#0b6bb8",
    blurb: "Windows 11 settings and the keyboard shortcuts worth memorizing.",
    intro:
      "Windows 11 tips: clipboard history, window layout, screenshots, and the Settings pages that actually change something. Paths are Settings > System unless a step says otherwise.",
    sheetIntro:
      "A printable Windows 11 checklist. Press the Windows key plus the letters in the shortcut column. Settings paths start at the Start menu.",
  },
  {
    id: "browser",
    name: "Chrome / Browser",
    path: "/chrome",
    sheet: "/sheets/browser",
    color: "#c45c12",
    blurb: "Chrome settings and the tab shortcuts that also work elsewhere.",
    intro:
      "Browser tips, mostly Chrome on a computer. A few shortcuts, like reopen closed tab, also work in Edge, Firefox, and Safari. Chrome settings paths are the ones in the desktop browser.",
    sheetIntro:
      "A printable browser checklist. Chrome menu names are from the desktop browser. On a Mac, Ctrl in a shortcut usually means Command.",
  },
  {
    id: "ai",
    name: "AI tools",
    path: "/categories/ai-tools",
    sheet: "/sheets/ai",
    color: "#6d3cc9",
    blurb: "ChatGPT, Claude, and Gemini, without the pep talk.",
    intro:
      "Short ways to get a useful answer out of ChatGPT, Claude, and Gemini. The steps name the control that is actually in the product. Where a menu differs by plan or account, the tip says so.",
    sheetIntro:
      "A printable cheat sheet for ChatGPT, Claude, and Gemini. Skip any row whose control is missing on your account. Work and school logins often hide personalization.",
  },
  {
    id: "wifi",
    name: "Wi-Fi & Home tech",
    path: "/categories/wifi",
    sheet: "/sheets/wifi",
    color: "#0e7c86",
    blurb: "Passwords, slow networks, hotspots, and DNS.",
    intro:
      "Wi-Fi tips you can do from the phone that already joined the network: see or forget a saved password, stop a weak network from burning cellular data, and make a hotspot visible to an older laptop.",
    sheetIntro:
      "A printable Wi-Fi checklist. iPhone paths are iOS 18 and iOS 26. Android paths are Pixel, with the Samsung menu where it differs.",
  },
  {
    id: "privacy",
    name: "Privacy & Security",
    path: "/categories/privacy",
    sheet: "/sheets/privacy",
    color: "#a1264a",
    blurb: "Permissions, tracking, lock screen, and account hygiene.",
    intro:
      "Privacy tips that change a real switch: location, tracking prompts, lock-screen previews, hidden apps, and the checks worth doing once a year. Nothing here promises you are invisible.",
    sheetIntro:
      "A printable privacy checklist. Turn on one row, confirm it did what you expected, then do the next. Lockdown Mode and Safety Check are not everyday switches. Read those pages before you use them.",
  },
  {
    id: "productivity",
    name: "Productivity",
    path: "/categories/productivity",
    sheet: "/sheets/productivity",
    color: "#9a5b00",
    blurb: "Typing, focus, windows, and the shortcuts you will reuse.",
    intro:
      "Small speed-ups for typing, notifications, and window layout. These are the ones that stick after a day, not a new app to install.",
    sheetIntro:
      "A printable productivity checklist. Most rows are a single shortcut or a single settings screen.",
  },
];

export const categoryById = (id: string) => CATEGORIES.find((c) => c.id === id);

export function categoryName(id: CategoryId) {
  return categoryById(id)?.name ?? id;
}

export function isCategory(v: string | undefined): v is CategoryId {
  return !!v && (CATEGORY_IDS as readonly string[]).includes(v);
}

export const PLATFORMS: { id: PlatformId; name: string; path: string; intro: string; title: string; h1: string }[] = [
  {
    id: "iphone",
    name: "iPhone",
    path: "/iphone",
    title: "iPhone tips",
    h1: "iPhone tips",
    intro:
      "Every live iPhone tip in the archive, newest first. Menu names are for iOS 18 and iOS 26. Tips that also work on Android are included when the iPhone steps are part of the same trick.",
  },
  {
    id: "android",
    name: "Android",
    path: "/android",
    title: "Android tips",
    h1: "Android tips",
    intro:
      "Every live Android tip in the archive. Steps are written for Pixel phones on Android 15 and 16, and they name the Samsung menu when that path is different.",
  },
  {
    id: "mac",
    name: "Mac",
    path: "/mac",
    title: "Mac tips",
    h1: "Mac tips",
    intro:
      "Every live Mac tip in the archive. System Settings paths match current macOS, including macOS Tahoe. Keyboard shortcuts use Command.",
  },
  {
    id: "windows",
    name: "Windows",
    path: "/windows",
    title: "Windows 11 tips",
    h1: "Windows 11 tips",
    intro:
      "Every live Windows tip in the archive. These are Windows 11 settings and shortcuts. Windows 10 shares some of the shortcuts, but the Settings clicks are the Windows 11 ones.",
  },
  {
    id: "chrome",
    name: "Chrome",
    path: "/chrome",
    title: "Chrome and browser tips",
    h1: "Chrome and browser tips",
    intro:
      "Every live browser tip in the archive. Chrome settings are for the desktop browser. Shortcuts that also work in Edge, Firefox, or Safari say so on the tip.",
  },
];

export const platformById = (id: string) => PLATFORMS.find((p) => p.id === id);

export function isPlatform(v: string | undefined): v is PlatformId {
  return !!v && (PLATFORM_IDS as readonly string[]).includes(v);
}

export function isDifficulty(v: string | undefined): v is Difficulty {
  return v === "Easy" || v === "Moderate";
}
