#!/usr/bin/env node
// Verifies the changeset against Noam's hard rules:
//   1. every headline <= 30 chars AND contains a bus word
//   2. every description <= 90 chars
//   3. self-block check: each negative candidate substring-grepped vs ALL live positive keywords (from ads.json)
//   4. no exact-add keyword duplicates an existing live keyword
// Uses [...str] for length so multi-byte Hebrew/gershayim count as 1 grapheme each (matches Google's char count).
const fs = require('fs');
const path = require('path');

const HL = JSON.parse(fs.readFileSync(path.join(__dirname, 'headlines.json'), 'utf8'));
const ADS = JSON.parse(fs.readFileSync(
  path.join(process.env.HOME, 'Claude/Architect/invoice-engine/ads-ops/ads.json'), 'utf8'));

const BUS = HL._meta.bus_words;
const len = s => [...s].length;
const hasBus = s => BUS.some(w => s.includes(w));

let fail = 0;
console.log('=== HEADLINE / DESCRIPTION CHECK (limit 30 / 90) ===');
for (const g of HL.ad_groups) {
  console.log(`\n[${g.name}]  (${g.headlines.length} headlines, ${g.descriptions.length} descriptions)`);
  g.headlines.forEach(h => {
    const L = len(h), okL = L <= 30, okB = hasBus(h);
    if (!okL || !okB) fail++;
    console.log(`  H ${String(L).padStart(2)} ${okL ? 'ok' : 'LONG'} ${okB ? 'bus' : 'NO-BUS'}  ${h}`);
  });
  g.descriptions.forEach(d => {
    const L = len(d), okL = L <= 90;
    if (!okL) fail++;
    console.log(`  D ${String(L).padStart(2)} ${okL ? 'ok' : 'LONG'}       ${d}`);
  });
}

// ---- self-block check for negative candidates ----
const positives = ADS.keywords.map(k => k.text); // all 72 live keyword texts
const NEG_CANDIDATES = JSON.parse(fs.readFileSync(path.join(__dirname, 'negatives.json'), 'utf8'));
console.log('\n=== NEGATIVE SELF-BLOCK CHECK (candidate substring vs all ' + positives.length + ' live positives) ===');
for (const c of NEG_CANDIDATES) {
  const hits = positives.filter(p => p.includes(c.text));
  const verdict = hits.length ? 'SELF-BLOCK -> SKIP' : 'CLEAR';
  if (hits.length && c.decision === 'add') fail++; // an "add" that self-blocks is a build error
  console.log(`  ${verdict.padEnd(19)} [${c.decision}] "${c.text}"${hits.length ? '  hits: ' + hits.join(', ') : ''}`);
}

// ---- exact-add duplicate check ----
const EXACT_ADDS = JSON.parse(fs.readFileSync(path.join(__dirname, 'keyword-adds.json'), 'utf8'));
console.log('\n=== EXACT-ADD DUP CHECK (vs live keyword texts) + bus-word ===');
for (const k of EXACT_ADDS) {
  const dup = positives.includes(k.text);
  const bus = hasBus(k.text);
  if (dup || !bus) fail++;
  console.log(`  ${dup ? 'DUP!' : 'new '} ${bus ? 'bus' : 'NO-BUS'}  [exact] "${k.text}" -> ${k.group}`);
}

console.log(`\n=== ${fail === 0 ? 'PASS' : 'FAIL (' + fail + ' problems)'} ===`);
process.exit(fail === 0 ? 0 : 1);
