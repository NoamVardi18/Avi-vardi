# Andy Bus - Project TODO

- [x] Initial project setup with React + tRPC + DB template
- [x] Design system: Royal Blue & Gold theme (Approach 1)
- [x] Hebrew RTL layout with Assistant/Heebo/Rubik fonts
- [x] Hero section with background image and quick contact widget
- [x] About section with Andy's bio and trust badges
- [x] Services section (4 service cards + luxury interior CTA)
- [x] Pricing section with price table and interactive calculator
- [x] Facebook reviews section
- [x] Marketing tips section
- [x] Footer with contact info and WhatsApp CTA
- [x] Fix missing useAuth import in Home.tsx after template upgrade
- [x] Install missing dependencies (drizzle-orm, trpc, etc.)
- [x] Run pnpm db:push to sync database schema
- [x] Verify dev server runs without TypeScript errors
- [x] Add vitest tests for server procedures (auth.logout test passes)

## Phase 2 - Major Updates
- [x] Upload bus photos (exterior + interior) to webdev storage
- [x] Fetch Facebook reviews from https://www.facebook.com/bywrdy (personal profile, no reviews available - kept existing)
- [x] Update DB schema: add bookings/leads table
- [x] Add tRPC procedure: createBooking (public) - saves to DB + sends WhatsApp notification
- [x] Rename site: "אבי ורדי הסעות" everywhere (title, header, footer)
- [x] Update phone: +972528369212
- [x] Update location: מבשרת ציון סמוך לירושלים
- [x] Update about text: אבי ורדי (not אנדי)
- [x] Replace hero background image with best bus exterior photo (nature background)
- [x] Replace about section photo (remove random man photo) with bus exterior
- [x] Replace interior CTA image with actual interior photo
- [x] Change "מיניבוס" to "אוטובוס" everywhere, 56 מקומות
- [x] Update services: change "טיולים וימי גיבוש" to "עבודה עם קבוצות קבועות ברחבי הארץ"
- [x] Remove pricing/calculator section entirely
- [x] Remove marketing tips section entirely
- [x] Add booking modal (שם חובה, טלפון חובה, תאריך אופציונלי, הערות אופציונלי)
- [x] "הזמנת נסיעה" button opens booking modal
- [x] Replace footer copyright with "© אבי ורדי הסעות. כל הזכויות שמורות."
- [x] Add real Facebook reviews if available (personal profile - no public reviews found)
