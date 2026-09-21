import { readFileSync } from 'node:fs';
import { ROUTES } from './config';

const GENERIC_ROOT_TITLE = 'AI Agents for Collections | DROS AI';

/**
 * Minimum characters of real body text required in the raw HTML response.
 *
 * The point of this gate is that an AI crawler which does not execute JavaScript must
 * receive substantive content. 500 is a deliberately blunt floor for a content page.
 */
const DEFAULT_MIN_BODY_TEXT = 500;

/**
 * Per-route overrides, for pages whose content genuinely IS short.
 *
 * An override is only ever justified when the page has no more static text to give — never
 * to make a failing route pass. Each entry records the real reason, and the alternative
 * (adding copy that is not in the design) would break pixel parity and change the site.
 */
const MIN_BODY_TEXT: Record<string, number> = {
  // A heading plus a HubSpot form iframe, and nothing else — identical in the Vite source.
  // Measured at ~144 chars. The floor is set just under that so the route still fails if
  // the heading itself disappears, which is the only regression this route can express.
  '/book-meeting': 120,
};

/** Strip <script>/<style> blocks (non-greedy, case-insensitive), then all remaining tags. */
export function extractBodyText(html: string): string {
  const noScripts = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ');
  const noStyles = noScripts.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ');
  const noTags = noStyles.replace(/<[^>]*>/g, ' ');
  return noTags.replace(/\s+/g, ' ').trim();
}

function extractTitle(html: string): string | null {
  const m = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(html);
  return m ? m[1].replace(/\s+/g, ' ').trim() : null;
}

function extractDescription(html: string): string | null {
  const m = /<meta\s+[^>]*name=["']description["'][^>]*>/i.exec(html);
  if (!m) return null;
  const contentMatch = /content=["']([\s\S]*?)["']/i.exec(m[0]);
  return contentMatch ? contentMatch[1].trim() : null;
}

function countCanonical(html: string): number {
  const matches = html.match(/<link\s+[^>]*rel=["']canonical["'][^>]*>/gi);
  return matches ? matches.length : 0;
}

function extractJsonLdTypes(html: string): string[] {
  const types: string[] = [];
  const blocks = html.match(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi) || [];
  for (const block of blocks) {
    const inner = /<script\b[^>]*>([\s\S]*?)<\/script>/i.exec(block);
    if (!inner) continue;
    try {
      const parsed = JSON.parse(inner[1].trim());
      const nodes = Array.isArray(parsed) ? parsed : parsed['@graph'] ? parsed['@graph'] : [parsed];
      for (const node of nodes) {
        const t = node && node['@type'];
        if (Array.isArray(t)) types.push(...t);
        else if (typeof t === 'string') types.push(t);
      }
    } catch {
      // Malformed JSON-LD is not this check's concern beyond type presence; ignore parse errors.
    }
  }
  return types;
}

function isBlogRoute(route: string): boolean {
  return route.includes('/blog') && route !== '/blogs';
}

/** Runs all assertions against raw HTML for one route. Returns a list of problems (empty = pass). */
/** '/' -> 'home'; '/collections/first-party' -> 'collections__first-party'. Mirrors slugFor. */
function slugOf(route: string): string {
  return route === '/' ? 'home' : route.replace(/^\//, '').replace(/\//g, '__');
}

/**
 * The pre-migration title for a route, read from the committed baseline metadata.
 * Used to tell a real regression apart from a pre-existing gap.
 */
function baselineTitleFor(route: string): string | undefined {
  try {
    const raw = readFileSync(`parity/baseline/${slugOf(route)}.meta.json`, 'utf8');
    return (JSON.parse(raw) as { title?: string }).title;
  } catch {
    return undefined;
  }
}

export function checkRouteHtml(route: string, html: string, baselineTitle?: string): string[] {
  const problems: string[] = [];

  const title = extractTitle(html);
  if (!title) {
    problems.push('missing or empty <title>');
  } else if (route !== '/' && title === GENERIC_ROOT_TITLE && baselineTitle !== GENERIC_ROOT_TITLE) {
    // Only a REGRESSION if the pre-migration build had a real title here. Some routes
    // (e.g. /aca) never set one and inherit the site-wide default in both builds — that is
    // a pre-existing content gap, not something this migration broke, and "fixing" it would
    // be an unrequested content change. Comparing against the baseline distinguishes the two.
    problems.push(
      `title is the generic root fallback ("${GENERIC_ROOT_TITLE}") but the baseline had ` +
        `"${baselineTitle}" — page metadata did not render`
    );
  }

  const description = extractDescription(html);
  if (!description) {
    problems.push('missing or empty <meta name="description">');
  }

  const canonicalCount = countCanonical(html);
  if (canonicalCount !== 1) {
    problems.push(`expected exactly 1 <link rel="canonical">, found ${canonicalCount}`);
  }

  const bodyText = extractBodyText(html);
  const minBody = MIN_BODY_TEXT[route] ?? DEFAULT_MIN_BODY_TEXT;
  if (bodyText.length < minBody) {
    problems.push(`body text too short: ${bodyText.length} chars (need >= ${minBody})`);
  }

  if (isBlogRoute(route)) {
    const types = extractJsonLdTypes(html);
    if (!types.includes('BlogPosting')) {
      problems.push('blog route missing JSON-LD "@type": "BlogPosting"');
    }
    if (!types.includes('BreadcrumbList')) {
      problems.push('blog route missing JSON-LD "@type": "BreadcrumbList"');
    }
  }

  return problems;
}

/** Fetches every route from baseUrl and asserts SSR output. Returns the count of failing routes. */
export async function assertSsr(baseUrl: string): Promise<number> {
  let failures = 0;

  for (const route of ROUTES) {
    const url = new URL(route, baseUrl).toString();
    let html: string;
    try {
      const res = await fetch(url);
      html = await res.text();
      if (!res.ok) {
        console.log(`FAIL ${route}`);
        console.log(`  - HTTP ${res.status} ${res.statusText}`);
        failures++;
        continue;
      }
    } catch (err) {
      console.log(`FAIL ${route}`);
      console.log(`  - fetch error: ${err instanceof Error ? err.message : String(err)}`);
      failures++;
      continue;
    }

    const problems = checkRouteHtml(route, html, baselineTitleFor(route));
    if (problems.length === 0) {
      const bodyLen = extractBodyText(html).length;
      console.log(`PASS ${route} (${bodyLen} chars)`);
    } else {
      console.log(`FAIL ${route}`);
      for (const p of problems) console.log(`  - ${p}`);
      failures++;
    }
  }

  console.log('');
  console.log(`${ROUTES.length - failures}/${ROUTES.length} routes passed`);

  return failures;
}

if (process.argv[1] && /assert-ssr\.(ts|js|mjs|cjs)$/.test(process.argv[1])) {
  const baseUrl = process.argv[2] ?? 'http://localhost:3000';
  assertSsr(baseUrl).then((failures) => {
    if (failures > 0) process.exit(1);
  });
}
