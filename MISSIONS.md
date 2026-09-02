SUPERVISION: STANDARD

## M-verify-price-bands — Confirm the published price bands with Avi
- Status: waiting-noam
- Lane: [noam]
- Agent: none (one question to Avi; then a one-line edit)
- Verify: Avi states each band is right, or gives corrected numbers; then PRICE_BANDS in shared/seo-pages.mjs is updated and `pnpm build` regenerates all 8 pages + llms.txt from it.

Why: the bands (חתונה מ-₪1,800 / רחוקה מ-₪2,500 / נתב"ג מ-₪900 / טיול מ-₪2,200) came from an earlier session's hand-written client/public/llms.txt. Nobody has confirmed them with Avi. They are now published on /mechiron/ and quoted in llms.txt, which is exactly the surface AI answer engines lift from — so a wrong number gets repeated by ChatGPT and Perplexity as if it were a quote. Noam 2026-09-02: Avi "doesn't like to להתחייב for a price", so they are framed as "טווח משוער, נסגר בשיחה" floors rather than quotes, but the numbers themselves are still unverified. Same class of claim as the invented reviews removed in 81ff3a5 — recorded rather than silently trusted.

Canonical: this file (opened 2026-09-02 during the SEO/GEO build)

## M-google-business-profile — Open or claim the Google Business Profile
- Status: waiting-noam
- Lane: [noam]
- Agent: none (identity verification; only the business owner can pass it)
- Verify: searching "אבי ורדי הסעות" in Google Maps returns a verified card with the site linked, and the local pack shows it for "הסעות מבשרת ציון".

Why: the local 3-pack on Maps takes most of the click volume for queries like "הסעות לחתונה ירושלים", and it is driven by a Business Profile, not by the website — no amount of on-site SEO can substitute. It is free. It is also the only place real reviews can accumulate, which matters more than usual here: the four reviews on site were invented and their markup was removed (81ff3a5), so the business currently has zero verifiable social proof anywhere. Hebrew walkthrough written for Noam 2026-09-02.

Canonical: this file (opened 2026-09-02 during the SEO/GEO build)

## M-manus-runtime-fix — Apply the pending vite fix for dead Manus runtime
- Status: waiting-noam
- Lane: [noam]
- Agent: none (approval-gated; once approved, hand to a code agent)
- Verify: after approval + fix, confirm the built bundle no longer includes the Manus runtime chunk (network tab / bundle analyzer), site still renders and books correctly.

Why: prior technical audit found 367KB of unused Manus runtime shipped on every page load, plus a Manus-owned CloudFront dependency. One-line vite fix already identified and sitting on WORKBOARD. Code-repo push/deploy needs Noam's explicit approval — no execution without it.

Canonical: BACKLOG ### 23. avivardi-site-fixes [mac] (4) — PREREQ: Noam scope OK (see gates)

## M-hud-bot-persona — Iterate the HUD bot-sandbox persona against real site copy
- Status: open
- Lane: [any]
- Agent: general-purpose
- Verify: run a 3-turn Hebrew conversation through the HUD BOT tab; answers should match the real site's services, pricing bands, and contact flow.

Why: M16 shipped a working BOT tab (hud/bots/avivardi.md) as a pre-launch rehearsal for the site's future chatbot, using placeholder busbot templates. Tightening it against the real ideas.md/README service+pricing copy makes it a credible agency-demo asset, not just a skeleton.

Canonical: BACKLOG ### 26. avivardi-persona-iterate [mac] (4) — (orchestrator 0704-2025 — VPS has only hud/bots/avivardi.md; the ground-truth service/pricing copy lives in the Mac-only Avi-vardi repo, so [any] was wrong; held while mac pile ≥3)

## M-prune-scaffolding-skills — Decide: keep or prune scaffolding skills added Jul 1
- Status: waiting-noam
- Lane: [noam]
- Agent: none
- Verify: n/a — decision only.

Why: commit b439572 added grill-me + ui-ux-pro-max skills (with a sizeable CSV data dir under .claude/skills/) to this repo — unclear if they're in active use for ongoing site dev or just one-off scaffolding bloat worth removing.

Canonical: BACKLOG G-avivardi-skill-prune [mac] — Avi-vardi: keep-or-prune Jul-1 scaffolding skills (added 2026-07-04)

<!-- schema-v1 -->
