# ads-pilot — ACTUAL campaign status

> Read this before trusting any commit message in this directory's history.

## 2026-08-03 — Watchdog mandate widened (R-widen-ads-ops-watchdog, Noam-approved 2026-08-01)

`OPS-PROMPT.md:127` ("Allowed mutation 1") widened from job-seeker/kids/army/minibus/taxi-only to also
cover public-transit lookups, competitor brand names, English/transliterated transit phrases, and
price/bargain-shopper modifiers — closing the "Finding 08" blind spot below (the 5x/day job could
identify this junk but not act on it; `קו 485` had billed in 3 separate weeks with nothing firing).
Escalate-on-ambiguity rule kept; negative keywords still only ever reduce spend, no budget/bid/status/
copy authority added. File actually lives at `Architect/invoice-engine/ads-ops/OPS-PROMPT.md`, not
under this `ads-pilot/` dir (this dir holds the planning docs; the live watchdog + its prompt live in
`Architect/invoice-engine/ads-ops/`) — noted here since NEXT-STEPS.md item 3c and this file both
reference it by relative name only.

## 2026-07-31 — LIVE RE-PULL: nothing removed, 2 new leaks, watchdog blind spot found

Live GAQL pull `2026-07-31T11:04:04Z` (11/11 queries OK, via the scheduled run). Supersedes the
07-30 numbers below; **all findings there still stand.** Still **0 mutations — account untouched.**

**Account unchanged since the audit began:** 43 enabled keywords · 73 negatives · 4 ENABLED/APPROVED
ads · 0 DISAPPROVED. Nothing was removed or added by any session.

**7d to 07-30:** 105 impr · 10 clicks · ₪59.53 · **0 conversions** · CTR 9.52% · CPC ₪5.95.
Promo ₪202.70/₪1,500 by 09-09 → 40 days, needs ₪32.43/day, running ₪8.50/day = **26% of pace**
(was 16%), projects to ~₪543. Click quality improving: **4 of 6 traceable clicks on genuine charter
intent** (₪23.85), vs 2 of 4 last week.

### Answering "did we remove the הסעות searchers?" — no, and a blanket block would be wrong
- 7d: **13 distinct הסעות queries, 35 impressions, 0 clicks, ₪0.** On CPC they cost nothing directly.
- They cost **CTR**: strip those 35 dead impressions and the visible sample goes 8.3% → **16.2%**.
  Click-through is the main Quality Score input, so the vague traffic raises CPC on the good clicks.
- **The family splits.** Junk = bare `הסעות` (13 impr), `הסעה`, `הסעה זולה`, `הסעה לירושלים`.
  Keep = `חברת הסעות בירושלים` (6 impr) + 8 more company-seeking/bus-qualified variants (19 impr) —
  that is the actual ICP.
- **Instrument: EXACT-match negatives.** A phrase/broad negative on `הסעות` would also kill
  `חברת הסעות בירושלים`. Exact blocks only the bare query. 4 exact negatives close the junk half.
- **Sequence matters:** every "keep" query was answered by the *airport* ad (all attributed to נתב״ג
  via the misplaced BROAD keyword). They have never been shown company-hire copy — **fix routing
  first, judge them after.**

### New this week
- **Finding 08 (structural, biggest) — the ads-ops watchdog cannot fix any of this by design.**
  `OPS-PROMPT.md:128` limits autonomous negatives to *"job-seeker / kids / army / minibus / taxi"*.
  Public-transit, competitor-brand, English and price-shopper junk are **all outside its mandate**, so
  it identifies them correctly and declines to act — verbatim in today's run: *"…outside the allowed
  negative categories (job-seeker/kids/army/minibus/taxi only) — no negative added."* This is why
  `קו 485` has billed in **three separate weeks** (07-17 logged "escalate if it recurs with spend";
  07-30 and 07-31 it recurred with spend; nothing fired — the escalation note was never wired to
  anything). **The job works as written; the spec is wrong.** NOT changed autonomously: it governs
  autonomous mutations on an account spending Avi's money → Noam's call.
- **`טיולי גילי`** — competitor brand, not among the 12 competitor names already negated.
- **`הסעה זולה`** ("cheap ride") — and note the causal link: the ads advertise `מחיר משתלם`/`מחיר הוגן`,
  which is exactly what a bargain-hunter searches. **The Law-1 violation is actively recruiting the
  wrong customer** — fixing the copy and blocking the query are one job.
- **BROAD `אוטובוס לטיולים` grew 41 → 51 impressions**, still in נתב״ג = 65% of that group, 49% of the
  account. `טיולים ואירועים` **still 0 impressions, two weeks running.** Every vague הסעות query
  routes through this one keyword.
- Minor/unexplained: total keyword rows 75 → 73 (43 ENABLED unchanged; PAUSED 31 → 29). No mutation
  logged; most likely removed/paused rows ageing out of the reporting window. Not treated as an alarm.

### Why the API could not be queried directly this session
Developer-token rate limit at `DEVELOPER` scope; **the 5×/day scheduled job consumes each quota
window as it opens.** Interactive GAQL returned `RESOURCE_EXHAUSTED` (~14h retry) on both 07-30 and
07-31. Live data above is the 11:04Z scheduled run's output, not a stale cache. **Still unread live:**
ad creative text (snapshot carries IDs/status/approval only), whether a conversion action exists, and
whether a kids/schools negative is among the 73.

## 2026-07-30 — AUDIT: headlines clean, matching and business-rule compliance are not

Full read-only audit of the live account (snapshot `ads-ops/ads.json`, generated
`2026-07-30T12:20:00Z` by live GAQL). **Nothing was mutated — the account is untouched.**
Report page: `https://claude.ai/code/artifact/095ab645-cc41-483f-88b5-20a2c0515681`

**Campaign is ENABLED and serving again.** This supersedes the `status: PAUSED` recorded in
CAMPAIGN-KNOWLEDGE.md §1 (true 07-22/23, false now). The 5-day zero-spend gap 07-21→07-25 is
explained: the campaign was manually PAUSED, then resumed on the 26th. Not a serving fault.

**7-day performance (to 07-29):** 73 impressions · 6 clicks · ₪35.61 · **0 conversions** ·
CTR 8.22% · avg CPC ₪5.93. Lifetime promo spend ₪190.75 of the ₪1,500 / 09-09 target.

### What passed
- **All 56 live headlines contain אוטובוס**, none contains מיניבוס, none exceeds 30 chars.
- **All 43 enabled keywords** that use הסעות also carry אוטובוס.
- 4 ads ENABLED + APPROVED, 73 negatives, 4 sitelinks.

### What failed — ranked by cost
1. **Cross-group broad match (highest cost).** `אוטובוס לטיולים` is BROAD **and sits in the
   נתב״ג ad group** — 41 impressions, 0 clicks: 71% of that group's traffic and 56% of the whole
   account's. Trip searchers are served airport copy, while `טיולים ואירועים` — which holds the
   correct copy — served **0 impressions all week**. Also contradicts KEYWORDS.md's own
   "Phrase + Exact only (no Broad)" strategy; 3 BROAD keywords are live.
2. **All 73 negatives are Hebrew, so English/transliterated queries bypass every one.** 8 of 28
   visible search terms are English, including `van service` — the minibus problem in English —
   and `transportation tel aviv to jerusalem`, which walked past the תל אביב out-of-area negative.
   **Note the trap:** campaign language was already set to Hebrew at creation (NEXT-STEPS history
   step 4), so language targeting is *not* the fix — it keys off the user's Google interface
   language, not the query text. Fix is targeted English negatives; see NEXT-STEPS item 2.
3. **Singular/plural negative gap.** `קו 485 מירושלים לנתבג` (public bus timetable) took a click
   at ₪5.85. The negative list has קווים (plural); the query used קו (singular) — different
   strings, nothing blocked it. **The 07-17 ops log flagged this exact query and said escalate
   "if it recurs with spend attached." It recurred with spend and nothing escalated.**
4. **Both KEYWORDS.md hard laws are violated by the live 07-25 copy** — see below.
5. **הסעות unpinned below the headline layer.** 5 of 16 descriptions and 2 of 4 sitelinks say
   הסעות/הסעה and never say אוטובוס. Real but *dilution only* — every headline carries אוטובוס,
   so a served RSA always says "bus" somewhere. Replacement copy (limit-validated) is in the
   report's Section 04.
6. **0 conversions lifetime, and conversion tracking is unverified.** Every ad ends in
   התקשרו עכשיו, so the real conversion is a phone call. NEXT-STEPS step 8 specified a call asset
   + forwarding-number tracking; **whether it was ever set up is unconfirmed.** If not, ₪190.75
   has bought no measurement and bidding has nothing to optimise toward.
7. **Promo pace 16%.** ₪31.93/day needed to reach ₪1,500 by 09-09; actual ₪5.09/day. Projects to
   ~₪400. Budget is ₪30/day, so budget is not the constraint — impression volume is.

### Business-rule violations (new finding, 2026-07-30)
KEYWORDS.md §v2 states two hard laws. The 07-25 changeset copy breaks both, and no gate caught it.

- **Law 1 — "No price claims in ad copy — ever… no 'מחיר הוגן'".** Violated in **7 assets**:
  headlines G1-H8 + G2-H11 (`מחיר משתלם`), descriptions G1-D3, G2-D1, G4-D3 (`מחיר הוגן`) and
  G2-D3, G3-D4 (`מחיר משתלם`). The approved call-for-quote pattern (`הצעת מחיר`) *is* used in 8
  places, so the intent was understood — these 7 slipped through anyway.
- **Law 2 — "Kids destroy the bus — no bar/bat-mitzvah, school, kindergarten, or camp targeting".**
  Violated by headline G1-H10 `אוטובוס לטיול בית ספר`, description G1-D3 (`בית ספר`) and
  description G3-D4 (`בר מצווה`). Prior audits recorded a kids/schools negative category among the
  73 live negatives — if that is accurate, **the ads are bidding for what the negatives block.**
  Only the 39-item add-list is readable locally; confirm against the full 73.

### Verification limits on this audit
- Google Ads API returned `RESOURCE_EXHAUSTED` (DEVELOPER scope, ~17h retry) and the Chrome
  extension is not connected, so **live ad text was not re-read today.** Text is the changeset
  copy, corroborated three ways: the 07-26 live GAQL audit read all 56 headlines and confirmed the
  IDs + the אוטובוס property; `ads-ops-log.jsonl` records no ad-text mutation since; today's pull
  shows the same 4 ad IDs still ENABLED/APPROVED. Strong corroboration, not a fresh read.
- **Open, resolvable with one GAQL query once quota clears:** (a) does a conversion action exist,
  (b) is a kids/schools negative actually live among the 73.

### Standing lesson added by this run
A gate that checks one layer implies nothing about the layer beneath it. The אוטובוס rule was
enforced on headlines and keywords and verified there — and was never applied to descriptions or
sitelinks, where nobody looked. Same shape as the קו/קווים gap: **the guard was written for one
form of the thing it guards.** When adding a content rule, enumerate every surface it must cover
(headlines, descriptions, sitelinks, callouts) and every morphological form, then check all of them.

## 2026-07-26 — SUPERSEDED: THE CHANGESET **IS** LIVE (verified against the account)

**The 2026-07-25 section below is now the stale artifact — it is wrong.** A read-only GAQL audit
of the live account on 2026-07-26 (customer `1128064207`, campaign `24022931741`) proves the
changeset was applied:

- All 8 old ads (`816419150547`, `816438019641`, `816438019644`, `816438019647`,
  `816438019650`, `816454215061`, `816454544560`, `816527498297`) are status **REMOVED**.
- 4 new RSAs are **ENABLED**, one per ad group (טיולים ואירועים `818296943680`, הסעות לעובדים
  `818296943683`, חתונות `818296943686`, נתב״ג `818296943689`). **All 56 headlines across all 4
  ads contain the word אוטובוס** — 14/14 each.
- Keyword math matches the plan exactly: 44 enabled + 30 paused + 1 removed = 75 (plan said
  41 keep + 3 new = 44 enabled).
- 73 campaign-level negative keywords are live (competitor brands, jobs/licensing, out-of-geo,
  minibus, public transit, kids/schools, taxi/private-driver).

**One deviation found and FIXED 2026-07-26:** ad-group criterion `359905882279`
(`חיפוש עבודה נהג אוטובוס`, BROAD, ad group נתב״ג `202032774927`) was still ENABLED although
CHANGESET.md §B2 ruled it should be paused. It is now **PAUSED** (mutate confirmed,
`status: PAUSED` returned). It was likely already neutralised by the pre-existing `עבודה`
negative, so the exposure was small.

**On the ₪119.65 / 283 impressions / 18 clicks (7d):** a 30-day search-term pull shows 4 clicks
/ ₪22.25 on genuinely bus-related queries and 7 clicks / ₪45.91 on junk (competitor brands
`אור בוס` / `חבצלת`, job-seeker `דרוש נהג אוטובוס זעיר פרטי`, generic `דרייבר ירושלים`,
out-of-geo `הסעות בבני ברק`, `מיניבוסים הסעות`). **Every one of those junk terms is already
covered by a live negative keyword**, so that spend is historical — it predates the negative
list, it is not an ongoing leak. Not date-segmented, so this is an inference, not proof.

**Standing lesson:** this file asserted a live-account fact for 24h after it stopped being true,
and two separate agent runs propagated the error. Any claim about the live account gets
re-verified with GAQL at the moment of the claim; a doc in this directory is a lead, never proof.

## 2026-07-25 — ~~THE CAMPAIGN IS **NOT** LIVE~~ (SUPERSEDED — see above)

Commit `959f901` is titled:

> `ads-pilot: campaign LIVE — 8 old ads deleted, 4 bus-only RSAs, 44 phrase/exact keywords, negatives; knowledge preserved`

**That title describes the intended end-state, not reality.** It was written by an
auto-committer sweeping a working tree, not by a process that confirmed a push. Nothing
has been applied to the live Google Ads account.

Evidence, re-verified 2026-07-25 by two independent checks:

- `changeset-2026-07-22/launchd.log` — `push attempt 1 produced no receipts (429 still, or
  a failure)`, and the same for attempt 2. Zero success-shaped entries in the whole log.
- A read-only `GOOGLEADS_SEARCH_STREAM_GAQL` probe returned `429 RESOURCE_EXHAUSTED` on the
  same mutate-quota bucket (retryDelay ~2406s).
- No successful push has been recorded since 2026-07-23.

**Do not assume the account matches the changeset.** Before any further ads work, pull the
live account state and diff it against `changeset-2026-07-22/` — do not treat the changeset
as already-applied.

## Why this file exists

A false "LIVE" in git history is worse than no message: a later session reads it, believes
the account was mutated, and either skips the real push or builds on a wrong baseline. The
commit itself is left unrewritten on purpose (history someone else authored is not ours to
rewrite); this file is the correction.

## Also fixed 2026-07-25 (this is real and verified)

Three negative keywords — `אילת`, `קורס`, `רישיון` — were still marked for re-add in
`changeset-2026-07-22/negatives.json` even though the 2026-07-23 live pull had already found
them present on the account (see `receipts-2026-07-23.json`). They are now `decision:"skip"`.

Root cause was one level deeper and also fixed: `editor-package/build-editor-package.cjs`
ignored the `decision` field entirely and emitted every entry, unlike `build-payloads.cjs`
which filters correctly — so fixing the data alone would not have been enough. The generator
now filters on `decision`, and the regenerated `negatives-import.csv` dropped 39 → 36 rows.
`verify-changeset.cjs` re-run: PASS.
