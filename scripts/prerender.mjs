import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { createServer } from "vite";
import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";

const startedAt = Date.now();
const mark = (message) => console.log(`[prerender +${Date.now() - startedAt}ms] ${message}`);
const root = path.resolve("dist");
const escapeHtml = (value) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const escapeJsonForHtml = (value) => JSON.stringify(value).replaceAll("<", "\\u003c");
const template = await readFile(path.join(root, "index.html"), "utf8");
mark("Loaded Vite HTML template");
const cleanTemplate = template
  .replace(/\s*<title>[\s\S]*?<\/title>/i, "")
  .replace(/\s*<meta\s+name="description"[^>]*>/gi, "");

// Components use browser APIs only in effects or event handlers. These minimal
// render-time shims let React SSR render the same component tree without a DOM.
globalThis.window = { scrollY: 0, matchMedia: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }) };
Object.defineProperty(globalThis, "navigator", { configurable: true, value: { userAgent: "Adsrow prerender" } });
globalThis.document = { title: "", querySelector() { return null; }, createElement() { return {}; }, head: { appendChild() {} } };

let vite;
try {
  // This is a one-shot SSR render, not a development server. Disabling the
  // file watcher prevents chokidar handles from keeping the Node process alive
  // after the generated files have been flushed.
  vite = await createServer({
    root: process.cwd(),
    // Vite drops a null watch value while resolving inline configuration.
    // Ignore every path explicitly so its bundled Chokidar watcher does not
    // open filesystem handles during this one-shot SSR render.
    server: { middlewareMode: true, hmr: false, watch: { ignored: ["**/*"] } },
    // The prerender process loads every route deliberately, so Vite's
    // dependency discovery is unnecessary and would start an esbuild worker
    // that can outlive the one-shot render.
    optimizeDeps: { noDiscovery: true },
    appType: "spa",
  });
  mark("Created Vite SSR server with file watching disabled");
  const [{ default: App, preloadPublicRoutes }, { AuthProvider }, seo] = await Promise.all([
    vite.ssrLoadModule("/src/App.jsx"),
    vite.ssrLoadModule("/src/context/AuthContext.jsx"),
    vite.ssrLoadModule("/src/lib/seoMetadata.js"),
  ]);
  mark("Loaded React SSR modules");
  await preloadPublicRoutes();
  mark("Preloaded route modules");

  for (const route of seo.prerenderedSeoPaths) {
    const { title, description, robots, canonical } = seo.getSeoMetadata(route);
    const appHtml = renderToString(React.createElement(StaticRouter, { location: route }, React.createElement(AuthProvider, null, React.createElement(App))));
    const pageSchema = seo.getPageStructuredData(route);
    const schemaTag = pageSchema ? `<script type="application/ld+json" data-adsrow-page-schema>${escapeJsonForHtml(pageSchema)}</script>` : "";
    const metadata = `<title>${escapeHtml(title)}</title><meta name="description" content="${escapeHtml(description)}"><meta name="robots" content="${robots}"><link rel="canonical" href="${canonical}"><meta property="og:title" content="${escapeHtml(title)}"><meta property="og:description" content="${escapeHtml(description)}"><meta property="og:url" content="${canonical}"><meta property="og:type" content="website"><meta property="og:site_name" content="Adsrow"><meta property="og:locale" content="en_IN"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escapeHtml(title)}"><meta name="twitter:description" content="${escapeHtml(description)}">${schemaTag}`;
    const html = cleanTemplate.replace("</head>", `${metadata}</head>`).replace(/<div id="root">[\s\S]*?<\/div>/, `<div id="root">${appHtml}</div>`);
    const directory = path.join(root, route === "/" ? "" : route.slice(1));
    await mkdir(directory, { recursive: true });
    await writeFile(path.join(directory, "index.html"), html);
    mark(`Wrote ${route === "/" ? "/" : route}`);
  }

  // Apache serves this document as the body of an HTTP 404 for paths that do
  // not match a generated route. It uses the same hydrated React tree as the
  // client-side wildcard route, so direct requests and client navigation agree.
  // Non-prerendered SPA routes (auth, protected, admin, legacy redirects) are
  // served this document by .htaccess. Its root is deliberately EMPTY so the
  // client createRoot() renders fresh instead of hydrating another route's
  // markup, and it carries no canonical/title from any prerendered route.
  const appMetadata = '<title>Adsrow</title><meta name="description" content="Sign in to or manage your Adsrow advertising account."><meta name="robots" content="noindex, nofollow">';
  await writeFile(path.join(root, "app.html"), cleanTemplate.replace("</head>", `${appMetadata}</head>`).replace(/<div id="root">[\s\S]*?<\/div>/, '<div id="root"></div>'));
  mark("Wrote app.html (empty React root for SPA routes)");

  const notFoundHtml = renderToString(React.createElement(StaticRouter, { location: "/__not-found__" }, React.createElement(AuthProvider, null, React.createElement(App))));
  const notFoundMetadata = '<title>Page not found | Adsrow</title><meta name="description" content="The requested Adsrow page could not be found."><meta name="robots" content="noindex, nofollow"><meta property="og:title" content="Page not found | Adsrow"><meta property="og:description" content="The requested Adsrow page could not be found."><meta property="og:type" content="website"><meta name="twitter:card" content="summary"><meta name="twitter:title" content="Page not found | Adsrow"><meta name="twitter:description" content="The requested Adsrow page could not be found.">';
  await writeFile(path.join(root, "404.html"), cleanTemplate.replace("</head>", `${notFoundMetadata}</head>`).replace(/<div id="root">[\s\S]*?<\/div>/, `<div id="root">${notFoundHtml}</div>`));
  mark(`Wrote 404.html; rendered ${seo.prerenderedSeoPaths.length} route documents`);
} finally {
  if (vite) {
    mark("Closing Vite SSR server");
    for (const environment of Object.values(vite.environments || {})) {
      await environment._pluginContainer?.close?.();
      await environment._runner?.close?.();
    }
    await vite.close();
    if (vite.watcher?.close) await vite.watcher.close();
    mark("Vite SSR server closed");
  }
}

const activeHandles = typeof process._getActiveHandles === "function"
  ? process._getActiveHandles().map((handle) => handle?.constructor?.name || "unknown")
  : [];
const activeRequests = typeof process._getActiveRequests === "function"
  ? process._getActiveRequests().map((request) => request?.constructor?.name || "unknown")
  : [];
mark(`Open handles after cleanup: ${activeHandles.length ? activeHandles.join(", ") : "none"}`);
mark(`Open requests after cleanup: ${activeRequests.length ? activeRequests.join(", ") : "none"}`);
mark("Prerender complete; allowing Node to exit naturally");
