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
