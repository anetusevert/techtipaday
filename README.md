# TechTipADay

One phone, AI-tool or everyday tech tip a day. Next.js on Railway.

- Tips live in `lib/tips.ts` (the original seven) and `lib/catalog-a.ts` / `lib/catalog-b.ts` (the back-dated archive). A tip is a `date` in Europe/Berlin. That date is its publishedAt. Future dates 404 until the day.
- Long-tail pages are data, not new route files. A tip's `task` becomes `/fix/[slug]`. Group hubs and apps are declared in `lib/landings.ts`. Device hubs are `/iphone`, `/android`, `/mac`, `/windows`, `/chrome`. Add a landing by adding data. It is published only when a matching tip is live, so the set can grow past 300 pages without empty URLs.
- Printable cheat sheets: `/sheets/[category]`.
- SEO: per-tip metadata, HowTo/Article/Breadcrumb JSON-LD, CollectionPage on hubs, sitemap, robots, `/llms.txt`.
- `/api/mcp`: read-only MCP server.
- The newsletter form is intentionally not collecting addresses. There is no subscribe API.
- Video template: `video/` (Remotion, 9:16). Leave it alone when changing the site.
