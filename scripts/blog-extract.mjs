/**
 * Extract every blog post as SEMANTIC HTML, plus its metadata.
 *
 * The content stored in the CMS must not carry presentation. An earlier version of
 * this script shipped the rendered markup verbatim, so every paragraph arrived as
 * `<p class="text-black/80 leading-relaxed text-base sm:text-lg mb-6">` - which welds
 * the content to one specific Tailwind build. Restyling the blog would then mean
 * rewriting every record, and the content would be unusable anywhere else.
 *
 * So: class and style attributes are stripped, purely presentational wrappers are
 * unwrapped, and the composite blocks are reduced to semantic elements carrying a
 * `data-block` attribute. Styling lives in src/styles/blog-content.css, which targets
 * those attributes. Content says WHAT it is; the stylesheet says how it looks.
 *
 * Two things are pulled out of the body into structured fields rather than frozen as
 * markup, because they are interactive components, not prose:
 *   - the FAQ accordion (8 posts) -> [{ q, a }]
 *   - the end-of-post CTA (13 posts) -> { heading, body, primaryLabel, primaryHref, ... }
 * Their copy differs per post, so it is content; their behaviour is code.
 *
 * The "back to all blogs" link is dropped: it is layout chrome that happens to sit
 * inside <article>, not part of the post.
 *
 * Usage:  node scripts/blog-extract.mjs [baseUrl] [outFile]
 */
import { chromium } from '@playwright/test';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const BASE_URL = process.argv[2] ?? 'http://localhost:3000';
const OUT = process.argv[3] ?? 'artifacts/blogs.json';
const REGISTRY = 'src/views/BlogsPage.tsx';

function readRegistry() {
  const src = readFileSync(REGISTRY, 'utf8');
  const anchor = 'export const blogPosts: BlogPost[] = [';
  const start = src.indexOf(anchor);
  if (start === -1) throw new Error(`${REGISTRY}: could not find "${anchor}"`);
  const open = start + anchor.length - 1;
  let depth = 0, end = -1, quote = null;
  for (let i = open; i < src.length; i++) {
    const c = src[i], prev = src[i - 1];
    if (quote) { if (c === quote && prev !== '\\') quote = null; continue; }
    if (c === "'" || c === '"' || c === '`') { quote = c; continue; }
    if (c === '[') depth++;
    else if (c === ']') { depth--; if (depth === 0) { end = i; break; } }
  }
  if (end === -1) throw new Error(`${REGISTRY}: unbalanced blogPosts array`);
  return Function(`"use strict"; return (${src.slice(open, end + 1)});`)();
}

const posts = readRegistry();
const internal = posts.filter((p) => p.slug);
const external = posts.filter((p) => !p.slug);
console.log(`registry: ${posts.length} posts (${internal.length} internal, ${external.length} external)\n`);

const browser = await chromium.launch();
const context = await browser.newContext();
const out = [];
const unknownBlocks = new Map();
let failed = 0;

for (const post of internal) {
  const page = await context.newPage();
  const url = `${BASE_URL}${post.slug}`;
  try {
    const res = await page.goto(url, { waitUntil: 'networkidle' });
    if (!res || res.status() !== 200) throw new Error(`HTTP ${res ? res.status() : 'no response'}`);

    const data = await page.evaluate(() => {
      const article = document.querySelector('article');
      if (!article) return null;

      // Record the interactive widgets' text from the LIVE article, before cloning.
      // A detached clone under-reports it, and this text is what the integrity check
      // uses to prove the words still exist on the page even though they are not in
      // the CMS body.
      const liveComponentText = Array.from(article.children)
        .filter((el) => el.querySelector('input, fieldset, textarea, select'))
        .map((el) => (el.textContent ?? '').replace(/\s+/g, ' ').trim());

      const root = article.cloneNode(true);

      const KEEP_ATTRS = new Set(['href', 'src', 'alt', 'id', 'colspan', 'rowspan', 'target', 'rel', 'datetime', 'cite']);
      const unknown = [];

      const sig = (el) => `${el.tagName}|${(el.getAttribute('class') ?? '').split(/\s+/).slice(0, 3).join(' ')}`;
      const hasClass = (el, s) => (el.getAttribute('class') ?? '').includes(s);
      const text = (el) => (el.innerText ?? el.textContent ?? '').replace(/\s+/g, ' ').trim();

      // --- 1. pull the interactive blocks out as structured data ----------------
      let faq = null;
      const faqEl = root.querySelector('div.grid.grid-cols-1.gap-3');
      if (faqEl && faqEl.querySelector('[class*="cursor-pointer"]')) {
        faq = Array.from(faqEl.children).map((item) => {
          const kids = item.querySelectorAll('span, p, div');
          const q = item.querySelector('span');
          // The answer is the collapsible region; take its text, not its markup.
          const a = Array.from(item.querySelectorAll('div')).map((d) => text(d)).filter(Boolean).pop();
          return { q: q ? text(q) : '', a: a && q && a !== text(q) ? a : '' };
        }).filter((x) => x.q);
        faqEl.remove();
      }

      let cta = null;
      const ctaEl = Array.from(root.children).find((el) => el.tagName === 'DIV' && hasClass(el, 'mt-16'));
      if (ctaEl) {
        const heading = ctaEl.querySelector('h2, h3, .font-saans');
        const para = ctaEl.querySelector('p');
        const links = Array.from(ctaEl.querySelectorAll('a'));
        cta = {
          heading: heading ? text(heading) : '',
          body: para ? text(para) : '',
          primaryLabel: links[0] ? text(links[0]) : '',
          primaryHref: links[0] ? links[0].getAttribute('href') : '',
          secondaryLabel: links[1] ? text(links[1]) : '',
          secondaryHref: links[1] ? links[1].getAttribute('href') : '',
        };
        ctaEl.remove();
      }

      // --- 1b. interactive components become placeholders ----------------------
      // A block containing form controls is an application, not prose. Freezing its
      // markup into the CMS would store a dead snapshot of a live widget, so it is
      // replaced by a slot the route fills with the real React component. The text is
      // kept aside so the integrity check can still account for every word.
      const components = [];
      Array.from(root.children).forEach((el) => {
        if (!el.querySelector('input, fieldset, textarea, select')) return;
        const slot = document.createElement('div');
        slot.setAttribute('data-component', 'ai-readiness-checklist');
        components.push({
          name: 'ai-readiness-checklist',
          text: liveComponentText[components.length] ?? '',
        });
        el.parentNode.replaceChild(slot, el);
      });

      // --- 2. drop layout chrome that lives inside <article> --------------------
      Array.from(root.children).forEach((el) => {
        if (el.tagName === 'DIV' && hasClass(el, 'border-t') && /back to all blogs/i.test(text(el))) {
          el.remove();
        }
      });

      // --- 3. label the composite blocks, then strip presentation ---------------
      // Done before class attributes are removed, since the classes are the fingerprint.
      const label = (el, block, variant) => {
        el.setAttribute('data-block', block);
        if (variant) el.setAttribute('data-variant', variant);
      };
      /** Replace an element's tag while keeping its children and data attributes. */
      const rename = (el, tag) => {
        const next = document.createElement(tag);
        for (const a of Array.from(el.attributes)) next.setAttribute(a.name, a.value);
        while (el.firstChild) next.appendChild(el.firstChild);
        el.parentNode.replaceChild(next, el);
        return next;
      };

      root.querySelectorAll('div, blockquote, figure').forEach((el) => {
        if (el.hasAttribute('data-block')) return;
        if (hasClass(el, 'bg-[#FAFAFA]')) label(el, 'card');
        else if (hasClass(el, 'bg-[#F7FAFF]')) label(el, 'card', 'info');
        else if (hasClass(el, 'border-l-4')) label(el, 'callout');
        else if (el.tagName === 'BLOCKQUOTE') label(el, 'quote');
        else if (hasClass(el, 'overflow-x-auto')) label(el, 'table-scroll');
      });

      // A row of pill/tag spans is a list of things, not a paragraph. Left to the
      // generic unwrap it would fuse into one run-on word ("placementstimezone info"),
      // so give it real list structure before anything else touches it.
      Array.from(root.querySelectorAll('div')).forEach((el) => {
        if (el.hasAttribute('data-block')) return;
        const kids = Array.from(el.children);
        const pills = kids.filter((k) => k.tagName === 'SPAN' && hasClass(k, 'rounded-full'));
        if (kids.length && pills.length === kids.length) {
          label(el, 'pills');
          for (const k of pills) rename(k, 'li');
          rename(el, 'ul');
        }
      });

      // Body copy inside a card is a paragraph; the div was only ever a style hook.
      Array.from(root.querySelectorAll('div')).forEach((el) => {
        if (el.hasAttribute('data-block')) return;
        if (hasClass(el, 'text-[#393939]') && el.children.length === 0 && text(el)) rename(el, 'p');
      });

      // Small centred tiles carry a figure and a label - keep them distinguishable.
      Array.from(root.querySelectorAll('div')).forEach((el) => {
        if (el.hasAttribute('data-block')) return;
        if (hasClass(el, 'text-center') && hasClass(el, 'rounded-lg')) label(el, 'stat');
      });

      // Decorative icons carry no content; the stylesheet re-adds any that matter.
      root.querySelectorAll('svg').forEach((s) => s.remove());

      // Unwrap remaining unlabelled divs/spans: they exist only to hold classes.
      let pass = 0;
      while (pass++ < 12) {
        const junk = Array.from(root.querySelectorAll('div, span')).filter(
          (el) => !el.hasAttribute('data-block') && !el.hasAttribute('data-component')
        );
        if (!junk.length) break;
        for (const el of junk) {
          const s = sig(el);
          if (el.children.length === 0 && text(el)) unknown.push(s);
          const parent = el.parentNode;
          if (!parent) continue;
          // Unwrapping welds neighbouring text together: two sibling spans reading
          // "placements" and "timezone info" become "placementstimezone info". Pad the
          // boundaries so words stay separate words.
          const needsPad = text(el).length > 0;
          if (needsPad) parent.insertBefore(document.createTextNode(' '), el);
          while (el.firstChild) parent.insertBefore(el.firstChild, el);
          if (needsPad) parent.insertBefore(document.createTextNode(' '), el);
          parent.removeChild(el);
        }
      }

      // Strip every presentational attribute that survived.
      root.querySelectorAll('*').forEach((el) => {
        for (const a of Array.from(el.attributes)) {
          if (!KEEP_ATTRS.has(a.name) && !a.name.startsWith('data-')) el.removeAttribute(a.name);
        }
      });

      // Collapse the whitespace that unwrapping leaves behind.
      const html = root.innerHTML
        .replace(/>\s+</g, '><')
        .replace(/\s{2,}/g, ' ')
        .trim();

      // Header content that lives on BlogLayout's props rather than in the body.
      // Missing these is invisible in the body diff but shortens the rendered header.
      const subtitleEl = document.querySelector('header p.mt-4');
      const subtitle = subtitleEl ? text(subtitleEl) : '';

      // datePublished is an ISO date used for the byline and the Article schema. The
      // human string ("Aug 24, 2026") is a different field and cannot substitute.
      let datePublished = '';
      for (const s of document.querySelectorAll('script[type="application/ld+json"]')) {
        try {
          const json = JSON.parse(s.textContent ?? 'null');
          const node = Array.isArray(json) ? json.find((n) => n && n.datePublished) : json;
          if (node && node.datePublished) { datePublished = node.datePublished; break; }
        } catch { /* a malformed block is not fatal here */ }
      }

      const h1 = document.querySelector('h1');
      const canonical = document.querySelector('link[rel="canonical"]');
      const desc = document.querySelector('meta[name="description"]');
      return {
        html,
        text: article.innerText,
        h1: h1 ? h1.innerText : null,
        title: document.title,
        canonical: canonical ? canonical.getAttribute('href') : null,
        description: desc ? desc.getAttribute('content') : null,
        subtitle,
        datePublished,
        faq,
        cta,
        components,
        unknown,
        headings: Array.from(root.querySelectorAll('h2, h3')).map((h) => h.textContent.trim()),
      };
    });

    if (!data) throw new Error('no <article> element on the page');
    for (const u of data.unknown) unknownBlocks.set(u, (unknownBlocks.get(u) ?? 0) + 1);

    out.push({ ...post, url, ...data });
    console.log(
      `OK   ${post.slug.padEnd(62)} ${String(data.html.length).padStart(6)} chars` +
        `${data.faq ? `  faq:${data.faq.length}` : ''}${data.cta ? '  cta' : ''}`
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
if (sizes.length) console.log(`semantic html: min ${Math.min(...sizes)}, max ${Math.max(...sizes)}, total ${sizes.reduce((a, b) => a + b, 0)}`);
console.log(`posts with FAQ: ${out.filter((p) => p.faq).length}, with CTA: ${out.filter((p) => p.cta).length}`);
if (unknownBlocks.size) {
  console.warn('\nUnlabelled blocks that held text (check these did not lose meaning):');
  for (const [s, n] of unknownBlocks) console.warn(`   ${n}x ${s}`);
}
process.exit(failed === 0 ? 0 : 1);
