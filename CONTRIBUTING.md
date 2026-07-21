# Contributing to the DROS Website

Conventions for anyone working in this repository. These are not stylistic
suggestions - breaking them has caused real bugs in this codebase before.

## Content Style

- **No em dashes.** Never use an em dash in page content, headings, labels,
  strings, or any user-visible text. Use a regular hyphen surrounded by spaces
  ( - ) instead.

## Shared Layout Components

- **The header and footer must be identical on every page.** Always use the
  shared `Navbar` component from `src/pages/Navbar.tsx` and the shared `Footer`
  component from `src/pages/Footer.tsx`.
- **Never inline a nav or footer.** Every new page must import and render
  `<Navbar />` and `<Footer />`. No exceptions.
- **To change nav or footer links or content**, edit only the shared component
  files (`Navbar.tsx` / `Footer.tsx`). Never patch them page by page.

## How Routing Works

Routes are **declared by the page itself**, not registered by hand. Any file in
`src/pages/` whose first line exports a route is picked up automatically:

```tsx
export const route = '/blogs/my-new-post';

export default function BlogPostMyNewPost() { ... }
```

Two things consume that declaration:

- `scripts/sync-routes.js` adds the matching lazy import and `<Route>` entry to
  `src/main.tsx`. It runs automatically on `npm install` (postinstall) and can be
  run any time with `npm run sync-routes`. It is safe to run repeatedly.
- `vite.config.ts` scans the same declarations to build the sitemap at
  `npm run build` time, using the hostname `https://dros.ai`.

A page **without** an `export const route` line gets neither a route nor a
sitemap entry. `src/main.tsx` is the router entry point. Note that `Navbar.tsx`,
`Footer.tsx`, `BlogLayout.tsx`, and `main.tsx` are deliberately excluded from the
route scan, since they are layout pieces rather than pages.

## Adding a New Blog Post

1. **Create the page** at `src/pages/BlogPostXxx.tsx`. Start the file with
   `export const route = '/blogs/your-slug';`, use `export default function`, and
   build it with `BlogLayout` plus `<Navbar />` and `<Footer />`.
2. **Sync the route** with `npm run sync-routes` to register it in `src/main.tsx`.
3. **Add it to the listing** in `src/pages/BlogsPage.tsx`: append an entry to the
   `blogPosts` array with `title`, `category`, `tags`, `summary`, `slug`,
   `readTime`, and `badge`. The `category` value must exactly match one of the
   values in the `categories` array at the top of that file.
4. **Verify the slug matches.** The `slug` in `BlogsPage.tsx` must be identical
   to the `export const route` value in the page file. A mismatch produces a post
   that is listed but links to a 404.
5. **Confirm the build passes** with `npm run build`.

## Before You Commit

```bash
npm run typecheck   # tsc, no emit
npm run lint        # eslint
npm run build       # must succeed
```
