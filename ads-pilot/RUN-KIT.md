# RUN-KIT — How to run the Google Ads pilot for הסעות אבי ורדי

_Prepared kit. PREPARE-ONLY: nothing here touches a real ad account or spends money — that is Noam's
manual, approved action at ads.google.com. Verify every live number (credit terms, CPCs) at signup._

**Business:** הסעות אבי ורדי — one solo driver, one 56-seat bus, Jerusalem / Gush Etzion / Elazar /
Efrat, serving airport transfers (נתב"ג), weddings, events, tours. Conversion = **phone call**.

---

## 1. Account setup — under whose email?

**Recommendation: create a NEW Google Ads account under DAD's business Google identity, and add Noam
as an Admin user.** (Account-email choice is `NOAM-DECIDES` — see NEXT-STEPS.)

Why dad's, not Noam's:
- **The credit and the account are the business asset.** The ₪1,500 intro credit binds to the
  first-time billing profile on a brand-new account. Put it on the business so history, conversion
  data, and credit belong to avi-transport, not to Noam personally.
- **Billing = dad's business card.** Ad spend is a deductible business expense for the transport
  business (VAT/expense trail lands where it belongs). Noam's card would tangle personal/business.
- **Noam still runs it.** Add Noam's Google account as an **Admin** user (Tools → Access & security →
  invite → Admin). He does the 10-min/week ops without owning the billing.
- Don't bother with a Manager (MCC) account for a single account — direct account + Admin invite is
  simpler and keeps the credit clean.

If dad has no Google account yet: create one fresh for the business (e.g. a business Gmail) and build
the Ads account on it. A brand-new Ads account is exactly what the intro credit requires.

---

## 2. Conversion tracking — the minimum that matters (calls > forms)

For this audience the money is a **phone call**, not a form. Set up, in priority order:

1. **Calls from ads (call asset + call-only intent).** Add a **Call asset** with dad's number and turn
   on **call reporting** so a call from the ad counts as a conversion. Count a call as a conversion
   only if it lasts **≥ 60 seconds** (filters misdials).
2. **Calls to a number on the website.** Install the Google **forwarding-number** snippet on
   avivardi.online so clicks-to-call from the site (the WhatsApp/phone CTA) are attributed to the ad.
3. **Website call-button / WhatsApp click** as a secondary conversion (softer signal).
4. **The manual lead log is ground truth.** Every real call → dad logs it via `/lead`
   (`leads.js add --source google_ads --campaign "<exact campaign name>"`). Google's reported
   conversions are the proxy; the lead log + `leads.js funnel` turns calls into **booked shekels**.

Forms are secondary. The site booking form can be imported later as an offline conversion — not
needed for the pilot. **Start bidding on Maximize Clicks** (too little data for smart bidding); switch
to **Maximize Conversions / tCPA** only after ~15–30 tracked call-conversions.

---

## 3. Campaign structure

```
Campaign:  אבי ורדי — חיפוש   (Search only — NO Performance Max for a tight-budget call pilot)
  ├─ Ad group: נתב"ג / שדה תעופה      → RSA-A, RSA-B  (see KEYWORDS.md)
  ├─ Ad group: חתונות ואירועים        → RSA-A, RSA-B
  └─ Ad group: טיולים והשכרת אוטובוס  → RSA-A, RSA-B
```

Settings:
- **Networks:** Search only. Turn **OFF** "Search partners" and "Display network" — they burn a small
  budget on junk.
- **Location:** target where the *customers* are — ירושלים + גוש עציון + אלעזר/אפרת + radius; add
  a Jerusalem-metro radius. (Airport / Tel Aviv are destinations, not targeting locations.) Set
  location option to **"Presence: people in your targeted locations"** (not "interest").
- **Language:** Hebrew (+ English optional for airport tourists).
- **Ad schedule:** run Sun–Thu all day + Fri until early afternoon. **Pause Fri evening → Sat night
  (Shabbat)** — dad doesn't operate then and won't answer; don't pay for calls that ring out.
- **Assets:** Call asset (dad's number), Location asset, Sitelinks (נתב"ג / חתונות / טיולים / צור
  קשר), Callouts (56 מקומות · ישירות מול הנהג · זמינות 24/6 · הצעת מחיר חינם).
- **Keywords:** Phrase + Exact only to start (see KEYWORDS.md). Broad only after a keyword proves out.

---

## 4. Weekly ops — Noam's 10 minutes (once a week)

1. **Search Terms report** → add wasteful queries as negatives (this is where real negatives come from).
2. **Cost per phone call** (Google conversions + the lead log) → compare to the kill threshold in
   BUDGET.md. This is THE number.
3. **Budget pacing** → on track to clear ₪1,500 by day 60 for the credit? (see §6).
4. **Zero-call spenders** → any keyword that spent ≥ 2× target cost-per-call with **0 calls** → pause.
5. **Ad check** → if a group has enough impressions, pause the clearly-worst RSA and write a fresh one.
6. **Confirm dad logged his calls** → `leads.js funnel` should roughly match Google's call count. Gaps
   mean dad forgot to log — remind him.

Dad's side, ~10 seconds per call: log every incoming call with source + which ad/search, via `/lead`.

---

## 5. Kill criteria (when to pause)

- **Keyword:** spent ≥ **2× target cost-per-call** and produced **0 calls** → pause it.
- **Ad (RSA):** after ≥ ~500 impressions in its group, the lowest-CTR ad → pause and replace.
- **Ad group:** cost-per-call runs 1.5× the threshold for 2 weeks while another group is fine → cut its
  budget share, feed the winner.
- **Whole campaign:** after a full month, if cost-per-call > the BUDGET.md kill threshold **and** no
  bookings closed → pause and reassess the landing page / offer / geo before spending more. Don't
  "give it more time" past that — a working transport-call funnel shows calls inside 2–3 weeks.

---

## 6. The ₪1,500 credit play (verify live terms at signup)

**Mechanic (standard Google Ads new-account intro offer — confirm the exact numbers at ads.google.com
when you sign up, they vary by market/time):** a brand-new account that applies the promo code and
then **spends ₪1,500 in eligible ad spend within 60 days** gets **₪1,500 in ad credit**. The credit is
*not* free upfront — it's a spend-matched reward.

- **Claim it at account creation** — enter/redeem the promo code in the first days, before or right
  after the first billing setup. Retro-applying later usually fails eligibility.
- **Timing math:** at **₪25/day (~₪750/mo)** you reach ₪1,500 at ~day 60 — *cutting it close*. To bank
  the credit with margin, run **₪30/day (~₪900/mo) for the first 60 days**: cumulative spend ≈ ₪1,800
  by day 60, clearing the ₪1,500 bar comfortably, then settle back to ₪25/day. (Full budget math →
  BUDGET.md.)
- **Real cash risk is ₪1,500** (dad's spend) to earn ₪1,500 credit — i.e. the first ~₪3,000 of
  advertising costs ₪1,500 out of pocket. The credit effectively doubles months 3–4 of the pilot.
- **Verify at signup:** the live offer amount, the spend window (60 days is typical but confirm),
  Israel/ILS eligibility, and that the code is applied to *this* account before spend accrues.

---

## Reused vs built
- **Reused:** the RSA char-limit convention (≤30/≤90) and the campaign-name→lead-log exact-match
  handshake from `Architect/invoice-engine` (`ads-kit.js` + `leads.js` / `/lead`). Conversion loop
  (call → `/lead` → `leads.js funnel` booked value) is the existing engine — this kit feeds it.
- **Built new:** all copy/keywords/structure for the REAL business. The existing `ads-kit.js` targets
  Haifa/north + employee-shuttles/minibus — wrong geo and wrong service. This kit uses the real
  Jerusalem/Gush-Etzion 56-seat-bus airport/wedding/tour business (ground truth: site `Home.tsx` +
  HUD bot persona pricing bands).
