/**
 * Blog content from Airtable.
 *
 * Fetched at build time only: every blog route is statically prerendered, so a reader
 * never waits on Airtable and a token rotation cannot take the live site down. It does
 * mean a build needs AIRTABLE_* set - see DEPLOYMENT.md.
 *
 * The stored body is semantic HTML with no classes; styling lives in
 * src/styles/blog-content.css.
 *
 * CMS posts carry no FAQ, CTA or subtitle. Those were dropped from this path on
 * request: none of the 63 tracker rows used them, and an empty column per post is
 * worse than no column. BlogLayout still supports all three - the hand-written posts
 * pass them directly - so restoring the capability here is a small change if a future
 * post needs it, and would mean re-adding the Airtable columns too. The interactive pieces are stored as data, not markup,
 * and are rendered by the real React components:
 *   - FAQ  -> BlogFAQ  (accordion)
 *   - CTA  -> BlogCTA  (fires click analytics)
 *   - a `data-component` slot -> the matching client component
 */

import { request } from 'node:https';
import { legacyBlogSlugs } from './blog-legacy-routes';
// Written by scripts/blog-hero-sync.mjs during prebuild: slug -> local copy of the
// Airtable hero attachment. Attachment URLs expire within hours, so the built pages
// must never point at them directly.
import heroManifest from './blog-hero-manifest.json';

export interface CmsPost {
  slug: string;
  /** Listing title, shown on the blogs index card. */
  title: string;
  /** The post's own <h1>, which differs from the listing title on 9 of 14 posts. */
  heading: string;
  /**
   * Go-live date, ISO. One field does both jobs: it gates publishing and supplies the
   * byline and Article schema date. Keeping a second human-readable copy in Airtable
   * only created a way for the two to disagree.
   */
  publishDate: string;
  summary: string;
  html: string;
  category: string;
  tags: string[];
  readTime: string;
  heroImage: string;
}

interface AirtableRecord {
  id: string;
  fields: Record<string, unknown>;
}

const str = (v: unknown): string => (typeof v === 'string' ? v : '');


/**
 * Plain HTTPS request rather than fetch(), deliberately.
 *
 * Next patches global fetch with its Data Cache, and that cache persists in .next/cache
 * between builds - Vercel restores it too. With `force-cache` an editor could change a
 * post, rebuild, and still ship the previous content. The obvious fix, `no-store`, opts
 * the calling route into dynamic rendering, which turned /blogs from a static page into
 * a server-rendered one.
 *
 * A request Next does not intercept sidesteps both: fresh data every build, and every
 * page stays statically prerendered.
 */
function airtableGet(path: string, token: string): Promise<{ records: AirtableRecord[]; offset?: string }> {
  return new Promise((resolve, reject) => {
    const req = request(
      { hostname: 'api.airtable.com', path, method: 'GET', headers: { Authorization: `Bearer ${token}` } },
      (res) => {
        const chunks: Buffer[] = [];
        res.on('data', (c: Buffer) => chunks.push(c));
        res.on('end', () => {
          const body = Buffer.concat(chunks).toString('utf8');
          if ((res.statusCode ?? 0) >= 400) {
            reject(new Error(`Blog CMS: Airtable ${res.statusCode} - ${body.slice(0, 200)}`));
            return;
          }
          try {
            resolve(JSON.parse(body));
          } catch (err) {
            reject(new Error(`Blog CMS: unparseable Airtable response - ${err instanceof Error ? err.message : String(err)}`));
          }
        });
      }
    );
    req.on('error', reject);
    req.end();
  });
}

let cache: Promise<CmsPost[]> | null = null;

async function fetchAll(): Promise<CmsPost[]> {
  const token = process.env.AIRTABLE_API_TOKEN;
  const base = process.env.AIRTABLE_BASE_ID;
  const table = process.env.AIRTABLE_TABLE_NAME ?? 'Blogs';

  if (!token || !base) {
    throw new Error(
      'Blog CMS: AIRTABLE_API_TOKEN and AIRTABLE_BASE_ID must be set to build blog pages. ' +
        'Locally they come from the workspace .env; on Vercel set them in project settings.'
    );
  }

  const records: AirtableRecord[] = [];
  let offset: string | undefined;
  do {
    const q = new URLSearchParams({ pageSize: '100' });
    if (offset) q.set('offset', offset);
    const page = await airtableGet(
      `/v0/${base}/${encodeURIComponent(table)}?${q}`,
      token
    );
    records.push(...page.records);
    offset = page.offset;
  } while (offset);

  const posts = records
    .filter((r) => str(r.fields.Slug))
    .map((r): CmsPost => {
      const slug = str(r.fields.Slug);
      return {
        slug,
        title: str(r.fields.Name),
        heading: str(r.fields.Heading) || str(r.fields.Name),
        publishDate: str(r.fields['Publish Date']),
        summary: str(r.fields.Summary),
        html: str(r.fields['Content HTML']),
        category: str(r.fields.Category),
        tags: str(r.fields.Tags)
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        readTime: str(r.fields['Read Time']),
        // The Airtable attachment, synced to a local copy at build time, is the only
        // source. The old path column is no longer read.
        heroImage: (heroManifest as Record<string, string>)[slug] ?? '',
      };
    });

  if (posts.length === 0) {
    throw new Error('Blog CMS: Airtable returned no posts with a Slug - refusing to build an empty blog.');
  }

  return posts;
}

/** All posts, fetched once per build. */
export function getAllPosts(): Promise<CmsPost[]> {
  cache ??= fetchAll();
  return cache;
}

export async function getPostBySlug(slug: string): Promise<CmsPost | undefined> {
  return (await getAllPosts()).find((p) => p.slug === slug);
}

/**
 * Posts the CMS actually renders: everything in Airtable that is NOT already a
 * hand-written React route.
 *
 * The 14 migrated posts are in Airtable too - they were exported there - but they keep
 * rendering from their React views, which are pixel-locked to the baseline. Filtering
 * them out here keeps one post from appearing twice in the listing and stops the build
 * generating a page that Next's routing would never serve anyway.
 */
export async function getCmsOnlyPosts(): Promise<CmsPost[]> {
  const legacy = legacyBlogSlugs();
  const today = todayIso();

  return (await getAllPosts()).filter((p) => {
    // Already served by a hand-written React view.
    if (legacy.has(p.slug)) return false;

    // The blog route only serves /blogs/. The tracker also holds /alternatives/,
    // /compare/, /integrations/ and /resources/ entries, which are different page
    // types and need their own routes rather than being smuggled in as blog posts.
    if (!p.slug.startsWith('/blogs/')) return false;

    // A dated row with nothing written is a plan, not a post.
    if (!p.html.trim()) return false;

    // Scheduled for a future day. Note this is evaluated at BUILD time: the site is
    // statically generated, so a post going live on its date requires a build that
    // day - see DEPLOYMENT.md for the daily deploy hook.
    if (p.publishDate && p.publishDate > today) return false;

    return true;
  });
}

/**
 * Today in UTC, as YYYY-MM-DD.
 *
 * UTC specifically, because Airtable's TODAY() - which drives the Status column editors
 * read - is UTC. Using the build machine's local date instead made the site publish a
 * post while Airtable still showed it as "Scheduled": the machine's clock was a day
 * ahead of UTC. One clock, one answer.
 */
function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}
