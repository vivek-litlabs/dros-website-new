/**
 * Put each post's hero image into Airtable as a real attachment.
 *
 * Until now the hero was a path string, which meant changing a post's image required a
 * developer to add a file to public/ and edit the record. As an attachment the image
 * lives in Airtable and an editor can swap it there, which is the point.
 *
 * Uploads the actual bytes through Airtable's uploadAttachment endpoint rather than
 * pointing Airtable at a URL: the site is not deployed yet, so there is no public URL to
 * point at, and uploading is not dependent on one existing later.
 *
 * NOTE: Airtable attachment URLs expire after a few hours. They are therefore NEVER
 * baked into the built pages - scripts/blog-hero-sync.mjs downloads them into public/ at
 * build time and the site serves its own copy. See DEPLOYMENT.md.
 *
 *   node scripts/blog-hero-attach.mjs            # dry run
 *   node scripts/blog-hero-attach.mjs --apply
 */
import { readFileSync, existsSync } from 'node:fs';
import { extname, join } from 'node:path';

const ENV_PATH = process.env.BLOG_ENV_PATH ?? 'C:/Users/yoges/OneDrive/Desktop/drosai/.env';
const APPLY = process.argv.includes('--apply');
const FIELD = 'Hero';

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
const AUTH = { Authorization: `Bearer ${env.AIRTABLE_API_TOKEN}` };

const api = async (url, init = {}) => {
  const res = await fetch(url, {
    ...init,
    headers: { ...AUTH, 'Content-Type': 'application/json', ...(init.headers ?? {}) },
  });
  const body = await res.text();
  if (!res.ok) throw new Error(`Airtable ${res.status}: ${body.slice(0, 300)}`);
  return body ? JSON.parse(body) : {};
};

const MIME = {
  '.avif': 'image/avif',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.gif': 'image/gif',
};

// --- ensure the attachment field exists -------------------------------------
const { tables } = await api(`https://api.airtable.com/v0/meta/bases/${BASE}/tables`);
const table = tables.find((t) => t.name === TABLE);
if (!table) { console.error(`Table "${TABLE}" not found`); process.exit(1); }

const hasField = table.fields.some((f) => f.name === FIELD);
console.log(hasField ? `field "${FIELD}" exists` : `field "${FIELD}" will be created (multipleAttachments)`);

if (!hasField && APPLY) {
  await api(`https://api.airtable.com/v0/meta/bases/${BASE}/tables/${table.id}/fields`, {
    method: 'POST',
    body: JSON.stringify({ name: FIELD, type: 'multipleAttachments' }),
  });
  console.log(`created field ${FIELD}`);
}

// --- collect the work -------------------------------------------------------
const records = [];
let offset;
do {
  const q = new URLSearchParams({ pageSize: '100' });
  if (offset) q.set('offset', offset);
  const page = await api(`https://api.airtable.com/v0/${BASE}/${encodeURIComponent(TABLE)}?${q}`);
  records.push(...page.records);
  offset = page.offset;
} while (offset);

const jobs = [];
const problems = [];
for (const r of records) {
  const path = r.fields['Hero Image'];
  if (!path) continue;
  if ((r.fields[FIELD] ?? []).length) continue; // already attached; do not re-upload
  const file = join('public', path.replace(/^\//, ''));
  if (!existsSync(file)) { problems.push(`${r.fields.Slug}: missing file ${file}`); continue; }
  const ext = extname(file).toLowerCase();
  if (!MIME[ext]) { problems.push(`${r.fields.Slug}: unsupported type ${ext}`); continue; }
  jobs.push({ id: r.id, slug: r.fields.Slug, file, ext });
}

console.log(`\n${records.length} records, ${jobs.length} hero image(s) to upload`);
for (const j of jobs) console.log(`   ${j.slug.padEnd(60)} <- ${j.file}`);
if (problems.length) {
  console.warn('\nskipped:');
  for (const p of problems) console.warn(`   ${p}`);
}

if (!APPLY) {
  console.log('\nDRY RUN - nothing uploaded. Re-run with --apply.');
  process.exit(0);
}

// --- upload -----------------------------------------------------------------
let done = 0;
for (const j of jobs) {
  const bytes = readFileSync(j.file);
  // 5MB is Airtable's per-file ceiling for this endpoint.
  if (bytes.length > 5 * 1024 * 1024) {
    console.error(`SKIP ${j.slug} - ${bytes.length} bytes exceeds the 5MB upload limit`);
    continue;
  }
  await api(
    `https://content.airtable.com/v0/${BASE}/${j.id}/${encodeURIComponent(FIELD)}/uploadAttachment`,
    {
      method: 'POST',
      body: JSON.stringify({
        contentType: MIME[j.ext],
        file: bytes.toString('base64'),
        filename: j.file.split(/[\\/]/).pop(),
      }),
    }
  );
  done++;
  console.log(`uploaded ${j.slug}`);
}

console.log(`\ndone: ${done} attachment(s) uploaded`);
