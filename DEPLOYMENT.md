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
