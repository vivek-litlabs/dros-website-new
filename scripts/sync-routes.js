#!/usr/bin/env node
// Scans src/pages/*.tsx for files that export `export const route = '...'`
// and ensures each one has a matching lazy import + <Route> in src/main.tsx.
// Safe to run multiple times.

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, basename } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pagesDir = join(__dirname, '..', 'src', 'pages');
const mainPath = join(__dirname, '..', 'src', 'main.tsx');

const SKIP = new Set(['main.tsx', 'Navbar.tsx', 'Footer.tsx', 'BlogLayout.tsx', 'AnnouncementBanner.tsx']);

function extractRoute(filePath) {
  const content = readFileSync(filePath, 'utf8');
  const match = content.match(/^export const route\s*=\s*['"]([^'"]+)['"]/m);
  return match ? match[1] : null;
}

function extractComponentName(filePath) {
  const content = readFileSync(filePath, 'utf8');
  const match = content.match(/export default function\s+(\w+)/);
  return match ? match[1] : null;
}

const files = readdirSync(pagesDir).filter(f => f.endsWith('.tsx') && !SKIP.has(f));

const pages = [];
for (const file of files) {
  const filePath = join(pagesDir, file);
  const route = extractRoute(filePath);
  const component = extractComponentName(filePath);
  if (route && component) {
    pages.push({ file, route, component, moduleName: basename(file, '.tsx') });
  }
}

let main = readFileSync(mainPath, 'utf8');
let changed = false;

// Every route is code-split via lazyWithRetry(() => import('./pages/X.tsx')),
// declared just above this call. New lazy consts are inserted right before it.
const renderAnchor = `createRoot(document.getElementById('root')!).render(`;

// Add missing imports and routes. Presence is detected by the module path
// showing up anywhere in main.tsx, since the homepage import is a plain
// `import` while every other route uses the lazyWithRetry(...) form.
for (const { route, component, moduleName } of pages) {
  const modulePathRe = new RegExp(`\\./pages/${moduleName}\\.tsx`);

  if (!modulePathRe.test(main)) {
    const importLine = `const ${component} = lazyWithRetry(() => import('./pages/${moduleName}.tsx'));\n`;
    main = main.replace(renderAnchor, `${importLine}${renderAnchor}`);
    console.log(`+ import ${component}`);
    changed = true;
  }

  if (!main.includes(`path="${route}"`)) {
    main = main.replace(
      `      </Routes>`,
      `        <Route path="${route}" element={<${component} />} />\n      </Routes>`
    );
    console.log(`+ Route ${route}`);
    changed = true;
  }
}

if (changed) {
  writeFileSync(mainPath, main, 'utf8');
  console.log('main.tsx updated.');
} else {
  console.log('All routes already in sync.');
}
