import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { createServer } from "vite";
import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";

const startedAt = Date.now();
const mark = (message) => console.log(`[prerender +${Date.now() - startedAt}ms] ${message}`);
const root = path.resolve("dist");
const routes = {
  "/": ["Adsrow | Local Digital Advertising", "Adsrow helps businesses reach local audiences through digital advertising screens.", "index, follow"],
  "/about": ["About Adsrow | Local Digital Advertising", "Learn how Adsrow helps businesses reach local audiences through digital screens.", "index, follow"],
  "/network": ["Adsrow Network | Digital Advertising Screens", "Explore Adsrow digital advertising screens across local venues and communities.", "index, follow"],
  "/packages": ["Packages | Adsrow", "Explore Adsrow campaign packages and audience options.", "index, follow"],
  "/how-it-works": ["How It Works | Adsrow", "See how Adsrow campaigns work from planning to proof of play.", "index, follow"],
  "/why-adsrow": ["Why Adsrow | Local Digital Advertising", "See why businesses use Adsrow to reach nearby customers.", "index, follow"],
  "/faqs": ["FAQs | Adsrow", "Answers to common questions about Adsrow advertising campaigns and screens.", "index, follow"],
  "/blog": ["Blog | Adsrow · Local Advertising Ideas for Vijayawada Businesses", "Guides, ideas and local marketing tips for Vijayawada businesses from the Adsrow team.", "index, follow"],
  "/contact": ["Contact Adsrow", "Contact the Adsrow team about local digital advertising campaigns and venue partnerships.", "index, follow"],
  "/host-a-screen": ["Host a Screen | Adsrow", "Join the Adsrow venue network and host a digital advertising screen.", "index, follow"],
  "/terms": ["Terms of Service | Adsrow", "Adsrow Terms of Service draft for legal review.", "noindex, nofollow"],
  "/privacy": ["Privacy Policy | Adsrow", "Adsrow Privacy Policy draft for legal review.", "noindex, nofollow"],
  "/refund-policy": ["Refund and Cancellation Policy | Adsrow", "Adsrow Refund and Cancellation Policy draft for legal review.", "noindex, nofollow"],
};

const escapeHtml = (value) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
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
    server: { middlewareMode: true, hmr: false, watch: null },
    // The prerender process loads every route deliberately, so Vite's
    // dependency discovery is unnecessary and would start an esbuild worker
    // that can outlive the one-shot render.
    optimizeDeps: { noDiscovery: true },
    appType: "spa",
  });
  mark("Created Vite SSR server with file watching disabled");
  const [{ default: App, preloadAppRoutes }, { AuthProvider }] = await Promise.all([
    vite.ssrLoadModule("/src/App.jsx"),
    vite.ssrLoadModule("/src/context/AuthContext.jsx"),
  ]);
  mark("Loaded React SSR modules");
  await preloadAppRoutes();
  mark("Preloaded route modules");

  for (const [route, [title, description, robots]] of Object.entries(routes)) {
    const appHtml = renderToString(React.createElement(StaticRouter, { location: route }, React.createElement(AuthProvider, null, React.createElement(App))));
    const canonical = `https://adsrow.com${route === "/" ? "/" : route}`;
    const metadata = `<title>${escapeHtml(title)}</title><meta name="description" content="${escapeHtml(description)}"><meta name="robots" content="${robots}"><link rel="canonical" href="${canonical}"><meta property="og:title" content="${escapeHtml(title)}"><meta property="og:description" content="${escapeHtml(description)}"><meta property="og:url" content="${canonical}"><meta property="og:type" content="website"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escapeHtml(title)}"><meta name="twitter:description" content="${escapeHtml(description)}">`;
    const html = cleanTemplate.replace("</head>", `${metadata}</head>`).replace(/<div id="root">[\s\S]*?<\/div>/, `<div id="root">${appHtml}</div>`);
    const directory = path.join(root, route === "/" ? "" : route.slice(1));
    await mkdir(directory, { recursive: true });
    await writeFile(path.join(directory, "index.html"), html);
    mark(`Wrote ${route === "/" ? "/" : route}`);
  }

  // Apache serves this document as the body of an HTTP 404 for paths that do
  // not match a generated route. It uses the same hydrated React tree as the
  // client-side wildcard route, so direct requests and client navigation agree.
  const notFoundHtml = renderToString(React.createElement(StaticRouter, { location: "/__not-found__" }, React.createElement(AuthProvider, null, React.createElement(App))));
  const notFoundMetadata = '<title>Page not found | Adsrow</title><meta name="description" content="The requested Adsrow page could not be found."><meta name="robots" content="noindex, nofollow"><meta property="og:title" content="Page not found | Adsrow"><meta property="og:description" content="The requested Adsrow page could not be found."><meta property="og:type" content="website"><meta name="twitter:card" content="summary"><meta name="twitter:title" content="Page not found | Adsrow"><meta name="twitter:description" content="The requested Adsrow page could not be found.">';
  await writeFile(path.join(root, "404.html"), cleanTemplate.replace("</head>", `${notFoundMetadata}</head>`).replace(/<div id="root">[\s\S]*?<\/div>/, `<div id="root">${notFoundHtml}</div>`));
  mark(`Wrote 404.html; rendered ${Object.keys(routes).length} route documents`);
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
// All route files have been flushed and Vite's server has been closed above.
// Unref only residual watcher/worker handles so Node can finish naturally;
// this does not terminate the process or skip pending work.
for (const handle of process._getActiveHandles?.() || []) {
  const name = handle?.constructor?.name;
  if (["FSWatcher", "MessagePort", "ChildProcess"].includes(name)) handle.unref?.();
}
mark("Prerender complete; allowing Node to exit naturally");
