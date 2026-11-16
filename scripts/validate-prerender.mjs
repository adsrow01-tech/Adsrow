import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const root = path.resolve("dist");
const publicRoutes = [
  ["/", "index.html"],
  ["/about/", "about/index.html"],
  ["/network/", "network/index.html"],
  ["/packages/", "packages/index.html"],
  ["/how-it-works/", "how-it-works/index.html"],
  ["/why-adsrow/", "why-adsrow/index.html"],
  ["/faqs/", "faqs/index.html"],
  ["/blog/", "blog/index.html"],
  ["/contact/", "contact/index.html"],
  ["/host-a-screen/", "host-a-screen/index.html"],
];
const legalRoutes = [
  ["/terms/", "terms/index.html"],
  ["/privacy/", "privacy/index.html"],
  ["/refund-policy/", "refund-policy/index.html"],
];
const errors = [];
const fail = (message) => errors.push(message);
const count = (html, expression) => [...html.matchAll(expression)].length;
const first = (html, expression) => expression.exec(html)?.[1] ?? "";
const readDist = (rel) => readFile(path.join(root, rel), "utf8");
const sitemapXml = await readDist("sitemap.xml");
const sitemapUrls = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
const expectedUrls = publicRoutes.map(([route]) => `https://adsrow.com${route}`);
if (new Set(sitemapUrls).size !== sitemapUrls.length) fail("Sitemap contains duplicate URLs.");
if (JSON.stringify(sitemapUrls) !== JSON.stringify(expectedUrls)) fail(`Sitemap URLs differ from canonical public routes. Found: ${sitemapUrls.join(", ")}`);
if (sitemapUrls.some((url) => !url.startsWith("https://adsrow.com/"))) fail("Sitemap contains a non-canonical host or protocol.");

const canonicalPaths = new Set(publicRoutes.map(([route]) => route));
const knownNonSlashPaths = new Set([...canonicalPaths].filter((route) => route !== "/").map((route) => route.slice(0, -1)));
const titles = new Set();
const descriptions = new Set();
for (const [route, file] of publicRoutes) {
  let html;
  try { html = await readDist(file); } catch { fail(`Missing generated public route ${file}.`); continue; }
  const canonical = first(html, /<link\s+rel="canonical"\s+href="([^"]+)"/g);
  const title = first(html, /<title>([^<]+)<\/title>/g);
  const description = first(html, /<meta\s+name="description"\s+content="([^"]*)"/g);
  const robots = first(html, /<meta\s+name="robots"\s+content="([^"]*)"/g);
  const ogUrl = first(html, /<meta\s+property="og:url"\s+content="([^"]*)"/g);
  const rootMarkup = first(html, /<div\s+id="root">([\s\S]*?)<\/div>\s*<\/body>/g);
  const expectedCanonical = `https://adsrow.com${route}`;
  if (count(html, /<title>/g) !== 1 || !title) fail(`${route} must have exactly one title.`);
  if (count(html, /<meta\s+name="description"/g) !== 1 || description.length < 30) fail(`${route} must have one meaningful description.`);
  if (count(html, /<meta\s+name="robots"/g) !== 1 || robots !== "index, follow") fail(`${route} must have one index, follow directive.`);
  if (count(html, /<link\s+rel="canonical"/g) !== 1 || canonical !== expectedCanonical) fail(`${route} canonical is missing, duplicated, or incorrect (found ${canonical}).`);
  if (count(html, /<meta\s+property="og:title"/g) !== 1 || count(html, /<meta\s+property="og:description"/g) !== 1 || count(html, /<meta\s+property="og:url"/g) !== 1 || ogUrl !== expectedCanonical) fail(`${route} Open Graph metadata is missing, duplicated, or inconsistent.`);
  if (count(html, /<meta\s+name="twitter:card"/g) !== 1 || count(html, /<meta\s+name="twitter:title"/g) !== 1 || count(html, /<meta\s+name="twitter:description"/g) !== 1) fail(`${route} Twitter Card metadata is incomplete or duplicated.`);
  const h1Count = count(html, /<h1\b/g);
  if (h1Count !== 1) fail(`${route} must contain exactly one H1; found ${h1Count}.`);
  if (!rootMarkup || rootMarkup.length < 500 || html.includes("Preparing your advertising experience...")) fail(`${route} does not contain meaningful prerendered page content.`);
  if (/<meta[^>]+http-equiv=["']?refresh/i.test(html)) fail(`${route} contains a meta refresh.`);
  if (titles.has(title)) fail(`Duplicate public title: ${title}`);
  if (descriptions.has(description)) fail(`Duplicate public description: ${description}`);
  titles.add(title);
  descriptions.add(description);
  for (const match of html.matchAll(/\bhref="([^"]+)"/g)) {
    const href = match[1];
    if (!href.startsWith("/")) continue;
    const pathname = new URL(href, "https://adsrow.com").pathname;
    if (knownNonSlashPaths.has(pathname)) fail(`${route} links to non-canonical internal route ${href}.`);
  }
}

for (const [route, file] of legalRoutes) {
  let html;
  try { html = await readDist(file); } catch { fail(`Missing generated legal route ${file}.`); continue; }
  if (!html.includes(`<link rel="canonical" href="https://adsrow.com${route}">`)) fail(`${route} legal canonical is incorrect.`);
  if (!html.includes('<meta name="robots" content="noindex, nofollow">')) fail(`${route} must retain noindex, nofollow.`);
  if (sitemapUrls.includes(`https://adsrow.com${route}`)) fail(`${route} must remain outside the sitemap.`);
}

const robots = await readDist("robots.txt");
if (!robots.includes("Sitemap: https://adsrow.com/sitemap.xml")) fail("robots.txt does not reference the canonical sitemap.");
if (!robots.includes("Allow: /")) fail("robots.txt does not allow public crawling.");
const appHtml = await readDist("app.html");
if (!appHtml.includes('<meta name="robots" content="noindex, nofollow">') || /<link\s+rel="canonical"/i.test(appHtml)) fail("app.html must remain noindex and without a canonical.");
const notFound = await readDist("404.html");
if (!notFound.includes('<meta name="robots" content="noindex, nofollow">')) fail("404.html must remain noindex.");
const assets = await readdir(path.join(root, "assets"));
if (!assets.some((name) => /^maplibre-gl-worker-.*\.(mjs|js)$/.test(name))) fail("Generated MapLibre worker asset is missing.");

if (errors.length) {
  console.error(`Prerender validation failed (${errors.length} issue${errors.length === 1 ? "" : "s"}):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(`Prerender validation passed: ${publicRoutes.length} public routes, ${legalRoutes.length} legal routes, canonical sitemap, metadata, H1/content, 404, auth shell and MapLibre worker.`);
}