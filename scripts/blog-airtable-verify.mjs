/**
 * Read the records back out of Airtable and check them against the local export.
 * Airtable silently truncates over-long text, so comparing lengths (and a hash of
 * the HTML) is the only way to know the content actually arrived intact.
 */
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const ENV_PATH = process.env.BLOG_ENV_PATH ?? 'C:/Users/yoges/OneDrive/Desktop/drosai/.env';
const DATA = process.env.BLOG_DATA ?? 'artifacts/blogs.json';

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
const sha = (s) => createHash('sha256').update(s, 'utf8').digest('hex').slice(0, 12);

const remote = new Map();
let offset;
do {
  const q = new URLSearchParams({ pageSize: '100' });
  if (offset) q.set('offset', offset);
  const res = await fetch(
    `https://api.airtable.com/v0/${env.AIRTABLE_BASE_ID}/${encodeURIComponent(env.AIRTABLE_TABLE_NAME)}?${q}`,
    { headers: { Authorization: `Bearer ${env.AIRTABLE_API_TOKEN}` } }
  );
  if (!res.ok) { console.error(`${res.status}: ${(await res.text()).slice(0, 200)}`); process.exit(1); }
  const page = await res.json();
  for (const r of page.records) if (r.fields.Slug) remote.set(r.fields.Slug, r.fields);
  offset = page.offset;
} while (offset);

const { posts } = JSON.parse(readFileSync(DATA, 'utf8'));
let bad = 0;

for (const p of posts) {
  const r = remote.get(p.slug);
  if (!r) { console.error(`MISSING  ${p.slug}`); bad++; continue; }
  const localHtml = p.html ?? '';
  const remoteHtml = r['Content HTML'] ?? '';
  const problems = [];
  if (remoteHtml.length !== localHtml.length) {
    problems.push(`html ${remoteHtml.length} != local ${localHtml.length}`);
  } else if (sha(remoteHtml) !== sha(localHtml)) {
    problems.push('html same length but different bytes');
  }
  if ((r.Name ?? '') !== p.title) problems.push('title differs');
  if ((r.Summary ?? '') !== (p.summary ?? '')) problems.push('summary differs');

  if (problems.length) { console.error(`DIFF ${p.slug} - ${problems.join('; ')}`); bad++; }
  else console.log(`OK   ${p.slug.padEnd(62)} ${String(localHtml.length).padStart(6)} chars, sha ${sha(localHtml)}`);
}

console.log(
  bad === 0
    ? `\nAll ${posts.length} posts verified in Airtable: content byte-identical to the local export.`
    : `\n${bad} of ${posts.length} posts did NOT match.`
);
process.exit(bad === 0 ? 0 : 1);
