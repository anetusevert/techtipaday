/**
 * Landing pages are data, not new routes.
 *
 * Intent hubs live at /how-to/[slug]. Each one is built around a search phrase
 * (searchPhrase) and collects real tips that list the hub id in `hubs`.
 * A hub is published only once it has MIN_HUB_TIPS live tips, so there are no
 * thin pages. Device pages live on PLATFORM paths in taxonomy.ts. Topic pages use CATEGORIES.
 * Rules: docs/SEO.md.
 */

import type { FaqItem } from "./taxonomy";

/** An intent hub or app page needs at least this many live tips to be published and indexed. Aim for 3+. */
export const MIN_HUB_TIPS = 2;

export type Hub = {
  /** Stable id that tips use in `hubs`. Never shown. */
  id: string;
  /** URL slug for /how-to/<slug>: slugify(searchPhrase) without a leading "how-to-". */
  slug: string;
  searchPhrase: string;
  /** Title tag and H1. Same words as searchPhrase. */
  title: string;
  intro: string;
  searchAlternates?: string[];
  /** Written FAQ. Fallback: the first FAQ of the newest live tips in the hub. */
  faq?: FaqItem[];
  /** Old paths that 301 here. */
  redirectFrom?: string[];
};

export const HUBS: Hub[] = [
  {
    id: "keyboard",
    slug: "type-faster-on-your-phone-and-computer",
    searchPhrase: "how to type faster on your phone and computer",
    title: "How to type faster on your phone and computer",
    intro:
      "Most of the speed is already on the device. Text replacement turns @@ into your email address, the spacebar moves the cursor, and the keyboard can shrink for one thumb. No new keyboard app needed.",
    redirectFrom: ["/fix/keyboard"],
  },
  {
    id: "split-screen",
    slug: "put-two-windows-side-by-side",
    searchPhrase: "how to put two windows side by side",
    title: "How to put two windows side by side",
    intro:
      "Snap on Windows 11 and tiling on the Mac are both built in. Use them when a form and a document need to be open together.",
    redirectFrom: ["/fix/split-screen"],
  },
  {
    id: "tabs",
    slug: "find-and-reopen-browser-tabs-in-chrome",
    searchPhrase: "how to find and reopen browser tabs in chrome",
    title: "How to find and reopen browser tabs in Chrome",
    intro:
      "Bring back a tab you closed by accident, search the forty you have open, and find the one eating memory. These are Chrome controls, and the reopen shortcut works in other browsers too.",
    redirectFrom: ["/fix/tabs"],
  },
  {
    id: "screenshots",
    slug: "take-a-screenshot-of-part-of-the-screen",
    searchPhrase: "how to take a screenshot of part of the screen",
    title: "How to take a screenshot of part of the screen",
    intro:
      "Grab just the bit you need instead of the whole display, then crop it or pull the text out. Windows 11, Mac and Android each have a shortcut for it.",
    redirectFrom: ["/fix/screenshots"],
  },
  {
    id: "save-battery",
    slug: "best-iphone-battery-tips",
    searchPhrase: "best iphone battery tips",
    title: "Best iPhone battery tips",
    intro:
      "The few settings that actually change how long an iPhone lasts, today and over the years: the charge limit, Low Power Mode, a shorter Auto-Lock, and the percentage so you can see what is going on. No battery-saver apps.",
    redirectFrom: ["/fix/save-battery"],
  },
  {
    id: "wifi",
    slug: "fix-common-wifi-problems-on-your-phone",
    searchPhrase: "how to fix common wifi problems on your phone",
    title: "How to fix common Wi-Fi problems on your phone",
    intro:
      "Wi-Fi jobs you can finish on the phone: find the saved password, forget a network that keeps failing, stop the phone burning cellular data, and make a hotspot an old laptop can see.",
    redirectFrom: ["/fix/wifi"],
  },
  {
    id: "wifi-slow",
    slug: "fix-slow-wifi-on-your-phone",
    searchPhrase: "how to fix slow wifi on your phone",
    title: "How to fix slow Wi-Fi on your phone",
    intro:
      "When only your phone is slow on a network, the cause is often on the phone: a stale saved network, Wi-Fi Assist bouncing to cellular, or a Private DNS setting. Try these before you restart the router.",
    redirectFrom: ["/fix/wifi-slow"],
  },
  {
    id: "notifications",
    slug: "stop-notifications-from-interrupting-you",
    searchPhrase: "how to stop notifications from interrupting you",
    title: "How to stop notifications from interrupting you",
    intro:
      "Ways to stop a phone or PC from interrupting you without missing the one call you need: Scheduled Summary, Do Not Disturb, Focus, lock-screen previews, and the browser sites that should never have been allowed.",
    redirectFrom: ["/fix/notifications"],
  },
  {
    id: "privacy-checkup",
    slug: "check-what-your-phone-is-sharing",
    searchPhrase: "how to check what your phone is sharing",
    title: "How to check what your phone is sharing",
    intro:
      "A short privacy pass, one screen at a time: precise location, tracking prompts, lock-screen content, saved passwords and the iPhone privacy report. None of it makes a phone anonymous. It does close the obvious gaps.",
    redirectFrom: ["/fix/privacy-checkup"],
  },
  {
    id: "copy-text",
    slug: "copy-text-from-a-picture-or-screenshot",
    searchPhrase: "how to copy text from a picture or screenshot",
    title: "How to copy text from a picture or screenshot",
    intro:
      "Stop retyping serial numbers and Wi-Fi codes. iPhone Live Text, Google Lens, Circle to Search and the Windows 11 Snipping Tool all read text out of an image.",
    redirectFrom: ["/fix/copy-text"],
  },
  {
    id: "ai-prompts",
    slug: "get-better-answers-from-chatgpt-claude-and-gemini",
    searchPhrase: "how to get better answers from chatgpt claude and gemini",
    title: "How to get better answers from ChatGPT, Claude, and Gemini",
    intro:
      "Prompt habits that work in all three, plus where each one keeps standing instructions. The goal is an answer you can check, not a longer one.",
    redirectFrom: ["/fix/ai-prompts"],
  },
  {
    id: "focus",
    slug: "block-distractions-on-your-phone-and-computer",
    searchPhrase: "how to block distractions on your phone and computer",
    title: "How to block distractions on your phone and computer",
    intro:
      "Focus and Downtime on iPhone, Do Not Disturb and app timers on Android, and Do not disturb on Windows 11. Pick one and leave it on for the hours you already know are noisy.",
    redirectFrom: ["/fix/focus"],
  },
  {
    id: "speed-up-slow-windows-laptop",
    slug: "speed-up-a-slow-windows-laptop",
    searchPhrase: "how to speed up a slow windows laptop",
    title: "How to speed up a slow Windows laptop",
    intro:
      "Before you buy anything, check the usual suspects. A full disk, one frozen app, or a browser with too many tabs makes a laptop feel old. These are built-in fixes, in roughly the order I would try them.",
  },
  {
    id: "frozen-app",
    slug: "close-a-frozen-app-on-mac-or-windows",
    searchPhrase: "how to close a frozen app on mac or windows",
    title: "How to close a frozen app on Mac or Windows",
    intro:
      "When an app stops responding, force quit it and move on. Anything unsaved in that app is lost, so try a normal quit first and wait ten seconds.",
  },
  {
    id: "iphone-privacy-settings",
    slug: "best-iphone-privacy-settings",
    searchPhrase: "best iphone privacy settings",
    title: "Best iPhone privacy settings",
    intro:
      "The iPhone privacy switches worth a few minutes, from tracking prompts and precise location to locked apps and AirDrop. Lockdown Mode and Safety Check are here too, with a note on when you actually need them.",
  },
  {
    id: "android-privacy-settings",
    slug: "best-android-privacy-settings",
    searchPhrase: "best android privacy settings",
    title: "Best Android privacy settings",
    intro:
      "Android privacy settings that change something real: who can send you files, what the lock screen shows, a hidden space for sensitive apps, and the lock that fires if someone snatches the phone. Paths are for Pixel, with Samsung noted.",
  },
  {
    id: "windows-11-keyboard-shortcuts",
    slug: "windows-11-keyboard-shortcuts-worth-learning",
    searchPhrase: "windows 11 keyboard shortcuts worth learning",
    title: "Windows 11 keyboard shortcuts worth learning",
    intro:
      "Not a list of 200 shortcuts. These are the Windows key combinations people keep using after a week: clipboard history, snipping, snapping, voice typing and desktops.",
  },
  {
    id: "mac-keyboard-shortcuts",
    slug: "mac-keyboard-shortcuts-worth-learning",
    searchPhrase: "mac keyboard shortcuts worth learning",
    title: "Mac keyboard shortcuts worth learning",
    intro:
      "The Command-key shortcuts that save time every day on a Mac: open any app, take a screenshot, bring back a closed tab and get out of a frozen app.",
  },
  {
    id: "free-up-storage",
    slug: "free-up-storage-space-on-your-phone-or-pc",
    searchPhrase: "how to free up storage space on your phone or pc",
    title: "How to free up storage space on your phone or PC",
    intro:
      "Before you delete photos or pay for more space, let the phone or PC clear out what you don't use. iPhone can offload apps you never open and Windows 11 can empty temp files on a schedule. Both are built in.",
    searchAlternates: ["phone storage full", "free up space on laptop", "storage full what to delete"],
  },
  {
    id: "use-phone-with-one-hand",
    slug: "use-a-big-phone-with-one-hand",
    searchPhrase: "how to use a big phone with one hand",
    title: "How to use a big phone with one hand",
    intro:
      "Big phones are hard to use on the bus. iPhone and Android both have built-in ways to pull the screen down or shrink the keyboard toward your thumb.",
  },
  {
    id: "speed-up-slow-phone",
    slug: "speed-up-a-slow-phone",
    searchPhrase: "how to speed up a slow phone",
    title: "How to speed up a slow phone",
    intro:
      "A phone that feels slow usually isn't broken. Storage that is nearly full drags everything down, and on Android the animations between screens add a wait you can cut in half. Both fixes are built in and take a few minutes.",
    searchAlternates: ["phone running slow", "make my phone faster", "phone lagging fix"],
  },
];

export type AppLanding = {
  slug: string;
  name: string;
  title: string;
  h1: string;
  intro: string;
};

export const APPS: AppLanding[] = [
  {
    slug: "chatgpt",
    name: "ChatGPT",
    title: "ChatGPT tips",
    h1: "ChatGPT tips",
    intro:
      "ChatGPT tips for the website and the apps: custom instructions, temporary chats, and the lines worth adding to a prompt. Menu names differ slightly between Personalization and Customize ChatGPT. The steps give both.",
  },
  {
    slug: "claude",
    name: "Claude",
    title: "Claude tips",
    h1: "Claude tips",
    intro:
      "Claude tips for claude.ai. Instructions for Claude apply to ordinary chats. Project instructions, when your plan has them, stay inside that project. The steps say what to do if the field is missing.",
  },
  {
    slug: "gemini",
    name: "Gemini",
    title: "Gemini tips",
    h1: "Gemini tips",
    intro:
      "Gemini tips for the consumer site and app. Instructions for Gemini are not on every account. Work and school logins often hide them, and a Gem uses its own instructions instead.",
  },
  {
    slug: "gboard",
    name: "Gboard",
    title: "Gboard tips",
    h1: "Gboard tips",
    intro:
      "Gboard tips for Android: the spacebar cursor and the clipboard that sits inside the keyboard. If a switch is missing, open Gboard's own settings from the gear on the keyboard, not the Android Settings home.",
  },
  {
    slug: "notes",
    name: "Notes",
    title: "Apple Notes tips",
    h1: "Apple Notes tips",
    intro:
      "Apple Notes tips, starting with the document scanner that is already in the app. The camera control has moved between the toolbar and the attachment menu, so the steps cover both.",
  },
  {
    slug: "photos",
    name: "Photos",
    title: "Photos tips",
    h1: "Photos tips",
    intro:
      "Tips for copying text out of a picture in Apple Photos and Google Photos. Live Text is an iPhone feature. On Android the same job is Google Lens inside Photos.",
  },
  {
    slug: "finder",
    name: "Finder",
    title: "Finder tips",
    h1: "Finder tips",
    intro:
      "Finder tips for seeing where a file actually is. The path bar is off until you turn it on, and it is the fastest way to move up a folder without the sidebar.",
  },
  {
    slug: "snipping-tool",
    name: "Snipping Tool",
    title: "Snipping Tool tips",
    h1: "Snipping Tool tips",
    intro:
      "Windows 11 Snipping Tool tips: capture a region, then copy the text out of it. Text actions run on the PC. You do not upload the image to use them.",
  },
];

export const hubById = (id: string) => HUBS.find((h) => h.id === id);
export const hubBySlug = (slug: string) => HUBS.find((h) => h.slug === slug);
export const appBySlug = (slug: string) => APPS.find((a) => a.slug === slug);
