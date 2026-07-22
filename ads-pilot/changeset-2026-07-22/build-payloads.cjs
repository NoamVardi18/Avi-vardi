#!/usr/bin/env node
// Emits ready-to-send Google Ads v21 REST mutate bodies from the changeset data files.
// Tomorrow's session runs this, then sends each body via COMPOSIO_REMOTE_WORKBENCH proxy_execute
// (validateOnly:true first, then without validateOnly). PAUSE-positive bodies need criterion IDs
// that are pulled fresh at run time — those are emitted as TEMPLATES with <CRIT_ID:...> placeholders.
const fs = require('fs');
const path = require('path');
const CID = '1128064207';
const CAMPAIGN = '24022931741';
const FINAL_URL = 'https://www.avivardi.online';
const d = f => JSON.parse(fs.readFileSync(path.join(__dirname, f), 'utf8'));
const HL = d('headlines.json'), ADDS = d('keyword-adds.json'), NEGS = d('negatives.json'), PAUSES = d('keyword-pauses.json');
const out = {};

// 1) RSA creates (adGroupAds:mutate) — new ads ENABLED; campaign stays PAUSED so nothing serves yet
out.rsa_creates = HL.ad_groups.map(g => ({
  _group: g.name, _endpoint: `https://googleads.googleapis.com/v21/customers/${CID}/adGroupAds:mutate`,
  operations: [{ create: {
    adGroup: `customers/${CID}/adGroups/${g.ad_group_id}`,
    status: 'ENABLED',
    ad: { finalUrls: [FINAL_URL], responsiveSearchAd: {
      headlines: g.headlines.map(t => ({ text: t })),
      descriptions: g.descriptions.map(t => ({ text: t })) } } } }]
}));

// 2) old-ad pauses (adGroupAds:mutate update) — resourceName = adGroupId~adId (known from ads.json)
out.old_ad_pauses = { _endpoint: `https://googleads.googleapis.com/v21/customers/${CID}/adGroupAds:mutate`,
  operations: HL.ad_groups.flatMap(g => g.old_ad_ids.map(adId => ({
    update: { resourceName: `customers/${CID}/adGroupAds/${g.ad_group_id}~${adId}`, status: 'PAUSED' },
    updateMask: 'status' }))) };

// 3) exact-match positive adds (adGroupCriteria:mutate create)
out.keyword_adds = { _endpoint: `https://googleads.googleapis.com/v21/customers/${CID}/adGroupCriteria:mutate`,
  operations: ADDS.map(k => ({ create: {
    adGroup: `customers/${CID}/adGroups/${k.ad_group_id}`, status: 'ENABLED',
    keyword: { text: k.text, matchType: k.match } } })) };

// 4) negative adds (campaignCriteria:mutate create) — only decision add / add-if-absent, only after runtime dedup
out.negative_adds = { _endpoint: `https://googleads.googleapis.com/v21/customers/${CID}/campaignCriteria:mutate`,
  _note: 'Send only candidates NOT already in the fresh negative pull. add-if-absent = dedup first.',
  operations: NEGS.filter(n => n.decision === 'add' || n.decision === 'add-if-absent').map(n => ({
    create: { campaign: `customers/${CID}/campaigns/${CAMPAIGN}`, negative: true,
      keyword: { text: n.text, matchType: n.match } }, _decision: n.decision })) };

// 5) positive-keyword pauses (adGroupCriteria:mutate update) — TEMPLATE: fill <CRIT_ID> from fresh query #3
out.keyword_pauses_TEMPLATE = { _endpoint: `https://googleads.googleapis.com/v21/customers/${CID}/adGroupCriteria:mutate`,
  _note: 'Match each text to its criterion_id via GAQL query #3, then set resourceName = adGroupId~criterionId.',
  operations: PAUSES.map(p => ({
    update: { resourceName: `customers/${CID}/adGroupCriteria/${p.ad_group_id}~<CRIT_ID:${p.text}>`, status: 'PAUSED' },
    updateMask: 'status', _text: p.text, _priority: p.priority })) };

const outPath = path.join(__dirname, 'payloads.generated.json');
fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
console.log('Wrote ' + outPath);
console.log(`RSA creates: ${out.rsa_creates.length} | old-ad pauses: ${out.old_ad_pauses.operations.length} | keyword adds: ${out.keyword_adds.operations.length} | negative adds (pre-dedup): ${out.negative_adds.operations.length} | keyword pauses: ${out.keyword_pauses_TEMPLATE.operations.length}`);
