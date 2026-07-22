# CHANGESET — Google Ads bus-campaign fix (אבי ורדי הסעות)

**Built:** 2026-07-22 · **Revised to Noam's tightened law:** 2026-07-23 (API quota-blocked ~15h; push runs via launchd after quota reset)
**Account:** customer `1128064207` · Search campaign `24022931741` "אבי ורדי — חיפוש"
**Directive (verbatim, 2026-07-23):** *"כותרת מחויבת במילה אוטובוס לפחות. לא מיניבוס וכו · הכלי היחיד שיש בחברה זה אוטובוס · תמחק את המודעות הלא טובות · תתקן הכל כולל להפעיל את הפרסומת."*

## THE TIGHTENED LAW (supersedes the earlier 4-bus-word rule everywhere)
1. **Every headline contains the literal word אוטובוס** (substring — לאוטובוס/האוטובוס/באוטובוס count). הסעות/הסעה/מיניבוס alone NO LONGER qualify.
2. **The fleet is ONE 56-seat bus. NO minibus anywhere** — not in headlines, descriptions, or positive keywords.
3. **The ad may show only on searches containing אוטובוס** → every live keyword lacking אוטובוס is PAUSED (30 keywords).
4. **The 8 old ads are REMOVED** (deleted), not paused.
5. **The campaign is ENABLED** as the final mutation — only after post-verify passes. (The old "keep PAUSED / re-enable is Noam's tap" law is REVOKED — Noam approved the enable.)
6. **Bidding:** if strategy is Maximize Clicks (TARGET_SPEND), cap CPC at ₪8 (8,000,000 micros); else leave bidding untouched and report it. Budget stays ₪30/day.

**Machine source-of-truth files** (the runbook builds payloads from these, not from the prose below):
`headlines.json` · `keyword-adds.json` · `keyword-pauses.json` · `negatives.json` · `build-payloads.cjs` → `payloads.generated.json` · `verify-changeset.cjs` (the check) · `PUSH-RUNBOOK.md` (the blind-executable push).

**Verify output:** `node verify-changeset.cjs` → **PASS** (56/56 headlines ≤30 chars + literal אוטובוס, 0 minibus; 16/16 descriptions ≤90, 0 minibus; pause list == the 30 live non-אוטובוס keywords + 1 explicit job-seeker exception = 31; negatives self-block-clear vs the surviving active set; 3 exact adds new + bus-worded). Re-run any time.

---

## A. New RSAs — one per ad group
**Design principle:** every headline in every RSA contains the literal word אוטובוס, so whatever 3 headlines Google assembles, אוטובוס always shows — **no pinning required** (all headlines unpinned, all 4 groups), which maximizes Google's combination testing and lifts the ad strength / Ad Rank that was the diagnosed bottleneck (4 of 8 old RSAs were POOR → impression-starved).
- 14 headlines + 4 descriptions per group (Google max 15H/4D). Char counts = graphemes (Hebrew letter / gershayim = 1), matching Google's counter; all ≤30 / ≤90 (see `verify-changeset.cjs` output for the per-line table).
- Final URL `https://www.avivardi.online` (unchanged). Sitelinks unchanged.
- **נתב״ג group is bus-to-airport only** — every minibus headline was reworked to an אוטובוס phrasing (e.g. אוטובוס לנתב״ג מירושלים / אוטובוס לשדה התעופה / אוטובוס פרטי לנתב״ג).
- Descriptions keep the brand line **אבי ורדי הסעות** (brand NAME — allowed; the hard אוטובוס rule is on headlines, and "no minibus service" is enforced by stripping every minibus mention, e.g. "אוטובוס או מיניבוס ממוזג" → "אוטובוס ממוזג").

Full 56-headline / 16-description bank: `headlines.json`.

## B. Keyword changes

### B1. ADD — exact-match price-shoppers (3) → group הסעות לעובדים וכללי (`198995179115`)
All contain אוטובוס; none duplicate a live keyword. The earlier 4th add "הצעת מחיר הסעות" was **DROPPED** — it lacks אוטובוס (law #1).

| Keyword | Match | Evidence |
|---|---|---|
| כמה עולה להשכיר אוטובוס ליום | EXACT | search term 3 imp / 1 clk |
| כמה עולה לשכור אוטובוס ליום | EXACT | search term 3 imp |
| אוטובוס ליום שלם מחיר | EXACT | search term 2 imp / 1 clk |

### B2. PAUSE — every live keyword lacking אוטובוס + 1 job-seeker exception (31, all in נתב״ג `202032774927`)
The whole non-אוטובוס set, computed from `ads.json` (law #3): generic הסעות/הסעה, all 8 minibus positives (הסעות מיניבוסים, מחיר מיניבוס, מיניבוס ירושלים …), driver/private-transport, and out-of-geo. Full list in `keyword-pauses.json`. **Criterion IDs are pulled fresh by exact text at push time.** Pausing is reversible.

**Foreman ruling (2026-07-23):** `חיפוש עבודה נהג אוטובוס` (a job-seeker keyword) CONTAINS אוטובוס, but a job search is waste regardless of wording — Noam's intent (irrelevant traffic never sees the ad) outranks the mechanical letter. It IS paused, as an explicit exception (verifier whitelists it). Consequently the `עבודה` negative is now self-block-clear and PROMOTED to an add (see C1).

### B3. KEEP — the 41 אוטובוס keywords stay ENABLED unchanged.

## C. Negative keyword additions
Self-block check (`verify-changeset.cjs`) now runs each candidate against the **surviving active set** (the 41 live keywords containing אוטובוס — the non-bus ones are paused in B2 first, so negatives are checked against what remains). Match type: single token → BROAD; multi-word brand/phrase → PHRASE. Runbook re-runs this against the fresh pull and dedups against the live negative list.

### C1. ADD (self-block CLEAR)
- **minibus (NEW, law #2):** `מיניבוס`, `מיניבוסים` (BROAD) — the fleet has no minibus. Added **ONLY AFTER** the 8 minibus positives are paused (runbook ordering); now self-block-safe.
- **PROMOTED ex-skips (NEW):** `ראשון לציון`, `תל אביב` (PHRASE), `צפון` (BROAD) — their blocking positives are now paused (B2), so these are clear and become out-of-geo negatives.
- **PROMOTED ex-skip `עבודה` (BROAD, NEW):** job-seeker waste — its only blocking positive `חיפוש עבודה נהג אוטובוס` is now paused (B2 foreman exception), so it is self-block-clear. Added after the pauses land (like מיניבוס).
- **competitor brands / personal-driver / off-fleet / out-of-geo / jobs / tenders / toys (26):** דרייבר, נהג פרטי, אור בוס, אורבוס, אור ירושלים, חבצלת, בון תור, ברזני, הורן, ליאם, מטיילי, מיה טורס, שעיבי, מסיעי, רבני, רם שן, נכים, כסא גלגלים, מעלון, בני ברק, אילת, אשדוד, קורס, רישיון, מכרז, צעצוע — all CLEAR.

### C2. ADD-IF-ABSENT (public-transit; dedup at runtime)
`אגד` · `רכבת` · `תחבורה ציבורית` · `קווים` · `לוח זמנים` · `תחנה מרכזית` · `רב קו`.

### C3. SKIP (self-block HIT)
None. All earlier skips (ראשון לציון/תל אביב/צפון/מיניבוס/עבודה) were promoted to adds once their blocking positives entered the pause set.

## D. Bidding / budget / geo
- **Bidding:** CONDITIONAL — `campaign_bidding_ceiling_CONDITIONAL` op applies `cpc_bid_ceiling_micros = 8000000` (₪8) **only if** the fresh Step-1 pull shows `bidding_strategy_type == TARGET_SPEND` (Maximize Clicks). Any other strategy → dropped + reported, no bidding change.
- **Budget:** keep **₪30/day** unchanged (never touched by the push).
- **Geo / conversion tracking:** out-of-geo is better solved at campaign location-targeting; 0 conversions across 303 imp / 20 clicks remains the real headline — confirm the AD_CALL conversion action fires. Both flagged for Noam's UI, not in the automated push.

## E. Summary counts
- **RSAs:** 4 new (56 headlines, all ≤30 + literal אוטובוס, 0 minibus; 16 descriptions, all ≤90, 0 minibus). Old 8 RSAs → **REMOVED**.
- **Keywords:** +3 exact adds (all אוטובוס) · **31 pauses** (30 non-אוטובוס live + 1 job-seeker exception `חיפוש עבודה נהג אוטובוס`) · 0 removals.
- **Negatives:** 32 CLEAR "add" (incl 2 minibus + 3 promoted geos + עבודה) + 7 add-if-absent = 39 pre-dedup · 0 skips.
- **Bidding:** ₪8 CPC ceiling IF Maximize Clicks, else unchanged · budget ₪30/day unchanged.
- **Campaign status:** **ENABLED** as the last mutation, gated on the bus-word post-verify passing.
