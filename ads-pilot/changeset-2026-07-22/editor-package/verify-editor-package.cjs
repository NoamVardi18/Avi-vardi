#!/usr/bin/env node
/* Reads the generated CSVs back and asserts the law. Exit 1 on any failure. */
const fs = require('fs');
const path = require('path');
const OUT = __dirname;

// Minimal RFC4180 CSV parser (handles quoted fields, "" escapes, CRLF).
function parseCSV(text) {
  if (text.charCodeAt(0) === 0xFEFF) text = text.slice(1); // strip BOM
  const rows = []; let field = '', rowArr = [], inQ = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQ) {
      if (c === '"') { if (text[i + 1] === '"') { field += '"'; i++; } else inQ = false; }
      else field += c;
    } else {
      if (c === '"') inQ = true;
      else if (c === ',') { rowArr.push(field); field = ''; }
      else if (c === '\r') { /* skip */ }
      else if (c === '\n') { rowArr.push(field); rows.push(rowArr); rowArr = []; field = ''; }
      else field += c;
    }
  }
  if (field.length || rowArr.length) { rowArr.push(field); rows.push(rowArr); }
  return rows;
}

let fail = 0;
const problems = [];
const BUS = 'אוטובוס', MINI = 'מיניבוס';

// -------- RSAs --------
const rsa = parseCSV(fs.readFileSync(path.join(OUT, 'rsas-import.csv'), 'utf8'));
const hdr = rsa[0];
const cols = hdr.length;
const hIdx = []; const dIdx = [];
hdr.forEach((h, i) => { if (/^Headline \d+$/.test(h)) hIdx.push(i); if (/^Description \d+$/.test(h)) dIdx.push(i); });
console.log('RSA CSV: header cols=' + cols + ', Headline cols=' + hIdx.length + ', Description cols=' + dIdx.length + ', data rows=' + (rsa.length - 1));

let totalHeadlines = 0, totalDesc = 0;
for (let r = 1; r < rsa.length; r++) {
  const rowArr = rsa[r];
  if (rowArr.length !== cols) { problems.push('row ' + r + ' has ' + rowArr.length + ' cols, expected ' + cols); fail++; }
  const ag = rowArr[1];
  // headlines
  hIdx.forEach(i => {
    const hl = (rowArr[i] || '').trim();
    if (!hl) return;
    totalHeadlines++;
    const len = [...hl].length; // count code points
    if (len > 30) { problems.push('[' + ag + '] headline >30 (' + len + '): ' + hl); fail++; }
    if (!hl.includes(BUS)) { problems.push('[' + ag + '] headline missing אוטובוס: ' + hl); fail++; }
    if (hl.includes(MINI)) { problems.push('[' + ag + '] headline contains מיניבוס: ' + hl); fail++; }
  });
  // descriptions
  dIdx.forEach(i => {
    const ds = (rowArr[i] || '').trim();
    if (!ds) return;
    totalDesc++;
    const len = [...ds].length;
    if (len > 90) { problems.push('[' + ag + '] description >90 (' + len + '): ' + ds); fail++; }
    if (ds.includes(MINI)) { problems.push('[' + ag + '] description contains מיניבוס: ' + ds); fail++; }
  });
  // ad type + status + final url
  if (rowArr[2] !== 'Responsive search ad') { problems.push('row ' + r + ' Ad type != Responsive search ad: ' + rowArr[2]); fail++; }
  if (rowArr[3] !== 'Enabled') { problems.push('row ' + r + ' Status != Enabled: ' + rowArr[3]); fail++; }
  if (!/^https:\/\/www\.avivardi\.online/.test(rowArr[4])) { problems.push('row ' + r + ' Final URL wrong: ' + rowArr[4]); fail++; }
}
console.log('RSA totals: ' + totalHeadlines + ' headlines, ' + totalDesc + ' descriptions checked');

// -------- Keywords --------
const kw = parseCSV(fs.readFileSync(path.join(OUT, 'keywords-import.csv'), 'utf8'));
const kwCols = kw[0].length;
let adds = 0, pauses = 0, kwBad = 0;
for (let r = 1; r < kw.length; r++) {
  const a = kw[r];
  if (a.length !== kwCols) { problems.push('kw row ' + r + ' col count ' + a.length + ' != ' + kwCols); fail++; kwBad++; }
  const status = a[4];
  if (status === 'Enabled') adds++; else if (status === 'Paused') pauses++;
}
console.log('KEYWORDS CSV: cols=' + kwCols + ', ' + adds + ' Enabled(adds) + ' + pauses + ' Paused(pauses) = ' + (kw.length - 1) + ' rows');

// -------- Negatives --------
const neg = parseCSV(fs.readFileSync(path.join(OUT, 'negatives-import.csv'), 'utf8'));
const negCols = neg[0].length;
let negMini = 0;
for (let r = 1; r < neg.length; r++) {
  const a = neg[r];
  if (a.length !== negCols) { problems.push('neg row ' + r + ' col count'); fail++; }
  if (a[1] === MINI || a[1] === 'מיניבוסים') negMini++;
  if (!/^Campaign Negative /.test(a[2])) { problems.push('neg row ' + r + ' bad match type: ' + a[2]); fail++; }
}
console.log('NEGATIVES CSV: cols=' + negCols + ', ' + (neg.length - 1) + ' negatives (מיניבוס/מיניבוסים present: ' + negMini + ')');

console.log('\n' + (fail === 0 ? '✅ ALL CHECKS PASS' : '❌ ' + fail + ' FAILURES'));
if (problems.length) { console.log('\nPROBLEMS:'); problems.forEach(p => console.log('  - ' + p)); }
process.exit(fail === 0 ? 0 : 1);
