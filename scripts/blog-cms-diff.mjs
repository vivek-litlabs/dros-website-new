/**
 * Diff the CMS-rendered post against the React-rendered one, pixel for pixel.
 *
 * The CMS route may only replace the real one if it is visually identical, so this
 * shoots /cms-preview/<slug> and /blogs/<slug> under the same freeze rules the parity
 * harness uses and reports where they differ. Diff images are written for anything
 * that fails, because a pixel count alone does not tell you what moved.
 */
import { chromium } from '@playwright/test';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import { FREEZE_CSS, FREEZE_INIT } from '../parity/freeze.ts';

const BASE = process.argv[2] ?? 'http://localhost:3000';
const ONLY = process.argv[3];
const OUT = 'artifacts/cms-diff';

const VIEWPORTS = [
  { name: 'mobile', width: 375, height: 812 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
];

const { posts } = JSON.parse(readFileSync('artifacts/blogs.json', 'utf8'));
const subjects = (ONLY ? posts.filter((p) => p.slug.includes(ONLY)) : posts).map((p) => ({
  slug: p.slug,
  leaf: p.slug.split('/').filter(Boolean).slice(-1)[0],
}));

async function shoot(page, url, vp) {
  await page.setViewportSize({ width: vp.width, height: vp.height });
  await page.addInitScript(FREEZE_INIT);
  await page.route('**/*', (route) => {
    const u = route.request().url();
    if (u.startsWith(BASE) || u.startsWith('data:') || u.startsWith('blob:')) return route.continue();
    const host = (() => { try { return new URL(u).hostname; } catch { return ''; } })();
    if (host === 'fonts.googleapis.com' || host === 'fonts.gstatic.com') return route.continue();
    return route.fulfill({ status: 204, body: '' });
  });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.addStyleTag({ content: FREEZE_CSS });
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(async () => {
    const step = window.innerHeight;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => requestAnimationFrame(() => r(null)));
    }
    window.scrollTo(0, 0);
    const start = Date.now();
    while (Date.now() - start < 1500) {
      if (window.scrollY === 0 && Date.now() - start > 100) break;
      await new Promise((r) => requestAnimationFrame(() => r(null)));
    }
  });
  await page.evaluate(async () => {
    await Promise.all(Array.from(document.images).map((i) => i.decode().catch(() => undefined)));
  });
  return page.screenshot({ fullPage: true, animations: 'disabled', caret: 'hide' });
}

const browser = await chromium.launch();
const context = await browser.newContext({ deviceScaleFactor: 2 });
mkdirSync(OUT, { recursive: true });

let failures = 0;
const summary = [];

for (const s of subjects) {
  for (const vp of VIEWPORTS) {
    const a = await context.newPage();
    const b = await context.newPage();
    let line;
    try {
      const real = await shoot(a, `${BASE}${s.slug}`, vp);
      const cms = await shoot(b, `${BASE}/cms-preview/${s.leaf}`, vp);
      const pa = PNG.sync.read(real);
      const pb = PNG.sync.read(cms);

      if (pa.width !== pb.width || pa.height !== pb.height) {
        failures++;
        line = `SIZE ${vp.name.padEnd(8)} ${s.slug}  react ${pa.width}x${pa.height} vs cms ${pb.width}x${pb.height}  (Δh ${pb.height - pa.height})`;
      } else {
        const diff = new PNG({ width: pa.width, height: pa.height });
        const n = pixelmatch(pa.data, pb.data, diff.data, pa.width, pa.height, { threshold: 0 });
        if (n === 0) {
          line = `OK   ${vp.name.padEnd(8)} ${s.slug}  0px`;
        } else {
          failures++;
          const file = `${OUT}/${s.leaf}-${vp.name}.png`;
          writeFileSync(file, PNG.sync.write(diff));
          line = `DIFF ${vp.name.padEnd(8)} ${s.slug}  ${n}px -> ${file}`;
        }
      }
    } catch (err) {
      failures++;
      line = `FAIL ${vp.name.padEnd(8)} ${s.slug}  ${err.message}`;
    } finally {
      await a.close();
      await b.close();
    }
    console.log(line);
    summary.push(line);
  }
}

await browser.close();
console.log(
  failures === 0
    ? `\nCMS output is pixel-identical to the React pages across ${subjects.length} post(s).`
    : `\n${failures} check(s) differ.`
);
process.exit(failures === 0 ? 0 : 1);
