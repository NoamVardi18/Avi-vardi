# Avi-vardi — CLAUDE.md

**Identity:** read `~/.claude/NOAM-PROFILE.md` first — who Noam is, how to work with him, and how this space connects to the others.

## What this is
Dad's transport-business site, live at avivardi.online. React 19 + Tailwind 4 + Express 4 + tRPC 11 stack with Manus OAuth wired; procedures are the contract, types flow end to end (`server/routers.ts`).

## Hard rules
1. **Code repo — never push without explicit approval.** This is a code repo, not a notes repo (EA CLAUDE.md §5).
2. **Work on `main`.** (Was "work on `chore/schema-v1`" — corrected 2026-09-02: that branch is 0 commits ahead of `main` and 25 behind, i.e. fully merged and abandoned. `main` is the default branch and carries all recent work. Verify before trusting either way: `git rev-list --count main..origin/<branch>`.)
3. Schema changes go through `drizzle/schema.ts` → `pnpm db:push`; cover changes with Vitest specs (`server/*.test.ts`, `scripts/*.test.ts`) before calling done.
4. Google Ads pilot + the invoice-engine (Architect) serve this site — check `google-sheets-sync/` before touching lead/quote flows.
5. **Public-facing pages are generated, not hand-edited.** The 8 SEO landing pages, `sitemap.xml` and `llms.txt` are all built from `shared/seo-pages.mjs` by `scripts/gen-seo-pages.mjs` during `pnpm build`. Edit the data file; never edit the output in `dist/`. A fact hand-written into one of those outputs is how the invented 5-star rating survived a week past the commit that removed it.
6. **No claim about this business ships without a source.** Reviews, ratings, prices, certifications and "100%" stats are Avi's to confirm — see the open `M-verify-price-bands` mission. The invented reviews (81ff3a5) are the precedent.
