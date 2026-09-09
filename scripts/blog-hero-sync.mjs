/**
 * Download Airtable hero attachments into public/ before the site is built.
 *
 * Airtable attachment URLs expire after a few hours. Rendering one straight into a
 * statically generated page would produce a page whose images work at deploy time and
 * are broken by the afternoon - the worst kind of failure, because nothing errors and
 * the build stays green.
 *
 * So the bytes are pulled down at build time and the site serves its own copy. Editors
 * still manage the image in Airtable; swapping it there changes the file the next build
 * writes. Runs automatically via the `prebuild` script.
 *
 * Writes public/blog/cms/<slug>.<ext> and a manifest the CMS layer reads.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';

const ENV_PATH = process.env.BLOG_ENV_PATH ?? join(process.cwd(), '..', '.env');
const OUT_DIR = join('public', 'blog', 'cms');
const MANIFEST = join('src', 'lib', 'blog-hero-manifest.json');
const FIELD = 'Hero';

function loadEnv(path) {
  const out = {};
  if (!existsSync(path)) return out;
  for (const raw of readFileSync(path, 'utf8').split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const i = line.indexOf('=');
    if (i !== -1) out[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return out;
}

const fileEnv = loadEnv(ENV_PATH);
const TOKEN = process.env.AIRTABLE_API_TOKEN ?? fileEnv.AIRTABLE_API_TOKEN;
const BASE = process.env.AIRTABLE_BASE_ID ?? fileEnv.AIRTABLE_BASE_ID;
const TABLE = process.env.AIRTABLE_TABLE_NAME ?? fileEnv.AIRTABLE_TABLE_NAME ?? 'Blogs';

if (!TOKEN || !BASE) {
  console.error('blog-hero-sync: AIRTABLE_API_TOKEN and AIRTABLE_BASE_ID are required.');
  process.exit(1);
}

const EXT_FOR = {
  'image/avif': '.avif',
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'image/svg+xml': '.svg',
};

const records = [];
let offset;
do {
  const q = new URLSearchParams({ pageSize: '100' });
  if (offset) q.set('offset', offset);
  const res = await fetch(`https://api.airtable.com/v0/${BASE}/${encodeURIComponent(TABLE)}?${q}`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  if (!res.ok) {
    console.error(`blog-hero-sync: Airtable ${res.status} - ${(await res.text()).slice(0, 200)}`);
    process.exit(1);
  }
  const page = await res.json();
  records.push(...page.records);
  offset = page.offset;
} while (offset);

mkdirSync(OUT_DIR, { recursive: true });

const manifest = {};
const written = new Set();
let downloaded = 0;

for (const r of records) {
  const slug = r.fields.Slug;
  const attachment = (r.fields[FIELD] ?? [])[0];
  if (!slug || !attachment?.url) continue;

  const ext = EXT_FOR[attachment.type] ?? '.jpg';
  const name = `${slug.split('/').filter(Boolean).join('-')}${ext}`;
  const dest = join(OUT_DIR, name);

  // Retry before giving up. A single transient blip reaching Airtable's attachment CDN
  // would otherwise fail the whole deploy - this step already killed one build with a
  // DNS ENOTFOUND. Three attempts with a short backoff covers the usual flake without
  // hiding a genuinely missing image.
  let bytes = null;
  let lastError = '';
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(attachment.url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      bytes = Buffer.from(await res.arrayBuffer());
      break;
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err);
      if (attempt < 3) {
        console.warn(`blog-hero-sync: ${slug} attempt ${attempt} failed (${lastError}); retrying`);
        await new Promise((r) => setTimeout(r, attempt * 1500));
      }
    }
  }
  if (!bytes) {
    console.error(`blog-hero-sync: could not download hero for ${slug} after 3 attempts - ${lastError}`);
    process.exit(1);
  }
  writeFileSync(dest, bytes);
  manifest[slug] = `/blog/cms/${name}`;
  written.add(name);
  downloaded++;
}

// Drop files for posts whose hero was removed, so the directory reflects Airtable
// rather than accumulating whatever was ever synced.
for (const existing of existsSync(OUT_DIR) ? readdirSync(OUT_DIR) : []) {
  if (!written.has(existing)) {
    unlinkSync(join(OUT_DIR, existing));
    console.log(`removed stale ${existing}`);
  }
}

mkdirSync(join('src', 'lib'), { recursive: true });
writeFileSync(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);

console.log(`blog-hero-sync: ${downloaded} hero image(s) into ${OUT_DIR}, manifest at ${MANIFEST}`);
