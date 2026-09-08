/**
 * Import the GEO blog tracker CSV into Airtable, on a weekday publishing schedule.
 *
 * The HTML in the CSV is written to "Content HTML" byte for byte. Nothing is stripped,
 * rewritten or reformatted - the rows in that column are the author's content and this
 * script does not touch them. Where the stored markup does not match how the site
 * renders a post (the CSV wraps each body in <article> and repeats the title as an
 * <h1>, both of which BlogLayout already provides), that is handled at RENDER time in
 * src/views/CmsBlogPost.tsx, not by editing the content.
 *
 * Slugs are tightened - trimmed, lower-cased, punctuation collapsed - but their section
 * is preserved: /alternatives/, /compare/, /integrations/ and /resources/ entries are
 * not blog posts and are NOT forced under /blogs/.
 *
 * Scheduling: rows are dated one per weekday in ID order, starting today. A post goes
 * live when its Publish Date arrives AND it has content.
 *
 *   node scripts/csv-to-airtable.mjs <file.csv>            # dry run
 *   node scripts/csv-to-airtable.mjs <file.csv> --apply
 */
import { readFileSync } from 'node:fs';
import { parseCsv } from './csv-inspect.mjs';

const FILE = process.argv[2];
const APPLY = process.argv.includes('--apply');
// Airtable's TODAY() is UTC. If the machine's local date has already rolled over, a
// schedule starting from local "today" dates the first post in Airtable's future and
// nothing goes live. --start pins the first weekday explicitly.
const START = (process.argv.find((a) => a.startsWith('--start=')) ?? '').split('=')[1];
const ENV_PATH = process.env.BLOG_ENV_PATH ?? 'C:/Users/yoges/OneDrive/Desktop/drosai/.env';

if (!FILE) { console.error('usage: node scripts/csv-to-airtable.mjs <file.csv> [--apply]'); process.exit(2); }

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

const api = async (path, init = {}) => {
  const res = await fetch(`https://api.airtable.com/v0/${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${env.AIRTABLE_API_TOKEN}`,
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
  });
  const body = await res.text();
  if (!res.ok) throw new Error(`Airtable ${res.status} on ${path}: ${body.slice(0, 300)}`);
  return body ? JSON.parse(body) : {};
};

/**
 * Tighten a slug without changing which section it belongs to.
 * "/Blogs/My  Post/" -> "/blogs/my-post"
 */
export function tightenSlug(raw) {
  const cleaned = (raw ?? '')
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, '-')      // spaces and underscores become hyphens
    .replace(/[^a-z0-9/-]+/g, '') // drop anything not url-safe
    .replace(/\/+/g, '/')          // collapse duplicate slashes
    .replace(/-+/g, '-')           // collapse duplicate hyphens
    .replace(/\/-|-\//g, '/')      // no hyphen hugging a slash
    .replace(/\/$/, '');           // no trailing slash
  return cleaned.startsWith('/') ? cleaned : `/${cleaned}`;
}

const stripTags = (html) => (html ?? '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

/** First paragraph, trimmed to something a listing card can show. */
function summarise(html) {
  const m = (html ?? '').match(/<p[^>]*>([\s\S]*?)<\/p>/i);
  const text = stripTags(m ? m[1] : html);
  if (text.length <= 220) return text;
  const cut = text.slice(0, 220);
  return `${cut.slice(0, cut.lastIndexOf(' '))}...`;
}

/** One post per weekday, in ID order, starting today. */
function weekdaySchedule(count, from = new Date()) {
  const dates = [];
  const cur = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  while (dates.length < count) {
    const day = cur.getDay();
    if (day !== 0 && day !== 6) {
      dates.push(
        `${cur.getFullYear()}-${String(cur.getMonth() + 1).padStart(2, '0')}-${String(cur.getDate()).padStart(2, '0')}`
      );
    }
    cur.setDate(cur.getDate() + 1);
  }
  return dates;
}

const HUMAN_DATE = (iso) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

// Neutral abstract art. These rows ship no imagery, and the listing card renders
// post.image straight into an <img src>, so an empty value would be a broken image.
const PLACEHOLDER_HERO = '/blog/grid-perspective.avif';

const FIELDS = [
  { name: 'Primary Keyword', type: 'singleLineText' },
  { name: 'Monthly Searches', type: 'number', options: { precision: 0 } },
  { name: 'Search Intent', type: 'singleLineText' },
  { name: 'Topic Cluster', type: 'singleLineText' },
  { name: 'Publish Date', type: 'date', options: { dateFormat: { name: 'iso' } } },
  {
    name: 'Slug (auto)',
    type: 'formula',
    options: {
      formula:
        // The final segment only. Prefixing "/blogs/" would be wrong for the
        // /alternatives/, /compare/, /integrations/ and /resources/ rows, whose section
        // is a deliberate editorial choice the curated Slug column records.
        `REGEX_REPLACE(REGEX_REPLACE(LOWER({Name}), "[^a-z0-9]+", "-"), "(^-+|-+$)", "")`,
    },
  },
  {
    name: 'Status',
    type: 'formula',
    options: {
      // Content first: a dated row with nothing written is not "published", it is
      // waiting on a writer, and saying so is the difference between a schedule and a
      // queue of empty pages.
      formula:
        `IF(LEN({Content HTML} & "") = 0, "Needs content", IF(IS_AFTER({Publish Date}, TODAY()), "Scheduled", "Published"))`,
    },
  },
];

// ---------------------------------------------------------------------------

const records = parseCsv(readFileSync(FILE, 'utf8'));
const schedule = weekdaySchedule(
  records.length,
  START ? new Date(`${START}T12:00:00Z`) : new Date()
);

const rows = records.map((r, i) => {
  const html = r['HTML Blog Content'] ?? ''; // verbatim, never edited
  const slug = tightenSlug(r['Suggested Slug']);
  const words = stripTags(html).split(/\s+/).filter(Boolean).length;
  const iso = schedule[i];

  return {
    id: r.ID,
    slug,
    rawSlug: r['Suggested Slug'],
    hasContent: html.trim().length > 0,
    isBlogRoute: slug.startsWith('/blogs/'),
    fields: {
      Name: r.Title,
      Heading: r.Title,
      Slug: slug,
      URL: `https://dros.ai${slug}`,
      Summary: html ? summarise(html) : '',
      'Content HTML': html,
      Category: 'Collections Strategy & Performance',
      Tags: r['Topic Cluster'] ?? '',
      'Read Time': words ? `${Math.max(1, Math.round(words / 200))} min read` : '',
      Published: HUMAN_DATE(iso),
      'Date Published': iso,
      'Publish Date': iso,
      'Hero Image': html ? PLACEHOLDER_HERO : '',
      'Word Count': words,
      'Primary Keyword': r['Primary Keyword'] ?? '',
      'Monthly Searches': Number(r['US Monthly Searches']) || 0,
      'Search Intent': r['Search Intent'] ?? '',
      'Topic Cluster': r['Topic Cluster'] ?? '',
    },
  };
});

const withContent = rows.filter((r) => r.hasContent);
const nonBlog = rows.filter((r) => !r.isBlogRoute);
const retightened = rows.filter((r) => r.slug !== r.rawSlug);

console.log(`parsed ${rows.length} rows from ${FILE}`);
console.log(`  with content : ${withContent.length}`);
console.log(`  empty        : ${rows.length - withContent.length}  (dated, but Status will read "Needs content")`);
console.log(`  not /blogs/  : ${nonBlog.length}  (${[...new Set(nonBlog.map((r) => r.slug.split('/')[1]))].join(', ')})`);
console.log(`  slugs changed: ${retightened.length}`);
for (const r of retightened.slice(0, 10)) console.log(`     ${r.rawSlug}  ->  ${r.slug}`);
console.log(`\nschedule: ${schedule[0]} (today) .. ${schedule[schedule.length - 1]}, weekdays only`);
console.log('publishable immediately:');
for (const r of withContent) console.log(`   ${r.fields['Publish Date']}  ${r.slug}`);

if (!APPLY) {
  console.log('\nDRY RUN - nothing written. Re-run with --apply.');
  process.exit(0);
}

// --- schema ---------------------------------------------------------------
const { tables } = await api(`meta/bases/${BASE}/tables`);
const table = tables.find((t) => t.name === TABLE);
if (!table) { console.error(`Table "${TABLE}" not found`); process.exit(1); }

// A probe field was left behind while testing whether formula fields can be created
// through the API. Airtable has no delete-field endpoint, so repurpose it instead of
// leaving litter in the base.
let probeField = table.fields.find((f) => f.name === '__formula_probe');
const byName = new Set(table.fields.map((f) => f.name));

for (const f of FIELDS) {
  if (byName.has(f.name)) continue;
  if (probeField && f.type === 'formula' && !byName.has(f.name)) {
    await api(`meta/bases/${BASE}/tables/${table.id}/fields/${probeField.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ name: f.name, options: f.options }),
    });
    console.log(`repurposed __formula_probe -> ${f.name}`);
    byName.add(f.name);
    // One probe, one repurposing. Without this the next formula field renames the same
    // field again instead of creating its own, and the first one silently disappears.
    probeField = null;
    continue;
  }
  await api(`meta/bases/${BASE}/tables/${table.id}/fields`, { method: 'POST', body: JSON.stringify(f) });
  console.log(`created field ${f.name} (${f.type})`);
  byName.add(f.name);
}

// --- upsert ---------------------------------------------------------------
const bySlug = new Map();
let offset;
do {
  const q = new URLSearchParams({ pageSize: '100' });
  if (offset) q.set('offset', offset);
  const page = await api(`${BASE}/${encodeURIComponent(TABLE)}?${q}`);
  for (const rec of page.records) if (rec.fields.Slug) bySlug.set(rec.fields.Slug, rec.id);
  offset = page.offset;
} while (offset);

const creates = rows.filter((r) => !bySlug.has(r.slug));
const updates = rows.filter((r) => bySlug.has(r.slug));
console.log(`\n${creates.length} to create, ${updates.length} to update`);

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
    body: JSON.stringify({ records: batch.map((r) => ({ id: bySlug.get(r.slug), fields: r.fields })), typecast: true }),
  });
  console.log(`updated ${batch.length}`);
}

console.log(`\ndone: ${creates.length} created, ${updates.length} updated`);
