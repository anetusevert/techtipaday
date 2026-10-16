/**
 * Landing pages are data, not new routes.
 *
 * Add a long-tail page by giving a tip a `task` (that becomes /fix/[slug])
 * or by adding a hub or app here. The page is published only once a matching
 * tip is live, so the library can grow past 300 pages without empty URLs.
 * Device pages live on PLATFORM paths in taxonomy.ts. Topic pages use CATEGORIES.
 */

export type Hub = {
  slug: string;
  title: string;
  h1: string;
  intro: string;
};

export const HUBS: Hub[] = [
  {
    slug: "keyboard",
    title: "How to type faster on your phone and computer",
    h1: "How to type faster on your phone and computer",
    intro:
      "Typing fixes that are already on the device: text replacement, one-handed keyboards, and the phone trick that turns the spacebar into a trackpad. No new keyboard app required.",
  },
  {
    slug: "split-screen",
    title: "How to put two windows side by side",
    h1: "How to put two windows side by side",
    intro:
      "Snap on Windows 11 and tiling on the Mac. Both are built in. Use them when a form and a document need to be open together, not as a new way to organize your whole desktop.",
  },
  {
    slug: "tabs",
    title: "How to find a browser tab",
    h1: "How to find a browser tab",
    intro:
      "Search open tabs, bring back one you closed, and see which tab is using the memory. These are Chrome controls, and the reopen shortcut also works in other desktop browsers.",
  },
  {
    slug: "screenshots",
    title: "How to screenshot part of the screen",
    h1: "How to screenshot part of the screen",
    intro:
      "Capture a region instead of the whole display, on Windows 11, Mac, and Android. A few of these also copy the text out of the picture so you do not retype it.",
  },
  {
    slug: "save-battery",
    title: "How to make a phone battery last longer",
    h1: "How to make a phone battery last longer",
    intro:
      "Battery tips that trade a little convenience for less wear or a longer afternoon: the charge limit, Low Power Mode, and the percentage so you can see what the phone is actually doing.",
  },
  {
    slug: "wifi",
    title: "How to fix a Wi-Fi annoyance",
    h1: "How to fix a Wi-Fi annoyance",
    intro:
      "Wi-Fi jobs you can finish on the phone: forget a bad network, see why it keeps dropping to cellular, share a hotspot with an older laptop, and read the password the phone already saved.",
  },
  {
    slug: "wifi-slow",
    title: "How to fix slow Wi-Fi on your phone",
    h1: "How to fix slow Wi-Fi on your phone",
    intro:
      "When the network you are on is the problem. Forget a stale saved network, stop Wi-Fi Assist from bouncing you onto cellular, and check Private DNS if pages fail only on that Android phone.",
  },
  {
    slug: "notifications",
    title: "How to quiet notifications",
    h1: "How to quiet notifications",
    intro:
      "Ways to stop a phone or PC from interrupting you, without muting the one call you still need. Scheduled Summary, Do Not Disturb, Focus, and lock-screen previews are the switches that matter.",
  },
  {
    slug: "privacy-checkup",
    title: "How to check what your phone is sharing",
    h1: "How to check what your phone is sharing",
    intro:
      "A short privacy pass: precise location, tracking prompts, lock-screen content, saved passwords, and the iPhone privacy log. Each tip is one screen. None of them makes a phone anonymous.",
  },
  {
    slug: "copy-text",
    title: "How to copy text from a picture",
    h1: "How to copy text from a picture",
    intro:
      "Pull words out of a photo or a screenshot instead of retyping them. iPhone Live Text, Google Photos, and the Windows 11 Snipping Tool all do this on the device.",
  },
  {
    slug: "ai-prompts",
    title: "How to get a better answer from an AI chat",
    h1: "How to get a better answer from an AI chat",
    intro:
      "Prompt habits that work in ChatGPT, Claude, and Gemini, plus the settings where each product stores standing instructions. The goal is an answer you can check, not a longer answer.",
  },
  {
    slug: "focus",
    title: "How to block distractions for an hour",
    h1: "How to block distractions for an hour",
    intro:
      "Focus on iPhone, Downtime in Screen Time, and Do Not Disturb on Windows 11. Pick one and leave it on during the hours you already know are noisy.",
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

export const hubBySlug = (slug: string) => HUBS.find((h) => h.slug === slug);
export const appBySlug = (slug: string) => APPS.find((a) => a.slug === slug);
