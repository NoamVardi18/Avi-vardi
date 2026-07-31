# NEXT-STEPS — live-account actions

> **Status 2026-07-30: the campaign is LIVE and has been for weeks.** The original zero-to-launch
> checklist that used to be this file's contents is finished and is preserved at the bottom as
> history — do not work from it. Current account truth is `CAMPAIGN-STATUS.md`; read that first.

**Account:** customer `1128064207` · Search campaign `24022931741` "אבי ורדי — חיפוש" · ENABLED.
**Nothing below has been applied.** Verified against the live 07-31 pull: 43 enabled keywords,
73 negatives, 4 ads — unchanged, nothing added or removed by any session.
Needs Noam or Avi at ads.google.com, or a mutate run once quota frees up. **Interactive GAQL is
effectively unavailable:** the 5×/day scheduled job consumes each developer-token quota window as it
opens, so ad-hoc queries returned `RESOURCE_EXHAUSTED` (~14h retry) on both 07-30 and 07-31. Read the
scheduled run's `ads.json` instead of trying to query live.

Ordered by shekels recovered per minute of work. Evidence for each: `CAMPAIGN-STATUS.md`
§2026-07-30, and the report at `https://claude.ai/code/artifact/095ab645-cc41-483f-88b5-20a2c0515681`.

1. **Move `אוטובוס לטיולים` from the נתב״ג ad group to `טיולים ואירועים`, and change BROAD → PHRASE.**
   It is 71% of the airport group's impressions and 56% of the account's, at 0 clicks, being answered
   by airport copy. `טיולים ואירועים` has served 0 impressions all week. Biggest single win, ~2 min.
   While there: 2 other BROAD keywords are live (`אוטובוס הסעות לאירועים`, `אוטובוס לנתב ג בלילה`)
   against KEYWORDS.md's own Phrase+Exact-only strategy — decide deliberately whether they stay.

2. **Add English negative keywords** — `van`, `shuttle`, `taxi`, `train`, `station`, `central`,
   `timetable`, `schedule`, `public transport`, `how to get`.
   **Do NOT rely on language targeting for this.** Campaign language was set to Hebrew at creation
   (history step 4 below) and English queries still came through — because Google language targeting
   keys off the *user's Google interface language*, not the language of the query. A Hebrew-interface
   user typing `tlv airport` matches regardless. All 73 current negatives are Hebrew, so the whole
   English surface is unguarded, including `van service` — the minibus problem in English.
   Keep the list targeted rather than blanket-blocking English: plenty of Israelis search in English,
   so `bus rental jerusalem` is a real customer and must still match.

3. **Add negatives `קו` · `גילי` · `זולה` (phrase), then re-read all 73 for singular/plural gaps.**
   `קו 485 מירושלים לנתבג` has now billed in **three separate weeks** (₪5.85 each on 07-30, 07-31);
   the list has קווים (plural) only. `טיולי גילי` = a competitor not on the 12-name list.
   `הסעה זולה` = bargain-hunter. Add `מחירון` and `כמה עולה נסיעה` alongside.
   **Treat the singular/plural gap as a category, not one keyword.**

3b. **Add EXACT-match negatives `[הסעות]` `[הסעה]` `[הסעה זולה]` `[הסעה לירושלים]` — but only AFTER
   item 1.** These 4 dead-generic queries are ~16 of the 35 unclicked הסעות impressions. **Exact match
   is load-bearing:** a phrase/broad negative on `הסעות` would also kill `חברת הסעות בירושלים`, the
   account's best remaining query. The other 9 הסעות variants are company-seeking = real ICP, and have
   only ever been shown *airport* copy — give them one fair week against the right ad before judging.

3c. **`OPS-PROMPT.md:128` — widen the watchdog's allowed negative categories. NOAM'S CALL, not auto-applied.**
   Currently *"job-seeker / kids / army / minibus / taxi"* only, so the 5×/day job **cannot** act on the
   public-transit, competitor, English or price-shopper junk this account actually produces — it
   identifies them and declines, by design. Proposed additions: public-transit-line lookups,
   competitor brand names, English/transliterated transit phrases, explicit cheap/bargain modifiers.
   Gated because it expands autonomous mutation authority on an account that spends Avi's money.

4. **Confirm a call-conversion action exists** (history step 8 specified one; nobody ever confirmed it
   shipped). 0 conversions lifetime on ₪190.75 spent. If there is no call tracking, that zero is an
   absence of measurement, not a result, and Maximize-Clicks bidding has nothing to steer by.
   **Do this before increasing spend.**

5. **Fix the 7 assets that break KEYWORDS.md Law 1 (no price claims).**
   `מחיר הוגן` in G1-D3, G2-D1, G4-D3 · `מחיר משתלם` in G1-H8, G2-H11, G2-D3, G3-D4.
   Replace with the approved call-for-quote pattern `הצעת מחיר`, already used correctly in 8 places.

6. **Decide on the 3 assets that break Law 2 (no kids/school/bar-mitzvah).**
   Headline G1-H10 `אוטובוס לטיול בית ספר`, description G1-D3 (`בית ספר`), description G3-D4
   (`בר מצווה`). Either the law changed or the copy is wrong — Avi's call. If a kids/schools negative
   is live among the 73, the ads are currently bidding for what the negatives block.

7. **Paste the 7 replacement assets that pin הסעות to אוטובוס** (5 descriptions + 2 sitelinks).
   Limit-validated copy is in the report's Section 04. Lower value than 1–4: every headline already
   carries אוטובוס, so this is dilution, not a miss.

8. **Decide the ₪1,500 promo question with Avi.**
   Needs ₪31.93/day to 09-09; running ₪5.09/day; projects to ~₪400. Either accept the target is gone
   or deliberately raise volume — **but only after 1–3 land**, or the extra spend buys more of the
   wrong traffic. Money decision: Avi's, never executed by an agent.

Also unresolved, from CAMPAIGN-KNOWLEDGE §1: Google advertiser verification still blocks linking the
business-name/logo assets (`CUSTOMER_NOT_VERIFIED`), and no ≥128×128 square logo exists.

---

## History — the original zero-to-live checklist (completed, kept for the record)

_Noam's ordered manual clicks to get from no account to a live campaign. All done; the account,
promo, campaign, ad groups, keywords, negatives, RSAs and sitelinks described here exist. Step 8
(conversions) is the one whose completion was never confirmed — see item 4 above._

1. `NOAM-DECIDES` **Account email:** recommended — new Google Ads account under **dad's** business
   Google identity; add Noam as Admin. (Why: RUN-KIT §1.)
2. Create the new Ads account → **redeem the ₪1,500 promo code now** and verify the live terms
   (spend ₪1,500 in 60 days → ₪1,500 credit), Israel/ILS eligibility. (RUN-KIT §6.)
3. Set billing to **dad's business card**; confirm currency ILS.
4. Create Campaign **"אבי ורדי — חיפוש"**: Search only, Search-partners + Display **OFF**, location =
   Jerusalem/Gush-Etzion + radius ("presence in"), language Hebrew, ad-schedule paused Fri eve–Sat.
5. `NOAM-DECIDES` **Daily budget:** recommended **₪30/day** for the first 60 days (banks the credit),
   then ₪25/day. (BUDGET.md.)
6. Add the 3 ad groups + Phrase/Exact keywords from **KEYWORDS.md**; add the shared **negative
   keywords** at campaign level.
7. Paste the 2 RSAs per ad group from **KEYWORDS.md** (15 headlines + 4 descriptions each — counts
   pre-verified ≤30/≤90).
8. Set up conversions: **Call asset** (dad's number, ≥60s = conversion) + website **forwarding-number**
   call tracking; bidding = **Maximize Clicks**. (RUN-KIT §2.)
9. Add assets: Location, Sitelinks (נתב"ג / חתונות / טיולים / צור קשר), Callouts (56 מקומות · ישירות
   מול הנהג · זמינות 24/6 · הצעת מחיר חינם).
10. Log the campaign names verbatim to the lead log (`avivardi-search-natbag` / `-weddings` / `-tours`)
    so `/lead` attribution exact-matches; then **launch** and run the weekly 10-min ops (RUN-KIT §4).

> Note: the live account ended up with **4** ad groups (טיולים ואירועים · הסעות לעובדים וכללי ·
> חתונות · נתב״ג), not the 3 in step 6 and not the 4 different ones drafted in KEYWORDS.md.
> The live structure is authoritative.
