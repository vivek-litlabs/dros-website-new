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

/**
 * Max time to wait for two consecutive polled screenshots to be byte-identical.
 *
 * The tallest route on this site (`/`) is ~23000 physical px tall at
 * deviceScaleFactor 2; a single full-page screenshot there costs roughly
 * 7 seconds. A short budget can starve the check itself: at 15000ms, a tall
 * page gets exactly one re-screenshot, so the stability poll never gets the
 * chance to observe two consecutive post-settle frames, even when the page
 * has nothing left to animate. The residual motion on tall routes is
 * framer-motion `whileInView` reveals, which take a few seconds to finish
 * and (per Task 2) do not honour `prefers-reduced-motion` in this codebase.
 * 60000ms affords at least three or four screenshot comparisons on the
 * tallest routes, which is enough for the check to be meaningful. Short
 * routes are unaffected — they still exit as soon as two consecutive shots
 * match, at no extra cost. Do not lower this back down without re-measuring
 * the tallest route's screenshot cost first.
 */
export const STABILITY_TIMEOUT_MS = 60000;

/**
 * Console messages that are pre-existing, deterministic, and identical in both
 * the baseline and current builds, so they cannot mask a migration regression.
 * Anything not matched here still fails the gate. Do not add an entry to work
 * around a real difference — add it only for a documented, reviewed exception.
 *
 * - `RECAPTCHA_SITE_KEY is not set`: form-bearing routes warn about the
 *   missing reCAPTCHA key in a local environment. Setting a placeholder key
 *   instead would render a visible error widget and break pixel parity.
 *   The `VITE_`/`NEXT_PUBLIC_` env var prefix is deliberately omitted from
 *   the pattern so this entry keeps matching after the migration renames
 *   `VITE_RECAPTCHA_SITE_KEY` to `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` — matching
 *   only the `VITE_` form would silently stop working on the Next build and
 *   look exactly like a migration regression.
 *
 * The remaining three come from the third-party video `iframe` embeds on
 * `/resources/videos` and `/collections-ai-workshop`, and are emitted by Chromium
 * itself rather than by this site's code. They appeared on those two routes in
 * every viewport while the pixel diff was exactly 0, which corroborates that
 * nothing visual differs. They are not app behaviour the migration can change:
 *
 * - `Unrecognized feature: 'web-share'`: the embed's `allow` attribute lists a
 *   permission this Chromium build does not recognise.
 * - `powerPreference option is currently ignored`: Chromium-on-Windows WebGPU
 *   warning raised when the embedded player requests an adapter.
 * - `No available adapters`: headless Chromium exposes no WebGPU adapter.
 *
 * If the migration were to drop an embed entirely, these messages would vanish —
 * but that would also change the rendered output and fail the pixel gate, so
 * allowlisting them cannot hide a regression.
 */
export interface ConsoleNoiseRule {
  /** Message pattern to tolerate. */
  pattern: RegExp;
  /**
   * Routes this rule applies to. Omit only for noise that is genuinely global.
   * Scoping matters: an embed diagnostic is expected on a page with an embed and
   * suspicious anywhere else, and an unscoped pattern would excuse both.
   */
  routes?: string[];
  /** Why tolerating this cannot mask a migration regression. */
  why: string;
}

/** Routes carrying third-party video iframes, the source of the embed diagnostics below. */
const EMBED_ROUTES = ['/resources/videos', '/collections-ai-workshop'];

export const KNOWN_CONSOLE_NOISE: ConsoleNoiseRule[] = [
  {
    pattern: /RECAPTCHA_SITE_KEY is not set/i,
    why: 'Local env has no reCAPTCHA key; a placeholder would render a visible error widget and break pixel parity. Prefix omitted so it survives the VITE_ to NEXT_PUBLIC_ rename.',
  },
  {
    pattern: /Unrecognized feature: .?web-share/i,
    routes: EMBED_ROUTES,
    why: "The embed's allow attribute names a permission this Chromium build does not recognise.",
  },
  {
    pattern: /Permissions policy violation: compute-pressure/i,
    routes: EMBED_ROUTES,
    why: 'The embedded player probes for compute-pressure, which the iframe policy disallows. Appears intermittently by viewport.',
  },
  {
    pattern: /powerPreference option is currently ignored/i,
    routes: EMBED_ROUTES,
    why: 'Chromium-on-Windows WebGPU warning raised when the embedded player requests an adapter.',
  },
  {
    pattern: /No available adapters/i,
    routes: EMBED_ROUTES,
    why: 'Headless Chromium exposes no WebGPU adapter to the embedded player.',
  },
];

/** True when this message is documented noise for this route. */
export function isKnownConsoleNoise(route: string, message: string): boolean {
  return KNOWN_CONSOLE_NOISE.some(
    (rule) => rule.pattern.test(message) && (!rule.routes || rule.routes.includes(route))
  );
}
