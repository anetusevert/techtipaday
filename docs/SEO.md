# SEO on TechTipADay

This is how the site gets found, both in search and by AI assistants. The layout follows oneagentaday (commit d144c58) so both sites work the same way. The reference for page structure is theresanaiforthat.com (see `docs/taaft-review.md`).

The canonical host is **https://www.techtipaday.com**. `techtipaday.com` 301s to www at Cloudflare. The Railway host and any other host 301 to www in `proxy.ts`. Every canonical, sitemap URL, llms.txt URL and IndexNow URL uses www.

## The three layers

| Layer | URL | Built from | JSON-LD |
| --- | --- | --- | --- |
| Tip pages | `/tips/<slug>` | each tip in `lib/tips.ts`, `lib/catalog-a.ts`, `lib/catalog-b.ts` | HowTo, FAQPage, Article, BreadcrumbList, VideoObject (when the tip has a YouTube Short) |
| Task hubs | `/how-to/<task>`, index `/how-to` | `HUBS` in `lib/landings.ts` + each tip's `intents` | CollectionPage + ItemList, FAQPage, BreadcrumbList |
| Comparisons | `/compare/<a>-vs-<b>`, index `/compare` | `COMPARES` in `lib/compare.ts` (kind `vs` or `built-in-vs-app`) | WebPage, ItemList, FAQPage, BreadcrumbList |
| Alternatives | `/alternatives/<slug>` | `COMPARES` with kind `alternatives` | WebPage, ItemList, FAQPage, BreadcrumbList |

Device hubs (`/iphone`, `/android`, `/mac`, `/windows`, `/chrome`), topic pages and app pages stay as they were. App pages with fewer than `MIN_HUB_TIPS` live tips are `noindex` and left out of the sitemap.

Redirects (all 301, in `proxy.ts` via `legacyRedirect` in `lib/tips.ts`):

- `/best` -> `/how-to`, bare `/alternatives` -> `/compare`, `/fix` -> `/how-to`
- `/fix/<hub id>` -> the task hub, `/fix/<old task>` -> the tip
- every old tip slug in `redirectFrom` -> the new tip URL (only once the tip is live)

## One published list

Everything reads from `byNewest()`, which only returns tips whose `date` is on or before today in Europe/Berlin. Tip pages, hubs, comparisons, alternatives, sitemap, llms.txt, llms-full.txt, feeds and MCP all go through it. A future tip 404s and is linked from nowhere. A hub goes live by itself the day its second tip goes live.

## Tip fields

Each tip has an `seo` block. Only `searchPhrase`, `searchAlternates` and `answer` are required. Pages read the block through `seoOf(tip)`, which fills in the rest.

```ts
{
  slug: "how-to-turn-on-clipboard-history-in-windows-11", // = slugify(seo.searchPhrase)
  title: "How to turn on clipboard history in Windows 11",   // the H1 and <title>; reads the same as searchPhrase
  redirectFrom: ["/tips/windows-clipboard-history"],         // old URLs, 301 here
  intents: ["copy-text"],                                     // hub ids from lib/landings.ts; unknown id fails the build
  seo: {
    searchPhrase: "how to turn on clipboard history in windows 11", // lowercase, the exact phrase people type
    searchAlternates: ["windows 11 clipboard history", "win v not working"],
    answer: "Press Windows + V. ...",      // 1-3 sentences, shown first on the page and used in the meta description
    faq: [{ q: "...", a: "..." }],        // optional, up to 5
    useWhen: "...",                       // optional
    notFor: "...",                        // optional
    alternatives: [                       // optional, 0 or 2+
      { name: "Ditto", kind: "tool", pickIt: "...", pickThis: "..." }, // kind: tool | built-in | manual
    ],
    compareWith: ["ditto-vs-windows-clipboard-history"], // COMPARES slugs; unknown slug fails the build
  },
}
```

Fallbacks in `seoOf`:

| Field | Fallback |
| --- | --- |
| `faq` | two generated questions: which devices it works on, and how long it takes |
| `useWhen` | the tip's `why` |
| `notFor` | a note naming the devices it was written for |
| `alternatives` | none (the section is hidden) |
| `compareWith` | none |

Hub FAQ falls back to the first FAQ of up to four of its live tips (`hubFaq`).

## Rules the build enforces

`assertLibrary()` in `lib/tips.ts` runs on load, so a broken entry fails `npm run build`:

- slug = `slugify(searchPhrase)`, the title reads as the search phrase, the phrase is lowercase
- unknown `intents` id or `compareWith` slug fails
- `alternatives` has 0 or 2+ entries; FAQ at most 5
- hub slug = `slugify(searchPhrase)` without a leading `how-to-`
- comparison slugs are `<a>-vs-<b>` with the names in alphabetical order; the title starts with the same order
- an alternatives page has at least `MIN_ALTERNATIVES` (2) options
- every comparison and alternatives page has a written verdict (`answer`) of 2-4 sentences
- a hub is published at `MIN_HUB_TIPS` (2) live tips; aim for 3+

When two tips compare with each other, put `compareWith` in the **newer** tip's file, so the older tip doesn't change on the day the newer one ships.

## Adding pages

- **New tip:** add it to a catalog file with the date it should go live. Pick the exact phrase someone types, then make slug and title from it. Write the answer first, the steps second.
- **New task hub:** add an entry to `HUBS` and list its id in at least two tips' `intents`.
- **New comparison:** add an entry to `COMPARES`. Write real pros and cons, a verdict that picks a side, and say when the built-in option is enough. Leave `affiliateUrl` empty until there is a real partner link; when set, it gets `rel="sponsored"`.
- No thin pages. A hub with one tip, an app page with one tip, or a comparison without a verdict does not ship.

## Copy

Write like a person who uses the thing. Short sentences, real menu names, no "in today's digital world", no stacked keywords. Use the search phrase once in the H1 and let the rest read naturally.

## Discovery

- `/sitemap.xml`: every indexable page, www only. Hubs below the threshold and noindex app pages are left out.
- `/robots.txt`: allows everything and points at the www sitemap and host.
- `/llms.txt`: site map for assistants, with sections **Find by task**, **Comparisons**, **Alternatives** and one line per tip (URL, search phrase, short answer).
- `/llms-full.txt`: every live tip in full, with search phrase, alternates, answer, use-when, steps, FAQ and alternatives.
- IndexNow: `node scripts/indexnow.mjs` sends the whole sitemap. `node scripts/indexnow.mjs /tips/a /how-to/b` or `--file urls.txt` sends a list. The key file is in `public/`.

## Checking a deploy

```
npm run verify                                 # production, every sitemap URL
SITE_URL=http://localhost:3000 npm run verify  # local build
```

It fetches every sitemap URL and checks: 200 with no redirect, www canonical, one H1 that matches the slug, no noindex, JSON-LD parses and has the expected types (FAQPage on tips, hubs, comparisons and alternatives). It follows every `/tips/` link on hub, comparison and alternatives pages and fails on anything that isn't a live 200 in the sitemap, which catches future tips leaking. It also checks robots, the llms.txt sections, llms-full.txt coverage, and a sample of 301s, including the apex and Railway hosts.

## Display name (catchy headline)
Each new tip may set `displayName`: a catchy but clear human headline, e.g. "Closed the wrong tab? One shortcut brings it back".
It shows above the H1 on the tip page and as the card hook. The `title` (title tag + H1), `seo.searchPhrase` and `slug`
keep the plain search wording; never put the display name in those.

## Videos, share images and referrals (30 Oct 2026)

- `lib/videos.ts` maps tip slugs to their public YouTube Short (id, title, views, upload time). It is generated: run `python3 /workspace/techtipaday/launch/sync-shorts.py` after new Shorts publish, then commit. Tip pages with a Short embed it (lazy, youtube-nocookie), add VideoObject JSON-LD, and link Subscribe / TikTok / Instagram.
- Every tip page lists "Most-watched tips" (top live tips by Short views, from `lib/popular.ts`) so the winners get internal links from all pages.
- `app/tips/[slug]/opengraph-image.tsx` renders a per-tip share card (1200x630). Future tips 404 there too.
- `lib/social.ts` holds the public profiles; they appear in the footer (`rel="me"`) and in Organization `sameAs`.
- `proxy.ts` logs one JSON line `{"evt":"referral",...}` per human page view that has an external referer or `?ref=` / `utm_source`. Read them in Railway deploy logs with the filter `referral`. Video descriptions use `?ref=yt` on the "Full steps" link.
- Hub `hidden-phone-settings` (/how-to/hidden-iphone-and-android-settings-worth-turning-on) collects the "hidden setting" winners.
