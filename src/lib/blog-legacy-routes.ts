import { readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Blog posts that ship as hand-written React views.
 *
 * These keep rendering exactly as they do today. They are pixel-locked against the
 * pre-migration baseline, and their bodies use bespoke layout - step cards, stat grids,
 * icon lists - that the CMS's semantic HTML cannot reproduce to the zero-pixel bar. So
 * the CMS serves NEW posts only, and anything already routed here is left alone.
 *
 * Derived from the filesystem rather than a hand-kept list, because the filesystem is
 * what actually decides routing: Next matches a static segment before a dynamic one, so
 * app/blogs/<slug>/page.tsx always wins over app/blogs/[slug]/page.tsx. This function
 * only mirrors that rule so the CMS does not try to build a page that can never be hit.
 *
 * Server-side only - it reads the app directory at build time.
 */
export function legacyBlogSlugs(): Set<string> {
  const slugs = new Set<string>();

  for (const dir of ['app/blogs', 'app/blog']) {
    const abs = join(process.cwd(), dir);
    if (!existsSync(abs)) continue;

    for (const entry of readdirSync(abs, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      // The dynamic segment itself is not a legacy post.
      if (entry.name.startsWith('[')) continue;
      slugs.add(`/${dir.slice('app/'.length)}/${entry.name}`);
    }
  }

  return slugs;
}
