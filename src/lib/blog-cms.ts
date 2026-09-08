/**
 * Blog content from Airtable.
 *
 * Fetched at build time only: every blog route is statically prerendered, so a reader
 * never waits on Airtable and a token rotation cannot take the live site down. It does
 * mean a build needs AIRTABLE_* set - see DEPLOYMENT.md.
 *
 * The stored body is semantic HTML with no classes; styling lives in
 * src/styles/blog-content.css. The interactive pieces are stored as data, not markup,
 * and are rendered by the real React components:
 *   - FAQ  -> BlogFAQ  (accordion)
 *   - CTA  -> BlogCTA  (fires click analytics)
 *   - a `data-component` slot -> the matching client component
 */

export interface CmsFaqItem {
  q: string;
  a: string;
}

export interface CmsCta {
  heading: string;
  body: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}

export interface CmsPost {
  slug: string;
  /** Listing title, shown on the blogs index card. */
  title: string;
  /** The post's own <h1>, which differs from the listing title on 9 of 14 posts. */
  heading: string;
  subtitle: string;
  /** ISO date for the byline and Article schema, e.g. "2026-08-24". */
  datePublished: string;
  summary: string;
  html: string;
  category: string;
  tags: string[];
  readTime: string;
  published: string;
  heroImage: string;
  url: string;
  faq: CmsFaqItem[] | null;
  cta: CmsCta | null;
}

interface AirtableRecord {
  id: string;
  fields: Record<string, unknown>;
}

const str = (v: unknown): string => (typeof v === 'string' ? v : '');

/** Parse a JSON field, tolerating an empty cell. Bad JSON is a build error, not a silent null. */
function parseJsonField<T>(raw: string, field: string, slug: string): T | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  try {
    return JSON.parse(trimmed) as T;
  } catch (err) {
    throw new Error(
      `Blog CMS: ${slug} has invalid JSON in "${field}": ${err instanceof Error ? err.message : String(err)}`
    );
  }
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
    const res = await fetch(`https://api.airtable.com/v0/${base}/${encodeURIComponent(table)}?${q}`, {
      headers: { Authorization: `Bearer ${token}` },
      // no-store, NOT force-cache. Next's Data Cache persists in .next/cache between
      // builds, so force-cache silently served the previous build's records: an editor
      // could change a post in Airtable, rebuild, and still ship the old content. This
      // runs once per build, so refetching costs a second and buys correctness.
      cache: 'no-store',
    });
    if (!res.ok) {
      throw new Error(`Blog CMS: Airtable ${res.status} - ${(await res.text()).slice(0, 200)}`);
    }
    const page = (await res.json()) as { records: AirtableRecord[]; offset?: string };
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
        subtitle: str(r.fields.Subtitle),
        datePublished: str(r.fields['Date Published']),
        summary: str(r.fields.Summary),
        html: str(r.fields['Content HTML']),
        category: str(r.fields.Category),
        tags: str(r.fields.Tags)
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        readTime: str(r.fields['Read Time']),
        published: str(r.fields.Published),
        heroImage: str(r.fields['Hero Image']),
        url: str(r.fields.URL),
        faq: parseJsonField<CmsFaqItem[]>(str(r.fields.FAQ), 'FAQ', slug),
        cta: parseJsonField<CmsCta>(str(r.fields.CTA), 'CTA', slug),
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
