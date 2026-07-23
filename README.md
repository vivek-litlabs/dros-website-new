# DROS Website

Marketing site for DROS (https://dros.ai). React + TypeScript, built with Vite,
styled with Tailwind CSS, deployed on Vercel.

## Requirements

- Node.js 18 or newer
- npm

## Getting Started

```bash
npm install     # also runs sync-routes via postinstall
npm run dev     # local dev server
```

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Production build to `dist/`, generates the sitemap |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check, no emit |
| `npm run sync-routes` | Register page routes in `src/main.tsx` |

## Project Structure

```
public/            Static assets served at the site root
  aca/ blog/       Page- and section-specific imagery
  features/
  industries/
  resources/
  fonts/saans/     Self-hosted variable font
  orb/             Voice-agent orb video (mp4 + webm)
  robots.txt       Search engine directives
  _headers         Static host header rules
src/
  main.tsx         App entry point, router, GA initialization
  index.css        Tailwind layers and global styles
  pages/           One file per route, plus Navbar/Footer/BlogLayout
  components/      Shared UI, home/ section components, aca/ landing page
  lib/             API client, analytics, country data, motion helpers
  content/         Reference copy source (not imported at build time)
scripts/
  sync-routes.js   Adds routes declared by pages into src/main.tsx
```

## Routing

Pages declare their own route on the first line:

```tsx
export const route = '/about';
```

`scripts/sync-routes.js` turns that into a lazy import and a `<Route>` in
`src/main.tsx`, and `vite.config.ts` uses the same declarations to generate the
sitemap at build time. See [CONTRIBUTING.md](CONTRIBUTING.md) for the full
workflow, including the blog-post checklist.

## Configuration

### Environment variables

| Variable | Where | Notes |
| --- | --- | --- |
| `VITE_RECAPTCHA_SITE_KEY` | `.env.local` (dev) and Vercel project settings (Production, Preview, Development) | Public reCAPTCHA v2 **checkbox** site key for the demo-call forms. Read at build time — if it's missing when Vercel builds, the checkbox won't render and the call buttons stay disabled. Safe to expose (it ships in the bundle). |

The reCAPTCHA **secret key** is not used in this repository. It belongs to whatever
verifies the token server-side (before a call is placed) and must never be committed
here or exposed to the browser. In the reCAPTCHA admin console the key pair must be
**v2 "I'm not a robot" Checkbox**, with `dros.ai`, `localhost`, and the Vercel preview
domain listed under Domains.

### Values set in code

Two values are set in code and should be confirmed as pointing at the right accounts:

- **Google Analytics** measurement ID `G-TT8WJVR53D`, in `src/main.tsx`
- **Demo call endpoint** `https://api.dros.ai/functions/v1/trigger-demo-call`,
  in `src/lib/api.ts`

## Deployment

Vercel builds with `npm run build` and serves `dist/`. Caching rules for
`index.html`, `/assets/*`, and `/fonts/*` live in `vercel.json`.

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md) before making changes. It covers content
style rules, the shared header/footer requirement, and how to add a blog post.
