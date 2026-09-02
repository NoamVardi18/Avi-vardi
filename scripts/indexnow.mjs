/**
 * Ping IndexNow with every URL in the sitemap.
 *
 * IndexNow is a free, open submission endpoint shared by Bing, Yandex, Seznam and Naver: you
 * tell them a URL changed instead of waiting for a crawl. Bing's index is also what Microsoft
 * Copilot and (via its search partnership) parts of ChatGPT search read from, so this is the
 * cheapest way to get new pages in front of AI answer engines quickly. Google does not
 * participate — Google discovers these through sitemap.xml and Search Console.
 *
 * Deliberately NOT wired into `pnpm build`: it is an outbound call to a third party, so it runs
 * when asked (`pnpm seo:indexnow`), not on every deploy.
 */

import { PAGES, BIZ } from "../shared/seo-pages.mjs";

const KEY = "cf2916a55c36a1a0cb48844f798fed74";

const urls = [`${BIZ.origin}/`, ...PAGES.map((p) => `${BIZ.origin}/${p.slug}/`)];

const body = {
  host: new URL(BIZ.origin).host,
  key: KEY,
  keyLocation: `${BIZ.origin}/${KEY}.txt`,
  urlList: urls,
};

const res = await fetch("https://api.indexnow.org/IndexNow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify(body),
});

// 200 = accepted, 202 = accepted but the key file has not been verified yet (normal on the
// first run, before the deploy carrying /${KEY}.txt is live).
console.log(`IndexNow: HTTP ${res.status} for ${urls.length} urls`);
if (res.status === 403) {
  console.error(`Key file not reachable at ${body.keyLocation} — deploy first, then re-run.`);
  process.exit(1);
}
if (!res.ok && res.status !== 202) {
  console.error(await res.text());
  process.exit(1);
}
