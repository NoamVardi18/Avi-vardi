/**
 * Build step: turn shared/seo-pages.mjs into real, static, crawlable HTML.
 *
 * The problem this solves, measured 2026-09-02 against the live site:
 *   curl https://www.avivardi.online/  ->  <body><div id="root"></div></body>
 * Everything a human sees is painted by React after load. Google renders JavaScript, but the
 * AI crawlers robots.txt explicitly invites — GPTBot, OAI-SearchBot, PerplexityBot, ClaudeBot —
 * largely do not. They were being served an empty page.
 *
 * ponytail: no prerenderer, no SSR, no headless browser. These are brochure pages whose content
 * is already plain data, so we emit plain HTML from it. That keeps the browser out of the Vercel
 * build entirely (a chromium download in CI is the fragile part of every prerender setup) and
 * means the pages are correct for *every* crawler, not just the ones that execute scripts.
 * If these pages ever need interactivity, that is the moment to reach for a real prerenderer.
 *
 * Styling is a self-contained <style> block rather than the app's Tailwind bundle. Tailwind 4
 * only emits classes it finds by scanning source files, so importing the hashed app CSS here
 * would silently drop any class this generator uses but Home.tsx does not.
 */

import { mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { BIZ, PAGES, PRICE_BANDS } from "../shared/seo-pages.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "dist", "public");
const TODAY = new Date().toISOString().slice(0, 10);

// Google Ads conversion ids, kept identical to client/index.html so a call or WhatsApp tap that
// starts on a landing page is counted the same as one from the homepage. Without this the new
// pages would generate leads that the Ads account reports as zero — the exact blindness the
// 2026-08-28 conversion-tracking commit was written to end.
const GTAG_ID = "AW-18195393649";
const CONV_WHATSAPP = "AW-18195393649/MprvCJ2By-kcEPHYnuRD";
const CONV_PHONE = "AW-18195393649/gblNCKCBy-kcEPHYnuRD";

/* ---------------------------------------------------------------- guards */

// NAP consistency is a real local-ranking factor, and this file duplicates the phone number
// from shared/const.ts. Fail the build rather than let the two drift apart silently.
export function assertNapMatchesSource() {
  const constPath = join(ROOT, "shared", "const.ts");
  const src = readFileSync(constPath, "utf8");
  for (const [label, value] of [
    ["OWNER_PHONE", BIZ.phone],
    ["OWNER_WHATSAPP", BIZ.whatsapp],
  ]) {
    const m = src.match(new RegExp(`${label}\\s*=\\s*"([^"]+)"`));
    if (!m) throw new Error(`gen-seo-pages: ${label} not found in shared/const.ts`);
    if (m[1] !== value) {
      throw new Error(
        `gen-seo-pages: NAP drift — shared/const.ts ${label}="${m[1]}" but shared/seo-pages.mjs has "${value}". ` +
          `Fix one of them; inconsistent phone numbers across pages hurt local ranking.`,
      );
    }
  }
}

/* ---------------------------------------------------------------- helpers */

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const waLink = (text) => `https://wa.me/${BIZ.whatsapp}?text=${encodeURIComponent(text)}`;
const url = (slug) => (slug ? `${BIZ.origin}/${slug}/` : `${BIZ.origin}/`);
const bySlug = (slug) => PAGES.find((p) => p.slug === slug);

const jsonld = (obj) =>
  `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, "\\u003c")}</script>`;

/* ---------------------------------------------------------------- styles */

const STYLE = `
:root{--ink:#1c1917;--ink-deep:#0c0a09;--cream:#faf7f1;--cream-dark:#f3eee4;
--gold:#d4a226;--gold-soft:#e8c468;--gold-deep:#8a6a1f;--stone:#57534e;--line:rgba(28,25,23,.1)}
*{box-sizing:border-box}
body{margin:0;background:var(--cream);color:var(--ink);
font-family:"Heebo",system-ui,-apple-system,"Segoe UI",Arial,sans-serif;
font-size:17px;line-height:1.75;-webkit-font-smoothing:antialiased;padding-bottom:4.5rem}
h1,h2,h3,.display{font-family:"Frank Ruhl Libre","Heebo",Georgia,serif;font-weight:900;line-height:1.15}
a{color:inherit}
.wrap{max-width:56rem;margin:0 auto;padding:0 1.25rem}
.strip{background:var(--ink-deep);color:rgba(250,247,241,.8);font-size:.78rem}
.strip .wrap{display:flex;align-items:center;justify-content:space-between;gap:1rem;height:2.25rem}
.strip a{color:var(--gold-soft);font-weight:700;text-decoration:none}
header{border-bottom:1px solid var(--line);background:rgba(250,247,241,.95);
position:sticky;top:0;z-index:10;backdrop-filter:blur(8px)}
header .wrap{display:flex;align-items:center;justify-content:space-between;gap:1rem;height:4.25rem}
.brand{display:flex;align-items:center;gap:.65rem;text-decoration:none}
.brand b{font-family:"Frank Ruhl Libre",serif;font-size:1.5rem;font-weight:900;display:block;line-height:1}
.brand span{font-size:.65rem;font-weight:700;color:var(--gold-deep);letter-spacing:.2em}
.btn{display:inline-flex;align-items:center;gap:.5rem;font-weight:700;font-size:.95rem;
padding:.7rem 1.35rem;border-radius:.6rem;text-decoration:none;border:0;transition:opacity .15s}
.btn:hover{opacity:.88}
.btn-ink{background:var(--ink);color:var(--cream)}
.btn-wa{background:#25D366;color:#fff}
.btn-out{border:1px solid var(--line);background:transparent;color:var(--ink)}
nav.crumbs{font-size:.8rem;color:var(--stone);padding:1.1rem 0 0}
nav.crumbs a{color:var(--gold-deep);text-decoration:none}
.kicker{display:flex;align-items:center;gap:.6rem;font-size:.8rem;font-weight:700;
letter-spacing:.18em;color:var(--gold-deep);margin:1.5rem 0 .6rem}
.kicker::before{content:"";height:1px;width:2.2rem;background:var(--gold-deep)}
h1{font-size:clamp(2rem,6vw,3.1rem);margin:0 0 1.1rem}
.lead{font-size:1.12rem;color:#3f3b38;margin:0 0 2rem}
h2{font-size:clamp(1.35rem,3.4vw,1.85rem);margin:2.6rem 0 .9rem}
ul{padding-inline-start:1.15rem;margin:0 0 1rem}
li{margin:.45rem 0}
p{margin:0 0 1rem}
.cta{background:var(--ink);color:var(--cream);border-radius:1rem;padding:1.8rem;margin:2.8rem 0}
.cta h2{margin:0 0 .5rem;color:var(--cream);font-size:1.5rem}
.cta p{color:rgba(250,247,241,.7);margin:0 0 1.3rem}
.cta .row{display:flex;flex-wrap:wrap;gap:.75rem}
.cta .btn-out{border-color:rgba(250,247,241,.3);color:var(--cream)}
table{width:100%;border-collapse:collapse;margin:0 0 1rem;font-size:.97rem}
th,td{text-align:right;padding:.75rem .6rem;border-bottom:1px solid var(--line)}
th{font-size:.8rem;letter-spacing:.06em;color:var(--stone)}
td.from{font-weight:800;white-space:nowrap;font-family:"Frank Ruhl Libre",serif;font-size:1.1rem}
.note{font-size:.85rem;color:var(--stone);background:var(--cream-dark);
border-inline-start:3px solid var(--gold);padding:.85rem 1rem;border-radius:.5rem;margin:0 0 1rem}
.faq{border-top:1px solid var(--line);margin-top:1.4rem}
.faq details{border-bottom:1px solid var(--line);padding:.15rem 0}
.faq summary{cursor:pointer;font-weight:700;padding:.95rem 0;list-style:none}
.faq summary::-webkit-details-marker{display:none}
.faq summary::after{content:"+";float:left;color:var(--gold-deep);font-weight:900}
.faq details[open] summary::after{content:"−"}
.faq p{margin:0 0 1rem;color:#3f3b38}
.rel{display:grid;gap:.7rem;grid-template-columns:repeat(auto-fit,minmax(15rem,1fr));margin:0 0 1rem}
.rel a{display:block;padding:1rem 1.1rem;background:#fff;border:1px solid var(--line);
border-radius:.7rem;text-decoration:none;font-weight:700}
.rel a:hover{border-color:var(--gold)}
.rel a span{display:block;font-weight:400;font-size:.85rem;color:var(--stone);margin-top:.2rem}
footer{background:var(--ink-deep);color:rgba(250,247,241,.65);margin-top:3rem;
padding:2.5rem 0 2rem;font-size:.9rem}
footer a{color:var(--gold-soft);text-decoration:none}
footer .cols{display:grid;gap:1.6rem;grid-template-columns:repeat(auto-fit,minmax(14rem,1fr));
padding-bottom:1.6rem;border-bottom:1px solid rgba(250,247,241,.1)}
footer h3{font-size:.8rem;letter-spacing:.16em;color:var(--gold);margin:0 0 .7rem}
footer ul{list-style:none;padding:0;margin:0}
footer .fine{padding-top:1.2rem;font-size:.78rem;color:#78716c}
.fab{position:fixed;bottom:1.2rem;inset-inline-start:1.2rem;display:flex;flex-direction:column;gap:.6rem;z-index:20}
.fab a{width:3.2rem;height:3.2rem;border-radius:50%;display:grid;place-items:center;
box-shadow:0 8px 20px rgba(0,0,0,.22);text-decoration:none;font-size:1.3rem}
.fab .wa{background:#25D366;color:#fff}
.fab .tel{background:var(--ink);color:var(--gold)}
/* The price table is the one place the floating buttons can sit on top of content that
   matters, so on narrow screens it gets its own scroll box and the buttons shrink. */
.tablewrap{overflow-x:auto;margin:0 0 1rem}
@media(max-width:640px){
  .strip .wrap span.hide{display:none}
  .fab a{width:2.9rem;height:2.9rem}
  .fab{bottom:.9rem;inset-inline-start:.9rem}
  table{font-size:.9rem}
  th,td{padding:.6rem .45rem}
}
`.trim();

/* ---------------------------------------------------------------- chrome */

const head = (page) => {
  const canonical = url(page.slug);
  return `
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(page.title)}</title>
<meta name="description" content="${esc(page.description)}">
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">
<link rel="canonical" href="${canonical}">
<meta name="theme-color" content="#1c1917">
<link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png">
<link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<meta property="og:type" content="article">
<meta property="og:url" content="${canonical}">
<meta property="og:title" content="${esc(page.h1)} | ${esc(BIZ.name)}">
<meta property="og:description" content="${esc(page.description)}">
<meta property="og:image" content="${BIZ.origin}/og-image.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="אוטובוס 56 מקומות של אבי ורדי הסעות">
<meta property="og:locale" content="he_IL">
<meta property="og:site_name" content="${esc(BIZ.name)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(page.h1)} | ${esc(BIZ.name)}">
<meta name="twitter:description" content="${esc(page.description)}">
<meta name="twitter:image" content="${BIZ.origin}/og-image.jpg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Frank+Ruhl+Libre:wght@400;700;900&family=Heebo:wght@300;400;500;700;800&display=swap" rel="stylesheet">
<style>${STYLE}</style>`.trim();
};

const gtag = () =>
  `
<script async src="https://www.googletagmanager.com/gtag/js?id=${GTAG_ID}"></script>
<script>
window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}
gtag('js',new Date());gtag('config','${GTAG_ID}');
document.addEventListener('click',function(e){
  var a=e.target&&e.target.closest&&e.target.closest('a[href^="tel:"], a[href*="wa.me"]');
  if(!a)return;
  gtag('event','conversion',{send_to:a.href.indexOf('wa.me')!==-1?'${CONV_WHATSAPP}':'${CONV_PHONE}'});
},true);
</script>`.trim();

// Same WhatsApp mark as the React app (client/src/pages/Home.tsx WA_SVG_PATH) so the floating
// buttons are identical across the site rather than dingbat stand-ins.
const WA_ICON = `<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`;

const TEL_ICON = `<svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`;

const header = () => `
<div class="strip"><div class="wrap">
  <span class="hide">${esc(BIZ.locality)} · זמינות לתיאום 24/6</span>
  <a href="tel:${BIZ.phone}" aria-label="חייגו לאבי ורדי ${BIZ.phoneDisplay}"><span dir="ltr">${BIZ.phoneDisplay}</span></a>
</div></div>
<header><div class="wrap">
  <a class="brand" href="/">
    <img src="/favicon-96x96.png" alt="לוגו אבי ורדי הסעות" width="42" height="42" style="border-radius:.5rem">
    <span style="text-align:start"><b>אבי ורדי</b><span>הסעות פרטיות</span></span>
  </a>
  <a class="btn btn-ink" href="/#booking">הזמנת נסיעה</a>
</div></header>`.trim();

const footer = () => `
<footer><div class="wrap">
  <div class="cols">
    <div>
      <h3>אבי ורדי הסעות</h3>
      <p>שירות הסעות פרטי באוטובוס ${BIZ.seats} מקומות. אבי הוא הבעלים והנהג.<br>${esc(BIZ.locality)}, ${esc(BIZ.region)}.</p>
      <p><a href="tel:${BIZ.phone}" dir="ltr">${BIZ.phoneDisplay}</a></p>
    </div>
    <div>
      <h3>שירותים</h3>
      <ul>${PAGES.map((p) => `<li><a href="/${p.slug}/">${esc(p.h1)}</a></li>`).join("")}</ul>
    </div>
    <div>
      <h3>שעות פעילות</h3>
      <p>ראשון–חמישי: זמינות מלאה לתיאום<br>שישי: 07:00–17:00<br>שבת: סגור</p>
      <p><a href="/">חזרה לעמוד הבית</a></p>
    </div>
  </div>
  <p class="fine">© ${new Date().getFullYear()} ${esc(BIZ.name)}. כל הזכויות שמורות.</p>
</div></footer>
<div class="fab">
  <a class="wa" href="${waLink("שלום אבי, אשמח לקבל פרטים לגבי הסעה.")}" target="_blank" rel="noreferrer" aria-label="שלחו וואטסאפ לאבי ורדי">${WA_ICON}</a>
  <a class="tel" href="tel:${BIZ.phone}" aria-label="חייגו לאבי ורדי ${BIZ.phoneDisplay}">${TEL_ICON}</a>
</div>`.trim();

/* ---------------------------------------------------------------- schema */

// One shared LocalBusiness node with a stable @id, referenced by every page instead of being
// re-declared. That is what lets Google and the AI engines resolve eight URLs to ONE business
// entity rather than eight look-alike listings.
const BIZ_ID = `${BIZ.origin}/#business`;

const bizNode = () => ({
  "@type": "LocalBusiness",
  "@id": BIZ_ID,
  name: BIZ.name,
  url: BIZ.origin,
  telephone: BIZ.phone,
  image: `${BIZ.origin}/og-image.jpg`,
  address: {
    "@type": "PostalAddress",
    addressLocality: BIZ.locality,
    addressRegion: BIZ.region,
    addressCountry: "IL",
  },
  geo: { "@type": "GeoCoordinates", latitude: 31.8027, longitude: 35.1597 },
  areaServed: [
    "ירושלים", "מבשרת ציון", "בית שמש", "מעלה אדומים",
    "גבעת זאב", "ראשון לציון", "תל אביב", "גוש דן",
  ],
});

const pageSchema = (page) => {
  const graph = [
    bizNode(),
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "דף הבית", item: url("") },
        { "@type": "ListItem", position: 2, name: page.h1, item: url(page.slug) },
      ],
    },
    {
      "@type": "Service",
      name: page.serviceName,
      serviceType: page.serviceName,
      description: page.description,
      provider: { "@id": BIZ_ID },
      areaServed: { "@type": "State", name: "ישראל" },
      url: url(page.slug),
    },
    {
      "@type": "FAQPage",
      mainEntity: page.faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];
  return jsonld({ "@context": "https://schema.org", "@graph": graph });
};

/* ---------------------------------------------------------------- body */

const priceTable = () => `
<div class="tablewrap"><table>
  <thead><tr><th>סוג הנסיעה</th><th>החל מ־</th><th>הערה</th></tr></thead>
  <tbody>${PRICE_BANDS.map(
    (b) => `<tr><td>${esc(b.label)}</td><td class="from">${esc(b.from)}</td><td>${esc(b.note)}</td></tr>`,
  ).join("")}</tbody>
</table></div>
<p class="note">הטווחים הם נקודת התחלה לאוטובוס של ${BIZ.seats} מקומות ואינם הצעת מחיר.
המחיר הסופי נסגר בשיחה עם אבי לפי המסלול, השעות וההמתנה.</p>`.trim();

const section = (s) => `
<h2>${esc(s.h2)}</h2>
${s.body ? `<p>${esc(s.body)}</p>` : ""}
${s.bullets ? `<ul>${s.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>` : ""}`.trim();

const related = (page) => {
  const items = page.related.map(bySlug).filter(Boolean);
  if (!items.length) return "";
  return `<h2>עוד שירותים</h2><div class="rel">${items
    .map((p) => `<a href="/${p.slug}/">${esc(p.h1)}<span>${esc(p.kicker)}</span></a>`)
    .join("")}</div>`;
};

export const renderPage = (page) => `<!doctype html>
<html lang="he" dir="rtl">
<head>
${head(page)}
${pageSchema(page)}
${gtag()}
</head>
<body>
${header()}
<main class="wrap">
  <nav class="crumbs" aria-label="מסלול ניווט"><a href="/">דף הבית</a> ← ${esc(page.h1)}</nav>
  <div class="kicker">${esc(page.kicker)}</div>
  <h1>${esc(page.h1)}</h1>
  <p class="lead">${esc(page.lead)}</p>
  ${page.priceTable ? priceTable() : ""}
  ${page.sections.map(section).join("\n")}

  <div class="cta">
    <h2>לתיאום ולקבלת מחיר</h2>
    <p>הכי מהיר זה וואטסאפ או שיחה ישירה לאבי — סוג הנסיעה, התאריך, מאיפה לאיפה וכמה נוסעים.</p>
    <div class="row">
      <a class="btn btn-wa" href="${waLink(page.waText)}" target="_blank" rel="noreferrer">וואטסאפ לאבי</a>
      <a class="btn btn-out" href="tel:${BIZ.phone}"><span dir="ltr">${BIZ.phoneDisplay}</span></a>
      <a class="btn btn-out" href="/#booking">טופס הזמנה</a>
    </div>
  </div>

  <h2>שאלות נפוצות</h2>
  <div class="faq">${page.faq
    .map((f) => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`)
    .join("")}</div>

  ${related(page)}
</main>
${footer()}
</body>
</html>`;

/* ---------------------------------------------------------------- sitemap */

export const sitemap = () => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${url("")}</loc><lastmod>${TODAY}</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>
${PAGES.map(
  (p) =>
    `  <url><loc>${url(p.slug)}</loc><lastmod>${TODAY}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>`,
).join("\n")}
</urlset>`;

/* --------------------------------------------- homepage crawlable fallback */

// The homepage stays a React app; we only add a <noscript> twin of its key facts. Crawlers read
// noscript out of the raw HTML, so GPTBot and friends get real content there too, while a real
// browser renders exactly what it rendered before — no flash, no hydration mismatch.
export const homeNoscript = () => `<noscript>
<div style="max-width:56rem;margin:0 auto;padding:2rem 1.25rem;font-family:system-ui,sans-serif;line-height:1.7" dir="rtl">
<h1>${esc(BIZ.name)} — אוטובוס ${BIZ.seats} מקומות מירושלים</h1>
<p>שירות הסעות פרטי באוטובוס אחד של ${BIZ.seats} מקומות. אבי ורדי הוא הבעלים והנהג.
מבוסס ב${esc(BIZ.locality)}, סמוך לירושלים, ונוסע לכל הארץ.
טלפון: <a href="tel:${BIZ.phone}" dir="ltr">${BIZ.phoneDisplay}</a>.</p>
<h2>שירותים</h2>
<ul>${PAGES.map((p) => `<li><a href="/${p.slug}/">${esc(p.h1)}</a> — ${esc(p.description)}</li>`).join("")}</ul>
<h2>שעות פעילות</h2>
<p>ראשון–חמישי: זמינות מלאה לתיאום · שישי: 07:00–17:00 · שבת: סגור</p>
</div>
</noscript>`;

/* ---------------------------------------------------------------- llms.txt */

// Generated, not hand-written. The hand-written version drifted: it still advertised
// "דירוג 5.0 כוכבים, 4 ביקורות" a week after commit 81ff3a5 pulled that exact claim out of the
// schema as invented — the fabricated rating outlived its removal in the one file aimed
// squarely at language models. Deriving it from shared/seo-pages.mjs makes that class of
// drift impossible: there is one place to fix a fact.
export const llmsTxt = () => `# ${BIZ.name}

> שירות הסעות פרטי באוטובוס אחד של ${BIZ.seats} מקומות מאזור ירושלים. הבעלים והנהג הוא ${BIZ.owner} — אותו אדם עונה לטלפון, נותן את המחיר ונוהג ביום הנסיעה. מבוסס ב${BIZ.locality}, ${BIZ.region}. רישוי משרד התחבורה.

## פרטי קשר

- טלפון: ${BIZ.phoneDisplay}
- וואטסאפ: https://wa.me/${BIZ.whatsapp}
- אתר: ${BIZ.origin}
- מיקום: ${BIZ.locality}, ${BIZ.region}, ישראל

## שעות פעילות

- ראשון–חמישי: זמינות מלאה לתיאום
- שישי: 07:00–17:00
- שבת: סגור

## הרכב

אוטובוס אחד בלבד, ${BIZ.seats} מקומות ישיבה: כיסאות עור, מיזוג אוויר מפוצל, מערכת שמע לחיבור טלפון, תא מטען גדול (מזוודה לכל נוסע). אין מיניבוס ואין צי רכבים. קבוצה מתחת ל-25 נוסעים לרוב תמצא רכב קטן יותר משתלם; קבוצה מעל ${BIZ.seats} נוסעים דורשת יותר מרכב אחד.

## עמודי שירות

${PAGES.map((p) => `- [${p.h1}](${url(p.slug)}) — ${p.description}`).join("\n")}

## אזורי שירות

ירושלים וכל שכונותיה, ${BIZ.locality}, מוצא, אבו גוש, בית שמש ורמת בית שמש, מעלה אדומים, גבעת זאב, יישובי הרי יהודה. נסיעות לכל הארץ: גוש דן ותל אביב, ראשון לציון, נתב"ג, הצפון, ים המלח, אילת והדרום.

## מסלולים נפוצים

- ירושלים ← ראשון לציון וגוש דן (חתונות ואירועים)
- ירושלים ← נתב"ג
- ירושלים ← הצפון (טיולים, ימי גיבוש)
- ירושלים ← ים המלח, אילת והדרום
- בית שמש ← ירושלים (קבוצות קבועות)

## טווחי מחירים משוערים

המחיר הוא על האוטובוס ולא לפי נוסע, ולכן מספר הנוסעים אינו משנה אותו. הטווחים הבאים הם נקודות התחלה בלבד ואינם הצעת מחיר — המחיר הסופי נסגר בשיחה עם ${BIZ.owner} לפי המסלול, שעות ההמתנה, מספר נקודות האיסוף והתאריך.

${PRICE_BANDS.map((b) => `- ${b.label}: החל מ-${b.from} (${b.note})`).join("\n")}

## איך מזמינים

וואטסאפ או טלפון ישיר ל${BIZ.owner}, או טופס ההזמנה בעמוד הבית. ארבעה פרטים מספיקים לקבלת מחיר סופי באותה שיחה: סוג הנסיעה, התאריך, מאיפה לאיפה, וכמה נוסעים בערך. מומלץ לתאם מראש — יש אוטובוס אחד, ותאריך שנתפס נתפס. עונת החתונות והקיץ הן התקופות העמוסות.

## מה השירות לא כולל

- אין שירות בשבת.
- אין מיניבוסים ואין נהגים להשכרה בלי הרכב.
- אין מחיר סופי מפורסם מראש — רק טווחים.
- אין דירוג ציבורי או ביקורות מאומתות שניתן לצטט נכון להיום.
`;

/* ---------------------------------------------------------------- main */

export function main() {
  assertNapMatchesSource();

  if (!existsSync(OUT)) {
    throw new Error(`gen-seo-pages: ${OUT} does not exist — run vite build first.`);
  }

  for (const page of PAGES) {
    const html = renderPage(page);

    // Structured data is the whole point of these pages and it is the part that fails
    // silently: a stray quote in Hebrew copy yields markup that still looks fine in a browser
    // while Google drops the page's rich results. Parse it back before writing.
    for (const block of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
      try {
        JSON.parse(block[1].replace(/\\u003c/g, "<"));
      } catch (err) {
        throw new Error(`gen-seo-pages: /${page.slug}/ emitted invalid JSON-LD — ${err.message}`);
      }
    }
    if (!html.includes(`<h1>`)) throw new Error(`gen-seo-pages: /${page.slug}/ has no h1`);

    const dir = join(OUT, page.slug);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "index.html"), html, "utf8");
  }

  writeFileSync(join(OUT, "sitemap.xml"), sitemap(), "utf8");
  writeFileSync(join(OUT, "llms.txt"), llmsTxt(), "utf8");

  const indexPath = join(OUT, "index.html");
  let html = readFileSync(indexPath, "utf8");
  if (!html.includes("<noscript>\n<div style=")) {
    html = html.replace('<div id="root"></div>', `<div id="root"></div>\n${homeNoscript()}`);
    writeFileSync(indexPath, html, "utf8");
  }

  console.log(`gen-seo-pages: ${PAGES.length} pages, sitemap (${PAGES.length + 1} urls), llms.txt, homepage noscript`);
}

// Only write files when run as a script (`node scripts/gen-seo-pages.mjs`). Importing this
// module — which the test does — must not touch dist/.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
