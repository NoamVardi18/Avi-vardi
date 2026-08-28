# Changeset 2026-08-28 — APPLIED and verified live

Account `1128064207` · campaign `24022931741` · applied via Composio connector,每 mutation
dry-run (`validate_only`) first, then re-queried independently to confirm it landed.

## The finding that mattered

**The account was serving zero ads.** Every ad group was mismatched with its own ad:

| Ad group | group | its only ad | approval |
|---|---|---|---|
| טיולים ואירועים | ENABLED | **PAUSED** | APPROVED |
| הסעות לעובדים וכללי | ENABLED | **PAUSED** | APPROVED |
| חתונות | ENABLED | **PAUSED** | APPROVED |
| נתב״ג | **PAUSED** | ENABLED | APPROVED |

Three live groups whose only ad was paused; one live ad inside a paused group. No policy problem —
all four ads APPROVED. This is why there were 0 conversions and no charter enquiries. The ₪496.50 /
49 clicks in the trailing 30 days was spent *before* the account went dark.

## Two other real defects found

1. **Hebrew prefix forms defeat negative keywords.** `אילת` was a live BROAD negative, yet
   `אוטובוס לאילת` took 3 clicks / ₪49.94. Every Eilat leak used the prefixed form `לאילת`, never
   the bare word. Same for `צפון` vs `אוטובוס לצפון` (₪17.01). Someone had already discovered this
   for one word — the list carried both `נתבג` and `לנתבג` — but never generalised the fix.
   **Standing rule: every Hebrew negative needs its ל/מ/ב/ה/ו/ש/כ prefix variants added explicitly.**

2. **~~Self-block in the נתב״ג group.~~ CORRECTED — this is deliberate, not a defect.**
   The BROAD negatives `לנתבג` and `לטיסה` do block 10 of the 12 keywords in the נתב״ג ad group.
   That is **intentional**: commit `1659fa3` (2026-08-05) records Noam's ruling that airport runs are
   unprofitable — *"short cheap job, blocks the whole day"* — and that pausing the group was
   **insufficient on its own**, because broad keywords in the other live groups still matched airport
   queries. The negative wall is what actually closes it. Do **not** remove those negatives.

   That same commit also already states the prefix rule: *"Hebrew negatives do not stem, so every
   prefixed variant is deliberate."* It was known on 2026-08-05 and applied to the airport terms
   only — because those were the terms being closed. It was never a forgotten generalisation.

3. **The group named `הסעות לעובדים וכללי` contained zero employee-shuttle keywords** — all 16 were
   bus-rental. Renamed to `השכרת אוטובוס — כללי` so the name stops lying.

## What was applied

- **CPC ceiling ₪6.00** on portfolio strategy `12186451073` (`cpcBidCeilingMicros: 6000000`).
  Previously unset — no ceiling at all. Verified by fresh re-query.
  *Caveat: a ceiling caps the max bid; Maximize Clicks still varies underneath it. A genuinely fixed
  price per click means Manual CPC, which carries the 2026-08-07 ₪0.01 trap. Not done.*
- **36 campaign negatives added** — prefix forms (`לאילת`/`מאילת`/`לצפון`/`למירון`/`לטבריה`),
  ticket & line words (`כרטיס`/`כרטיסים`/`קווי`/`תחנה`/`לוח זמנים`), and ~25 competitor brands
  (`סופרבוס`, `אפיקים`, `אלקטרה`, `נתיב`, `אקספרס`, `תנופה`, `אקסטרה`, `מאיה`, `דן אוטובוסים`,
  `ציר תיור`, …).
- **28 EXACT keywords created**, including the ירושלים/מודיעין origin set Noam asked for
  (`[אוטובוס מירושלים]`, `[השכרת אוטובוס ממודיעין]`, `[אוטובוס לטיול מירושלים]`, …).
- **31 PHRASE keywords paused** (paused, never removed — reversible).
- **`טיולים ואירועים` ad ENABLED** — the single group Noam chose to switch on first.

## Verified end state (fresh query, not the mutate response)

- **31 ENABLED keywords across the 3 live groups — 100% EXACT, 100% contain the word אוטובוס.**
  Zero PHRASE or BROAD keywords remain enabled anywhere.
- Serving: `טיולים ואירועים` only. `השכרת אוטובוס — כללי` and `חתונות` have live groups with paused
  ads, ready to switch on. `נתב״ג` paused.
- Self-block check before applying: **0 collisions** across the 28 new keywords.

## The honest limit

Exact match plus a negative wall gets roughly 95% of the way to "only show when the searcher typed
אוטובוס" — **it is not airtight**. Google still serves exact-match keywords on close variants, which
is how `חברת הסעות בירושלים` (10 impressions, no "אוטובוס" in it) matched the keyword
`חברת אוטובוסים` under phrase match. The remaining leakage is caught by a weekly search-terms sweep,
not by anything configurable in the account.

## Next

1. Watch the search-terms report in ~7 days; add any new leak as a negative **with its prefix forms**.
2. Conversion tracking is still unwired (0 conversions = UNMEASURED, not "nobody responded"). Until it
   exists every bid decision here is tuned against clicks, not leads. Site is `avivardi.online`,
   source in `Avi-vardi/client/` — no Google tag present, only Umami.
3. `KEYWORDS.md` is still a planning draft that does not describe the live account. This file and
   `CAMPAIGN-STATUS.md` are the truth.

---

# Wave 2 — mined from all-time search terms (2026-06-01 → 2026-08-28)

## 12 EXACT keywords added, every one a query this account actually received

Mined from `search_term_view` over the full campaign history, not invented:

| keyword | evidence |
|---|---|
| `[השכרת אוטובוסים]` | 2 clicks, **₪73.45** — the single most expensive term in the account, and the plural was never a keyword |
| `[אוטובוס לאירועים]` | 2 clicks, ₪24.20 |
| `[חברת אוטובוסים בירושלים]` | 10 impressions, never bid on |
| `[השכרת אוטובוס בירושלים]` | 1 click, ₪3.84 |
| `[כמה עולה אוטובוס ליום]` · `[כמה עולה אוטובוס]` | live price-intent queries |
| `[אוטובוסים לחתונה]` · `[אוטובוסים לטיולים]` · `[אוטובוסים להשכרה]` | plural forms, all seen, none bid on |
| `[השכרת אוטובוס ליום מחיר]` · `[השכרת אוטובוס לאירוע מחיר]` · `[חברות אוטובוסים פרטיות]` | seen, uncovered |

**The pattern: Hebrew plurals were the blind spot on both sides.** `השכרת אוטובוסים` cost ₪73.45
without a matching keyword; `מיניבוסים` cost ₪6.63 despite `מיניבוס` being a negative. Google Ads
matches neither plurals nor prefix forms automatically — **both need explicit entries.**

## 22 more negatives

- **Plural/variant gaps:** `מיניבוסים` (the `מיניבוס` negative never caught it — 11 impressions, ₪6.63).
- **English traffic:** `airport`, `bus`, `israel`, `tlv`, `jerusalem`, `transportation`, `shuttle`,
  `minibus`, `taxi`. `tlv airport` alone took a click at ₪5.97 — and `KEYWORDS.md` puts English
  explicitly out of scope for this pilot.
- **Job-seekers:** `נהגים`, `דרייבר` (`דרוש נהג אוטובוס זעיר פרטי` cost ₪6.98).
- **Wrong vehicle / out of area:** `ממוגן`, `הגולן`, `לאשדוד`, `לחיפה`, `"אוטובוס קטן"`,
  `"לתל אביב"`, `"אוטובוס ממשלתי"`.
- **Competitors:** `אורבוס`, `"אור בוס"`, `נהורה`.

## Verified end state

**43 ENABLED keywords across the 3 live groups — 100% EXACT, 100% contain אוטובוס.** Self-block check
passed on all three axes before applying: new negatives vs all keywords (0), *existing* negatives vs
new keywords (0 — the check that was skipped when `לנתבג` was added by hand), and the אוטובוס rule (43/43).

## ⚠️ OPEN: the live ad copy breaks both of Avi's hard laws

`טיולים ואירועים` is the only serving ad. Its assets:

- Headline **`אוטובוס לטיול בית ספר`** — breaks Law 2 (no school/kids; Avi: ילדים הורסים את האוטובוס).
  The campaign simultaneously carries `בית ספר` as a BROAD negative, so this headline can never even
  be shown to the audience it targets. It is dead weight *and* against his rules.
- Headline **`אוטובוס לטיול - מחיר משתלם`** — breaks Law 1 (no price claims in ad copy, ever).
- Description **`אוטובוס לכל טיול - בית ספר, עבודה, משפחה … ומחיר הוגן`** — breaks **both** laws in
  one asset.

Proposed replacements (unapplied — an ad edit triggers Google re-review, which can pause the only
serving ad for a few hours):
- `אוטובוס לטיול בית ספר` → `אוטובוס לטיולי גמלאים` (seniors are explicitly a wanted audience)
- `אוטובוס לטיול - מחיר משתלם` → `אוטובוס לטיול ממודיעין` (mirrors the new geo keyword)
- description 3 → `אוטובוס לטיול קבוצתי, יום גיבוש או טיול גמלאים. יוצאים מירושלים וממודיעין. התקשרו.`
