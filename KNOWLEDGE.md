# KNOWLEDGE — Avi-vardi (2026-07-04)

**What:** Dad's business site — "אבי ורדי הסעות" (bus/shuttle transportation, Elazar/Gush Etzion/Jerusalem area), live at avivardi.online. React 19 + Tailwind 4 + Express 4 + tRPC 11 + Drizzle, client-rendered SPA, Hebrew RTL. Booking form → Supabase → WhatsApp notification, daily Google Sheets sync.

**State: LIVE, active.** Git repo → github.com/NoamVardi18/Avi-vardi, deployed on Vercel, clean working tree. Last 10 commits: SEO (llms.txt, AI-crawler allow, Jerusalem keywords, FAQ schema), editorial redesign, Vercel Analytics/Speed Insights, uptime auto-restart cron. todo.md shows 6 phases all `[x]` complete.

**Known issue (prior EA technical audit — Architect/audits/avivardi-audit.md, 2026-07-03):** ships 367KB of dead Manus runtime on every page load + a Manus-owned CloudFront dependency. One-line vite fix identified, sitting on WORKBOARD awaiting Noam's go — code-repo push/deploy needs explicit approval (Hard Rule §4). **NOT applied — audit was planned-only, per Noam.**

**HUD bot-sandbox tie-in:** M16 (2026-07-03, VPS) shipped a BOT tab on the EA HUD — test persona `EA/modules/vps/hud/bots/avivardi.md` (busbot templates + quote bands), switchable brain (⚡ free llm-route ⇄ claude sandbox, no-tools), Playwright-verified 3-turn Hebrew conversation. Lets Noam converse with the future site chatbot in-browser before anything ships client-facing; also doubles as an agency-offer demo asset.

**Pointers:** README.md (template docs), todo.md (phase history), ideas.md (3 design-approach brainstorm), Architect/audits/avivardi-audit.md, Memory.md M16/M48/M49.

## Where things are (file map)
- Generic client/server/drizzle layout is already mapped in README.md's "Key Files" and "File Structure" sections (lines ~28-66) — check there before re-deriving it; it's template boilerplate but broadly accurate.
- `server/routers.ts` — tRPC procedures, incl. the booking-submit flow that builds the WhatsApp notify link (`OWNER_WHATSAPP` constant → wa.me URL). `server/db.ts` / `server/supabase.ts` — Supabase query helpers. `server/_core/` — template framework internals (auth/oauth, vite dev bridge, etc.) — avoid editing unless extending infra, per README.
- `client/src/pages/` — routed pages (booking form etc.); `client/src/components/` (+`ui/`) — shared/shadcn UI components.
- `drizzle/schema.ts` + `relations.ts` — DB tables (bookings); `drizzle/migrations/` — generated SQL, applied via Drizzle.
- `api/` — Vercel serverless entry (`index.js`/`server.js`) wrapping the Express app for deployment; deploy steps in `VERCEL_DEPLOY.md` (not pointed to elsewhere in this file).
- `google-sheets-sync/SupabaseSync.gs` — the daily Google Sheets sync mentioned above; it's a standalone Apps Script, not part of the Node app.
- `references/`, `brainstorms/` — dated notes/brainstorms, not live docs (e.g. `brainstorms/2026-06-12-redesign-mission-fable5.md`).
