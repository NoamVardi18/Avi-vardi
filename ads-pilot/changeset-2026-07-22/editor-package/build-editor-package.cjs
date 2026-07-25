#!/usr/bin/env node
/* Builds the Google Ads Editor manual-import package from the changeset JSONs.
   Writes ONLY into editor-package/. No API calls. */
const fs = require('fs');
const path = require('path');

const CHDIR = path.resolve(__dirname, '..');           // changeset-2026-07-22/
const OUT = __dirname;                                  // editor-package/
const ADSJSON = '/Users/vardi/Claude/Architect/invoice-engine/ads-ops/ads.json';

const headlines = JSON.parse(fs.readFileSync(path.join(CHDIR, 'headlines.json'), 'utf8'));
const kwAdds = JSON.parse(fs.readFileSync(path.join(CHDIR, 'keyword-adds.json'), 'utf8'));
const kwPauses = JSON.parse(fs.readFileSync(path.join(CHDIR, 'keyword-pauses.json'), 'utf8'));
const negatives = JSON.parse(fs.readFileSync(path.join(CHDIR, 'negatives.json'), 'utf8'));
const ads = JSON.parse(fs.readFileSync(ADSJSON, 'utf8'));

const BOM = '﻿';
const CAMPAIGN = headlines._meta.campaign_name;       // "אבי ורדי — חיפוש"
const FINAL_URL = headlines._meta.final_url;

// ---- byte-match campaign + ad-group names against ads.json ----
const adsCampaign = ads.campaigns.find(c => c.id === headlines._meta.campaign_id);
const nameChecks = [];
nameChecks.push(['campaign', CAMPAIGN, adsCampaign ? adsCampaign.name : '(not found)']);
const adsGroupById = {};
ads.ad_groups.forEach(g => { adsGroupById[g.id] = g.name; });

// CSV field quoter — quote every field, escape embedded quotes.
const q = s => '"' + String(s).replace(/"/g, '""') + '"';
const row = arr => arr.map(q).join(',');

// ================= RSAs =================
const H = 15, D = 4;
const rsaHeader = ['Campaign', 'Ad group', 'Ad type', 'Status', 'Final URL', 'Path 1', 'Path 2'];
for (let i = 1; i <= H; i++) rsaHeader.push('Headline ' + i);
for (let i = 1; i <= D; i++) rsaHeader.push('Description ' + i);

const rsaRows = [rsaHeader];
headlines.ad_groups.forEach(g => {
  nameChecks.push(['ad_group ' + g.ad_group_id, g.name, adsGroupById[g.ad_group_id] || '(not found)']);
  const cells = [CAMPAIGN, g.name, 'Responsive search ad', 'Enabled', FINAL_URL, '', ''];
  for (let i = 0; i < H; i++) cells.push(g.headlines[i] || '');
  for (let i = 0; i < D; i++) cells.push(g.descriptions[i] || '');
  rsaRows.push(cells);
});
fs.writeFileSync(path.join(OUT, 'rsas-import.csv'), BOM + rsaRows.map(row).join('\r\n') + '\r\n');

// ================= Keywords (adds + pauses) =================
const kwHeader = ['Campaign', 'Ad group', 'Keyword', 'Match Type', 'Status'];
const kwRows = [kwHeader];
const mt = m => ({ EXACT: 'Exact', PHRASE: 'Phrase', BROAD: 'Broad' }[m] || m);
kwAdds.forEach(k => kwRows.push([CAMPAIGN, k.group, k.text, mt(k.match), 'Enabled']));
kwPauses.forEach(k => kwRows.push([CAMPAIGN, k.group, k.text, mt(k.match), 'Paused']));
fs.writeFileSync(path.join(OUT, 'keywords-import.csv'), BOM + kwRows.map(row).join('\r\n') + '\r\n');

// ================= Campaign negatives =================
const negHeader = ['Campaign', 'Keyword', 'Match Type'];
const negRows = [negHeader];
const negMt = m => ({ EXACT: 'Campaign Negative Exact', PHRASE: 'Campaign Negative Phrase', BROAD: 'Campaign Negative Broad' }[m] || m);
negatives.forEach(n => negRows.push([CAMPAIGN, n.text, negMt(n.match)]));
fs.writeFileSync(path.join(OUT, 'negatives-import.csv'), BOM + negRows.map(row).join('\r\n') + '\r\n');

// ================= report =================
console.log('WROTE:');
console.log('  rsas-import.csv     : ' + (rsaRows.length - 1) + ' RSAs, ' + rsaHeader.length + ' cols');
console.log('  keywords-import.csv : ' + kwAdds.length + ' adds + ' + kwPauses.length + ' pauses = ' + (kwRows.length - 1) + ' rows');
console.log('  negatives-import.csv: ' + (negRows.length - 1) + ' campaign negatives');
console.log('\nNAME BYTE-MATCH vs ads.json:');
let allMatch = true;
nameChecks.forEach(([w, a, b]) => {
  const ok = a === b;
  if (!ok) allMatch = false;
  console.log('  [' + (ok ? 'OK ' : 'MISMATCH') + '] ' + w + ': pkg="' + a + '" ads.json="' + b + '"');
});
console.log('\nALL NAMES BYTE-MATCH: ' + allMatch);
