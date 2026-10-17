import { APPS, HUBS, MIN_HUB_TIPS, appBySlug, hubById, type Hub } from "./landings";
import { COMPARES, MIN_ALTERNATIVES, compareBySlug, comparePath, type ComparePage } from "./compare";
import { normalizeQuery, slugify } from "./seo";
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
export type { Hub } from "./landings";
export type { ComparePage } from "./compare";
export { MIN_HUB_TIPS };
export { CATEGORIES, PLATFORMS, categoryName, isCategory, isDifficulty, isPlatform, categoryById, platformById };

const originals: Tip[] = [
  {
    n: 1,
    slug: "how-to-move-the-cursor-on-an-iphone-or-android-keyboard",
    date: "2026-10-16",
    title: "How to move the cursor on an iPhone or Android keyboard",
    summary: "Stop poking at the middle of a word. Your phone keyboard has a hidden trackpad.",
    category: "iphone",
    also: ["android"],
    platforms: ["iphone", "android"],
    devices: ["iPhone", "Android (Gboard)"],
    difficulty: "Easy",
    minutes: 1,
    why: "You land the cursor on the letter you meant, instead of the one next to it.",
    apps: ["gboard"],
    intents: ["keyboard"],
    redirectFrom: ["/tips/spacebar-cursor-trick", "/fix/move-cursor-precisely"],
    seo: {
      searchPhrase: "how to move the cursor on an iphone or android keyboard",
      searchAlternates: ["iphone spacebar trackpad", "how to move cursor on iphone", "gboard move cursor with spacebar"],
      answer: "On iPhone, press and hold the spacebar and slide your finger. The keyboard turns into a trackpad. On Android with Gboard, swipe left or right along the spacebar.",
      faq: [
        { q: "Does the spacebar trick work on every iPhone?", a: "It has been there since iOS 12, so any iPhone running a current iOS has it." },
        { q: "Why doesn't the spacebar swipe work in Gboard?", a: "Open Settings > Gboard > Glide typing and turn on Enable gesture cursor control. With that off, swiping on the spacebar does nothing." },
        { q: "Can I select text this way on iPhone?", a: "Yes. While you hold the spacebar, tap the keyboard with a second finger, then keep sliding to select." },
      ],
    },
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
    slug: "how-to-see-a-saved-wifi-password-on-iphone-or-android",
    date: "2026-10-17",
    title: "How to see a saved Wi-Fi password on iPhone or Android",
    summary: "A friend asks for the Wi-Fi password and nobody remembers it. Your phone does.",
    category: "wifi",
    platforms: ["iphone", "android"],
    devices: ["iPhone (iOS 16+)", "Android 10+"],
    difficulty: "Easy",
    minutes: 1,
    why: "The password is already on a phone in the house. You do not have to crawl behind the router.",
    intents: ["wifi"],
    redirectFrom: ["/tips/find-saved-wifi-password", "/fix/wifi-password"],
    seo: {
      searchPhrase: "how to see a saved wifi password on iphone or android",
      searchAlternates: ["how to find wifi password on iphone", "show wifi password android", "share wifi password with qr code"],
      answer: "On iPhone, go to Settings > Wi-Fi, tap the (i) next to the network, then tap Password. On Android, open the network in Wi-Fi settings and tap Share. You get a QR code with the password written under it.",
      faq: [
        { q: "Which iPhones can show a saved Wi-Fi password?", a: "Any iPhone on iOS 16 or later. Face ID, Touch ID or your passcode unlocks the field." },
        { q: "Can I see the password for a network I'm not connected to?", a: "On iPhone, tap Edit on the Wi-Fi screen to see networks you've joined before, then tap the (i) on one. On Android, Saved networks in the Internet settings does the same." },
        { q: "Where is it on a Samsung phone?", a: "Settings > Connections > Wi-Fi, tap the gear next to the network, then the QR code button at the bottom." },
      ],
    },
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
    slug: "how-to-copy-text-from-a-photo-on-iphone-or-android",
    date: "2026-10-18",
    title: "How to copy text from a photo on iPhone or Android",
    summary: "No more retyping a serial number or a Wi-Fi code from a picture.",
    category: "iphone",
    also: ["android"],
    platforms: ["iphone", "android"],
    devices: ["iPhone (iOS 15+)", "Android (Google Lens)"],
    difficulty: "Easy",
    minutes: 1,
    why: "A code in a photo becomes text you can paste.",
    apps: ["photos"],
    intents: ["copy-text"],
    redirectFrom: ["/tips/copy-text-from-photo", "/fix/copy-text-from-photo"],
    seo: {
      searchPhrase: "how to copy text from a photo on iphone or android",
      searchAlternates: ["live text iphone", "copy text from image android", "google lens copy text"],
      answer: "On iPhone, open the photo, press and hold on the text, then tap Copy. On Android, open the photo in Google Photos, tap Lens, then Text, and copy what you need.",
      faq: [
        { q: "What is Live Text on iPhone?", a: "It's the feature that reads text in photos and in the camera view. It's on iOS 15 and later, and the switch is in Settings > General > Language & Region." },
        { q: "Does it read handwriting?", a: "Neat handwriting usually works. Messy notes and tiny print are hit and miss, so check what you pasted." },
        { q: "Can I copy text without taking a photo first?", a: "Yes. Point the camera at the text and tap the text icon that appears on iPhone, or use Lens in the camera on Android." },
      ],
    },
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
    slug: "how-to-reopen-a-closed-tab-in-chrome",
    date: "2026-10-19",
    title: "How to reopen a closed tab in Chrome",
    summary: "One shortcut, and it works more than once.",
    category: "browser",
    platforms: ["chrome", "mac", "windows"],
    devices: ["Chrome", "Edge", "Firefox", "Safari"],
    difficulty: "Easy",
    minutes: 1,
    why: "The form you were halfway through comes back, history included.",
    intents: ["tabs", "mac-keyboard-shortcuts"],
    redirectFrom: ["/tips/reopen-closed-tab", "/fix/reopen-closed-tab"],
    seo: {
      searchPhrase: "how to reopen a closed tab in chrome",
      searchAlternates: ["ctrl shift t", "reopen closed tab on mac", "restore closed chrome window", "undo close tab"],
      answer: "Press Ctrl + Shift + T on Windows, or Cmd + Shift + T on a Mac. Press it again to keep bringing tabs back in the order you closed them. The same shortcut works in Edge, Firefox and Safari.",
      faq: [
        { q: "Can I reopen a whole window I closed?", a: "Usually, yes. If the last thing you closed was a window, the same shortcut brings it back with all its tabs." },
        { q: "Is there a way to do it without the keyboard?", a: "In Chrome, right-click an empty part of the tab strip and choose Reopen closed tab. History in the three-dot menu also lists recently closed tabs." },
        { q: "Does it bring back what I typed into a form?", a: "Sometimes. The page and its back-button history come back, but whether typed text survives depends on the site. Don't count on it for a long message." },
      ],
      notFor: "It only goes back through tabs closed in this session. After a restart, use History.",
      alternatives: [
        { name: "History menu", kind: "built-in", pickIt: "The tab was closed hours ago or before a restart. Press Ctrl + H, or Cmd + Y on a Mac.", pickThis: "You closed it a second ago." },
        { name: "Right-click the tab strip", kind: "built-in", pickIt: "You'd rather click than remember a shortcut. Choose Reopen closed tab.", pickThis: "Your hands are on the keyboard." },
      ],
    },
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
    slug: "how-to-screenshot-part-of-the-screen-on-windows-or-mac",
    date: "2026-10-20",
    title: "How to screenshot part of the screen on Windows or Mac",
    summary: "Skip the full-screen screenshot and the cropping afterwards.",
    category: "windows",
    also: ["mac"],
    platforms: ["windows", "mac"],
    devices: ["Windows 10/11", "macOS"],
    difficulty: "Easy",
    minutes: 1,
    why: "The picture is the region you wanted, not a desktop you then have to crop.",
    intents: ["screenshots", "windows-11-keyboard-shortcuts", "mac-keyboard-shortcuts"],
    redirectFrom: ["/tips/screenshot-part-of-screen", "/fix/screenshot-part"],
    seo: {
      searchPhrase: "how to screenshot part of the screen on windows or mac",
      searchAlternates: ["windows shift s", "cmd shift 4", "snip part of the screen", "screenshot one window on mac"],
      answer: "On Windows, press Windows + Shift + S and drag a box. The snip goes to your clipboard. On a Mac, press Cmd + Shift + 4 and drag. The image lands on your desktop.",
      faq: [
        { q: "Where does the Windows snip get saved?", a: "It goes to the clipboard. Current Windows 11 builds also save a copy in Pictures > Screenshots. If it isn't there, click the notification and save it from Snipping Tool." },
        { q: "How do I capture just one window on a Mac?", a: "Press Cmd + Shift + 4, then the spacebar, then click the window." },
        { q: "Can a Mac screenshot go to the clipboard instead of the desktop?", a: "Yes. Add Control: Cmd + Ctrl + Shift + 4." },
      ],
      useWhen: "Use it when you need one error message or one chart, not the whole cluttered screen.",
      alternatives: [
        { name: "ShareX (Windows)", kind: "tool", pickIt: "You want scrolling captures, GIFs or automatic file naming.", pickThis: "You take a few screenshots a week and want nothing to install." },
        { name: "Print Screen, then crop", kind: "manual", pickIt: "Your keyboard shortcut is taken or the snip overlay won't open.", pickThis: "You don't want to open an editor just to crop." },
      ],
      compareWith: ["snipping-tool"],
    },
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
    slug: "how-to-make-chatgpt-ask-you-questions-before-it-answers",
    date: "2026-10-21",
    title: "How to make ChatGPT ask you questions before it answers",
    summary: "One line at the end of a prompt gets you answers that actually fit your situation.",
    category: "ai",
    platforms: [],
    devices: ["ChatGPT", "Claude", "Gemini", "any chatbot"],
    difficulty: "Easy",
    minutes: 1,
    why: "The model stops filling the gaps with a generic guess.",
    apps: ["chatgpt", "claude", "gemini"],
    intents: ["ai-prompts"],
    redirectFrom: ["/tips/ai-ask-me-questions-first", "/fix/ask-ai-before-it-answers"],
    seo: {
      searchPhrase: "how to make chatgpt ask you questions before it answers",
      searchAlternates: ["prompt to make ai ask clarifying questions", "chatgpt ask me questions first", "better chatgpt prompts"],
      answer: "Add one line to the end of your prompt: \"Before you answer, ask me up to 3 questions about anything you need to know.\" Answer them, and the real reply fits your situation instead of a generic one.",
      faq: [
        { q: "Does this work in Claude and Gemini too?", a: "Yes. It's plain text, so any chatbot that follows instructions will do it." },
        { q: "Why limit it to three questions?", a: "Without a cap, some chatbots send a whole questionnaire. Three is usually enough to cover budget, timing and what you've already tried." },
        { q: "Can I make it do this every time?", a: "You can put the line in ChatGPT custom instructions, Instructions for Claude or Instructions for Gemini. It helps for planning and gets annoying for quick lookups, so I keep it per prompt." },
      ],
      compareWith: ["chatgpt-vs-claude-vs-gemini"],
    },
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
    slug: "how-to-set-an-80-percent-charging-limit-on-iphone",
    date: "2026-10-22",
    title: "How to set an 80 percent charging limit on iPhone",
    summary: "If you charge overnight every night, this setting is worth a look.",
    category: "iphone",
    also: ["android"],
    platforms: ["iphone", "android"],
    devices: ["iPhone 15 and later", "Samsung Galaxy"],
    difficulty: "Easy",
    minutes: 1,
    why: "A battery that sits at 100% every night ages faster than one that stops earlier.",
    intents: ["save-battery"],
    redirectFrom: ["/tips/iphone-80-percent-charging-limit", "/fix/battery-charge-limit"],
    seo: {
      searchPhrase: "how to set an 80 percent charging limit on iphone",
      searchAlternates: ["iphone charge limit 80", "optimized battery charging iphone", "samsung battery protection"],
      answer: "On iPhone 15 or newer, go to Settings > Battery > Charging and pick 80%. On older iPhones, turn on Optimized Battery Charging under Battery Health & Charging. It holds at 80% overnight and finishes before you usually unplug.",
      faq: [
        { q: "Does charging to 80% really help the battery?", a: "A little, over years. It matters most if the phone sits at 100% for hours, warm, every night. It's not worth it if you need the full charge every day." },
        { q: "Can I still charge to 100% when I need to?", a: "Yes. Change the setting back for that day. With Optimized Battery Charging you can also tap the lock-screen notification and choose Charge Now." },
        { q: "Is there the same setting on Samsung?", a: "Yes, under Settings > Battery > Battery protection. The exact name moves a little between One UI versions." },
      ],
    },
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
  const paths = new Set<string>();
  const required = [
    ["how-to-move-the-cursor-on-an-iphone-or-android-keyboard", "2026-10-16"],
    ["how-to-see-a-saved-wifi-password-on-iphone-or-android", "2026-10-17"],
    ["how-to-copy-text-from-a-photo-on-iphone-or-android", "2026-10-18"],
    ["how-to-reopen-a-closed-tab-in-chrome", "2026-10-19"],
    ["how-to-screenshot-part-of-the-screen-on-windows-or-mac", "2026-10-20"],
    ["how-to-make-chatgpt-ask-you-questions-before-it-answers", "2026-10-21"],
    ["how-to-set-an-80-percent-charging-limit-on-iphone", "2026-10-22"],
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
    if (!tip.why || !tip.summary) throw new Error(`Missing fields ${tip.slug}`);
    const seo = tip.seo;
    if (!seo?.searchPhrase || !seo.answer) throw new Error(`Missing seo fields ${tip.slug}`);
    if (seo.searchPhrase !== seo.searchPhrase.toLowerCase()) throw new Error(`searchPhrase must be lowercase: ${tip.slug}`);
    if (tip.slug !== slugify(seo.searchPhrase)) throw new Error(`Slug must be slugify(searchPhrase): ${tip.slug}`);
    if (normalizeQuery(tip.title) !== normalizeQuery(seo.searchPhrase)) throw new Error(`Title must read as the searchPhrase: ${tip.slug}`);
    if (seo.faq && seo.faq.length > 5) throw new Error(`At most 5 FAQ items: ${tip.slug}`);
    if (seo.alternatives && seo.alternatives.length === 1) throw new Error(`Give 2+ alternatives or none: ${tip.slug}`);
    for (const id of seo.compareWith ?? []) {
      if (!compareBySlug(id)) throw new Error(`Unknown compareWith page ${id} on ${tip.slug}`);
    }
    for (const app of tip.apps ?? []) {
      if (!appBySlug(app)) throw new Error(`Unknown app ${app} on ${tip.slug}`);
    }
    for (const hub of tip.intents ?? []) {
      if (!hubById(hub)) throw new Error(`Unknown intent ${hub} on ${tip.slug}`);
    }
    for (const path of tip.redirectFrom ?? []) {
      if (paths.has(path)) throw new Error(`Duplicate redirect ${path}`);
      paths.add(path);
    }
  }
  for (const hub of HUBS) {
    if (hub.slug !== slugify(hub.searchPhrase).replace(/^how-to-/, "")) throw new Error(`Hub slug must be slugify(searchPhrase) without "how-to-": ${hub.id}`);
    if (normalizeQuery(hub.title) !== normalizeQuery(hub.searchPhrase)) throw new Error(`Hub title must read as the searchPhrase: ${hub.id}`);
  }
  for (const page of COMPARES) {
    if (normalizeQuery(page.title) !== normalizeQuery(page.searchPhrase)) throw new Error(`Compare title must read as the searchPhrase: ${page.slug}`);
    if (!slugify(page.searchPhrase).startsWith(page.slug)) throw new Error(`Compare slug must start the slugified searchPhrase: ${page.slug}`);
    if (page.kind !== "alternatives") {
      const parts = page.slug.split("-vs-");
      if (parts.length < 2 || parts.join("|") !== [...parts].sort().join("|")) throw new Error(`Compare slug must be <a>-vs-<b> in alphabetical order: ${page.slug}`);
    } else if (page.options.length < MIN_ALTERNATIVES) throw new Error(`Alternatives page needs ${MIN_ALTERNATIVES}+ options: ${page.slug}`);
    const sentences = page.answer.split(/(?<=[.!?])\s+/).length;
    if (sentences < 2 || sentences > 4) throw new Error(`Verdict must be 2-4 sentences: ${page.slug}`);
    for (const option of page.options) {
      if (option.tip && !list.some((tip) => tip.slug === option.tip)) throw new Error(`Unknown tip ${option.tip} on ${page.slug}`);
    }
    for (const row of page.rows) {
      if (row.values.length !== page.options.length) throw new Error(`Row "${row.label}" on ${page.slug} needs one value per option`);
    }
  }
}

assertLibrary(tips);

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.techtipaday.com").replace(/\/$/, "");
export const SITE_NAME = "TechTipADay";
export const SITE_DESC = "One useful phone, AI-tool or everyday tech tip a day. Short, tested, no fluff.";

/** Calendar date in Europe/Berlin, `YYYY-MM-DD`. Tips go live on this date and not before. */
export const todayISO = () => new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Berlin" });

export const isLive = (t: Tip) => t.date <= todayISO();

export const byNewest = () =>
  tips.filter(isLive).sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : b.n - a.n));

export const getTip = (slug: string) => tips.find((t) => t.slug === slug);
/** Current slug or an old one listed in redirectFrom. */
export const findTip = (slug: string) => getTip(slug) ?? tips.find((t) => t.redirectFrom?.includes(`/tips/${slug}`));
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
      tip.seo.searchPhrase,
      ...tip.seo.searchAlternates,
      tip.seo.answer,
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

/** Live tips in an intent hub, by hub id. */
export function tipsForHub(id: string) {
  return byNewest().filter((tip) => tip.intents?.includes(id));
}

export function tipsForApp(slug: string) {
  return byNewest().filter((tip) => tip.apps?.includes(slug));
}

export function tipsForCompare(slug: string) {
  return byNewest().filter((tip) => tip.seo.compareWith?.includes(slug));
}

export const hubPath = (hub: Hub) => `/how-to/${hub.slug}`;

export function isHubLive(hub: Hub) {
  return tipsForHub(hub.id).length >= MIN_HUB_TIPS;
}

/** Intent hubs with enough live tips to publish. Smaller hubs exist as data and go live on their own. */
export function liveHubs(): Hub[] {
  return HUBS.filter(isHubLive).sort((a, b) => a.title.localeCompare(b.title));
}

export function hubsForTip(tip: Tip): Hub[] {
  return (tip.intents ?? []).map((id) => hubById(id)).filter((hub): hub is Hub => !!hub && isHubLive(hub));
}

export function comparesForTip(tip: Tip): ComparePage[] {
  return (tip.seo.compareWith ?? []).map((slug) => compareBySlug(slug)).filter((page): page is ComparePage => !!page);
}

/** Every comparison and alternatives page. They are editorial, so they only list live tips. */
export function liveCompares(): ComparePage[] {
  return COMPARES;
}

/**
 * A tip's SEO fields with the fallbacks filled in. Pages always read through this,
 * so a new tip with only searchPhrase and answer still renders a complete page.
 */
export function seoOf(tip: Tip) {
  const seo = tip.seo;
  const faq = seo.faq?.length
    ? seo.faq
    : [
        { q: "Which devices does this work on?", a: `It was written for ${tip.devices.join(", ")}. Other versions may name the menus a little differently.` },
        { q: "How long does it take?", a: `About ${tip.minutes} ${tip.minutes === 1 ? "minute" : "minutes"}.` },
      ];
  return {
    ...seo,
    faq,
    useWhen: seo.useWhen ?? tip.why,
    notFor: seo.notFor ?? `It was written for ${tip.devices.join(", ")}. On other versions or brands the menu names can differ, so use the search field in Settings if a step is missing.`,
    notForWritten: !!seo.notFor,
    alternatives: seo.alternatives ?? [],
    compareWith: seo.compareWith ?? [],
  };
}

/** App pages need MIN_HUB_TIPS live tips to be indexed. Smaller ones still render, with noindex. */
export function isAppIndexable(slug: string) {
  return tipsForApp(slug).length >= MIN_HUB_TIPS;
}

export function liveAppPages() {
  return APPS.filter((app) => tipsForApp(app.slug).length > 0).sort((a, b) => a.name.localeCompare(b.name));
}

export function indexableAppPages() {
  return liveAppPages().filter((app) => isAppIndexable(app.slug));
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
  const sameHub = live.filter((item) => item.intents?.some((hub) => tip.intents?.includes(hub)));
  const sameCategory = live.filter((item) => item.category === tip.category);
  const samePlatform = live.filter((item) => item.platforms.some((platform) => tip.platforms.includes(platform)));
  const picked: Tip[] = [];
  for (const group of [sameHub, sameCategory, samePlatform]) {
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

export function relatedHubs(hub: Hub, limit = 6) {
  const current = tipsForHub(hub.id);
  const platforms = new Set(current.flatMap((tip) => tip.platforms));
  const categories = new Set(current.flatMap((tip) => [tip.category, ...(tip.also ?? [])]));
  return liveHubs()
    .filter((item) => item.id !== hub.id)
    .map((item) => {
      const list = tipsForHub(item.id);
      const score = list.filter((tip) => tip.platforms.some((platform) => platforms.has(platform)) || categories.has(tip.category)).length;
      return { hub: item, count: list.length, score };
    })
    .sort((a, b) => b.score - a.score || b.count - a.count || a.hub.title.localeCompare(b.hub.title))
    .slice(0, limit);
}

export function searchPages(q: string) {
  const needle = fold(q.trim());
  if (needle.length < 2) return [];
  const pages: { href: string; title: string; kind: string }[] = [];
  const hit = (text: string) => fold(text).includes(needle);
  for (const hub of liveHubs()) {
    if (hit(`${hub.title} ${hub.searchPhrase} ${(hub.searchAlternates ?? []).join(" ")} ${hub.intro}`)) {
      pages.push({ href: hubPath(hub), title: hub.title, kind: "By task" });
    }
  }
  for (const page of liveCompares()) {
    if (hit(`${page.title} ${page.searchAlternates.join(" ")} ${page.options.map((o) => o.name).join(" ")}`)) {
      pages.push({ href: comparePath(page), title: page.title, kind: page.kind === "alternatives" ? "Alternatives" : "Compare" });
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
  return liveHubs().map((hub) => ({ hub, count: tipsForHub(hub.id).length }));
}

/**
 * Old path -> new path, for 301s in proxy.ts. Tips and hubs list their own
 * `redirectFrom`. Redirects to a tip that is not live yet are skipped, so a
 * future tip is not revealed early.
 */
export function legacyRedirect(pathname: string): string | undefined {
  const path = pathname.replace(/\/+$/, "") || "/";
  if (path === "/fix" || path === "/best" || path === "/guides") return "/how-to";
  if (path === "/alternatives") return "/compare";
  for (const tip of tips) {
    if (tip.redirectFrom?.includes(path)) return isLive(tip) ? `/tips/${tip.slug}` : undefined;
  }
  for (const hub of HUBS) {
    if (hub.redirectFrom?.includes(path)) return hubPath(hub);
  }
  for (const page of COMPARES) {
    if (page.redirectFrom?.includes(path)) return comparePath(page);
  }
  return undefined;
}

/** A hub's FAQ: the written one, or the first FAQ of up to four of its live tips. */
export function hubFaq(hub: Hub) {
  if (hub.faq?.length) return hub.faq;
  const seen = new Set<string>();
  const items: { q: string; a: string }[] = [];
  for (const tip of tipsForHub(hub.id)) {
    const item = seoOf(tip).faq[0];
    if (!item || seen.has(item.q)) continue;
    seen.add(item.q);
    items.push(item);
    if (items.length === 4) break;
  }
  return items;
}
