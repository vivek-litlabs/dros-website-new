import type { Page, ConsoleMessage } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { FREEZE_CSS, FREEZE_INIT } from './freeze';
import {
  MASKS,
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
    while (Date.now() < deadline) {
      await page.waitForTimeout(STABILITY_INTERVAL_MS);
      const next = await page.screenshot(screenshotOptions);
      if (next.equals(previous)) {
        stable = true;
        previous = next;
        break;
      }
      previous = next;
    }
    if (!stable) {
      consoleErrors.push(`parity: ${route} did not reach visual stability within ${STABILITY_TIMEOUT_MS}ms`);
    }

    mkdirSync(join(outDir, vp.name), { recursive: true });
    const png = join(outDir, vp.name, `${slugFor(route)}.png`);
    writeFileSync(png, previous);

    return { png, consoleErrors, stable };
  } finally {
    page.off('console', onConsole);
    page.off('pageerror', onPageError);
  }
}
