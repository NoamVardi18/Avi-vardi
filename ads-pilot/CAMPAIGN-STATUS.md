# ads-pilot — ACTUAL campaign status

> Read this before trusting any commit message in this directory's history.

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
