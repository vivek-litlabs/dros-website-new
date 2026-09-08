import type { MetadataRoute } from 'next';
import routes from '../parity/routes.json';
import { getCmsOnlyPosts } from '../src/lib/blog-cms';

const BASE_URL = 'https://dros.ai';

// Reproduces the changefreq/priority maps from the vite-plugin-sitemap config
// in vite.config.ts, keyed by route path (see the `sitemap({...})` plugin
// options there). '*' is the fallback for any route not listed explicitly.
const CHANGE_FREQUENCY: Record<string, MetadataRoute.Sitemap[number]['changeFrequency']> = {
  '*': 'monthly',
  '/': 'weekly',
  '/pricing': 'weekly',
  '/blogs': 'weekly',
  '/events': 'weekly',
  '/events/2026/aca-orlando': 'weekly',
  '/resources/videos': 'weekly',
};

const PRIORITY: Record<string, number> = {
  '*': 0.7,
  '/': 1.0,
  '/pricing': 0.9,
  '/about': 0.8,
  '/contact': 0.8,
  '/book-meeting': 0.8,
  '/trust-center': 0.8,
  '/blogs': 0.8,
  '/events': 0.7,
  '/events/2026/aca-orlando': 0.6,
  '/events/2026/armtech-dallas': 0.5,
  '/events/2026/rmai-las-vegas': 0.5,
  '/resources/videos': 0.6,
  '/adoption-gap-report-state-of-collections-2026': 0.8,
};

// parity/routes.json is the authoritative, already-generated list of 41
// screenshot-parity routes. It deliberately excludes three URLs that were
// present in the old Vite build's dist/sitemap.xml (which had 44 entries):
//   - /probe: a throwaway build-verification page, deleted later in the
//     migration and never meant to be crawled.
//   - /api-docs and /release-notes: client-side redirects, not real pages,
//     so they don't belong in a sitemap.
// That's why this file emits exactly 41 entries, not 43 or 44 — nothing
// was dropped, the source list was already correct.
const ROUTES: string[] = routes;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // New Airtable-authored posts are not in routes.json - that file lists the routes the
  // parity gate photographs, which is by definition the pre-existing set. Appending them
  // keeps the sitemap complete while leaving all 41 original entries byte-identical.
  const cmsRoutes = (await getCmsOnlyPosts()).map((p) => p.slug);

  return [...ROUTES, ...cmsRoutes].map((route) => {
    // routes.json uses '/' for the homepage; the absolute URL for it must
    // have no trailing slash to match the previous Vite-generated output.
    const url = route === '/' ? BASE_URL : `${BASE_URL}${route}`;

    return {
      url,
      changeFrequency: CHANGE_FREQUENCY[route] ?? CHANGE_FREQUENCY['*'],
      priority: PRIORITY[route] ?? PRIORITY['*'],
    };
  });
}
