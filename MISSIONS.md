SUPERVISION: STANDARD

## M-google-business-profile — Link the Google Business Profile to the site
- Status: open
- Lane: [noam]
- Agent: none (needs the profile URL from Noam, then a one-line schema edit)
- Verify: searching "אבי ורדי הסעות" in Google Maps returns a verified card with the site linked, and the local pack shows it for "הסעות מבשרת ציון".

Why: Noam confirmed 2026-09-02 that the profile EXISTS and he has updated it per the Hebrew walkthrough. What remains is the connection: the site's LocalBusiness schema has no `sameAs` pointing at the profile, so Google and the AI engines are resolving the website and the Maps listing as two separate things instead of one business. Adding the profile URL to BIZ in shared/seo-pages.mjs closes that, and the same link belongs in client/index.html's LocalBusiness block.

Still the highest-value follow-on: the profile is the only place real reviews can accumulate, and the business has zero verifiable social proof anywhere since the invented ones were pulled (81ff3a5). Google's "ask for reviews" short link, sent to 5-10 past customers, is the single action worth most here.

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
