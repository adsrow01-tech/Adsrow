# Adsrow runtime performance report — Phase 2

**Date:** 2026-11-11  
**Scope:** Read-only inspection and browser observation. No application, configuration, dependency, or deployment code was changed for this phase.

## Findings

The Phase 1 code path still gates the complete application on Supabase session initialization. In `src/context/AuthContext.jsx`, `loading` starts as `isSupabaseConfigured`; the effect dynamically imports `src/lib/supabase.js`, registers the auth listener, calls `getSession()`, and only then sets `loading` to false. The provider renders `LoadingScreen` instead of its children while loading. This preserves navbar auth state and avoids a logged-out flash, but also prevents public homepage content from appearing until the SDK import and session restoration finish.

The browser asset inventory from the requested development origin, `http://localhost:5173/`, showed `src/lib/supabase.js` and Vite's prebundled `@supabase/supabase-js` among resources observed on the homepage. That is consistent with the dynamic import being started immediately by the auth provider. This is a development-server observation: Vite serves source modules and prebundles separately, so it does not prove the exact production request waterfall or transfer size.

`src/lib/siteContent.js` remains imported by the homepage through `Adsrow99Banner` (campaign price), and is also used by Network, Contact, FAQs, Host a Screen, and `packageData.js`. Its content and icon component references share one module. Separating campaign pricing/areas from venue and FAQ content is a plausible future experiment, but the present browser tooling did not provide production request counts or timing with which to judge whether another request is worthwhile. No split is recommended from this measurement pass.

## Requested measurements

| Measurement | Result |
|---|---|
| Cold-cache production request waterfall | Not captured. Available browser controls did not expose a cache-disable or network log protocol. |
| JavaScript request names | Development asset inventory only; included React/Vite modules, route modules, `siteContent.js`, and the dynamically requested Supabase source module. Not a production request count. |
| Transfer sizes and compressed sizes per request | Not available from browser asset inventory. Prior production file sizes are build measurements, not browser transfer observations. |
| Request initiators | Production initiator stack not available. Source-level path is `AuthContext.jsx` → `import("../lib/supabase")`; runtime resource inventory identified the Supabase source module. |
| Supabase chunk requested immediately | The app source starts the dynamic import in the initial `AuthProvider` effect. The development browser inventory observed Supabase modules on the homepage. Whether and when the production chunk completed was not measurable here. |
| `DOMContentLoaded` / `load` | Not available. The in-app browser's read-only page evaluator omits `window.performance` and `PerformanceObserver`. |
| Largest Contentful Paint | Not available for the same reason; no Lighthouse executable/package is installed. |
| Time to meaningful homepage content | Not timed. The browser first showed the existing “Preparing your advertising experience…” loading state and later rendered the homepage; elapsed time was not exposed. |
| Console errors / failed network requests | Not captured for a controlled cold production run. No production error conclusion is made. |
| Desktop, 3 cold runs | Not performed: no supported cache-clearing/performance capture surface. |
| Throttled mobile, 3 cold runs | Not performed: no supported network throttle or repeatable mobile profile surface. |

## Before/after comparison

There is no comparable runtime baseline from before Phase 1. Phase 1 recorded generated-file sizes only. Its same-build measurements showed the entry changing from 510,685 B raw / 149,942 B gzip to 286,612 B raw / 91,274 B gzip, while a separate 223,848 B raw / 58,689 B gzip Supabase chunk was emitted. These are artifact measurements, not runtime loading timings. Because the auth provider starts the dynamic import immediately and holds the loading gate until session restoration, the smaller entry alone does not demonstrate improved time to meaningful homepage content.

The Phase 1 report and visualization remain available at [bundle audit](adsrow-javascript-bundle-audit.md), [baseline treemap](adsrow-bundle-treemap-before.html), and [optimized treemap](adsrow-bundle-treemap.html).

## Recommendations

1. **P1 — Capture a repeatable production browser trace before further code changes.** Use Playwright or Chrome DevTools Protocol with a fresh browser context per run, cache disabled, and request/response event logging. Record transfer bytes, initiator, navigation timing, LCP, and a mark for the first meaningful hero content. Run at least three desktop runs and three mobile runs with a documented viewport and throttling profile. **Expected benefit:** establishes the actual bottleneck; no byte or time saving claimed. **Risk:** low; measurement only.
2. **P1 — Reassess the auth loading gate only with session-state evidence.** A public page could render independently of auth initialization only if the navbar can avoid showing incorrect signed-out controls and protected routes still wait for session restoration. **Expected benefit:** could let public prerendered content appear before Supabase completes; amount and timing are unmeasured. **Regression risk:** high, including navbar flicker, incorrect dashboard redirects, and session races. Do not remove or weaken the gate without tests for signed-in cold load, signed-out cold load, refresh, OAuth return, recovery, signup acceptance, and protected routes.
3. **P2 — Measure a `siteContent` split as a controlled experiment.** First separate only pricing/area data from the icon-bearing venue/FAQ data in an isolated change, then compare production request count, compressed bytes, homepage LCP, and all consuming routes. **Expected benefit:** unknown; the homepage currently needs the price value, and an extra request could erase a small byte saving. **Regression risk:** medium; route content or icon exports may be omitted from prerendered pages.

## Tooling limits and next measurement setup

The repository has no Playwright, Cypress, or Lighthouse dependency/script. The available browser tab can navigate, inspect the DOM, and list observed assets, but its evaluation sandbox does not expose `window.performance`; it also does not expose cache controls, network request/initiator events, or throttling. No desktop/mobile numbers, percentiles, or console-clean claims are invented here. A follow-up with an installed Playwright browser and CDP tracing, or DevTools performance exports, is required to complete the six-run comparison.
