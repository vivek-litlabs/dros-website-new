/**
 * Prove a brand-new Airtable post actually reaches the site.
 *
 * Creates one obviously-marked test record, and prints its id. Build the site, check
 * the route/listing/sitemap, then run with --cleanup to delete it again. The record is
 * created by this script and deleted by it; no author's content is ever touched.
 *
 *   node scripts/blog-cms-smoketest.mjs            # create
 *   node scripts/blog-cms-smoketest.mjs --cleanup  # delete
 */
import { readFileSync } from 'node:fs';

const ENV_PATH = process.env.BLOG_ENV_PATH ?? 'C:/Users/yoges/OneDrive/Desktop/drosai/.env';
const CLEANUP = process.argv.includes('--cleanup');
const TEST_SLUG = '/blogs/cms-smoketest-delete-me';

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
  if (!res.ok) throw new Error(`Airtable ${res.status}: ${body.slice(0, 300)}`);
  return body ? JSON.parse(body) : {};
};

const existing = await api(`${BASE}/${encodeURIComponent(TABLE)}?pageSize=100`);
const found = existing.records.filter((r) => r.fields.Slug === TEST_SLUG);

if (CLEANUP) {
  if (!found.length) {
    console.log('no smoke-test record present; nothing to clean up');
    process.exit(0);
  }
  const q = new URLSearchParams();
  for (const r of found) q.append('records[]', r.id);
  await api(`${BASE}/${encodeURIComponent(TABLE)}?${q}`, { method: 'DELETE' });
  console.log(`deleted ${found.length} smoke-test record(s)`);
  process.exit(0);
}

if (found.length) {
  console.log(`smoke-test record already exists: ${found[0].id}`);
  process.exit(0);
}

const created = await api(`${BASE}/${encodeURIComponent(TABLE)}`, {
  method: 'POST',
  body: JSON.stringify({
    records: [
      {
        fields: {
          Name: 'CMS Smoke Test (delete me)',
          Heading: 'A Post Written In Airtable',
          Subtitle: 'Proving the CMS path end to end',
          Slug: TEST_SLUG,
          URL: `https://dros.ai${TEST_SLUG}`,
          Summary: 'A throwaway record used to verify that a new Airtable post builds, routes, lists and appears in the sitemap.',
          'Content HTML':
            '<p>This paragraph came from Airtable.</p>' +
            '<h2 id="a-heading">A heading from the CMS</h2>' +
            '<p>Body copy with <strong>bold text</strong> and a <a href="/pricing">link</a>.</p>' +
            '<ul><li>First item</li><li>Second item</li></ul>' +
            '<aside data-block="card"><p>A card block.</p></aside>',
          Category: 'Collections Strategy & Performance',
          Tags: 'Collections Strategy & Performance',
          'Read Time': '2 min read',
          Published: 'Sep 8, 2026',
          'Date Published': '2026-09-08',
          'Hero Image': '/blog/ai-readiness-checklist.avif',
          'Word Count': 40,
          FAQ: JSON.stringify([{ q: 'Does the accordion still work?', a: 'Yes - it renders through the real component.' }], null, 2),
          CTA: JSON.stringify(
            {
              heading: 'A CTA from the CMS',
              body: 'Rendered by BlogCTA, so its click tracking still fires.',
              primaryLabel: 'Book a demo',
              primaryHref: 'https://app.dros.ai',
              secondaryLabel: 'See pricing',
              secondaryHref: '/pricing',
            },
            null,
            2
          ),
        },
      },
    ],
    typecast: true,
  }),
});

console.log(`created smoke-test record ${created.records[0].id} at ${TEST_SLUG}`);
console.log('now: npx next build && npx next start, then check the route, /blogs and /sitemap.xml');
