# Adsrow JavaScript bundle and loading audit

**Audit date:** 2026-11-11  
**Scope:** Read-only source and dependency inspection plus a clean `npm run build`. No application, dependency, build configuration, or deployment files were changed. The requested report is the only intended file addition.

## Executive findings

The clean production build succeeds, including prerendering. It emits 33 JavaScript files totaling **1,901,841 bytes raw / 551,429 bytes gzip** and four CSS files totaling **298,183 bytes raw**. The HTML entry imports only `index-CdzoTUOU.js` and `index-BttFQHsi.css`; it contains no modulepreload links. The entry JavaScript is **510,685 bytes raw / 149,942 bytes gzip**. This exceeds the proposed main entry target of 80 KB gzip by about 70 KB.

The largest MapLibre chunk is **1,104,948 bytes raw / 300,802 bytes gzip**, but the map is dynamically imported by `VijayawadaCoverageMap` and that component belongs to the Network route. It is not part of the homepage's static entry graph. Homepage initial JS is therefore at least the **149,942-byte gzip entry** plus any deferred imports actually loaded during startup. The generated HTML does not identify or preload additional chunks. Browser network/coverage instrumentation was not performed, so a measured cold-load request total and execution time are not available.

## Build measurements

Sizes below are measured from files in `dist/assets` after the clean production build. Gzip figures use Node's `zlib.gzipSync` on each standalone file; sums do not model HTTP transfer headers, server Brotli, or cross-file dictionary compression. Worker files are included in the all-JS total although the 519 KB worker is a separate execution context and is not the main thread entry.

| Metric | Measured |
|---|---:|
| JavaScript files/chunks | 33 |
| Total JavaScript, raw | 1,901,841 B (1.81 MiB) |
| Total JavaScript, gzip | 551,429 B (538.5 KiB) |
| CSS files | 4 |
| Total CSS, raw | 298,183 B (291.2 KiB) |
| Entry JavaScript | 510,685 B raw / 149,942 B gzip |
| Homepage initial JS minimum from HTML entry | 510,685 B raw / 149,942 B gzip |
| Largest chunk: MapLibre library | 1,104,948 B raw / 300,802 B gzip |
| Largest worker artifact | 519,370 B raw; emitted as `.mjs` worker asset |

“Homepage initial JS minimum” means the entry module named in prerendered `dist/index.html`. This is a lower bound on actual requests if runtime code imports further chunks during startup. `dist/index.html` contains a single `<script type="module">` and no `modulepreload` tags. Vite/Rollup emits the static route chunks separately, but no browser waterfall was collected.

### Largest 15 JavaScript chunks

| Rank | Chunk | Raw bytes | Gzip bytes | Role inferred from name/import graph |
|---:|---|---:|---:|---|
| 1 | `maplibre-gl-D5C6S3GN.js` | 1,104,948 | 300,802 | Map library; dynamically imported from coverage map |
| 2 | `index-CdzoTUOU.js` | 510,685 | 149,942 | Eager app entry plus shared runtime/dependencies |
| 3 | `siteContent-C8SihA0n.js` | 94,766 | 32,729 | Shared content and icon component exports |
| 4 | `LegalPages-BlUcdvEW.js` | 40,096 | 14,016 | Legal pages; also imported by auth registration |
| 5 | `HomePage-CCs6yPQ8.js` | 33,835 | 9,897 | Lazy homepage route |
| 6 | `AdminPages-BUye50-Q.js` | 25,028 | 7,458 | Lazy admin route |
| 7 | `PackageComparisonPage-D_CtwnGm.js` | 15,072 | 5,299 | Lazy packages route |
| 8 | `ContactPage-Dgsvvs12.js` | 12,427 | 4,641 | Lazy contact route |
| 9 | `AuthPages-DkA_Skvu.js` | 10,688 | 4,202 | Login/signup route module |
| 10 | `BlogPage-CNCHGQ1R.js` | 9,350 | 3,243 | Blog index/article module |
| 11 | `NetworkPage-Bp3m_GPA.js` | 8,779 | 3,261 | Network route; loads map dependency when map initializes |
| 12 | `HostAScreenPage-vaH3yTwV.js` | 5,224 | 1,884 | Host a Screen route |
| 13 | `AuthRecoveryPages-C-cJXsjC.js` | 4,778 | 1,726 | Forgot/reset password routes |
| 14 | `AboutPage-CRolpANE.js` | 4,374 | 1,644 | About route |
| 15 | `packageData-CFrP66wx.js` | 3,773 | 1,666 | Shared package data |

## Dependency contributors and loading

The build does not generate a module-level treemap or per-package byte attribution. Exact package contributions cannot be derived from chunk file sizes alone because Rollup combines modules, tree-shakes exports, and shares code between chunks. The chunk mapping here is therefore approximate and based on imports, package graph, and emitted chunk names, not a claim of exact package size.

| Package | Installed version | Approximate contribution evidence | Importing code / timing | Smaller strategy to evaluate |
|---|---:|---|---|---|
| `maplibre-gl` | 6.16.0 | Its emitted chunk measures 1,104,948 B / 300,802 B gzip; includes package dependency code and should not be read as the package's exact isolated contribution. | `src/components/VijayawadaCoverageMap.jsx`; dynamic import, Network route only | Keep the dynamic boundary; investigate whether map initialization itself can be delayed until visible. Any replacement requires feature comparison and measured benefit. |
| `@supabase/supabase-js` | 2.118.0 | Exact isolated bytes unavailable; included in shared `index` chunk due eager import via auth context. | `src/lib/supabase.js` -> `src/context/AuthContext.jsx` -> `src/main.jsx`; eager on every route | Separate auth bootstrap/client import from non-auth app code only if auth state and protected routes remain correct. Measure graph after a future change. |
| `react`, `react-dom` | 19.3.1 | Combined framework/runtime is in the 510,685 B entry; no package-specific attribution was produced. | `src/main.jsx`, App and all components; necessarily eager | No replacement suggested. Inspect entry composition with a module visualizer before structural changes. |
| `react-router-dom`, `react-router` | 7.18.4 / transitive 7.18.4 | In shared entry; no isolated contribution measured. | `src/main.jsx`, `src/App.jsx`, layout and route components; eager | No obvious small replacement; tree-shaking and router setup need module-level inspection. |
| `lucide-react` | 1.61.0 | Individual icon chunks are mostly 0.16–0.72 KB raw; shared `siteContent` is 94,766 B and contains content plus icon exports, so it is not attributable to Lucide alone. | Imported across shared layout, many pages, and content; route imports lazy except shared header/footer | Keep named imports. Check `siteContent` fan-out and barrel exports; no library replacement benefit is established. |
| `@animateicons/react` | 0.13.0 | Used by `VenueShowcaseCarousel` and `siteContent`; contribution not isolated. | Component imports plus shared `siteContent`; routes depending on shared content can request it | Confirm whether animated variants are used on every route; split component exports if a measured graph shows broad inclusion. |
| Chart library | None installed | No chart package detected. Admin chart appears CSS-rendered. | `src/pages/AdminPages.jsx` and `src/globals.css` | None. |
| UI component libraries | None installed | No general UI-kit package in direct dependency list. | N/A | None. |
| Utility libraries | Mostly transitive | Several small dependencies in lockfile; no evidence of a large standalone utility bundle. | Depends on parent packages | Avoid replacing or removing without module-level evidence. |

`npm ls --depth=0` shows one installed version of each direct dependency. Supabase's `auth-js`, `functions-js`, `postgrest-js`, `realtime-js`, and `storage-js` are expected component packages of the Supabase SDK, not duplicated copies. The installed graph did not show duplicate React versions at depth zero. This is not a complete duplicate-version audit of every transitive package; `npm ls` did not report duplicates in the observed output.

## Route-level loading analysis

`src/App.jsx` wraps routes in `Suspense` and uses the project's `lazyRoute()` helper for each page. Therefore route modules are lazy in the browser. Prerendering calls `preloadAppRoutes()` to load all route modules on the server during the build; that build-time behavior does not mean all route chunks are sent to a browser. Shared `Layout`, `Header`, `Footer`, `AuthProvider`, and router runtime are eager.

| Route | Route chunk(s) | Notable additional code | Assessment |
|---|---|---|---|
| Homepage | `HomePage` plus `siteContent`, `SiteComponents`, `packageData` where referenced | Auth context, header/footer and entry are already eager. | Lazy route is correctly configured. Review imported components and shared content fan-out; no extra map dependency is expected. |
| About | `AboutPage`, shared content/components | Common header/footer | Lazy; small route chunk. |
| Network | `NetworkPage`, shared content/components, `maplibre-gl` and worker on map initialization | Map CSS is imported by map component | Lazy route; the large map chunk is appropriately kept out of homepage until route/map code runs. |
| Packages | `PackageComparisonPage`, `packageData`, shared content/components | Comparison and enquiry components | Lazy; inspect shared icon/content bundle if packages loads more than required. |
| Blog | `BlogPage`, shared content/components | Same module serves list/article export | Lazy; blog article and list currently share a module. Separate only if route visit measurements justify it. |
| Contact | `ContactPage`, shared content/components | Enquiry and dashboard helpers | Lazy route, although shared `AuthProvider` imports some Supabase-backed modules eagerly. |
| FAQs | `FaqsPage`, shared content/components | FAQ data in shared content | Lazy; small dedicated route chunk. |
| Host a Screen | `HostAScreenPage`, shared content/components | Enquiry flow | Lazy route; small dedicated route chunk. |
| Login | `AuthPages` plus legal page module | `AuthPages.jsx` imports `LegalPages.jsx` for acceptance content | Lazy route module, but legal module (40 KB raw / 14 KB gzip) is pulled for login/signup due shared registration/legal acceptance logic. Verify acceptance needs before splitting. |
| Signup | `AuthPages` plus legal page module | Same as Login | Lazy route module; same dependency coupling. |
| Dashboard | `DashboardPage` | Auth context/Supabase already eager | Lazy page, protected wrapper is in App. |
| Admin | `AdminPages` | Admin data and Supabase auth/backend | Lazy route; admin page chunk is 25 KB raw / 7.5 KB gzip. |

### Eager versus lazy

Eager from the entry path: React, React DOM, React Router, `main.jsx`, global and loading CSS, App route table, Layout/Header/Footer, `AuthProvider`, `supabase.js`, and `welcomeEmail.js` through AuthContext. This means Supabase is not outside the critical rendering path today: `AuthProvider` eagerly imports the client module and initializes auth state for every route. The SDK may tree-shake some APIs, but no per-package report was generated, so its exact impact is unknown.

Lazy by route: page modules listed above, including admin, dashboard, auth, and legal pages. MapLibre is a further dynamic import inside the Network map component. No charting or large UI-kit dependency is present. `lucide-react` named imports are used broadly; emitted tiny icon chunks indicate per-icon tree-shaking is functioning, while the large `siteContent` chunk warrants module-level inspection.

## Critical rendering and runtime observations

- The prerendered homepage contains meaningful metadata and rendered route markup, but `src/main.jsx` hydrates it only after the 150 KB gzip entry downloads, parses, and executes. SSR improves content availability to crawlers and users with JS disabled; it does not remove the hydration cost.
- The HTML has one module script and no modulepreloads. Vite's entry chunk imports shared and route chunks as runtime needs them. Exact request waterfalls require browser DevTools or a performance trace; this audit did not run a browser.
- The entry imports `AuthProvider`; auth session setup and the Supabase client module therefore execute on public pages. Auth context can affect page loading state and should not be deferred without checking visible behavior and protected-route correctness.
- MapLibre's library module is dynamic, but its worker asset is emitted separately. It should be expected on the Network page once the map component initializes, not on the home route based on static imports.
- The clean build reports a >500 KB minified chunk warning. It applies to the MapLibre and main entry assets. The measured gzip entry also misses the proposed 80 KB target.
- Actual main-thread long tasks, time to first meaningful paint, LCP, and mobile network transfer were not measured. A browser trace on representative desktop and throttled mobile is needed before ranking runtime cost conclusively.

## Dead code and duplication

- **Confirmed unused source page:** `src/pages/AdvertisePage.jsx` has no import or route reference found. It appears dead in the browser build. Keep confirmation conservative because external tooling or future consumers are not covered by source search.
- **Potentially unused packages:** `@animateicons/react` is imported via its `/lucide` subpath, so it is used. `@supabase/supabase-js`, `maplibre-gl`, `lucide-react`, React, and router packages are used. No direct dependency is proven unused by this scan.
- **No chart or general component framework:** searches found no Recharts, D3, Framer Motion, or similar chart/animation suite; charts appear CSS-based.
- **Potential code sharing coupling:** `AuthPages.jsx` imports legal section exports from `LegalPages.jsx`, causing the larger legal module to be a dependency for login/signup. This is real coupling, but not automatically dead code or avoidable work because legal acceptance is part of signup.
- **Duplicated dependencies:** no duplicate direct package versions found. No duplicate transitive versions were identified in the observed npm tree output. A full `npm dedupe` or lockfile mutation was not performed, per audit-only scope.
- **Repeated utility code:** a full AST-based duplicate-code scan was not available. No repeated large third-party utility imports stood out in source inspection. Do not characterize smaller repeated helpers as confirmed duplication without a code similarity scan.

## Targets

| Target | Current evidence | Status |
|---|---|---|
| Homepage initial JS <100 KB gzip | Entry alone is 149,942 B gzip; browser waterfall not measured | Fails on entry lower bound |
| Main entry <80 KB gzip | 149,942 B gzip | Fails |
| Route JS only when needed | `lazyRoute()` is used for routes; shared shell is eager | Mostly met; verify runtime requests |
| Supabase outside initial critical path | Eager import through AuthContext | Fails |
| MapLibre only on map pages | Dynamic import from coverage map on Network route | Meets static loading design; browser confirmation pending |
| No unnecessary duplicate dependencies | One direct version per package; transitive full audit not established | No known issue; incomplete confirmation |

## Prioritized recommendations

Savings below are deliberately not asserted as measured. Without a module visualizer and paired builds, reliable byte reductions cannot be claimed. Estimated savings are marked **unquantified** where the evidence does not support a numeric estimate.

### P0 — Capture a browser baseline before optimizing

- **Problem:** Build sizes do not reveal real request waterfall, parse/compile cost, LCP, or long tasks.
- **Files:** `dist/index.html`, `src/main.jsx`, `src/App.jsx` (measurement targets; no changes proposed in this audit).
- **Proposed change:** Use browser DevTools or Lighthouse/WebPageTest for cold homepage, auth route, and Network route on desktop and throttled mobile. Record transfer sizes, initiators, LCP, and main-thread long tasks.
- **Estimated reduction:** None claimed; measurement only.
- **Risks:** Lab runs vary with network and cache; repeat and compare equivalent runs.
- **Testing:** At least three cold-cache runs per viewport; validate actual route and map behavior.

### P1 — Remove Supabase SDK from public-page entry path if auth behavior permits

- **Problem:** `AuthContext` imports `supabase.js` at app startup; Supabase contributes to the shared entry and public pages.
- **Files:** `src/main.jsx`, `src/context/AuthContext.jsx`, `src/lib/supabase.js`, and any components that require auth context.
- **Proposed change:** Consider a deferred auth bootstrap/client boundary, while preserving header auth state, signup acceptance, redirects, and protected route handling. First use a bundle visualizer to attribute actual SDK bytes.
- **Estimated reduction:** **Unquantified**; exact Supabase bytes inside entry were not isolated. This is the only proposed architectural change directly aligned to the stated target.
- **Risks:** Delayed user state can cause header flicker, stale auth transitions, or protected-route races; signup and OAuth flows are sensitive.
- **Testing:** Build graph before/after; cold public routes; login, signup, session restore, signout, reset flow, dashboard guard; hydration and SSR checks.

### P1 — Attribute and split the shared entry safely

- **Problem:** Entry is 510,685 B raw / 149,942 B gzip and contains React/router plus shared shell and backend code; current logs cannot attribute module contribution.
- **Files:** `vite.config.js`, `src/main.jsx`, `src/App.jsx`, shared components. Audit-only: no changes made.
- **Proposed change:** Generate a module-level treemap/report in a separate analysis run; then evaluate whether shared chunks can be deferred without forcing extra network round trips on every route. Avoid arbitrary manual chunking until graph evidence shows a benefit.
- **Estimated reduction:** **Unquantified.** Splitting changes per-file sizes and may increase request count; no savings claimed.
- **Risks:** Circular dependencies, waterfall regressions, changed hydration timing, cache churn.
- **Testing:** Paired cold/warm waterfall, entry gzip, all prerendered routes and `app.html` SPA shell, error/reload behavior.

### P2 — Investigate shared `siteContent` fan-out

- **Problem:** `siteContent-C8SihA0n.js` is 94,766 B raw / 32,729 B gzip and is the third-largest JS chunk. It combines content/icon exports referenced by several pages.
- **Files:** `src/lib/siteContent.js`, `src/pages/*`, `src/components/*`.
- **Proposed change:** Use module graph evidence to identify which content and icon exports force this chunk for each route; split by feature only when routes demonstrably need less.
- **Estimated reduction:** **Unquantified**; the chunk's full size is not removable because several routes use its contents.
- **Risks:** More chunks and requests, prerender import changes, mistaken assumptions about shared exports.
- **Testing:** Route-by-route request coverage and prerender output for all 13 generated routes.

### P2 — Keep MapLibre deferred and measure map startup separately

- **Problem:** MapLibre and worker are large (300,802 B gzip library; worker 519,370 B raw) even though they are page-specific.
- **Files:** `src/components/VijayawadaCoverageMap.jsx`, `src/pages/NetworkPage.jsx`.
- **Proposed change:** Preserve current dynamic import; evaluate visibility-triggered initialization only if the Network route trace shows costly early loading before the map is viewed. Do not replace MapLibre without measured alternatives.
- **Estimated reduction:** **0 B from homepage expected** because the current import is already dynamic; possible Network-route startup deferral is not a transfer-size saving and is unquantified.
- **Risks:** Delayed map readiness, observer cleanup bugs, accessibility and interaction regressions.
- **Testing:** Direct `/network` navigation, map loads and worker runs, keyboard/zoom controls, mobile, prerender and preview behavior.

### P3 — Verify dead source and dependency candidates

- **Problem:** `AdvertisePage.jsx` has no in-repository import/route; `@animateicons/react` is used and the remaining dependencies are referenced, so package removal is not justified.
- **Files:** `src/pages/AdvertisePage.jsx`, `package.json`, `package-lock.json`.
- **Proposed change:** Confirm no external import contract or planned route before removing dead source in a separate change; do not remove dependencies based on package presence alone.
- **Estimated reduction:** No bundle savings claimed; unreachable page code should already be excluded by the production build.
- **Risks:** Hidden route expectation or external tooling reliance.
- **Testing:** Route inventory, source reference scan, production output comparison.

## Method and limits

The audit ran `npm run build`, counted emitted files, measured each JavaScript file and CSS total, gzipped JS files independently, inspected the generated HTML, checked direct dependency versions with `npm ls --depth=0`, and searched source imports/routes. The build transformed 3,055 modules and generated 13 prerendered route documents, `app.html`, and `404.html`. It completed successfully and printed the large-chunk warning.

No app source was modified. This report does not include a module-level dependency treemap, browser network trace, Lighthouse metrics, code coverage session, AST dead-code analysis, or live-host verification. Those are required to turn the approximate dependency discussion into exact per-package attribution and to quantify optimization savings.

## Phase 1 implementation and verification (2026-11-11)

The Rollup visualizer is now available in analysis builds. Run `ANALYZE=true npm run build` in Bash/macOS/Linux, or `$env:ANALYZE='true'; npm run build` in PowerShell. The HTML treemap artifacts are [before](adsrow-bundle-treemap-before.html) and [after](adsrow-bundle-treemap.html). Their paths are included here for relative navigation in the report; the generated HTML contains module IDs, chunk membership, Rollup rendered lengths and gzip/Brotli estimates.

The analyzer's per-module rendered/gzip values are useful for identifying ownership and relative contributors, but they do not add up to final minified file sizes: Vite applies a later minification step, and module compression estimates do not model cross-module compression. Therefore exact production byte totals below are from the emitted artifacts, while package-level byte attribution from the treemap is explicitly approximate. The production Supabase chunk is an exact emitted total after the split.

| Same `ANALYZE=true npm run build` procedure | Before | After | Change |
|---|---:|---:|---:|
| Entry JS | 510,685 B raw / 149,942 B gzip | 286,612 B raw / 91,274 B gzip | −224,073 B raw / −58,668 B gzip (−39.1% gzip) |
| Separate Supabase JS chunk | 0 B | 223,848 B raw / 58,689 B gzip | Deferred from entry |
| All JS files | 33 | 35 | +2 chunks |
| Total emitted JS | 1,901,841 B raw / 551,429 B gzip | 1,902,026 B raw / 551,678 B gzip | +185 B raw / +249 B gzip |
| CSS | 298,183 B raw | 298,183 B raw | unchanged |

The entry reduction is directly measured. The account/library is no longer bundled into the entry, but `AuthProvider` still starts its dynamic import immediately and keeps the existing loading screen up until session restoration completes. So Supabase is removed from the entry file, while session initialization remains on the app's startup path to preserve the previous navbar and protected-route behavior. The total first-visit transfer can still include the 58.7 KB gzip Supabase chunk; the win is a smaller entry and clearer async boundary, not a claim that auth bytes are no longer needed on startup.

The split is implemented in `src/context/AuthContext.jsx` and `src/lib/supabaseConfig.js`: the context reads the lightweight configuration flag synchronously, then dynamically imports the SDK and session client, and loads `welcomeEmail` only for confirmed authenticated sessions. The context retains its initial loading gate, auth event subscription, revision guard against stale session results, and cleanup. `src/lib/supabase.js` remains the client module used by auth and protected page code. Legal acceptance and route prerendering were not changed.

### Measured package and shared-module attribution

The emitted production chunks provide exact boundaries for modules that are split into their own file. Before the optimization, Supabase SDK code and its transitive packages were inside the entry. Afterward, their shared output is the 223,848 B raw / 58,689 B gzip `supabase-*` chunk. It is imported by the auth bootstrap and by lazy auth/admin/data routes. It is not correct to call all 58.7 KB a reduction in total bytes; it is the measured amount moved out of the entry.

React, React DOM, and React Router remain in the entry alongside application runtime code. The treemap marks the React Router module and React package modules, but Vite's subsequent minification and shared helper folding mean there is no exact additive per-package byte count in the emitted entry. The treemap's `renderedLength` / `gzipLength` values are therefore reported as analyzer attribution, not final production transfer sizes. Exact chunk-level measurements remain 286,612 B / 91,274 B gzip for the complete entry.

`siteContent-CkQJziaS.js` remains 94,766 B raw / 32,728 B gzip. The treemap shows `@animateicons/react` code as the largest identifiable contributor within that shared content area, while Lucide named imports are separately tree-shaken into small icon modules. Source imports show `siteContent.js` used by Network, Contact, FAQs, Host a Screen, the homepage's `Adsrow99Banner`, package data, and the map component. Since homepage's banner imports pricing from this file and the same file binds animated icon components into content arrays, the shared content chunk is needed on the homepage. Safe follow-up: separate the small campaign pricing/area values from venue/FAQ/icon data, then compare the homepage's actual requested chunks and all routes. No split was made here because the shared module requires a broader behavior-preserving test and Phase 1's measured entry reduction already came from auth deferral.

### Browser and routing evidence

No pre-existing Playwright, Cypress, or browser-smoke test suite is defined in the repository. The existing `scripts/preview-hostinger.mjs` was used as the production-like server. The local preview HTTP smoke check passed 16 requests: homepage; About, Network, Packages, Blog, Contact, FAQs, Host a Screen; login, signup, forgot password, reset password, dashboard, admin; and genuine 404 responses for an unknown route and missing JS asset.

The optimized production preview was also opened in a browser at `localhost:4189`, while the existing development app was checked at the requested `localhost:5173`. Direct browser navigation rendered the homepage and all 13 tested content/auth/protected routes without the app error screen. Signup rendered legal acceptance content. The Network route produced a MapLibre canvas and no browser console errors. This verified map behavior without changing MapLibre. These checks did not submit credentials, OAuth, recovery, or signup forms, so third-party auth transactions and a real signed-in session were not exercised.

The production build and prerender both passed. It generated all 13 static route documents, `app.html`, and `404.html`; prerendering architecture and output were preserved. `npm ls --depth=0` shows the newly added `rollup-plugin-visualizer@7.1.3` and no change to runtime dependencies. The analyzer is opt-in and does not affect regular builds.
