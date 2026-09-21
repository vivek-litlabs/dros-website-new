/**
 * Push the extracted blog posts into Airtable.
 *
 * Reads credentials from the workspace .env (never hard-coded, never logged).
 * Safe to re-run: fields are created only if absent, and records are matched on
 * Slug so a second run updates in place instead of duplicating the whole blog.
 *
 * Dry run by default - pass --apply to actually write.
 *
 *   node scripts/blog-to-airtable.mjs                # show the plan
 *   node scripts/blog-to-airtable.mjs --apply        # execute it
 */
import { readFileSync } from 'node:fs';

const ENV_PATH = process.env.BLOG_ENV_PATH ?? 'C:/Users/yoges/OneDrive/Desktop/drosai/.env';
const DATA = process.env.BLOG_DATA ?? 'artifacts/blogs.json';
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
const TOKEN = env.AIRTABLE_API_TOKEN;
const BASE = env.AIRTABLE_BASE_ID;
const TABLE = env.AIRTABLE_TABLE_NAME ?? 'Blogs';
for (const [k, v] of Object.entries({ AIRTABLE_API_TOKEN: TOKEN, AIRTABLE_BASE_ID: BASE })) {
  if (!v) { console.error(`Missing ${k} in ${ENV_PATH}`); process.exit(1); }
}

const api = async (path, init = {}) => {
  const res = await fetch(`https://api.airtable.com/v0/${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
  });
  const body = await res.text();
  if (!res.ok) throw new Error(`Airtable ${res.status} on ${path}: ${body.slice(0, 300)}`);
  return body ? JSON.parse(body) : {};
};

// Airtable rejects a long text value over 100k characters outright.
const AIRTABLE_LONG_TEXT_MAX = 100000;

/** Fields this export needs, beyond whatever the table already has. */
const REQUIRED_FIELDS = [
  { name: 'Slug', type: 'singleLineText' },
  { name: 'URL', type: 'url' },
  { name: 'Summary', type: 'multilineText' },
  { name: 'Content HTML', type: 'multilineText' },
  { name: 'Category', type: 'singleLineText' },
  { name: 'Tags', type: 'singleLineText' },
  { name: 'Read Time', type: 'singleLineText' },
  { name: 'Published', type: 'singleLineText' },
  { name: 'Hero Image', type: 'singleLineText' },
  { name: 'Word Count', type: 'number', options: { precision: 0 } },
  // The interactive blocks are stored as data, not frozen markup: their behaviour is
  // code (an accordion, a tracked CTA), only their copy is content.
  // The post's own <h1>. Distinct from Name, which is the listing-card title: they
  // differ on 9 of the 14 posts, so collapsing them would rewrite headlines.
  { name: 'Heading', type: 'singleLineText' },
  { name: 'Subtitle', type: 'multilineText' },
  // ISO date for the byline and Article schema. Distinct from the human "Published"
  // string: BlogLayout formats this one, and cannot parse "Aug 24, 2026".
  { name: 'Date Published', type: 'singleLineText' },
  { name: 'FAQ', type: 'multilineText' },
  { name: 'CTA', type: 'multilineText' },
];

const { posts } = JSON.parse(readFileSync(DATA, 'utf8'));
console.log(`loaded ${posts.length} posts from ${DATA}\n`);

// --- schema ------------------------------------------------------------------
const { tables } = await api(`meta/bases/${BASE}/tables`);
const table = tables.find((t) => t.name === TABLE);
if (!table) { console.error(`Table "${TABLE}" not found in base ${BASE}`); process.exit(1); }

const existing = new Set(table.fields.map((f) => f.name));
const missing = REQUIRED_FIELDS.filter((f) => !existing.has(f.name));

console.log(`table "${table.name}" has ${table.fields.length} fields; ${missing.length} to add`);
for (const f of missing) console.log(`   + ${f.name} (${f.type})`);
if (!missing.length) console.log('   (schema already complete)');

if (APPLY) {
  for (const f of missing) {
    await api(`meta/bases/${BASE}/tables/${table.id}/fields`, {
      method: 'POST',
      body: JSON.stringify(f),
    });
    console.log(`   created ${f.name}`);
  }
}

// --- existing records --------------------------------------------------------
const bySlug = new Map();
let offset;
do {
  const q = new URLSearchParams({ pageSize: '100' });
  if (offset) q.set('offset', offset);
  const page = await api(`${BASE}/${encodeURIComponent(TABLE)}?${q}`);
  for (const r of page.records) {
    const slug = r.fields.Slug;
    if (slug) bySlug.set(slug, r.id);
  }
  offset = page.offset;
} while (offset);
console.log(`\n${bySlug.size} existing record(s) carry a Slug`);

// --- build payloads ----------------------------------------------------------
const oversize = [];
const rows = posts.map((p) => {
  const html = p.html ?? '';
  if (html.length > AIRTABLE_LONG_TEXT_MAX) oversize.push({ slug: p.slug, len: html.length });
  return {
    slug: p.slug,
    fields: {
      Name: p.title,
      Slug: p.slug,
      URL: p.canonical ?? p.url,
      Summary: p.summary ?? '',
      'Content HTML': html,
      Category: p.category ?? '',
      Tags: Array.isArray(p.tags) ? p.tags.join(', ') : '',
      'Read Time': p.readTime ?? '',
      Published: p.date ?? '',
      'Hero Image': p.image ?? '',
      'Word Count': p.text ? p.text.trim().split(/\s+/).length : 0,
      Heading: p.h1 ?? p.title,
      Subtitle: p.subtitle ?? '',
      'Date Published': p.datePublished ?? '',
      FAQ: p.faq ? JSON.stringify(p.faq, null, 2) : '',
      CTA: p.cta ? JSON.stringify(p.cta, null, 2) : '',
    },
  };
});

if (oversize.length) {
  console.error('\nThese posts exceed the Airtable long-text limit and would be silently truncated:');
  for (const o of oversize) console.error(`   ${o.slug}: ${o.len} > ${AIRTABLE_LONG_TEXT_MAX}`);
  process.exit(1);
}

const creates = rows.filter((r) => !bySlug.has(r.slug));
const updates = rows.filter((r) => bySlug.has(r.slug));
console.log(`${creates.length} to create, ${updates.length} to update\n`);

if (!APPLY) {
  console.log('DRY RUN - nothing was written. Re-run with --apply to execute.');
  const sample = rows[0];
  console.log(`\nsample record (${sample.slug}):`);
  for (const [k, v] of Object.entries(sample.fields)) {
    const s = String(v).replace(/\s+/g, ' ');
    console.log(`   ${k.padEnd(14)} ${s.length > 90 ? s.slice(0, 90) + `... (${String(v).length} chars)` : s}`);
  }
  process.exit(0);
}

// --- write -------------------------------------------------------------------
const chunk = (arr, n) => arr.reduce((a, _, i) => (i % n ? a : [...a, arr.slice(i, i + n)]), []);

for (const batch of chunk(creates, 10)) {
  await api(`${BASE}/${encodeURIComponent(TABLE)}`, {
    method: 'POST',
    body: JSON.stringify({ records: batch.map((r) => ({ fields: r.fields })), typecast: true }),
  });
  console.log(`created ${batch.length}`);
}

for (const batch of chunk(updates, 10)) {
  await api(`${BASE}/${encodeURIComponent(TABLE)}`, {
    method: 'PATCH',
    body: JSON.stringify({
      records: batch.map((r) => ({ id: bySlug.get(r.slug), fields: r.fields })),
      typecast: true,
    }),
  });
  console.log(`updated ${batch.length}`);
}

console.log(`\ndone: ${creates.length} created, ${updates.length} updated`);
