Updated 2026-09-04 (FABLE-51 doc-rot fix).
# KNOWLEDGE — Avi-vardi (2026-07-04)

**What:** Dad's business site — "אבי ורדי הסעות" (bus/shuttle transportation, Elazar/Gush Etzion/Jerusalem area), live at avivardi.online. React 19 + Tailwind 4 + Express 4 + tRPC 11 + Drizzle, client-rendered SPA, Hebrew RTL. Booking form → Supabase → WhatsApp notification, daily Google Sheets sync.

**State: LIVE, active.** Git repo → github.com/NoamVardi18/Avi-vardi, deployed on Vercel, clean working tree. archive/todo.md shows 6 phases all `[x]` complete.

**Known issue — RESOLVED 2026-07-11:** the prior 367KB dead Manus runtime injection was dropped (`bb6b521 perf: drop dead vite-plugin-manus-runtime injection`). Do not re-flag it as open.

**Google Ads pilot (new since 2026-07-04, dad's account):** `ads-pilot/` is now a live sub-project — campaign KNOWLEDGE/STATUS/BUDGET/KEYWORDS docs plus dated `changeset-<date>/` folders (2026-07-22, 2026-08-03, 2026-08-28) holding the CSVs/negatives pushed each round. Campaign went LIVE 2026-07-25 (4 bus-only RSAs, phrase/exact keywords, negatives); 2026-08-28 changeset wired Google Ads conversion tracking for WhatsApp + phone CTAs. Treat `ads-pilot/CAMPAIGN-STATUS.md` as the current-state pointer for that sub-project, not this file.

**HUD bot-sandbox tie-in:** M16 (2026-07-03, VPS) shipped a BOT tab on the EA HUD — test persona `EA/modules/vps/hud/bots/avivardi.md` (busbot templates + quote bands), switchable brain (⚡ free llm-route ⇄ claude sandbox, no-tools), Playwright-verified 3-turn Hebrew conversation. Lets Noam converse with the future site chatbot in-browser before anything ships client-facing; also doubles as an agency-offer demo asset.

**Pointers:** README.md (template docs), archive/todo.md (phase history), ideas.md (3 design-approach brainstorm), Architect/audits/avivardi-audit.md, Memory.md M16/M48/M49.

## Where things are (file map)
- Generic client/server/drizzle layout is already mapped in README.md's "Key Files" and "File Structure" sections (lines ~28-66) — check there before re-deriving it; it's template boilerplate but broadly accurate.
- `server/routers.ts` — tRPC procedures, incl. the booking-submit flow that builds the WhatsApp notify link (`OWNER_WHATSAPP` constant → wa.me URL). `server/db.ts` / `server/supabase.ts` — Supabase query helpers. `server/_core/` — template framework internals (auth/oauth, vite dev bridge, etc.) — avoid editing unless extending infra, per README.
- `client/src/pages/` — routed pages (booking form etc.); `client/src/components/` (+`ui/`) — shared/shadcn UI components.
- `drizzle/schema.ts` + `relations.ts` — DB tables (bookings); `drizzle/migrations/` — generated SQL, applied via Drizzle.
- `api/` — Vercel serverless entry (`index.js`/`server.js`) wrapping the Express app for deployment; deploy steps in `VERCEL_DEPLOY.md` (not pointed to elsewhere in this file).
- `google-sheets-sync/SupabaseSync.gs` — the daily Google Sheets sync mentioned above; it's a standalone Apps Script, not part of the Node app.
- `references/`, `brainstorms/` — dated notes/brainstorms, not live docs (e.g. `brainstorms/2026-06-12-redesign-mission-fable5.md`).
- `ads-pilot/` — Google Ads pilot for the same business (separate from the site codebase, no deploy relationship to it).

## Recent changes (dated)
- 2026-07-11: dropped the dead Manus vite plugin (perf fix, see above); restored original golden-bus photos self-hosted.
- 2026-07-22 to 2026-08-28: `ads-pilot/` stood up and iterated through three live changeset rounds (keyword/negative tightening, RSA rewrites, conversion tracking for WhatsApp/phone CTAs).
- 2026-08-14: stale `.bak` files (>7d) archived out of the tracked tree (flawless-machine sweep).
- 2026-08-29: removed fabricated JSON-LD review markup Noam confirmed was invented — don't reintroduce review schema without a real source.
- 2026-09-02: SEO/GEO pass — real HTML served to crawlers across 8 pages, price bands sourced, site connected to the actual Google Business Profile (cid 10289429120438977164).
