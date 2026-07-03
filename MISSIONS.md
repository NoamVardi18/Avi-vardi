SUPERVISION: STANDARD

## Apply the pending vite fix for dead Manus runtime
Why: prior technical audit found 367KB of unused Manus runtime shipped on every page load, plus a Manus-owned CloudFront dependency. One-line vite fix already identified and sitting on WORKBOARD. Code-repo push/deploy needs Noam's explicit approval — no execution without it.
Lane: [noam]
Agent: none (approval-gated; once approved, hand to a code agent)
Verify: after approval + fix, confirm the built bundle no longer includes the Manus runtime chunk (network tab / bundle analyzer), site still renders and books correctly.

## Iterate the HUD bot-sandbox persona against real site copy
Why: M16 shipped a working BOT tab (hud/bots/avivardi.md) as a pre-launch rehearsal for the site's future chatbot, using placeholder busbot templates. Tightening it against the real ideas.md/README service+pricing copy makes it a credible agency-demo asset, not just a skeleton.
Lane: [agent]
Agent: general-purpose
Verify: run a 3-turn Hebrew conversation through the HUD BOT tab; answers should match the real site's services, pricing bands, and contact flow.

## Decide: keep or prune scaffolding skills added Jul 1
Why: commit b439572 added grill-me + ui-ux-pro-max skills (with a sizeable CSV data dir under .claude/skills/) to this repo — unclear if they're in active use for ongoing site dev or just one-off scaffolding bloat worth removing.
Lane: [noam]
Agent: none
Verify: n/a — decision only.
