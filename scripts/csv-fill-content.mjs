/**
 * Fill blog content from the tracker CSV into the EXISTING Airtable records.
 *
 * Not a re-import. The table has moved on since the first import: slugs were remapped
 * under /blogs/, a weekday publish schedule is running, unused columns were removed, and
 * editors may have set heroes. csv-to-airtable.mjs would reset all of that. This script
 * touches only what the CSV actually owns:
 *
 *   Content HTML  - verbatim from the CSV, byte for byte
 *   Summary       - first paragraph, derived from that content
 *   Read Time     - derived from that content
 *
 * Records are matched on title (Name), because slugs no longer match the CSV. A record
 * that already has content is left alone unless --overwrite is passed.
 *
 *   node scripts/csv-fill-content.mjs <file.csv>            # dry run
 *   node scripts/csv-fill-content.mjs <file.csv> --apply
 */
import { readFileSync } from 'node:fs';
import { parseCsv } from './csv-inspect.mjs';

const FILE = process.argv[2];
const APPLY = process.argv.includes('--apply');
const OVERWRITE = process.argv.includes('--overwrite');
const ENV_PATH = process.env.BLOG_ENV_PATH ?? 'C:/Users/yoges/OneDrive/Desktop/drosai/.env';

if (!FILE) { console.error('usage: node scripts/csv-fill-content.mjs <file.csv> [--apply] [--overwrite]'); process.exit(2); }

function loadEnv(path) {
  const out = {};
  for (const raw of readFileSync(path, 'utf8').split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const i = line.indexOf('=');
    if (i !== -1) out[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return out;
}

const env = loadEnv(ENV_PATH);
const BASE = env.AIRTABLE_BASE_ID;
const TABLE = env.AIRTABLE_TABLE_NAME ?? 'Blogs';
const H = { Authorization: `Bearer ${env.AIRTABLE_API_TOKEN}`, 'Content-Type': 'application/json' };
const TABLE_URL = `https://api.airtable.com/v0/${BASE}/${encodeURIComponent(TABLE)}`;

const api = async (url, init = {}) => {
  const res = await fetch(url, { ...init, headers: { ...H, ...(init.headers ?? {}) } });
  const body = await res.text();
  if (!res.ok) throw new Error(`Airtable ${res.status}: ${body.slice(0, 300)}`);
  return body ? JSON.parse(body) : {};
};

const stripTags = (html) => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

function summarise(html) {
  const m = html.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
  const text = stripTags(m ? m[1] : html);
  if (text.length <= 220) return text;
  const cut = text.slice(0, 220);
  return `${cut.slice(0, cut.lastIndexOf(' '))}...`;
}

const AIRTABLE_LONG_TEXT_MAX = 100000;

// --- load ------------------------------------------------------------------
const csv = parseCsv(readFileSync(FILE, 'utf8'));
const records = [];
let offset;
do {
  const q = new URLSearchParams({ pageSize: '100' });
  if (offset) q.set('offset', offset);
  const page = await api(`${TABLE_URL}?${q}`);
  records.push(...page.records);
  offset = page.offset;
} while (offset);

const byTitle = new Map();
for (const r of records) {
  const name = (r.fields.Name ?? '').trim();
  if (byTitle.has(name)) { console.error(`Duplicate title in Airtable, refusing to guess: "${name}"`); process.exit(1); }
  byTitle.set(name, r);
}

// --- plan ------------------------------------------------------------------
const updates = [];
const skipped = { noContent: 0, alreadyHas: 0 };
const problems = [];

for (const row of csv) {
  const html = row['HTML Blog Content'] ?? '';
  if (!html.trim()) { skipped.noContent++; continue; }
  const rec = byTitle.get(row.Title.trim());
  if (!rec) { problems.push(`no Airtable record titled "${row.Title}"`); continue; }
  if (html.length > AIRTABLE_LONG_TEXT_MAX) { problems.push(`"${row.Title}" is ${html.length} chars, over Airtable's limit`); continue; }

  const current = rec.fields['Content HTML'] ?? '';
  if (current.trim() && !OVERWRITE) { skipped.alreadyHas++; continue; }

  const words = stripTags(html).split(/\s+/).filter(Boolean).length;
  updates.push({
    id: rec.id,
    slug: rec.fields.Slug,
    date: rec.fields['Publish Date'],
    hasHero: (rec.fields.Hero ?? []).length > 0,
    fields: {
      'Content HTML': html,
      Summary: summarise(html),
      'Read Time': `${Math.max(1, Math.round(words / 200))} min read`,
    },
  });
}

const today = new Date().toISOString().slice(0, 10);
updates.sort((a, b) => (a.date ?? '').localeCompare(b.date ?? ''));

console.log(`${csv.length} CSV rows, ${records.length} Airtable records`);
console.log(`to fill: ${updates.length} | already has content: ${skipped.alreadyHas} | CSV row empty: ${skipped.noContent}`);
const goingLive = updates.filter((u) => u.date && u.date <= today);
console.log(`\nwill go live on the next revalidation (date <= ${today} UTC): ${goingLive.length}`);
for (const u of goingLive) console.log(`   ${u.date}  ${u.slug}`);
console.log(`still scheduled: ${updates.length - goingLive.length}, through ${updates.at(-1)?.date ?? '-'}`);
const noHero = updates.filter((u) => !u.hasHero);
console.log(`\nwithout a Hero attachment: ${noHero.length}`);
if (problems.length) {
  console.error('\nproblems:');
  for (const p of problems) console.error(`   ${p}`);
  process.exit(1);
}

if (!APPLY) {
  console.log('\nDRY RUN - nothing written. Re-run with --apply.');
} else {

// --- write -----------------------------------------------------------------
const chunk = (arr, n) => arr.reduce((a, _, i) => (i % n ? a : [...a, arr.slice(i, i + n)]), []);
for (const batch of chunk(updates, 10)) {
  await api(TABLE_URL, {
    method: 'PATCH',
    body: JSON.stringify({ records: batch.map((u) => ({ id: u.id, fields: u.fields })) }),
  });
  console.log(`updated ${batch.length}`);
}

// --- verify: read back and compare bytes ------------------------------------
const after = new Map();
offset = undefined;
do {
  const q = new URLSearchParams({ pageSize: '100' });
  if (offset) q.set('offset', offset);
  const page = await api(`${TABLE_URL}?${q}`);
  for (const r of page.records) after.set(r.id, r.fields['Content HTML'] ?? '');
  offset = page.offset;
} while (offset);

let mismatched = 0;
for (const u of updates) {
  if (after.get(u.id) !== u.fields['Content HTML']) {
    mismatched++;
    console.error(`MISMATCH ${u.slug}: stored ${after.get(u.id)?.length} chars, expected ${u.fields['Content HTML'].length}`);
  }
}
console.log(
  mismatched === 0
    ? `\nverified: all ${updates.length} bodies read back byte-identical to the CSV`
    : `\n${mismatched} bodies did not read back identically`
);
// exitCode, not exit(): exiting while fetch sockets are still closing trips a libuv
// assertion on Windows.
process.exitCode = mismatched === 0 ? 0 : 1;
}
