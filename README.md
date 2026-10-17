# TechTipADay

One phone, AI-tool or everyday tech tip a day. Next.js on Railway.

- Tips live in `lib/tips.ts` (the original seven) and `lib/catalog-a.ts` / `lib/catalog-b.ts` (the back-dated archive). A tip is a `date` in Europe/Berlin. That date is its publishedAt. Future dates 404 until the day.
- Long-tail pages are data, not new route files. Each tip page is built around one search phrase (`seo.searchPhrase`). Task hubs (`/how-to/[slug]`) and apps are declared in `lib/landings.ts`, comparisons (`/compare/[a]-vs-[b]`) and alternatives pages (`/alternatives/[slug]`) in `lib/compare.ts`. Device hubs are `/iphone`, `/android`, `/mac`, `/windows`, `/chrome`. Add a landing by adding data. It is published only when a matching tip is live, so the set can grow past 300 pages without empty URLs.
- Printable cheat sheets: `/sheets/[category]`.
- SEO: see [docs/SEO.md](docs/SEO.md). Per-tip HowTo/FAQPage/Article/Breadcrumb JSON-LD, CollectionPage/ItemList/FAQPage on task hubs, sitemap, robots, `/llms.txt`, `/llms-full.txt`, IndexNow. Check a deploy with `npm run verify`.
- `/api/mcp`: read-only MCP server.
- Newsletter: Beehiiv free plan (`https://techtipaday.beehiiv.com`). The form is the embed plus a GET to `/subscribe?email=`, opened in a new tab. There is no subscribe API.
- Video template: `video/` (Remotion, 9:16). Leave it alone when changing the site.
