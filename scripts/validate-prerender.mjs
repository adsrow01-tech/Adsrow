import { readFile } from "node:fs/promises";
import path from "node:path";
import { canonicalUrl } from "../src/lib/canonicalUrl.mjs";

const dist = path.resolve("dist");
const pages = [
  { name: "Homepage", route: "/", file: "index.html" },
  { name: "About", route: "/about", file: "about/index.html" },
  { name: "Network", route: "/network", file: "network/index.html" },
  { name: "Packages", route: "/packages", file: "packages/index.html" },
  { name: "How It Works", route: "/how-it-works", file: "how-it-works/index.html" },
  { name: "Why Adsrow", route: "/why-adsrow", file: "why-adsrow/index.html" },
  { name: "FAQs", route: "/faqs", file: "faqs/index.html" },
  { name: "Blog", route: "/blog", file: "blog/index.html" },
  { name: "Contact", route: "/contact", file: "contact/index.html" },
  { name: "Host a Screen", route: "/host-a-screen", file: "host-a-screen/index.html" },
];

const getTags = (html, tagName, predicate) =>
  [...html.matchAll(new RegExp(`<${tagName}\\b[^>]*>`, "gi"))]
    .map(([tag]) => tag)
    .filter(predicate);

const getAttribute = (tag, name) => {
  const match = tag.match(new RegExp(`\\b${name}\\s*=\\s*(["'])(.*?)\\1`, "i"));
  return match?.[2] ?? "";
};

const rows = [];
let hasFailure = false;
for (const page of pages) {
  let html = "";
  try {
    html = await readFile(path.join(dist, page.file), "utf8");
  } catch {
    html = "";
  }

  const canonicalTags = getTags(html, "link", (tag) => /\brel=["']canonical["']/i.test(tag));
  const canonical = canonicalTags.length === 1 ? getAttribute(canonicalTags[0], "href") : "";
  const ogTags = getTags(html, "meta", (tag) => /\bproperty=["']og:url["']/i.test(tag));
  const ogUrl = ogTags.length === 1 ? getAttribute(ogTags[0], "content") : "";
  const expectedUrl = canonicalUrl(page.route);
  const pass = canonicalTags.length === 1
    && canonical === expectedUrl
    && ogTags.length === 1
    && ogUrl === canonical
    && canonical.startsWith("https://adsrow.com/")
    && !canonical.includes("www.adsrow.com");
  if (!pass) hasFailure = true;
  rows.push({ page: page.name, pageUrl: expectedUrl, canonical, ogUrl, canonicalTags: canonicalTags.length, result: pass ? "PASS" : "FAIL" });
}

console.table(rows);

const sitemap = await readFile(path.resolve("public/sitemap.xml"), "utf8");
const sitemapUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/gi)].map(([, url]) => url.trim());
const expectedSitemapUrls = pages.map((page) => canonicalUrl(page.route));
const sitemapPass = sitemapUrls.length === expectedSitemapUrls.length
  && expectedSitemapUrls.every((url, index) => sitemapUrls[index] === url);
console.log(`Sitemap matches all ten canonical URLs: ${sitemapPass ? "PASS" : "FAIL"}`);
if (!sitemapPass) hasFailure = true;

const blogHtml = await readFile(path.join(dist, "blog/index.html"), "utf8");
const blogTitle = blogHtml.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? "";
const expectedBlogTitle = "Blog | Adsrow · Local Advertising Ideas for Vijayawada Businesses";
const blogTitlePass = blogTitle === expectedBlogTitle && !blogTitle.includes("┬╖");
console.log(`Blog title UTF-8 encoding: ${blogTitlePass ? "PASS" : "FAIL"}`);
if (!blogTitlePass) hasFailure = true;

for (const legalRoute of ["terms", "privacy", "refund-policy"]) {
  const html = await readFile(path.join(dist, legalRoute, "index.html"), "utf8");
  const robotsTags = getTags(html, "meta", (tag) => /\bname=["']robots["']/i.test(tag));
  const robots = robotsTags.length === 1 ? getAttribute(robotsTags[0], "content") : "";
  const pass = robots === "noindex, nofollow";
  console.log(`${legalRoute} robots directive: ${pass ? "PASS" : "FAIL"}`);
  if (!pass) hasFailure = true;
}

if (hasFailure) process.exitCode = 1;
