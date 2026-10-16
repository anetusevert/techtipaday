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

export type TaskRef = {
  slug: string;
  title: string;
  h1: string;
  intro: string;
};

export type Tip = {
  n: number;
  slug: string;
  /** Publication day, YYYY-MM-DD, Europe/Berlin. This is the tip's publishedAt. */
  date: string;
  title: string;
  summary: string;
  category: CategoryId;
  /** Extra topic hubs this tip also lists on. Device hubs use `platforms`. */
  also?: CategoryId[];
  platforms: PlatformId[];
  devices: string[];
  difficulty: Difficulty;
  minutes: number;
  why: string;
  task: TaskRef;
  /** Group hubs under /fix/, in addition to task.slug. */
  tasks?: string[];
  apps?: string[];
  steps: string[];
  body: string[];
  /** Editor's shortlist. Not a view count. */
  pick?: boolean;
  video?: { hook: string; lines: string[]; cta: string };
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
