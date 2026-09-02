import routes from './routes.json';

export interface Viewport {
  name: 'mobile' | 'tablet' | 'desktop';
  width: number;
  height: number;
}

export const VIEWPORTS: Viewport[] = [
  { name: 'mobile', width: 375, height: 812 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
];

export const DEVICE_SCALE_FACTOR = 2;

export const ROUTES: string[] = routes;

/** '/' -> 'home'; '/collections/first-party' -> 'collections__first-party' */
export function slugFor(route: string): string {
  if (route === '/') return 'home';
  return route.replace(/^\//, '').replace(/\//g, '__');
}

/**
 * CSS selectors masked before capture, per route.
 * Every mask is declared here — nothing is masked implicitly.
 * Add an entry only for genuinely non-deterministic content, and note why.
 */
export const MASKS: Record<string, string[]> = {};

export const BASELINE_DIR = 'parity/baseline';
export const CURRENT_DIR = 'parity/current';
export const REPORT_DIR = 'parity/report';

/** Max pixels allowed to differ. Zero. Do not raise this. */
export const PIXEL_TOLERANCE = 0;

/** Polling interval used while waiting for a page to reach visual stability before capture. */
export const STABILITY_INTERVAL_MS = 250;

/** Max time to wait for two consecutive polled screenshots to be byte-identical. */
export const STABILITY_TIMEOUT_MS = 15000;

/**
 * Console messages that are pre-existing, deterministic, and identical in both
 * the baseline and current builds, so they cannot mask a migration regression.
 * Anything not matched here still fails the gate. Do not add an entry to work
 * around a real difference — add it only for a documented, reviewed exception.
 *
 * - `VITE_RECAPTCHA_SITE_KEY not set`: form-bearing routes warn about the
 *   missing reCAPTCHA key in a local environment. Setting a placeholder key
 *   instead would render a visible error widget and break pixel parity.
 */
export const KNOWN_CONSOLE_NOISE: RegExp[] = [/VITE_RECAPTCHA_SITE_KEY not set/];
