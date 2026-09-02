import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync, readFileSync, existsSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { ROUTES, VIEWPORTS, slugFor, BASELINE_DIR, CURRENT_DIR, REPORT_DIR, DEVICE_SCALE_FACTOR, isKnownConsoleNoise } from './config';
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

// Preflight. Without this, an unreachable server produces a full run of
// "failures" that read exactly like parity regressions.
try {
  const res = await fetch(baseUrl, { method: 'HEAD' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
} catch (err) {
  console.error(
    `Cannot reach ${baseUrl} (${err instanceof Error ? err.message : String(err)}).\n` +
      'Start the server before running the parity harness. Nothing was captured or compared.'
  );
  process.exit(2);
}

const browser = await chromium.launch();
const context = await browser.newContext({ deviceScaleFactor: DEVICE_SCALE_FACTOR });
const results: RouteResult[] = [];
let unstableCount = 0;
let hardFailureCount = 0;

/**
 * A server that dies mid-run is an infrastructure failure, not a parity failure, but it
 * looks like one: the capture in flight when it dies renders partially and reports a large
 * pixel diff, and every route after it fails too. Abort immediately and say so, so nobody
 * spends an afternoon hunting a regression that never existed.
 */
function abortIfServerGone(err: unknown, route: string): void {
  const msg = err instanceof Error ? err.message : String(err);
  if (!/ERR_CONNECTION_REFUSED|ECONNREFUSED|ERR_CONNECTION_RESET/.test(msg)) return;
  console.error(
    `\nSERVER UNREACHABLE at ${route}: ${msg}\n` +
      'The server stopped responding mid-run. This is an infrastructure failure, not a parity\n' +
      'failure - results from this run are meaningless, INCLUDING any non-zero pixel diff on the\n' +
      'route captured as it died. Restart the server and re-run from scratch.'
  );
  process.exit(2);
}

for (const route of ROUTES) {
  const slug = slugFor(route);
  for (const vp of VIEWPORTS) {
    // A transient navigation timeout on one route must not cost the whole pass.
    // Try once, retry once on failure, and if the retry also fails, record a
    // failed result for this route/viewport and move on to the next one.
    let captured: { png: string; consoleErrors: string[]; stable: boolean; pollCount: number } | null = null;
    let meta: Awaited<ReturnType<typeof extractMeta>> | null = null;
    let hardError: Error | null = null;

    for (let attempt = 1; attempt <= 2; attempt++) {
      const page = await context.newPage();
      try {
        captured = await captureRoute(page, baseUrl, route, vp, outDir);
        meta = await extractMeta(page);
        hardError = null;
        break;
      } catch (err) {
        hardError = err instanceof Error ? err : new Error(String(err));
        console.error(
          `CAPTURE-ERROR ${vp.name.padEnd(7)} ${route} (attempt ${attempt}/2): ${hardError.message}`
        );
      } finally {
        await page.close();
      }
    }

    if (!captured || !meta) {
      // A dead server is not a per-route failure and must not be recorded as one.
      abortIfServerGone(hardError, `${route} (${vp.name})`);

      // Both attempts failed outright (e.g. navigation timeout). Record it as a
      // failed result rather than crashing the whole pass, so routes after this
      // one still get a chance to run.
      hardFailureCount++;
      results.push({
        route,
        viewport: vp.name,
        pixels: -1,
        stable: false,
        metaProblems: [],
        consoleErrors: [`parity: ${route} (${vp.name}) failed to capture after 2 attempts: ${hardError?.message ?? 'unknown error'}`],
        baselinePng: join(BASELINE_DIR, vp.name, `${slug}.png`),
        currentPng: join(outDir, vp.name, `${slug}.png`),
        diffPng: null,
      });
      console.error(
        `FAILED    ${vp.name.padEnd(7)} ${route} - capture failed twice: ${hardError?.message ?? 'unknown error'}`
      );
      if (mode === 'capture') {
        console.log(`captured ${vp.name.padEnd(7)} ${route} -- FAILED, see above`);
      } else {
        console.log(`FAIL  ${vp.name.padEnd(7)} ${route}  (capture failed)`);
      }
      continue;
    }

    const { png, consoleErrors: rawErrors, stable, pollCount } = captured;

    // Filter only the documented pre-existing noise; anything else still fails the gate.
    const consoleErrors = rawErrors.filter((e) => !isKnownConsoleNoise(route, e));

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
      console.error(`UNSTABLE  ${vp.name.padEnd(7)} ${route} - capture never settled (${pollCount} stability poll(s))`);
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
  if (hardFailureCount > 0) {
    console.error(`${hardFailureCount} capture(s) failed outright (see CAPTURE-ERROR/FAILED lines above).`);
  }
  if (!pass) { console.error(`${failures} check(s) failed.`); process.exit(1); }
  console.log('All parity checks passed.');
} else if (unstableCount > 0 || hardFailureCount > 0) {
  if (unstableCount > 0) console.error(`\n${unstableCount} capture(s) never settled. Baseline rejected.`);
  if (hardFailureCount > 0) console.error(`${hardFailureCount} capture(s) failed outright after 2 attempts. Baseline rejected.`);
  process.exit(1);
} else {
  console.log('\nBaseline captured; every capture reached visual stability.');
}
