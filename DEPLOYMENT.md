# Deploying the Next migration

Everything in this file needs access to the Vercel dashboard, so it is **yours to do** -
none of it can be done from the repository alone. Ordered by what breaks if skipped.

## 1. Set the renamed environment variable (blocks the primary CTA)

| Old (Vite) | New (Next) |
| --- | --- |
| `VITE_RECAPTCHA_SITE_KEY` | `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` |

Set it for **Production, Preview and Development** before the first deploy.

Next only exposes browser variables prefixed `NEXT_PUBLIC_`. It does not warn about the
old name, it simply never reads it. The failure is silent and total: every page renders
perfectly, the reCAPTCHA checkbox never appears, and the "Initiate Call" button stays
disabled site-wide. Nothing in the build or the logs says why.

## 2. Clear the Vite build overrides

The project was created as a Vite project, so **Settings -> Build & Development** may
still pin:

- Framework Preset: `Vite`  ->  set to **Next.js**
- Build Command: `npm run build` -> clear it (inherit from framework)
- Output Directory: `dist`  ->  **clear it**. Next writes `.next`, and a stale `dist`
  override makes the deploy succeed and serve nothing.
- Install Command: clear it (the `sync-routes` postinstall step no longer exists)

`vercel.json` in the repo now pins `"framework": "nextjs"`, but an explicit dashboard
override still wins over it. Clearing the overrides is what actually settles this.

## 3. Confirm after deploying

The parity harness accepts a base URL, so the same gate that verified the migration
locally runs against the deploy:

```bash
npm run parity:verify-baseline          # baseline is the one the migration used
npm run parity -- https://<deploy-url>  # 123 checks, zero differing pixels
npm run parity:ssr -- https://<deploy-url>
```

Expect **one class of legitimate difference**: with a real reCAPTCHA key set in
production, the checkbox renders where local capture had none, so routes with a call
form will differ. That is the fix working, not a regression - confirm the diff is
confined to the checkbox area before dismissing it.

Also worth a manual look, since parity cannot check them:

- Submit one demo-call form end to end. The harness stubs third-party requests and never
  submits anything, so the actual call path is unverified by any automated gate here.
- `/api-docs` and `/release-notes` redirect to `app.dros.ai` (307).
- Google Analytics receives pageviews. GA moved from `src/main.tsx` to `app/layout.tsx`,
  and analytics is blocked during capture, so it is untested by parity.

## 4. Repository decision still open

`parity/baseline/**/*.png` (461MB) is gitignored, so the pixel gate currently only runs
on a machine that already has those files. See `parity/README.md` - Git LFS or an object
store are the two reasonable homes. Until that is decided, the baseline lives on one
machine and cannot be regenerated from this branch alone.

## Scheduled blog publishing

New posts live in Airtable with a `Publish Date`. A post goes live when three things
are true: it has content, its slug is under `/blogs/`, and its publish date has arrived
(UTC, matching Airtable's `TODAY()` so the site and the Status column never disagree).

**The site is statically generated, so a date arriving does not publish anything on its
own — a build has to run that day.** Without a scheduled build, a post dated Tuesday
simply stays invisible until the next deploy for any other reason.

Set up a daily build in Vercel:

1. Project Settings → Git → Deploy Hooks → create a hook (e.g. `daily-publish`, branch
   `main`). Copy the URL.
2. Schedule a daily `POST` to it. Either Vercel Cron, or any scheduler you already run:

   ```
   0 6 * * 1-5   curl -X POST https://api.vercel.com/v1/integrations/deploy/<hook>
   ```

   Weekdays at 06:00 UTC matches the Monday–Friday schedule the content tracker uses.
   A daily build is harmless when nothing is due: the same pages are regenerated.

Airtable's `Status` column shows where each row stands, and is a formula - nothing to
maintain by hand:

| Status | Meaning |
| --- | --- |
| `Needs content` | Dated, but `Content HTML` is empty. It will not publish. |
| `Scheduled` | Has content, publish date is still in the future. |
| `Published` | Has content and the date has arrived. Live after the next build. |

### Publishing a post by hand

Set `Content HTML`, make sure `Slug` starts with `/blogs/`, set `Publish Date` to today
or earlier, and trigger a build. No code change.

### What is not wired up

- `/alternatives/`, `/compare/`, `/integrations/` and `/resources/` rows in the tracker
  are not blog posts. The blog route only serves `/blogs/`, so those need their own
  routes before they can publish.
- Rows imported from the tracker carry a placeholder hero image
  (`/blog/grid-perspective.avif`). Set a real one per post before it goes live.
- New CMS posts do not appear in "Related Articles" on the 14 hand-written posts; that
  component reads the static registry in `src/views/BlogsPage.tsx`.
