# Ads readiness — three taps (prepared 2026-09-05, ADS-READINESS night lane)

Money rule: nothing here was mutated. Everything below is read-only GAQL against the live
account (customer `1128064207`, campaign `24022931741` — "אבי ורדי — חיפוש") via the Composio
Google Ads connector, plus a read of this repo and `Architect/invoice-engine/ads-ops/`. Two of the
three things this brief was built around turned out to be **already shipped** weeks ago — that
correction is the most important thing in this file. Only one real gap remains.

## The three taps, in order

| # | Tap | What it is | What it unlocks |
|---|---|---|---|
| 1 | **Enable 2 ads** — `GOOGLEADS_MUTATE_AD_GROUP_ADS`, set status `ENABLED` on ad IDs `818296943683` (ad group `השכרת אוטובוס — כללי`, 198995179115) and `818296943686` (ad group `חתונות`, 201158533351). Both ads are **already Google-approved**, just paused. | Ends an **18-day, 0-traffic streak** on the Search campaign. Promo ₪663/₪1500 spent with a deadline (~6 days out as of 2026-09-03) will be missed at the current rate. | Traffic resumes today. |
| 2 | **No action** — CPC ceiling is already live at ₪6.00 on the account's portfolio bidding strategy (`biddingStrategies/12186451073`, "Maximize Clicks - avi vardi 2026-08-07"), applied 2026-08-28 per `ads-pilot/changeset-2026-08-28/APPLIED.md`. Confirmed still in effect by a fresh GAQL read tonight. | Nothing to unlock — already protecting against the ₪13.23 CPC spike. Optional: re-check ₪6 is still the right number a few days after tap #1 brings the two paused groups back online and CPC data resumes. | Peace of mind only. |
| 3 | **No action, verify only** — Conversion tracking (WhatsApp + phone click → Google Ads conversion) is already live in production: commit `2272f36` ("ads: wire Google Ads conversion tracking for WhatsApp + phone CTAs"), pushed to `origin/main`, confirmed present on `https://www.avivardi.online/` right now (`curl` shows `AW-18195393649` + the gtag conversion script). | Once tap #1 brings traffic back, check GAQL `SELECT segments.conversion_action_name, metrics.conversions FROM campaign WHERE campaign.id = 24022931741 AND segments.date DURING LAST_30_DAYS AND metrics.conversions > 0` after ~24-48h to confirm clicks are actually converting, not just landing. |

**Bottom line: there is exactly one thing to do — tap #1.** Taps #2 and #3 were already executed by an
earlier run; this lane's job was to verify that against the live account rather than re-build what
already exists.

---

## 1. What was asked vs. what is actually true tonight

The brief that generated this lane described two things as "decided weeks ago, never executed":
Google Ads conversion tracking, and the CPC ceiling script. Both artifacts mining hits are **stale**:

- **Conversion tracking**: built and deployed 2026-08-28 (see `client/index.html` lines ~185-208).
  Two conversion actions already exist and are `ENABLED` in the account today:
  - `WhatsApp Click - avivardi.online` — id `7737622685`, type `WEBPAGE`, category `CONTACT`
  - `Phone Click - avivardi.online` — id `7737622688`, type `WEBPAGE`, category `PHONE_CALL_LEAD`

  The site fires `gtag('event', 'conversion', {send_to: 'AW-18195393649/<label>'})` on any
  `tel:` or `wa.me` link click, via one delegated capture-phase listener (so it also catches
  React-rendered CTAs added after page load). This is live on production right now — verified by
  `curl https://www.avivardi.online/` showing the real `AW-18195393649` tag, not a placeholder.

- **CPC ceiling**: applied 2026-08-28 via the Composio connector (the account's only live write
  path — see below), not via `set_bid_ceiling.py`. Verified live tonight:

  ```
  GAQL: SELECT bidding_strategy.id, bidding_strategy.name, bidding_strategy.type,
        bidding_strategy.target_spend.cpc_bid_ceiling_micros
        FROM bidding_strategy WHERE bidding_strategy.id = 12186451073
  → id=12186451073, name="Maximize Clicks - avi vardi 2026-08-07", type=TARGET_SPEND,
    cpc_bid_ceiling_micros=6000000  (= ₪6.00)
  ```

  **Important catch for anyone who picks up `set_bid_ceiling.py` later**: this account's campaign
  does not use a standalone `TARGET_SPEND` strategy — it uses a **portfolio (shared) bidding
  strategy** (`campaign.bidding_strategy = customers/1128064207/biddingStrategies/12186451073`).
  `set_bid_ceiling.py` mutates `campaign.target_spend.cpc_bid_ceiling_micros` directly on the
  **campaign** resource via `CampaignService`. That field has no effect (and Google Ads is likely
  to reject the mutate, or silently no-op it) when the campaign's ceiling actually lives on the
  **portfolio bidding strategy** resource, which requires `BiddingStrategyService.MutateBiddingStrategies`
  (Composio: `GOOGLEADS_MUTATE_BIDDING_STRATEGIES`) instead. The script's own sanity check
  (`bidding_strategy_type != "TARGET_SPEND"` → refuse) does **not** catch this, because a portfolio
  strategy still reports type `TARGET_SPEND` — the check would pass, then the mutate would target
  the wrong resource. `validate_only=True` (which the script always runs first) should catch this
  before any real write, but the script has never been run against this account, so that has never
  been exercised. **Do not point this script at campaign `24022931741` without either (a) fixing it
  to mutate the bidding strategy when `campaign.bidding_strategy` is set, or (b) using
  `GOOGLEADS_MUTATE_BIDDING_STRATEGIES` directly instead.**

## 2. What was actually run tonight, and why the script itself can't be

`Architect/invoice-engine/ads-ops/api-application/sample/set_bid_ceiling.py` and
`read_campaign_state.py` are honestly labeled in their own docstrings and README as **code
samples for a developer-token application that has not been approved** — "there is no developer
token available yet." Confirmed tonight, live:

```
$ python3 read_campaign_state.py --customer-id 1128064207 --campaign-id 24022931741
Traceback (most recent call last):
  ...
  File ".../adsops_common.py", line 68, in load_client
    from google.ads.googleads.client import GoogleAdsClient
ModuleNotFoundError: No module named 'google'
```

The `google-ads` pip package isn't installed and there is no `google-ads.yaml` on this machine
(only the placeholder `google-ads.yaml.example`) — matching the sample's own DESIGN-DOC §4, which
states production actually runs through **Composio's managed connector**, not this direct-API
client. So there is no dry-run *output* to show from the script itself; instead here is the same
computation the script would do, done by hand against tonight's real GAQL read, so the reasoning is
verifiable even though the script can't execute:

```
Campaign 24022931741 — אבי ורדי — חיפוש
Bidding strategy: TARGET_SPEND (portfolio: biddingStrategies/12186451073)
Ceiling today: ₪6.00 (already set, on the portfolio strategy — see §1 above)
30-day trailing: 26 clicks, ₪297.06 cost → avg CPC ₪11.43 (0 clicks in the last 7 days — the
  campaign has been essentially dark since ~2026-08-18, consistent with the 18-day-streak claim)

Sanity check (script's own MIN/MAX ratio bounds, 0.5x-3.0x measured avg CPC):
  measured_cpc = ₪11.43 → valid range [₪5.71, ₪34.28]
  proposed ceiling ₪8.50 (the script's own usage example) → PASS, within range
  (but this is moot: the real ceiling lives on the portfolio strategy, already at ₪6.00, and
  this script does not touch that resource — see the catch in §1)
```

Exact command for the record, once a developer token exists and `google-ads.yaml` is filled in
(never run it against this account without first fixing the portfolio-strategy issue above):

```
python3 read_campaign_state.py --customer-id 1128064207 --campaign-id 24022931741 --config google-ads.yaml
python3 set_bid_ceiling.py --customer-id 1128064207 --campaign-id 24022931741 --ceiling-ils 8.50 --config google-ads.yaml
# --apply only after reading the dry-run output above and agreeing with it:
python3 set_bid_ceiling.py --customer-id 1128064207 --campaign-id 24022931741 --ceiling-ils 8.50 --apply --config google-ads.yaml
```

## 3. Ads to enable (the one real gap — tap #1)

Live GAQL tonight, `ad_group_ad` for campaign 24022931741:

| Ad group | Ad group status | Ads (id: status) |
|---|---|---|
| טיולים ואירועים (197000680966) | ENABLED | 816419150547: REMOVED, 816438019647: REMOVED, 818296943680: PAUSED, **822576473695: ENABLED** |
| השכרת אוטובוס — כללי (198995179115) | ENABLED | 816438019650: REMOVED, 816454544560: REMOVED, **818296943683: PAUSED** — 0 enabled |
| חתונות (201158533351) | ENABLED | 816438019644: REMOVED, 816527498297: REMOVED, **818296943686: PAUSED** — 0 enabled |
| נתב״ג (202032774927) | **PAUSED** (deliberate — Noam's ruling 2026-08-05, airport runs unprofitable) | 816438019641: REMOVED, 816454215061: REMOVED, 818296943689: ENABLED (moot — group is paused) |

**2 of 3 live ad groups have 0 ENABLED ads** — confirmed, matches the standing issue in
`Architect/knowledge/shared-context.md` (2026-09-03 entry) and `ads-pilot/changeset-2026-08-28/APPLIED.md`'s
own "Next" list (item 1, never done). Both ads that need enabling are **already built and
Google-approved** — no new ad copy needs writing (it already exists, RSA headlines/descriptions in
`ads-pilot/changeset-2026-07-22/headlines.json`, ad groups `198995179115` and `201158533351`, all
containing the literal word אוטובוס per Noam's standing rule). This is a status flip, not a
content task.

**The tap** — Composio, read-only until Noam approves, then run exactly this:

```
GOOGLEADS_MUTATE_AD_GROUP_ADS
customer_id: 1128064207
operations:
  - update:
      resource_name: customers/1128064207/adGroupAds/198995179115~818296943683
      status: ENABLED
    update_mask: status
  - update:
      resource_name: customers/1128064207/adGroupAds/201158533351~818296943686
      status: ENABLED
    update_mask: status
```

Run `validate_only=True` first if the tool supports it, then the real mutate, then re-query
`ad_group_ad` for these two resource names to confirm `status = ENABLED` before declaring done —
same read→reason→guard→mutate→re-verify pattern as `set_bid_ceiling.py`, just on the right
resource this time.

## 4. Self-negative

- I did not actually execute `set_bid_ceiling.py` against a live API in any mode — it cannot run
  in this environment (no `google-ads` package, no developer token, no `google-ads.yaml`). The
  "dry run" in §2 is a hand-computation using real numbers, not the script's own stdout.
- I did not confirm the two paused ads' actual headline/description text against Google's current
  copy via GAQL (only cross-referenced against `headlines.json` and `APPLIED.md`'s own claim that
  they're APPROVED) — worth a quick GAQL `ad_group_ad.ad.responsive_search_ad` pull before tapping,
  in case they were edited since 2026-08-28.
- I did not check whether the ₪6.00 ceiling is still well-calibrated for the campaign's *current*
  keyword mix post the 2026-08-28 negative-keyword/EXACT-match tightening — only that it's set and
  unchanged.
- I have not verified conversion tracking actually fires end-to-end (no real click has happened in
  18 days to test it against) — §"3rd tap" above is a verify-after-traffic-resumes step, not proof
  it works today.
- No mutation was made anywhere in the account; the ad-enable payload above is written but NOT run.
