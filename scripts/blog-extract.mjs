/**
 * Extract every blog post as standalone HTML, plus its metadata.
 *
 * Content comes from the rendered page rather than the .tsx source: the posts are
 * React components, so the browser's own output is the only faithful HTML of them.
 * Class attributes are deliberately preserved - they are what makes the exported
 * HTML render identically to the live page under the same stylesheet.
 *
 * Metadata comes from the `blogPosts` array in src/views/BlogsPage.tsx, which is the
 * site's registry of record. It cannot simply be imported (the module pulls in
 * next/link, next/navigation and framer-motion, none of which load under plain node),
 * so the array literal is sliced out of the source and evaluated. It is pure data.
 *
 * Usage:  node scripts/blog-extract.mjs [baseUrl] [outFile]
 */
import { chromium } from '@playwright/test';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const BASE_URL = process.argv[2] ?? 'http://localhost:3000';
const OUT = process.argv[3] ?? 'artifacts/blogs.json';
const REGISTRY = 'src/views/BlogsPage.tsx';

/** Slice the `blogPosts` array literal out of the source and evaluate it. */
function readRegistry() {
  const src = readFileSync(REGISTRY, 'utf8');
  const anchor = 'export const blogPosts: BlogPost[] = [';
  const start = src.indexOf(anchor);
  if (start === -1) throw new Error(`${REGISTRY}: could not find "${anchor}"`);

  // Walk from the opening bracket to its match, so a "]" inside a string or a
  // nested array cannot end the slice early.
  const open = start + anchor.length - 1;
  let depth = 0;
  let end = -1;
  let quote = null;
  for (let i = open; i < src.length; i++) {
    const c = src[i];
    const prev = src[i - 1];
    if (quote) {
      if (c === quote && prev !== '\\') quote = null;
      continue;
    }
    if (c === "'" || c === '"' || c === '`') { quote = c; continue; }
    if (c === '[') depth++;
    else if (c === ']') {
      depth--;
      if (depth === 0) { end = i; break; }
    }
  }
  if (end === -1) throw new Error(`${REGISTRY}: unbalanced blogPosts array`);

  const literal = src.slice(open, end + 1);
  return Function(`"use strict"; return (${literal});`)();
}

const posts = readRegistry();
const internal = posts.filter((p) => p.slug);
const external = posts.filter((p) => !p.slug);

console.log(`registry: ${posts.length} posts (${internal.length} internal, ${external.length} external)`);

const browser = await chromium.launch();
const context = await browser.newContext();
const out = [];
let failed = 0;

for (const post of internal) {
  const page = await context.newPage();
  const url = `${BASE_URL}${post.slug}`;
  try {
    const res = await page.goto(url, { waitUntil: 'networkidle' });
    if (!res || res.status() !== 200) {
      throw new Error(`HTTP ${res ? res.status() : 'no response'}`);
    }

    const extracted = await page.evaluate(() => {
      const article = document.querySelector('article');
      if (!article) return null;
      const h1 = document.querySelector('h1');
      const canonical = document.querySelector('link[rel="canonical"]');
      const desc = document.querySelector('meta[name="description"]');
      const heroImg = document.querySelector('header img, article img');
      return {
        html: article.innerHTML,
        text: article.innerText,
        h1: h1 ? h1.innerText : null,
        title: document.title,
        canonical: canonical ? canonical.getAttribute('href') : null,
        description: desc ? desc.getAttribute('content') : null,
        hero: heroImg ? heroImg.getAttribute('src') : null,
        headings: Array.from(article.querySelectorAll('h2, h3')).map((h) => h.innerText),
      };
    });

    if (!extracted) throw new Error('no <article> element on the page');

    out.push({ ...post, url, ...extracted });
    console.log(
      `OK   ${post.slug.padEnd(62)} ${String(extracted.html.length).padStart(7)} chars html, ${extracted.headings.length} headings`
    );
  } catch (err) {
    failed++;
    console.error(`FAIL ${post.slug} - ${err.message}`);
  } finally {
    await page.close();
  }
}

await browser.close();

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify({ extractedAt: new Date().toISOString(), baseUrl: BASE_URL, external, posts: out }, null, 2));

const sizes = out.map((p) => p.html.length);
console.log(`\nwrote ${OUT}`);
console.log(`extracted ${out.length}/${internal.length}, ${failed} failed`);
if (sizes.length) {
  console.log(`html size: min ${Math.min(...sizes)}, max ${Math.max(...sizes)}, total ${sizes.reduce((a, b) => a + b, 0)}`);
}
process.exit(failed === 0 ? 0 : 1);
