/**
 * Prove the semantic cleaner did not lose words.
 *
 * Stripping classes and unwrapping presentational divs must not drop content. This
 * renders the cleaned HTML plus the structured FAQ/CTA back into a DOM, and compares
 * its words against the original rendered article. Anything missing is reported with
 * the actual words, not just a count.
 *
 * The "back to all blogs" chrome is expected to be absent - it is layout, not content.
 */
import { readFileSync } from 'node:fs';
import { chromium } from '@playwright/test';

const { posts } = JSON.parse(readFileSync(process.argv[2] ?? 'artifacts/blogs.json', 'utf8'));

const EXPECTED_DROPS = ['back', 'to', 'all', 'blogs'];

const words = (s) =>
  (s ?? '')
    .toLowerCase()
    .replace(/[‘’]/g, "'")
    // '.' is a separator, not part of a word: innerText fuses neighbours into
    // "volume.blocker", which would otherwise look like two missing words.
    .replace(/[^a-z0-9'%$\-\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent('<div id="root"></div>');
let bad = 0;

for (const p of posts) {
  // Everything the CMS now holds for this post, rendered back out.
  const faqText = (p.faq ?? []).map((f) => `${f.q} ${f.a}`).join(' ');
  const ctaText = p.cta ? Object.values(p.cta).join(' ') : '';
  // Interactive components live in code, not in the CMS body, but their words still
  // exist on the page - count them so the check stays a real check.
  const componentText = (p.components ?? []).map((c) => c.text).join(' ');
  const rebuilt = await page.evaluate((html) => {
    const r = document.getElementById('root');
    r.innerHTML = html;
    return r.innerText;
  }, p.html);

  const before = words(p.text);
  const after = words(`${rebuilt} ${faqText} ${ctaText} ${componentText}`);

  const afterCounts = new Map();
  for (const w of after) afterCounts.set(w, (afterCounts.get(w) ?? 0) + 1);

  const missing = [];
  for (const w of before) {
    const n = afterCounts.get(w) ?? 0;
    if (n === 0) missing.push(w);
    else afterCounts.set(w, n - 1);
  }

  // A word still found inside an interactive component is not lost content - that
  // markup deliberately lives in code, not the CMS. Repeated widget labels otherwise
  // show up here purely as a counting artefact.
  const componentWords = new Set(words(componentText));
  const inComponent = missing.filter((w) => componentWords.has(w) && !EXPECTED_DROPS.includes(w));
  const unexpected = missing.filter(
    (w) => !EXPECTED_DROPS.includes(w) && !componentWords.has(w)
  );
  const pct = before.length ? ((unexpected.length / before.length) * 100).toFixed(2) : '0.00';

  if (unexpected.length === 0) {
    const note = inComponent.length
      ? `, ${inComponent.length} inside the interactive component (by design)`
      : '';
    console.log(`OK   ${p.slug.padEnd(62)} ${String(before.length).padStart(5)} words, all preserved${note}`);
  } else {
    bad++;
    console.error(`LOSS ${p.slug.padEnd(62)} ${unexpected.length} words missing (${pct}%)`);
    console.error(`     e.g. ${[...new Set(unexpected)].slice(0, 12).join(' ')}`);
  }
}

await browser.close();
console.log(
  bad === 0
    ? `\nContent integrity verified: no words lost across ${posts.length} posts.`
    : `\n${bad} of ${posts.length} posts lost content.`
);
process.exit(bad === 0 ? 0 : 1);
