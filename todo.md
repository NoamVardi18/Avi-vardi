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

## Phase 3 - AI Images & GitHub
- [x] Generate AI-enhanced bus logo image (golden Mercedes-Benz Irizar on white background)
- [x] Generate bus favicon icon (flat design golden bus icon)
- [x] Generate cleaner bus-side-nature image (replace blurry version)
- [x] Replace Crown icon in header/footer with AI-enhanced bus logo image
- [x] Add favicon.ico to client/public and link in index.html
- [x] Push all code to GitHub (NoamVardi18/Avi-vardi)

## Phase 4 - UI Improvements & Fixes
- [x] Upload new bus photo (orange Mercedes Irizar front-angle) to webdev storage
- [x] Add new bus photo in "About" section below the small right-side image
- [x] Change "הזמנת נסיעה עכשיו" button (hero section right side) to direct WhatsApp link (opens new tab)
- [x] Add WhatsApp option to top navigation bar
- [x] Add phone number 052-480-4842 below "חייגו ישירות" in header
- [x] Add floating WhatsApp + call buttons on left side with accessibility attributes
- [x] Add hover/float animation effects for user experience
- [x] Fix booking modal logo (Crown icon still showing instead of bus logo)
- [x] Fix Supabase DB integration - ensure bookings are saved to avi-vardi-bus project
- [ ] Prepare for Vercel deployment (next session)

## Phase 5 - Layout Fix & Accessibility
- [ ] Move contact form widget to left side of Hero section (currently on right)
- [ ] Remove floating phone number text from hero left side
- [ ] Add skip-to-content link for keyboard users
- [ ] Add ARIA labels to all interactive elements (buttons, links, forms)
- [ ] Add role and aria attributes to navigation, main, sections
- [ ] Ensure all images have meaningful alt text
- [ ] Add lang="he" and dir="rtl" to HTML element
- [ ] Ensure color contrast meets WCAG AA (4.5:1 for text)
- [ ] Add focus-visible styles for keyboard navigation
- [ ] Add accessibility statement / הצהרת נגישות section or link
