import type { Page, ConsoleMessage } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { FREEZE_CSS, FREEZE_INIT } from './freeze';
import {
  MASKS,
  REPORT_DIR,
  slugFor,
  STABILITY_INTERVAL_MS,
  STABILITY_TIMEOUT_MS,
  type Viewport,
} from './config';

export interface PageMeta {
  title: string;
  metas: Record<string, string>;
  canonical: string[];
  jsonLd: unknown[];
}

export interface CaptureResult {
  png: string;
  consoleErrors: string[];
  stable: boolean;
  pollCount: number;
}

export async function extractMeta(page: Page): Promise<PageMeta> {
  return page.evaluate(() => {
    const metas: Record<string, string> = {};
    document.querySelectorAll('meta').forEach((m) => {
      const key = m.getAttribute('name') ?? m.getAttribute('property');
      const content = m.getAttribute('content');
      if (key && content !== null) metas[key] = content;
    });
    const canonical = Array.from(
      document.querySelectorAll('link[rel="canonical"]')
    ).map((l) => l.getAttribute('href') ?? '');
    const jsonLd = Array.from(
      document.querySelectorAll('script[type="application/ld+json"]')
    ).map((s) => {
      try { return JSON.parse(s.textContent ?? 'null'); } catch { return { __parseError: s.textContent }; }
    });
    return { title: document.title, metas, canonical, jsonLd };
  });
}

/**
 * Origins allowed to load during capture, beyond the site under test itself.
 *
 * Google Fonts is the only third party that affects layout: Saans is self-hosted, but
 * Geist Mono / Inter / Instrument Serif / Space Grotesk are linked from index.html, and
 * blocking them would silently swap in fallback metrics on every page.
 */
const ALLOWED_EXTERNAL_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];

/**
 * Make every capture independent of the public internet.
 *
 * The site loads third-party resources — YouTube embeds, analytics, tag manager, Clarity.
 * Those fail intermittently (observed: a 400 on one run, an ERR_NAME_NOT_RESOLVED on the
 * next, on different routes each time), and each failure lands in `consoleErrors` and fails
 * the gate. A gate that reports a different failure set every run is not a gate: people
 * start ignoring it, which is worse than not having it.
 *
 * Blocking them is safe for parity because it is applied identically to both builds, and
 * because anything that actually affects layout still fails the pixel check — if the
 * migration dropped an embed, the surrounding markup would reflow and the diff would catch
 * it. What this gives up is verifying third-party *content* renders identically, which is
 * outside our control and non-deterministic anyway (video thumbnails change).
 *
 * The alternative considered was recording a HAR and replaying it (`routeFromHAR`), which
 * preserves full fidelity. It was rejected as disproportionate: it commits tens of MB of
 * third-party bytes as reference data to verify things the migration cannot change.
 */
async function applyNetworkPolicy(page: Page, baseUrl: string): Promise<void> {
  const siteOrigin = new URL(baseUrl).origin;
  await page.route('**/*', (route) => {
    const url = route.request().url();
    // Next prefetches linked routes in the background. Mid-migration those hit not-yet-ported
    // paths, and even when complete they keep the network busy indefinitely, which stalls the
    // `networkidle` wait this harness depends on. Prefetches never affect what the page
    // renders, so satisfying them silently costs no fidelity.
    if (route.request().headers()['next-router-prefetch'] !== undefined) {
      return route.fulfill({ status: 204, body: '' });
    }

    if (url.startsWith(siteOrigin) || url.startsWith('data:') || url.startsWith('blob:')) {
      return route.continue();
    }
    let host: string;
    try {
      host = new URL(url).hostname;
    } catch {
      return route.continue();
    }
    if (ALLOWED_EXTERNAL_HOSTS.includes(host)) return route.continue();
    // Fulfil empty rather than abort. An aborted request makes the page log
    // "Failed to load resource: net::ERR_FAILED", which would land right back in
    // consoleErrors and fail the gate — trading intermittent noise for constant noise.
    // A 204 satisfies the request silently, and iframes keep the dimensions our own
    // markup gives them, so layout is untouched.
    return route.fulfill({ status: 204, body: '' });
  });
}

export async function captureRoute(
  page: Page,
  baseUrl: string,
  route: string,
  vp: Viewport,
  outDir: string
): Promise<CaptureResult> {
  const consoleErrors: string[] = [];
  const onConsole = (msg: ConsoleMessage) => {
    if (msg.type() === 'error' || msg.type() === 'warning') consoleErrors.push(msg.text());
  };
  const onPageError = (err: Error) => consoleErrors.push(`pageerror: ${err.message}`);
  page.on('console', onConsole);
  page.on('pageerror', onPageError);

  try {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.addInitScript(FREEZE_INIT);
    await applyNetworkPolicy(page, baseUrl);
    await page.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle' });
    await page.addStyleTag({ content: FREEZE_CSS });

    // Fonts must be settled before shooting — the single biggest source of flake.
    await page.evaluate(() => document.fonts.ready);
    // Scroll the full page to trigger any lazy/in-view content, then return to top.
    await page.evaluate(async () => {
      const step = window.innerHeight;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => requestAnimationFrame(() => r(null)));
      }
      window.scrollTo(0, 0);
    });
    // Decode every image — including ones scrolling just triggered to lazy-load —
    // so nothing pops in mid-screenshot.
    await page.evaluate(async () => {
      await Promise.all(
        Array.from(document.images).map((img) =>
          img.decode().catch(() => undefined)
        )
      );
    });
    const screenshotOptions = {
      fullPage: true,
      scale: 'device' as const,
      animations: 'disabled' as const,
      caret: 'hide' as const,
      mask: (MASKS[route] ?? []).map((sel) => page.locator(sel)),
    };

    // Poll until two consecutive screenshots are byte-identical (visual stability),
    // or give up at the timeout. A fixed wait can't tell settled from mid-animation;
    // this does.
    const deadline = Date.now() + STABILITY_TIMEOUT_MS;
    let previous = await page.screenshot(screenshotOptions);
    let stable = false;
    let pollCount = 0;
    let lastDiffPair: [Buffer, Buffer] | null = null;
    while (Date.now() < deadline) {
      await page.waitForTimeout(STABILITY_INTERVAL_MS);
      const next = await page.screenshot(screenshotOptions);
      pollCount++;
      if (next.equals(previous)) {
        stable = true;
        previous = next;
        break;
      }
      lastDiffPair = [previous, next];
      previous = next;
    }
    if (!stable) {
      consoleErrors.push(
        `parity: ${route} did not reach visual stability within ${STABILITY_TIMEOUT_MS}ms (${pollCount} stability poll(s))`
      );
      // Diagnostics only — never used to decide pass/fail. Write the last two
      // differing frames so a human can see exactly what moved, rather than
      // just being told "unstable".
      if (lastDiffPair) {
        const diagDir = join(REPORT_DIR, 'unstable', vp.name);
        mkdirSync(diagDir, { recursive: true });
        writeFileSync(join(diagDir, `${slugFor(route)}-a.png`), lastDiffPair[0]);
        writeFileSync(join(diagDir, `${slugFor(route)}-b.png`), lastDiffPair[1]);
      }
    }

    mkdirSync(join(outDir, vp.name), { recursive: true });
    const png = join(outDir, vp.name, `${slugFor(route)}.png`);
    writeFileSync(png, previous);

    return { png, consoleErrors, stable, pollCount };
  } finally {
    page.off('console', onConsole);
    page.off('pageerror', onPageError);
  }
}
