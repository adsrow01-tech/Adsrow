#!/usr/bin/env node
// Hostinger-equivalent preview server for the Adsrow dist/ build.
// Mirrors public/.htaccess behaviour so local verification matches Apache:
//   1. serve existing files/directories as-is (directories -> index.html)
//   2. missing files with an extension -> real 404 (never SPA HTML)
//   3. non-prerendered SPA routes (auth/protected/legacy) -> app.html
//   4. every other extensionless path -> real HTTP 404 with 404.html body
//   5. canonical HTTPS redirect only when the request Host is adsrow.com
// Usage: node scripts/preview-hostinger.mjs [--port 4173]

import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";

const root = path.resolve("dist");
const portArg = process.argv.indexOf("--port");
const port = Number(portArg > -1 ? process.argv[portArg + 1] : process.env.PORT || 4173);

// Keep in sync with the RewriteRule whitelist in public/.htaccess.
const SPA_SHELL_ROUTES = new Set([
  "login",
  "signup",
  "forgot-password",
  "reset-password",
  "dashboard",
  "admin",
  "partner-form",
  "advertise",
  "advertise/enquiry",
  "locations",
  "package-comparison",
]);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".wasm": "application/wasm",
};

const baseHeaders = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "SAMEORIGIN",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};

const send = (res, status, headers, body) => {
  res.writeHead(status, { ...baseHeaders, ...headers });
  res.end(body);
};

const sendFile = async (res, status, filePath) => {
  try {
    const [body, info] = await Promise.all([readFile(filePath), stat(filePath)]);
    const ext = path.extname(filePath).toLowerCase();
    const cache = /\.(js|mjs|css|png|jpe?g|webp|svg|ico|woff2?)$/.test(ext)
      ? "public, max-age=31536000"
      : "no-cache";
    send(res, status, { "Content-Type": MIME[ext] || "application/octet-stream", "Cache-Control": cache, "Content-Length": info.size }, body);
    return true;
  } catch {
    return false;
  }
};

const notFound = async (res) => {
  const served = await sendFile(res, 404, path.join(root, "404.html"));
  if (!served) send(res, 404, { "Content-Type": "text/plain; charset=utf-8" }, "404 Not Found");
};

createServer(async (req, res) => {
  const host = (req.headers.host || "").toLowerCase();
  if (req.headers["x-forwarded-proto"] !== "https" && /^(?:www\.)?adsrow\.com$/.test(host)) {
    send(res, 301, { Location: `https://adsrow.com${req.url}` }, "");
    return;
  }

  const pathname = decodeURIComponent((req.url || "/").split("?")[0]);
  const filePath = path.normalize(path.join(root, pathname));
  if (!filePath.startsWith(root)) {
    await notFound(res);
    return;
  }

  // 1. existing file or directory
  try {
    const info = await stat(filePath);
    if (info.isDirectory()) {
      if (await sendFile(res, 200, path.join(filePath, "index.html"))) return;
      await notFound(res);
      return;
    }
    if (await sendFile(res, 200, filePath)) return;
    await notFound(res);
    return;
  } catch {
    /* fall through, like mod_rewrite conditions that fail */
  }

  // 2. missing asset-looking paths stay 404
  if (/\.[^/]+$/.test(pathname)) {
    await notFound(res);
    return;
  }

  // 3. SPA shell routes (auth/protected/legacy) -> app.html
  const clean = pathname.replace(/\/+$/, "").slice(1);
  if (SPA_SHELL_ROUTES.has(clean)) {
    if (await sendFile(res, 200, path.join(root, "app.html"))) return;
    await notFound(res);
    return;
  }

  // 4. unknown extensionless path -> genuine 404
  await notFound(res);
}).listen(port, () => {
  console.log(`[preview-hostinger] serving ${root} at http://localhost:${port}`);
  console.log("[preview-hostinger] mirrors public/.htaccess: app.html for SPA routes, real 404s elsewhere");
});
