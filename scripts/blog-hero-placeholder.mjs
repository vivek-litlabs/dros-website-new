/**
 * Give every post that has content but no Hero attachment a placeholder hero.
 *
 * The listing card renders the hero straight into an <img src>, so a post that publishes
 * without one shows a broken image on /blogs. The placeholder is neutral abstract art,
 * uploaded as a real attachment so an editor can swap it in Airtable like any other.
 * Posts that already have a hero are never touched.
 *
 *   node scripts/blog-hero-placeholder.mjs            # dry run
 *   node scripts/blog-hero-placeholder.mjs --apply
 */
import { readFileSync } from 'node:fs';

const ENV_PATH = process.env.BLOG_ENV_PATH ?? 'C:/Users/yoges/OneDrive/Desktop/drosai/.env';
const APPLY = process.argv.includes('--apply');
const PLACEHOLDER = 'public/blog/grid-perspective.avif';

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

const api = async (url, init = {}) => {
  const res = await fetch(url, { ...init, headers: { ...H, ...(init.headers ?? {}) } });
  const body = await res.text();
  if (!res.ok) throw new Error(`Airtable ${res.status}: ${body.slice(0, 300)}`);
  return body ? JSON.parse(body) : {};
};

const records = [];
let offset;
do {
  const q = new URLSearchParams({ pageSize: '100' });
  if (offset) q.set('offset', offset);
  const page = await api(`https://api.airtable.com/v0/${BASE}/${encodeURIComponent(TABLE)}?${q}`);
  records.push(...page.records);
  offset = page.offset;
} while (offset);

const targets = records.filter(
  (r) => (r.fields['Content HTML'] ?? '').trim() && !(r.fields.Hero ?? []).length
);
console.log(`${records.length} records, ${targets.length} with content but no hero`);

if (!APPLY) {
  console.log('DRY RUN - nothing uploaded. Re-run with --apply.');
} else {
  const file = readFileSync(PLACEHOLDER).toString('base64');
  let done = 0;
  for (const r of targets) {
    await api(`https://content.airtable.com/v0/${BASE}/${r.id}/Hero/uploadAttachment`, {
      method: 'POST',
      body: JSON.stringify({ contentType: 'image/avif', file, filename: 'grid-perspective.avif' }),
    });
    done++;
  }
  console.log(`attached placeholder hero to ${done} record(s)`);
}
