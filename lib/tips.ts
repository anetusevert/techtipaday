import { APPS, HUBS, appBySlug, hubBySlug } from "./landings";
import { catalog } from "./catalog";
import {
  CATEGORIES,
  PLATFORMS,
  categoryById,
  categoryName,
  isCategory,
  isDifficulty,
  isPlatform,
  platformById,
  type CategoryId,
  type Difficulty,
  type PlatformId,
  type Tip,
  type TipDraft,
} from "./taxonomy";

export type { CategoryId, Difficulty, PlatformId, Tip } from "./taxonomy";
export { CATEGORIES, PLATFORMS, categoryName, isCategory, isDifficulty, isPlatform, categoryById, platformById };

const originals: Tip[] = [
  {
    n: 1,
    slug: "spacebar-cursor-trick",
    date: "2026-10-16",
    title: "Hold the spacebar to move your cursor precisely",
    summary: "Stop poking at the middle of a word. Your phone keyboard has a hidden trackpad.",
    category: "iphone",
    also: ["android"],
    platforms: ["iphone", "android"],
    devices: ["iPhone", "Android (Gboard)"],
    difficulty: "Easy",
    minutes: 1,
    why: "You land the cursor on the letter you meant, instead of the one next to it.",
    task: {
      slug: "move-cursor-precisely",
      title: "How to move the cursor precisely on a phone keyboard",
      h1: "How to move the cursor precisely on a phone keyboard",
      intro:
        "Phone keyboards can move the cursor without tapping the text. On iPhone you hold the spacebar. On Android with Gboard you swipe along it. This page collects that trick.",
    },
    tasks: ["keyboard"],
    apps: ["gboard"],
    steps: [
      "iPhone: press and hold the spacebar until the letters go blank, then slide your finger. The keyboard is now a trackpad.",
      "Still holding, tap a second finger on the keyboard to start selecting text.",
      "Android with Gboard: swipe left or right along the spacebar to nudge the cursor one character at a time.",
    ],
    body: [
      "I lost years of my life tapping on a typo, landing one letter off, and tapping again. Then someone showed me this and I felt a bit silly.",
      "On iPhone the whole keyboard turns grey once you hold the spacebar, and you can glide the cursor anywhere in the text, including up and down lines. On Android with Gboard it's a swipe on the spacebar instead of a hold. Samsung's own keyboard does the same swipe.",
      "If it doesn't work on Gboard, check Settings > Gboard > Glide typing and make sure 'Enable gesture cursor control' is on.",
    ],
    pick: true,
    video: {
      hook: "Still tapping on typos and missing every time?",
      lines: [
        "Hold the spacebar.",
        "Your keyboard turns into a trackpad.",
        "Slide to put the cursor exactly where you want it.",
        "On Android, just swipe along the spacebar.",
      ],
      cta: "One tech tip a day at techtipaday.com",
    },
  },
  {
    n: 2,
    slug: "find-saved-wifi-password",
    date: "2026-10-17",
    title: "See the Wi-Fi password your phone already saved",
    summary: "A friend asks for the Wi-Fi password and nobody remembers it. Your phone does.",
    category: "wifi",
    platforms: ["iphone", "android"],
    devices: ["iPhone (iOS 16+)", "Android 10+"],
    difficulty: "Easy",
    minutes: 1,
    why: "The password is already on a phone in the house. You do not have to crawl behind the router.",
    task: {
      slug: "wifi-password",
      title: "How to see a saved Wi-Fi password",
      h1: "How to see a saved Wi-Fi password",
      intro:
        "A phone that has joined a Wi-Fi network can show you the password it saved. iPhone reveals it after Face ID or a passcode. Android usually shows a QR code, with the password written under it.",
    },
    tasks: ["wifi"],
    steps: [
      "iPhone: Settings > Wi-Fi, tap the (i) next to the network, then tap the hidden Password field. Face ID unlocks it.",
      "Android: Settings > Network & internet > Internet (or Wi-Fi), tap the gear next to the network, then Share. You get a QR code, and the password is usually written underneath.",
      "The other person can just scan the QR code with their camera and join.",
    ],
    body: [
      "Router stickers get peeled off, people change the password and forget, and you end up crawling behind the TV. If any phone in the house has joined that network before, the password is sitting right there.",
      "Menu names shift a bit between Android brands. On Samsung it's Settings > Connections > Wi-Fi, gear icon, then the QR code button at the bottom.",
    ],
    pick: true,
  },
  {
    n: 3,
    slug: "copy-text-from-photo",
    date: "2026-10-18",
    title: "Copy text straight out of a photo",
    summary: "No more retyping a serial number or a Wi-Fi code from a picture.",
    category: "iphone",
    also: ["android"],
    platforms: ["iphone", "android"],
    devices: ["iPhone (iOS 15+)", "Android (Google Lens)"],
    difficulty: "Easy",
    minutes: 1,
    why: "A code in a photo becomes text you can paste.",
    task: {
      slug: "copy-text-from-photo",
      title: "How to copy text from a photo",
      h1: "How to copy text from a photo",
      intro:
        "iPhone Live Text and Google Lens can copy words out of a picture. You do not retype the serial number or the Wi-Fi code. This page collects both paths.",
    },
    tasks: ["copy-text"],
    apps: ["photos"],
    steps: [
      "iPhone: open the photo, then press and hold on the text. It highlights like normal text, so you can copy it. A small text icon in the corner selects everything.",
      "Android: open the photo in Google Photos and tap Lens, then tap Text. Select what you need and hit Copy.",
      "Works on the live camera too, before you even take the picture.",
    ],
    body: [
      "I use this most for the long codes on the back of devices and for phone numbers on posters. It also handles handwriting surprisingly well if it's reasonably neat.",
      "On iPhone this is called Live Text. If nothing happens when you hold on the text, check Settings > General > Language & Region and make sure Live Text is on.",
    ],
    pick: true,
  },
  {
    n: 4,
    slug: "reopen-closed-tab",
    date: "2026-10-19",
    title: "Bring back the tab you just closed by accident",
    summary: "One shortcut, and it works more than once.",
    category: "browser",
    platforms: ["chrome", "mac", "windows"],
    devices: ["Chrome", "Edge", "Firefox", "Safari"],
    difficulty: "Easy",
    minutes: 1,
    why: "The form you were halfway through comes back, history included.",
    task: {
      slug: "reopen-closed-tab",
      title: "How to reopen a closed browser tab",
      h1: "How to reopen a closed browser tab",
      intro:
        "Desktop browsers reopen the last tab you closed. Windows and Linux use Ctrl + Shift + T. A Mac uses Command + Shift + T. Press it again to walk further back.",
    },
    tasks: ["tabs"],
    steps: [
      "Windows and Linux: Ctrl + Shift + T.",
      "Mac: Cmd + Shift + T.",
      "Press it again to keep going back through tabs you closed, in order.",
    ],
    body: [
      "Closed the tab with the form you were halfway through? Press the shortcut right away. In most browsers the page comes back with its history, so the back button still works.",
      "If you closed a whole window by mistake, the same shortcut usually brings back the whole window with all its tabs.",
    ],
    pick: true,
  },
  {
    n: 5,
    slug: "screenshot-part-of-screen",
    date: "2026-10-20",
    title: "Screenshot just part of your screen",
    summary: "Skip the full-screen screenshot and the cropping afterwards.",
    category: "windows",
    also: ["mac"],
    platforms: ["windows", "mac"],
    devices: ["Windows 10/11", "macOS"],
    difficulty: "Easy",
    minutes: 1,
    why: "The picture is the region you wanted, not a desktop you then have to crop.",
    task: {
      slug: "screenshot-part",
      title: "How to screenshot part of the screen",
      h1: "How to screenshot part of the screen",
      intro:
        "Windows and macOS can capture a rectangle instead of the whole display. Windows + Shift + S copies the region. Command + Shift + 4 on a Mac saves a file.",
    },
    tasks: ["screenshots"],
    steps: [
      "Windows: press Windows + Shift + S, then drag a box around what you want. It goes to your clipboard, ready to paste.",
      "Mac: press Cmd + Shift + 4, then drag. The image lands on your desktop.",
      "Mac bonus: press Cmd + Shift + 4, then tap the spacebar, then click a window to capture just that window.",
    ],
    body: [
      "On Windows, a notification pops up after the snip. Click it if you want to draw on the screenshot or save it as a file.",
      "On a Mac, add Control to the shortcut (Cmd + Ctrl + Shift + 4) if you'd rather have it on the clipboard instead of cluttering the desktop.",
    ],
    pick: true,
  },
  {
    n: 6,
    slug: "ai-ask-me-questions-first",
    date: "2026-10-21",
    title: "Tell the AI to ask you questions first",
    summary: "One line at the end of a prompt gets you answers that actually fit your situation.",
    category: "ai",
    platforms: [],
    devices: ["ChatGPT", "Claude", "Gemini", "any chatbot"],
    difficulty: "Easy",
    minutes: 1,
    why: "The model stops filling the gaps with a generic guess.",
    task: {
      slug: "ask-ai-before-it-answers",
      title: "How to make an AI ask you questions first",
      h1: "How to make an AI ask you questions first",
      intro:
        "ChatGPT, Claude, and Gemini will guess the details you left out. Tell them to ask first, and cap the number of questions, so the real answer fits the situation.",
    },
    tasks: ["ai-prompts"],
    apps: ["chatgpt", "claude", "gemini"],
    steps: [
      "Write your request as normal.",
      'Add at the end: "Before you answer, ask me up to 3 questions about anything you need to know."',
      "Answer its questions, then let it write the real answer.",
    ],
    body: [
      "Chatbots fill gaps with guesses. If you ask for a workout plan, a cover letter or a trip itinerary, you get something generic because it doesn't know your budget, your schedule, or what you've already tried.",
      "Making it ask first flips that. Capping it at three questions keeps it from turning into a survey.",
    ],
    pick: true,
  },
  {
    n: 7,
    slug: "iphone-80-percent-charging-limit",
    date: "2026-10-22",
    title: "Cap your iPhone charge at 80% to save the battery",
    summary: "If you charge overnight every night, this setting is worth a look.",
    category: "iphone",
    also: ["android"],
    platforms: ["iphone", "android"],
    devices: ["iPhone 15 and later", "Samsung Galaxy"],
    difficulty: "Easy",
    minutes: 1,
    why: "A battery that sits at 100% every night ages faster than one that stops earlier.",
    task: {
      slug: "battery-charge-limit",
      title: "How to cap a phone's charge limit",
      h1: "How to cap a phone's charge limit",
      intro:
        "iPhone 15 and later can stop charging at a limit you choose. Older iPhones use Optimized Battery Charging instead. Samsung has its own battery protection setting. This page collects those switches.",
    },
    tasks: ["save-battery"],
    steps: [
      "iPhone 15 or newer: Settings > Battery > Charging, then pick 80% (newer iOS versions also offer 85%, 90% and 95%).",
      "Older iPhones: Settings > Battery > Battery Health & Charging > Optimized Battery Charging. It holds at 80% and finishes before you usually unplug.",
      "Samsung Galaxy: Settings > Battery > Battery protection (the menu name varies a little by One UI version).",
    ],
    body: [
      "Lithium-ion batteries wear faster when they sit at 100% for hours, especially when they're warm. Stopping at 80% trades a bit of daily range for a battery that holds up longer over the years.",
      "If 80% isn't enough to get you through the day, don't bother. A dead phone at 6pm isn't worth it. Optimized charging is the gentler middle ground.",
    ],
    pick: true,
  },
];

function addDays(iso: string, delta: number) {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + delta);
  return dt.toISOString().slice(0, 10);
}

/** Oldest back-dated tip is 4 Aug 2026. One tip per day through 15 Oct, the day before tip 1. */
const BACKDATE_START = "2026-08-04";

const backdated: Tip[] = catalog.map((draft, index) => ({
  ...draft,
  n: 8 + index,
  date: addDays(BACKDATE_START, index),
}));

export const tips: Tip[] = [...originals, ...backdated];

function assertLibrary(list: Tip[]) {
  const slugs = new Set<string>();
  const tasks = new Set<string>();
  const required = [
    ["spacebar-cursor-trick", "2026-10-16"],
    ["find-saved-wifi-password", "2026-10-17"],
    ["copy-text-from-photo", "2026-10-18"],
    ["reopen-closed-tab", "2026-10-19"],
    ["screenshot-part-of-screen", "2026-10-20"],
    ["ai-ask-me-questions-first", "2026-10-21"],
    ["iphone-80-percent-charging-limit", "2026-10-22"],
  ] as const;
  for (const [slug, date] of required) {
    const tip = list.find((item) => item.slug === slug);
    if (!tip || tip.date !== date) throw new Error(`Original tip changed: ${slug}`);
  }
  if (list.length < 80) throw new Error(`Expected at least 80 tips, found ${list.length}`);
  for (const tip of list) {
    if (slugs.has(tip.slug)) throw new Error(`Duplicate slug ${tip.slug}`);
    slugs.add(tip.slug);
    if (tip.steps.length < 3 || tip.steps.length > 6) throw new Error(`Step count ${tip.slug}`);
    if (!tip.why || !tip.summary || !tip.task?.intro || !tip.task.slug) throw new Error(`Missing fields ${tip.slug}`);
    if (tasks.has(tip.task.slug)) throw new Error(`Duplicate task ${tip.task.slug}`);
    tasks.add(tip.task.slug);
    for (const app of tip.apps ?? []) {
      if (!appBySlug(app)) throw new Error(`Unknown app ${app} on ${tip.slug}`);
    }
    for (const hub of tip.tasks ?? []) {
      if (!hubBySlug(hub)) throw new Error(`Unknown hub ${hub} on ${tip.slug}`);
    }
  }
}

assertLibrary(tips);

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://techtipaday.com").replace(/\/$/, "");
export const SITE_NAME = "TechTipADay";
export const SITE_DESC = "One useful phone, AI-tool or everyday tech tip a day. Short, tested, no fluff.";

/** Calendar date in Europe/Berlin, `YYYY-MM-DD`. Tips go live on this date and not before. */
export const todayISO = () => new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Berlin" });

export const isLive = (t: Tip) => t.date <= todayISO();

export const byNewest = () =>
  tips.filter(isLive).sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : b.n - a.n));

export const getTip = (slug: string) => tips.find((t) => t.slug === slug);
export const getLiveTip = (slug: string) => {
  const t = getTip(slug);
  return t && isLive(t) ? t : undefined;
};

export function formatDate(iso: string, opts: Intl.DateTimeFormatOptions = {}) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
    ...opts,
  }).format(new Date(Date.UTC(y, m - 1, d)));
}

export function formatMinutes(n: number) {
  return n === 1 ? "1 min" : `${n} min`;
}

export function tipUrl(slug: string) {
  return `${SITE_URL}/tips/${slug}`;
}

function prevISO(iso: string) {
  return addDays(iso, -1);
}

/** Consecutive published days, counting backward from the newest live tip. */
export function streakOf(list: Tip[]) {
  if (!list.length) return 0;
  const days = new Set(list.map((t) => t.date));
  let iso = list[0].date;
  let n = 0;
  while (days.has(iso)) {
    n += 1;
    iso = prevISO(iso);
  }
  return n;
}

export function freshness(list: Tip[]) {
  const today = todayISO();
  const weekStart = addDays(today, -6);
  const newToday = list.filter((t) => t.date === today).length;
  const addedWeek = list.filter((t) => t.date >= weekStart && t.date <= today).length;
  return { today, newToday, addedWeek, total: list.length, streak: streakOf(list) };
}

export type ShareTip = {
  n: number;
  title: string;
  summary: string;
  why: string;
  steps: string[];
  body: string[];
  url: string;
};

export function shareTip(t: Tip): ShareTip {
  return {
    n: t.n,
    title: t.title,
    summary: t.summary,
    why: t.why,
    steps: t.steps,
    body: t.body,
    url: tipUrl(t.slug),
  };
}

export type TipQuery = {
  q?: string;
  platform?: string;
  difficulty?: string;
  sort?: string;
  category?: string;
};

export function tipsHref(params: TipQuery = {}) {
  const sp = new URLSearchParams();
  if (params.q) sp.set("q", params.q);
  if (params.platform && isPlatform(params.platform)) sp.set("platform", params.platform);
  if (params.difficulty && isDifficulty(params.difficulty)) sp.set("difficulty", params.difficulty);
  if (params.sort === "popular") sp.set("sort", "popular");
  if (params.category && isCategory(params.category)) sp.set("category", params.category);
  const s = sp.toString();
  return s ? `/tips?${s}` : "/tips";
}

/** Lowercase and drop hyphens so "wifi" matches "Wi-Fi". */
function fold(value: string) {
  return value.toLowerCase().replace(/[‐‑‒–—-]/g, "");
}

function haystack(tip: Tip) {
  return fold(
    [
      tip.title,
      tip.summary,
      tip.why,
      tip.task.title,
      tip.task.h1,
      categoryName(tip.category),
      ...tip.devices,
      ...tip.steps,
      ...tip.body,
      ...(tip.apps ?? []).map((id) => appBySlug(id)?.name ?? id),
    ].join("\n"),
  );
}

export function filterTips(list: Tip[], query: TipQuery) {
  const q = fold(query.q?.trim() ?? "");
  const platform = isPlatform(query.platform) ? query.platform : undefined;
  const difficulty = isDifficulty(query.difficulty) ? query.difficulty : undefined;
  const category = isCategory(query.category) ? query.category : undefined;
  let next = list.filter((tip) => {
    if (platform && !tip.platforms.includes(platform)) return false;
    if (difficulty && tip.difficulty !== difficulty) return false;
    if (category && tip.category !== category && !tip.also?.includes(category)) return false;
    if (q && !haystack(tip).includes(q)) return false;
    return true;
  });
  if (query.sort === "popular") next = next.filter((tip) => tip.pick);
  return next;
}

export function tipsForPlatform(id: PlatformId) {
  return byNewest().filter((tip) => tip.platforms.includes(id));
}

export function tipsForCategory(id: CategoryId) {
  return byNewest().filter((tip) => tip.category === id || tip.also?.includes(id));
}

export function tipsForFix(slug: string) {
  return byNewest().filter((tip) => tip.task.slug === slug || tip.tasks?.includes(slug));
}

export function tipsForApp(slug: string) {
  return byNewest().filter((tip) => tip.apps?.includes(slug));
}

export type FixPage = {
  slug: string;
  path: string;
  title: string;
  h1: string;
  intro: string;
};

export function fixPage(slug: string): FixPage | undefined {
  const hub = hubBySlug(slug);
  if (hub) return { slug, path: `/fix/${slug}`, title: hub.title, h1: hub.h1, intro: hub.intro };
  const tip = tips.find((item) => item.task.slug === slug);
  if (!tip) return undefined;
  return { slug, path: `/fix/${slug}`, title: tip.task.title, h1: tip.task.h1, intro: tip.task.intro };
}

export function liveFixPages(): FixPage[] {
  const slugs = new Set<string>();
  for (const tip of byNewest()) {
    slugs.add(tip.task.slug);
    for (const hub of tip.tasks ?? []) slugs.add(hub);
  }
  return [...slugs]
    .map((slug) => fixPage(slug))
    .filter((page): page is FixPage => !!page)
    .sort((a, b) => a.h1.localeCompare(b.h1));
}

export function liveAppPages() {
  return APPS.filter((app) => tipsForApp(app.slug).length > 0).sort((a, b) => a.name.localeCompare(b.name));
}

export function liveDevicePages() {
  return PLATFORMS.filter((platform) => tipsForPlatform(platform.id).length > 0);
}

export function liveTopicPages() {
  return CATEGORIES.filter((category) => category.path.startsWith("/categories/") && tipsForCategory(category.id).length > 0);
}

export function liveSheetIds(): CategoryId[] {
  return CATEGORIES.filter((category) => tipsForCategory(category.id).length > 0).map((category) => category.id);
}

export function relatedTips(tip: Tip, limit = 4) {
  const live = byNewest().filter((item) => item.slug !== tip.slug);
  const sameTask = live.filter((item) => item.task.slug === tip.task.slug || item.tasks?.some((hub) => tip.tasks?.includes(hub) || hub === tip.task.slug));
  const sameCategory = live.filter((item) => item.category === tip.category);
  const samePlatform = live.filter((item) => item.platforms.some((platform) => tip.platforms.includes(platform)));
  const picked: Tip[] = [];
  for (const group of [sameTask, sameCategory, samePlatform]) {
    for (const item of group) {
      if (picked.length >= limit) return picked;
      if (!picked.some((have) => have.slug === item.slug)) picked.push(item);
    }
  }
  return picked;
}

export function neighbors(tip: Tip) {
  const live = byNewest();
  const index = live.findIndex((item) => item.slug === tip.slug);
  return {
    newer: index > 0 ? live[index - 1] : undefined,
    older: index >= 0 && index < live.length - 1 ? live[index + 1] : undefined,
  };
}

export function relatedFixes(slug: string, limit = 6) {
  const current = tipsForFix(slug);
  const platforms = new Set(current.flatMap((tip) => tip.platforms));
  const categories = new Set(current.flatMap((tip) => [tip.category, ...(tip.also ?? [])]));
  return liveFixPages()
    .filter((page) => page.slug !== slug)
    .map((page) => {
      const list = tipsForFix(page.slug);
      const score = list.some((tip) => tip.platforms.some((platform) => platforms.has(platform)) || categories.has(tip.category)) ? 1 : 0;
      return { page, count: list.length, score };
    })
    .sort((a, b) => b.score - a.score || b.count - a.count || a.page.h1.localeCompare(b.page.h1))
    .slice(0, limit);
}

export function searchPages(q: string) {
  const needle = fold(q.trim());
  if (needle.length < 2) return [];
  const pages: { href: string; title: string; kind: string }[] = [];
  const hit = (text: string) => fold(text).includes(needle);
  for (const page of liveFixPages()) {
    if (hit(`${page.title} ${page.h1} ${page.intro}`)) {
      pages.push({ href: page.path, title: page.h1, kind: "Fix" });
    }
  }
  for (const app of liveAppPages()) {
    if (hit(`${app.name} ${app.title} ${app.intro}`)) {
      pages.push({ href: `/apps/${app.slug}`, title: app.h1, kind: "App" });
    }
  }
  for (const device of liveDevicePages()) {
    if (hit(`${device.name} ${device.title} ${device.intro}`)) {
      pages.push({ href: device.path, title: device.h1, kind: "Device" });
    }
  }
  for (const topic of CATEGORIES) {
    if (tipsForCategory(topic.id).length && hit(`${topic.name} ${topic.blurb} ${topic.intro}`)) {
      pages.push({ href: topic.path, title: topic.name, kind: "Topic" });
    }
  }
  const seen = new Set<string>();
  return pages.filter((page) => (seen.has(page.href) ? false : (seen.add(page.href), true))).slice(0, 8);
}

export function popularTips(limit = 6) {
  return byNewest().filter((tip) => tip.pick).slice(0, limit);
}

export function hubCards() {
  return HUBS.map((hub) => ({ hub, count: tipsForFix(hub.slug).length })).filter((item) => item.count > 0);
}

