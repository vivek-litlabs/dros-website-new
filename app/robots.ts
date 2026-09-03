import type { MetadataRoute } from 'next';

// Reproduces the robots.txt previously emitted by vite-plugin-sitemap's
// `generateRobotsTxt: true` option in vite.config.ts.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://dros.ai/sitemap.xml',
  };
}
