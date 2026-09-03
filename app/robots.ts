import type { MetadataRoute } from 'next';

/**
 * Single source of truth for robots.txt.
 *
 * This resolves a pre-existing conflict between two competing sources, neither of which
 * shipped what its author intended:
 *
 * - `public/robots.txt` was hand-authored with explicit Allow entries for the AI crawlers
 *   (GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot, Google-Extended) but carried no
 *   Sitemap directive. Under Vite, `vite-plugin-sitemap` OVERWROTE this file at build time,
 *   so `dist/robots.txt` shipped without the AI-crawler entries — the intent never reached
 *   production.
 * - The plugin's generated file had the Sitemap directive but only a `*` rule.
 *
 * Under Next the precedence would have flipped: a static `public/robots.txt` shadows this
 * route, which would have served the AI entries but silently dropped the Sitemap directive.
 *
 * So `public/robots.txt` is deleted and both intents are merged here. Nothing either source
 * asked for is lost. The explicit AI-crawler rules are redundant with `*` in strict robots
 * semantics, but they are kept because they were deliberately written, they state intent
 * legibly for a site whose whole purpose is AI-crawler visibility, and some crawlers are
 * documented as matching their own user-agent token before falling back to `*`.
 */
export default function robots(): MetadataRoute.Robots {
  const allowAll = { allow: '/' };

  return {
    rules: [
      { userAgent: 'GPTBot', ...allowAll },
      { userAgent: 'ClaudeBot', ...allowAll },
      { userAgent: 'PerplexityBot', ...allowAll },
      { userAgent: 'OAI-SearchBot', ...allowAll },
      { userAgent: 'Google-Extended', ...allowAll },
      { userAgent: '*', ...allowAll },
    ],
    sitemap: 'https://dros.ai/sitemap.xml',
  };
}
