# Parity exceptions

Every route that cannot reach a zero-pixel diff is recorded here with its cause,
a link to the diff image, and explicit sign-off. An empty list below means parity
is literally 100%.

## Pre-approved deviations

### Duplicate canonical tag removal (26 of 41 routes)
**Cause:** The Vite build emits `<link rel="canonical">` more than once on 26 routes — the
global `CanonicalTag` in `src/main.tsx` fires for every route, all 14 blog posts add their
own via `BlogLayout.tsx`, and 12 non-blog pages declare a page-level canonical as well.
`/blogs/ai-agents-debt-collection-deployment` has three sources. `react-helmet-async`
deduplicates at runtime, so only one survives in the live DOM; server-rendering would emit
all of them into the raw HTML. This is a defect, not behaviour worth preserving.
**Scope note:** originally recorded as affecting only blog posts; corrected to 26 routes
after a full per-route metadata audit.
**Resolution:** Canonical has exactly one source in Next — `metadata.alternates.canonical`.
**Visual impact:** None (canonical tags do not render).
**Signed off:** Approved in the design review, 2026-09-02.

### `/api-docs` and `/release-notes` excluded from screenshot parity
**Cause:** Both routes are pure client-side redirects — their entire implementation is
`window.location.href = 'https://app.dros.ai/...'` fired from a `useEffect`, and they
render no content (`return null`). A route whose only behaviour is to navigate away can
never reach visual stability: the harness's stability poll races an in-flight top-level
navigation, so the capture is non-deterministic by construction in both the current Vite
build and the future Next.js build. This is not tolerance-fixable — no CSS mask or
extended settle wait fixes a page that is actively leaving.
**Resolution:** Removed from `parity/routes.json` (`node -e ... drop=['/api-docs','/release-notes']`),
so they are not screenshot-diffed. They are NOT going unverified: the migration task
suite asserts each route returns a 307 redirect to the correct external destination,
which is the correct check for a redirect (status code + Location header), not a pixel
comparison of a blank page mid-navigation.
**Visual impact:** None (no content is ever rendered on these routes).
**Signed off:** Ruled on by the coordinator, 2026-09-03.

## Discovered exceptions

_(none yet)_

### Chromium console noise from third-party video embeds
**Routes:** `/resources/videos`, `/collections-ai-workshop` (all three viewports)
**Cause:** Both pages embed third-party video `iframe`s. Chromium emits three messages
that originate in the browser, not in this site's code: `Unrecognized feature:
'web-share'` (the embed's `allow` attribute names a permission this build does not
recognise), `powerPreference option is currently ignored` (Chromium-on-Windows WebGPU
warning when the player requests an adapter), and `No available adapters` (headless
Chromium exposes no WebGPU adapter).
**Why allowlisting is safe:** the pixel diff on all six failing checks was exactly `0px`
— the rendering is identical, only the console differed. These messages are not app
behaviour the migration can alter. If a migration dropped an embed, the messages would
disappear, but so would the rendered player, which the pixel gate would catch.
**Visual impact:** None.
**Alternative rejected:** suppressing console capture on these routes, which would have
hidden genuine errors too.
**Signed off:** Controller, 2026-09-03, after inspecting the report notes.

**Update, same day:** a fourth message from the same family appeared on a later run
(`Permissions policy violation: compute-pressure is not allowed in this document.`,
tablet only — the embedded player probes features differently per viewport). Rather than
keep adding global patterns reactively, the allowlist became **route-scoped**: each rule
carries the routes it applies to and a `why`. All four embed diagnostics are now tolerated
ONLY on `/resources/videos` and `/collections-ai-workshop`. The same message on any other
route still fails the gate, which an unscoped pattern would have silently excused. Verified
by unit test: embed messages blocked on `/pricing`, and a genuine React key warning blocked
even on an embed route.
