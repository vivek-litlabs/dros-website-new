/**
 * Verify the local parity baseline matches the one the migration was verified against.
 *
 * The baseline PNGs are gitignored (461MB), so they travel outside git. This checks the
 * copy on this machine against the committed manifest, which is the only thing tying a
 * given set of screenshots to the migration's "123/123 at zero pixels" claim. Without it
 * a subtly wrong baseline would make every future run pass against the wrong reference.
 */
import { createHash } from 'node:crypto';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const MANIFEST = 'parity/baseline-manifest.sha256';
const ROOT = 'parity/baseline';

if (!existsSync(MANIFEST)) {
  console.error(`Missing ${MANIFEST}.`);
  process.exit(2);
}

// Trim each line rather than only splitting on \n: git may check this file out with
// CRLF endings, and a trailing \r silently becomes part of the filename. Every path
// then reports MISSING while sitting right there on disk. .gitattributes marks the
// manifest binary to prevent the conversion; this makes the reader robust anyway.
const entries = readFileSync(MANIFEST, 'utf8')
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter(Boolean)
  .map((line) => {
    const [hash, ...rest] = line.split(/\s+/);
    return { hash, rel: rest.join(' ').trim() };
  });

let missing = 0;
let mismatched = 0;

for (const { hash, rel } of entries) {
  const path = join(ROOT, rel);
  if (!existsSync(path)) {
    console.error(`MISSING   ${rel}`);
    missing++;
    continue;
  }
  const actual = createHash('sha256').update(readFileSync(path)).digest('hex');
  if (actual !== hash) {
    console.error(`MISMATCH  ${rel}`);
    mismatched++;
  }
}

if (missing || mismatched) {
  console.error(
    `\nBaseline does NOT match the manifest: ${missing} missing, ${mismatched} differing ` +
      `of ${entries.length}.\nParity results against this baseline are not comparable to the ` +
      `migration's. See parity/README.md to restore it.`
  );
  process.exit(1);
}

console.log(`Baseline verified: ${entries.length}/${entries.length} files match the manifest.`);
