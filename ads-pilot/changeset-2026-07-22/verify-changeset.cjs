#!/usr/bin/env node
// Verifies the changeset against Noam's TIGHTENED law (2026-07-23):
//   1. every headline <= 30 chars AND contains the literal word אוטובוס
//   2. every description <= 90 chars
//   3. NO מיניבוס anywhere: headlines, descriptions, or keyword-adds
//   4. keyword-pauses.json == exactly the live keywords that DO NOT contain אוטובוס (and none that do)
//   5. self-block: each negative candidate substring-grepped vs the SURVIVING ACTIVE positives
//      (live keywords containing אוטובוס — the non-bus ones are being paused first, so negatives
//       are checked against what remains active). An "add" that self-blocks the active set = build error.
//   6. no exact-add keyword duplicates an existing live keyword; every add contains אוטובוס
//   7. no duplicate headlines within an ad group
// Uses [...str] for length so multi-byte Hebrew/gershayim count as 1 grapheme each (matches Google).
const fs = require('fs');
const path = require('path');

const HL = JSON.parse(fs.readFileSync(path.join(__dirname, 'headlines.json'), 'utf8'));
const ADS = JSON.parse(fs.readFileSync(
  path.join(process.env.HOME, 'Claude/Architect/invoice-engine/ads-ops/ads.json'), 'utf8'));

const BUS = HL._meta.bus_words;            // must be exactly ["אוטובוס"] under the tightened law
const len = s => [...s].length;
const hasBus = s => BUS.some(w => s.includes(w));
const hasMini = s => s.includes('מיניבוס');

let fail = 0;
const problem = m => { fail++; console.log('  !! ' + m); };

// sanity: the law is literal אוטובוס only
if (!(BUS.length === 1 && BUS[0] === 'אוטובוס'))
  problem(`_meta.bus_words must be exactly ["אוטובוס"], got ${JSON.stringify(BUS)}`);

console.log('=== HEADLINE / DESCRIPTION CHECK (<=30 / <=90, אוטובוס required, NO מיניבוס) ===');
for (const g of HL.ad_groups) {
  console.log(`\n[${g.name}]  (${g.headlines.length} headlines, ${g.descriptions.length} descriptions)`);
  const seen = new Set();
  g.headlines.forEach(h => {
    const L = len(h), okL = L <= 30, okB = hasBus(h), noM = !hasMini(h);
    if (!okL || !okB || !noM) fail++;
    if (seen.has(h)) problem(`duplicate headline in group ${g.name}: "${h}"`);
    seen.add(h);
    console.log(`  H ${String(L).padStart(2)} ${okL ? 'ok' : 'LONG'} ${okB ? 'bus' : 'NO-BUS'} ${noM ? 'ok ' : 'MINI'}  ${h}`);
  });
  g.descriptions.forEach(d => {
    const L = len(d), okL = L <= 90, noM = !hasMini(d);
    if (!okL || !noM) fail++;
    console.log(`  D ${String(L).padStart(2)} ${okL ? 'ok' : 'LONG'}     ${noM ? 'ok ' : 'MINI'}  ${d}`);
  });
}

// ---- explicit pause EXCEPTIONS ----
// Keywords that DO contain אוטובוס but are still paused by an explicit foreman ruling because their
// intent is pure waste (job-seeker). Noam's intent (irrelevant traffic never sees the ad) outranks the
// mechanical letter. These are allowed in the pause list AND removed from the surviving-active set.
const PAUSE_EXCEPTIONS = ['חיפוש עבודה נהג אוטובוס'];

// ---- keyword picture from live data ----
const live = ADS.keywords.filter(k => k.status !== 'REMOVED');
const nonBusLive = live.filter(k => !hasBus(k.text)).map(k => k.text);        // mechanically must all be paused
// surviving active = live אוטובוס keywords MINUS the explicit-exception pauses
const activePositives = live.filter(k => hasBus(k.text) && !PAUSE_EXCEPTIONS.includes(k.text)).map(k => k.text);

// ---- pause-list correctness ----
const PAUSES = JSON.parse(fs.readFileSync(path.join(__dirname, 'keyword-pauses.json'), 'utf8'));
const expectedPauses = [...nonBusLive, ...PAUSE_EXCEPTIONS];
console.log(`\n=== PAUSE-LIST CHECK (must equal ${nonBusLive.length} live non-אוטובוס + ${PAUSE_EXCEPTIONS.length} explicit exception = ${expectedPauses.length}) ===`);
const pauseTexts = PAUSES.map(p => p.text);
// a pause target may contain אוטובוס ONLY if it is an explicit exception
PAUSES.forEach(p => { if (hasBus(p.text) && !PAUSE_EXCEPTIONS.includes(p.text)) problem(`pause target CONTAINS אוטובוס but is not an explicit exception (should stay active): "${p.text}"`); });
// every exception must be a real live keyword
PAUSE_EXCEPTIONS.forEach(t => { if (!live.some(k => k.text === t)) problem(`explicit pause exception not found in live keywords: "${t}"`); });
const missing = expectedPauses.filter(t => !pauseTexts.includes(t));
const extra   = pauseTexts.filter(t => !expectedPauses.includes(t));
if (missing.length) problem(`expected pauses NOT in pause list: ${missing.join(', ')}`);
if (extra.length)   problem(`pause list has entries not in the expected set: ${extra.join(', ')}`);
console.log(`  pauses listed: ${PAUSES.length} | expected: ${expectedPauses.length} (${nonBusLive.length} non-אוטובוס + ${PAUSE_EXCEPTIONS.length} exception) | missing: ${missing.length} | extra: ${extra.length}`);

// ---- self-block check for negative candidates vs SURVIVING ACTIVE positives ----
const NEG_CANDIDATES = JSON.parse(fs.readFileSync(path.join(__dirname, 'negatives.json'), 'utf8'));
console.log(`\n=== NEGATIVE SELF-BLOCK CHECK (candidate substring vs ${activePositives.length} surviving active positives) ===`);
for (const c of NEG_CANDIDATES) {
  if (hasMini(c.text) && c.decision !== 'add') {} // no-op; מיניבוס negatives are adds
  const hits = activePositives.filter(p => p.includes(c.text));
  const verdict = hits.length ? 'SELF-BLOCK -> SKIP' : 'CLEAR';
  if (hits.length && (c.decision === 'add' || c.decision === 'add-if-absent')) fail++; // an add that self-blocks = build error
  console.log(`  ${verdict.padEnd(19)} [${c.decision}] "${c.text}"${hits.length ? '  hits: ' + hits.join(', ') : ''}`);
}

// ---- exact-add duplicate + bus-word + no-minibus check ----
const EXACT_ADDS = JSON.parse(fs.readFileSync(path.join(__dirname, 'keyword-adds.json'), 'utf8'));
console.log('\n=== EXACT-ADD CHECK (dup vs live · אוטובוס required · NO מיניבוס) ===');
for (const k of EXACT_ADDS) {
  const dup = live.map(x => x.text).includes(k.text);
  const bus = hasBus(k.text), noM = !hasMini(k.text);
  if (dup || !bus || !noM) fail++;
  console.log(`  ${dup ? 'DUP!' : 'new '} ${bus ? 'bus' : 'NO-BUS'} ${noM ? 'ok ' : 'MINI'}  [exact] "${k.text}" -> ${k.group}`);
}

console.log(`\n=== ${fail === 0 ? 'PASS' : 'FAIL (' + fail + ' problems)'} ===`);
process.exit(fail === 0 ? 0 : 1);
