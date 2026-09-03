/** @type {import('next').NextConfig} */
const nextConfig = {
  // The repo already has its own `npm run lint` (flat ESLint config for src/).
  // Next's built-in build-time lint step uses a different, auto-generated
  // config and errors on this project's rules (e.g. react/no-unknown-property
  // used in app/layout.tsx), so it's redundant with the existing lint script.
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
