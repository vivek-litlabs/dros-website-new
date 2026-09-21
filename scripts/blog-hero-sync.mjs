/**
 * Download Airtable hero attachments into public/ before the site is built, and derive
 * the responsive variants the blog serves.
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
 * Filenames carry a content hash. Two reasons, both worth stating:
 *   - LinkedIn and Facebook cache Open Graph images by URL, effectively forever. A new
 *     hero at the same URL keeps showing the old thumbnail in every share preview.
 *   - A CDN or browser holding the previous bytes at a stable path shows a stale hero
 *     even after a successful redeploy.
 * A changed image therefore becomes a new URL, which forces both to re-fetch.
 *
 * Writes public/blog/cms/<slug>.<hash>.<ext> plus AVIF/WebP variants at several widths,
 * and a manifest the CMS layer reads.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, unlinkSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';

const ENV_PATH = process.env.BLOG_ENV_PATH ?? join(process.cwd(), '..', '.env');
const OUT_DIR = join('public', 'blog', 'cms');
const MANIFEST = join('src', 'lib', 'blog-hero-manifest.json');
const FIELD = 'Hero';
const ALT_FIELD = 'Hero Alt';

/**
 * Widths to emit. The hero renders at max 1200px CSS pixels, so 1200 covers a 1x
 * desktop and 696 a 1x phone; 2400 serves a 2x display. Any target wider than the
 * source is dropped rather than upscaled - upscaling costs bytes and adds no detail.
 */
const WIDTHS = [696, 1200, 2400];

/**
 * Near-lossless on purpose. This step must not visibly alter a single hero: the point
 * is fewer bytes at identical appearance, not a quality-for-size trade the editor never
 * agreed to.
 */
const AVIF_OPTS = { quality: 82, effort: 4 };
const WEBP_OPTS = { quality: 90, effort: 4 };

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

/**
 * sharp arrives as one of Next's optional dependencies rather than a direct one, so it
 * is present on every normal install but is not guaranteed by this package.json. If it
 * ever goes missing the build still has to produce working heroes, so the variants are
 * skipped and the original is served alone - slower, never broken.
 */
let sharp = null;
try {
  ({ default: sharp } = await import('sharp'));
} catch {
  console.warn('blog-hero-sync: sharp unavailable - writing original heroes only, no AVIF/WebP variants.');
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
  const stem = slug.split('/').filter(Boolean).join('-');

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

  // Hash the SOURCE bytes, not each derivative, so every variant of one hero shares a
  // hash and the whole set turns over together when the editor swaps the image.
  const hash = createHash('sha256').update(bytes).digest('hex').slice(0, 8);
  const name = `${stem}.${hash}${ext}`;
  writeFileSync(join(OUT_DIR, name), bytes);
  written.add(name);
  downloaded++;

  const entry = {
    src: `/blog/cms/${name}`,
    // Alt text is the editor's to write - it describes the image, which only they can
    // do. An empty string is a legitimate answer for a purely decorative hero, so an
    // absent column and a deliberately blank cell are treated the same and the
    // consumer decides what to fall back to.
    alt: typeof r.fields[ALT_FIELD] === 'string' ? r.fields[ALT_FIELD].trim() : '',
  };

  if (sharp) {
    try {
      const meta = await sharp(bytes).metadata();
      if (meta.width && meta.height) {
        entry.width = meta.width;
        entry.height = meta.height;
      }

      const targets = WIDTHS.filter((w) => w <= (meta.width ?? 0));
      // A source narrower than the smallest target still deserves its own variants.
      if (targets.length === 0 && meta.width) targets.push(meta.width);

      for (const [format, opts] of [['avif', AVIF_OPTS], ['webp', WEBP_OPTS]]) {
        const set = [];
        for (const w of targets) {
          const variant = `${stem}.${hash}.${w}.${format}`;
          const out = await sharp(bytes)
            .resize({ width: w, withoutEnlargement: true })
            [format](opts)
            .toBuffer();
          writeFileSync(join(OUT_DIR, variant), out);
          written.add(variant);
          set.push(`/blog/cms/${variant} ${w}w`);
        }
        if (set.length) entry[format] = set.join(', ');
      }
    } catch (err) {
      // A hero that cannot be transcoded is still a usable hero. Warn and ship the
      // original rather than failing a deploy over an optimisation.
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`blog-hero-sync: ${slug} variant generation failed (${msg}); serving original only.`);
    }
  }

  manifest[slug] = entry;
}

// Drop files for posts whose hero was removed or changed, so the directory reflects
// Airtable rather than accumulating every image ever synced. With hashed names this
// also sweeps away the previous version of a swapped hero.
for (const existing of existsSync(OUT_DIR) ? readdirSync(OUT_DIR) : []) {
  if (!written.has(existing)) {
    unlinkSync(join(OUT_DIR, existing));
    console.log(`removed stale ${existing}`);
  }
}

mkdirSync(join('src', 'lib'), { recursive: true });
writeFileSync(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);

console.log(
  `blog-hero-sync: ${downloaded} hero image(s), ${written.size} file(s) into ${OUT_DIR}, manifest at ${MANIFEST}`
);
