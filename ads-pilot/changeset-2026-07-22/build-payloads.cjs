#!/usr/bin/env node
// Emits ready-to-send Google Ads v21 REST mutate bodies from the changeset data files.
// Tomorrow's session runs this, then sends each body via COMPOSIO_REMOTE_WORKBENCH proxy_execute
// (validateOnly:true first, then without validateOnly). PAUSE-positive bodies need criterion IDs
// pulled fresh at run time — those are emitted as TEMPLATES with <CRIT_ID:...> placeholders.
//
// TIGHTENED LAW (2026-07-23): every headline contains אוטובוס; the 8 old ads are REMOVED (not paused);
// every live keyword lacking אוטובוס is PAUSED; מיניבוס negative added AFTER those pauses; campaign
// ENABLED as the LAST mutation, conditional on the post-verify bus-word assertion passing.
//
// EXECUTION ORDER (see PUSH-RUNBOOK.md STEP 3): a) rsa_creates  b) old_ad_removes  c) keyword_adds
//   d) keyword_pauses  e) negative_adds (incl מיניבוס, self-block-safe post-pause)  f) campaign_bidding_ceiling (conditional)
//   g) POST-VERIFY  h) campaign_enable (LAST, only if post-verify passed)
const fs = require('fs');
const path = require('path');
const CID = '1128064207';
const CAMPAIGN = '24022931741';
const FINAL_URL = 'https://www.avivardi.online';
const d = f => JSON.parse(fs.readFileSync(path.join(__dirname, f), 'utf8'));
const HL = d('headlines.json'), ADDS = d('keyword-adds.json'), NEGS = d('negatives.json'), PAUSES = d('keyword-pauses.json');
const out = {};

// a) RSA creates (adGroupAds:mutate) — new ads ENABLED; campaign stays PAUSED until step (h) so nothing serves yet
out.rsa_creates = HL.ad_groups.map(g => ({
  _group: g.name, _endpoint: `https://googleads.googleapis.com/v21/customers/${CID}/adGroupAds:mutate`,
  operations: [{ create: {
    adGroup: `customers/${CID}/adGroups/${g.ad_group_id}`,
    status: 'ENABLED',
    ad: { finalUrls: [FINAL_URL], responsiveSearchAd: {
      headlines: g.headlines.map(t => ({ text: t })),
      descriptions: g.descriptions.map(t => ({ text: t })) } } } }]
}));

// b) old-ad REMOVES (adGroupAds:mutate remove) — Noam's order "תמחק את המודעות הלא טובות" (REMOVE, not pause)
//    remove op takes a resourceName STRING (adGroupId~adId, known from ads.json)
out.old_ad_removes = { _endpoint: `https://googleads.googleapis.com/v21/customers/${CID}/adGroupAds:mutate`,
  operations: HL.ad_groups.flatMap(g => g.old_ad_ids.map(adId => ({
    remove: `customers/${CID}/adGroupAds/${g.ad_group_id}~${adId}` }))) };

// c) exact-match positive adds (adGroupCriteria:mutate create) — all contain אוטובוס
out.keyword_adds = { _endpoint: `https://googleads.googleapis.com/v21/customers/${CID}/adGroupCriteria:mutate`,
  operations: ADDS.map(k => ({ create: {
    adGroup: `customers/${CID}/adGroups/${k.ad_group_id}`, status: 'ENABLED',
    keyword: { text: k.text, matchType: k.match } } })) };

// d) positive-keyword PAUSES (adGroupCriteria:mutate update) — ALL live keywords lacking אוטובוס.
//    TEMPLATE: fill <CRIT_ID> from the fresh Step-1 keyword pull (match by exact text).
out.keyword_pauses_TEMPLATE = { _endpoint: `https://googleads.googleapis.com/v21/customers/${CID}/adGroupCriteria:mutate`,
  _note: 'Match each text to its criterion_id via the Step-1 keyword pull, then set resourceName = adGroupId~criterionId. Any text not in the live pull (already removed) -> drop that op.',
  operations: PAUSES.map(p => ({
    update: { resourceName: `customers/${CID}/adGroupCriteria/${p.ad_group_id}~<CRIT_ID:${p.text}>`, status: 'PAUSED' },
    updateMask: 'status', _text: p.text, _reason: p.reason })) };

// e) negative adds (campaignCriteria:mutate create) — only decision add / add-if-absent, only after runtime dedup.
//    מיניבוס/מיניבוסים MUST be sent AFTER step (d) pauses land (they self-block minibus positives pre-pause).
out.negative_adds = { _endpoint: `https://googleads.googleapis.com/v21/customers/${CID}/campaignCriteria:mutate`,
  _note: 'Send only candidates NOT already in the fresh negative pull. add-if-absent = dedup first. מיניבוס/מיניבוסים AND עבודה require step (d) pauses confirmed landed first (they self-block live positives pre-pause).',
  operations: NEGS.filter(n => n.decision === 'add' || n.decision === 'add-if-absent').map(n => ({
    create: { campaign: `customers/${CID}/campaigns/${CAMPAIGN}`, negative: true,
      keyword: { text: n.text, matchType: n.match } }, _decision: n.decision, _cat: n.cat })) };

// f) OPTIONAL bidding ceiling (campaigns:mutate update) — CONDITIONAL: apply ONLY if the Step-1 pull shows
//    campaign.bidding_strategy_type == TARGET_SPEND (Maximize Clicks). Otherwise DROP this op and report the
//    actual strategy instead. ₪8 = 8,000,000 micros. Budget (₪30/day) stays untouched.
out.campaign_bidding_ceiling_CONDITIONAL = {
  _endpoint: `https://googleads.googleapis.com/v21/customers/${CID}/campaigns:mutate`,
  _note: 'APPLY ONLY IF bidding_strategy_type == TARGET_SPEND (Maximize Clicks). Else drop + report the strategy. Do NOT touch budget.',
  operations: [{
    update: { resourceName: `customers/${CID}/campaigns/${CAMPAIGN}`,
      targetSpend: { cpcBidCeilingMicros: '8000000' } },
    updateMask: 'target_spend.cpc_bid_ceiling_micros' }] };

// h) campaign ENABLE (campaigns:mutate update) — the LAST mutation, ONLY after post-verify passes.
//    Noam's explicit approval 2026-07-23: "תתקן הכל כולל להפעיל את הפרסומת".
out.campaign_enable = {
  _endpoint: `https://googleads.googleapis.com/v21/customers/${CID}/campaigns:mutate`,
  _note: 'RUN LAST. Only send after STEP 4 post-verify asserts every ENABLED headline contains אוטובוס. If post-verify fails, DO NOT enable — Telegram Noam.',
  operations: [{
    update: { resourceName: `customers/${CID}/campaigns/${CAMPAIGN}`, status: 'ENABLED' },
    updateMask: 'status' }] };

const outPath = path.join(__dirname, 'payloads.generated.json');
fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
console.log('Wrote ' + outPath);
console.log(`RSA creates: ${out.rsa_creates.length} | old-ad REMOVES: ${out.old_ad_removes.operations.length} | keyword adds: ${out.keyword_adds.operations.length} | keyword PAUSES: ${out.keyword_pauses_TEMPLATE.operations.length} | negative adds (pre-dedup): ${out.negative_adds.operations.length} | bidding ceiling (conditional): ${out.campaign_bidding_ceiling_CONDITIONAL.operations.length} | campaign ENABLE (last): ${out.campaign_enable.operations.length}`);
