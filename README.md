# TechTipADay

One phone, AI-tool or everyday tech tip a day. Next.js on Railway.

- Tips live in `lib/tips.ts` (add one object per day).
- SEO: per-tip metadata, HowTo/Article/Breadcrumb JSON-LD, sitemap, robots, `/llms.txt`.
- `/api/mcp`: read-only MCP server; `server.json` is ready for the MCP registry once the domain is live (publishing needs DNS/GitHub auth).
- IndexNow: `SITE_URL=https://techtipaday.com npm run indexnow` after deploy.
- Video template: `video/` (Remotion, 9:16).
