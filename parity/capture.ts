import type { Page } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { FREEZE_CSS, FREEZE_INIT } from './freeze';
import { MASKS, slugFor, type Viewport } from './config';

export interface PageMeta {
  title: string;
  metas: Record<string, string>;
  canonical: string[];
  jsonLd: unknown[];
}

export interface CaptureResult {
  png: string;
  consoleErrors: string[];
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
  page.on('console', (msg) => {
    if (msg.type() === 'error' || msg.type() === 'warning') consoleErrors.push(msg.text());
  });
  page.on('pageerror', (err) => consoleErrors.push(`pageerror: ${err.message}`));

  await page.setViewportSize({ width: vp.width, height: vp.height });
  await page.addInitScript(FREEZE_INIT);
  await page.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle' });
  await page.addStyleTag({ content: FREEZE_CSS });

  // Fonts must be settled before shooting — the single biggest source of flake.
  await page.evaluate(() => document.fonts.ready);
  // Decode every image so nothing pops in mid-screenshot.
  await page.evaluate(async () => {
    await Promise.all(
      Array.from(document.images).map((img) =>
        img.decode().catch(() => undefined)
      )
    );
  });
  // Scroll the full page to trigger any lazy/in-view content, then return to top.
  await page.evaluate(async () => {
    const step = window.innerHeight;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => requestAnimationFrame(() => r(null)));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(300);

  mkdirSync(join(outDir, vp.name), { recursive: true });
  const png = join(outDir, vp.name, `${slugFor(route)}.png`);

  await page.screenshot({
    path: png,
    fullPage: true,
    scale: 'device',
    animations: 'disabled',
    caret: 'hide',
    mask: (MASKS[route] ?? []).map((sel) => page.locator(sel)),
  });

  return { png, consoleErrors };
}
