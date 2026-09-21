import { useState } from 'react';
import { BANNER_STORAGE_KEY } from '../../views/AnnouncementBanner';

/*
 * Sitewide announcement-banner dismissal, read from the same localStorage key
 * the shared Navbar uses - so dismissing the banner anywhere on the site keeps
 * it dismissed here, and vice versa.
 *
 * The Coverage Gap page owns this state (rather than CoverageNav) because the
 * banner's height also shifts the hero and the anchor-scroll offset.
 */
export default function useBannerDismissed() {
  const [dismissed, setDismissed] = useState(() => {
    try {
      return localStorage.getItem(BANNER_STORAGE_KEY) === '1';
    } catch {
      return false;
    }
  });

  function dismiss() {
    setDismissed(true);
    try {
      localStorage.setItem(BANNER_STORAGE_KEY, '1');
    } catch {
      // localStorage unavailable (private mode) - dismissal just won't persist.
    }
  }

  return { dismissed, dismiss };
}
