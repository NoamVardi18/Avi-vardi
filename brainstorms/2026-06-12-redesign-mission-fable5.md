# Avi-vardi Site Redesign (for Fable 5): Brainstorm / Discovery Notes
Date: 2026-06-12 · Goal: Define full redesign mission for avivardi.online to hand off to Fable 5, using the ui-ux-pro-max skill

## Summary / key decisions
- Site: business site for father (אבי ורדי הסעות / bus transport company, avivardi.online). Goal = online advertising + bring customers.
- Current design: slightly outdated, not built with ui-ux-pro-max skill.
- Mission: full visual redesign by Fable 5 — professional, special/innovative, NOT generic-AI-looking. Fable 5 has full creative control, may or may not use ui-ux-pro-max skill, should work hard for an exceptional result.
- Deliverable of THIS session: a brief/prompt document for Fable 5 (separate chat), not implementation here.
- Design freedom: colors/layout/branding/sections fully open — can reorganize, add/remove sections, change navigation/multi-page. Only constraint: same business services must still be delivered (info, contact, booking).
- Target audience: corporate/private/event transport (less school trips) — professional-trustworthy tone.
- Stack/infra: React19+Vite+Tailwind+tRPC, repo github.com/NoamVardi18/Avi-vardi, deploy Vercel, DB Supabase. Everything (incl. backend) should keep working normally — except booking modal is currently weak, Fable 5 free to improve/rebuild creatively.
- Images: use ONLY existing images already in repo, no new stock/AI images. Existing bus photos (golden 56-seat bus) must NOT be replaced/altered — can add other new visuals/graphics elsewhere if desired.
- Avoid cliche blue-purple AI-gradient look / generic landing template (centered hero + 3 feature cards). Aim for design that feels like a real distinct brand.
- OK to deploy straight to live site; revertible via git if disliked.
- Codebase structure: client/src/pages/Home.tsx — single-page sections: Hero, About (#about), Services (#services), Routes (#routes), Fleet (#fleet), Reviews (#reviews). RTL Hebrew, currently blue/white (blue-900/slate). Has booking modal + accessibility modal. Key images: BUS_HERO_IMG, BUS_SIDE_IMG, BUS_INTERIOR_IMG, BUS_FRONT_ANGLE_IMG.

## Q&A log
### Q1 — current site & redesign driver
- Asked: what is avivardi.online today, what's driving redesign?
- Captured: father's bus transport company site (הסעות). Needs better online presence/lead gen. Current look dated, no ui-ux-pro-max usage. With Fable 5 release, want full redesign — professional + innovative/special, NOT AI-generic looking. Keep same business/content, just new design.
- Flags: none

### Q2 — scope of design freedom
- Asked: can structure/sections change or only visual (CSS/colors)?
- Captured: full freedom — colors, design, layout all changeable. Only constraint: end result must still deliver same service (booking, contact, services info etc). Fable 5 given autonomy — if it thinks something should be done, do it (don't hold back for permission).
- Flags: none

### Q3 — branding constraints
- Asked: keep existing logo/colors/font, or fully open?
- Captured: fully open. Fable 5 chooses new branding (palette/typography per ui-ux-pro-max). Only company name + contact details (אבי ורדי, phone/WhatsApp) stay accurate. Emphasis: Fable 5 should work hard/thoroughly on the design.
- Flags: none

### Q4 — target audience / tone
- Asked: who are main customers — schools, corporate, private/events, all?
- Captured: less school trips, mostly all other types (corporate, private, events, tours). Tone: professional-trustworthy transport business, not specifically family/casual.
- Flags: none

### Q5 — deliverable
- Asked: is the output of this session a written brief/prompt for Fable 5, or do we implement here?
- Captured: output = brief/prompt document. User will paste it into a separate Fable 5 chat after this grill session ends. Fable 5 has full creative control — use ui-ux-pro-max skill if it wants, or not. Goal: Fable 5 works hard, delivers "insane"/exceptional result. OK for Fable 5 to deploy straight to live site — if user doesn't like it, can revert via git.
- Flags: none

### Q6 — functional preservation & stack
- Asked: what must keep working (modals, contact, backend)?
- Captured: stack confirmed — Vercel (deploy) + Supabase (DB). Generally everything should keep working as usual. Booking modal exception: current one is weak/not good — Fable 5 free to improve or rebuild creatively, not required to keep as-is. Be creative.
- Flags: none

### Q7 — images/media
- Asked: real bus photos available, or need new visuals?
- Captured: use ONLY existing images already in the site — no new/stock/AI images. Specifically, wherever "56-seat bus" (אוטובוס 56 מקומות) appears, must keep using the same golden bus images currently shown (BUS_HERO_IMG, BUS_SIDE_IMG, BUS_INTERIOR_IMG, BUS_FRONT_ANGLE_IMG in Home.tsx — `/manus-storage/bus-front-nature_6d1794ae.jpeg`, cloudfront bus-side-nature webp, `/manus-storage/bus-interior_17f8298e.jpeg`, `/manus-storage/bus-front-angle_6bee6973.jpg`).
- Flags: none

### Q7 follow-up — clarify image constraint
- Captured: clarification — "special design" (Q7 answer) means: free to add new visuals/illustrations/graphics elsewhere, just must NOT replace/alter the existing bus photos themselves (the bus images stay as-is).

### Q8 — closing / anti-AI-look guidance
- Asked: inspiration likes/dislikes, anything to avoid that "looks AI-generated"?
- Captured: avoid cliche blue-purple gradient look. Otherwise follow assistant's recommendation: avoid generic landing page template (centered hero + 3 feature cards + blue-purple gradient), aim for unique design that feels like a real brand. No specific reference sites given.
- Flags: none

## Open flags (pending input)
- none
