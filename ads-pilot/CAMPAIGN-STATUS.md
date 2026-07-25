# ads-pilot — ACTUAL campaign status

> Read this before trusting any commit message in this directory's history.

## 2026-07-25 — THE CAMPAIGN IS **NOT** LIVE

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
