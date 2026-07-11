# BUDGET — Google Ads pilot, הסעות אבי ורדי

_All figures are planning estimates. Assumptions are stated honestly — replace with real numbers after
week 1–2 of live data. Nothing here spends money; this is the plan Noam runs by hand._

---

## Monthly budget: ₪600–900/mo

| Setting | Value | Note |
|---|---|---|
| Recommended daily | **₪30/day (~₪900/mo)** for the first 60 days | Banks the ₪1,500 credit with margin (see below) |
| Floor | ₪20/day (~₪600/mo) | Below this the credit deadline gets risky |
| After day 60 | settle to ₪25/day (~₪750/mo) | Once the credit is secured |
| Daily budget | `NOAM-DECIDES` | Google may spend up to ~2× daily on peak days, averaging to target |

**Budget split across the 3 ad groups** (start here, rebalance in week 2 on real data):

| Ad group | Share | ~₪/day @ ₪30 | Why |
|---|---|---|---|
| נתב"ג / שדה תעופה | ~45% | ₪13 | Highest search frequency + clearest "book now" intent |
| חתונות ואירועים | ~30% | ₪9 | Highest ticket value, but lower volume / planned ahead |
| טיולים והשכרת אוטובוס | ~25% | ₪8 | Broadest intent, more qualifying needed |

Simplest start: one shared campaign budget of ₪30/day, watch per-ad-group cost-per-call, shift budget
to the winner in week 2. Don't over-engineer the split before you have data.

---

## Expected CPC — honest assumptions (validate live)

There is no reliable public CPC for this exact Hebrew niche; these are estimates to be replaced by the
account's own data within days:
- **CPC:** ₪3–10, working estimate **~₪5–7** for local transport/rental search in Israel.
- **Click → call rate:** ~8–15% (a call/quote CTA on a decent landing page).
- **⇒ Cost per phone call ≈ CPC ÷ call-rate ≈ ₪6 ÷ 0.10 ≈ ₪60**, plausible range **₪35–₪100**.

At ₪30/day and ~₪60/call → roughly **10–15 calls/month**. One bus can comfortably serve the resulting
~3–6 bookings/month — **no over-demand risk at pilot budget** (capacity is not the constraint here).

---

## The one metric that decides continue / kill

> **Cost per phone call ≤ ₪70** → continue. Consistently above → fix or kill (see RUN-KIT §5).

**Where ₪70 comes from (recompute with real close rate after ~20 calls):**

```
avg first-ride value (blend, conservative)   ≈ ₪1,700   (airport ~₪1,700 / wedding ~₪2,000 / tour ~₪2,800 — HUD bot bands)
target acquisition cost ceiling  = 20% of ride ≈ ₪340    (generous: high margin, repeat + referral upside not counted)
assumed call → booking close rate            ≈ 25%       (warm inbound to a solo operator; range 20–40%)

max cost per booking  = ₪340
max cost per call      = max cost per booking × close rate = ₪340 × 0.25 = ₪85
operating threshold (safety margin)          = ₪70
```

Formula to re-derive once real data exists:
`max cost per call = (ride value × acceptable CAC %) × (calls that book ÷ total calls)`

- If dad closes better than 25% (likely for airport/wedding), the true ceiling is higher (at 40% close
  → ~₪136/call) — so **₪70 is deliberately conservative**. Loosen it once real close-rate is known.
- The expected ~₪60/call sits **under** the ₪70 line → the pilot is viable on paper. Week-1 data
  confirms or kills that.

---

## Month 1 vs Month 2 (+ the credit timeline)

**Month 1 — learn (₪30/day).** Goal: gather ≥15–20 tracked calls, mine the Search Terms report for
negatives, find the best ad group + keywords. **Don't judge cost-per-call harshly yet** — smart bidding
isn't on and data is thin. Bidding = Maximize Clicks.

**Month 2 — optimize + secure the credit (₪30/day through ~day 60).** Cumulative spend crosses **₪1,500
around day 60 → unlock the ₪1,500 credit** (RUN-KIT §6). Cut zero-call keywords, shift budget to
winners, and once ≥15–30 call-conversions exist, switch to **Maximize Conversions**. Now hold to the
**₪70** threshold.

**Credit cash-flow:** dad spends ~₪1,800 over 60 days to earn ₪1,500 credit → months 3–4 run largely on
credit. Net out-of-pocket to prove the funnel ≈ **₪1,500**, against a single booking worth ₪1,700–2,800.
One closed job roughly pays for the whole pilot's cash outlay.

```
Day 0 ────────── Day 60 ────────── Day 120
₪30/day          ₪1,500 spent       credit consumed
(learn)          → +₪1,500 credit   (prove ROAS on credit)
                 settle ₪25/day
```
