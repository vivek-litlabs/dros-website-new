# Next.js Migration at Exact Visual Parity — Design

**Date:** 2026-09-02
**Repo:** `vivek-litlabs/dros-website-new`
**Branch:** `next-migration`
**Status:** Approved design, ready for implementation planning

---

## 1. Context

`dros-website-new` is a client-side-only Vite + React SPA (React 18, react-router v7,
Tailwind, framer-motion, lenis, react-helmet-async), deployed on Vercel. It has 43
routes declared across `src/pages/**`, including 14 hand-written blog posts.

`vercel.json` rewrites every path to `/index.html`. There is no SSR and no prerender
step. All per-page SEO — `<title>`, meta description, `og:*`, `twitter:*`, canonical,
and the JSON-LD emitted by `BlogLayout.tsx` — is injected **client-side** by
`react-helmet-async`.

*Verified during implementation:* `BlogLayout` emits only `<link rel="canonical">` plus
JSON-LD; each post's title/description/`og:*`/`twitter:*` come from that post's own
`<Helmet>`. The JSON-LD types are `BlogPosting`, `BreadcrumbList` and (conditionally)
`FAQPage` — there is no `Article` type in this codebase.

Consequence: the initial HTML response for every route is the generic homepage shell
(`<title>AI Agents for Collections | DROS AI</title>` and an empty `<div id="root">`).
Googlebot executes JS and largely copes. The AI crawlers that matter for GEO/AEO —
GPTBot, ClaudeBot, PerplexityBot, Google's AI Overview fetchers — read the initial
response and see nothing.

This blocks a planned content programme: 63 SEO-targeted posts sourced from the
"Dros AI Master SEO Tracker". Publishing 63 pages that AI crawlers read as blank is
not worth doing.

### Relationship to Project B

This is **Project A** of two. **Project B** is the Airtable-native-AI → MDX → GitHub PR
blog generation pipeline, which is the original business goal. Project B is explicitly
out of scope here and will get its own spec. Decisions already settled for B, recorded
so they are not relitigated:

- Content format is **MDX**, rendered through a renderer that maps to the existing
  BlogLayout component kit.
- Generation uses **Airtable-native AI actions** (Generate text, Generate structured
  data, Generate image, Do web search) — not custom generation code.
- Delivery is an Airtable **Run script** action that commits to GitHub and opens a PR,
  giving a human review gate before anything is indexed.

B is built on top of A. Building B first would mean writing the blog rendering layer
twice.

---

## 2. Goals and non-goals

### Goals

1. The site runs on Next.js App Router, on the same Vercel project and domain.
2. All 43 routes render **pixel-identically** to the current build at 375 / 768 / 1440.
3. Every route emits real server-rendered HTML — title, meta, canonical, JSON-LD, and
   body copy — in the initial response, with JS disabled.
4. Parity is **proven by an automated harness**, not asserted.

### Non-goals

- No redesign, no copy changes, no new pages, no route changes.
- No dependency upgrades beyond what Next requires.
- No blog generation pipeline (Project B).
- No performance optimisation work. Performance should be equal or better as a side
  effect; it is not a gate.

### Success criteria

- `npm run parity` reports 43/43 routes green at all three viewports.
- `parity-exceptions.md` is empty, or contains only entries explicitly signed off.
- CP6 (raw-HTML assertions) passes for every route.
- Zero console errors and zero hydration mismatches across the suite.

---

## 3. Target architecture

**Stack:** Next.js (App Router) · React 18 · Tailwind (config ported unchanged) ·
framer-motion · **plain-CSS fonts, no `next/font`** (see Finding 2) · **no lenis**
(see Finding 1).

### 3.1 Routing

Each `src/pages/X.tsx` declares `export const route = '/foo'`. That string is the exact
target path, so the mapping to `app/foo/page.tsx` is unambiguous and scriptable.

- `react-router` `<Link>` → `next/link`.
- `useLocation`, `useSearchParams`, `useNavigate` → `next/navigation` equivalents.
- `scripts/sync-routes.js` is deleted; App Router file conventions replace it.
- The two redirect-only pages (`RedirectToApiDocs.tsx` → `/api-docs`,
  `RedirectToReleaseNotes.tsx` → `/release-notes`) become server-side redirects in
  `next.config.js` rather than client components.
- Existing path inconsistencies are **preserved exactly**. Notably
  `/blog/reg-f-call-limits-ai-debt-collection` uses singular `/blog/` while every other
  post uses `/blogs/`. Changing it would break live URLs. Out of scope.

Full route inventory is in Appendix A.

### 3.2 Metadata

Every `<Helmet>` block becomes an exported `metadata` object (or `generateMetadata`
where values are computed). `react-helmet-async` is removed entirely.

JSON-LD stays a `<script type="application/ld+json">` element inside the component
tree, but now renders server-side. `BlogLayout` keeps emitting `BlogPosting` and
`BreadcrumbList` schema, plus `FAQPage` when `faq` is provided.

**This is the change that achieves the project's objective.** Per-page SEO moves from
"after JS executes" to "in the HTML response".

### 3.3 Client boundaries

Each route becomes a thin **server component** (metadata + static shell) wrapping the
existing component tree marked `"use client"`.

Animation-heavy components stay client components. That is expected and is required for
parity — the win is not eliminating client JS, it is that the **content and metadata**
server-render regardless.

### 3.4 Build conventions

| Today | After |
|---|---|
| `scripts/sync-routes.js` auto-registers routes into `main.tsx` | App Router file routing |
| `scanPageRoutes()` in `vite.config.ts` feeds `vite-plugin-sitemap` | `app/sitemap.ts`, same routes, same `changefreq`/`priority` values |
| `generateRobotsTxt: true` | `app/robots.ts` |
| `manualChunks` vendor splitting | Next's own splitting |
| `skipLockedPublicFiles()` Vite plugin | Dropped. Verified: none of the three files it guards (`image copy.png`, `image copy copy.png`, `RMAi-Logo-500 copy.png`) exist in the repo or are referenced anywhere in `src/`. It is a workaround for local-only artifacts and has no counterpart in Next |
| `vercel.json` SPA rewrite | Removed — Next handles routing |

### 3.5 Carried over unchanged

`tailwind.config.js`, `src/index.css`, all of `public/`, every component under
`src/components`, `src/lib/*` (analytics, api, hubspot, motion, countries), and the
Vercel project itself.

### 3.6 Environment and external services

- `VITE_RECAPTCHA_SITE_KEY` → `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` (rename only).
- Two external calls stay client-side and port unchanged:
  `https://api.dros.ai/functions/v1/trigger-demo-call` and the HubSpot forms endpoint.
- GA4 via `react-ga4` (measurement ID `G-TT8WJVR53D`, currently initialised in
  `src/main.tsx`) moves into a client provider in the root layout, which also takes over
  the `ScrollToTop` and pageview-on-navigation behaviour.
- `lenis` is removed from `package.json` (Finding 1).

---

## 4. Known parity risks

Named up front so they are designed for rather than discovered late.

### 4.1 Codebase findings that reduce or reshape the risk

Three facts verified in the codebase after the design review. Two remove named risks
entirely; the third adds a defect that must be fixed rather than ported.

**Finding 1 — Lenis is never instantiated. The smooth-scroll risk does not exist.**
`window.__lenis` is *read* in four places (`Navbar.tsx`, `App.tsx`, `Aca.tsx`,
`components/home/aca/HeroAca.tsx`) but is **never assigned anywhere in the codebase**.
There is no `new Lenis(...)` call. Every one of those call sites already falls through
to its native `window.scrollTo` branch. The `lenis` dependency is dead weight.
*Consequence:* no Lenis provider is needed, no `window.__lenis` gate is needed, and the
dependency is dropped. Scroll behaviour is native today and stays native.

**Finding 2 — Fonts are plain CSS, so `next/font` is not needed. The largest parity
risk is avoidable rather than merely testable.**
Saans is a hand-written `@font-face` in `src/index.css` carrying a load-bearing
`ascent-override: 90%`; the Google families load via `<link>` tags in `index.html` using
the `media="print"` swap trick. None of this depends on Vite.
*Consequence:* **do not adopt `next/font`.** Port `index.css` unchanged and reproduce the
`index.html` `<link>` and `<link rel="preload">` tags verbatim in the Next root layout.
Font metrics are then byte-identical by construction, and the CP1 probe verifies rather
than discovers. Adopting `next/font` would inject a different loading strategy and
override the `ascent-override`, which is precisely the drift we are trying to avoid.

**Finding 3 — Canonical tags are currently emitted more than once on 26 of 41 routes. This
is a defect to fix, not behaviour to preserve.**
`CanonicalTag` in `src/main.tsx` emits `<link rel="canonical">` for *every* route, and
`BlogLayout.tsx:114` emits its own when `canonicalPath` is set. Today `react-helmet-async`
deduplicates at runtime so only one survives. Server-rendered, **all of them would appear in
the raw HTML** — a genuine SEO defect that CP6 would otherwise ship.

*Scope corrected during implementation:* this affects **26 routes**, not just the 14 blog
posts — 12 non-blog pages also declare their own page-level canonical alongside the global
one, and `/blogs/ai-agents-debt-collection-deployment` has **three** canonical sources.
*Consequence:* canonical gets exactly one source of truth — `metadata.alternates.canonical`
per route. `CanonicalTag` is deleted and `BlogLayout` stops emitting the tag. CP6 asserts
**exactly one** canonical element per route. This is an intentional, recorded deviation
from current DOM output and is pre-approved as a `parity-exceptions.md` entry.

### 4.2 Remaining risks

| Risk | Why it threatens parity | Mitigation |
|---|---|---|
| **Font rendering** | Downgraded by Finding 2 from "most likely drift source" to a verification step, since the CSS is ported verbatim | CP1 typography probe confirms byte-identical metrics |
| **Hydration flash** | framer-motion components with `initial={{ opacity: 0 }}` now server-render in their initial (invisible) state, then animate — different from CSR today. **Now the highest remaining risk.** | Dedicated first-paint pre-hydration screenshot gate (§5.3) |
| **Hydration mismatches** | Any date-relative or client-only rendering that differs server vs client | Zero-hydration-warning gate on every wave |
| **Suspense fallback removal** | Today every non-home route is `lazy()` behind a `<div className="min-h-screen bg-base" />` fallback, plus a `lazyWithRetry` stale-chunk reload guard. Next replaces both | Next handles chunk loading and its own error recovery; the retry wrapper is dropped. Verified by the internal link crawl in §5.3 |
| **Chunking** | `manualChunks` has no direct Next equivalent | Accepted. Not a parity gate; performance is a non-goal |

---

## 5. Parity harness

### 5.1 Tolerance policy

The default gate is **0 differing pixels**. Percentage thresholds are rejected: a 0.3%
diff on every page is a redesign nobody approved.

A route that cannot reach zero does **not** get a looser threshold. It gets an entry in
`parity-exceptions.md` recording the screenshot, the cause, and explicit sign-off. That
file is a review deliverable. If it is empty, parity is literally 100%; if not, the
decision is made against a known, itemised list rather than a summary statistic.

### 5.2 Deterministic capture

Playwright, with identical controls applied to both builds:

- **Freeze motion** — inject CSS forcing `animation: none; transition: none;` and set
  framer-motion's reduced-motion flag, so components render in their settled state.
- **Disable Lenis** during capture; use native scrolling.
- **Await `document.fonts.ready`** and `decode()` on all `<img>` before shooting. This
  is the single largest source of flaky diffs.
- **Mask dynamic regions** (date-relative copy, the demo widget's live state) with a
  stable overlay. Every mask is declared in a committed list — nothing is masked
  silently.
- Viewports **375 / 768 / 1440**, `deviceScaleFactor: 2`, full-page, network idle,
  animations paused at t=0.

The baseline is captured from the **current Vite production build served locally**, not
from the live site, so CDN variance and any live A/B noise cannot leak in. Baselines are
committed to the branch so diffs are reviewable in the PR.

Diffing uses `pixelmatch` at threshold 0.

### 5.3 Validations that pixel-diff cannot provide

Screenshots prove static appearance only. The four highest-risk aspects of this specific
migration each get their own gate:

| Risk area | Gate |
|---|---|
| Metadata moved to `metadata` export | Per-route assertion of `<title>`, description, canonical, every `og:*` / `twitter:*` tag, and **deep-equal of every JSON-LD block** against the baseline's post-JS DOM |
| Motion / scroll (Lenis, framer-motion, `Reveal`, `PageFade`) | Scripted interaction video capture on 6 representative routes, reviewed side by side; assert `window.__lenis` initialises |
| Hydration flash | Screenshot at first paint **before** hydration, asserting no blank or invisible content |
| Interactive paths | Scripted manual run: reCAPTCHA render, HubSpot form submit, `api.dros.ai` demo-call trigger, desktop + mobile nav, blog category filter and search |

Applied to every wave: **zero console errors/warnings**, **zero hydration mismatches**,
and no 404s on an internal link crawl.

### 5.4 Deliverable

`npm run parity` runs the full suite and writes an HTML report: per-route status,
side-by-side and diff images, and metadata assertion results. It runs on every push to
`next-migration`, so drift surfaces in the PR rather than at the end.

---

## 6. Checkpoints

Each checkpoint is a gate. Work stops until it is green. No wave begins before the
previous one passes.

**CP0 — Harness first.**
Build the Playwright harness against the *current Vite app*. Capture all 43 routes × 3
viewports, then re-run against the same unchanged build. It must produce **zero diffs
against itself**. A harness that cannot reproduce its own baseline cannot validate
anything.
*No migration work begins until CP0 is green.*

**CP1 — Foundation.**
Next skeleton: root layout, Tailwind config, `index.css`, `next/font` setup. Validated
by a throwaway typography-and-colour probe page rendering every heading level, body
style, button variant and surface token, diffed against the same probe on Vite. This is
where font-metric drift is caught, while it is still cheap to fix.

**CP2 — Pilot route.**
One representative blog post migrated end to end: page, metadata, JSON-LD, and the full
BlogLayout component kit. Must pass zero-pixel diff at three viewports plus the complete
§5.3 gate set. Proves the transform before it is applied 42 more times.

**CP3 — Shared chrome.**
Navbar, Footer, Lenis provider, GA4, `PageFade`, `Reveal`. Diffed across three
structurally different pages.

**CP4 — Route waves.**
Remaining routes in five gated batches, each requiring zero diffs before the next
starts:
1. Blog posts (13 remaining)
2. Industry / collections pages
3. Events pages
4. Resources, newsroom, legal, trust centre, redirects
5. **Home and pricing**

Home and pricing land last by design: they are the most complex and most visible pages,
and by the time they are reached every shared primitive has already been validated.

**CP5 — Full suite.**
All 43 routes green in a single run, the complete interactive checklist executed, and
`parity-exceptions.md` reviewed and signed off.

**CP6 — The actual objective.**
`curl` every route with JS disabled and assert the raw HTML contains that page's real
`<title>`, meta description, canonical, body copy, and Article / FAQPage JSON-LD.
Verify `sitemap.xml` and `robots.txt` match current output route-for-route.
This is the check proving GPTBot, ClaudeBot and Perplexity now receive content rather
than an empty shell, and it is the reason the migration is being done at all.

**CP7 — Cutover.**
Vercel preview deploy, then re-run the harness against the **deployed preview** (catches
build-vs-dev differences), then promote. Rollback is reverting the Vercel deployment to
the last Vite build, kept one click away until the site has been live and clean for a
week.

---

## 7. Appendix A — Route inventory (43)

| Current file | Route |
|---|---|
| `App.tsx` | `/` |
| `AboutUs.tsx` | `/about` |
| `Aca.tsx` | `/aca` |
| `AdoptionGapReport2026.tsx` | `/adoption-gap-report-state-of-collections-2026` |
| `RedirectToApiDocs.tsx` | `/api-docs` *(→ config redirect)* |
| `BlogPostRegFCallLimits.tsx` | `/blog/reg-f-call-limits-ai-debt-collection` *(singular `/blog/`, preserved)* |
| `BlogsPage.tsx` | `/blogs` |
| `BlogPostAIAgentsDeployment.tsx` | `/blogs/ai-agents-debt-collection-deployment` |
| `BlogPostAICollectionsOperatingLayer.tsx` | `/blogs/ai-collections-operating-layer` |
| `BlogPostAIReadinessChecklist.tsx` | `/blogs/ai-readiness-checklist-collection-agencies` |
| `BlogPostAIVoiceAgents.tsx` | `/blogs/ai-voice-agents-debt-disputes-compliance` |
| `BlogPostDNCVoiceAgents.tsx` | `/blogs/ai-voice-agents-dnc-disputes-compliance-2026` |
| `BlogPostLegacyIntegrations.tsx` | `/blogs/collections-integrations-legacy-systems` |
| `BlogPostDigitalFirst.tsx` | `/blogs/digital-first-collections-small-agencies-2026` |
| `BlogPostHumanInTheLoop.tsx` | `/blogs/human-in-the-loop-collections` |
| `BlogPostAICompliance.tsx` | `/blogs/integrate-ai-agents-collections-compliance` |
| `BlogPostOmnichannel.tsx` | `/blogs/omnichannel-ai-debt-collection` |
| `BlogPostRPC.tsx` | `/blogs/right-party-contact-rpc-learnings-from-the-field` |
| `BlogPostACA2026.tsx` | `/blogs/what-we-learned-aca-2026` |
| `BlogPost.tsx` | `/blogs/why-context-not-more-tools-is-the-future-of-debt-collection` |
| `BookMeeting.tsx` | `/book-meeting` |
| `CollectionsAIWorkshop.tsx` | `/collections-ai-workshop` |
| `ConsumerLendingCollectionsPage.tsx` | `/collections/consumer-lending` |
| `CreditUnionCollectionsPage.tsx` | `/collections/credit-unions` |
| `DebtBuyerCollectionsPage.tsx` | `/collections/debt-buyer` |
| `FirstPartyCollectionsPage.tsx` | `/collections/first-party` |
| `ThirdPartyCollectionsPage.tsx` | `/collections/third-party` |
| `ContactUs.tsx` | `/contact` |
| `CustomerStoriesPage.tsx` | `/customer-stories` |
| `GreystoneStory.tsx` | `/customer-stories/greystone-associates` |
| `EventsListingPage.tsx` | `/events` |
| `ACAOrlandoEvent.tsx` | `/events/2026/aca-orlando` |
| `ArmTechDallasEvent.tsx` | `/events/2026/armtech-dallas` |
| `RMAILasVegasEvent.tsx` | `/events/2026/rmai-las-vegas` |
| `EventsPage.tsx` | `/events/armtech-rmai-2026` |
| `features/context-aware-voice-ai-agents-for-debt-collection.tsx` | `/features/context-aware-voice-ai-agents-for-debt-collection` |
| `NewsroomPage.tsx` | `/newsroom` |
| `PricingPage.tsx` | `/pricing` |
| `RedirectToReleaseNotes.tsx` | `/release-notes` *(→ config redirect)* |
| `VideosPage.tsx` | `/resources/videos` |
| `TrustCenter.tsx` | `/trust-center` |
| `PaymentReminders.tsx` | `/use-cases/ai-voice-agent-payment-reminders` |
| `WebinarsPage.tsx` | `/webinars` |
