# Avi-vardi — CLAUDE.md

**Identity:** read `~/.claude/NOAM-PROFILE.md` first — who Noam is, how to work with him, and how this space connects to the others.

## What this is
Dad's transport-business site, live at avivardi.online. React 19 + Tailwind 4 + Express 4 + tRPC 11 stack with Manus OAuth wired; procedures are the contract, types flow end to end (`server/routers.ts`).

## Hard rules
1. **Code repo — never push without explicit approval.** This is a code repo, not a notes repo (EA CLAUDE.md §5).
2. **Work on branch `chore/schema-v1`** — that's the live working branch.
3. Schema changes go through `drizzle/schema.ts` → `pnpm db:push`; cover changes with Vitest specs (`server/*.test.ts`) before calling done.
4. Google Ads pilot + the invoice-engine (Architect) serve this site — check `google-sheets-sync/` before touching lead/quote flows.
