// Run after each deploy on the final domain: SITE_URL=https://techtipaday.com npm run indexnow
const KEY = "04c4450faf50373a63034f8c1f545cba";
const site = (process.env.SITE_URL || "https://techtipaday.com").replace(/\/$/, "");
const xml = await (await fetch(site + "/sitemap.xml")).text();
const urlList = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
const r = await fetch("https://api.indexnow.org/indexnow", { method: "POST", headers: { "content-type": "application/json" },
  body: JSON.stringify({ host: new URL(site).host, key: KEY, keyLocation: site + "/" + KEY + ".txt", urlList }) });
console.log("IndexNow", r.status, urlList.length, "urls");
