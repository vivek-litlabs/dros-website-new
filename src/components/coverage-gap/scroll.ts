/* Height of the page's own fixed nav bar. */
export const NAV_HEIGHT = 68;
/* Height the shared AnnouncementBanner occupies above it while undismissed. */
export const BANNER_HEIGHT = 64;

/** Total height permanently covered by the fixed banner + nav. */
export function topOffset(bannerVisible: boolean) {
  return NAV_HEIGHT + (bannerVisible ? BANNER_HEIGHT : 0);
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
