/**
 * Accessibility audit: axe-core (WCAG 2.0/2.1 A + AA) over every public page of the BUILT site,
 * desktop and mobile, plus the states a page-load scan never sees (dialogs open, mobile menu
 * open) and a keyboard pass over the dialogs (Esc closes, focus is trapped, focus returns).
 *
 *   pnpm build && node scripts/a11y-audit.mjs [--out results.json]
 *
 * It serves dist/public itself, so nothing here depends on the Express server or the network.
 * Every tracking request is aborted: an audit run must never show up as a visit or a
 * conversion in Avi's Google Ads account.
 */

import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync } from "node:fs";
import { join, dirname, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import { PAGES } from "../shared/seo-pages.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "dist", "public");
const outArg = process.argv.indexOf("--out");
const OUT = outArg > -1 ? process.argv[outArg + 1] : null;

const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css",
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp",
  ".svg": "image/svg+xml", ".ico": "image/x-icon", ".txt": "text/plain", ".xml": "application/xml" };

const BLOCK = /googletagmanager|google-analytics|doubleclick|googleadservices|racknerd|umami|_vercel\/(insights|speed-insights)/;

function serve() {
  if (!existsSync(join(DIST, "index.html"))) throw new Error("dist/public missing — run `pnpm build` first");
  const server = createServer((req, res) => {
    let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
    let f = join(DIST, p);
    if (existsSync(f) && statSync(f).isDirectory()) f = join(f, "index.html");
    if (!existsSync(f)) f = join(DIST, "index.html"); // SPA fallback, as the old vercel.json did
    res.writeHead(200, { "content-type": TYPES[extname(f)] ?? "application/octet-stream" });
    res.end(readFileSync(f));
  });
  return new Promise((r) => server.listen(0, "127.0.0.1", () => r(server)));
}

const VIEWPORTS = {
  desktop: { viewport: { width: 1366, height: 900 } },
  mobile: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 3 },
};

const ROUTES = [{ name: "home", path: "/" }, ...PAGES.map((p) => ({ name: p.slug, path: `/${p.slug}/` }))];

// Footer buttons are found by their visible text, so this keeps working whatever markup they use.
const openFooterButton = (label) => async (page) => {
  await page.locator("footer").getByRole("button", { name: label, exact: true }).click();
  await page.getByRole("dialog").waitFor();
};
const STATES = [
  { name: "home+privacy-dialog", path: "/", act: openFooterButton("מדיניות פרטיות") },
  { name: "home+accessibility-dialog", path: "/", act: openFooterButton("הצהרת נגישות") },
  { name: "home+mobile-menu", path: "/", only: "mobile", act: async (page) => {
    await page.getByRole("button", { name: "פתח תפריט" }).click();
  } },
];

async function newPage(browser, vp) {
  const ctx = await browser.newContext({ ...VIEWPORTS[vp], locale: "he-IL", reducedMotion: "no-preference" });
  await ctx.route("**/*", (route) => (BLOCK.test(route.request().url()) ? route.abort() : route.continue()));
  return { ctx, page: await ctx.newPage() };
}

async function scan(page) {
  const r = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  return r.violations.map((v) => ({ id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.length,
    targets: v.nodes.slice(0, 60).map((n) => {
      const d = n.any?.[0]?.data; // color-contrast puts the measured colours here
      return n.target.join(" ") + (d?.contrastRatio ? `  [${d.fgColor} on ${d.bgColor} = ${d.contrastRatio}, need ${d.expectedContrastRatio}]` : "");
    }) }));
}

// Keyboard contract for each footer dialog: Esc closes it, Tab never leaves it, and focus goes
// back to the button that opened it. axe cannot see any of this, so it is checked by hand.
async function keyboardChecks(browser, vp) {
  const out = [];
  for (const label of ["מדיניות פרטיות", "הצהרת נגישות"]) {
    const { ctx, page } = await newPage(browser, vp);
    await page.goto(base + "/", { waitUntil: "networkidle" });
    const trigger = page.locator("footer").getByRole("button", { name: label, exact: true });
    await trigger.focus();
    await page.keyboard.press("Enter");
    const dialog = page.getByRole("dialog");
    const opened = await dialog.isVisible().catch(() => false);
    const focusInside = opened && (await dialog.evaluate((d) => d.contains(document.activeElement)));
    let trapped = opened;
    for (let i = 0; opened && i < 25; i++) {
      await page.keyboard.press(i % 2 ? "Shift+Tab" : "Tab");
      if (!(await dialog.evaluate((d) => d.contains(document.activeElement)).catch(() => false))) { trapped = false; break; }
    }
    await page.keyboard.press("Escape");
    const closed = opened && (await dialog.waitFor({ state: "hidden", timeout: 2000 }).then(() => true, () => false));
    // Focus is restored as the dialog unmounts; give it up to 1s rather than racing that frame.
    const returned = await page.waitForFunction((b) => document.activeElement === b, await trigger.elementHandle(), { timeout: 1000 }).then(() => true, () => false);
    out.push({ dialog: label, opened, focusInside, trapped, escCloses: closed, focusReturns: returned });
    await ctx.close();
  }
  // Skip link: first Tab stop that is a skip link, and activating it lands focus in <main>.
  const { ctx, page } = await newPage(browser, vp);
  await page.goto(base + "/", { waitUntil: "networkidle" });
  let skip = null;
  for (let i = 0; i < 4 && !skip; i++) {
    await page.keyboard.press("Tab");
    const t = await page.evaluate(() => ({ text: document.activeElement?.textContent?.trim(), href: document.activeElement?.getAttribute("href") }));
    if (t.href === "#main-content") skip = t;
  }
  if (skip) await page.keyboard.press("Enter");
  const inMain = skip ? await page.evaluate(() => !!document.activeElement?.closest("main") || document.activeElement?.id === "main-content") : false;
  out.push({ dialog: "skip-link", opened: !!skip, focusInside: inMain, trapped: null, escCloses: null, focusReturns: null });
  await ctx.close();
  return out;
}

// Consent contract, measured on the wire (requests are still aborted, just recorded first):
// no gtag.js request before "מאשר", none after "רק הכרחיות", one after "מאשר"; the footer link
// re-opens the banner with focus on it, and Esc hands focus back to that link.
async function consentChecks(browser) {
  const out = [];
  const { ctx, page } = await newPage(browser, "desktop");
  let google = 0;
  page.on("request", (r) => { if (/googletagmanager\.com\/gtag\/js/.test(r.url())) google++; });
  const banner = page.locator("#avv-consent");
  const step = async (name, ok) => out.push({ step: name, pass: !!ok });

  await page.goto(base + "/", { waitUntil: "networkidle" });
  await step("first visit: banner shown", await banner.isVisible());
  await step("first visit: no gtag.js request", google === 0);
  await banner.getByRole("button", { name: "רק הכרחיות" }).click();
  await step("'רק הכרחיות': banner closes", !(await banner.isVisible()));
  await page.reload({ waitUntil: "networkidle" });
  await step("after reload: choice remembered, no banner", !(await banner.isVisible()));
  await step("after 'רק הכרחיות': still no gtag.js request", google === 0);
  const settings = page.locator("footer").getByRole("button", { name: "הגדרות עוגיות" });
  await settings.focus();
  await page.keyboard.press("Enter");
  await step("footer link re-opens banner", await banner.isVisible());
  await step("re-opened banner takes focus", await banner.evaluate((b) => b.contains(document.activeElement)));
  await page.keyboard.press("Escape");
  await step("Esc closes it, focus back on footer link", !(await banner.isVisible()) && (await settings.evaluate((b) => b === document.activeElement)));
  await settings.click();
  await banner.getByRole("button", { name: "מאשר" }).click();
  await page.waitForTimeout(300);
  await step("'מאשר': gtag.js requested", google === 1);
  await step("'מאשר': focus back on footer link", await settings.evaluate((b) => b === document.activeElement));
  await ctx.close();

  const seo = await newPage(browser, "mobile");
  let seoGoogle = 0;
  seo.page.on("request", (r) => { if (/googletagmanager\.com\/gtag\/js/.test(r.url())) seoGoogle++; });
  await seo.page.goto(base + `/${PAGES[0].slug}/`, { waitUntil: "networkidle" });
  await step("SEO page: banner shown, no gtag.js", (await seo.page.locator("#avv-consent").isVisible()) && seoGoogle === 0);
  await seo.page.locator("#avv-consent").getByRole("button", { name: "מאשר" }).click();
  await seo.page.waitForTimeout(300);
  await step("SEO page: 'מאשר' requests gtag.js", seoGoogle === 1);
  await seo.page.goto(base + "/#privacy", { waitUntil: "networkidle" });
  await step("/#privacy opens the privacy dialog", await seo.page.getByRole("dialog", { name: "מדיניות פרטיות" }).isVisible());
  await seo.ctx.close();
  return out;
}

// Booking form: an empty submit must not reach the server, must put the errors next to the
// fields, mark them invalid, announce a summary, and move focus to the first invalid field.
async function formChecks(browser) {
  const out = [];
  const { ctx, page } = await newPage(browser, "mobile");
  let posted = 0;
  page.on("request", (r) => { if (r.url().includes("/api/trpc")) posted++; });
  await page.goto(base + "/#booking", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "שלחו את הכרטיס לאבי" }).click();
  await page.waitForTimeout(200);
  const name = page.locator("#b-name");
  out.push({ step: "empty submit: nothing sent to the server", pass: posted === 0 });
  out.push({ step: "name + phone marked aria-invalid", pass: (await name.getAttribute("aria-invalid")) === "true" && (await page.locator("#b-phone").getAttribute("aria-invalid")) === "true" });
  out.push({ step: "error text tied to the field (aria-describedby)", pass: (await name.getAttribute("aria-describedby")) === "b-name-error" && (await page.locator("#b-name-error").isVisible()) });
  out.push({ step: "focus moved to first invalid field", pass: await name.evaluate((el) => el === document.activeElement) });
  out.push({ step: "summary in an aria-live region", pass: /לא ניתן לשלוח/.test(await page.locator('[role="status"][aria-live="polite"]').innerText()) });
  out.push({ step: "every input has a programmatic label", pass: await page.evaluate(() => [...document.querySelectorAll("#booking input")].every((i) => i.labels?.length > 0)) });
  await ctx.close();
  return out;
}

let base;
const server = await serve();
base = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({ channel: "chrome" }).catch(() => chromium.launch());
const results = { scans: [], keyboard: {} };

for (const vp of Object.keys(VIEWPORTS)) {
  for (const r of [...ROUTES, ...STATES]) {
    if (r.only && r.only !== vp) continue;
    const { ctx, page } = await newPage(browser, vp);
    let violations, error = null;
    try {
      await page.goto(base + r.path, { waitUntil: "networkidle" });
      if (r.act) await r.act(page);
      await page.waitForTimeout(400); // let open/close animations settle before measuring contrast
      violations = await scan(page);
    } catch (e) {
      error = String(e.message ?? e).split("\n")[0];
      violations = [];
    }
    results.scans.push({ viewport: vp, page: r.name, error, violations });
    await ctx.close();
  }
  results.keyboard[vp] = await keyboardChecks(browser, vp);
}
// Only meaningful once consent.js exists; on an older build every step simply reads as failed.
results.consent = await consentChecks(browser).catch((e) => [{ step: `consent checks crashed: ${String(e.message).split("\n")[0]}`, pass: false }]);

results.form = await formChecks(browser).catch((e) => [{ step: `form checks crashed: ${String(e.message).split("\n")[0]}`, pass: false }]);
await browser.close();
server.close();

const count = (vs, lvl) => vs.filter((v) => v.impact === lvl).reduce((n, v) => n + v.nodes, 0);
console.log("viewport  page                                  crit  serious  moderate  minor  rules");
for (const s of results.scans) {
  const rules = s.error ? `ERROR: ${s.error}` : s.violations.map((v) => `${v.id}(${v.impact[0]})`).join(", ");
  console.log(`${s.viewport.padEnd(9)} ${s.page.padEnd(37)} ${String(count(s.violations, "critical")).padStart(4)} ${String(count(s.violations, "serious")).padStart(8)} ${String(count(s.violations, "moderate")).padStart(9)} ${String(count(s.violations, "minor")).padStart(6)}  ${rules}`);
}
for (const [vp, rows] of Object.entries(results.keyboard)) for (const k of rows) console.log(`kbd ${vp} ${JSON.stringify(k)}`);
for (const c of results.consent) console.log(`consent ${c.pass ? "PASS" : "FAIL"}  ${c.step}`);
for (const c of results.form) console.log(`form    ${c.pass ? "PASS" : "FAIL"}  ${c.step}`);
if (OUT) writeFileSync(OUT, JSON.stringify(results, null, 2));
