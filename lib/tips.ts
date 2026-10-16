export type Tip = {
  n: number; slug: string; date: string; title: string; summary: string;
  category: "Phone" | "AI tools" | "Everyday tech"; devices: string[];
  steps: string[]; body: string[]; video?: { hook: string; lines: string[]; cta: string };
};

export const tips: Tip[] = [
  {
    n: 1, slug: "spacebar-cursor-trick", date: "2026-10-16",
    title: "Hold the spacebar to move your cursor precisely",
    summary: "Stop poking at the middle of a word. Your phone keyboard has a hidden trackpad.",
    category: "Phone", devices: ["iPhone", "Android (Gboard)"],
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
    video: {
      hook: "Still tapping on typos and missing every time?",
      lines: ["Hold the spacebar.", "Your keyboard turns into a trackpad.", "Slide to put the cursor exactly where you want it.", "On Android, just swipe along the spacebar."],
      cta: "One tech tip a day at techtipaday.com",
    },
  },
  {
    n: 2, slug: "find-saved-wifi-password", date: "2026-10-17",
    title: "See the Wi-Fi password your phone already saved",
    summary: "A friend asks for the Wi-Fi password and nobody remembers it. Your phone does.",
    category: "Phone", devices: ["iPhone (iOS 16+)", "Android 10+"],
    steps: [
      "iPhone: Settings > Wi-Fi, tap the (i) next to the network, then tap the hidden Password field. Face ID unlocks it.",
      "Android: Settings > Network & internet > Internet (or Wi-Fi), tap the gear next to the network, then Share. You get a QR code, and the password is usually written underneath.",
      "The other person can just scan the QR code with their camera and join.",
    ],
    body: [
      "Router stickers get peeled off, people change the password and forget, and you end up crawling behind the TV. If any phone in the house has joined that network before, the password is sitting right there.",
      "Menu names shift a bit between Android brands. On Samsung it's Settings > Connections > Wi-Fi, gear icon, then the QR code button at the bottom.",
    ],
  },
  {
    n: 3, slug: "copy-text-from-photo", date: "2026-10-18",
    title: "Copy text straight out of a photo",
    summary: "No more retyping a serial number or a Wi-Fi code from a picture.",
    category: "Phone", devices: ["iPhone (iOS 15+)", "Android (Google Lens)"],
    steps: [
      "iPhone: open the photo, then press and hold on the text. It highlights like normal text, so you can copy it. A small text icon in the corner selects everything.",
      "Android: open the photo in Google Photos and tap Lens, then tap Text. Select what you need and hit Copy.",
      "Works on the live camera too, before you even take the picture.",
    ],
    body: [
      "I use this most for the long codes on the back of devices and for phone numbers on posters. It also handles handwriting surprisingly well if it's reasonably neat.",
      "On iPhone this is called Live Text. If nothing happens when you hold on the text, check Settings > General > Language & Region and make sure Live Text is on.",
    ],
  },
  {
    n: 4, slug: "reopen-closed-tab", date: "2026-10-19",
    title: "Bring back the tab you just closed by accident",
    summary: "One shortcut, and it works more than once.",
    category: "Everyday tech", devices: ["Chrome", "Edge", "Firefox", "Safari"],
    steps: [
      "Windows and Linux: Ctrl + Shift + T.",
      "Mac: Cmd + Shift + T.",
      "Press it again to keep going back through tabs you closed, in order.",
    ],
    body: [
      "Closed the tab with the form you were halfway through? Press the shortcut right away. In most browsers the page comes back with its history, so the back button still works.",
      "If you closed a whole window by mistake, the same shortcut usually brings back the whole window with all its tabs.",
    ],
  },
  {
    n: 5, slug: "screenshot-part-of-screen", date: "2026-10-20",
    title: "Screenshot just part of your screen",
    summary: "Skip the full-screen screenshot and the cropping afterwards.",
    category: "Everyday tech", devices: ["Windows 10/11", "macOS"],
    steps: [
      "Windows: press Windows + Shift + S, then drag a box around what you want. It goes to your clipboard, ready to paste.",
      "Mac: press Cmd + Shift + 4, then drag. The image lands on your desktop.",
      "Mac bonus: press Cmd + Shift + 4, then tap the spacebar, then click a window to capture just that window.",
    ],
    body: [
      "On Windows, a notification pops up after the snip. Click it if you want to draw on the screenshot or save it as a file.",
      "On a Mac, add Control to the shortcut (Cmd + Ctrl + Shift + 4) if you'd rather have it on the clipboard instead of cluttering the desktop.",
    ],
  },
  {
    n: 6, slug: "ai-ask-me-questions-first", date: "2026-10-21",
    title: "Tell the AI to ask you questions first",
    summary: "One line at the end of a prompt gets you answers that actually fit your situation.",
    category: "AI tools", devices: ["ChatGPT", "Claude", "Gemini", "any chatbot"],
    steps: [
      "Write your request as normal.",
      "Add at the end: \"Before you answer, ask me up to 3 questions about anything you need to know.\"",
      "Answer its questions, then let it write the real answer.",
    ],
    body: [
      "Chatbots fill gaps with guesses. If you ask for a workout plan, a cover letter or a trip itinerary, you get something generic because it doesn't know your budget, your schedule, or what you've already tried.",
      "Making it ask first flips that. Capping it at three questions keeps it from turning into a survey.",
    ],
  },
  {
    n: 7, slug: "iphone-80-percent-charging-limit", date: "2026-10-22",
    title: "Cap your iPhone charge at 80% to save the battery",
    summary: "If you charge overnight every night, this setting is worth a look.",
    category: "Phone", devices: ["iPhone 15 and later", "Samsung Galaxy"],
    steps: [
      "iPhone 15 or newer: Settings > Battery > Charging, then pick 80% (newer iOS versions also offer 85%, 90% and 95%).",
      "Older iPhones: Settings > Battery > Battery Health & Charging > Optimized Battery Charging. It holds at 80% and finishes before you usually unplug.",
      "Samsung Galaxy: Settings > Battery > Battery protection (the menu name varies a little by One UI version).",
    ],
    body: [
      "Lithium-ion batteries wear faster when they sit at 100% for hours, especially when they're warm. Stopping at 80% trades a bit of daily range for a battery that holds up longer over the years.",
      "If 80% isn't enough to get you through the day, don't bother. A dead phone at 6pm isn't worth it. Optimized charging is the gentler middle ground.",
    ],
  },
];

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://techtipaday.com").replace(/\/$/, "");
export const SITE_NAME = "TechTipADay";
export const SITE_DESC = "One useful phone, AI-tool or everyday tech tip a day. Short, tested, no fluff.";

/** Calendar date in Europe/Berlin, `YYYY-MM-DD`. Tips go live on this date and not before. */
export const todayISO = () => new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Berlin" });

export const isLive = (t: Tip) => t.date <= todayISO();
export const byNewest = () => tips.filter(isLive).sort((a, b) => b.n - a.n);
export const getTip = (slug: string) => tips.find((t) => t.slug === slug);
export const getLiveTip = (slug: string) => {
  const t = getTip(slug);
  return t && isLive(t) ? t : undefined;
};

export const CATEGORIES = ["Phone", "AI tools", "Everyday tech"] as const;
export function isCategory(v: string | undefined): v is Tip["category"] {
  return !!v && (CATEGORIES as readonly string[]).includes(v);
}

export function formatDate(iso: string, opts: Intl.DateTimeFormatOptions = {}) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
    ...opts,
  }).format(new Date(Date.UTC(y, m - 1, d)));
}

export function tipUrl(slug: string) {
  return `${SITE_URL}/tips/${slug}`;
}

function prevISO(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() - 1);
  return dt.toISOString().slice(0, 10);
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

export type ShareTip = {
  n: number;
  title: string;
  summary: string;
  steps: string[];
  body: string[];
  url: string;
};

export function shareTip(t: Tip): ShareTip {
  return { n: t.n, title: t.title, summary: t.summary, steps: t.steps, body: t.body, url: tipUrl(t.slug) };
}
