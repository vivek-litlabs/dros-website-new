/* Fallback nav height, used before the shared Navbar has mounted. */
export const NAV_HEIGHT = 64;

/**
 * Height currently covered by the site's fixed chrome (announcement banner +
 * shared Navbar). Measured off the nav rather than hardcoded: the banner can be
 * dismissed from the Navbar at any moment, and the nav's own height animates
 * between its transparent (76px) and solid (64px) states.
 */
export function topOffset() {
  if (typeof document === 'undefined') return NAV_HEIGHT;
  const nav = document.querySelector('nav');
  const bottom = nav ? nav.getBoundingClientRect().bottom : 0;
  return bottom > 0 ? bottom : NAV_HEIGHT;
}

/**
 * Scrolls a section into view, clearing the fixed banner and nav. Both bars are
 * fixed and never scroll away, so their height has to come off the target
 * position or the heading lands underneath them.
 */
export function scrollToSection(id: string, reduce: boolean | null, offset: number) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top: Math.max(top, 0), behavior: reduce ? 'auto' : 'smooth' });
}
