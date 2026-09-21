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
