# Next.js Migration at Exact Visual Parity — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate `dros-website-new` from a client-side Vite SPA to Next.js App Router so all 43 routes server-render their real content and metadata, while remaining pixel-identical to the current site.

**Architecture:** Build a deterministic Playwright screenshot-diff harness *first* and prove it reproduces its own baseline. Then migrate in gated waves — foundation, shared chrome, pilot route, then five route batches — with every wave required to hit zero differing pixels plus a metadata/hydration/console gate before the next begins. Pages become thin server components (exporting `metadata`) wrapping the existing component trees marked `"use client"`.

**Tech Stack:** Next.js 15 (App Router) · React 18 · TypeScript · Tailwind 3 · framer-motion · Playwright · pixelmatch · pngjs

**Spec:** `docs/superpowers/specs/2026-09-02-nextjs-migration-parity-design.md`

## Global Constraints

- Branch is `next-migration`. Never commit to `main`.
- Default parity gate is **0 differing pixels**. Percentage thresholds are forbidden. Any route that cannot reach zero gets an entry in `parity-exceptions.md` with cause and sign-off — it does not get a looser threshold.
- Viewports are exactly **375 / 768 / 1440** at `deviceScaleFactor: 2`, full-page.
- **Do not adopt `next/font`.** Saans loads via the existing `@font-face` in `src/index.css` (with its load-bearing `ascent-override: 90%`), and Google families via the existing `<link>` tags. Port both verbatim.
- **Do not add a Lenis provider.** `window.__lenis` is never assigned in this codebase; all four read sites already fall through to native `window.scrollTo`.
- Canonical URLs have exactly **one** source: `metadata.alternates.canonical`. Never emit `<link rel="canonical">` from a component.
- All 43 current URLs keep working byte-for-byte, including the inconsistent singular
  `/blog/reg-f-call-limits-ai-debt-collection`. **41 of them are screenshot-diffed pages.**
  `/api-docs` and `/release-notes` are client-side redirects that render nothing and navigate
  away, so they are excluded from `parity/routes.json` from the start (Task 1, Step 2b) and
  become real 307s in `next.config.js` in Task 11, which verifies them by asserting the
  redirect rather than by screenshot.
- No redesign, no copy changes, no new pages, no dependency upgrades beyond what Next requires.
- GA4 measurement ID is `G-TT8WJVR53D`.
- Node 20+.

---

## File Structure

**Parity harness** (new, `parity/` at repo root — deliberately outside `src/` and `app/` so it survives the migration unchanged):

| File | Responsibility |
|---|---|
| `parity/routes.json` | The 43 route paths. Single source of truth, consumed by the harness and by `app/sitemap.ts`. |
| `parity/config.ts` | Viewports, masks, timeouts, paths. No logic. |
| `parity/freeze.ts` | The injected CSS/JS that makes a page render deterministically. |
| `parity/capture.ts` | Playwright capture of one route → PNG + metadata JSON + console log. |
| `parity/diff.ts` | pixelmatch wrapper: two PNGs → diff count + diff image. |
| `parity/assert-meta.ts` | Metadata and JSON-LD comparison. |
| `parity/report.ts` | HTML report generation. |
| `parity/run.ts` | CLI orchestrator (`capture` / `compare` modes). |
| `parity/baseline/<viewport>/<slug>.png` | Committed baselines. |
| `parity/baseline/<slug>.meta.json` | Committed metadata baselines. |

**Next app** (new):

| File | Responsibility |
|---|---|
| `app/layout.tsx` | Root layout: `<html>`, font links, global metadata, providers. Server component. |
| `app/providers.tsx` | `"use client"` — GA4 init, pageview tracking, scroll restoration. |
| `app/<route>/page.tsx` | One per route. Server component: `metadata` export + renders the ported view. |
| `src/views/<Name>.tsx` | The ported page body, `"use client"`. Moved from `src/pages/`. |
| `app/sitemap.ts`, `app/robots.ts` | Replace `vite-plugin-sitemap`. |
| `next.config.js` | Redirects for `/api-docs` and `/release-notes`. |

**Deleted at the end:** `src/main.tsx`, `vite.config.ts`, `index.html`, `vercel.json`, `scripts/sync-routes.js`, `react-helmet-async` + `lenis` + `vite*` deps. (`src/pages/` no longer exists — Task 5 Step 0 renames it to `src/views/`, because Next treats a `src/pages/` directory as a Pages Router.)

---

## Task 1: Parity harness — config, freeze, and route manifest

**Files:**
- Create: `parity/routes.json`, `parity/config.ts`, `parity/freeze.ts`
- Modify: `package.json` (devDependencies + scripts)

**Interfaces:**
- Consumes: nothing.
- Produces: `VIEWPORTS: Viewport[]` where `Viewport = { name: 'mobile'|'tablet'|'desktop'; width: number; height: number }`; `ROUTES: string[]`; `slugFor(route: string): string`; `MASKS: Record<string, string[]>`; `FREEZE_CSS: string`; `FREEZE_INIT: string`.

- [ ] **Step 1: Install harness dependencies**

```bash
npm install --save-dev @playwright/test pixelmatch pngjs tsx serve
npx playwright install chromium
```

- [ ] **Step 2: Create the route manifest**

Generate it from the existing source so it cannot drift from reality:

```bash
node -e "
const fs=require('fs'),path=require('path');
const dir='src/pages';const out=[];
(function scan(d){for(const e of fs.readdirSync(d,{withFileTypes:true})){
  const p=path.join(d,e.name);
  if(e.isDirectory())scan(p);
  else if(e.name.endsWith('.tsx')){
    const m=fs.readFileSync(p,'utf8').match(/^export const route\s*=\s*['\"]([^'\"]+)['\"]/m);
    if(m)out.push(m[1]);}}})(dir);
out.sort();
fs.mkdirSync('parity',{recursive:true});
fs.writeFileSync('parity/routes.json',JSON.stringify(out,null,2)+'\n');
console.log(out.length+' routes');
"
```

Expected output: `43 routes`

- [ ] **Step 2b: Remove the two client-side redirect routes from the manifest**

`/api-docs` and `/release-notes` are not pages. Both are components whose only behaviour is
`window.location.href = 'https://app.dros.ai/...'` inside a `useEffect`; they render nothing
and immediately navigate away. A route whose job is to leave the page can never reach visual
stability, so it cannot be screenshot-diffed in either build — the capture races the
navigation. Task 11 converts both to real 307s in `next.config.js`; they leave the screenshot
manifest here, at the point the manifest is created.

```bash
node -e "
const fs=require('fs');
const drop=['/api-docs','/release-notes'];
const r=require('./parity/routes.json').filter(x=>!drop.includes(x));
fs.writeFileSync('parity/routes.json',JSON.stringify(r,null,2)+'\n');
console.log(r.length+' screenshot routes');
"
```

Expected output: `41 screenshot routes`

Both URLs still keep working and are still verified — Task 11 asserts each returns a 307 to
the correct destination. They are excluded from pixel diffing only.

- [ ] **Step 3: Verify the manifest has exactly 41 entries and includes the odd singular route**

```bash
node -e "const r=require('./parity/routes.json');console.log(r.length);console.log(r.includes('/blog/reg-f-call-limits-ai-debt-collection'));console.log(r.includes('/api-docs')||r.includes('/release-notes'));"
```

Expected: `41`, then `true`, then `false`. If any is wrong, stop — the manifest is the
foundation of every later gate.

- [ ] **Step 4: Write `parity/config.ts`**

```ts
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

/**
 * Console messages that already occur in the current build and are not migration defects.
 * Filtered from `consoleErrors` before the gate is applied, so anything NEW still fails.
 * Every entry needs a comment justifying it: this list is the only place the console gate
 * can be weakened, so it stays short and reviewed.
 */
export const KNOWN_CONSOLE_NOISE: RegExp[] = [
  // reCAPTCHA site key is absent in a local environment. Emitted identically by the Vite
  // and Next builds, so it cannot hide a migration regression.
  /RECAPTCHA_SITE_KEY/i,
];

export const BASELINE_DIR = 'parity/baseline';
export const CURRENT_DIR = 'parity/current';
export const REPORT_DIR = 'parity/report';

/** Max pixels allowed to differ. Zero. Do not raise this. */
export const PIXEL_TOLERANCE = 0;
```

- [ ] **Step 5: Write `parity/freeze.ts`**

```ts
/** Injected as a stylesheet: settles all motion so screenshots are deterministic. */
export const FREEZE_CSS = `
  *, *::before, *::after {
    animation-duration: 0s !important;
    animation-delay: 0s !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0s !important;
    transition-delay: 0s !important;
    scroll-behavior: auto !important;
  }
  html { scroll-behavior: auto !important; }
  video { visibility: hidden !important; }
`;

/**
 * Runs before any page script. Forces framer-motion into its reduced-motion
 * branch so components render in their settled (final) state rather than
 * their `initial` state, and neutralises the smooth-scroll path.
 */
export const FREEZE_INIT = `
  (() => {
    const mq = window.matchMedia;
    window.matchMedia = (q) => {
      if (typeof q === 'string' && q.includes('prefers-reduced-motion')) {
        return { matches: true, media: q, onchange: null,
          addListener(){}, removeListener(){},
          addEventListener(){}, removeEventListener(){},
          dispatchEvent(){ return false; } };
      }
      return mq.call(window, q);
    };
    Object.defineProperty(window, '__lenis', { value: undefined, writable: false });
  })();
`;
```

- [ ] **Step 6: Commit**

```bash
git add parity package.json package-lock.json
git commit -m "test(parity): add harness config, freeze rules and 43-route manifest"
```

---

## Task 2: Parity harness — capture

**Files:**
- Create: `parity/capture.ts`
- Test: verified by running against the live Vite build in Task 4

**Interfaces:**
- Consumes: `VIEWPORTS`, `MASKS`, `slugFor`, `FREEZE_CSS`, `FREEZE_INIT` from Task 1.
- Produces: `captureRoute(page: Page, baseUrl: string, route: string, vp: Viewport, outDir: string): Promise<CaptureResult>` where `CaptureResult = { png: string; consoleErrors: string[] }`; and `extractMeta(page: Page): Promise<PageMeta>` where `PageMeta = { title: string; metas: Record<string,string>; canonical: string[]; jsonLd: unknown[] }`.

- [ ] **Step 1: Write `parity/capture.ts`**

```ts
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
```

- [ ] **Step 2: Typecheck it compiles**

Run: `npx tsc --noEmit parity/capture.ts --esModuleInterop --resolveJsonModule --module esnext --moduleResolution bundler --target es2022 --strict`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add parity/capture.ts
git commit -m "test(parity): add deterministic route capture"
```

---

## Task 3: Parity harness — diff, metadata assertion, report and CLI

**Files:**
- Create: `parity/diff.ts`, `parity/assert-meta.ts`, `parity/report.ts`, `parity/run.ts`
- Modify: `package.json` (scripts)

**Interfaces:**
- Consumes: `captureRoute`, `extractMeta`, `PageMeta`, `CaptureResult` (Task 2, which now also returns `stable: boolean`); config exports (Task 1).
- Produces: `diffPng(a: string, b: string, out: string): number` (returns differing pixel count); `diffMeta(base: PageMeta, cur: PageMeta): string[]` (returns human-readable difference descriptions, empty when identical); `npm run parity:capture` and `npm run parity:compare`.

**Two additions decided during Task 2, already reflected in the code blocks below:**

1. **`captureRoute` now returns `stable`.** A capture that never reached visual stability is
   worthless as a baseline *and* as a comparison. `run.ts` must treat `stable === false` as a
   hard failure in BOTH modes, and `report.ts` must surface it. Writing a mid-animation frame
   as the baseline would poison every later run that diffs against it.

2. **A documented console-noise allowlist.** Form-bearing routes emit a pre-existing
   `VITE_RECAPTCHA_SITE_KEY not set` warning in a local environment. It is deterministic and
   identical in both builds, so it cannot mask a migration regression — but the gate fails on
   *any* console message, so it would block every run. The fix is an explicit, reviewed
   allowlist, not a weakened gate: listed messages are filtered, anything new still fails.
   Do **not** silence it by setting a placeholder key — an invalid reCAPTCHA key renders a
   visible error widget, which would break pixel parity itself.

- [ ] **Step 1: Write `parity/diff.ts`**

```ts
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

/** Returns the number of differing pixels. Writes a diff image when non-zero. */
export function diffPng(baselinePath: string, currentPath: string, outPath: string): number {
  const a = PNG.sync.read(readFileSync(baselinePath));
  const b = PNG.sync.read(readFileSync(currentPath));

  // Different dimensions are always a failure — report a large sentinel rather
  // than crashing, so the run continues and the report shows every route.
  if (a.width !== b.width || a.height !== b.height) {
    return Math.max(a.width * a.height, b.width * b.height);
  }

  const out = new PNG({ width: a.width, height: a.height });
  const count = pixelmatch(a.data, b.data, out.data, a.width, a.height, {
    threshold: 0,
    includeAA: true,
  });

  if (count > 0) {
    mkdirSync(dirname(outPath), { recursive: true });
    writeFileSync(outPath, PNG.sync.write(out));
  }
  return count;
}
```

- [ ] **Step 2: Write `parity/assert-meta.ts`**

```ts
import type { PageMeta } from './capture';

/**
 * Deterministic serialisation with recursively sorted object keys, so two
 * structurally identical JSON-LD blocks compare equal regardless of key order.
 * Note: JSON.stringify's array second argument is a key *filter*, not a sorter —
 * using it here would silently drop nested keys (e.g. everything under @graph).
 */
function canon(v: unknown): string {
  const sort = (x: unknown): unknown => {
    if (Array.isArray(x)) return x.map(sort);
    if (x && typeof x === 'object') {
      return Object.fromEntries(
        Object.keys(x as Record<string, unknown>)
          .sort()
          .map((k) => [k, sort((x as Record<string, unknown>)[k])])
      );
    }
    return x;
  };
  return JSON.stringify(sort(v));
}

/** Returns one string per difference. Empty array means identical. */
export function diffMeta(base: PageMeta, cur: PageMeta): string[] {
  const problems: string[] = [];

  if (base.title !== cur.title) {
    problems.push(`title: baseline "${base.title}" vs current "${cur.title}"`);
  }

  const keys = new Set([...Object.keys(base.metas), ...Object.keys(cur.metas)]);
  for (const k of keys) {
    if (base.metas[k] !== cur.metas[k]) {
      problems.push(`meta[${k}]: baseline "${base.metas[k] ?? '(missing)'}" vs current "${cur.metas[k] ?? '(missing)'}"`);
    }
  }

  // Canonical is deliberately NOT compared for equality of count against the
  // baseline: the baseline may contain duplicates (see spec Finding 3). The
  // requirement is exactly one canonical in the current build, matching one of
  // the baseline's values.
  if (cur.canonical.length !== 1) {
    problems.push(`canonical: expected exactly 1, found ${cur.canonical.length} -> ${JSON.stringify(cur.canonical)}`);
  } else if (base.canonical.length && !base.canonical.includes(cur.canonical[0])) {
    problems.push(`canonical: "${cur.canonical[0]}" not among baseline ${JSON.stringify(base.canonical)}`);
  }

  const baseLd = base.jsonLd.map(canon).sort();
  const curLd = cur.jsonLd.map(canon).sort();
  if (baseLd.length !== curLd.length) {
    problems.push(`json-ld: baseline has ${baseLd.length} block(s), current has ${curLd.length}`);
  } else {
    baseLd.forEach((b, i) => {
      if (b !== curLd[i]) problems.push(`json-ld[${i}] differs:\n  baseline: ${b}\n  current:  ${curLd[i]}`);
    });
  }

  return problems;
}
```

- [ ] **Step 3: Write `parity/report.ts`**

```ts
import { mkdirSync, writeFileSync } from 'node:fs';
import { REPORT_DIR } from './config';

export interface RouteResult {
  route: string;
  viewport: string;
  pixels: number;
  stable: boolean;
  metaProblems: string[];
  consoleErrors: string[];
  baselinePng: string;
  currentPng: string;
  diffPng: string | null;
}

export function writeReport(results: RouteResult[]): { pass: boolean; failures: number } {
  const failed = results.filter(
    (r) => r.pixels !== 0 || !r.stable || r.metaProblems.length > 0 || r.consoleErrors.length > 0
  );

  const rows = results
    .map((r) => {
      const ok = r.pixels === 0 && r.stable && r.metaProblems.length === 0 && r.consoleErrors.length === 0;
      const imgs = r.diffPng
        ? `<div class="imgs"><img src="../../${r.baselinePng}"><img src="../../${r.currentPng}"><img src="../../${r.diffPng}"></div>`
        : '';
      const notes = [...r.metaProblems, ...r.consoleErrors]
        .map((p) => `<li><pre>${p.replace(/</g, '&lt;')}</pre></li>`)
        .join('');
      return `<tr class="${ok ? 'ok' : 'fail'}">
        <td>${r.route}</td><td>${r.viewport}</td><td>${r.pixels}</td>
        <td>${r.stable ? 'yes' : 'NO'}</td>
        <td>${ok ? 'PASS' : 'FAIL'}</td>
        <td><ul>${notes}</ul>${imgs}</td></tr>`;
    })
    .join('\n');

  mkdirSync(REPORT_DIR, { recursive: true });
  writeFileSync(
    `${REPORT_DIR}/index.html`,
    `<!doctype html><meta charset="utf-8"><title>Parity report</title>
<style>
 body{font:14px system-ui;margin:24px}
 table{border-collapse:collapse;width:100%}
 td,th{border:1px solid #ddd;padding:6px;vertical-align:top;text-align:left}
 tr.ok{background:#f3fbf4} tr.fail{background:#fdf3f3}
 .imgs img{max-width:300px;border:1px solid #ccc;margin-right:8px}
 pre{white-space:pre-wrap;margin:0}
</style>
<h1>Parity report</h1>
<p><strong>${results.length - failed.length}/${results.length}</strong> checks passed.</p>
<table><tr><th>Route</th><th>Viewport</th><th>Diff px</th><th>Stable</th><th>Status</th><th>Notes</th></tr>
${rows}</table>`
  );

  return { pass: failed.length === 0, failures: failed.length };
}
```

- [ ] **Step 4: Write `parity/run.ts`**

```ts
import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
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

    // An unstable capture is not a usable baseline. Fail loudly in capture mode too, rather
    // than silently writing a mid-animation frame that every later run diffs against.
    if (!stable) {
      console.error(`UNSTABLE  ${vp.name.padEnd(7)} ${route} - capture never settled`);
      unstableCount++;
    }

    if (vp.name === 'desktop') {
      mkdirSync(outDir, { recursive: true });
      writeFileSync(join(outDir, `${slug}.meta.json`), JSON.stringify(meta, null, 2));
    }

    if (mode === 'compare') {
      const basePng = join(BASELINE_DIR, vp.name, `${slug}.png`);
      const dPath = join(REPORT_DIR, 'diff', vp.name, `${slug}.png`);
      const pixels = existsSync(basePng) ? diffPng(basePng, png, dPath) : -1;

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
```

- [ ] **Step 5: Add scripts to `package.json`**

Add to the `"scripts"` object:

```json
"parity:capture": "tsx parity/run.ts capture",
"parity:compare": "tsx parity/run.ts compare",
"parity": "npm run parity:compare"
```

- [ ] **Step 6: Commit**

```bash
git add parity package.json
git commit -m "test(parity): add pixel diff, metadata assertions, HTML report and CLI"
```

---

## Task 4: CP0 — capture baseline and prove the harness reproduces itself

**This is the project's first gate. No migration work begins until it passes.**

**Files:**
- Create: `parity/baseline/**` (committed), `parity-exceptions.md`
- Modify: `.gitignore`

**Interfaces:**
- Consumes: everything from Tasks 1–3.
- Produces: a committed baseline of 129 PNGs (43 routes × 3 viewports) + 43 metadata JSON files, and a proven-deterministic harness.

- [ ] **Step 1: Ignore transient harness output**

Append to `.gitignore`:

```
parity/current/
parity/report/
parity/video/
```

- [ ] **Step 2: Build and serve the current Vite app**

```bash
npm run build
npx serve dist -l 3000 -s
```

Leave this running in a second terminal. The `-s` flag serves the SPA fallback, matching the production `vercel.json` rewrite.

- [ ] **Step 3: Capture the baseline**

Run: `npm run parity:capture -- http://localhost:3000`
Expected: 123 lines of `captured ...`, and `parity/baseline/{mobile,tablet,desktop}/` each containing 41 PNGs.

- [ ] **Step 4: Verify the baseline is complete**

```bash
node -e "
const fs=require('fs');
for (const v of ['mobile','tablet','desktop']) {
  const n=fs.readdirSync('parity/baseline/'+v).length;
  console.log(v, n, n===41?'OK':'MISSING');
}"
```

Expected: `mobile 41 OK`, `tablet 41 OK`, `desktop 41 OK`.

- [ ] **Step 5: Prove determinism — compare the harness against the unchanged build**

Run: `npm run parity:compare -- http://localhost:3000`
Expected: **`All parity checks passed.`** with every line reporting `(0px)`.

This is CP0. If any route reports non-zero pixels here, the harness is non-deterministic and **must be fixed before proceeding** — usually by adding a mask to `MASKS` in `parity/config.ts` for genuinely dynamic content, or by extending the settle wait. Re-capture and re-run until clean.

- [ ] **Step 6: Run it a second time to catch intermittent flake**

Run: `npm run parity:compare -- http://localhost:3000`
Expected: `All parity checks passed.` again. Two consecutive clean runs are required.

- [ ] **Step 7: Create the exceptions ledger**

Create `parity-exceptions.md`:

```markdown
# Parity exceptions

Every route that cannot reach a zero-pixel diff is recorded here with its cause,
a link to the diff image, and explicit sign-off. An empty list below means parity
is literally 100%.

## Pre-approved deviations

### Duplicate canonical tag removal (all blog routes)
**Cause:** The Vite build emits `<link rel="canonical">` twice on blog posts — once
from `CanonicalTag` in `src/main.tsx` and once from `BlogLayout.tsx`. `react-helmet-async`
deduplicates at runtime, so only one survives in the live DOM; server-rendering would
emit both into the raw HTML. This is a defect, not behaviour worth preserving.
**Resolution:** Canonical has exactly one source in Next — `metadata.alternates.canonical`.
**Visual impact:** None (canonical tags do not render).
**Signed off:** Approved in the design review, 2026-09-02.

## Discovered exceptions

_(none yet)_
```

- [ ] **Step 8: Commit the baseline**

```bash
git add -A parity parity-exceptions.md .gitignore
git commit -m "test(parity): capture 43-route baseline; CP0 green on two consecutive runs"
```

---

## Task 5: CP1 — Next foundation and the typography probe

**Files:**
- Create: `app/layout.tsx`, `app/globals.css` (re-export), `app/probe/page.tsx`, `next.config.js`, `next-env.d.ts`
- Modify: `package.json`, `tsconfig.json`, `postcss.config.js`, `tailwind.config.js`

**Interfaces:**
- Consumes: `src/index.css` (unchanged), `tailwind.config.js`.
- Produces: a bootable Next app at `localhost:3000` serving `/probe`; root layout with verbatim font links.

- [ ] **Step 0: Rename `src/pages/` to `src/views/` — do this BEFORE any `next build`**

Next.js auto-detects `src/pages/` as the **Pages Router** directory. There is no config flag
to disable that detection. With ~50 Vite page components sitting there, Next tries to compile
every one as a real Next page and fails during "Collecting page data" on
`src/components/Recaptcha.tsx`'s `import.meta.env` — Vite-only syntax Next cannot compile.
Finding `src/pages` also makes Next classify the project as src-based, so its typegen starts
resolving `app/` as `src/app/`.

Renaming is the fix, and `src/views/` is where the plan was moving these files anyway — doing
it wholesale up front is strictly simpler than per-route during Tasks 6-12.

```bash
git mv src/pages src/views
# main.tsx is the only file importing from './pages/'.
sed -i "s|'\./pages/|'./views/|g" src/main.tsx
# Repoint the route scanner at the new directory.
sed -i "s|'src', 'pages'|'src', 'views'|" scripts/sync-routes.js
sed -i "s|src/pages/\*\.tsx|src/views/*.tsx|" scripts/sync-routes.js
```

Sibling imports inside the directory (`'./BlogLayout'`) and upward imports
(`'../components/...'`) are unaffected by the rename. Verify the Vite build still works
before continuing — it is the reference build:

```bash
node scripts/sync-routes.js && npm run build
```

Expected: build succeeds. Note that `parity/routes.json` is already generated and committed,
so it needs no regeneration; only the scanner's path changes.

- [ ] **Step 1: Install Next**

```bash
npm install next@15 && npm uninstall lenis
```

`lenis` is removed per spec Finding 1 — it is never instantiated.

- [ ] **Step 2: Extend `tailwind.config.js` content globs**

Add `'./app/**/*.{js,ts,jsx,tsx}'` to the `content` array, keeping every existing entry. Change nothing else in this file.

- [ ] **Step 3: Write `app/layout.tsx`, reproducing `index.html`'s head verbatim**

```tsx
import type { Metadata } from 'next';
import '../src/index.css';
import Providers from './providers';

export const metadata: Metadata = {
  metadataBase: new URL('https://dros.ai'),
  title: 'AI Agents for Collections | DROS AI',
  description:
    'AI-native engagement OS for collections. Automate outreach, improve recovery rates, and manage first- and third-party collections with intelligent AI agents.',
  icons: { icon: '/DROS_symbol_1_(1).svg' },
  verification: { google: 'fW9HheaqVWqVxl5hb4v_W-QhSPVt1BYPUQJQ33qHQTw' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* Saans is self-hosted via @font-face in src/index.css. Preload the LCP weight,
            exactly as index.html does. Do NOT replace this with next/font — the
            @font-face carries a load-bearing ascent-override: 90%. */}
        <link
          rel="preload"
          href="/fonts/saans/saans-variable.woff2"
          as="font"
          type="font/woff2"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500&display=swap"
          rel="stylesheet"
          media="print"
          // eslint-disable-next-line react/no-unknown-property
          onLoad={undefined}
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Instrument+Serif:ital@1&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
          media="print"
          onLoad={undefined}
        />
        {/* The media="print" -> "all" swap must run without React, matching index.html. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.querySelectorAll('link[media="print"]').forEach(function(l){l.onload=function(){this.media='all'};});`,
          }}
        />
        <noscript>
          <link
            href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500&display=swap"
            rel="stylesheet"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Instrument+Serif:ital@1&family=Space+Grotesk:wght@400;500;600;700&display=swap"
            rel="stylesheet"
          />
        </noscript>
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Write `app/providers.tsx`**

```tsx
'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import ReactGA from 'react-ga4';

ReactGA.initialize('G-TT8WJVR53D');

export default function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const search = useSearchParams();

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  }, []);

  // Replaces ScrollToTop + Analytics from src/main.tsx.
  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0; // Safari fix
    const qs = search.toString();
    ReactGA.send({ hitType: 'pageview', page: pathname + (qs ? `?${qs}` : '') });
  }, [pathname, search]);

  return <>{children}</>;
}
```

- [ ] **Step 5: Write the typography probe body as a shared module**

This probe exists only to catch font-metric and token drift while it is cheap to fix; it
is deleted in Task 13. Both builds must render **the same markup**, so it lives in one
shared file that Vite and Next each import — never copied into two files, which would let
them drift and invalidate the comparison.

Create `src/probe/ProbeBody.tsx`:

```tsx
export default function ProbeBody() {
  const weights = [100, 200, 300, 400, 500, 600, 700, 800];
  return (
    <main className="bg-base text-ink p-10 space-y-8">
      <h1 className="font-saans text-6xl font-light tracking-[-0.03em]">Heading 1 — Saans light</h1>
      <h2 className="font-saans text-4xl font-normal tracking-[-0.03em]">Heading 2 — Saans normal</h2>
      <h3 className="font-saans text-2xl font-medium">Heading 3 — Saans medium</h3>
      <p className="text-base leading-relaxed max-w-[65ch]">
        The quick brown fox jumps over the lazy dog. 0123456789 — em dash, &ldquo;quotes&rdquo;, &amp; ampersand.
        This paragraph exists to expose ascent-override and line-height drift across builds.
      </p>
      <p className="font-mono text-sm">Geist Mono 0123456789 the quick brown fox</p>
      {weights.map((w) => (
        <p key={w} style={{ fontWeight: w }} className="font-saans text-3xl">
          Saans {w} — Hamburgefonstiv
        </p>
      ))}
      <div className="flex flex-wrap gap-4">
        <span className="rounded-full bg-black px-6 py-3 text-white">Primary surface</span>
        <span className="rounded-full border border-black/20 px-6 py-3">Bordered surface</span>
        <span className="rounded-lg bg-black/5 px-6 py-3">Muted surface</span>
      </div>
    </main>
  );
}
```

Then create `app/probe/page.tsx`, which only mounts it:

```tsx
import ProbeBody from '../../src/probe/ProbeBody';

export default function Page() {
  return <ProbeBody />;
}
```

- [ ] **Step 6: Mount the same shared body in the Vite app**

Create `src/pages/Probe.tsx` — it imports the identical module, so the two builds cannot
drift:

```tsx
export const route = '/probe';
import ProbeBody from '../probe/ProbeBody';

export default function Probe() {
  return <ProbeBody />;
}
```

Then run `node scripts/sync-routes.js` to register it.

- [ ] **Step 7: Capture the Vite probe baseline**

```bash
npm run build && npx serve dist -l 3000 -s
```

In another terminal:

```bash
npx tsx -e "
import { chromium } from '@playwright/test';
import { captureRoute } from './parity/capture';
import { VIEWPORTS, DEVICE_SCALE_FACTOR } from './parity/config';
const b = await chromium.launch();
const c = await b.newContext({ deviceScaleFactor: DEVICE_SCALE_FACTOR });
for (const vp of VIEWPORTS) {
  const p = await c.newPage();
  await captureRoute(p, 'http://localhost:3000', '/probe', vp, 'parity/baseline');
  await p.close();
}
await b.close();
"
```

- [ ] **Step 8: Run the Next dev server and diff the probe**

Stop the `serve` process. Then:

```bash
npx next build && npx next start -p 3000
```

In another terminal:

```bash
npx tsx -e "
import { chromium } from '@playwright/test';
import { captureRoute } from './parity/capture';
import { diffPng } from './parity/diff';
import { VIEWPORTS, DEVICE_SCALE_FACTOR } from './parity/config';
const b = await chromium.launch();
const c = await b.newContext({ deviceScaleFactor: DEVICE_SCALE_FACTOR });
for (const vp of VIEWPORTS) {
  const p = await c.newPage();
  const { png } = await captureRoute(p, 'http://localhost:3000', '/probe', vp, 'parity/current');
  const n = diffPng('parity/baseline/'+vp.name+'/probe.png', png, 'parity/report/diff/'+vp.name+'/probe.png');
  console.log(vp.name, n, n === 0 ? 'PASS' : 'FAIL');
  await p.close();
}
await b.close();
"
```

Expected: `mobile 0 PASS`, `tablet 0 PASS`, `desktop 0 PASS`.

**This is CP1.** Non-zero here means font metrics or Tailwind tokens differ. Inspect `parity/report/diff/desktop/probe.png` and fix before proceeding — do not migrate a single route while this is red.

- [ ] **Step 9: Commit**

```bash
git add app next.config.js next-env.d.ts package.json tsconfig.json tailwind.config.js src/pages/Probe.tsx parity/baseline
git commit -m "feat(next): add App Router foundation; CP1 typography probe at zero diff"
```

---

## Task 6: CP2 — pilot route (one blog post, end to end)

Migrating `/blogs/why-context-not-more-tools-is-the-future-of-debt-collection` (`src/pages/BlogPost.tsx`) proves the whole transform — metadata, JSON-LD, BlogLayout kit, Navbar/Footer — before it is repeated 42 times.

**Files:**
- Create: `app/blogs/why-context-not-more-tools-is-the-future-of-debt-collection/page.tsx`, `src/views/BlogPostContextView.tsx`
- Modify: `src/views/BlogLayout.tsx`, `src/views/Navbar.tsx`, `src/views/Footer.tsx`, `src/views/RelatedArticles.tsx`, `src/views/BlogShared.tsx`, `src/components/Reveal.tsx`, `src/components/PageFade.tsx`, `src/components/ui/*`

**Interfaces:**
- Consumes: `app/layout.tsx`, `app/providers.tsx` (Task 5).
- Produces: the repeatable **Port Recipe** below, applied verbatim in Tasks 7–11.

### The Port Recipe

Apply these seven transforms to every page. They are mechanical.

1. Add `'use client';` as the **first line** of any file using hooks, event handlers, framer-motion, or browser APIs.
2. `import { Link } from 'react-router-dom'` → `import Link from 'next/link'`; `<Link to={x}>` → `<Link href={x}>`.
3. `useLocation()` → `usePathname()` from `next/navigation`; `useSearchParams` from `react-router-dom` → the `next/navigation` version (note: returns a read-only `URLSearchParams`, and `setSearchParams` becomes `router.replace`); `useNavigate()` → `useRouter()` from `next/navigation` with `navigate(x)` → `router.push(x)`.
4. Delete the `export const route = '...'` line — App Router file location replaces it.
5. The file already lives in `src/views/` — Task 5, Step 0 renamed the directory wholesale to stop Next treating `src/pages/` as a Pages Router. Nothing to move; just edit it in place. Rename the file only where the plan names a specific new filename (for example the pilot's `BlogPostContextView.tsx`).
6. Delete the `<Helmet>` block and every tag inside it. Translate it into a `metadata` export in the new `app/**/page.tsx`.
7. `<script type="application/ld+json">` blocks stay in the component (they render fine server-side), **except** `<link rel="canonical">`, which is deleted and replaced by `metadata.alternates.canonical`.

- [ ] **Step 1: Add `'use client'` to the shared component layer**

Add `'use client';` as the first line of each of these, which all use hooks, framer-motion, or events:

```bash
for f in src/views/BlogLayout.tsx src/views/Navbar.tsx src/views/Footer.tsx \
         src/views/RelatedArticles.tsx src/views/BlogShared.tsx \
         src/components/Reveal.tsx src/components/PageFade.tsx; do
  grep -q "^'use client'" "$f" || sed -i "1i 'use client';" "$f"
done
grep -L "^'use client'" src/components/ui/*.tsx | xargs -r sed -i "1i 'use client';"
```

- [ ] **Step 2: Remove the canonical tag from `BlogLayout.tsx`**

Delete line 114 — `{canonicalPath && <link rel="canonical" href={postUrl} />}`. Keep the `canonicalPath` prop and every other use of it (`postUrl` still feeds the JSON-LD, and `RelatedArticles` still receives it).

- [ ] **Step 3: Port the page body**

```bash
git mv src/views/BlogPost.tsx src/views/BlogPostContextView.tsx
```

Then edit `src/views/BlogPostContextView.tsx`:
- Line 1 becomes `'use client';`
- Delete the `export const route = ...` and `export const tags = ...` lines, moving `tags` to a plain `const tags = [...]` (the page file does not need it).
- Delete the `import { Helmet } from 'react-helmet-async';` line and the entire `<Helmet>…</Helmet>` block, along with the now-redundant `<>…</>` wrapper.
- Rename the default export to `BlogPostContextView`.
- Change `import BlogLayout, { P, H2, Ul, CalloutPill } from './BlogLayout';` to `from '../views/BlogLayout'`.

- [ ] **Step 4: Create the route's server component**

`app/blogs/why-context-not-more-tools-is-the-future-of-debt-collection/page.tsx`:

```tsx
import type { Metadata } from 'next';
import BlogPostContextView from '../../../src/views/BlogPostContextView';

const title = 'Why Debt Collection Needs Fewer Systems (Context Orchestration)';
const description =
  'Too many tools slow collections teams down. Learn how context orchestration reduces system sprawl, improves visibility, and simplifies recovery workflows.';
const path = '/blogs/why-context-not-more-tools-is-the-future-of-debt-collection';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: {
    title,
    description,
    url: path,
    type: 'website',
    images: ['https://dros.ai/dros-logo-horizontal.svg'],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['https://dros.ai/dros-logo-horizontal.svg'],
  },
};

export default function Page() {
  return <BlogPostContextView />;
}
```

- [ ] **Step 5: Verify it builds**

Run: `npx next build`
Expected: build succeeds, and the route appears in the output as a static (`○`) page. If it is listed as dynamic (`ƒ`), a server component is reading request data — find and fix it, because dynamic rendering defeats the purpose of the migration.

- [ ] **Step 6: Diff the pilot route**

```bash
npx next start -p 3000
```

In another terminal:

```bash
npx tsx -e "
import { chromium } from '@playwright/test';
import { captureRoute, extractMeta } from './parity/capture';
import { diffPng } from './parity/diff';
import { diffMeta } from './parity/assert-meta';
import { VIEWPORTS, DEVICE_SCALE_FACTOR, slugFor } from './parity/config';
import { readFileSync } from 'node:fs';
const route='/blogs/why-context-not-more-tools-is-the-future-of-debt-collection';
const slug=slugFor(route);
const b=await chromium.launch();
const c=await b.newContext({deviceScaleFactor:DEVICE_SCALE_FACTOR});
for (const vp of VIEWPORTS) {
  const p=await c.newPage();
  const {png,consoleErrors}=await captureRoute(p,'http://localhost:3000',route,vp,'parity/current');
  const n=diffPng('parity/baseline/'+vp.name+'/'+slug+'.png',png,'parity/report/diff/'+vp.name+'/'+slug+'.png');
  console.log(vp.name,n,consoleErrors);
  if(vp.name==='desktop'){
    const meta=await extractMeta(p);
    console.log(diffMeta(JSON.parse(readFileSync('parity/baseline/'+slug+'.meta.json','utf8')),meta));
  }
  await p.close();
}
await b.close();
"
```

Expected: `0` differing pixels at all three viewports, an empty console-errors array, and an empty metadata-problems array.

- [ ] **Step 7: Verify the objective — server-rendered content**

```bash
curl -s http://localhost:3000/blogs/why-context-not-more-tools-is-the-future-of-debt-collection > /tmp/pilot.html
grep -c "Why Debt Collection Needs Fewer Systems" /tmp/pilot.html
grep -c "application/ld+json" /tmp/pilot.html
grep -c 'rel="canonical"' /tmp/pilot.html
grep -c "context orchestration layer" /tmp/pilot.html
```

Expected: each count `>= 1`, and the canonical count is **exactly 1**. The last grep proves body copy — not just metadata — is in the raw HTML.

**This is CP2.** Do not proceed until all of Steps 6 and 7 pass.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat(next): migrate pilot blog route; CP2 green at zero diff with SSR content verified"
```

---

## Task 7: CP3 — shared chrome verified across three page shapes

**Files:**
- Modify: `src/views/` (three additional page ports), `app/` (three new route files)

**Interfaces:**
- Consumes: the Port Recipe (Task 6).
- Produces: confidence that Navbar, Footer, `Reveal`, `PageFade` and the `ui` primitives are correct before bulk migration.

- [ ] **Step 1: Port three structurally different routes using the Port Recipe**

Apply Task 6's seven-step recipe to:
- `/trust-center` (`TrustCenter.tsx` → `src/views/TrustCenter.tsx`, `app/trust-center/page.tsx`)
- `/customer-stories` (`CustomerStoriesPage.tsx` → `app/customer-stories/page.tsx`)
- `/newsroom` (`NewsroomPage.tsx` → `app/newsroom/page.tsx`)

For each, copy the `<Helmet>` values into a `metadata` export in the same shape as Task 6 Step 4, with `alternates: { canonical: '<the route>' }`.

- [ ] **Step 2: Build**

Run: `npx next build`
Expected: success, all three routes marked static (`○`).

- [ ] **Step 3: Diff all three, all viewports**

With `npx next start -p 3000` running, use the Task 6 Step 6 snippet with `route` changed to each of the three paths in turn.
Expected: `0` at every viewport, empty console errors, empty metadata problems.

- [ ] **Step 4: Assert no hydration mismatches**

```bash
npx tsx -e "
import { chromium } from '@playwright/test';
const b=await chromium.launch();const p=await (await b.newContext()).newPage();
const bad=[];
p.on('console',m=>{const t=m.text();if(/hydrat|did not match|Text content does not match/i.test(t))bad.push(t);});
for (const r of ['/trust-center','/customer-stories','/newsroom']) {
  await p.goto('http://localhost:3000'+r,{waitUntil:'networkidle'});
}
await b.close();
console.log(bad.length===0?'PASS no hydration warnings':'FAIL '+JSON.stringify(bad,null,2));
if(bad.length)process.exit(1);
"
```

Expected: `PASS no hydration warnings`.

- [ ] **Step 5: Assert no hydration flash (spec §5.3)**

framer-motion components with `initial={{ opacity: 0 }}` now server-render in their
*initial* (invisible) state. If hydration is slow, a real visitor — and an image-capturing
crawler — sees a blank page. This check screenshots with JavaScript disabled, which is
the worst case, and requires visible content.

```bash
npx tsx -e "
import { chromium } from '@playwright/test';
const b=await chromium.launch();
const c=await b.newContext({ javaScriptEnabled: false });
let fail=0;
for (const r of ['/trust-center','/customer-stories','/newsroom','/blogs/why-context-not-more-tools-is-the-future-of-debt-collection']) {
  const p=await c.newPage();
  await p.goto('http://localhost:3000'+r,{waitUntil:'domcontentloaded'});
  // Ratio of rendered pixels that are not the page background.
  const visible = await p.evaluate(() => {
    const els=[...document.querySelectorAll('h1,h2,h3,p,li')];
    const shown=els.filter(e=>{
      const s=getComputedStyle(e);
      return s.opacity!=='0' && s.visibility!=='hidden' && s.display!=='none' && e.textContent.trim();
    });
    return { total: els.length, shown: shown.length };
  });
  const ok = visible.total>0 && visible.shown/visible.total > 0.9;
  console.log((ok?'PASS':'FAIL')+'  '+r+'  '+visible.shown+'/'+visible.total+' text elements visible pre-hydration');
  if(!ok) fail++;
  await p.close();
}
await b.close();
if(fail)process.exit(1);
"
```

Expected: `PASS` on all four, with >90% of text elements visible. A `FAIL` means a
`motion.*` wrapper is hiding server-rendered content — fix it by giving that component a
non-zero `initial` opacity or by animating a child rather than the content container.

**This is CP3.**

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(next): migrate shared-chrome validation routes; CP3 green"
```

---

## Tasks 8–12: CP4 — route waves

Each wave applies the **Port Recipe** from Task 6 to its routes, then gates on the same four checks. **A wave does not start until the previous wave is green.**

For every wave, the steps are identical:

- [ ] **Step 1:** Apply the Port Recipe to each route in the wave.
- [ ] **Step 2:** Run `npx next build`. Expected: success, every new route static (`○`).
- [ ] **Step 3:** Run `npx next start -p 3000`, then `npm run parity:compare -- http://localhost:3000`. Expected: every already-migrated route reports `(0px)` with no metadata or console problems. (Not-yet-migrated routes will 404 and fail; that is expected until Task 12.)
- [ ] **Step 4:** Run the hydration check from Task 7 Step 4 with this wave's routes.
- [ ] **Step 5:** Commit with `feat(next): migrate <wave name> routes`.

### Task 8 — Wave 1: blog listing + remaining posts (14 routes)

`/blog/reg-f-call-limits-ai-debt-collection` *(note the singular `/blog/` — create `app/blog/reg-f-call-limits-ai-debt-collection/page.tsx`, not `app/blogs/...`)*, `/blogs`, `/blogs/ai-agents-debt-collection-deployment`, `/blogs/ai-collections-operating-layer`, `/blogs/ai-readiness-checklist-collection-agencies`, `/blogs/ai-voice-agents-debt-disputes-compliance`, `/blogs/ai-voice-agents-dnc-disputes-compliance-2026`, `/blogs/collections-integrations-legacy-systems`, `/blogs/digital-first-collections-small-agencies-2026`, `/blogs/human-in-the-loop-collections`, `/blogs/integrate-ai-agents-collections-compliance`, `/blogs/omnichannel-ai-debt-collection`, `/blogs/right-party-contact-rpc-learnings-from-the-field`, `/blogs/what-we-learned-aca-2026`

**Extra step for `/blogs`:** `BlogsPage.tsx` uses `useSearchParams` for category filtering. `next/navigation`'s version is read-only, so replace `setSearchParams(next)` with `router.replace('/blogs?' + next.toString(), { scroll: false })` using `useRouter()`. A component reading `useSearchParams()` must sit inside a `<Suspense>` boundary or the build will fail — wrap the view in the page file:

```tsx
import { Suspense } from 'react';

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-base" />}>
      <BlogsPageView />
    </Suspense>
  );
}
```

The fallback markup deliberately matches the old `main.tsx` Suspense fallback.

### Task 9 — Wave 2: industry and feature pages (7 routes)

`/collections/consumer-lending`, `/collections/credit-unions`, `/collections/debt-buyer`, `/collections/first-party`, `/collections/third-party`, `/features/context-aware-voice-ai-agents-for-debt-collection`, `/use-cases/ai-voice-agent-payment-reminders`

### Task 10 — Wave 3: events (5 routes)

`/events`, `/events/2026/aca-orlando`, `/events/2026/armtech-dallas`, `/events/2026/rmai-las-vegas`, `/events/armtech-rmai-2026`

### Task 11 — Wave 4: resources, forms and redirects (11 routes)

`/about`, `/aca`, `/adoption-gap-report-state-of-collections-2026`, `/book-meeting`, `/collections-ai-workshop`, `/contact`, `/customer-stories/greystone-associates`, `/resources/videos`, `/webinars`, plus the two redirects.

**Redirects are config, not pages.** Both current components do a client-side
`window.location.href` assignment, which is a soft, JS-dependent redirect. Replace both
with real 307s in `next.config.js`:

```js
module.exports = {
  async redirects() {
    return [
      { source: '/api-docs', destination: 'https://app.dros.ai/api-docs', permanent: false },
      { source: '/release-notes', destination: 'https://app.dros.ai/release-notes', permanent: false },
    ];
  },
};
```

`permanent: false` (307) matches today's behaviour, which asserts nothing permanent.

Delete both `.tsx` files. They are already absent from `parity/routes.json` (removed in Task 1,
Step 2b) and already recorded in `parity-exceptions.md`, so no manifest change is needed here.

Instead, verify the redirects actually work, since these two URLs are the only ones in the
project not covered by a screenshot diff:

```bash
curl -s -o /dev/null -w '%{http_code} %{redirect_url}\n' http://localhost:3000/api-docs
curl -s -o /dev/null -w '%{http_code} %{redirect_url}\n' http://localhost:3000/release-notes
```

Expected: `307 https://app.dros.ai/api-docs` and `307 https://app.dros.ai/release-notes`.

**Extra step:** `/contact` and `/book-meeting` carry the reCAPTCHA and HubSpot integrations. Rename `VITE_RECAPTCHA_SITE_KEY` to `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` in `src/components/Recaptcha.tsx` (`import.meta.env.VITE_RECAPTCHA_SITE_KEY` → `process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY`), add it to `.env.local`, and add it to the Vercel project's environment variables before CP7.

### Task 12 — Wave 5: home and pricing (2 routes)

`/` and `/pricing`. Migrated last by design: the most complex and most visible pages, ported only once every shared primitive has been proven.

**Extra step for `/`:** `App.tsx` reads `(location.state as { scrollTo?: string })` from react-router to scroll to a section after cross-page navigation. Next has no router state. Replace with a query parameter: the source links in `Navbar.tsx` become `/?scrollTo=<id>`, and `App` reads `useSearchParams().get('scrollTo')`. Keep the existing retry-with-timeout logic and the `navHeight = 80` offset exactly as they are, and drop the now-dead `window.__lenis` branch (Finding 1). Wrap the view in `<Suspense>` as in Task 8.

---

## Task 13: CP5 + CP6 — full suite and server-render assertions

**Files:**
- Create: `parity/assert-ssr.ts`
- Modify: `parity-exceptions.md`
- Delete: `app/probe/page.tsx`, `src/pages/Probe.tsx`, `parity/baseline/*/probe.png`

**Interfaces:**
- Consumes: the completed migration.
- Produces: `assertSsr(baseUrl: string): Promise<number>` — returns the count of failing routes.

- [ ] **Step 1: Remove the probe**

```bash
rm -rf app/probe src/pages/Probe.tsx src/probe parity/baseline/*/probe.png
rm -f parity/baseline/probe.meta.json
```

- [ ] **Step 2: Run the full suite**

With `npx next build && npx next start -p 3000` running:

Run: `npm run parity:compare -- http://localhost:3000`
Expected: **`All parity checks passed.`** — 41 routes × 3 viewports (123 checks), every one `(0px)`.

**This is CP5.** Any failure is either fixed or, if genuinely unavoidable, recorded in `parity-exceptions.md` with the diff image and explicit sign-off. Never raise `PIXEL_TOLERANCE`.

- [ ] **Step 3: Write `parity/assert-ssr.ts`**

This is the check the whole migration exists to pass: raw HTML, no JavaScript.

```ts
import { ROUTES } from './config';

/** Fetches each route's raw HTML and asserts real content is present without JS. */
export async function assertSsr(baseUrl: string): Promise<number> {
  let failures = 0;

  for (const route of ROUTES) {
    const res = await fetch(`${baseUrl}${route}`);
    const html = await res.text();
    const problems: string[] = [];

    const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '';
    if (!title) problems.push('no <title>');
    if (route !== '/' && title === 'AI Agents for Collections | DROS AI') {
      problems.push('title is the generic root fallback — page metadata did not render');
    }

    if (!/<meta name="description" content="[^"]+"/.test(html)) problems.push('no meta description');

    const canonicals = html.match(/rel="canonical"/g)?.length ?? 0;
    if (canonicals !== 1) problems.push(`expected exactly 1 canonical, found ${canonicals}`);

    // Strip all script/style, then require real body text. This is what an AI
    // crawler that does not execute JS actually sees.
    const text = html
      .replace(/<script[\s\S]*?<\/script>/g, '')
      .replace(/<style[\s\S]*?<\/style>/g, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (text.length < 500) problems.push(`only ${text.length} chars of body text in raw HTML`);

    if (route.includes('/blog')) {
      if (!/"@type"\s*:\s*"(Article|BlogPosting)"/.test(html)) problems.push('no Article JSON-LD');
    }

    if (problems.length) {
      failures++;
      console.error(`FAIL ${route}\n  - ${problems.join('\n  - ')}`);
    } else {
      console.log(`PASS ${route} (${text.length} chars)`);
    }
  }
  return failures;
}

const failures = await assertSsr(process.argv[2] ?? 'http://localhost:3000');
console.log(`\n${ROUTES.length - failures}/${ROUTES.length} routes server-render correctly.`);
if (failures) process.exit(1);
```

- [ ] **Step 4: Add the script and run it**

Add to `package.json` scripts: `"parity:ssr": "tsx parity/assert-ssr.ts"`

Run: `npm run parity:ssr -- http://localhost:3000`
Expected: `41/41 routes server-render correctly.`

**This is CP6 — the project's actual objective.** Before the migration this check would fail on all 41 routes.

- [ ] **Step 5: Verify sitemap and robots match the old output**

Create `app/sitemap.ts` and `app/robots.ts` reading from `parity/routes.json`, reproducing the exact `changefreq` and `priority` maps from `vite.config.ts` (copy both objects verbatim). Then:

```bash
curl -s http://localhost:3000/sitemap.xml | grep -c "<loc>"
```

Expected: `41`. Compare the URL set against `dist/sitemap.xml` from the Vite build and confirm only `/api-docs` and `/release-notes` are absent.

- [ ] **Step 6: Motion and scroll review (spec §5.3)**

Screenshots are captured with motion frozen, so they prove nothing about animation.
Record video of six representative routes on both builds and review side by side.

```bash
npx tsx -e "
import { chromium } from '@playwright/test';
const ROUTES=['/','/pricing','/blogs','/about','/collections/first-party','/events'];
const target=process.argv[1];          // 'vite' or 'next'
const b=await chromium.launch();
for (const r of ROUTES) {
  const c=await b.newContext({ recordVideo:{ dir:'parity/video/'+target, size:{width:1440,height:900} } });
  const p=await c.newPage();
  await p.goto('http://localhost:3000'+r,{waitUntil:'networkidle'});
  await p.evaluate(async()=>{ const s=window.innerHeight;
    for(let y=0;y<document.body.scrollHeight;y+=s){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,400));} });
  await p.close(); await c.close();
  console.log('recorded '+target+' '+r);
}
await b.close();
" next
```

Run once against the served Vite `dist` build with the trailing argument `vite`, once
against `next start` with `next`, then watch each pair. Confirm reveal-on-scroll timing,
nav show/hide behaviour, and hover states match. Differences are judged by eye and any
accepted difference is logged in `parity-exceptions.md`.

- [ ] **Step 7: Interactive checklist (manual, recorded in the PR)**

Verify by hand and tick each: reCAPTCHA renders on `/contact`; the HubSpot form submits and returns success; the demo-call trigger on the homepage widget fires; desktop nav and mobile menu open, close and navigate; `/blogs` category filter and search update results and the URL; `RelatedArticles` links resolve; browser back/forward restores the right page at the top.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "test(parity): CP5 full suite green; CP6 server-render assertions passing on all 41 routes"
```

---

## Task 14: CP7 — cleanup and cutover

**Files:**
- Delete: `src/main.tsx`, `vite.config.ts`, `index.html`, `vercel.json`, `scripts/sync-routes.js`, `src/pages/` (all remaining), `eslint.config.js` Vite rules
- Modify: `package.json`, `README.md`, `.gitignore`

- [ ] **Step 1: Remove the Vite build system**

```bash
git rm -r --cached src/main.tsx vite.config.ts index.html vercel.json scripts/sync-routes.js
rm -f src/main.tsx vite.config.ts index.html vercel.json scripts/sync-routes.js
npm uninstall vite @vitejs/plugin-react vite-plugin-sitemap react-helmet-async react-router-dom
```

- [ ] **Step 2: Move remaining shared components out of `src/pages/`**

`BlogLayout.tsx`, `Navbar.tsx`, `Footer.tsx`, `BlogShared.tsx`, `RelatedArticles.tsx` and `VideoModal.tsx` are components, not pages. `git mv` them from `src/views/` to `src/components/` and update every import. `src/views/` should then contain only ported page bodies.

- [ ] **Step 3: Replace the `scripts` block in `package.json`**

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint .",
  "typecheck": "tsc --noEmit",
  "parity:capture": "tsx parity/run.ts capture",
  "parity:compare": "tsx parity/run.ts compare",
  "parity": "npm run parity:compare",
  "parity:ssr": "tsx parity/assert-ssr.ts"
}
```

The `postinstall` hook running `sync-routes.js` is removed.

- [ ] **Step 4: Verify a clean install still builds**

```bash
rm -rf node_modules && npm ci && npm run build && npm run typecheck && npm run lint
```

Expected: all four succeed. A stale `node_modules` can hide a missing dependency, so the `rm -rf` matters.

- [ ] **Step 5: Re-run the full suite against the production build**

```bash
npx next start -p 3000
npm run parity && npm run parity:ssr -- http://localhost:3000
```

Expected: `All parity checks passed.` and `41/41 routes server-render correctly.`

- [ ] **Step 6: Push and open the PR**

```bash
git add -A
git commit -m "chore(next): remove Vite build system and complete migration"
git push -u origin next-migration
```

Open a PR summarising: routes migrated, the parity report, the CP6 result, and the contents of `parity-exceptions.md`.

- [ ] **Step 7: Verify against the deployed Vercel preview**

Confirm `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` is set in the Vercel project, then:

```bash
npm run parity:compare -- https://<preview-deployment-url>
npm run parity:ssr -- https://<preview-deployment-url>
```

Expected: both clean. **This step catches build-vs-dev differences and must not be skipped** — it is the only check run against the artifact that will actually serve traffic.

- [ ] **Step 8: Promote and hold rollback**

Merge to `main` and promote the deployment. Keep the last Vite deployment one click from promotion in the Vercel dashboard for **one week**. During that week, spot-check Google Search Console for coverage or canonical errors, and confirm `sitemap.xml` is being re-crawled.

---

## Post-migration

With CP6 passing, Project B (Airtable-native AI → MDX → GitHub PR) becomes tractable: MDX renders natively in App Router, new posts are static by default, and the `parity` harness can be pointed at each generated post before it merges.
