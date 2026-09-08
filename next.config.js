import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// Local dev convenience: the workspace keeps one .env one level above this project
// (alongside repo/), so the Airtable tooling and the app read the same file. Next only
// looks inside its own root, so load it here.
//
// Never overrides a variable that is already set, so Vercel's project env - the real
// source of truth in CI and production - always wins. In a deployment the file is not
// there at all and this is a no-op.
const sharedEnv = join(dirname(fileURLToPath(import.meta.url)), '..', '.env');
if (existsSync(sharedEnv)) {
  for (const raw of readFileSync(sharedEnv, 'utf8').split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    const value = line.slice(eq + 1).trim();
    if (value && process.env[key] === undefined) process.env[key] = value;
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  // The repo already has its own `npm run lint` (flat ESLint config for src/).
  // Next's built-in build-time lint step uses a different, auto-generated
  // config and errors on this project's rules (e.g. react/no-unknown-property
  // used in app/layout.tsx), so it's redundant with the existing lint script.
  eslint: {
    ignoreDuringBuilds: true,
  },

  async redirects() {
    return [
      { source: '/api-docs', destination: 'https://app.dros.ai/api-docs', permanent: false },
      { source: '/release-notes', destination: 'https://app.dros.ai/release-notes', permanent: false },
    ];
  },

  async headers() {
    return [
      {
        source: '/fonts/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ];
  },
};

export default nextConfig;
