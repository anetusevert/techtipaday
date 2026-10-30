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
      hook: "Still tapping on typos and missing every single time?",
      coverLine: "Stop missing every typo",
      lines: [
        "Hold the spacebar.",
        "Your keyboard turns into a trackpad.",
        "Slide to put the cursor exactly where you want it.",
        "On Android, just swipe along the spacebar.",
      ],
      cta: "One tech tip a day at techtipaday.com",
      hookVisual: { type: "phone-keyboard", action: "miss-taps" },
      doThis: "Hold the spacebar.",
      doVisual: { type: "phone-keyboard", action: "hold-space" },
      steps: [
        { say: "Your keyboard turns into a trackpad.", visual: { type: "phone-keyboard", action: "trackpad" } },
        { say: "Slide to drop the cursor right on the typo.", visual: { type: "phone-keyboard", action: "glide-fix" } },
        { say: "On Android, swipe along the spacebar.", visual: { type: "phone-keyboard", action: "swipe-space", platform: "android" } },
      ],
      result: { say: "No more stabbing at the screen. Fixed in one slide.", headline: "Fixed in one slide", before: "teh", after: "the" },
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
    intents: ["wifi", "find-wifi-password"],
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
    video: {
      hook: "Your phone hides every Wi-Fi password you've ever typed.",
      hookLabel: "HIDDEN SETTING",
      coverLine: "Find that Wi-Fi password",
      lines: ["Open Settings, then Wi-Fi.", "Tap the little i next to your network.", "Tap Password. Face ID unlocks it.", "On Android, tap Share for a QR code."],
      cta: "One tech tip a day at techtipaday.com",
      hookVisual: { type: "phone-settings", path: ["Settings", "Wi-Fi"], rows: ["Home-5G", "Cafe Guest", "Office"], tap: "Home-5G" },
      doThis: "Open Settings, then Wi-Fi.",
      doVisual: { type: "phone-settings", path: ["Settings"], rows: ["Airplane Mode", "Wi-Fi", "Bluetooth", "Cellular"], tap: "Wi-Fi" },
      steps: [
        { say: "Tap the little i next to your network.", visual: { type: "phone-settings", path: ["Settings", "Wi-Fi"], rows: ["Home-5G  (i)", "Cafe Guest", "Office"], tap: "Home-5G  (i)" } },
        { say: "Tap Password. Face ID unlocks it.", visual: { type: "phone-settings", path: ["Wi-Fi", "Home-5G"], rows: ["Auto-Join", "Password", "Private Address"], tap: "Password", reveal: "sunflower42" } },
        { say: "On Android, tap Share for a QR code.", visual: { type: "phone-settings", path: ["Internet", "Home-5G"], rows: ["Share  (QR code)", "Forget", "Advanced"], tap: "Share  (QR code)" } },
      ],
      result: { say: "No more crawling behind the router.", headline: "Password found", before: "••••••••", after: "sunflower42" },
    },
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
    video: {
      hook: "Still retyping a long code from a photo, letter by letter?",
      coverLine: "Copy text from any photo",
      lines: ["Copy the text straight from the photo.", "On iPhone, press and hold on the text, then tap Copy.", "On Android, open it in Google Photos and tap Lens.", "Tap Text, select it, and hit Copy."],
      cta: "One tech tip a day at techtipaday.com",
      hookVisual: { type: "phone-settings", mode: "photo", path: ["Photos"], rows: [] },
      doThis: "Copy the text straight from the photo.",
      doVisual: { type: "phone-settings", mode: "photo", path: ["Photos"], rows: [], reveal: "copied" },
      steps: [
        { say: "On iPhone, press and hold on the text, then tap Copy.", visual: { type: "phone-settings", mode: "photo", path: ["Photos"], rows: [], reveal: "hold" } },
        { say: "On Android, open it in Google Photos and tap Lens.", visual: { type: "phone-settings", mode: "photo", path: ["Google Photos"], rows: [], reveal: "lens" } },
        { say: "Tap Text, select it, and hit Copy.", visual: { type: "phone-settings", mode: "photo", path: ["Google Lens"], rows: [], reveal: "select" } },
      ],
      result: { say: "Paste it anywhere. No squinting, no typos.", headline: "Copied, not retyped", before: "Retype, typo, retype", after: "Hold, copy, paste" },
    },
  },
  {
    n: 4,
    slug: "how-to-reopen-a-closed-tab-in-chrome",
    date: "2026-10-19",
    title: "How to reopen a closed tab in Chrome",
    displayName: "Closed the wrong tab? One shortcut brings it back",
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
    video: {
      hook: "Just closed the tab you actually needed? Again?",
      lines: ["Press Control, Shift, T.", "Your tab comes right back.", "On a Mac, it's Command, Shift, T.", "Keep pressing to bring back more."],
      cta: "One tech tip a day at techtipaday.com",
      hookVisual: { type: "laptop", action: "tabs", mode: "close" },
      doThis: "Press Control, Shift, T.",
      doVisual: { type: "laptop", action: "tabs", mode: "reopen" },
      steps: [
        { say: "Your tab comes right back.", visual: { type: "laptop", action: "tabs", mode: "reopen" } },
        { say: "On a Mac, it's Command, Shift, T.", visual: { type: "laptop", action: "tabs", mode: "reopen", keys: ["⌘ Cmd", "Shift", "T"] } },
        { say: "Keep pressing to bring back more.", visual: { type: "laptop", action: "tabs", mode: "multi" } },
      ],
      result: { say: "Nothing you close is really gone.", headline: "Tab's back", before: "Closed", after: "Restored" },
    },
  },
  {
    n: 5,
    slug: "how-to-screenshot-part-of-the-screen-on-windows-or-mac",
    date: "2026-10-20",
    title: "How to screenshot part of the screen on Windows or Mac",
    displayName: "Screenshot just the part you need, no cropping",
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
    video: {
      hook: "You've been taking screenshots the hard way.",
      hookLabel: "YOU'RE DOING IT WRONG",
      lines: ["Press Windows, Shift, S.", "Drag a box around what you want.", "It's already on your clipboard.", "On a Mac, it's Command, Shift, 4."],
      cta: "One tech tip a day at techtipaday.com",
      hookVisual: { type: "laptop", action: "snip", mode: "full" },
      doThis: "Press Windows, Shift, S.",
      doVisual: { type: "laptop", action: "snip", mode: "keys" },
      steps: [
        { say: "Drag a box around what you want.", visual: { type: "laptop", action: "snip", mode: "drag" } },
        { say: "It's already on your clipboard.", visual: { type: "laptop", action: "snip", mode: "done" } },
        { say: "On a Mac, it's Command, Shift, 4.", visual: { type: "laptop", action: "snip", mode: "drag", keys: ["⌘ Cmd", "Shift", "4"], app: "Preview · macOS" } },
      ],
      result: { say: "No full screenshot, no cropping.", headline: "Just the part", before: "Crop later", after: "One drag" },
    },
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
    video: {
      hook: "Your iPhone has a hidden 80 percent charging limit.",
      hookLabel: "HIDDEN SETTING",
      lines: ["Set a charge limit.", "On iPhone 15 or newer, open Settings, then Battery.", "Tap Charging.", "Pick 80 percent."],
      cta: "One tech tip a day at techtipaday.com",
      hookVisual: { type: "phone-settings", mode: "charge", path: ["plugged in all night"], rows: [] },
      doThis: "Set a charge limit.",
      doVisual: { type: "phone-settings", mode: "charge", path: ["Charge Limit · 80%"], rows: [], reveal: "limit" },
      steps: [
        { say: "On iPhone 15 or newer, open Settings, then Battery.", visual: { type: "phone-settings", path: ["Settings"], rows: ["General", "Accessibility", "Battery", "Privacy & Security"], tap: "Battery" } },
        { say: "Tap Charging.", visual: { type: "phone-settings", path: ["Settings", "Battery"], rows: ["Power Mode", "Charging", "Battery Health"], tap: "Charging" } },
        { say: "Pick 80 percent.", visual: { type: "phone-settings", path: ["Battery", "Charging"], rows: ["80%", "85%", "90%", "95%", "100%"], tap: "80%" } },
      ],
      result: { say: "It stops at 80, so the battery wears out slower.", headline: "Battery ages slower", before: "100% all night", after: "Stops at 80%" },
    },
  },
  {
    n: 81,
    slug: "how-to-free-up-storage-on-iphone",
    date: "2026-10-18",
    title: "How to free up storage on iPhone",
    summary: "Storage full again? Offload the apps you never open. Your photos stay where they are.",
    category: "iphone",
    platforms: ["iphone"],
    devices: ["iPhone on iOS 18 and iOS 26"],
    difficulty: "Easy",
    minutes: 2,
    why: "You get gigabytes back without deleting a single photo.",
    intents: ["free-up-storage", "speed-up-slow-phone"],
    seo: {
      searchPhrase: "how to free up storage on iphone",
      searchAlternates: ["iphone storage full", "offload unused apps", "free up space on iphone without deleting photos", "iphone storage almost full what to delete"],
      answer: "Go to Settings > General > iPhone Storage and tap Enable next to Offload Unused Apps. The iPhone removes apps you haven't opened in a while but keeps their documents and data. Tap an offloaded app's icon later and it downloads again.",
      faq: [
        { q: "What's the difference between Offload App and Delete App?", a: "Offload removes the app and keeps its documents and data. Delete removes both. If there's any chance you'll use the app again, offload it." },
        { q: "Will offloading delete my photos or messages?", a: "No. It only touches apps. Photos, messages and files stay on the phone." },
        { q: "How do I get an offloaded app back?", a: "Tap its icon. There's a small cloud next to the name, and the app downloads again from the App Store. If the developer has pulled it from the store, it won't come back, so think twice before offloading something old." },
        { q: "Why didn't deleting photos free up any space?", a: "Deleted photos sit in the Recently Deleted album for 30 days and still count. Open that album in Photos, tap Select, then Delete All." },
        { q: "What is System Data and can I clear it?", a: "It's caches, logs and temporary files, and there's no button to clear it. It usually shrinks by itself after a restart or once the phone runs low on space." },
      ],
      useWhen: "Use it when the Storage Full warning pops up and you're about to start deleting photos to make room.",
      notFor: "If Photos is the biggest bar on the storage screen, offloading apps only buys you time. Look at iCloud Photos with Optimize iPhone Storage, or move the photos to a computer.",
      alternatives: [
        { name: "Optimize iPhone Storage", kind: "built-in", pickIt: "Photos and videos are the biggest bar. The full-size originals live in iCloud and the phone keeps smaller copies.", pickThis: "Apps are what's filling the phone, or you don't pay for iCloud storage." },
        { name: "Delete the app", kind: "manual", pickIt: "You know you'll never open it again and don't need anything saved in it.", pickThis: "You might want the app back later, with your data still in it." },
      ],
      compareWith: ["google-photos-vs-icloud-photos"],
    },
    steps: [
      "Open Settings > General > iPhone Storage. The bar at the top takes a few seconds to fill in.",
      "Under the bar, tap Enable next to Offload Unused Apps. If it isn't listed, the same switch is in Settings > Apps > App Store.",
      "To offload one big app yourself, tap it in the list, then Offload App. Delete App is the other button, and that one wipes its data too.",
      "Deleted photos keep taking space for 30 days. In Photos, open Recently Deleted, tap Select, then Delete All.",
    ],
    body: [
      "My Storage Full warning used to come back every couple of weeks, and every time I went and deleted photos I actually wanted. When I finally looked at the storage screen, most of the space was apps I'd opened once on holiday.",
      "Offloading isn't deleting. The icon stays on your home screen with a little cloud next to the name, and one tap brings the app back with your data and settings where you left them.",
      "One catch. An offloaded app has to download again before it opens, so don't count on one you haven't used in months when you're somewhere with no signal.",
    ],
    pick: true,
    video: {
      hook: "Stop deleting your photos every time storage is full.",
      hookLabel: "STOP DOING THIS",
      lines: ["Offload the apps you never open.", "Open Settings, General, iPhone Storage.", "Tap Enable on Offload Unused Apps.", "Your photos and app data stay put."],
      cta: "One tech tip a day at techtipaday.com",
      hookVisual: { type: "phone-settings", path: ["General", "iPhone Storage"], rows: ["Storage Full", "Photos  38.2 GB", "Apps  41.6 GB", "System Data  9.1 GB"], tap: "Photos  38.2 GB" },
      doThis: "Offload the apps you never open.",
      doVisual: { type: "phone-settings", path: ["Settings", "General"], rows: ["About", "Software Update", "iPhone Storage", "AirDrop"], tap: "iPhone Storage" },
      steps: [
        { say: "Open Settings, General, iPhone Storage.", visual: { type: "phone-settings", path: ["General", "iPhone Storage"], rows: ["Offload Unused Apps", "Review Large Attachments", "Photos  38.2 GB", "Apps  41.6 GB"], tap: "Offload Unused Apps" } },
        { say: "Tap Enable on Offload Unused Apps.", visual: { type: "phone-settings", path: ["iPhone Storage", "Recommendations"], rows: ["Offload Unused Apps", "Save up to 7.4 GB"], tap: "Offload Unused Apps", toggle: true } },
        { say: "Your photos and app data stay put.", visual: { type: "phone-settings", path: ["General", "iPhone Storage"], rows: ["Available  8.9 GB", "Photos  38.2 GB", "Apps  34.2 GB"], tap: "Available  8.9 GB" } },
      ],
      result: { say: "Gigabytes back, and every photo is still there.", headline: "Space back, photos kept", before: "Storage Full", after: "7.4 GB free" },
    },
  },
  {
    n: 82,
    slug: "how-to-stop-apps-from-opening-on-startup-in-windows-11",
    date: "2026-10-21",
    title: "How to stop apps from opening on startup in Windows 11",
    displayName: "Laptop slow after you log in? Stop the apps that launch themselves",
    summary: "Half the wait after you sign in is apps opening by themselves. Switch them off in Settings.",
    category: "windows",
    platforms: ["windows"],
    devices: ["Windows 11 PCs and laptops"],
    difficulty: "Easy",
    minutes: 2,
    why: "The desktop is ready a lot sooner after you sign in, and the fan doesn't roar for the first minute.",
    intents: ["speed-up-slow-windows-laptop"],
    seo: {
      searchPhrase: "how to stop apps from opening on startup in windows 11",
      searchAlternates: ["windows 11 startup apps", "disable startup programs windows 11", "apps opening on startup windows 11", "laptop slow after login windows 11", "task manager startup apps"],
      answer: "Open Settings > Apps > Startup and switch off every app you don't need the moment you sign in. Sort the list by Startup impact and start with the ones marked High impact. Nothing gets uninstalled. The apps still open when you click them.",
      faq: [
        { q: "Is it safe to turn off startup apps?", a: "Yes, for almost everything on the list. It only stops the app from opening by itself. Leave your antivirus on, and anything from your PC maker that runs the touchpad, audio or graphics." },
        { q: "What does High impact mean?", a: "Windows measures how much processor time and disk each app used the last time the PC started. High impact apps slow the start the most, so switch those off first." },
        { q: "Why does an app keep turning itself back on?", a: "Some apps add themselves again after an update. Open the app's own settings and look for Open at login, Start automatically or Launch on startup, and turn that off too." },
        { q: "An app opens at startup but isn't in the list. Where else can it be?", a: "Check the Startup folder. Press Windows + R, type shell:startup and press Enter. Delete the shortcut for that app. The app itself stays installed." },
        { q: "Will this make Windows boot faster?", a: "It won't speed up the Windows logo much. What changes is the minute after you sign in, when the desktop used to be busy opening apps instead of letting you work." },
      ],
      useWhen: "Use it when your PC takes ages to be usable after you sign in, or the fan spins up before you've opened anything.",
      notFor: "If the slow part happens before the sign-in screen, startup apps aren't the cause. Look at free disk space and pending updates first.",
      alternatives: [
        { name: "Task Manager", kind: "built-in", pickIt: "You already have Task Manager open. Press Ctrl + Shift + Esc, open Startup apps on the left, right-click an app and choose Disable.", pickThis: "Settings is easier to find and does the same thing with a switch per app." },
        { name: "Autoruns", kind: "tool", pickIt: "Something starts with Windows and doesn't show up in either list. Microsoft's free Sysinternals tool shows every place a program can launch from.", pickThis: "You only want the usual apps gone. Autoruns lists hundreds of entries and it's easy to switch off something Windows needs." },
      ],
      compareWith: ["ccleaner-vs-storage-sense"],
    },
    steps: [
      "Open Settings with Windows + I, then go to Apps > Startup.",
      "Change Sort by to Startup impact so the High impact apps are at the top.",
      "Switch off anything you don't need the second you sign in. Chat apps, game launchers, music players and updaters are the usual ones.",
      "Leave your antivirus on, plus anything from your PC maker for the touchpad or audio. Restart and see how much sooner the desktop is ready.",
    ],
    body: [
      "My laptop used to sit there for a good minute after I signed in, fan going, while Teams, Spotify, Steam and two updaters I'd never heard of opened themselves. I didn't need any of them before my first coffee.",
      "Turning them off doesn't remove anything. Click Spotify when you want music and it opens like it always did. It just waits for you now.",
      "One catch. A few apps quietly switch themselves back on after an update. If one keeps coming back, look in that app's own settings for Open at login and turn it off there as well.",
    ],
    pick: true,
    video: {
      hook: "Laptop crawls every time you log in? Blame these apps.",
      lines: ["Turn off your startup apps.", "Open Settings, Apps, Startup.", "Sort by startup impact.", "Switch off what you don't need."],
      cta: "One tech tip a day at techtipaday.com",
      hookVisual: { type: "laptop", action: "boot", items: ["Teams", "Spotify", "Steam", "OneDrive", "Discord", "Adobe Updater"] },
      doThis: "Turn off your startup apps.",
      doVisual: { type: "laptop", action: "settings", path: ["Settings"], rows: ["System", "Bluetooth & devices", "Network & internet", "Apps"], tap: "Apps" },
      steps: [
        { say: "Open Settings, Apps, Startup.", visual: { type: "laptop", action: "settings", path: ["Settings", "Apps"], rows: ["Installed apps", "Default apps", "Startup", "Advanced app settings"], tap: "Startup" } },
        { say: "Sort by startup impact.", visual: { type: "laptop", action: "settings", path: ["Apps", "Startup"], rows: ["Sort by: Startup impact", "Spotify · High impact", "Teams · High impact", "Steam · Medium impact"], tap: "Sort by: Startup impact" } },
        { say: "Switch off anything you don't need.", visual: { type: "laptop", action: "settings", path: ["Apps", "Startup"], rows: ["Spotify · High impact", "Teams · High impact", "Steam · Medium impact"], tap: "Spotify · High impact", toggle: true, toggleOff: true } },
      ],
      result: { say: "Your desktop's ready the second you log in.", headline: "Ready in seconds", before: "Slow start", after: "Ready to go" },
    },
  },
  {
    n: 83,
    slug: "how-to-speed-up-animations-on-android",
    date: "2026-10-22",
    title: "How to speed up animations on Android",
    displayName: "Android feels sluggish? A hidden menu makes it snappier",
    summary: "Every app you open plays a little zoom first. A hidden menu lets you cut that wait in half.",
    category: "android",
    platforms: ["android"],
    devices: ["Pixel phones on Android 15 and 16", "Samsung Galaxy"],
    difficulty: "Easy",
    minutes: 2,
    why: "Opening apps, going back and pulling down the notification shade all feel quicker, because the animation in between takes half as long.",
    intents: ["speed-up-slow-phone"],
    seo: {
      searchPhrase: "how to speed up animations on android",
      searchAlternates: ["android animation scale 0.5x", "make android feel faster", "developer options animation speed", "window animation scale", "how to make my android phone faster"],
      answer: "Turn on Developer options by tapping Build number seven times in Settings > About phone. Then open Settings > System > Developer options and set Window animation scale, Transition animation scale and Animator duration scale to 0.5x. Every animation plays twice as fast.",
      faq: [
        { q: "Is it safe to turn on Developer options?", a: "Yes, as long as you only touch the animation settings. Turning the menu on changes nothing by itself. Leave the other switches alone unless you know what they do." },
        { q: "Does this make my phone actually faster?", a: "No. Apps take the same time to load. The animations around them are shorter, so you see the app sooner and the phone feels quicker." },
        { q: "Should I pick 0.5x or turn animations off?", a: "Try 0.5x first. Off is quicker still, but screens snap in with no motion at all, which looks jumpy. On an older phone you may also see a blank screen for a moment while the app catches up." },
        { q: "Where is Build number on a Samsung phone?", a: "Settings > About phone > Software information > Build number. Tap it seven times. Developer options then shows up at the very bottom of the main Settings list." },
        { q: "How do I put it back?", a: "Open Developer options again and set all three animation scales to 1x." },
      ],
      useWhen: "Use it when your Android feels a beat slow every time you open an app or go back, even though nothing is actually lagging.",
      notFor: "It won't fix a phone that's slow because storage is full or an app keeps freezing. The phone is just as fast underneath. It just stops making you wait for the animation.",
      alternatives: [
        { name: "Remove animations", kind: "built-in", pickIt: "Motion makes you feel queasy, or you want no animation at all without opening Developer options. On a Pixel it's in Settings > Accessibility > Color and motion.", pickThis: "You want the phone to still move, just quicker. 0.5x keeps the motion and halves the wait." },
        { name: "Free up storage", kind: "manual", pickIt: "Everything is slow, not just the moves between screens, and storage is nearly full. Delete big videos and apps you don't use first.", pickThis: "The phone is fine. It only feels slow between screens." },
      ],
    },
    steps: [
      "Open Settings > About phone and tap Build number seven times. Enter your PIN if asked, and you'll see You are now a developer. On Samsung, Build number is under About phone > Software information.",
      "Go back and open Settings > System > Developer options. On Samsung, Developer options sits at the bottom of the main Settings list.",
      "Scroll down to the Drawing section, or tap the search icon and type animation.",
      "Set Window animation scale, Transition animation scale and Animator duration scale to 0.5x.",
    ],
    body: [
      "Every time you open an app, Android plays a short zoom. Go back and you get a slide. Most of the time the phone is ready before that animation finishes, so you're waiting on the motion, not the phone.",
      "At 0.5x the same animations take half as long. You notice it within ten seconds, and a phone still on 1x feels slow after that.",
      "Developer options has a long list of other switches. You don't need any of them for this. The three animation scales are the only ones to change.",
    ],
    pick: true,
    video: {
      hook: "There's a hidden menu that makes your Android feel faster.",
      hookLabel: "HIDDEN SETTING",
      lines: ["Cut the animations in half.", "Tap Build number seven times.", "Open System, then Developer options.", "Set all three animation scales to half."],
      cta: "One tech tip a day at techtipaday.com",
      hookVisual: { type: "phone-settings", mode: "slowmo", path: ["Home · Android"], rows: [] },
      doThis: "Cut the animations in half.",
      doVisual: { type: "phone-settings", mode: "slowmo", path: ["Home · Android"], rows: [], reveal: "fast" },
      steps: [
        { say: "In About phone, tap Build number seven times.", visual: { type: "phone-settings", mode: "taps", path: ["Settings", "About phone"], rows: ["Model · Pixel 9", "Android version · 16", "Build number"], tap: "Build number" } },
        { say: "Open System, then Developer options.", visual: { type: "phone-settings", path: ["Settings", "System"], rows: ["Languages", "Gestures", "Date & time", "Developer options"], tap: "Developer options" } },
        { say: "Set all three animation scales to half.", visual: { type: "phone-settings", mode: "scales", path: ["System", "Developer options"], rows: [] } },
      ],
      result: { say: "Same phone, and every swipe feels twice as quick.", headline: "Twice as snappy", before: "1x · sluggish", after: ".5x · snappy" },
    },
  },
  {
    n: 84,
    slug: "how-to-turn-off-auto-brightness-on-iphone",
    date: "2026-10-23",
    title: "How to turn off Auto-Brightness on iPhone",
    displayName: "iPhone screen keeps dimming? The off switch is hiding in Accessibility",
    summary: "Auto-Brightness isn't in Display & Brightness. It's at the bottom of Accessibility, and turning it off stops the screen drifting darker on its own.",
    category: "iphone",
    platforms: ["iphone"],
    devices: ["iPhone on iOS 18 and iOS 26"],
    difficulty: "Easy",
    minutes: 1,
    why: "The screen stays at the level you picked, so it stops going dark halfway through a page in a dim room.",
    intents: ["iphone-screen-dimming"],
    seo: {
      searchPhrase: "how to turn off auto brightness on iphone",
      searchAlternates: ["iphone screen keeps dimming", "iphone brightness keeps changing", "where is auto brightness on iphone", "stop iphone from dimming", "iphone auto brightness not in display settings"],
      answer: "Go to Settings > Accessibility > Display & Text Size, scroll to the bottom and turn off Auto-Brightness. The screen then stays at whatever level you set with the slider in Control Center.",
      faq: [
        { q: "Why isn't Auto-Brightness under Display & Brightness?", a: "Apple moved it to Accessibility years ago. Display & Brightness still has the slider, True Tone and Night Shift, but the on/off switch only lives under Accessibility > Display & Text Size." },
        { q: "Does turning it off use more battery?", a: "It can. The screen is one of the biggest power users, so if you leave the slider high all day the battery goes faster. Turn it down yourself when you don't need it bright." },
        { q: "My screen still dims with it off. Why?", a: "Other things dim it too. Low Power Mode lowers the brightness, a hot iPhone dims itself to cool down, and the screen fades a few seconds before Auto-Lock kicks in." },
        { q: "What does Attention Aware Features do?", a: "On iPhones with Face ID it checks whether you're looking before it dims the screen. Leave it on in Settings > Face ID & Passcode and the screen stays bright while you read." },
        { q: "Is True Tone the same thing?", a: "No. True Tone changes the color of the screen to match the light in the room. It doesn't change the brightness, so you can leave it on." },
      ],
      useWhen: "Use it when the screen keeps getting darker while you read, or the brightness jumps around every time you walk into another room.",
      notFor: "It won't stop the dimming that comes from Low Power Mode, heat or Auto-Lock. Those are separate settings, covered in the questions below.",
      alternatives: [
        { name: "Attention Aware Features", kind: "built-in", pickIt: "You have a Face ID iPhone and the screen dims while you're still looking at it. It's in Settings > Face ID & Passcode.", pickThis: "The brightness follows the light in the room and you want it to stop doing that." },
        { name: "A longer Auto-Lock", kind: "built-in", pickIt: "The screen goes dark and locks in the middle of a recipe. Set a longer time in Settings > Display & Brightness > Auto-Lock.", pickThis: "The screen stays on but keeps getting dimmer." },
      ],
    },
    steps: [
      "Open Settings > Accessibility.",
      "Tap Display & Text Size.",
      "Scroll all the way down and turn off Auto-Brightness.",
      "Set the brightness you want with the slider in Control Center. It stays there until you move it.",
    ],
    body: [
      "Auto-Brightness reads the light sensor at the top of the screen. In a dim room it pulls the brightness down, often further than you want, and it keeps nudging it while you read.",
      "The switch sits in Accessibility, not in Display & Brightness, which is why so many people never find it. Once it's off, the slider in Control Center is the only thing that changes the level.",
      "I still drag it down at night. A screen left at full brightness all day eats battery, and nothing will lower it for you now.",
    ],
    pick: true,
    video: {
      hook: "Your iPhone keeps dimming the screen. The off switch is hidden.",
      hookLabel: "HIDDEN SETTING",
      lines: ["Turn off Auto-Brightness.", "Open Settings, then Accessibility.", "Tap Display and Text Size.", "Switch off Auto-Brightness at the bottom."],
      cta: "One tech tip a day at techtipaday.com",
      hookVisual: { type: "phone-settings", mode: "dim", path: ["reading in bed"], rows: [] },
      doThis: "Turn off Auto-Brightness.",
      doVisual: { type: "phone-settings", mode: "dim", path: ["Auto-Brightness · Off"], rows: [], reveal: "steady" },
      steps: [
        { say: "Open Settings, then Accessibility.", visual: { type: "phone-settings", path: ["Settings"], rows: ["General", "Accessibility", "Display & Brightness", "Battery"], tap: "Accessibility" } },
        { say: "Tap Display and Text Size.", visual: { type: "phone-settings", path: ["Settings", "Accessibility"], rows: ["VoiceOver", "Zoom", "Display & Text Size", "Motion"], tap: "Display & Text Size" } },
        { say: "Switch off Auto-Brightness at the bottom.", visual: { type: "phone-settings", path: ["Accessibility", "Display & Text Size"], rows: ["Reduce Transparency", "Reduce White Point", "Auto-Brightness"], tap: "Auto-Brightness", toggle: true, toggleOff: true } },
      ],
      result: { say: "Now it stays exactly where you set it.", headline: "Stays where you set it", before: "Keeps dimming", after: "Stays put" },
    },
  },
  {
    n: 85,
    slug: "how-to-stop-spam-calls-on-android",
    date: "2026-10-24",
    title: "How to stop spam calls on Android",
    displayName: "Spam calls all day? Your Android has a filter that's switched off",
    summary: "Your phone already labels spam calls. One switch in the Phone app stops them ringing at all.",
    category: "android",
    platforms: ["android"],
    devices: ["Pixel and other phones using Phone by Google", "Samsung Galaxy"],
    difficulty: "Easy",
    minutes: 1,
    why: "Calls Google or Samsung already flag as spam stop ringing. You can still see them in your call history if you want to check.",
    intents: ["stop-spam-calls", "android-privacy-settings"],
    seo: {
      searchPhrase: "how to stop spam calls on android",
      searchAlternates: ["block spam calls android", "filter spam calls android", "android caller id and spam", "samsung block spam and scam calls", "stop robocalls on android", "suspected spam calls android"],
      answer: "Open the Phone app, tap the three dots > Settings > Caller ID & spam and turn on Filter spam calls. Calls flagged as spam stop ringing and go to your call history instead. On a Samsung Galaxy the switch is under Settings > Caller ID and spam protection.",
      faq: [
        { q: "Will I miss real calls?", a: "Only if a real number gets flagged as spam, which is rare. Filtered calls still show up in your call history and can leave a voicemail. If one is wrong, tap it and choose Not spam." },
        { q: "I can't find Filter spam calls on my Pixel. Where is it?", a: "Newer Pixels fold it into Call Screen. Open the Phone app > Settings > Spam and Call Screen > Call Screen and pick Basic protection or higher. Basic is the same as Filter spam calls." },
        { q: "Where is it on a Samsung phone?", a: "Open the Phone app, tap the three dots > Settings > Caller ID and spam protection, turn it on and choose to block spam and scam calls." },
        { q: "Can I block every number that isn't in my contacts?", a: "Not in Phone by Google. Its Blocked numbers screen has an Unknown switch, but that only blocks hidden and private numbers. Samsung's Block numbers screen does have a switch for unknown numbers, and it will block the dentist too." },
        { q: "How do I block one number that keeps calling?", a: "Open your call history, tap the number and choose Block or Report spam. Reporting it also helps the filter catch it for everyone else." },
      ],
      useWhen: "Use it when the same kind of calls keep coming: fake deliveries, car warranties, Suspected spam on the screen three times a day.",
      notFor: "It won't stop a spammer the filter hasn't seen yet, and it does nothing for spam texts. Block those numbers one by one.",
      alternatives: [
        { name: "Call Screen", kind: "built-in", pickIt: "You have a Pixel and want unknown numbers answered for you, so you can read who it is before you pick up. It's in Settings > Spam and Call Screen.", pickThis: "You just want known spam to stop ringing and don't need anything screened." },
        { name: "Truecaller", kind: "tool", pickIt: "Your phone doesn't use Phone by Google or Samsung's Phone app, or you want a bigger spam list. It wants access to your contacts.", pickThis: "Your phone already has the built-in filter and you'd rather not install another app." },
      ],
    },
    steps: [
      "Open the Phone app and tap the three dots in the top corner, then Settings.",
      "Tap Caller ID & spam. On newer Pixels it can say Spam and Call Screen.",
      "Make sure See caller & spam ID is on, then turn on Filter spam calls.",
      "On a Samsung Galaxy, go to Settings > Caller ID and spam protection in the Phone app, turn it on and choose to block spam and scam calls.",
    ],
    body: [
      "Your phone already knows which calls are spam. That's where the Suspected spam label on the call screen comes from. Out of the box it only warns you, and the phone still rings.",
      "Filter spam calls goes one step further. Flagged calls don't ring, don't show a missed-call notification, and land in your call history where you can look if you want.",
      "I check that list now and then. In months I've found one real call in there, a delivery driver, and he left a voicemail anyway.",
    ],
    pick: true,
    video: {
      hook: "Your Android has a spam call filter. It's probably switched off.",
      hookLabel: "HIDDEN SETTING",
      coverLine: "Spam calls stop ringing",
      lines: ["Turn on Filter spam calls.", "In the Phone app, tap the dots, then Settings.", "Open Caller ID and spam.", "Switch on Filter spam calls."],
      cta: "One tech tip a day at techtipaday.com",
      hookVisual: { type: "phone-settings", mode: "call", path: [], rows: [], caller: "+1 (602) 555-0148", note: "Suspected spam" },
      doThis: "Turn on Filter spam calls.",
      doVisual: { type: "phone-settings", mode: "spam", path: ["Phone", "Recents"], rows: [], reveal: "filtered" },
      steps: [
        { say: "In the Phone app, tap the dots, then Settings.", visual: { type: "phone-settings", path: ["Phone", "⋮ More"], rows: ["Call history", "Clear frequents", "Settings", "Help & feedback"], tap: "Settings" } },
        { say: "Open Caller ID and spam.", visual: { type: "phone-settings", path: ["Phone", "Settings"], rows: ["Accessibility", "Blocked numbers", "Caller ID & spam", "Display options"], tap: "Caller ID & spam" } },
        { say: "Switch on Filter spam calls.", visual: { type: "phone-settings", path: ["Settings", "Caller ID & spam"], rows: ["See caller & spam ID", "Filter spam calls", "Verified calls"], tap: "Filter spam calls", toggle: true } },
      ],
      result: { say: "Spam stops ringing, and it still waits in your call history.", headline: "Spam stops ringing", before: "Ring ring, spam", after: "Filtered, silent" },
    },
  },
  {
    n: 86,
    slug: "how-to-turn-on-flash-notifications-on-iphone",
    date: "2026-10-25",
    title: "How to turn on flash notifications on iPhone",
    displayName: "Missed the call on silent again? Your iPhone can blink its light instead",
    summary: "Your iPhone can blink the light on the back for calls and alerts, even on silent. The switch is tucked away in Accessibility.",
    category: "iphone",
    platforms: ["iphone"],
    devices: ["iPhone on iOS 18 and iOS 26"],
    difficulty: "Easy",
    minutes: 1,
    why: "You see a call from across the room, even with the phone on silent or face down on the desk.",
    intents: ["notifications"],
    seo: {
      searchPhrase: "how to turn on flash notifications on iphone",
      searchAlternates: ["led flash for alerts iphone", "iphone flash when ringing", "make iphone flash when someone calls", "flash for alerts iphone", "iphone flash notification on silent", "flashlight notification iphone"],
      answer: "Go to Settings > Accessibility > Audio & Visual > LED Flash for Alerts and turn it on, then turn on Flash in Silent Mode if your phone lives on silent. On iOS 26 the row is called Flash for Alerts, and you can pick the LED, the screen or both.",
      faq: [
        { q: "Why doesn't it flash while I'm using the phone?", a: "Out of the box it only flashes when the iPhone is locked. Turn on Flash While Unlocked on the same screen if you want it all the time." },
        { q: "Does it work when the phone is on silent?", a: "Yes, as long as Flash in Silent Mode is on. That's the combination most people are after: no ringtone, but you still notice the call." },
        { q: "Can I make it flash only for calls?", a: "No. It flashes for calls, messages and any notification that would normally make a sound. Mute the busy group chats, or use a Focus that only lets certain people through, and the flashing calms down." },
        { q: "Does it drain the battery?", a: "Not in a way you'd notice. Each flash lasts a fraction of a second. Hundreds of notifications a day would add up a little, but for most people it makes no difference." },
        { q: "Is there the same thing on Android?", a: "Yes. On a Pixel it's Settings > Accessibility > Flash notifications, with a camera flash and a screen flash option. On a Samsung Galaxy it's Settings > Accessibility > Advanced settings > Flash notification." },
      ],
      useWhen: "Use it when your phone is on silent most of the day, sits face down on the desk, or you're somewhere too loud to hear it ring.",
      notFor: "Turn it off for the cinema and the bedside table. The light is bright and it fires for every alert, not just calls.",
      alternatives: [
        { name: "Screen flash", kind: "built-in", pickIt: "Your phone usually lies face up. On iOS 26, choose Screen under Flash for Alerts and the display blinks instead of the camera light.", pickThis: "The phone lies face down, so the light on the back is the only thing you can see." },
        { name: "Vibrate on silent", kind: "built-in", pickIt: "The phone is in your pocket, where you'll feel a buzz but never see a light. Set Settings > Sounds & Haptics > Haptics to Always Play.", pickThis: "The phone sits on a table or in a bag, where a buzz is easy to miss." },
      ],
    },
    steps: [
      "Open Settings > Accessibility.",
      "Under Hearing, tap Audio & Visual.",
      "Scroll down, tap LED Flash for Alerts and turn it on. On iOS 26 it's called Flash for Alerts.",
      "Turn on Flash in Silent Mode. Turn on Flash While Unlocked too if you want it while you're using the phone.",
    ],
    body: [
      "My phone is on silent most of the day and usually face down next to the laptop. I used to find missed calls an hour later. Now the light on the back blinks and I catch it out of the corner of my eye.",
      "It sits in Accessibility because it was made for people who can't hear the ringtone. It's just as handy in a loud office, or with a phone on silent while the kids nap.",
      "One warning: it blinks for every notification, not only calls. If a group chat gets busy, mute that chat or the flashing gets old fast.",
    ],
    pick: true,
    video: {
      hook: "Missed another call on silent? Your iPhone can flash instead.",
      hookLabel: "HIDDEN SETTING",
      coverLine: "Missed calls on silent",
      lines: ["Turn on LED Flash for Alerts.", "Open Settings, then Accessibility.", "Tap Audio and Visual.", "Switch on LED Flash for Alerts.", "Turn on Flash in Silent Mode too."],
      cta: "One tech tip a day at techtipaday.com",
      hookVisual: { type: "phone-settings", mode: "flash", path: ["on silent · face down"], rows: [] },
      doThis: "Turn on LED Flash for Alerts.",
      doVisual: { type: "phone-settings", mode: "flash", path: ["LED Flash for Alerts · on"], rows: [], reveal: "on" },
      steps: [
        { say: "Open Settings, then Accessibility.", visual: { type: "phone-settings", path: ["Settings"], rows: ["General", "Accessibility", "Display & Brightness", "Sounds & Haptics"], tap: "Accessibility" } },
        { say: "Tap Audio and Visual.", visual: { type: "phone-settings", path: ["Settings", "Accessibility"], rows: ["Hearing Devices", "Sound Recognition", "Audio & Visual", "Subtitles & Captioning"], tap: "Audio & Visual" } },
        { say: "Switch on LED Flash for Alerts.", visual: { type: "phone-settings", path: ["Audio & Visual", "LED Flash"], rows: ["LED Flash for Alerts", "Flash While Unlocked", "Flash in Silent Mode"], tap: "LED Flash for Alerts", toggle: true } },
        { say: "Turn on Flash in Silent Mode too.", visual: { type: "phone-settings", path: ["Audio & Visual", "LED Flash"], rows: ["LED Flash for Alerts", "Flash While Unlocked", "Flash in Silent Mode"], tap: "Flash in Silent Mode", toggle: true } },
      ],
      result: { say: "Now the light blinks for every call, even on silent.", headline: "You'll see it ring", before: "3 missed calls", after: "Blinks, you pick up" },
    },
  },
  {
    n: 87,
    slug: "how-to-see-which-apps-use-your-camera-and-microphone-on-android",
    date: "2026-10-26",
    title: "How to see which apps use your camera and microphone on Android",
    displayName: "Which app used your mic at 2am? Your Android keeps a log",
    summary: "Android writes down every time an app uses your camera, microphone or location. The privacy dashboard shows you the list, with times.",
    category: "privacy",
    platforms: ["android"],
    devices: ["Pixel on Android 15 and 16", "Samsung Galaxy"],
    difficulty: "Easy",
    minutes: 2,
    why: "You stop guessing whether an app is listening. You can see which apps actually used the mic or camera, and when, then cut off the one that had no business doing it.",
    intents: ["android-privacy-settings", "privacy-checkup"],
    seo: {
      searchPhrase: "how to see which apps use your camera and microphone on android",
      searchAlternates: ["android privacy dashboard", "which app used my microphone android", "green dot android camera microphone", "permissions used in last 7 days samsung", "is my phone listening to me android", "app using microphone in background android"],
      answer: "On a Pixel, open Settings > Security & privacy > Privacy dashboard. It shows which apps used your location, camera and microphone, and at what time. On a Samsung Galaxy, go to Settings > Security and privacy > Privacy and tap Permissions used in last 7 days.",
      faq: [
        { q: "How far back does it go?", a: "On a Pixel with Android 15 or newer, tap the three dots on the dashboard and choose Show 7 days. Otherwise you get the last 24 hours. Samsung shows the last 7 days straight away." },
        { q: "What does the green dot in the corner mean?", a: "Something is using the camera or the microphone right now. Swipe down from the top of the screen and tap the dot, and it tells you which app." },
        { q: "An app used the mic when I wasn't using it. Should I worry?", a: "Look at what it is first. The keyboard's voice typing, Google and WhatsApp during a call show up a lot and are fine. A shopping or flashlight app at 2 am is not. Tap it and set Microphone to Don't allow." },
        { q: "Why are some apps missing from the list?", a: "System apps are hidden by default. Tap the three dots and choose Show system to see everything." },
        { q: "Can I turn the camera and mic off for every app at once?", a: "Yes. Pull down Quick Settings and use the Camera access and Microphone access tiles. If you don't see them, tap the pencil to edit the tiles and drag them in." },
      ],
      useWhen: "Use it when an ad seems to know about something you only said out loud, or the green dot shows up while you're just scrolling.",
      notFor: "It only covers location, camera and microphone. It won't show what an app sends over the internet or what it reads from your photos.",
      alternatives: [
        { name: "Permission manager", kind: "built-in", pickIt: "You want to go through every app that is allowed to use the mic, not just the ones that used it this week. On a Pixel it's Settings > Security & privacy > Privacy controls > Permission manager.", pickThis: "You want to know what actually happened, with times, before you start changing things." },
        { name: "Camera and microphone access tiles", kind: "built-in", pickIt: "You want both off for every app for a while, say during a meeting or at night. Flip the tiles in Quick Settings.", pickThis: "You want to find the one app that's misbehaving and leave the rest alone." },
      ],
    },
    steps: [
      "On a Pixel, open Settings > Security & privacy and tap Privacy dashboard.",
      "Tap the three dots and choose Show 7 days if you want the whole week instead of the last 24 hours.",
      "Tap Microphone or Camera to see which app used it and when.",
      "Tap an app that shouldn't be there and set the permission to Don't allow.",
      "On a Samsung Galaxy, go to Settings > Security and privacy > Privacy > Permissions used in last 7 days, then tap Camera or Microphone.",
    ],
    body: [
      "Android has kept this log since Android 12. Most people never find it because it sits a few screens deep in Security & privacy, under a name that sounds like a chart nobody reads.",
      "I went looking after the green dot popped up while I was just scrolling. It was a shopping app with a voice search button I had never used, and it had mic access from years ago. I set it to Don't allow and nothing broke.",
      "Most of what you'll find is dull: the camera app, a video call, the keyboard's voice typing. You're looking for the app that had no reason to be on the list, especially at an hour when you were asleep.",
    ],
    pick: true,
    video: {
      hook: "Want to know which app used your mic last night?",
      hookLabel: "HIDDEN SETTING",
      coverLine: "Who used your mic?",
      lines: ["Open the privacy dashboard.", "Open Settings, then Security and privacy.", "Tap Privacy dashboard.", "Tap Microphone to see every app and when.", "Set the odd one to Don't allow."],
      cta: "One tech tip a day at techtipaday.com",
      hookVisual: { type: "phone-settings", mode: "privacy", path: ["green dot · just scrolling"], rows: [] },
      doThis: "Open the privacy dashboard.",
      doVisual: { type: "phone-settings", mode: "privacy", path: ["Security & privacy"], rows: [], reveal: "dashboard" },
      steps: [
        { say: "Open Settings, then Security and privacy.", visual: { type: "phone-settings", path: ["Settings"], rows: ["Network & internet", "Apps", "Security & privacy", "Battery"], tap: "Security & privacy" } },
        { say: "Tap Privacy dashboard.", visual: { type: "phone-settings", path: ["Settings", "Security & privacy"], rows: ["Device unlock", "Privacy controls", "Privacy dashboard", "Private space"], tap: "Privacy dashboard" } },
        { say: "Tap Microphone to see every app and when.", visual: { type: "phone-settings", mode: "privacy", path: ["Privacy dashboard", "Microphone"], rows: [], reveal: "list" } },
        { say: "Set the odd one to Don't allow.", visual: { type: "phone-settings", mode: "privacy", path: ["ShopNow", "Permissions"], rows: [], reveal: "deny" } },
      ],
      result: { say: "Now you know exactly which apps were listening.", headline: "Now you know", before: "Is it listening?", after: "Log shows who" },
    },
  },
  {
    n: 88,
    slug: "how-to-turn-on-grayscale-on-iphone",
    date: "2026-10-27",
    title: "How to turn on grayscale on iPhone",
    displayName: "Can't stop scrolling? Turn your iPhone black and white",
    summary: "Grayscale drains the colour out of your screen, and a lot of the pull goes with it. It's a Color Filters switch in Accessibility, and a triple-click brings colour back when you need it.",
    category: "iphone",
    platforms: ["iphone"],
    devices: ["iPhone on iOS 18 and iOS 26"],
    difficulty: "Easy",
    minutes: 1,
    why: "Red badges and bright thumbnails are made to grab you. In gray they look flat, and picking the phone up \"just for a second\" happens a lot less.",
    intents: ["focus"],
    seo: {
      searchPhrase: "how to turn on grayscale on iphone",
      searchAlternates: ["make iphone black and white", "iphone grayscale shortcut", "iphone screen black and white", "why is my iphone screen black and white", "grayscale mode iphone screen time", "iphone color filters grayscale"],
      answer: "Go to Settings > Accessibility > Display & Text Size > Color Filters, turn Color Filters on and pick Grayscale. To flip it on and off quickly, set Settings > Accessibility > Accessibility Shortcut to Color Filters, then triple-click the side button.",
      faq: [
        { q: "My iPhone screen went black and white by itself. How do I fix it?", a: "Color Filters got switched on, usually by a triple-click on the side button. Triple-click again, or go to Settings > Accessibility > Display & Text Size > Color Filters and turn it off." },
        { q: "Do my photos come out black and white?", a: "No. Grayscale only changes what the screen shows. Photos and videos you take are saved in full colour, and they look normal on any other device." },
        { q: "Can it switch on by itself in the evening?", a: "Yes. In the Shortcuts app, go to Automation, make a Time of Day automation, add the Set Color Filters action set to On and choose Run Immediately. Make a second one in the morning that turns it off." },
        { q: "Does grayscale save battery?", a: "Not really. The screen still lights the same pixels, just without colour. Lower brightness or Low Power Mode does far more." },
        { q: "Is there the same thing on Android?", a: "Yes. On a Pixel it's Bedtime mode's Grayscale option in Digital Wellbeing, or Settings > Accessibility > Color and motion > Color correction. Samsung has it under Settings > Accessibility > Visibility enhancements > Color adjustment." },
      ],
      useWhen: "Use it when you keep opening the same apps without meaning to, or you want the phone to feel dull late at night.",
      notFor: "Switch it off for anything where colour matters: editing photos, maps with coloured routes, or checking which charts are red and green.",
      alternatives: [
        { name: "Screen Time app limits", kind: "built-in", pickIt: "You know exactly which two or three apps eat your evening. Settings > Screen Time > App Limits puts a daily cap on just those.", pickThis: "It's not one app, it's the whole phone, and you'd rather it just felt less shiny." },
        { name: "Downtime", kind: "built-in", pickIt: "You want most apps blocked at set hours, not just made gray. Downtime in Screen Time does that on a schedule.", pickThis: "You still need the phone in the evening but want to pick it up less." },
      ],
      compareWith: ["do-not-disturb-vs-downtime-vs-focus"],
    },
    steps: [
      "Open Settings > Accessibility.",
      "Tap Display & Text Size, then Color Filters.",
      "Turn on Color Filters and pick Grayscale.",
      "Optional: go back to Accessibility, tap Accessibility Shortcut at the bottom and tick Color Filters. Now a triple-click on the side button switches grayscale on and off.",
    ],
    body: [
      "I tried this because I kept finding myself on Instagram without remembering opening it. In gray the red badges stop shouting and the feed looks like an old newspaper. I still use the phone, I just put it down sooner.",
      "The triple-click is the part that makes it stick. When I need colour for a photo or a map, three clicks and it's back, three more and it's gray again.",
      "If someone hands you their phone and asks why it's suddenly black and white, this is almost always the reason: a pocket triple-click turned Color Filters on.",
    ],
    pick: true,
    video: {
      hook: "Can't stop scrolling? One hidden setting makes your phone boring.",
      hookLabel: "HIDDEN SETTING",
      coverLine: "Can't stop scrolling?",
      lines: ["Turn on Grayscale.", "Open Settings, then Accessibility.", "Tap Display and Text Size.", "Turn on Color Filters and pick Grayscale.", "Set it as your triple-click shortcut."],
      cta: "One tech tip a day at techtipaday.com",
      hookVisual: { type: "phone-settings", mode: "gray", path: [], rows: [] },
      doThis: "Turn your screen gray.",
      doVisual: { type: "phone-settings", mode: "gray", path: [], rows: [], reveal: "on" },
      steps: [
        { say: "Open Settings, then Accessibility.", visual: { type: "phone-settings", path: ["Settings"], rows: ["General", "Accessibility", "Action Button", "Camera"], tap: "Accessibility" } },
        { say: "Tap Display and Text Size.", visual: { type: "phone-settings", path: ["Settings", "Accessibility"], rows: ["VoiceOver", "Zoom", "Display & Text Size", "Motion"], tap: "Display & Text Size" } },
        { say: "Turn on Color Filters and pick Grayscale.", visual: { type: "phone-settings", path: ["Display & Text Size", "Color Filters"], rows: ["Color Filters", "Grayscale", "Red/Green Filter", "Color Tint"], tap: "Color Filters", toggle: true } },
        { say: "Set it as your triple-click shortcut.", visual: { type: "phone-settings", mode: "gray", path: [], rows: [], reveal: "triple" } },
      ],
      result: { say: "Same phone, just a lot less tempting.", headline: "Way less tempting", before: "Bright, can't stop", after: "Gray, put it down" },
    },
  },
  {
    n: 89,
    slug: "how-to-find-your-wifi-password-on-windows-11",
    date: "2026-10-28",
    title: "How to find your Wi-Fi password on Windows 11",
    displayName: "Nobody knows the Wi-Fi password? Your laptop does",
    summary: "Any Windows 11 PC that has joined a network keeps its password, and Settings will show it to you with one click. No router sticker, no command line.",
    category: "windows",
    platforms: ["windows"],
    devices: ["Windows 11 (23H2 and later)"],
    difficulty: "Easy",
    minutes: 1,
    why: "The laptop already joined that network, so the password is saved on it. Reading it off the screen beats flipping the router over or resetting it.",
    intents: ["find-wifi-password"],
    seo: {
      searchPhrase: "how to find your wifi password on windows 11",
      searchAlternates: ["see wifi password windows 11", "show saved wifi password windows", "view wifi security key windows 11", "forgot wifi password laptop", "netsh wlan show profile key=clear", "wifi password qr code windows 11"],
      answer: "Open Settings > Network & internet > Wi-Fi > Manage known networks, click the network and click Show (older builds say View) next to the Wi-Fi password. It works for any network the PC has joined before, and it also gives you a QR code a phone can scan.",
      faq: [
        { q: "There's no Show or View button. What now?", a: "Your Windows 11 build is older. Press Windows + R, type ncpa.cpl, double-click the Wi-Fi adapter, click Wireless Properties, open the Security tab and tick Show characters. Or run Windows Update and check again." },
        { q: "Can I see the password for a network I'm not connected to right now?", a: "Yes, as long as the PC joined it at some point. Every saved network is in Manage known networks. In Terminal, netsh wlan show profiles lists them too." },
        { q: "Why does it ask for my PIN?", a: "Showing a saved password needs you to confirm it's you. Use the same PIN or password you sign in to Windows with. On a work laptop you may need admin rights." },
        { q: "Why is there no password for my work or school network?", a: "Those networks usually sign you in with your account instead of one shared password, so there's nothing to show." },
        { q: "Does this work on Windows 10?", a: "Not in Settings. On Windows 10 use the ncpa.cpl route above, or the netsh command in Command Prompt." },
      ],
      useWhen: "Use it when a guest needs the Wi-Fi, a new phone or TV wants the password, or you're setting up a printer and the sticker on the router is long gone.",
      notFor: "It only shows networks this PC has already joined. If no device in the house knows the password, you'll have to look on the router or log in to its admin page.",
      alternatives: [
        { name: "netsh in Terminal", kind: "built-in", pickIt: "You're on an older build without the button, or you want every saved password at once. Run netsh wlan show profile name=\"NetworkName\" key=clear and read the Key Content line.", pickThis: "You just want one password without typing commands." },
        { name: "The router sticker or admin page", kind: "manual", pickIt: "No computer or phone in the house has joined the network yet, or someone changed the password and nobody wrote it down.", pickThis: "Any PC on the network is within reach. It's quicker than finding the router." },
      ],
    },
    steps: [
      "Press Windows + I to open Settings, then click Network & internet.",
      "Click Wi-Fi, then Manage known networks.",
      "Click the network you want.",
      "Next to the Wi-Fi password, click Show (on some builds the line is called View Wi-Fi security key, with a View button). Confirm with your PIN if it asks.",
      "The password appears with a QR code. A phone can scan the code and join without typing anything.",
    ],
    body: [
      "My sister came over with a new tablet and we spent ten minutes looking for the router. The laptop on the table had been on that Wi-Fi for two years. Settings showed the password in three clicks.",
      "The QR code is the bit people miss. Point a phone camera at the laptop screen and it joins straight away, which is handy when the password is a long string of random letters.",
      "If the button isn't there, your build is older. The ncpa.cpl route in the FAQ still works on every version of Windows 10 and 11.",
    ],
    pick: true,
    video: {
      hook: "Still flipping the router over to find the Wi-Fi password?",
      hookLabel: "STOP DOING THIS",
      coverLine: "Your laptop knows the password",
      lines: ["Ask your laptop instead.", "Open Settings, then Network and internet.", "Click Wi-Fi, then Manage known networks.", "Pick your network and click Show."],
      cta: "One tech tip a day at techtipaday.com",
      hookVisual: { type: "laptop", action: "wifikey", mode: "ask" },
      doThis: "Your laptop already knows it.",
      doVisual: { type: "laptop", action: "wifikey", mode: "saved" },
      steps: [
        { say: "Open Settings, then Network and internet.", visual: { type: "laptop", action: "settings", app: "Settings", path: ["Settings"], rows: ["System", "Bluetooth & devices", "Network & internet", "Personalization"], tap: "Network & internet" } },
        { say: "Click Wi-Fi, then Manage known networks.", visual: { type: "laptop", action: "settings", app: "Settings", path: ["Network & internet", "Wi-Fi"], rows: ["Show available networks", "Manage known networks", "Hardware properties", "Random hardware addresses"], tap: "Manage known networks" } },
        { say: "Pick your network and click Show.", visual: { type: "laptop", action: "wifikey", mode: "show" } },
      ],
      result: { say: "There's the password, plus a QR code your friend can scan.", headline: "Password found", before: "••••••••••", after: "sunflower42" },
    },
  },
  {
    n: 90,
    slug: "how-to-see-which-apps-drain-your-battery-on-iphone",
    date: "2026-11-01",
    title: "How to see which apps drain your battery on iPhone",
    displayName: "Dead by lunch? Your iPhone knows which app did it",
    summary: "Settings > Battery lists every app by how much battery it used. Find the one at the top, then stop it running in the background.",
    category: "iphone",
    platforms: ["iphone"],
    devices: ["iPhone on iOS 18 and iOS 26"],
    difficulty: "Easy",
    minutes: 2,
    why: "One app usually does most of the damage, and it's often one you weren't even looking at. The list tells you which, so you fix that one instead of dimming everything.",
    intents: ["save-battery"],
    seo: {
      searchPhrase: "how to see which apps drain your battery on iphone",
      searchAlternates: ["iphone battery draining fast", "what is draining my iphone battery", "iphone battery usage by app", "iphone battery dies by lunch", "background app refresh battery"],
      answer: "Open Settings > Battery and scroll down to the list of apps. It's sorted by how much battery each one used, and tapping an app shows how much of that was on screen and how much in the background. If the top app mostly runs in the background, turn it off in Settings > General > Background App Refresh.",
      faq: [
        { q: "The list is empty. Why?", a: "The phone needs a few hours of use after a restart or a full charge before it has anything to show. Check again later in the day." },
        { q: "What does Background Activity mean?", a: "The app was working while you weren't looking at it: refreshing a feed, syncing, or using your location. That's the part you can usually switch off without losing anything." },
        { q: "Should I turn off Background App Refresh for everything?", a: "No. Leave it on for messaging and anything you want up to date when you open it. Turn it off for the one or two apps at the top of the battery list." },
        { q: "The top app is one I really use. Now what?", a: "Then the drain is probably just screen time. Check Location Services for that app and set it to While Using the App instead of Always." },
        { q: "Is it my battery that's worn out instead?", a: "Look at Settings > Battery > Battery Health. If Maximum Capacity is under about 80%, the battery itself is part of the problem." },
      ],
      useWhen: "Use it when the phone is suddenly flat by the afternoon and you haven't changed how you use it, usually after installing something new or an app update.",
      notFor: "It won't fix a worn-out battery. If Battery Health shows a low Maximum Capacity, the list just tells you where the little you have left is going.",
      alternatives: [
        { name: "Low Power Mode", kind: "built-in", pickIt: "You need the phone to last until you get home, right now, and don't care which app is to blame.", pickThis: "It keeps happening every day and you want to stop the cause." },
        { name: "Location Services per app", kind: "built-in", pickIt: "The top app is a map, weather or shopping app set to Always. Switching it to While Using the App is often the whole fix.", pickThis: "You don't know which app it is yet." },
      ],
    },
    steps: [
      "Open Settings and tap Battery.",
      "Scroll down past the chart to the list of apps. It's sorted by how much battery each app used.",
      "Look at more than one day (Last 10 Days, or the earlier days in the chart) to see if the same app keeps coming top.",
      "Tap the app, or Show Activity, to see how much was on screen and how much was in the background.",
      "If most of it was in the background, go to Settings > General > Background App Refresh and turn that app off.",
    ],
    body: [
      "My phone started dying by mid-afternoon after a week of nothing different. The battery list had a coupon app I'd opened twice sitting at the top, almost all of it background activity. Background App Refresh off for that one app, and the phone made it to bedtime again.",
      "The percentages are shares of what was used, not of a full battery. An app at 40% used 40% of whatever went that day.",
      "Check it again a day after the change. If a different app jumps to the top, it's usually a messaging or maps app you actually use, and that's fine.",
    ],
    pick: true,
    video: {
      hook: "Your iPhone's at 20 percent by lunch and you barely touched it?",
      coverLine: "What's killing your battery",
      lines: ["Check the battery list.", "Open Settings, then Battery.", "Scroll to the apps. The top one is your drain.", "Turn off its Background App Refresh."],
      cta: "One tech tip a day at techtipaday.com",
      hookVisual: { type: "phone-settings", mode: "battery", path: [], rows: [] },
      doThis: "Check the battery list in Settings.",
      doVisual: { type: "phone-settings", mode: "battery", path: [], rows: [], reveal: "list" },
      steps: [
        { say: "Open Settings, then Battery.", visual: { type: "phone-settings", path: ["Settings"], rows: ["Notifications", "Sounds & Haptics", "Battery", "Privacy & Security"], tap: "Battery" } },
        { say: "Scroll to the apps. The top one is your drain.", visual: { type: "phone-settings", mode: "battery", path: [], rows: [], reveal: "list" } },
        { say: "Turn off its Background App Refresh.", visual: { type: "phone-settings", path: ["General", "Background App Refresh"], rows: ["Maps", "Messages", "Scrollr", "Weather"], tap: "Scrollr", toggle: true, toggleOff: true } },
      ],
      result: { say: "Now it stops eating battery while it sits in your pocket.", headline: "Drain found", before: "20% by lunch", after: "Lasts till bedtime" },
    },
  },
  {
    n: 91,
    slug: "how-to-see-your-wifi-password-on-a-mac",
    date: "2026-11-02",
    title: "How to see your Wi-Fi password on a Mac",
    displayName: "Guest needs the Wi-Fi? Your Mac remembers the password",
    summary: "On macOS Sequoia and later, the Passwords app has a Wi-Fi section with every network your Mac has joined, the password, and a QR code a phone can scan.",
    category: "mac",
    platforms: ["mac"],
    devices: ["Mac on macOS Sequoia 15 or later", "older macOS path noted in the FAQ"],
    difficulty: "Easy",
    minutes: 1,
    why: "If the Mac has ever joined the network, the password is saved on it. Reading it off the screen beats hunting for the router sticker.",
    intents: ["find-wifi-password"],
    seo: {
      searchPhrase: "how to see your wifi password on a mac",
      searchAlternates: ["find wifi password mac", "mac show saved wifi password", "passwords app wifi", "wifi password qr code mac", "keychain wifi password", "forgot wifi password macbook"],
      answer: "Open the Passwords app (macOS Sequoia or later), unlock it with Touch ID or your login password, and click Wi-Fi in the sidebar. Pick the network and the password is there, with Show Network QR Code for a guest's phone.",
      faq: [
        { q: "There's no Passwords app on my Mac.", a: "You're on macOS Sonoma or older. Open System Settings > Wi-Fi, click Advanced, click the ... button next to the network and choose Copy Password. Or open Keychain Access, search for the network name and tick Show password." },
        { q: "Why does it ask for my password first?", a: "Saved passwords are locked until you prove it's you. Use Touch ID or the password you log in to the Mac with." },
        { q: "Can I see networks I'm not connected to right now?", a: "Yes. The Wi-Fi section lists every network the Mac has joined and still remembers, not just the current one." },
        { q: "Can a guest join without me reading it out?", a: "Click Show Network QR Code and let them point their phone camera at the screen. iPhones and most Android phones join straight from the code." },
        { q: "Why is there no password for my work network?", a: "Work and school networks usually sign you in with your own account, so there's no shared password to show." },
      ],
      useWhen: "Use it when a guest asks for the Wi-Fi, a new TV or printer wants the password, or you're setting up a phone and nobody remembers what it was.",
      notFor: "It only knows networks this Mac has joined. If no device in the house has the password saved, you need the router sticker or its admin page.",
      alternatives: [
        { name: "System Settings > Wi-Fi > Advanced", kind: "built-in", pickIt: "You're on macOS Sonoma or Ventura, or you just want to copy the password into a message.", pickThis: "You want to see it, or show a QR code to someone in the room." },
        { name: "Keychain Access", kind: "built-in", pickIt: "You're on an older macOS and the Advanced menu has no Copy Password option.", pickThis: "You're on Sequoia or later. Passwords is quicker and shows a QR code." },
      ],
    },
    steps: [
      "Open the Passwords app. Press Command + Space, type Passwords and press Return.",
      "Unlock it with Touch ID or your Mac login password.",
      "Click Wi-Fi in the sidebar.",
      "Click the network you want. Hover over the password field or click it to see the password.",
      "Click Show Network QR Code if a guest wants to scan it instead of typing.",
    ],
    body: [
      "Friends came round and the password on the router sticker had been changed years ago. The MacBook on the shelf had been on that network the whole time. Passwords, Wi-Fi, done in under a minute.",
      "The QR code is the bit worth remembering. Long router passwords are a pain to type on a TV remote or a phone, and the code skips all of that.",
      "If your Mac is on an older macOS, the Copy Password route in the FAQ does the same job, it just doesn't show you a code.",
    ],
    pick: true,
    video: {
      hook: "Your Mac remembers every Wi-Fi password you've ever typed.",
      hookLabel: "HIDDEN SETTING",
      coverLine: "Your Mac knows the password",
      lines: ["Open the Passwords app.", "Click Wi-Fi in the sidebar.", "Pick your network.", "Show the QR code and let them scan it."],
      cta: "One tech tip a day at techtipaday.com",
      hookVisual: { type: "laptop", action: "macwifi", mode: "ask" },
      doThis: "Open the Passwords app.",
      doVisual: { type: "laptop", action: "macwifi", mode: "app" },
      steps: [
        { say: "Click Wi-Fi in the sidebar.", visual: { type: "laptop", action: "macwifi", mode: "app" } },
        { say: "Pick your network. The password's right there.", visual: { type: "laptop", action: "macwifi", mode: "show" } },
        { say: "Or show the QR code and let them scan it.", visual: { type: "laptop", action: "macwifi", mode: "show" } },
      ],
      result: { say: "Your guest scans it and they're on. No router sticker.", headline: "Guest is online", before: "Wrong password", after: "Scanned, connected" },
    },
  },
  {
    n: 92,
    slug: "how-to-turn-off-keyboard-vibration-on-android",
    date: "2026-11-03",
    title: "How to turn off keyboard vibration on Android",
    displayName: "Phone buzzes on every letter? Switch it off in Gboard",
    summary: "Gboard buzzes on every key press by default on a lot of phones. One switch in Gboard's Preferences turns it off, and the one next to it kills the click sound too.",
    category: "android",
    platforms: ["android"],
    devices: ["Android phones with Gboard (Pixel and most others)", "Samsung Keyboard path noted in the FAQ"],
    difficulty: "Easy",
    minutes: 1,
    why: "A buzz on every letter adds up: it's noisy in a quiet room, it's annoying in bed, and it uses a little battery for nothing.",
    seo: {
      searchPhrase: "how to turn off keyboard vibration on android",
      searchAlternates: ["gboard vibration off", "stop keyboard vibrating android", "turn off haptic feedback keyboard", "android keyboard sound off", "phone vibrates when typing"],
      answer: "Open Gboard's settings (the gear in the keyboard's top row, or Settings > System > Keyboard > On-screen keyboard > Gboard), tap Preferences and turn off Haptic feedback on keypress. Turn off Sound on keypress on the same screen if it clicks too.",
      faq: [
        { q: "I use Samsung Keyboard, not Gboard.", a: "Open Settings > General management > Samsung Keyboard settings > Swipe, touch, and feedback > Touch feedback, and turn off Vibration (and Sound if you want)." },
        { q: "It still vibrates after I turned it off.", a: "Some phones also have a system switch. Look in Settings > Sound & vibration > Vibration & haptics for a keyboard or touch feedback option and turn that off too." },
        { q: "Can I keep a lighter buzz instead of none?", a: "Yes. In Gboard's Preferences, leave haptic feedback on and lower Vibration strength on keypress if your phone shows that slider." },
        { q: "Does this stop all vibration on the phone?", a: "No. Calls, alarms and notifications still vibrate. This only changes the keyboard." },
      ],
      useWhen: "Use it when the buzz on every letter bugs you, when you type in bed next to someone, or when you just want the phone quieter.",
      notFor: "It won't change notification or call vibration. Those live under Settings > Sound & vibration.",
      alternatives: [
        { name: "Lower vibration strength", kind: "built-in", pickIt: "You like a bit of feedback, just not the hard buzz.", pickThis: "You want it gone completely." },
        { name: "Samsung Keyboard settings", kind: "built-in", pickIt: "Your Samsung phone uses Samsung Keyboard instead of Gboard.", pickThis: "You type with Gboard, which most Android phones use." },
      ],
    },
    steps: [
      "With the keyboard open, tap the gear icon in its top row. Or go to Settings > System > Keyboard > On-screen keyboard > Gboard.",
      "Tap Preferences.",
      "Scroll to Key press and turn off Haptic feedback on keypress.",
      "Turn off Sound on keypress on the same screen if the keyboard clicks as well.",
    ],
    body: [
      "My partner pointed out that my phone buzzed like a wasp every time I replied to a message in bed. One switch in Gboard and it types silently now.",
      "If the gear isn't in the keyboard's top row, tap the four squares icon first, or long-press the comma key on some versions.",
      "Turning the buzz off doesn't affect calls or notifications, only typing.",
    ],
    pick: true,
    video: {
      hook: "Your phone buzzes on every single letter you type?",
      coverLine: "Stop the buzz on every letter",
      lines: ["Turn off keypress haptics.", "Open Gboard settings, then Preferences.", "Turn off Haptic feedback on keypress.", "Turn off the keypress sound too."],
      cta: "One tech tip a day at techtipaday.com",
      hookVisual: { type: "phone-settings", mode: "keyfeel", path: [], rows: [], caller: "bzz" },
      doThis: "Switch off the keyboard buzz.",
      doVisual: { type: "phone-settings", mode: "keyfeel", path: [], rows: [], caller: "bzz", reveal: "quiet" },
      steps: [
        { say: "Open Gboard settings, then Preferences.", visual: { type: "phone-settings", path: ["Gboard", "Settings"], rows: ["Languages", "Preferences", "Theme", "Text correction"], tap: "Preferences" } },
        { say: "Turn off Haptic feedback on keypress.", visual: { type: "phone-settings", path: ["Gboard", "Preferences"], rows: ["Sound on keypress", "Haptic feedback on keypress", "Popup on keypress"], tap: "Haptic feedback on keypress", toggle: true, toggleOff: true } },
        { say: "Turn off the keypress sound too.", visual: { type: "phone-settings", path: ["Gboard", "Preferences"], rows: ["Sound on keypress", "Haptic feedback on keypress", "Popup on keypress"], tap: "Sound on keypress", toggle: true, toggleOff: true } },
      ],
      result: { say: "Now you can text in bed without buzzing like a wasp.", headline: "Silent typing", before: "Bzz bzz bzz", after: "Not a sound" },
    },
  },
  {
    n: 93,
    slug: "how-to-free-up-storage-on-android",
    date: "2026-11-04",
    title: "How to free up storage on Android",
    displayName: "Storage full again? Android already knows what to delete",
    summary: "Files by Google has a Clean tab that finds junk files, duplicates, old screenshots and big videos. Most phones get several gigabytes back without touching photos you care about.",
    category: "android",
    platforms: ["android"],
    devices: ["Android phones with Files by Google (preinstalled on Pixel and many others)"],
    difficulty: "Easy",
    minutes: 5,
    why: "A full phone stops taking photos, stops updating apps and gets slow. The space is usually taken by stuff you'd never miss.",
    intents: ["free-up-storage"],
    seo: {
      searchPhrase: "how to free up storage on android",
      searchAlternates: ["android storage full", "storage space running out android", "clear space on android phone", "files by google clean", "delete junk files android", "android phone storage almost full"],
      answer: "Open Files by Google and tap Clean. Clear the junk files card first, then go through the suggestions for duplicate files, old screenshots, large files and downloads. If Google Photos backs up your pictures, its Free up space option removes the copies already safe in the cloud.",
      faq: [
        { q: "I don't have Files by Google.", a: "Install it free from the Play Store, or use Settings > Storage, which shows what's taking space and links to the same cleaning tools on many phones. Samsung phones have Settings > Device care > Storage." },
        { q: "Will cleaning junk files delete my photos or messages?", a: "No. Junk files are temporary app files and caches that apps rebuild when needed. Photos, chats and documents aren't in that card." },
        { q: "Is Google Photos Free up space safe?", a: "It only deletes photos and videos that are already backed up to your Google account. They stay in Google Photos, you just don't keep a second copy on the phone." },
        { q: "One app is using gigabytes. What can I do?", a: "Open Settings > Apps, pick the app, tap Storage & cache and tap Clear cache. Messaging apps also have their own storage manager for big videos people sent you." },
        { q: "How much space should I keep free?", a: "Try to keep at least 10% free. Below that, updates fail and the phone tends to slow down." },
      ],
      useWhen: "Use it when the phone says storage is running out, the camera won't save, or an app update fails for lack of space.",
      notFor: "It won't make a 32 GB phone feel like a 256 GB one. If you're still full after cleaning, move photos to the cloud or a computer.",
      alternatives: [
        { name: "Google Photos Free up space", kind: "built-in", pickIt: "Most of your storage is photos and videos and they're already backed up.", pickThis: "You want the quick win first: junk, duplicates and old downloads." },
        { name: "Clear one app's cache", kind: "built-in", pickIt: "A single app (often a messenger or a streaming app) is sitting on gigabytes.", pickThis: "The space is spread across lots of little things." },
      ],
    },
    steps: [
      "Open the Files by Google app. On a Pixel, Settings > Storage > Free up space opens it too.",
      "Tap Clean at the bottom.",
      "On the Junk files card, tap Clean and confirm.",
      "Go through the other cards: duplicate files, old screenshots, large files, downloaded files. Tick what you don't need and tap Move to trash.",
      "Empty the trash in Files (or wait 30 days) to get the space back for good.",
    ],
    body: [
      "My phone refused to take a photo at a birthday because storage was full. Files by Google found 3 GB of junk, a pile of duplicate memes from group chats and two years of screenshots. 8 GB back in five minutes, no photos lost.",
      "Deleted files go to Trash first, so you can get something back if you deleted it by mistake. The space comes back when the trash is emptied.",
      "Do it again every couple of months. Group chats quietly fill the phone with videos you watched once.",
    ],
    pick: true,
    video: {
      hook: "Storage full again and you've barely got any apps?",
      coverLine: "Your phone is full of junk",
      lines: ["Let Files by Google clean it.", "Open Files by Google, then tap Clean.", "Clean the junk files card.", "Bin the duplicates and old screenshots."],
      cta: "One tech tip a day at techtipaday.com",
      hookVisual: { type: "phone-settings", mode: "storage", path: [], rows: [] },
      doThis: "Let Files by Google clean it.",
      doVisual: { type: "phone-settings", mode: "storage", path: [], rows: [], reveal: "freed" },
      steps: [
        { say: "Open Files by Google, then tap Clean.", visual: { type: "phone-settings", path: ["Files by Google"], rows: ["Browse", "Clean", "Share"], tap: "Clean" } },
        { say: "Clean the junk files card.", visual: { type: "phone-settings", path: ["Files", "Clean"], rows: ["Junk files  3.1 GB", "Duplicate files  2.6 GB", "Old screenshots  2.7 GB", "Large files"], tap: "Junk files  3.1 GB" } },
        { say: "Bin the duplicates and old screenshots.", visual: { type: "phone-settings", mode: "storage", path: [], rows: [], reveal: "freed" } },
      ],
      result: { say: "Gigabytes back, and not one photo you care about gone.", headline: "8 GB back", before: "Storage 97% full", after: "61%, camera works" },
    },
  },
  {
    n: 94,
    slug: "how-to-turn-off-keyboard-clicks-on-iphone",
    date: "2026-11-05",
    title: "How to turn off keyboard clicks on iPhone",
    displayName: "That tick-tick-tick when you type? Turn it off",
    summary: "Settings > Sounds & Haptics > Keyboard Feedback. Turn off Sound and the iPhone keyboard stops clicking, even with the ringer on.",
    category: "iphone",
    platforms: ["iphone"],
    devices: ["iPhone on iOS 18 and iOS 26"],
    difficulty: "Easy",
    minutes: 1,
    why: "The click is fine alone and maddening on a train, in a meeting or next to someone sleeping. You can keep the ringer on and still type quietly.",
    seo: {
      searchPhrase: "how to turn off keyboard clicks on iphone",
      searchAlternates: ["iphone keyboard sound off", "turn off typing sound iphone", "iphone keyboard clicking noise", "keyboard feedback iphone", "iphone keyboard haptic"],
      answer: "Open Settings > Sounds & Haptics > Keyboard Feedback and turn off Sound. If you'd like a tap you can feel instead, turn on Haptic on the same screen.",
      faq: [
        { q: "Does the silent switch stop the clicks too?", a: "Yes. With the phone on silent (the switch or the Action button), the keyboard doesn't click. The setting lets you keep the ringer on and still type quietly." },
        { q: "What does Haptic do?", a: "It gives a tiny tap you feel under your thumb for each key, with no sound. Some people find it makes typing feel more accurate." },
        { q: "Does Haptic drain the battery?", a: "A little. Apple says keyboard haptics can affect battery life, so leave it off if you're squeezing out every percent." },
        { q: "I turned Sound off and it still clicks in one app.", a: "Some apps and third-party keyboards have their own sound setting. Check the keyboard app's settings." },
      ],
      useWhen: "Use it when you type in quiet places, share a room at night, or just find the ticking annoying.",
      notFor: "It doesn't silence the lock sound or notifications. The lock sound has its own switch on the same Sounds & Haptics screen.",
      alternatives: [
        { name: "Silent mode", kind: "built-in", pickIt: "You want everything quiet for a while, calls and notifications included.", pickThis: "You want calls to ring but typing to be silent." },
        { name: "Keyboard Haptic only", kind: "built-in", pickIt: "You miss the feedback once the sound is gone.", pickThis: "You want no feedback at all." },
      ],
    },
    steps: [
      "Open Settings and tap Sounds & Haptics.",
      "Tap Keyboard Feedback.",
      "Turn off Sound.",
      "Turn on Haptic if you want a silent tap you can feel for each key, or leave it off.",
      "While you're on Sounds & Haptics, Lock Sound is the switch for the click when you lock the phone.",
    ],
    body: [
      "I didn't notice the ticking until someone on a quiet train turned round. The ringer has to stay on for work calls, so silent mode wasn't an option. Keyboard Feedback, Sound off, done.",
      "Haptic is worth trying. You feel each key without anyone else hearing it.",
      "Third-party keyboards like Gboard ignore this switch and have their own sound setting.",
    ],
    pick: true,
    video: {
      hook: "Your iPhone ticks on every letter and the whole train hears?",
      coverLine: "Kill the keyboard clicks",
      lines: ["Turn off keyboard sound.", "Open Settings, then Sounds and Haptics.", "Tap Keyboard Feedback.", "Turn off Sound."],
      cta: "One tech tip a day at techtipaday.com",
      hookVisual: { type: "phone-settings", mode: "keyfeel", path: [], rows: [], caller: "tick" },
      doThis: "Turn off the keyboard sound.",
      doVisual: { type: "phone-settings", mode: "keyfeel", path: [], rows: [], caller: "tick", reveal: "quiet" },
      steps: [
        { say: "Open Settings, then Sounds and Haptics.", visual: { type: "phone-settings", path: ["Settings"], rows: ["Notifications", "Sounds & Haptics", "Focus", "Screen Time"], tap: "Sounds & Haptics" } },
        { say: "Tap Keyboard Feedback.", visual: { type: "phone-settings", path: ["Settings", "Sounds & Haptics"], rows: ["Ringtone", "Text Tone", "Keyboard Feedback", "Lock Sound"], tap: "Keyboard Feedback" } },
        { say: "Turn off Sound.", visual: { type: "phone-settings", path: ["Sounds & Haptics", "Keyboard Feedback"], rows: ["Sound", "Haptic"], tap: "Sound", toggle: true, toggleOff: true } },
      ],
      result: { say: "Ringer still on, typing completely silent.", headline: "No more ticking", before: "Tick tick tick", after: "Silent typing" },
    },
  },
  {
    n: 95,
    slug: "how-to-limit-charging-to-80-percent-on-android",
    date: "2026-11-06",
    title: "How to limit charging to 80 percent on Android",
    displayName: "Your Android can stop at 80% to save the battery",
    summary: "Pixel and Samsung phones can stop charging at 80%, which keeps the battery healthier over the years. Pixel: Settings > Battery > Charging optimization. Samsung: Settings > Battery > Battery protection.",
    category: "android",
    platforms: ["android"],
    devices: ["Pixel phones on Android 15 and 16", "Samsung Galaxy on One UI 6.1 or later"],
    difficulty: "Easy",
    minutes: 1,
    why: "Sitting at 100% on the charger all night wears a battery faster. Stopping at 80% means the phone still lasts the day and the battery lasts more years.",
    seo: {
      searchPhrase: "how to limit charging to 80 percent on android",
      searchAlternates: ["android 80 percent charge limit", "pixel limit to 80", "samsung battery protection 80", "stop charging at 80 android", "android battery health charging", "adaptive charging pixel"],
      answer: "On a Pixel, open Settings > Battery > Charging optimization and choose Limit to 80%. On a Samsung, open Settings > Battery > Battery protection (under More battery settings on some versions) and pick Maximum, which stops at 80%.",
      faq: [
        { q: "I don't see Charging optimization on my Pixel.", a: "It arrived with Android 15. On older versions, Adaptive Charging under Settings > Battery holds the phone at 80% overnight and finishes just before your alarm." },
        { q: "Can I charge to 100% for a long day?", a: "Yes. Switch the limit off before you plug in, or choose Adaptive (Pixel) or Basic/Adaptive (Samsung) for that night, then switch it back." },
        { q: "Will I notice less battery during the day?", a: "You start with 20% less, so on a heavy day you might. Most people get through the day fine on 80%." },
        { q: "Is this the same as the iPhone 80% limit?", a: "Same idea. iPhones have it under Settings > Battery > Charging." },
        { q: "My phone isn't a Pixel or a Samsung.", a: "Search Settings for 'battery protection' or 'charging'. OnePlus, Xiaomi and others have their own version, sometimes called Smart charging." },
      ],
      useWhen: "Use it if you charge overnight or keep the phone plugged in at a desk, and you plan to keep the phone for a few years.",
      notFor: "It won't bring back capacity a battery has already lost. It slows the wear from here on.",
      alternatives: [
        { name: "Adaptive Charging", kind: "built-in", pickIt: "You want 100% in the morning but don't want the phone sitting full all night.", pickThis: "You're fine starting the day on 80% for the healthiest battery." },
        { name: "Unplug at 80% yourself", kind: "manual", pickIt: "Your phone has no limit option.", pickThis: "Your phone has the setting. It never forgets." },
      ],
    },
    steps: [
      "On a Pixel, open Settings > Battery > Charging optimization.",
      "Choose Limit to 80%.",
      "On a Samsung, open Settings > Battery > Battery protection (on some versions it's under More battery settings) and choose Maximum.",
      "Plug in as usual. The phone stops at 80% and shows that charging is limited.",
    ],
    body: [
      "My last phone's battery was worn out in two years from charging to 100% every night. This one stops at 80% and I've never once run out during the day.",
      "If you have a long day or a flight coming, switch the limit off the night before and charge to full. Put it back the next day.",
      "The setting names move around between Android versions, so if the path doesn't match, search Settings for 'charging'.",
    ],
    pick: true,
    video: {
      hook: "Your Android has the same battery-saving trick as the iPhone.",
      hookLabel: "HIDDEN SETTING",
      coverLine: "Your Android can stop at 80",
      lines: ["Limit charging to 80 percent.", "Open Settings, then Battery.", "Tap Charging optimization.", "Choose Limit to 80 percent."],
      cta: "One tech tip a day at techtipaday.com",
      hookVisual: { type: "phone-settings", mode: "charge", path: ["Pixel · plugged in all night"], rows: [] },
      doThis: "Limit charging to 80 percent.",
      doVisual: { type: "phone-settings", mode: "charge", path: ["Pixel · plugged in all night"], rows: [], reveal: "limit", note: "Charging limited to 80%" },
      steps: [
        { say: "Open Settings, then Battery.", visual: { type: "phone-settings", path: ["Settings"], rows: ["Network & internet", "Battery", "Storage", "Display"], tap: "Battery" } },
        { say: "Tap Charging optimization.", visual: { type: "phone-settings", path: ["Settings", "Battery"], rows: ["Battery usage", "Battery Saver", "Charging optimization", "Battery health"], tap: "Charging optimization" } },
        { say: "Choose Limit to 80 percent.", visual: { type: "phone-settings", path: ["Battery", "Charging optimization"], rows: ["Adaptive Charging", "Limit to 80%"], tap: "Limit to 80%" } },
      ],
      result: { say: "It still lasts the day, and the battery wears out a lot slower.", headline: "Battery saved", before: "100% all night", after: "Stops at 80%" },
    },
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
