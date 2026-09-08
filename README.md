# DROS Website

Marketing site for DROS (https://dros.ai). React + TypeScript on Next.js
(App Router), styled with Tailwind CSS, deployed on Vercel.

## Requirements

- Node.js 18 or newer
- npm

## Getting Started

```bash
npm install
npm run dev     # local dev server
```

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Start the Next dev server |
| `npm run build` | Production build to `.next/` |
| `npm run start` | Serve the production build locally |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check, no emit |
| `npm run parity` | Screenshot-diff every route against the pre-migration baseline |
| `npm run parity:ssr` | Assert every route server-renders its real content |

## Project Structure

```
public/            Static assets served at the site root
  aca/ blog/       Page- and section-specific imagery
  features/
  industries/
  resources/
  fonts/saans/     Self-hosted variable font
  orb/             Voice-agent orb video (mp4 + webm)
app/
  layout.tsx       Root layout: fonts, global styles, GA initialization
  robots.ts        Search engine directives (generates /robots.txt)
  sitemap.ts       Sitemap generated from the routes under app/
  <route>/page.tsx One directory per route, holding its metadata
src/
  index.css        Tailwind layers and global styles
  views/           One file per route's UI, plus Navbar/Footer/BlogLayout
  components/      Shared UI, home/ section components, aca/ landing page
  lib/             API client, analytics, country data, motion helpers
  content/         Reference copy source (not imported at build time)
```

## Routing

Routing is file-based (Next App Router). A route exists because a directory under
`app/` contains a `page.tsx`, so `/about` is `app/about/page.tsx`. Each `page.tsx`
holds the route's `metadata` and renders the matching view from `src/views/`.

The old `export const route` declaration and the `scripts/sync-routes.js` step that
scanned for it are gone: the filesystem is now the single source of truth, and
`app/sitemap.ts` generates the sitemap from it. See
[CONTRIBUTING.md](CONTRIBUTING.md) for the full workflow, including the blog-post
checklist.

## Configuration

### Environment variables

| Variable | Where | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | `.env.local` (dev) and Vercel project settings (Production, Preview, Development) | Public reCAPTCHA v2 **checkbox** site key for the demo-call forms. Read at build time — if it's missing when Vercel builds, the checkbox won't render and the call buttons stay disabled. Safe to expose (it ships in the bundle). |

> **Renamed by the Next migration.** This was `VITE_RECAPTCHA_SITE_KEY`. Next only exposes
> browser env vars prefixed `NEXT_PUBLIC_`, so the old name is silently ignored rather than
> erroring. Set the new name in Vercel **before** the first deploy: if it is missing the site
> renders perfectly and the primary "Initiate Call" CTA is simply dead on every page.

The reCAPTCHA **secret key** is not used in this repository. It belongs to whatever
verifies the token server-side (before a call is placed) and must never be committed
here or exposed to the browser. In the reCAPTCHA admin console the key pair must be
**v2 "I'm not a robot" Checkbox**, with `dros.ai`, `localhost`, and the Vercel preview
domain listed under Domains.

### Values set in code

Two values are set in code and should be confirmed as pointing at the right accounts:

- **Google Analytics** measurement ID `G-TT8WJVR53D`, in `app/layout.tsx`
- **Demo call endpoint** `https://api.dros.ai/functions/v1/trigger-demo-call`,
  in `src/lib/api.ts`

## Deployment

Vercel builds with `npm run build` (`next build`). Every route is statically
prerendered at build time, so the deployment is static HTML plus Next's client
bundle - there is no server rendering at request time.

`vercel.json` is gone. Its SPA rewrite (`/(.*)` to `/index.html`) would break
file-based routing, and Next already serves hashed assets under `/_next/static/`
as immutable. The one rule that still had to be carried over is the year-long
cache on self-hosted fonts, now in `next.config.js` under `headers()`.

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md) before making changes. It covers content
style rules, the shared header/footer requirement, and how to add a blog post.
