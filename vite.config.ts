import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import sitemap from 'vite-plugin-sitemap';
import fs from 'node:fs';
import path from 'node:path';

const LOCKED_FILES = ['image copy.png', 'image copy copy.png', 'RMAi-Logo-500 copy.png'];

function skipLockedPublicFiles(): Plugin {
  return {
    name: 'skip-locked-public-files',
    apply: 'build',
    closeBundle() {
      const outDir = path.resolve(__dirname, 'dist');
      for (const name of LOCKED_FILES) {
        const dest = path.join(outDir, name);
        if (fs.existsSync(dest)) {
          try { fs.unlinkSync(dest); } catch { /* ignore */ }
        }
      }
    },
    buildStart() {
      // Patch fs.copyFileSync to skip locked files during public copy
      const orig = fs.copyFileSync.bind(fs);
      (fs as unknown as { copyFileSync: typeof fs.copyFileSync }).copyFileSync = (src: fs.PathOrFileDescriptor, dest: fs.PathOrFileDescriptor, ...rest: Parameters<typeof fs.copyFileSync>[2][]) => {
        if (LOCKED_FILES.some(name => String(src).endsWith(name))) return;
        return orig(src, dest, ...rest as []);
      };
    },
  };
}

// Scan src/pages/ and extract `export const route = '...'` from each .tsx file.
// Any page that declares a route is included automatically — no manual list needed.
// To add a new page to the sitemap, just add `export const route = '/your-path';`
// at the top of its file in src/pages/.
function scanPageRoutes(): string[] {
  const pagesDir = path.resolve(__dirname, 'src/pages');
  const routes: string[] = [];

  function scan(dir: string) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        scan(path.join(dir, entry.name));
      } else if (entry.name.endsWith('.tsx')) {
        const content = fs.readFileSync(path.join(dir, entry.name), 'utf-8');
        const match = content.match(/^export const route\s*=\s*['"]([^'"]+)['"]/m);
        if (match) routes.push(match[1]);
      }
    }
  }

  scan(pagesDir);
  return routes;
}

const dynamicRoutes = scanPageRoutes().filter(r => r !== '/');

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    skipLockedPublicFiles(),
    react(),
    sitemap({
      hostname: 'https://dros.ai',
      dynamicRoutes,
      changefreq: {
        '*':                        'monthly',
        '/':                        'weekly',
        '/pricing':                 'weekly',
        '/blogs':                   'weekly',
        '/events':                  'weekly',
        '/events/2026/aca-orlando': 'weekly',
        '/resources/videos':        'weekly',
      },
      priority: {
        '*':                              0.7,
        '/':                              1.0,
        '/pricing':                       0.9,
        '/about':                         0.8,
        '/contact':                       0.8,
        '/book-meeting':                  0.8,
        '/blogs':                         0.8,
        '/events':                        0.7,
        '/events/2026/aca-orlando':       0.6,
        '/events/2026/armtech-dallas':    0.5,
        '/events/2026/rmai-las-vegas':    0.5,
        '/resources/videos':              0.6,
      },
      readable: true,
      generateRobotsTxt: true,
    }),
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    reportCompressedSize: false,
    rollupOptions: {
      output: {
        // Keep large, stable vendors in their own long-cacheable chunks so a
        // content change in app code doesn't bust the whole vendor cache.
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'framer-motion': ['framer-motion'],
        },
      },
    },
  },
});
