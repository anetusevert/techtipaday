# There's An AI For That: what to take, and what to leave

Reviewed October 16, 2026, against [theresanaiforthat.com](https://theresanaiforthat.com/) and the owner's traffic notes (about 60% of visits from search, 32% direct). The look is not the asset. The machinery is.

## What works, and why

**Search is the front door.** A site with that search share is not really browsed into existence. People arrive on the exact job they typed. TAAFT answers with a predictable URL: `/task/[job]/`, titles like "Top AI Tasks | There's an AI for That", and an alphabetical index of roughly 11,000 tasks. Each task page is a long-tail landing page, not a blog post that happens to mention the topic. That is why the library ranks: one URL per job, internal links in every direction, and a title that matches the query.

**The homepage is a freshness feed.** The front page is a reverse-chronological river. Rows carry a time ("18m", "1h"), a name, and a one-line job. Return visits make sense because the top of the page is different tomorrow. Relative times and "latest" sorts are the habit. The daily newsletter (about 2.5 million subscribers) turns that habit into the 32% direct bucket: the email is the reminder, the site is the archive.

**Internal links are the product graph.** Tools point at tasks, tasks point at tools, related tasks sit on the page, and the alphabetical index makes the long tail crawlable. A visit to one page exposes more URLs than a visitor asked for. Eleven thousand task pages only work because they are wired together and because most of them have something real to list (the alphabetical index shows the count next to the task).

**URL and title patterns are guessable.** `/tasks/`, `/alphabetical/`, `/task/[slug]/`. Titles lead with the job, then the brand. People and crawlers can predict the next URL.

**Proof sits next to the item.** Saves, comments, and pricing are on the row, not in a testimonial carousel. The useful part is specificity: a number tied to a thing you can open. The useless part is inflation.

## What we skip

- The visual language: ads, pricing badges, sponsor rows, comment chrome, and a feed so dense it feels like a marketplace. TechTipADay should read like a publication.
- Any number we did not count. No save counts, view counts, star ratings, subscriber totals, or testimonials. "New today" and "added this week" are allowed only as counts of tips whose publication dates say so.
- Thin doorway pages. TAAFT can host 11,000 tasks because the inventory is real. A landing page here exists only when at least one live tip matches, and it 404s until that day. The registry is what scales, not a pile of empty URLs.
- Relative-only timestamps. We print the calendar date.
- Marketplace mechanics (follows, pricing, freemium labels). They do not belong on a settings tip.

## What we applied

- Homepage: today's tip, then a dated, scannable river. Real counters: new today, added in the last 7 days, archive size, consecutive days.
- Search in the header on every page, server-rendered, plus filters for platform, difficulty, and new/popular. Popular is an editor's shortlist, labeled as such.
- Landing pages generated from the library, ready to grow past 300 by adding data rather than routes:
  - device: `/iphone`, `/android`, `/mac`, `/windows`, `/chrome`
  - problem: `/fix/[task]`, including grouped hubs such as `/fix/wifi-slow`
  - app: `/apps/[app]`, for example `/apps/chatgpt`
  - topic: `/categories/[topic]`
- Each landing has its own title, H1, and intro, lists only live matching tips, and links to related landings, the cheat sheet, and the tips.
- Tip pages link out to the device, the task, the app, related tips, and the previous and next day.
- Newsletter capture is prominent and pitched as "Get tomorrow's tip a day early." There is no `/api/subscribe` and no Railway volume in this app, so the form does not collect addresses. It says so.
- One printable HTML cheat sheet per category, at `/sheets/[category]`, linked from the hub.
- Title pattern: the job first, brand in the template (`How to use Back Tap on iPhone | TechTipADay`).
