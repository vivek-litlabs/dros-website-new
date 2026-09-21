/**
 * Inspect the GEO blog tracker CSV before importing anything.
 * Read-only: parses, reports shape, and flags what will need handling.
 */
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

// Only report when run directly - other scripts import parseCsv from here.
const RUN_DIRECTLY = import.meta.url === pathToFileURL(process.argv[1] ?? '').href;
const FILE = RUN_DIRECTLY ? process.argv[2] : undefined;

/** Minimal RFC4180 parser - the content column contains newlines and quotes. */
export function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += c;
      continue;
    }
    if (c === '"') { inQuotes = true; continue; }
    if (c === ',') { row.push(field); field = ''; continue; }
    if (c === '\r') continue;
    if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; continue; }
    field += c;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }

  const [header, ...body] = rows.filter((r) => r.some((c) => c.trim() !== ''));
  return body.map((r) => Object.fromEntries(header.map((h, i) => [h.trim(), (r[i] ?? '').trim()])));
}

if (FILE) {
  const records = parseCsv(readFileSync(FILE, 'utf8'));
  console.log(`rows: ${records.length}`);
  console.log(`columns: ${Object.keys(records[0]).join(' | ')}\n`);

  let wrapped = 0, withH1 = 0, dupTitle = 0;
  for (const r of records) {
    const html = r['HTML Blog Content'] ?? '';
    if (/^\s*<article/i.test(html)) wrapped++;
    const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    if (h1) withH1++;
    if (h1 && h1[1].replace(/<[^>]+>/g, '').trim() === r.Title.trim()) dupTitle++;
  }

  console.log(`content wrapped in <article>: ${wrapped}/${records.length}`);
  console.log(`content contains its own <h1>: ${withH1}/${records.length}`);
  console.log(`   ...whose text equals Title: ${dupTitle}/${records.length}\n`);

  console.log('slugs as supplied:');
  for (const r of records) {
    const slug = r['Suggested Slug'];
    const issues = [];
    if (!slug) issues.push('EMPTY');
    if (slug && slug !== slug.toLowerCase()) issues.push('uppercase');
    if (/\s/.test(slug)) issues.push('whitespace');
    if (/[^a-z0-9/-]/i.test(slug)) issues.push('non-url-safe');
    if (slug && !slug.startsWith('/blogs/')) issues.push('prefix');
    if (/--|\/$/.test(slug)) issues.push('sloppy');
    console.log(
      `  ${String(r.ID).padStart(3)}  ${(slug || '(none)').padEnd(62)} ${issues.length ? 'ISSUES: ' + issues.join(', ') : 'ok'}`
    );
  }

  const lens = records.map((r) => (r['HTML Blog Content'] ?? '').length);
  console.log(`\nhtml size: min ${Math.min(...lens)}, max ${Math.max(...lens)}, total ${lens.reduce((a, b) => a + b, 0)}`);

  const dupes = new Map();
  for (const r of records) dupes.set(r['Suggested Slug'], (dupes.get(r['Suggested Slug']) ?? 0) + 1);
  const clashes = [...dupes].filter(([, n]) => n > 1);
  console.log(clashes.length ? `\nDUPLICATE SLUGS: ${JSON.stringify(clashes)}` : '\nno duplicate slugs');
}
