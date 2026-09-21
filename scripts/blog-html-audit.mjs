/**
 * Inventory the extracted blog HTML: which tags appear, and which composite blocks
 * (DarkCard, StepCard, FAQ, CTA...) need a semantic representation rather than a
 * pile of Tailwind classes. Read-only - informs the cleaner, changes nothing.
 */
import { readFileSync } from 'node:fs';
import { chromium } from '@playwright/test';

const { posts } = JSON.parse(readFileSync(process.argv[2] ?? 'artifacts/blogs.json', 'utf8'));

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent('<div id="root"></div>');

const tagCounts = new Map();
const topLevel = new Map();
const attrs = new Map();

for (const post of posts) {
  const result = await page.evaluate((html) => {
    const root = document.getElementById('root');
    root.innerHTML = html;

    const tags = {};
    const attributes = {};
    root.querySelectorAll('*').forEach((el) => {
      tags[el.tagName] = (tags[el.tagName] ?? 0) + 1;
      for (const a of el.attributes) {
        attributes[a.name] = (attributes[a.name] ?? 0) + 1;
      }
    });

    // Top-level children are the article's own flow: paragraphs, headings, and the
    // composite blocks. Their first class is the best fingerprint of which block it is.
    const top = Array.from(root.children).map((el) => {
      const cls = (el.getAttribute('class') ?? '').split(/\s+/).slice(0, 3).join(' ');
      return `${el.tagName}|${cls}`;
    });
    return { tags, attributes, top };
  }, post.html);

  for (const [t, n] of Object.entries(result.tags)) tagCounts.set(t, (tagCounts.get(t) ?? 0) + n);
  for (const [a, n] of Object.entries(result.attributes)) attrs.set(a, (attrs.get(a) ?? 0) + n);
  for (const t of result.top) topLevel.set(t, (topLevel.get(t) ?? 0) + 1);
}

await browser.close();

console.log('=== tags used across all posts ===');
for (const [t, n] of [...tagCounts].sort((a, b) => b[1] - a[1])) {
  console.log(`  ${t.padEnd(12)} ${n}`);
}

console.log('\n=== attributes present ===');
for (const [a, n] of [...attrs].sort((a, b) => b[1] - a[1])) {
  console.log(`  ${a.padEnd(12)} ${n}`);
}

console.log('\n=== distinct top-level block signatures ===');
for (const [t, n] of [...topLevel].sort((a, b) => b[1] - a[1])) {
  console.log(`  ${String(n).padStart(4)}  ${t.slice(0, 110)}`);
}
