/**
 * The site's canonical origin.
 *
 * Open Graph images, Twitter card images and schema.org `image` must all be absolute
 * URLs - a relative path is silently ignored by most crawlers, which is the kind of
 * failure that never shows up in a build log. One constant so those three cannot drift
 * apart from each other.
 */
export const SITE_URL = 'https://dros.ai';

/**
 * Shown as the Open Graph image for a post that has no hero of its own, so a share of
 * it still renders as a card with artwork instead of a bare line of text.
 */
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.png`;

/** Absolute URL for a site-relative path, passed through unchanged if already absolute. */
export function absoluteUrl(path: string): string {
  return /^https?:\/\//.test(path) ? path : `${SITE_URL}${path}`;
}
