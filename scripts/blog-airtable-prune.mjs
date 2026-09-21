/**
 * Delete the placeholder rows Airtable creates with a new table.
 *
 * Deletion is irreversible through the API, so this only ever targets rows that are
 * empty by every measure: no Slug, no Name, and no other field carrying a value.
 * A row with any content is left alone and reported, never guessed at.
 *
 * Dry run by default - pass --apply to delete.
 */
import { readFileSync } from 'node:fs';

const ENV_PATH = process.env.BLOG_ENV_PATH ?? 'C:/Users/yoges/OneDrive/Desktop/drosai/.env';
const APPLY = process.argv.includes('--apply');

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
const auth = { Authorization: `Bearer ${env.AIRTABLE_API_TOKEN}` };

const api = async (path, init = {}) => {
  const res = await fetch(`https://api.airtable.com/v0/${path}`, {
    ...init,
    headers: { ...auth, 'Content-Type': 'application/json', ...(init.headers ?? {}) },
  });
  const body = await res.text();
  if (!res.ok) throw new Error(`Airtable ${res.status}: ${body.slice(0, 300)}`);
  return body ? JSON.parse(body) : {};
};

const records = [];
let offset;
do {
  const q = new URLSearchParams({ pageSize: '100' });
  if (offset) q.set('offset', offset);
  const page = await api(`${BASE}/${encodeURIComponent(TABLE)}?${q}`);
  records.push(...page.records);
  offset = page.offset;
} while (offset);

/** A computed field can report an error object on an empty row; that is not content. */
const hasRealValue = (v) => {
  if (v == null || v === '') return false;
  if (Array.isArray(v)) return v.length > 0;
  if (typeof v === 'object') return !('state' in v && v.state === 'error');
  return true;
};

const empty = [];
const kept = [];
for (const r of records) {
  const filled = Object.entries(r.fields ?? {}).filter(([, v]) => hasRealValue(v));
  if (filled.length === 0) empty.push(r);
  else kept.push({ id: r.id, name: r.fields.Name ?? '(no name)', fields: filled.length });
}

console.log(`${records.length} record(s) in "${TABLE}"`);
console.log(`  ${kept.length} with content - untouched`);
console.log(`  ${empty.length} completely empty - deletable\n`);

for (const r of empty) {
  console.log(`  DELETE ${r.id}  fields=${JSON.stringify(r.fields ?? {}).slice(0, 80)}`);
}

if (!empty.length) {
  console.log('Nothing to prune.');
  process.exit(0);
}

if (!APPLY) {
  console.log('\nDRY RUN - nothing deleted. Re-run with --apply.');
  process.exit(0);
}

// Guard: never let a bug here wipe real content.
if (empty.length > records.length - kept.length || kept.length === 0) {
  console.error('\nRefusing to delete: the empty set does not look right.');
  process.exit(1);
}

const q = new URLSearchParams();
for (const r of empty) q.append('records[]', r.id);
await api(`${BASE}/${encodeURIComponent(TABLE)}?${q}`, { method: 'DELETE' });
console.log(`\ndeleted ${empty.length} empty record(s); ${kept.length} content record(s) untouched`);
