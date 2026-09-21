/**
 * Compare the two renderings element by element to find where the height goes.
 *
 * A pixel count says the CMS page is 404px short; it does not say which blocks lost
 * their spacing. This walks the <article> children of both pages side by side and
 * reports the first divergence in tag, height, or margins - which is nearly always the
 * missing CSS rule.
 */
import { chromium } from '@playwright/test';

const BASE = process.argv[2] ?? 'http://localhost:3000';
const SLUG = process.argv[3] ?? '/blogs/why-context-not-more-tools-is-the-future-of-debt-collection';
const LEAF = SLUG.split('/').filter(Boolean).slice(-1)[0];
const WIDTH = Number(process.argv[4] ?? 1440);

const probe = async (page, url) => {
  await page.setViewportSize({ width: WIDTH, height: 900 });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  return page.evaluate(() => {
    const article = document.querySelector('article');
    return Array.from(article.children).map((el) => {
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return {
        tag: el.tagName,
        block: el.getAttribute('data-block') ?? '',
        h: Math.round(r.height),
        mt: cs.marginTop,
        mb: cs.marginBottom,
        pt: cs.paddingTop,
        fs: cs.fontSize,
        text: (el.textContent ?? '').replace(/\s+/g, ' ').trim().slice(0, 34),
      };
    });
  });
};

const browser = await chromium.launch();
const ctx = await browser.newContext();
const a = await ctx.newPage();
const b = await ctx.newPage();

const react = await probe(a, `${BASE}${SLUG}`);
const cms = await probe(b, `${BASE}/cms-preview/${LEAF}`);
await browser.close();

console.log(`react children: ${react.length}   cms children: ${cms.length}   (width ${WIDTH})\n`);

const rows = Math.max(react.length, cms.length);
let drift = 0;
for (let i = 0; i < rows; i++) {
  const r = react[i];
  const c = cms[i];
  const fmt = (x) =>
    x ? `${x.tag}${x.block ? `[${x.block}]` : ''} h=${String(x.h).padStart(4)} mt=${x.mt} mb=${x.mb} fs=${x.fs}` : '(none)';
  const dh = r && c ? c.h - r.h : 0;
  const same = r && c && r.tag === c.tag && r.h === c.h && r.mt === c.mt && r.mb === c.mb;
  if (!same) drift += dh;
  console.log(
    `${same ? '   ' : '>> '}${String(i).padStart(3)}  ${fmt(r).padEnd(62)} | ${fmt(c).padEnd(62)} ${dh ? `Δ${dh}` : ''}`
  );
  if (!same && r && c && r.text !== c.text) {
    console.log(`      react text: "${r.text}"`);
    console.log(`      cms   text: "${c.text}"`);
  }
}
console.log(`\ncumulative height drift on mismatched rows: ${drift}px`);
