# CHANGESET — Google Ads bus-campaign fix (אבי ורדי הסעות)

**Built:** 2026-07-22 (staged; API quota-blocked ~15h, push runs after ~05:00 IL 2026-07-23)
**Account:** customer `1128064207` · Search campaign `24022931741` "אבי ורדי — חיפוש" (**stays PAUSED** — re-enable is Noam's tap only)
**Directive:** *"every title will have a bus in it — if someone needs a bus, he just writes a bus. Find the titles that give the best conversion rate."*

**Machine source-of-truth files in this dir** (the runbook builds payloads from these, not from the prose below):
`headlines.json` (RSAs) · `keyword-adds.json` (exact adds) · `keyword-pauses.json` (pauses) · `negatives.json` (negative candidates + self-block verdicts) · `verify-changeset.cjs` (the check).

**Verify output:** `node verify-changeset.cjs` → **PASS** (56/56 headlines ≤30 chars + bus word; 16/16 descriptions ≤90; self-block table clean; 4 exact adds new + bus-worded). Re-run it any time.

---

## A. New RSAs — one per ad group

**The design principle:** *every* headline in *every* RSA contains a bus word (אוטובוס / הסעה / הסעות / מיניבוס). Because of that, no matter which 3 headlines Google assembles, a bus word always shows — so **no pinning is required** to satisfy Noam's rule. This is deliberate:

- **Pinning recommendation: PIN NOTHING (all headlines unpinned), all 4 groups.** The task allows "at most one pinned headline"; I use zero. Justification: the bus-word guarantee is already structural (all headlines carry it), so no slot needs a pin to protect it. Every pin cuts Google's testable combinations (~75% per pinned slot, industry figure) and the diagnosed bottleneck here is **ad strength / Ad Rank suppression** (4 of 8 old RSAs were POOR → impression-starved). Maximum unpinned combinations = best ad strength = the exact lever that fixes serving. Pinning would fight the fix.
- 14 headlines + 4 descriptions per group (Google max is 15H/4D; 14 leaves headroom and all are strong).
- Char counts below are graphemes (Hebrew letter / gershayim = 1), matching Google's counter. All ≤30 / ≤90.
- Final URL: `https://www.avivardi.online` (unchanged). Sitelinks unchanged (already all bus/airport/wedding themed).

### Group 1 — טיולים ואירועים  (ad_group `197000680966`)
Theme: trip & group-outing bus rental. Grounded in live keywords (אוטובוס לטיול, השכרת אוטובוס עם נהג, קבוצות) + research (השכרת אוטובוס עם נהג).

| # | Headline | chars |
|---|---|---|
| 1 | השכרת אוטובוס לטיולים | 21 |
| 2 | אוטובוס לטיול עם נהג צמוד | 25 |
| 3 | אוטובוס 56 מקומות לטיול | 23 |
| 4 | הסעות לטיולים בכל הארץ | 22 |
| 5 | השכרת אוטובוס ממוזג לטיול | 25 |
| 6 | אוטובוס לקבוצות וטיולים | 23 |
| 7 | הצעת מחיר לאוטובוס לטיול | 24 |
| 8 | אוטובוס לטיול - מחיר משתלם | 26 |
| 9 | הסעות לטיולים מירושלים | 22 |
| 10 | אוטובוס לטיול בית ספר | 21 |
| 11 | נהג צמוד לכל טיול באוטובוס | 26 |
| 12 | אוטובוס לטיול - זמינות מלאה | 27 |
| 13 | השכרת אוטובוס לאירועים | 22 |
| 14 | אוטובוס לטיול קבוצתי | 20 |

Descriptions (≤90): see `headlines.json` group 1 — price/fleet, identity (בלי מוקדים), use-cases, trust.

### Group 2 — הסעות לעובדים וכללי  (ad_group `198995179115`)
Theme: employee shuttles + general rental + **price** (this group carries the price-shopper exact-match adds). Grounded in the only clicking keyword family (מחיר השכרת אוטובוס, השכרת אוטובוס) + search terms (כמה עולה … אוטובוס ליום).

| # | Headline | chars |
|---|---|---|
| 1 | השכרת אוטובוס לעובדים | 21 |
| 2 | הסעות עובדים באוטובוס | 21 |
| 3 | מחיר השכרת אוטובוס ליום | 23 |
| 4 | אוטובוס עם נהג ליום שלם | 23 |
| 5 | השכרת אוטובוס - הצעת מחיר | 25 |
| 6 | אוטובוס 56 מקומות להשכרה | 24 |
| 7 | הסעות קבועות לעובדים | 20 |
| 8 | כמה עולה אוטובוס ליום? | 22 |
| 9 | אוטובוס ממוזג עם נהג צמוד | 25 |
| 10 | השכרת אוטובוס בירושלים | 22 |
| 11 | הסעות עובדים - מחיר משתלם | 25 |
| 12 | אוטובוס להשכרה לכל מטרה | 23 |
| 13 | הצעת מחיר לאוטובוס מיידית | 25 |
| 14 | אוטובוס לעובדים - נהג צמוד | 26 |

### Group 3 — חתונות  (ad_group `201158533351`)
Theme: wedding/event guest shuttles. Grounded in live keywords (אוטובוס לחתונה, השכרת אוטובוס לאירוע) + search terms (אוטובוס לחתונה, השכרת אוטובוס לאירוע).

| # | Headline | chars |
|---|---|---|
| 1 | אוטובוס לחתונה עם נהג | 21 |
| 2 | השכרת אוטובוס לחתונה | 20 |
| 3 | הסעות אורחים לחתונה | 19 |
| 4 | אוטובוס 56 מקומות לחתונה | 24 |
| 5 | הסעות לאירועים וחתונות | 22 |
| 6 | אוטובוס ממוזג לחתונה | 20 |
| 7 | הצעת מחיר להסעות חתונה | 22 |
| 8 | אוטובוס לחתונה בירושלים | 23 |
| 9 | הסעות לחתונה - נהג צמוד | 23 |
| 10 | אוטובוס לאירוע עם נהג | 21 |
| 11 | הסעת אורחים באוטובוס | 20 |
| 12 | אוטובוס מפואר לחתונה | 20 |
| 13 | השכרת אוטובוס לאירועים | 22 |
| 14 | אוטובוס לחתונה - זמינות מלאה | 28 |

### Group 4 — נתב״ג  (ad_group `202032774927`)
Theme: airport transfers, **leaning מיניבוס** (per brief) alongside אוטובוס. Grounded in the airport keyword/search family (אוטובוס לנתבג מירושלים = 10imp/2clk, אוטובוס לשדה תעופה) + geo (מבשרת ציון).

| # | Headline | chars |
|---|---|---|
| 1 | אוטובוס לנתב״ג מירושלים | 23 |
| 2 | מיניבוס לנתב״ג עם נהג | 21 |
| 3 | הסעות לשדה התעופה נתב״ג | 23 |
| 4 | אוטובוס לנתב״ג 24 שעות | 22 |
| 5 | מיניבוס לשדה תעופה | 18 |
| 6 | הסעה לנתב״ג ממבשרת ציון | 23 |
| 7 | אוטובוס לטיסה - נהג צמוד | 24 |
| 8 | מיניבוס לנתב״ג מירושלים | 23 |
| 9 | הסעות נתב״ג בכל שעה | 19 |
| 10 | אוטובוס 56 מקומות לנתב״ג | 24 |
| 11 | מיניבוס ממוזג לשדה תעופה | 24 |
| 12 | הסעה פרטית לנתב״ג | 17 |
| 13 | אוטובוס לנתב״ג - הזמנה מהירה | 28 |
| 14 | מיניבוס לנתב״ג עם נהג צמוד | 26 |

---

## B. Keyword changes

### B1. ADD — exact-match price-shoppers (4)  → group הסעות לעובדים וכללי (`198995179115`)
All contain a bus word; none duplicate any of the 72 live keywords (verifier confirmed). Exact match captures the proven price-shopper queries tightly with no close-variant leak.

| Keyword | Match | Evidence |
|---|---|---|
| כמה עולה להשכיר אוטובוס ליום | EXACT | search term 3 imp / 1 clk |
| כמה עולה לשכור אוטובוס ליום | EXACT | search term 3 imp |
| אוטובוס ליום שלם מחיר | EXACT | search term 2 imp / 1 clk |
| הצעת מחיר הסעות | EXACT | research: top-intent quote query (highest commercial intent) |

### B2. PAUSE — waste-generating positives (11, all in נתב״ג `202032774927`)
These are the BROAD generic non-bus / out-of-geo / job keywords that pull exactly the waste Noam flagged (personal-driver דרייבר, competitor brands, out-of-geo, job-seekers). Pausing is reversible (re-enable any time). **Criterion IDs are NOT in the snapshot — the runbook pulls them fresh by text before pausing.**

| Keyword | Priority | Why |
|---|---|---|
| חיפוש עבודה נהג אוטובוס | HIGH | job-seeker intent ("bus driver job search") — invites job-seekers |
| נהג הסעות | HIGH | driver intent, 7imp/1clk/₪6.98 — pulls נהג/דרייבר personal-driver waste |
| נהג הסעות פרטי | HIGH | private-driver intent |
| שירות הסעות פרטי | HIGH | private-driver intent |
| הסעות פרטיות | HIGH | private-transport generic — pulls דרייבר / personal-driver |
| חברת הסעות בראשון לציון | LOW | out-of-geo (Rishon) |
| הסעות תל אביב | LOW | out-of-geo (TLV) |
| חברת הסעות תל אביב | LOW | out-of-geo (TLV) |
| הסעות בצפון | LOW | out-of-geo (North) |
| חברת הסעות בצפון | LOW | out-of-geo (North) |
| חברת הסעות בדרום | LOW | out-of-geo (South) |

Pausing the four SELF-BLOCK positives above (ראשון לציון / תל אביב / צפון / job) also *unblocks* the corresponding geo/job negatives — but we don't need those negatives once the positives are paused, so we simply skip them (see C).

### B3. CONVERT broad → phrase — RECOMMENDATION ONLY (not in the automated push)
Match type is immutable in Google Ads, so a "convert" = remove the broad + create the phrase (a heavier, higher-judgment change). Left as a recommendation for a later interactive pass:

- `שירותי הסעות` (36imp/3clk/₪20.05), `חברות הסעה` (31imp/3clk/₪19.58) — generic BROAD, biggest competitor-brand leak vectors. → phrase.
- `הסעות ירושלים` (41imp/3clk/₪20.61), `הסעות לירושלים`, `הסעות מירושלים` — geo-relevant but BROAD. → phrase (keeps Jerusalem intent, drops the broad expansion).

### B4. KEEP — everything else
All bus-worded (אוטובוס/מיניבוס) keywords, the מיניבוס family, event/employee price keywords, and airport-specific אוטובוס-לנתב״ג keywords stay ENABLED unchanged.

---

## C. Negative keyword additions

**HARD-LAW self-block check ran programmatically** (`verify-changeset.cjs`): each candidate substring-grepped against ALL 72 live positive keyword texts from `ads.json`. Full table below. Match type: single-token → BROAD; multi-word brand/phrase → PHRASE (won't over-block). **Runbook re-runs this against the FRESH keyword pull, and dedups every candidate against the fresh negative list (the 40 existing negatives are not itemized in the snapshot).**

### C1. ADD (self-block CLEAR) — competitor brands, personal-driver, off-fleet, out-of-geo, jobs, tenders, toys

| Candidate | Match | Category | Self-block |
|---|---|---|---|
| דרייבר | BROAD | personal-driver (top waste ₪13.96) | CLEAR |
| נהג פרטי | PHRASE | personal-driver | CLEAR |
| אור בוס | PHRASE | competitor brand (₪5.13) | CLEAR |
| אורבוס | PHRASE | competitor brand | CLEAR |
| אור ירושלים | PHRASE | competitor brand | CLEAR |
| חבצלת | BROAD | competitor brand (₪6.65) | CLEAR |
| בון תור | PHRASE | competitor brand | CLEAR |
| ברזני | BROAD | competitor brand | CLEAR |
| הורן | BROAD | competitor brand | CLEAR |
| ליאם | BROAD | competitor brand | CLEAR |
| מטיילי | BROAD | competitor brand | CLEAR |
| מיה טורס | PHRASE | competitor brand | CLEAR |
| שעיבי | BROAD | competitor brand | CLEAR |
| מסיעי | BROAD | competitor brand | CLEAR |
| רבני | BROAD | competitor brand | CLEAR |
| רם שן | PHRASE | competitor brand | CLEAR |
| נכים | BROAD | off-fleet accessible (₪6.93) | CLEAR |
| כסא גלגלים | PHRASE | off-fleet accessible | CLEAR |
| מעלון | BROAD | off-fleet accessible | CLEAR |
| בני ברק | PHRASE | out-of-geo (₪6.56) | CLEAR |
| אילת | BROAD | out-of-geo | CLEAR |
| אשדוד | BROAD | out-of-geo | CLEAR |
| קורס | BROAD | jobs/licensing | CLEAR |
| רישיון | BROAD | jobs/licensing | CLEAR |
| מכרז | BROAD | B2G tender | CLEAR |
| צעצוע | BROAD | toys | CLEAR |

### C2. ADD-IF-ABSENT (self-block CLEAR; likely already negatives per the 2026-07-17 log — dedup at runtime)
`אגד` · `רכבת` · `תחבורה ציבורית` · `קווים` · `לוח זמנים` · `תחנה מרכזית` · `רב קו` — all public-transit intent, all CLEAR. Add only the ones not already in the fresh negative pull.

### C3. SKIP (self-block HIT — do NOT add; the paused positive handles the intent instead)

| Candidate | Hits (live positive) | Handled by |
|---|---|---|
| ראשון לציון | חברת הסעות בראשון לציון | pause that positive (B2) |
| תל אביב | הסעות תל אביב, חברת הסעות תל אביב | pause those positives (B2) |
| צפון | הסעות בצפון, חברת הסעות בצפון | pause those positives (B2) |
| עבודה | חיפוש עבודה נהג אוטובוס | pause that positive (B2) |
| מיניבוס | 8 live מיניבוס positives | PERMANENT skip — account targets minibus rental |

### C4. Already covered (do not re-add — dedup at runtime)
From prior runs: `מונית/מוניות/taxi` (taxi), `למכירה/מכירה/קניית/אוטובוס למכירה/יד שניה/יד 2/ליסינג/מחירון` (used-bus sales), `דרוש` (job-seeker). Runbook dedups against the fresh pull regardless.

---

## D. Bidding / budget / geo — RECOMMENDATION ONLY (NOT in the automated push)

- **Budget:** keep **₪30/day** unchanged. Spend is already hitting ~2× budget on active days (₪59.66 / ₪59.99 on 07-19/07-20) — no room or reason to raise while conversions = 0.
- **Bidding:** leave as-is (per RUN-KIT's manual-CPC posture). Do NOT switch to a conversion-based smart-bidding strategy yet — there are **0 conversions** to train on; smart bidding with no conversion data would starve delivery further. Revisit only after the AD_CALL conversion action logs real calls.
- **Geo:** the out-of-geo waste (TLV/North/South/Rishon) is better solved at the **campaign location-targeting** level than with keyword pauses/negatives. Recommend Noam tighten campaign geo to Jerusalem + Mevaseret Zion + Shoham radius in the Ads UI. Left out of the automated push (campaign-criteria geo edit = higher-judgment; not requested).
- **Conversion tracking sanity:** 0 conversions across 303 imp / 20 clicks over 9 days is the real headline. Before/at re-enable, Noam should confirm the AD_CALL conversion action is actually firing (call-from-ad tracking), otherwise optimization is flying blind. Flagged, not actioned.

---

## E. Summary counts
- **RSAs:** 4 new (one per group), 56 headlines total (all ≤30 + bus word), 16 descriptions (all ≤90). Old 8 RSAs → PAUSED (not removed).
- **Keywords:** +4 exact adds · 11 pauses · 0 removals · (5 broad→phrase converts = recommendation only).
- **Negatives:** up to 26 CLEAR adds + 7 add-if-absent, 5 self-block skips, ~11 already-covered dedups.
- **Campaign status:** unchanged (PAUSED). Re-enable = Noam's tap (money gate).
