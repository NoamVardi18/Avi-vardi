# CAMPAIGN-KNOWLEDGE — Avi Vardi Google Ads (permanent record)

**Purpose:** preserve everything learned from the Search campaign before the 2026-07-25 manual Ads Editor push replaces the old ads. Written because Noam asked explicitly: "i want the knowledge we have there saved." Read this before touching the account again.

**Sources:** `~/Claude/Architect/invoice-engine/ads-ops/ads.json` (live snapshot, generated 2026-07-22T17:30:00Z) + `ads-ops-log.jsonl` (mutation history since 2026-07-11) + `changeset-2026-07-22/` (archive-2026-07-23.json, receipts-2026-07-23.json, CHANGESET.md) + `Executive Assistant/plans/GOOGLE-ADS-BUS-FIX-2026-07-22-PLAN.md` (truth file/STATE log) + the verbatim old-ad headline pull recovered from prior-agent transcript `agent-a7a7118ba3a7bd7e4.jsonl` (GAQL result, 2026-07-23T20:xx session, `ad_group_ad.ad.responsive_search_ad.headlines/descriptions` query).

---

## 1. ACCOUNT

- **customer_id:** `1128064207`

### Search campaign (the live one)
- **id:** `24022931741` — name **"אבי ורדי — חיפוש"**
- **channel:** SEARCH
- **status:** ~~PAUSED (as of 2026-07-22/23 pulls)~~ → **ENABLED and serving** (confirmed 2026-07-30 pull). The pause was real and lasted 07-21→07-25 (5 days, ₪0 spend), then it resumed on the 26th; the pause was never confirmed as deliberate in the logs and was almost certainly a manual change outside the tooling. **This line asserted a live-account fact that stopped being true — re-verify status with GAQL before relying on it, per the standing lesson in CAMPAIGN-STATUS.md.**
- **budget:** ₪30/day (30,000,000 micros) — never touched by any run.
- **bidding_strategy_type:** TARGET_SPEND (i.e. Maximize Clicks) — confirmed via GAQL 2026-07-23.
- **Structure — 4 ad groups:**
  | Ad group | id | theme |
  |---|---|---|
  | טיולים ואירועים | 197000680966 | group trips / outings |
  | הסעות לעובדים וכללי | 198995179115 | employee transport / general |
  | חתונות | 201158533351 | weddings |
  | נתב״ג | 202032774927 | Ben-Gurion airport transport |
- **Sitelinks (4, all ENABLED):** הסעות לנתב״ג · הסעות לחתונות · טיולים והשכרת אוטובוס · צרו קשר עם אבי
- **Final URL:** `https://www.avivardi.online` (unchanged throughout)

### The REMOVED PMax campaign
- **id:** `24022824230` — name **"אבי ורדי הסעות"**
- **channel:** PERFORMANCE_MAX
- **status:** REMOVED on **2026-07-14T15:10:00Z**, at Noam's explicit instruction.
- **Why removed:** it had been PAUSED since launch with **0 impressions and ₪0 spend lifetime** — dead weight. The Search campaign was and remains the only campaign carrying any traffic.
- **budget was:** ₪30/day (never spent).

### Other campaigns
None. Confirmed across every pull in the data (ads.json, ads-ops-log.jsonl, the 2026-07-23 archive): the account has exactly these two campaigns — one REMOVED (PMax), one the live Search campaign. No display, video, or other campaign types exist.

### Unresolved account-level blocker (separate from the ad-copy fix)
- Google Ads **advertiser verification** blocks linking the business name/logo assets: `customerAssets:mutate BUSINESS_NAME` → `assetLinkError CUSTOMER_NOT_VERIFIED` (adspolicy/answer/9703665). This is Google-side identity/business-doc verification, NOT a site/domain-verification issue (the site's verification file confirmed 200 OK). A reusable TEXT asset `"אבי ורדי הסעות"` was created and left unlinked (`customers/1128064207/assets/390420464191`) so linking is one call away once verification clears.
- No usable square logo exists in the site repo (only a 16x16/32x32 favicon and a 1200x630 og-image; Google needs ≥128x128, 1:1). Needs Noam to both chase verification and supply a logo image.

---

## 2. OLD ADS (verbatim, recovered) — the "before" record

All 8 RSAs were pulled live via GAQL on 2026-07-23 (`ad_group_ad.ad.responsive_search_ad.headlines/descriptions`), captured whole in a prior agent's transcript and never written to a file until now. **Fully recovered — no gaps.** Each had 15 headlines + 4 descriptions (Google's max). "BUS" marks headlines containing the literal word אוטובוס.

### Ad 816419150547 — group טיולים ואירועים — 4/15 headlines contain אוטובוס
Headlines: השכרת אוטובוס לטיול (BUS) · אוטובוס 56 מקומות לטיול (BUS) · אוטובוס לטיול מירושלים (BUS) · הסעות לקבוצות וטיולים · נהג צמוד לכל היום · ישירות מול הנהג בלי מוקדים · הצעת מחיר לטיול תוך שעה · אוטובוס מרווח וממוזג (BUS) · טיולי גמלאים בנוחות · יום גיבוש מאורגן · הסעה לכל מקום בארץ · תיאום מסלול מראש · שירות אישי ואמין · זמינות 24/6 · אבי ורדי הסעות
Descriptions: טיול קבוצתי? אוטובוס מרווח ל-56 מקומות עם נהג צמוד לכל היום. נוסעים נוח ובטוח. / מדברים ישירות עם הנהג ומתכננים את המסלול יחד. התקשרו לתיאום ולהצעת מחיר לטיול. / הסעות מירושלים, מבשרת ציון והסביבה לכל יעד בארץ, כולל טיולי גמלאים וימי גיבוש. / מארגנים טיול לקבוצה? דאגו לאוטובוס נוח עם נהג. התקשרו עכשיו לאבי להצעת מחיר.

### Ad 816438019647 — group טיולים ואירועים — 3/15 headlines contain אוטובוס
Headlines: אוטובוס לטיול מירושלים (BUS) · אוטובוס 56 מקומות לקבוצות (BUS) · הסעות לטיולים · טיול לכל הקבוצה · נהג צמוד לכל היום · ישירות מול הנהג בלי מוקדים · הצעת מחיר לטיול · אוטובוס מרווח וממוזג (BUS) · טיולי גמלאים בנוחות · הסעה לכל מקום בארץ · תיאום מסלול מראש · שירות אישי ואמין · זמינות 24/6 · יום כיף מאורגן · אבי ורדי הסעות
Descriptions: טיול קבוצתי? אוטובוס מרווח ל-56 מקומות עם נהג צמוד לכל היום. נוסעים נוח ובטוח. / מדברים ישירות עם הנהג ומתכננים את המסלול יחד. התקשרו לתיאום ולהצעת מחיר לטיול. / הסעות מירושלים, מבשרת ציון והסביבה לכל יעד בארץ, כולל טיולי גמלאים ומרכזי יום. / מארגנים טיול לקבוצה? דאגו לאוטובוס נוח עם נהג. התקשרו עכשיו להצעת מחיר.

### Ad 816438019650 — group הסעות לעובדים וכללי — 6/15 headlines contain אוטובוס
Headlines: השכרת אוטובוס ירושלים (BUS) · אוטובוס 56 מקומות להשכרה (BUS) · אוטובוס עם נהג (BUS) · הסעה לקבוצה גדולה · נהג מקצועי צמוד · ישירות מול הנהג בלי מוקדים · הצעת מחיר להשכרה · הסעות לגמלאים ולקבוצות · תיאום נסיעה פשוט · זמינות 24/6 · נסיעה בטוחה ואמינה · אוטובוס נקי ומטופח (BUS) · שירות אישי לכל נסיעה · הזמינו אוטובוס עכשיו (BUS) · אוטובוס מרווח וממוזג (BUS)
Descriptions: צריכים אוטובוס עם נהג? 56 מקומות מרווחים, נהג מקצועי צמוד, לכל מסלול ולכל מטרה. / בלי מוקדים ובלי מתווכים — מתאמים את הנסיעה ישירות מול הנהג. התקשרו לתיאום ולהצעת מחיר. / הסעות מירושלים, מבשרת ציון והסביבה לכל מקום בארץ. אוטובוס נקי, ממוזג ומטופח לכל נסיעה. / קבוצה שצריכה להגיע יחד? הזמינו אוטובוס נוח ואמין. התקשרו ואבי יחזור עם הצעת מחיר.

### Ad 816454544560 — group הסעות לעובדים וכללי — 6/15 headlines contain אוטובוס
Headlines: השכרת אוטובוס ירושלים (BUS) · אוטובוס 56 מקומות להשכרה (BUS) · אוטובוס עם נהג להשכרה (BUS) · השכרת אוטובוס ליום שלם (BUS) · הסעות עובדים בקבוצה · ישירות מול הנהג בלי מוקדים · הצעת מחיר תוך שעה · נהג מקצועי צמוד · אוטובוס מרווח וממוזג (BUS) · הסעה לכל מטרה בארץ · תיאום נסיעה פשוט · זמינות 24/6 · נסיעה בטוחה ואמינה · אוטובוס נקי ומטופח (BUS) · אבי ורדי הסעות
Descriptions: צריכים אוטובוס עם נהג? 56 מקומות מרווחים, נהג מקצועי צמוד, לכל מסלול ולכל מטרה. / בלי מוקדים ובלי מתווכים — מתאמים ישירות מול הנהג. התקשרו לתיאום ולהצעת מחיר. / הסעות עובדים ואירועים מירושלים, מבשרת ציון והסביבה לכל מקום בארץ. אוטובוס ממוזג. / קבוצה שצריכה להגיע יחד? הזמינו אוטובוס נוח ואמין. התקשרו ואבי יחזור עם הצעת מחיר.

### Ad 816438019644 — group חתונות — 2/15 headlines contain אוטובוס
Headlines: הסעות לחתונה מירושלים · אוטובוס 56 מקומות לאירוע (BUS) · הסעת אורחים לאירוע · האורחים מגיעים יחד · הסעה הלוך ושוב לאולם · ישירות מול הנהג בלי מוקדים · נהג פרטי לאירוע · הצעת מחיר לחתונה · שריון תאריך לחתונה · הסעה נוחה ובטוחה · אוטובוס מרווח וממוזג (BUS) · הסעות לכל אירוע · שירות אישי לחתונה · זמינות 24/6 · אבי ורדי הסעות
Descriptions: שהאורחים יגיעו יחד ובזמן לחתונה, באוטובוס מרווח ל-56 מקומות. הסעה הלוך ושוב לאולם. / מדברים ישירות עם הנהג ומתאמים כל פרט מראש. התקשרו לתיאום ולהצעת מחיר לחתונה שלכם. / הסעת אורחים מירושלים, מבשרת ציון והסביבה לכל אולם. שריון תאריך מראש בעונת האירועים. / רוצים שהאורחים לא ידאגו לחנייה ולנהיגה? הזמינו אוטובוס. התקשרו עכשיו לתיאום ולהצעת מחיר.

### Ad 816527498297 — group חתונות — 3/15 headlines contain אוטובוס
Headlines: הסעות לחתונה מירושלים · אוטובוס 56 מקומות לאירוע (BUS) · הסעת אורחים לחתונה · האורחים מגיעים יחד · הסעה הלוך ושוב לאולם · ישירות מול הנהג בלי מוקדים · נהג פרטי לאירוע · הצעת מחיר לחתונה · שריון תאריך לאירוע · אוטובוס מרווח וממוזג (BUS) · הסעות לכל אירוע · שירות אישי לחתונה · זמינות 24/6 · השכרת אוטובוס לחתונה (BUS) · אבי ורדי הסעות
Descriptions: שהאורחים יגיעו יחד ובזמן לחתונה, באוטובוס מרווח ל-56 מקומות. הסעה הלוך ושוב לאולם. / מדברים ישירות עם הנהג ומתאמים כל פרט מראש. התקשרו לתיאום ולהצעת מחיר לחתונה. / הסעת אורחים מירושלים, מבשרת ציון והסביבה לכל אולם. שריון תאריך מראש בעונת האירועים. / רוצים שהאורחים לא ידאגו לחנייה? הזמינו אוטובוס. התקשרו עכשיו לתיאום ולהצעת מחיר.

### Ad 816438019641 — group נתב״ג — 3/15 headlines contain אוטובוס
Headlines: הסעה לנתב״ג ממבשרת ציון · אוטובוס 56 מקומות לקבוצות (BUS) · כל הקבוצה באוטובוס אחד (BUS) · הסעה מרוכזת לטיסה · אוטובוס מרווח וממוזג (BUS) · נהג פרטי צמוד · ישירות מול הנהג בלי מוקדים · תיאום נסיעה מראש · הצעה לנסיעה לנתב״ג · הסעה לטיסת בוקר · איסוף לילה לנתב״ג · זמינות 24/6 · הזמינו הסעה לטיסה · נסיעה לנתב״ג משוהם · אמינות ודייקנות
Descriptions: כל הקבוצה מגיעה יחד לנתב״ג באוטובוס אחד מרווח, בלי רכבים מפוזרים ובלי דאגות חנייה. / איסוף לילה או טיסת בוקר, נסיעה נוחה ובזמן לשדה התעופה. תיאום פשוט ישירות מול הנהג. / הסעה לנתב״ג מירושלים, מבשרת ציון ושוהם. התקשרו ישירות לאבי לתיאום מסלול ושעה. / רוצים לצאת לטיסה רגועים? הזמינו הסעה מראש. התקשרו ואבי יחזור אליכם עם הצעת מחיר.

### Ad 816454215061 — group נתב״ג — 4/15 headlines contain אוטובוס
Headlines: הסעה לנתב״ג מירושלים · אוטובוס 56 מקומות לנתב״ג (BUS) · אוטובוס לשדה תעופה (BUS) · כל הקבוצה באוטובוס אחד (BUS) · איסוף לילה לנתב״ג · הסעה לטיסת בוקר · ישירות מול הנהג בלי מוקדים · נהג פרטי צמוד · תיאום נסיעה מראש · הצעה לנסיעה לנתב״ג · אוטובוס מרווח וממוזג (BUS) · נסיעה לנתב״ג משוהם · זמינות 24/6 · הסעה מרוכזת לטיסה · אבי ורדי הסעות
Descriptions: כל הקבוצה מגיעה יחד לנתב״ג באוטובוס אחד מרווח, בלי רכבים מפוזרים ובלי דאגות חנייה. / איסוף לילה או טיסת בוקר, נסיעה נוחה ובזמן לשדה התעופה. תיאום ישירות מול הנהג. / הסעה לנתב״ג מירושלים, מבשרת ציון ושוהם. התקשרו ישירות לאבי לתיאום מסלול ושעה. / רוצים לצאת לטיסה רגועים? הזמינו הסעה מראש. התקשרו ואבי יחזור עם הצעת מחיר.

### Summary — how many of 15 headlines per ad carried אוטובוס
| Ad | group | bus headlines / 15 |
|---|---|---|
| 816419150547 | טיולים ואירועים | 4 |
| 816438019647 | טיולים ואירועים | 3 |
| 816438019650 | הסעות לעובדים וכללי | 6 |
| 816454544560 | הסעות לעובדים וכללי | 6 |
| 816438019644 | חתונות | 2 |
| 816527498297 | חתונות | 3 |
| 816438019641 | נתב״ג | 3 |
| 816454215061 | נתב״ג | 4 |

Every one of the 8 ads also carried the pure-brand headline **"אבי ורדי הסעות"** (no bus word at all) at least once. This is the exact evidence behind Noam's original complaint ("nothing stated bus in the title... when they searched for different stuff, it also gave") — on average roughly 2/3 of each ad's headlines carried NO bus word, so Google was free to assemble headline combinations with zero mention of אוטובוס for unrelated queries.

---

## 3. PERFORMANCE (9 days, 2026-07-12 → 2026-07-20)

**Totals (7d window as pulled 2026-07-22, close to the full 9-day span):**
- Impressions: **303**
- Clicks: **20**
- Cost: **₪129.37**
- Conversions: **0**
- CTR: 6.6% · avg CPC: ₪6.47

**Daily shape:**
| date | impr | clicks | cost (₪) |
|---|---|---|---|
| 07-12 | 5 | 0 | 0 |
| 07-13 | 5 | 0 | 0 |
| 07-14 | 7 | 3 | 13.80 |
| 07-15 | 1 | 0 | 0 |
| 07-16 | 15 | 1 | 4.82 |
| 07-17 | 4 | 1 | 4.90 |
| 07-19 | 129 | 9 | 59.66 |
| 07-20 | 154 | 9 | 59.99 |

(07-18 = Shabbat, no data row.) Traffic was near-dead the first week (impression-starved — see below), then jumped sharply on 07-19/07-20 (~130-150 impressions/day, ~₪60/day — close to 2x the ₪30 daily budget on those two days), right after the 07-16 RSA rebuild (POOR ads expanded to 15H/4D) came out of Google's re-review.

**The 0-conversions finding:** across all 20 clicks and ₪129.37 spent over 9 days, **zero conversions were recorded.** The account-level ops log explicitly notes this is a real, structural gap, not a small-sample fluke — flagged repeatedly in `ops_log`/`alerts` across multiple runs (07-14, 07-17, 07-22).

**SYNTHETIC-TEST-only lead note:** the truth file's L1 recon explicitly records "0 real leads (only SYNTHETIC-TEST)" — i.e. the only lead-tracking hit on record during this window was a synthetic/test event, not a genuine customer inquiry. Combined with 0 conversions on 20 real clicks, this points at a **broken or unwired call/conversion-tracking action** rather than a demand problem — the ops log separately flags the AD_CALL conversion action as unconfirmed and recommends checking it in the Ads UI.

**Zero-click / zero-spend weekday flags (recurring across runs):** 2026-07-12, 07-13, 07-15 all logged zero spend despite being non-Shabbat weekdays past the campaign's launch grace period — an early symptom of the same impression-starvation the 07-16 RSA rebuild was meant to fix.

**Earlier (pre-window) diagnosis, 2026-07-14, still relevant:** 10 impressions / 0 clicks / ₪0 over the prior 30d — NOT a CPC problem (search_impression_share 47%, rank_lost_IS 35%, budget_lost_IS 18%). Diagnosed as impression-starved: tiny Hebrew niche + narrow geo + Ad Rank suppressed by ad strength (4 of 8 RSAs were POOR, 4 AVERAGE at the time). The CPC ceiling (₪5 at the time) was deliberately left alone — lowering it would have deepened rank-loss. Correct lever identified: fix ad strength (expand headlines), which is exactly what the 07-16 RSA rebuild did, and which correlates with the 07-19/07-20 traffic jump.

---

## 4. WHAT THE SEARCH TERMS TAUGHT US

75 distinct search terms logged in `ads.json.search_terms`, spanning multiple pull windows. The real signal, split genuine vs waste:

### Genuine, high-intent (price-shoppers and real bus-hire demand)
- "כמה עולה להשכיר אוטובוס ליום" (3 imp/1 clk/₪6.88)
- "כמה עולה לשכור אוטובוס ליום" (3 imp)
- "אוטובוס ליום שלם מחיר" (2 imp/1 clk/₪6.63)
- "השכרת אוטובוס ליום מחיר" (2 imp)
- "כמה עולה אוטובוס ליום" (1 imp)
- "כמה עולה הסעה באוטובוס" (1 imp)
- "השכרת אוטובוס לאירוע" (2 imp/1 clk/₪4.90 — the wedding/event-rental gap)
- "אוטובוס לחתונה" (3 imp)
- "אוטובוס לנתבג מירושלים" (1 imp, airport route, real intent)
These three price-shopper queries became the basis for the 3 new EXACT-match keyword adds in the 2026-07-23 changeset.

### Waste — the categories that were bleeding budget
1. **Job-seekers** (people looking for driver work, not a ride): "דרוש נהג אוטובוס זעיר פרטי" (4 imp/1 clk/₪6.98), "דרוש נהגים אוטובוס" (2 imp), "חיפוש עבודה נהג אוטובוס" (3 imp — contains אוטובוס but is pure job-search waste; foreman ruling in the 2026-07-23 changeset overrode the literal bus-word rule and paused it anyway), "עבודה הסעות", "נהג אוטובוס ממשלתי".
2. **Competitor brand names** picked up as broad-match noise: אור בוס / אורבוס / אור ירושלים הסעות (2-2-2 imp, one click ₪5.13), חבצלת הסעות (4 imp/1 clk/₪6.65), בון תור (1-1 imp), ברזני הסעות (2 imp), הורן הסעות, ליאם הסעות, מטיילי נהורה/שפע, מיה טורס, שעיבי הסעות, מסיעי דימונה, רבני הסעות, רם שן.
3. **Out-of-geo** — searches nowhere near the Jerusalem/Mevaseret service area: הסעה לאילת / הסעות לאילת, הסעות לאשדוד, הסעות בבני ברק (1 clk/₪6.56), הסעות לראשון לציון, חברת הסעות בראשון לציון, הסעות תל אביב (×2), חברת הסעות תל אביב, הסעות בצפון/ברמת הגולן/רמת הגולן, הסעות מודיעין עילית, הסעה לשדה התעופה בוורשה/בפראג (international airports — clearly out of scope).
4. **Private-driver / taxi intent** (Avi runs a bus, not a private car/taxi service): דרייבר ירושלים (1 imp but 2 clk/₪13.96 — the single most expensive search term per-click in the data), דרייבר ירושלים טלפון, היימישע דרייבר, נהג הסעות פרטי, שירות הסעות פרטי, כמה עולה נהג פרטי, taxi app israel (English, added as negative), driver service, transportation office near me.
5. **Accessibility / off-fleet needs the single bus can't serve:** הסעות לנכים עם כסא גלגלים (1 clk/₪6.93), הסעות לנכים עם מעלון — genuine need, but not a fleet fit.
6. **Public transit lookups** (people looking for scheduled bus lines, not private rental): קו 485 מירושלים לנתבג, קו מירושלים לנתבג — flagged repeatedly (2026-07-17 and again in the changeset) as a borderline category deliberately NOT added as a negative on low evidence, logged for Noam's judgment if it recurs with real spend attached.
7. **Minibus-flavored queries**: מיניבוסים, מיניבוסים הסעות — these were live positive-keyword territory for most of the campaign's history (the account targeted מיניבוס rental as a theme through 07-22) and were only reclassified as pure waste once Noam's 2026-07-23 "one 56-seat bus, no minibus" law landed — at which point they were deliberately paused/negatived.

---

## 5. NEGATIVES HISTORY

- **2026-07-11 (pre-launch):** 31 negatives already in place before any traffic.
- **2026-07-14T15:10:00Z:** +10 BROAD negatives added blocking buy/lease-a-bus and taxi confusion — `מונית, מוניות, למכירה, מכירה, קניית, אוטובוס למכירה, יד שניה, יד 2, ליסינג, מחירון`. (Log records this as "30 → 40" — a small inconsistency against the "31 existing" figure from 07-11, not reconciled in the source logs; flagged here rather than silently smoothed over.) Grep-checked against the live keyword list first (the negative-self-block rule) — zero containment hits.
- **2026-07-16T11:08:00Z:** Search-term audit found ZERO junk in that window's 6 terms — no new negatives added; negatives held at 40.
- **2026-07-22T17:30:00Z:** +2 campaign negatives — `דרוש` (job-seeker, covers "דרוש נהג אוטובוס זעיר פרטי" + "דרוש נהגים אוטובוס") and `taxi` (covers "taxi app israel"). Self-block checked clean against all 71 live positive keywords. Deliberately did **NOT** add `מיניבוס` this run — at the time it would have self-blocked against 8 live positive מיניבוס keywords in the נתב״ג group (the account was still actively targeting minibus rental as a theme). Landed at **40 negatives total**, independently confirmed via a fresh GAQL itemized pull on 2026-07-23 (40 distinct negative-keyword texts: taxi, אגד, אוטובוס למכירה, אילת, באר שבע, בית ספר, בסיס, בר/בת מצווה, בתי ספר, גן/גני ילדים, דרוש, דרושים, הובלה, חיילים, חינם, חיפה, יד 2/יד שניה, ילדים, לוח זמנים, ליסינג, למכירה, מוניות, מונית, מחירון, מכירה, משאית, משרה, צבא, קווים, קורס, קייטנה/קייטנות, קניית, רישיון, רכבת, תחבורה ציבורית, תעודה).
- **2026-07-23 changeset (staged, not yet pushed as of this writing):** the tightened "one bus, no minibus" law flips מיניבוס from a targeted positive theme to a hard negative. Plan: pause the 8 live מיניבוס-containing positive keywords first, THEN add `מיניבוס`/`מיניבוסים` as negatives (self-block-safe only in that order) — plus promote 3 previously-skipped out-of-geo negatives (`ראשון לציון`, `תל אביב`, `צפון`) and `עבודה` (job-seeker) once their blocking positives are paused, plus 26 competitor-brand/personal-driver/off-fleet/tenders negatives, plus 7 add-if-absent public-transit negatives (אגד, רכבת, תחבורה ציבורית, קווים, לוח זמנים, תחנה מרכזית, רב קו). Net ~31 of 39 candidates survive dedup (3 were already live: אילת, קורס, רישיון; 5 add-if-absent ones were also already live).

**The self-block lesson (the load-bearing rule across every run):** never add a negative keyword whose text is a substring of a still-live positive keyword — it silently kills your own traffic. Every negative-add in this campaign's history was grep/GAQL-checked against the live positive-keyword list first, and the ordering rule ("pause the positives, THEN add the negative") is what made the מיניבוס/עבודה/geo negatives safe to add in the 2026-07-23 changeset. Full incident writeup: Second Brain note `google-ads-negative-keyword-self-block.md`.

---

## 6. LESSONS / WHAT WE'D KEEP (transferable to any future campaign)

1. **Every headline must carry the core keyword, literally.** "אוטובוס" appearing in only 2-6 of 15 headlines per ad let Google mix-and-match headline combinations with zero mention of the core product for irrelevant queries — this was the entire root cause of Noam's original complaint. The fix (all 56 new headlines contain the literal word, unpinned) also maximizes Google's combination-testing surface, which is a secondary Ad Rank benefit.
2. **0 conversions on real clicks + spend, with only a SYNTHETIC-TEST hit on record, points at broken tracking before it points at bad targeting.** Check the conversion action (here: AD_CALL) actually fires before concluding the campaign "doesn't convert."
3. **Broad match on a narrow, low-volume niche imports huge amounts of adjacent-but-wrong intent**: job-seekers, competitor brand names, other cities, private-driver/taxi searches, accessibility needs the fleet can't serve. A tiny campaign (303 impressions over 9 days) still generated 75 distinct search terms across all of these waste categories — narrow niches need MORE negative-keyword discipline, not less, because there's no volume to dilute the noise.
4. **Negative-keyword self-block is a real, recurring failure mode** — always check a candidate negative against the live positive-keyword list (substring match) before adding it, and when a theme flips from positive to negative (מיניבוס here), pause the positives first.
5. **Ad strength (POOR ad-strength RSAs) directly suppresses Ad Rank and impressions**, independent of CPC — this account was impression-starved with 4 of 8 RSAs POOR; expanding to 15 headlines/4 descriptions per RSA correlates with the 07-19/07-20 traffic jump. Lowering CPC to "fix" low traffic is often the wrong lever when the real problem is ad strength.
6. **Google Ads developer-token "basic access" quota is a brief-trickle bucket**, not an always-open door — this account hit 429 RESOURCE_EXHAUSTED repeatedly across both READ and WRITE (mutate) buckets, on separate occasions, including immediately after a single foreman probe consumed the whole trickle window. Composio's OAuth path and the REST-proxy path share the same underlying dev-token quota — probing on a "fallback" route wastes the same budget. Durable fix identified but not yet done: apply for Standard access to remove the 15k/day basic cap.
7. **Headless/cron sessions cannot reliably sustain the Composio OAuth session** — interactive sessions recovered repeatedly when headless cron runs failed on "unauthenticated" errors, a structurally different failure mode from the quota 429s.
8. **Company-fact accuracy in ad copy matters and drifts if not re-asserted** — the "one 56-seat bus, no minibus" fact had to be explicitly re-stated by Noam on 2026-07-23 because the campaign had organically grown a minibus-targeting theme (positive keywords + headline mentions) over its history; nothing enforced the original fleet-fact once it was set.
9. **REMOVE vs PAUSE is a meaningful distinction Noam cares about** — "תמחק את המודעות הלא טובות" (delete, not pause) was an explicit, deliberate instruction, distinct from the otherwise-standing "pausing is reversible, prefer it" default used for keywords.
10. **A verify-changeset script that asserts every hard law (bus-word substring, char limits, no-minibus, self-block-clean, pause-set-matches-live) before any mutation fires is what let this changeset survive a multi-day, multi-attempt quota-blocked push without ever landing an inconsistent partial state.**

**Related knowledge already banked:** Second Brain notes `google-ads-negative-keyword-self-block.md` and `composio-googleads-api-write-path.md`; truth file `Executive Assistant/plans/GOOGLE-ADS-BUS-FIX-2026-07-22-PLAN.md` (full STATE log of the whole diagnosis-to-push saga).
