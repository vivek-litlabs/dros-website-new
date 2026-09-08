/**
 * Bring the Airtable table in line with what the site actually uses.
 *
 *  1. Move every row under /blogs/<slug>. The tracker's /alternatives/, /compare/,
 *     /integrations/ and /resources/ rows had no route and could never publish; under
 *     /blogs/ they are served by the blog route like everything else.
 *  2. Delete the rows for posts that render from hand-written React views. They were
 *     exported here during the migration, but the site never reads them, so leaving
 *     them is an invitation to edit a record and wonder why nothing changes.
 *  3. Report the fields nothing reads. Airtable's API has no delete-field endpoint -
 *     verified, it 404s - so those have to go from the UI, and the list is printed
 *     rather than guessed at later.
 *
 * Dry run by default; --apply to write. Deletions are irreversible, so the dry run
 * prints every record it would remove.
 */
import { readFileSync } from 'node:fs';
import { legacyBlogSlugs } from '../src/lib/blog-legacy-routes.ts';

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
const H = { Authorization: `Bearer ${env.AIRTABLE_API_TOKEN}`, 'Content-Type': 'application/json' };

const api = async (url, init = {}) => {
  const res = await fetch(url, { ...init, headers: { ...H, ...(init.headers ?? {}) } });
  const body = await res.text();
  if (!res.ok) throw new Error(`Airtable ${res.status}: ${body.slice(0, 300)}`);
  return body ? JSON.parse(body) : {};
};

/** Exactly the fields src/lib/blog-cms.ts reads, plus editor-facing ones worth keeping. */
const USED_BY_SITE = new Set([
  'Slug', 'Name', 'Heading', 'Subtitle', 'Summary', 'Content HTML',
  'Category', 'Tags', 'Read Time', 'Publish Date', 'Hero', 'FAQ', 'CTA',
]);
const KEPT_FOR_EDITORS = new Set([
  'Status',            // formula: Needs content / Scheduled / Published
  'Primary Keyword', 'Monthly Searches', 'Search Intent', 'Topic Cluster', // SEO planning
]);

// --- load ------------------------------------------------------------------
const records = [];
let offset;
do {
  const q = new URLSearchParams({ pageSize: '100' });
  if (offset) q.set('offset', offset);
  const page = await api(`https://api.airtable.com/v0/${BASE}/${encodeURIComponent(TABLE)}?${q}`);
  records.push(...page.records);
  offset = page.offset;
} while (offset);

const legacy = legacyBlogSlugs();

const toDelete = records.filter((r) => legacy.has(r.fields.Slug));
const toRemap = records
  .filter((r) => r.fields.Slug && !legacy.has(r.fields.Slug) && !r.fields.Slug.startsWith('/blogs/'))
  .map((r) => {
    const parts = r.fields.Slug.split('/').filter(Boolean);
    const section = parts[0];
    const leaf = parts[parts.length - 1];
    // Keep the section's meaning where the leaf alone would lose it: an
    // /alternatives/collectwise row is about alternatives TO CollectWise, and
    // /blogs/collectwise would read as a page about the product itself. The other
    // sections already carry their meaning in the leaf ("dros-vs-floatbot").
    const to = section === 'alternatives' ? `/blogs/${leaf}-alternatives` : `/blogs/${leaf}`;
    return { id: r.id, from: r.fields.Slug, to };
  });

// A remap must not collide with a slug that already exists.
const taken = new Set(records.map((r) => r.fields.Slug).filter(Boolean));
for (const m of toRemap) {
  if (taken.has(m.to)) m.collision = true;
}
const collisions = toRemap.filter((m) => m.collision);

console.log(`${records.length} records\n`);
console.log(`move under /blogs/: ${toRemap.length}`);
for (const m of toRemap) console.log(`   ${m.from.padEnd(50)} -> ${m.to}${m.collision ? '   COLLISION' : ''}`);
console.log(`\ndelete (rendered from React, never read from Airtable): ${toDelete.length}`);
for (const r of toDelete) console.log(`   ${r.id}  ${r.fields.Slug}`);

// --- field report ----------------------------------------------------------
const { tables } = await api(`https://api.airtable.com/v0/meta/bases/${BASE}/tables`);
const table = tables.find((t) => t.name === TABLE);
const unused = table.fields.filter((f) => !USED_BY_SITE.has(f.name) && !KEPT_FOR_EDITORS.has(f.name));

console.log(`\nfields: ${table.fields.length} total, ${unused.length} read by nothing`);
for (const f of unused) console.log(`   ${f.name.padEnd(20)} ${f.type}`);
console.log('   ^ Airtable has no delete-field API; remove these in the UI.');

if (collisions.length) {
  console.error(`\nRefusing to continue: ${collisions.length} slug collision(s) above.`);
  process.exit(1);
}

if (!APPLY) {
  console.log('\nDRY RUN - nothing written. Re-run with --apply.');
  process.exit(0);
}

// --- apply -----------------------------------------------------------------
const chunk = (arr, n) => arr.reduce((a, _, i) => (i % n ? a : [...a, arr.slice(i, i + n)]), []);

for (const batch of chunk(toRemap, 10)) {
  await api(`https://api.airtable.com/v0/${BASE}/${encodeURIComponent(TABLE)}`, {
    method: 'PATCH',
    body: JSON.stringify({
      records: batch.map((m) => ({ id: m.id, fields: { Slug: m.to } })),
    }),
  });
  console.log(`remapped ${batch.length}`);
}

for (const batch of chunk(toDelete, 10)) {
  const q = new URLSearchParams();
  for (const r of batch) q.append('records[]', r.id);
  await api(`https://api.airtable.com/v0/${BASE}/${encodeURIComponent(TABLE)}?${q}`, { method: 'DELETE' });
  console.log(`deleted ${batch.length}`);
}

console.log(`\ndone: ${toRemap.length} remapped, ${toDelete.length} deleted`);
