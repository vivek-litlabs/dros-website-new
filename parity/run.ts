import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync, readFileSync, existsSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { ROUTES, VIEWPORTS, slugFor, BASELINE_DIR, CURRENT_DIR, REPORT_DIR, DEVICE_SCALE_FACTOR, KNOWN_CONSOLE_NOISE } from './config';
import { captureRoute, extractMeta } from './capture';
import { diffPng } from './diff';
import { diffMeta } from './assert-meta';
import { writeReport, type RouteResult } from './report';

const mode = process.argv[2];             // 'capture' | 'compare'
const baseUrl = process.argv[3] ?? 'http://localhost:3000';

if (mode !== 'capture' && mode !== 'compare') {
  console.error('usage: tsx parity/run.ts <capture|compare> [baseUrl]');
  process.exit(2);
}

const outDir = mode === 'capture' ? BASELINE_DIR : CURRENT_DIR;

const browser = await chromium.launch();
const context = await browser.newContext({ deviceScaleFactor: DEVICE_SCALE_FACTOR });
const results: RouteResult[] = [];
let unstableCount = 0;

for (const route of ROUTES) {
  const slug = slugFor(route);
  for (const vp of VIEWPORTS) {
    const page = await context.newPage();
    const { png, consoleErrors: rawErrors, stable } = await captureRoute(page, baseUrl, route, vp, outDir);
    const meta = await extractMeta(page);
    await page.close();

    // Filter only the documented pre-existing noise; anything else still fails the gate.
    const consoleErrors = rawErrors.filter((e) => !KNOWN_CONSOLE_NOISE.some((re) => re.test(e)));

    let metaPath: string | null = null;
    if (vp.name === 'desktop') {
      mkdirSync(outDir, { recursive: true });
      metaPath = join(outDir, `${slug}.meta.json`);
      writeFileSync(metaPath, JSON.stringify(meta, null, 2));
    }

    // An unstable capture is not a usable baseline. Fail loudly in capture mode too, rather
    // than silently writing a mid-animation frame that every later run diffs against. Delete
    // what was just written rather than leaving it: a missing baseline fails loudly on the
    // next run, whereas a poisoned one would pass quietly.
    if (!stable) {
      console.error(`UNSTABLE  ${vp.name.padEnd(7)} ${route} - capture never settled`);
      unstableCount++;
      rmSync(png, { force: true });
      if (metaPath) rmSync(metaPath, { force: true });
    }

    if (mode === 'compare') {
      const basePng = join(BASELINE_DIR, vp.name, `${slug}.png`);
      const dPath = join(REPORT_DIR, 'diff', vp.name, `${slug}.png`);
      // An unstable current capture had its PNG deleted above (see the stability check) —
      // there is nothing left to diff, so skip pixelmatch rather than reading a missing file.
      const pixels = stable && existsSync(basePng) ? diffPng(basePng, png, dPath) : -1;

      let metaProblems: string[] = [];
      if (vp.name === 'desktop') {
        const baseMetaPath = join(BASELINE_DIR, `${slug}.meta.json`);
        metaProblems = existsSync(baseMetaPath)
          ? diffMeta(JSON.parse(readFileSync(baseMetaPath, 'utf8')), meta)
          : ['no baseline metadata'];
      }

      results.push({
        route, viewport: vp.name, pixels, stable, metaProblems, consoleErrors,
        baselinePng: basePng, currentPng: png,
        diffPng: pixels > 0 ? dPath : null,
      });
      const ok = pixels === 0 && stable && !metaProblems.length && !consoleErrors.length;
      console.log(`${ok ? 'PASS' : 'FAIL'}  ${vp.name.padEnd(7)} ${route}  (${pixels}px)`);
    } else {
      console.log(`captured ${vp.name.padEnd(7)} ${route}`);
    }
  }
}

await browser.close();

if (mode === 'compare') {
  const { pass, failures } = writeReport(results);
  console.log(`\nReport: ${REPORT_DIR}/index.html`);
  if (!pass) { console.error(`${failures} check(s) failed.`); process.exit(1); }
  console.log('All parity checks passed.');
} else if (unstableCount > 0) {
  console.error(`\n${unstableCount} capture(s) never settled. Baseline rejected.`);
  process.exit(1);
} else {
  console.log('\nBaseline captured; every capture reached visual stability.');
}
