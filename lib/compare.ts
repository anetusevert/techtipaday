/**
 * Comparison pages at /compare/<a>-vs-<b> (names in alphabetical order) and
 * alternatives pages at /alternatives/<slug>. Three kinds:
 * - "vs": two or three named products or features, side by side.
 * - "alternatives": other options to one product.
 * - "built-in-vs-app": the setting you already have against the app people install.
 *
 * Write them like advice to a friend. Say when the built-in option is enough.
 * `affiliateUrl` is empty on purpose. When a program is approved, fill it in and the
 * page switches the option link to it with rel="sponsored". Rules: docs/SEO.md.
 */

import type { FaqItem } from "./taxonomy";

export type CompareKind = "vs" | "alternatives" | "built-in-vs-app";

export type CompareOption = {
  name: string;
  /** Short label such as "Built in", "Free, open source", "Paid". */
  price: string;
  /** Official site. Built-in options can point at our own tip with `tip` instead. */
  url?: string;
  /** Slug of the tip that shows how to use this option. */
  tip?: string;
  /** Leave empty until an affiliate program is approved. */
  affiliateUrl?: string;
  builtIn?: boolean;
  bestFor: string;
  pros: string[];
  cons: string[];
};

export type ComparePage = {
  /** /compare/<a>-vs-<b> with the names in alphabetical order, or /alternatives/<slug> for kind "alternatives". */
  slug: string;
  kind: CompareKind;
  /** What people type, lowercase. */
  searchPhrase: string;
  /** Title tag and H1. Uses the search phrase, with normal capitalisation. */
  title: string;
  searchAlternates: string[];
  /** The written verdict, 2-4 sentences, shown first. Says which to use when. */
  answer: string;
  options: CompareOption[];
  /** Table rows. `values` follow the order of `options`. */
  rows: { label: string; values: string[] }[];
  /** "Pick X if..." lines. */
  verdict: { pick: string; when: string }[];
  faq: FaqItem[];
  /** Last time the facts were checked, YYYY-MM-DD. */
  checked: string;
  /** Intent hub ids worth linking from this page. */
  intents?: string[];
  redirectFrom?: string[];
};

export const COMPARES: ComparePage[] = [
  {
    slug: "chatgpt",
    kind: "alternatives",
    searchPhrase: "chatgpt alternatives",
    title: "ChatGPT alternatives",
    searchAlternates: ["best free chatgpt alternative", "apps like chatgpt", "claude vs gemini vs copilot"],
    answer:
      "Claude and Gemini are the closest alternatives to ChatGPT, and both have free plans. Try Claude for long documents and careful writing, Gemini if you live in Google apps or on an Android phone, and Microsoft Copilot if you work in Windows and Microsoft 365. For a quick fact, a plain web search with sources you can check still beats any chatbot.",
    options: [
      {
        name: "Claude",
        price: "Free and paid plans",
        url: "https://claude.ai",
        bestFor: "Long documents, writing and careful step-by-step answers.",
        pros: ["Handles long pasted documents well", "Projects keep instructions for one job"],
        cons: ["Fewer extras like image generation"],
      },
      {
        name: "Gemini",
        price: "Free and paid plans",
        url: "https://gemini.google.com",
        bestFor: "People who use Gmail, Docs and an Android phone.",
        pros: ["Built into Android and Google apps", "Gems for repeat jobs"],
        cons: ["Some settings are missing on work and school accounts"],
      },
      {
        name: "Microsoft Copilot",
        price: "Free, paid tiers for Microsoft 365",
        url: "https://copilot.microsoft.com",
        bestFor: "Windows and Microsoft 365 users.",
        pros: ["Built into Windows and Edge", "Works inside Word and Outlook on paid plans"],
        cons: ["The best parts need a Microsoft 365 subscription"],
      },
      {
        name: "A plain web search",
        price: "Free",
        url: "https://www.bing.com",
        bestFor: "Facts, prices and anything you need a source for.",
        pros: ["You see the source", "No made-up menu names"],
        cons: ["You do the summarising yourself"],
      },
    ],
    rows: [
      { label: "Price", values: ["Free and paid", "Free and paid", "Free, more with Microsoft 365", "Free"] },
      { label: "Best at", values: ["Long documents and writing", "Google apps and Android", "Windows, Office and Outlook", "Checkable facts"] },
      { label: "Where it lives", values: ["claude.ai and apps", "gemini.google.com, Android, Google apps", "Windows, Edge, Microsoft 365", "Any browser"] },
      { label: "Standing instructions", values: ["Instructions for Claude", "Instructions for Gemini, on most personal accounts", "Varies by plan", "Not needed"] },
    ],
    verdict: [
      { pick: "Claude", when: "you paste long text and want a careful answer." },
      { pick: "Gemini", when: "your mail, files and phone are already Google." },
      { pick: "Copilot", when: "your work happens in Word, Excel and Outlook." },
      { pick: "a web search", when: "you need a fact you can point to." },
    ],
    faq: [
      { q: "Is Claude better than ChatGPT?", a: "For some jobs. People often prefer Claude for long documents and writing, and ChatGPT for extras like voice and images. Paste the same prompt into both and keep the one whose answer you would actually use." },
      { q: "Do my ChatGPT custom instructions move over?", a: "No. Each chatbot keeps its own. Paste the same short block into the new one." },
      { q: "Which ChatGPT alternative is free?", a: "Claude, Gemini and Copilot all have free plans with daily limits. The paid plans mostly buy you more use and newer models." },
    ],
    checked: "2026-10-17",
    intents: ["ai-prompts"],
  },
  {
    slug: "google-photos-vs-icloud-photos",
    kind: "vs",
    searchPhrase: "google photos vs icloud photos for backing up an iphone",
    title: "Google Photos vs iCloud Photos for backing up an iPhone",
    searchAlternates: ["icloud photos vs google photos for backing up an iphone", "icloud vs google photos backup", "should i use google photos on iphone", "best photo backup for iphone"],
    answer:
      "If everything you own is Apple, iCloud Photos is the easier pick: it is built in and syncs in the background. Google Photos makes more sense if you also use Android or Windows, or want your photos in any browser. Both start free with little space (5 GB on iCloud, 15 GB shared with Gmail and Drive on Google), so most people end up paying for one of them.",
    options: [
      {
        name: "iCloud Photos",
        price: "5 GB free, then iCloud+",
        url: "https://www.apple.com/icloud/",
        builtIn: true,
        bestFor: "People who only use iPhone, iPad and Mac.",
        pros: ["Built into the Photos app, nothing to install", "Syncs edits and deletions across Apple devices", "Shared Library for a family"],
        cons: ["The free 5 GB also holds iPhone backups, so it fills fast", "Clunky on Windows and Android"],
      },
      {
        name: "Google Photos",
        price: "15 GB free (shared), then Google One",
        url: "https://www.google.com/photos/about/",
        bestFor: "Mixed households and anyone who might switch to Android.",
        pros: ["Works the same on iPhone, Android and the web", "Very good search", "More free space to start with"],
        cons: ["iOS can pause background uploads, so open the app now and then", "The 15 GB is shared with Gmail and Drive"],
      },
    ],
    rows: [
      { label: "Free storage", values: ["5 GB, shared with iCloud backups and iCloud Drive", "15 GB, shared with Gmail and Google Drive"] },
      { label: "Works on", values: ["iPhone, iPad, Mac, iCloud.com, iCloud for Windows", "iPhone, Android, any browser"] },
      { label: "Uploads in the background on iPhone", values: ["Yes, part of iOS", "Yes, but iOS sometimes pauses it"] },
      { label: "Photo quality", values: ["Always the original", "Original quality, or Storage saver (slightly compressed)"] },
      { label: "Frees space on the phone", values: ["Optimize iPhone Storage keeps smaller copies on the phone", "Free up space removes copies that are already backed up"] },
      { label: "Sharing with Android users", values: ["Shared links open in a browser", "Shared albums open in the app or a browser"] },
    ],
    verdict: [
      { pick: "iCloud Photos", when: "you only use Apple devices and want nothing to set up." },
      { pick: "Google Photos", when: "you use Windows or Android too, or you want the bigger free tier." },
      { pick: "Both", when: "you want a second copy. It works, but each one counts against its own storage." },
    ],
    faq: [
      { q: "Can I use iCloud Photos and Google Photos at the same time?", a: "Yes. Google Photos backs up from the iPhone's photo library whether or not iCloud Photos is on. You just pay for the space twice." },
      { q: "Does Google Photos reduce the quality of my photos?", a: "Only if you choose Storage saver. Original quality keeps the file as it was taken." },
      { q: "What happens when I run out of space?", a: "iCloud stops backing up new photos until you free space or upgrade. Google stops backing up too, and if you stay over the limit Gmail can stop receiving mail." },
      { q: "How do I move my photos from iCloud to Google Photos?", a: "Apple has a transfer tool at privacy.apple.com that copies your iCloud photos to Google Photos. It leaves the originals in iCloud." },
    ],
    checked: "2026-10-17",
    intents: ["copy-text"],
  },
  {
    slug: "chatgpt-vs-claude-vs-gemini",
    kind: "vs",
    searchPhrase: "chatgpt vs claude vs gemini custom instructions",
    title: "ChatGPT vs Claude vs Gemini custom instructions",
    searchAlternates: ["where are custom instructions in claude", "gemini custom instructions", "chatgpt personalization vs claude instructions"],
    answer:
      "All three let you save standing instructions so you stop repeating yourself. In ChatGPT it is Settings > Personalization, in Claude it is Instructions for Claude in Settings, and in Gemini it is Instructions for Gemini, which some work and school accounts do not have. Each also has a per-project version: ChatGPT Projects, Claude Projects and Gemini Gems.",
    options: [
      {
        name: "ChatGPT",
        price: "Free and paid plans",
        url: "https://chatgpt.com",
        bestFor: "People who want one place for instructions and memory.",
        pros: ["Custom instructions work on the free plan", "Separate project instructions for one job"],
        cons: ["Memory and instructions are two different things, which confuses people"],
      },
      {
        name: "Claude",
        price: "Free and paid plans",
        url: "https://claude.ai",
        bestFor: "People who keep work in projects.",
        pros: ["Instructions for Claude apply to every chat", "Project instructions stay inside the project"],
        cons: ["On Team and Enterprise, organization instructions win when they conflict"],
      },
      {
        name: "Gemini",
        price: "Free and paid plans",
        url: "https://gemini.google.com",
        bestFor: "People already living in Google apps.",
        pros: ["Gems give each job its own instructions"],
        cons: ["Instructions for Gemini is missing on many work and school accounts", "A Gem ignores your global instructions"],
      },
    ],
    rows: [
      { label: "Where the setting is", values: ["Settings > Personalization (or Customize ChatGPT)", "Your initials > Settings > Instructions for Claude", "Settings > Instructions for Gemini"] },
      { label: "Per-job version", values: ["Project instructions", "Project instructions", "A Gem's own instructions"] },
      { label: "Applies to old chats", values: ["No, new replies only", "No, new replies only", "No, new replies only"] },
      { label: "Work and school accounts", values: ["Admins can limit features", "Organization instructions take priority", "Often not available"] },
    ],
    verdict: [
      { pick: "Any of them", when: "you mostly use one chatbot. The instructions do not carry over, so set them where you actually work." },
      { pick: "The same short block in all three", when: "you switch between them. Something like: Keep answers short. Numbered steps first. Say when you are not sure a menu name is current." },
    ],
    faq: [
      { q: "Do my instructions carry over between ChatGPT, Claude and Gemini?", a: "No. Each one keeps its own. Paste the same short block into each if you use more than one." },
      { q: "What should I write in custom instructions?", a: "How you want answers shaped: length, format, and what to do when it is unsure. Leave out passwords, your address and anything confidential from work." },
      { q: "Why does my chatbot ignore my instructions?", a: "Check whether you are inside a project or a Gem, which use their own instructions, and whether a work account has organization rules that win." },
    ],
    checked: "2026-10-17",
    intents: ["ai-prompts"],
  },
  {
    slug: "ditto-vs-windows-clipboard-history",
    kind: "built-in-vs-app",
    searchPhrase: "ditto vs windows clipboard history",
    title: "Ditto vs Windows clipboard history",
    searchAlternates: ["windows clipboard history vs ditto", "best clipboard manager for windows", "windows v vs ditto", "ditto clipboard manager"],
    answer:
      "For most people the built-in clipboard history (Windows + V) is enough. It keeps your last 25 copies and pinned items survive a restart. Ditto is a free, open-source app worth installing if you want a much longer history that survives restarts, with search and saved snippets.",
    options: [
      {
        name: "Windows clipboard history",
        price: "Built in",
        tip: "how-to-turn-on-clipboard-history-in-windows-11",
        builtIn: true,
        bestFor: "Pasting something you copied a few minutes ago.",
        pros: ["Nothing to install", "Pin items you reuse", "Optional sync between PCs with a Microsoft account"],
        cons: ["Only the last 25 items", "Unpinned items are cleared on restart"],
      },
      {
        name: "Ditto",
        price: "Free, open source",
        url: "https://ditto-cp.sourceforge.io/",
        bestFor: "People who copy and paste all day.",
        pros: ["History as long as you want, kept after restarts", "Type to search old clips", "Groups for saved snippets"],
        cons: ["One more app running in the background", "Stores everything you copy unless you exclude apps"],
      },
    ],
    rows: [
      { label: "Price", values: ["Free, built in", "Free, open source"] },
      { label: "How many items", values: ["Last 25", "As many as you set"] },
      { label: "After a restart", values: ["Only pinned items stay", "Everything stays"] },
      { label: "Finding an old clip", values: ["Scroll the panel", "Type to search"] },
      { label: "Shortcut", values: ["Windows + V", "Ctrl + ` by default, can be changed"] },
    ],
    verdict: [
      { pick: "Windows clipboard history", when: "you just want the last few copies back. Turn it on and you are done." },
      { pick: "Ditto", when: "you write, code or do support work and reuse the same snippets every day." },
    ],
    faq: [
      { q: "Is Ditto safe to install?", a: "It is open source and has been around for many years. Like any clipboard manager it keeps what you copy, so exclude your password manager in its settings or clear it often." },
      { q: "Can I use Ditto and Windows + V together?", a: "Yes. They use different shortcuts, so they do not clash. Most people end up using only one." },
    ],
    checked: "2026-10-17",
    intents: ["windows-11-keyboard-shortcuts"],
  },
  {
    slug: "mac-window-tiling-vs-rectangle",
    kind: "built-in-vs-app",
    searchPhrase: "mac window tiling vs rectangle",
    title: "Mac window tiling vs Rectangle",
    searchAlternates: ["do i still need rectangle on sequoia", "best window manager for mac", "rectangle vs magnet"],
    answer:
      "On macOS Sequoia or later, the built-in tiling handles halves, quarters and a few arrangements, with shortcuts in Window > Move & Resize. Rectangle is a free, open-source app that adds thirds and custom sizes and lets you set every shortcut yourself, and it runs on older macOS too.",
    options: [
      {
        name: "Built-in tiling",
        price: "Built in (macOS Sequoia and later)",
        tip: "how-to-tile-windows-side-by-side-on-a-mac",
        builtIn: true,
        bestFor: "Two windows side by side, now and then.",
        pros: ["Nothing to install", "Drag to an edge or use the green button"],
        cons: ["No thirds or custom sizes", "Needs macOS Sequoia or later"],
      },
      {
        name: "Rectangle",
        price: "Free, open source (Pro version is paid)",
        url: "https://rectangleapp.com/",
        bestFor: "Keyboard people and big monitors.",
        pros: ["Thirds, sixths and custom layouts", "Every layout has a shortcut you can change", "Works on older macOS"],
        cons: ["Needs Accessibility permission", "Can fight with built-in tiling until you turn one off"],
      },
      {
        name: "Magnet",
        price: "Paid, one-time, Mac App Store",
        url: "https://magnet.crowdcafe.com/",
        bestFor: "People who prefer an App Store app.",
        pros: ["Simple, from the Mac App Store"],
        cons: ["Costs money for what Rectangle does free"],
      },
    ],
    rows: [
      { label: "Price", values: ["Free, built in", "Free (Pro is paid)", "Paid once"] },
      { label: "Halves and quarters", values: ["Yes", "Yes", "Yes"] },
      { label: "Thirds and custom sizes", values: ["No", "Yes", "Thirds, yes"] },
      { label: "Keyboard shortcuts", values: ["A few, under Window > Move & Resize", "For every layout, all editable", "For every layout"] },
      { label: "macOS needed", values: ["Sequoia or later", "Older versions too", "Older versions too"] },
    ],
    verdict: [
      { pick: "Built-in tiling", when: "you are on Sequoia or later and only ever need two windows side by side." },
      { pick: "Rectangle", when: "you want thirds, a wide monitor layout, or a shortcut for everything." },
    ],
    faq: [
      { q: "Will Rectangle conflict with the built-in tiling?", a: "Both can react when you drag a window to the edge. Turn off one of them: in Rectangle's settings, or in System Settings > Desktop & Dock > Windows." },
      { q: "Is Rectangle safe?", a: "It is open source and widely used. It needs Accessibility permission to move windows, which is normal for this kind of app." },
    ],
    checked: "2026-10-17",
    intents: ["split-screen"],
  },
  {
    slug: "1password-vs-bitwarden-vs-google-password-manager",
    kind: "built-in-vs-app",
    searchPhrase: "1password vs bitwarden vs google password manager",
    title: "1Password vs Bitwarden vs Google Password Manager",
    searchAlternates: ["google password manager vs bitwarden vs 1password", "is chrome password manager good enough", "best password manager", "bitwarden vs 1password"],
    answer:
      "If you only use Chrome and Android, Google Password Manager is free, built in and fine. Bitwarden is the best free choice if you mix browsers or pair an iPhone with a Windows PC, and it is open source. 1Password costs money, but it is the most polished for families and sharing.",
    options: [
      {
        name: "Google Password Manager",
        price: "Built into Chrome and Android",
        url: "https://passwords.google.com",
        tip: "how-to-check-if-your-saved-passwords-were-leaked-in-chrome",
        builtIn: true,
        bestFor: "Chrome and Android only.",
        pros: ["Already there, nothing to install", "Password Checkup for leaked passwords", "Passkeys supported"],
        cons: ["Awkward outside Chrome and Android", "Tied to your Google account"],
      },
      {
        name: "Bitwarden",
        price: "Free, with a cheap Premium",
        url: "https://bitwarden.com",
        bestFor: "Mixed devices on a budget.",
        pros: ["Free plan works on every browser and phone", "Open source and independently audited", "Passkeys supported"],
        cons: ["Plainer apps", "Breach reports are a Premium feature"],
      },
      {
        name: "1Password",
        price: "Paid subscription, free trial",
        url: "https://1password.com",
        bestFor: "Families and anyone who shares logins.",
        pros: ["Polished on every platform", "Easy shared vaults for family", "Watchtower flags weak and leaked passwords"],
        cons: ["No free plan"],
      },
    ],
    rows: [
      { label: "Price", values: ["Free", "Free, Premium is a small yearly fee", "Paid"] },
      { label: "Works in", values: ["Chrome, Android, and iPhone through Chrome", "Every major browser and phone", "Every major browser and phone"] },
      { label: "Leaked password check", values: ["Password Checkup", "Premium reports", "Watchtower"] },
      { label: "Sharing with family", values: ["Share with your Google family group", "Free between two people, more on paid plans", "Shared vaults on the family plan"] },
      { label: "Open source", values: ["No", "Yes", "No"] },
    ],
    verdict: [
      { pick: "Google Password Manager", when: "you live in Chrome and Android and just want it to work." },
      { pick: "Bitwarden", when: "you use more than one browser or an iPhone with a Windows PC and do not want to pay." },
      { pick: "1Password", when: "you are setting up a whole family and want the least friction." },
    ],
    faq: [
      { q: "Is it safe to keep passwords in Chrome?", a: "For most people, yes, as long as the Google account has a strong password and 2-Step Verification. You can add on-device encryption in Google Password Manager settings." },
      { q: "How do I move my passwords out of Chrome?", a: "In Google Password Manager, open Settings and choose Export passwords. Import the file into the new manager, then delete the file, because it is not encrypted." },
      { q: "Do I need a password manager if I use passkeys?", a: "Yes. Passkeys still live in a manager (Google, Apple, Bitwarden or 1Password), and most sites still use passwords." },
    ],
    checked: "2026-10-17",
    intents: ["privacy-checkup"],
  },
  {
    slug: "ccleaner-vs-storage-sense",
    kind: "built-in-vs-app",
    searchPhrase: "ccleaner vs storage sense",
    title: "CCleaner vs Storage Sense",
    searchAlternates: ["storage sense vs ccleaner", "do i need ccleaner on windows 11", "ccleaner alternatives", "is ccleaner worth it"],
    answer:
      "Windows 11 already does the cleaning that matters. Storage Sense removes temporary files and empties the recycle bin on a schedule, and Cleanup recommendations on the same Storage page finds big files and unused apps. CCleaner adds some browser and app cleaning, but the free version pushes upgrades and its registry cleaner will not make your PC faster. Most people do not need it.",
    options: [
      {
        name: "Storage Sense",
        price: "Built in",
        tip: "how-to-free-up-disk-space-automatically-in-windows-11",
        builtIn: true,
        bestFor: "Keeping a disk from filling up, with no effort.",
        pros: ["Runs on a schedule by itself", "No ads, nothing to install", "Cleanup recommendations for big and unused files"],
        cons: ["Does not clear every app's cache"],
      },
      {
        name: "CCleaner",
        price: "Free version, paid Pro",
        url: "https://www.ccleaner.com/",
        bestFor: "People who want one button for browser and app leftovers.",
        pros: ["Cleans browser data and some app caches in one pass"],
        cons: ["Free version nags you to upgrade", "Registry cleaning brings no real speed-up", "A hacked installer shipped malware in 2017"],
      },
      {
        name: "BleachBit",
        price: "Free, open source",
        url: "https://www.bleachbit.org/",
        bestFor: "A no-nonsense deep clean now and then.",
        pros: ["Free with no upsell", "Cleans many app caches"],
        cons: ["Easy to delete more than you meant to, so read each box"],
      },
    ],
    rows: [
      { label: "Price", values: ["Free, built in", "Free, Pro is paid", "Free, open source"] },
      { label: "Temporary files", values: ["Yes", "Yes", "Yes"] },
      { label: "Runs on a schedule", values: ["Yes", "Pro only", "No"] },
      { label: "Browser caches", values: ["Partly", "Yes", "Yes"] },
      { label: "Registry cleaner", values: ["No (not needed)", "Yes", "No"] },
      { label: "Upgrade prompts", values: ["None", "Yes", "None"] },
    ],
    verdict: [
      { pick: "Storage Sense", when: "you want the disk to stay tidy. That is almost everyone." },
      { pick: "BleachBit", when: "you want a deeper one-off clean without ads." },
      { pick: "CCleaner", when: "you already pay for it and like the one-button cleanup. There is no need to start." },
    ],
    faq: [
      { q: "Does cleaning the registry speed up Windows?", a: "Not in any way you would notice, and Microsoft does not support registry cleaners. Skip that part." },
      { q: "My laptop is still slow after cleaning. What next?", a: "Check for one app or browser tab using the memory, and close frozen apps. The guide on speeding up a slow Windows laptop goes through it in order." },
    ],
    checked: "2026-10-17",
    intents: ["speed-up-slow-windows-laptop"],
  },
  {
    slug: "snipping-tool",
    kind: "alternatives",
    searchPhrase: "snipping tool alternatives for windows",
    title: "Snipping Tool alternatives for Windows",
    searchAlternates: ["best screenshot tool for windows", "sharex vs greenshot", "snagit alternative"],
    answer:
      "Windows 11's own Snipping Tool now covers most jobs: region snips, screen recording, copying text out of a screenshot and quick redaction. If you want more, ShareX is the free, open-source power tool, Greenshot is a simpler free option, and Snagit is the paid choice for polished guides with arrows and callouts.",
    options: [
      {
        name: "Snipping Tool",
        price: "Built in",
        tip: "how-to-copy-text-from-a-screenshot-on-windows-11",
        builtIn: true,
        bestFor: "Everyday screenshots.",
        pros: ["Windows + Shift + S from anywhere", "Text actions copy text out of a snip", "Screen recording"],
        cons: ["Basic drawing tools"],
      },
      {
        name: "ShareX",
        price: "Free, open source",
        url: "https://getsharex.com/",
        bestFor: "Power users who want everything.",
        pros: ["Scrolling capture, GIF recording, text recognition", "Automate what happens after each capture"],
        cons: ["A lot of settings", "Can upload captures, so check its after-capture tasks"],
      },
      {
        name: "Greenshot",
        price: "Free, open source",
        url: "https://getgreenshot.org/",
        bestFor: "Quick annotated screenshots without fuss.",
        pros: ["Light and simple", "Good arrows, boxes and blur"],
        cons: ["No screen recording", "Updates are slow"],
      },
      {
        name: "Snagit",
        price: "Paid",
        url: "https://www.techsmith.com/snagit/",
        bestFor: "Writing guides and documentation.",
        pros: ["Best annotation and templates", "Scrolling capture and video"],
        cons: ["Costs money"],
      },
    ],
    rows: [
      { label: "Price", values: ["Free, built in", "Free", "Free", "Paid"] },
      { label: "Screen recording", values: ["Yes", "Yes, including GIF", "No", "Yes"] },
      { label: "Copy text from a capture", values: ["Yes, Text actions", "Yes", "Through a plugin", "Yes"] },
      { label: "Scrolling capture", values: ["No", "Yes", "Limited", "Yes"] },
      { label: "Annotation", values: ["Pen, highlighter, shapes", "Good", "Good", "Best"] },
      { label: "Learning curve", values: ["None", "Steep", "Low", "Low"] },
    ],
    verdict: [
      { pick: "Snipping Tool", when: "you take a few screenshots a week. It is already on your PC." },
      { pick: "ShareX", when: "you want scrolling captures, GIFs or automation, and do not mind settings." },
      { pick: "Greenshot", when: "you want arrows and blur on a screenshot in two clicks." },
      { pick: "Snagit", when: "screenshots are part of your job and the time saved pays for it." },
    ],
    faq: [
      { q: "Is ShareX safe?", a: "It is open source and well known. It can upload captures to image hosts, so check its after-capture tasks and leave uploads off if you do not want them." },
      { q: "Can Snipping Tool take a scrolling screenshot?", a: "Not at the moment. ShareX and Snagit can." },
    ],
    checked: "2026-10-17",
    intents: ["screenshots"],
  },
  {
    slug: "do-not-disturb-vs-downtime-vs-focus",
    kind: "vs",
    searchPhrase: "do not disturb vs downtime vs focus on iphone",
    title: "Do Not Disturb vs Downtime vs Focus on iPhone",
    searchAlternates: ["focus vs downtime vs do not disturb on iphone", "difference between focus and do not disturb", "iphone downtime vs focus", "which iphone mode blocks apps"],
    answer:
      "Do Not Disturb is one Focus that silences almost everything. A Focus is the general version, where you choose which people and apps can still reach you. Downtime, in Screen Time, is different: it blocks the apps themselves, not just their notifications.",
    options: [
      {
        name: "Do Not Disturb",
        price: "Built in",
        tip: "how-to-set-up-a-focus-on-iphone",
        builtIn: true,
        bestFor: "Quiet right now.",
        pros: ["One tap in Control Center"],
        cons: ["Blunt: almost nothing gets through"],
      },
      {
        name: "Focus",
        price: "Built in",
        tip: "how-to-set-up-a-focus-on-iphone",
        builtIn: true,
        bestFor: "Work hours, sleep, driving.",
        pros: ["Choose who and what can interrupt", "Schedules by time or place"],
        cons: ["Time Sensitive alerts still break through"],
      },
      {
        name: "Downtime",
        price: "Built in",
        tip: "how-to-set-downtime-in-screen-time-on-iphone",
        builtIn: true,
        bestFor: "Stopping yourself, or a child, from opening apps.",
        pros: ["Actually blocks apps", "Screen Time passcode makes it stick"],
        cons: ["Easy to ignore without a passcode"],
      },
    ],
    rows: [
      { label: "What it does", values: ["Silences notifications and calls", "Silences everything except who you allow", "Blocks apps outside your allowed list"] },
      { label: "Where", values: ["Control Center or Settings > Focus", "Settings > Focus", "Settings > Screen Time > Downtime"] },
      { label: "Stops you opening apps", values: ["No", "No", "Yes"] },
      { label: "Calls", values: ["Allowed contacts only", "Allowed contacts only", "Phone stays available"] },
      { label: "Schedule", values: ["Yes", "Yes, by time or place", "Yes"] },
      { label: "Alarms", values: ["Still ring", "Still ring", "Still ring"] },
    ],
    verdict: [
      { pick: "Do Not Disturb", when: "you need quiet for an hour and do not want to set anything up." },
      { pick: "A Focus", when: "you want a work or sleep mode that still lets family through." },
      { pick: "Downtime", when: "the problem is opening the apps, not the notifications." },
    ],
    faq: [
      { q: "Can I use a Focus and Downtime at the same time?", a: "Yes. A lot of people run a Sleep Focus and Downtime on the same evening schedule." },
      { q: "Do alarms ring during Do Not Disturb?", a: "Yes. Clock alarms ring in all three." },
    ],
    checked: "2026-10-17",
    intents: ["focus", "notifications"],
  },
];

export const compareBySlug = (slug: string) => COMPARES.find((c) => c.slug === slug);
export const comparePath = (page: ComparePage) => (page.kind === "alternatives" ? `/alternatives/${page.slug}` : `/compare/${page.slug}`);
export const comparePages = () => COMPARES.filter((c) => c.kind !== "alternatives");
export const alternativesPages = () => COMPARES.filter((c) => c.kind === "alternatives");
/** Minimum written options on an alternatives page. */
export const MIN_ALTERNATIVES = 2;

export const COMPARE_KIND_LABEL: Record<CompareKind, string> = {
  vs: "Comparison",
  alternatives: "Alternatives",
  "built-in-vs-app": "Built-in vs app",
};
