/**
 * Generate src/styles/blog-content.css from the live pages.
 *
 * The CMS now stores semantic HTML, so the presentation has to live in code. Writing
 * that stylesheet by hand would mean translating Tailwind utilities back into CSS from
 * memory, which is exactly the sort of guesswork that produces "nearly right" spacing.
 * Instead this reads the COMPUTED styles off the real rendered post - the browser has
 * already done the translation - and emits them against the semantic selectors.
 *
 * Values are sampled at the three parity viewports, so responsive steps become real
 * media queries rather than approximations.
 *
 * Usage:  node scripts/blog-css-generate.mjs [baseUrl] [outFile]
 */
import { chromium } from '@playwright/test';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const BASE_URL = process.argv[2] ?? 'http://localhost:3000';
const OUT = process.argv[3] ?? 'src/styles/blog-content.css';
// No single post contains every block type, so probe several and take the first
// page where each selector actually appears.
const SAMPLES = [
  '/blogs/collections-integrations-legacy-systems',
  '/blogs/ai-agents-debt-collection-deployment',
  '/blogs/human-in-the-loop-collections',
  '/blogs/omnichannel-ai-debt-collection',
  '/blogs/right-party-contact-rpc-learnings-from-the-field',
];

// Sample AT Tailwind's breakpoints, not near them. Measuring at 768 and emitting the
// result at 640 would apply the md: styles across 640-767px, where they do not belong.
const VIEWPORTS = [
  { name: 'base', width: 375, height: 812 },
  { name: 'sm', width: 640, height: 900 },
  { name: 'md', width: 768, height: 1024 },
  { name: 'lg', width: 1024, height: 900 },
  { name: 'xl', width: 1280, height: 900 },
];
const BREAKPOINTS = { sm: 640, md: 768, lg: 1024, xl: 1280 };
const ORDER = ['base', 'sm', 'md', 'lg', 'xl'];

/** semantic selector  <-  the element to measure on the live page */
const TARGETS = [
  ['.blog-content p', 'article p.text-black\\/80'],
  ['.blog-content h2', 'article h2'],
  ['.blog-content h3', 'article h3'],
  ['.blog-content ul', 'article ul.space-y-3'],
  ['.blog-content li', 'article ul.space-y-3 > li'],
  ['.blog-content a', 'article a[href]'],
  ['.blog-content strong', 'article strong'],
  ['.blog-content [data-block="card"]', 'article div.bg-\\[\\#FAFAFA\\]'],
  ['.blog-content [data-block="callout"]', 'article div.border-l-4'],
  ['.blog-content [data-block="quote"]', 'article blockquote'],
  ['.blog-content [data-block="pills"] li', 'article span.rounded-full'],
  ['.blog-content table', 'article table'],
  ['.blog-content th', 'article th'],
  ['.blog-content td', 'article td'],
];

const PROPS = [
  'font-family', 'font-size', 'line-height', 'font-weight', 'letter-spacing',
  'color', 'background-color', 'text-align',
  'margin-top', 'margin-bottom', 'margin-left', 'margin-right',
  'padding-top', 'padding-bottom', 'padding-left', 'padding-right',
  'border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width',
  'border-color', 'border-style', 'border-radius',
];

// Values equal to these are the browser default and only add noise.
const NOISE = new Set(['0px', 'normal', 'rgba(0, 0, 0, 0)', 'none', 'start', '400']);

const browser = await chromium.launch();
const context = await browser.newContext();
const page = await context.newPage();

const sampled = {};
const sourceOf = {};
for (const vp of VIEWPORTS) {
  sampled[vp.name] = {};
  await page.setViewportSize({ width: vp.width, height: vp.height });

  for (const sample of SAMPLES) {
    const stillNeeded = TARGETS.filter(([sel]) => !sampled[vp.name][sel]);
    if (!stillNeeded.length) break;

    await page.goto(`${BASE_URL}${sample}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);

    const found = await page.evaluate(
      ({ targets, props }) => {
        const out = {};
        for (const [selector, probe] of targets) {
          const el = document.querySelector(probe);
          if (!el) continue;
          const cs = getComputedStyle(el);
          const decl = {};
          for (const p of props) decl[p] = cs.getPropertyValue(p);
          out[selector] = decl;
        }
        return out;
      },
      { targets: stillNeeded, props: PROPS }
    );

    for (const [sel, decl] of Object.entries(found)) {
      sampled[vp.name][sel] = decl;
      if (vp.name === 'base') sourceOf[sel] = sample;
    }
  }
}

await browser.close();

const missing = TARGETS.filter(([sel]) => !sampled.base[sel]).map(([sel]) => sel);

/** Only emit what differs from the previous breakpoint. */
function diff(now, prev) {
  const out = {};
  // Tailwind's preflight sets a border colour and style on every element while leaving
  // the width at 0. Emitting those would be transcribing a no-op as if it were design.
  if (now) {
    const widths = ['border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width'];
    if (widths.every((w) => !now[w] || now[w] === '0px')) {
      now = { ...now };
      delete now['border-color'];
      delete now['border-style'];
      delete now['border-radius'];
    }
  }
  for (const [k, v] of Object.entries(now ?? {})) {
    if (!v || NOISE.has(v)) continue;
    if (prev && prev[k] === v) continue;
    out[k] = v;
  }
  return out;
}

function block(selector, decls) {
  const entries = Object.entries(decls);
  if (!entries.length) return '';
  return `${selector} {\n${entries.map(([k, v]) => `  ${k}: ${v};`).join('\n')}\n}\n\n`;
}

let css = `/*
 * Blog content styling.
 *
 * GENERATED by scripts/blog-css-generate.mjs - do not hand-edit; re-run it instead.
 *
 * Blog bodies are stored in the CMS as semantic HTML with no classes, so their
 * presentation lives here rather than travelling with the content. That way the blog
 * can be restyled without rewriting a single record, and the stored content stays
 * usable outside this site.
 *
 * Values are the browser's own computed styles from the rendered post, sampled at the
 * three parity viewports, so this is a transcription of the real design rather than a
 * from-memory reconstruction of the Tailwind utilities it replaces.
 *
 * Sampled from: ${[...new Set(Object.values(sourceOf))].join(', ')}
 * Generated:   ${new Date().toISOString()}
 */

.blog-content {
  /* Children own their own spacing; this is just the flow container. */
  display: block;
}

`;

for (const [selector] of TARGETS) {
  css += block(selector, diff(sampled.base[selector], null));
}

for (let i = 1; i < ORDER.length; i++) {
  const vp = ORDER[i];
  const width = BREAKPOINTS[vp];
  let inner = '';
  for (const [selector] of TARGETS) {
    inner += block(`  ${selector}`, diff(sampled[vp][selector], sampled[ORDER[i - 1]][selector]))
      .split('\n')
      .map((l) => (l ? `  ${l}` : l))
      .join('\n');
  }
  if (inner.trim()) css += `@media (min-width: ${width}px) {\n\n${inner}}\n\n`;
}

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, css);
console.log(`wrote ${OUT} (${css.length} bytes)`);
console.log(`styled ${TARGETS.length - missing.length}/${TARGETS.length} selectors`);
if (missing.length) {
  console.warn('\nNo sample element found for these - they are unstyled:');
  for (const m of missing) console.warn(`   ${m}`);
}
