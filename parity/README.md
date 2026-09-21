# Parity harness

Proves the Next migration did not change what the site looks like or what it serves.

| Command | What it checks |
| --- | --- |
| `npm run parity` | Every route at 3 viewports, screenshot-diffed against the pre-migration build. Tolerance is **zero** pixels. |
| `npm run parity:ssr` | Every route server-renders its real content, not an empty shell. |
| `npm run parity:verify-baseline` | The local baseline is the one the migration was verified against. |
| `npm run parity:capture` | Re-record the baseline. See the warning below. |

Run against a production build (`npm run build && npm run start`), not `next dev`.
All three take an optional base URL, so they also work against a deploy:

```bash
npm run parity -- https://your-deploy-url
```

## The baseline is not in git

`parity/baseline/**/*.png` is 461MB and gitignored; only the small `.meta.json` SEO
references are committed. The PNGs therefore live **outside** version control, and a
clone cannot run the pixel gate until someone supplies them.

`parity/baseline-manifest.sha256` **is** committed. It is the only thing tying a given
set of screenshots to this migration's "123/123 at zero differing pixels" result. Run
`npm run parity:verify-baseline` after obtaining a baseline; a mismatch means your
results are not comparable to the migration's, and a silently wrong baseline would make
every future run pass against the wrong reference.

> **Decide where these live.** Git LFS, or a build-artifact/object store, are the two
> reasonable homes. Until that is settled the gate is reproducible only on the machine
> holding the files.

## Regenerating the baseline

The baseline is a photograph of the **pre-migration Vite build**, so it cannot be
recaptured from this branch - the Vite build system was deleted here. It needs the app
from `main` and the harness from this branch, which no single checkout has.

```bash
# 1. Vite app in an isolated worktree
git worktree add ../parity-baseline main
cd ../parity-baseline
npm install                    # main's own deps; `npm run build` here is Vite

# 2. Bring the harness across - the FILES ONLY.
#    Do not take package.json too: that would replace main's Vite build with
#    `next build` and break the very build you are trying to photograph.
git checkout next-migration -- parity/

# 3. The harness's own dependencies, which main does not have
npm install -D @playwright/test pixelmatch pngjs @types/pngjs tsx
npx playwright install chromium

# 4. Build and serve the Vite app (port 3001 keeps it clear of a running Next server)
npm run build                  # Vite -> dist/
npx serve dist -l 3001 -s

# 5. Capture, from another shell in ../parity-baseline.
#    Call tsx directly: the parity:* npm scripts live in the Next package.json,
#    which you deliberately did not copy over.
npx tsx parity/run.ts capture http://localhost:3001

# 6. Copy the PNGs back and confirm they match the committed manifest
cp -r parity/baseline/. <this-repo>/parity/baseline/
cd <this-repo> && npm run parity:verify-baseline

# 7. Clean up
git worktree remove ../parity-baseline
```

Every step above was rehearsed end to end, and the result matters: the regenerated
baseline was **bit-for-bit identical** to the original - all 123 SHA-256 hashes matched
the committed manifest. Capture is deterministic, so these 461MB are reproducible rather
than irreplaceable, and losing them costs an hour rather than the ability to verify
anything ever again.

That was confirmed on the same machine, so it holds the OS, Chromium build and installed
fonts constant. A different machine may well produce different bytes - font rasterisation
especially - in which case regenerate the baseline there and re-run the whole gate to
establish a new reference, rather than assuming the manifest should still match.

Two things above look like details and are not: taking `package.json` in step 2 replaces
the Vite build with `next build` and breaks the build you are photographing, and omitting
`pixelmatch` in step 3 fails at import before a single screenshot is taken. Both were
found by rehearsing, not by reading.

Capture rejects any screenshot that never reached visual stability rather than writing a
mid-animation frame, so a baseline that completes is internally consistent - but only the
manifest tells you it is *the same* baseline.

## Why tolerance is zero

A nonzero threshold hides exactly the regressions this migration could cause: a shifted
font fallback, a dropped shadow, a section that reflows by a few pixels. Every source of
nondeterminism is instead removed at capture time - animations frozen, fonts awaited,
lazy images decoded, third-party requests stubbed, scroll state settled.

On a nonzero diff the harness re-captures that route once. This does not relax the gate:
a real regression is deterministic and fails both attempts. A check that passes only on
the retry is reported as `FLAKY` and counted in the summary, so a capture-side race stays
visible instead of being silently absorbed.
