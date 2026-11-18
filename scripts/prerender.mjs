import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { createServer } from "vite";
import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import { canonicalUrl } from "../src/lib/canonicalUrl.mjs";

const startedAt = Date.now();
const mark = (message) =>
  console.log(`[prerender +${Date.now() - startedAt}ms] ${message}`);

const root = path.resolve("dist");

const routes = {
  "/": [
    "Adsrow | Local Digital Screen Advertising",
    "Adsrow helps businesses reach local audiences through digital advertising screens.",
    "index, follow",
  ],
  "/about": [
    "About Adsrow | Local Digital Advertising",
    "Learn how Adsrow helps businesses reach local audiences through digital screens.",
    "index, follow",
  ],
  "/network": [
    "Adsrow Network | Digital Advertising Screens",
    "Explore Adsrow digital advertising screens across local venues and communities.",
    "index, follow",
  ],
  "/packages": [
    "Packages | Adsrow",
    "Explore Adsrow campaign packages and audience options.",
    "index, follow",
  ],
  "/how-it-works": [
    "How It Works | Adsrow",
    "See how Adsrow campaigns work from planning to proof of play.",
    "index, follow",
  ],
  "/why-adsrow": [
    "Why Adsrow | Local Digital Advertising",
    "See why businesses use Adsrow to reach nearby customers.",
    "index, follow",
  ],
  "/faqs": [
    "FAQs | Adsrow",
    "Answers to common questions about Adsrow advertising campaigns and screens.",
    "index, follow",
  ],
  "/blog": [
    "Blog | Adsrow · Local Advertising Ideas for Vijayawada Businesses",
    "Guides, ideas and local marketing tips for Vijayawada businesses from the Adsrow team.",
    "index, follow",
  ],
  "/contact": [
    "Contact Adsrow",
    "Contact the Adsrow team about local digital advertising campaigns and venue partnerships.",
    "index, follow",
  ],
  "/host-a-screen": [
    "Host a Screen | Adsrow",
    "Join the Adsrow venue network and host a digital advertising screen.",
    "index, follow",
  ],
  "/terms": [
    "Terms of Service | Adsrow",
    "Adsrow Terms of Service.",
    "noindex, nofollow",
  ],
  "/privacy": [
    "Privacy Policy | Adsrow",
    "Adsrow Privacy Policy.",
    "noindex, nofollow",
  ],
  "/refund-policy": [
    "Refund and Cancellation Policy | Adsrow",
    "Adsrow Refund and Cancellation Policy.",
    "noindex, nofollow",
  ],
};

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

function cleanHtmlTemplate(html) {
  return html
    .replace(/<title>[\s\S]*?<\/title>/i, "")
    .replace(/<meta\b(?=[^>]*\bname=["']description["'])[^>]*>/gi, "")
    .replace(/<meta\b(?=[^>]*\bname=["']robots["'])[^>]*>/gi, "")
    .replace(/<link\b(?=[^>]*\brel=["']canonical["'])[^>]*>/gi, "")
    .replace(/<meta\b(?=[^>]*\bproperty=["']og:title["'])[^>]*>/gi, "")
    .replace(/<meta\b(?=[^>]*\bproperty=["']og:description["'])[^>]*>/gi, "")
    .replace(/<meta\b(?=[^>]*\bproperty=["']og:url["'])[^>]*>/gi, "")
    .replace(/<meta\b(?=[^>]*\bproperty=["']og:type["'])[^>]*>/gi, "")
    .replace(/<meta\b(?=[^>]*\bname=["']twitter:card["'])[^>]*>/gi, "")
    .replace(/<meta\b(?=[^>]*\bname=["']twitter:title["'])[^>]*>/gi, "")
    .replace(
      /<meta\b(?=[^>]*\bname=["']twitter:description["'])[^>]*>/gi,
      ""
    );
}

function replaceHead(html, metadata) {
  if (!html.includes("</head>")) {
    throw new Error("Could not find </head> in the HTML template.");
  }

  return html.replace("</head>", `${metadata}</head>`);
}

function replaceRoot(html, content) {
  const rootPattern = /<div id="root">\s*<\/div>/;

  if (!rootPattern.test(html)) {
    throw new Error(
      'Could not find the empty <div id="root"></div> in the HTML template.'
    );
  }

  return html.replace(rootPattern, `<div id="root">${content}</div>`);
}

function createMetadata({ title, description, robots, canonical }) {
  const safeTitle = escapeHtml(title);
  const safeDescription = escapeHtml(description);

  const canonicalMetadata =
    canonical && robots !== "noindex, nofollow"
      ? `<link rel="canonical" href="${escapeHtml(canonical)}">`
      : "";

  const openGraphUrl =
    canonical && robots !== "noindex, nofollow"
      ? `<meta property="og:url" content="${escapeHtml(canonical)}">`
      : "";

  return `
    <title>${safeTitle}</title>
    <meta name="description" content="${safeDescription}">
    <meta name="robots" content="${robots}">
    ${canonicalMetadata}
    <meta property="og:title" content="${safeTitle}">
    <meta property="og:description" content="${safeDescription}">
    ${openGraphUrl}
    <meta property="og:type" content="website">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${safeTitle}">
    <meta name="twitter:description" content="${safeDescription}">
  `;
}

const template = await readFile(path.join(root, "index.html"), "utf8");
const cleanTemplate = cleanHtmlTemplate(template);

mark("Loaded and cleaned Vite HTML template");

// Components use browser APIs only in effects or event handlers.
// These minimal shims allow React SSR to render without a browser DOM.
globalThis.window = {
  scrollY: 0,
  matchMedia: () => ({
    matches: false,
    addEventListener() {},
    removeEventListener() {},
  }),
};

Object.defineProperty(globalThis, "navigator", {
  configurable: true,
  value: { userAgent: "Adsrow prerender" },
});

globalThis.document = {
  title: "",
  querySelector() {
    return null;
  },
  createElement() {
    return {};
  },
  head: {
    appendChild() {},
  },
};

let vite;

try {
  vite = await createServer({
    root: process.cwd(),
    server: {
      middlewareMode: true,
      hmr: false,
      watch: null,
    },
    optimizeDeps: {
      noDiscovery: true,
    },
    appType: "spa",
  });

  mark("Created Vite SSR server with file watching disabled");

  const [
    { default: App, preloadAppRoutes },
    { AuthProvider },
  ] = await Promise.all([
    vite.ssrLoadModule("/src/App.jsx"),
    vite.ssrLoadModule("/src/context/AuthContext.jsx"),
  ]);

  mark("Loaded React SSR modules");

  await preloadAppRoutes();
  mark("Preloaded route modules");

  // Generate prerendered HTML for every configured route.
  for (const [route, [title, description, robots]] of Object.entries(routes)) {
    const appHtml = renderToString(
      React.createElement(
        StaticRouter,
        { location: route },
        React.createElement(
          AuthProvider,
          null,
          React.createElement(App)
        )
      )
    );

    const canonical =
      robots === "noindex, nofollow" ? null : canonicalUrl(route);

    const metadata = createMetadata({
      title,
      description,
      robots,
      canonical,
    });

    const html = replaceRoot(
      replaceHead(cleanTemplate, metadata),
      appHtml
    );

    const directory = path.join(
      root,
      route === "/" ? "" : route.slice(1)
    );

    await mkdir(directory, { recursive: true });

    await writeFile(
      path.join(directory, "index.html"),
      html,
      "utf8"
    );

    mark(`Wrote ${route === "/" ? "/" : route}`);
  }

  // SPA fallback document.
  // The root remains empty because React createRoot() renders on the client.
  const appMetadata = `
    <title>Adsrow</title>
    <meta name="description" content="Sign in to or manage your Adsrow advertising account.">
    <meta name="robots" content="noindex, nofollow">
  `;

  const appDocument = replaceRoot(
    replaceHead(cleanTemplate, appMetadata),
    ""
  );

  await writeFile(
    path.join(root, "app.html"),
    appDocument,
    "utf8"
  );

  mark("Wrote app.html (empty React root for SPA routes)");

  // Custom 404 document.
  const notFoundHtml = renderToString(
    React.createElement(
      StaticRouter,
      { location: "/__not-found__" },
      React.createElement(
        AuthProvider,
        null,
        React.createElement(App)
      )
    )
  );

  const notFoundMetadata = `
    <title>Page not found | Adsrow</title>
    <meta name="description" content="The requested Adsrow page could not be found.">
    <meta name="robots" content="noindex, nofollow">
    <meta property="og:title" content="Page not found | Adsrow">
    <meta property="og:description" content="The requested Adsrow page could not be found.">
    <meta property="og:type" content="website">
    <meta name="twitter:card" content="summary">
    <meta name="twitter:title" content="Page not found | Adsrow">
    <meta name="twitter:description" content="The requested Adsrow page could not be found.">
  `;

  const notFoundDocument = replaceRoot(
    replaceHead(cleanTemplate, notFoundMetadata),
    notFoundHtml
  );

  await writeFile(
    path.join(root, "404.html"),
    notFoundDocument,
    "utf8"
  );

  mark(
    `Wrote 404.html; rendered ${Object.keys(routes).length} route documents`
  );
} finally {
  if (vite) {
    mark("Closing Vite SSR server");

    for (const environment of Object.values(vite.environments || {})) {
      await environment._pluginContainer?.close?.();
      await environment._runner?.close?.();
    }

    await vite.close();

    if (vite.watcher?.close) {
      await vite.watcher.close();
    }

    mark("Vite SSR server closed");
  }
}

const activeHandles =
  typeof process._getActiveHandles === "function"
    ? process
        ._getActiveHandles()
        .map((handle) => handle?.constructor?.name || "unknown")
    : [];

const activeRequests =
  typeof process._getActiveRequests === "function"
    ? process
        ._getActiveRequests()
        .map((request) => request?.constructor?.name || "unknown")
    : [];

mark(
  `Open handles after cleanup: ${
    activeHandles.length ? activeHandles.join(", ") : "none"
  }`
);

mark(
  `Open requests after cleanup: ${
    activeRequests.length ? activeRequests.join(", ") : "none"
  }`
);

// Unref residual handles so Node can exit naturally.
// This does not terminate pending work.
for (const handle of process._getActiveHandles?.() || []) {
  const name = handle?.constructor?.name;

  if (["FSWatcher", "MessagePort", "ChildProcess"].includes(name)) {
    handle.unref?.();
  }
}

mark("Prerender complete; allowing Node to exit naturally");