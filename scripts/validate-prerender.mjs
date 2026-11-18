import { readFile, access } from "node:fs/promises";
import path from "node:path";
import { canonicalUrl } from "../src/lib/canonicalUrl.mjs";

const dist = path.resolve("dist");
const publicDir = path.resolve("public");
const SITE_ORIGIN = "https://adsrow.com";

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

const legalPages = [
  { name: "Terms", file: "terms/index.html" },
  { name: "Privacy", file: "privacy/index.html" },
  { name: "Refund Policy", file: "refund-policy/index.html" },
];

const specialPages = [
  { name: "App", file: "app.html" },
  { name: "404", file: "404.html" },
];

let hasFailure = false;
const results = [];

function check(name, passed, details = "") {
  results.push({
    check: name,
    result: passed ? "PASS" : "FAIL",
    details,
  });

  if (!passed) {
    hasFailure = true;
  }
}

async function readDistFile(file) {
  try {
    return await readFile(path.join(dist, file), "utf8");
  } catch {
    return null;
  }
}

async function fileExists(file) {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

function getTags(html, tagName) {
  return [
    ...html.matchAll(new RegExp(`<${tagName}\\b[^>]*>`, "gi")),
  ].map(([tag]) => tag);
}

function getAttribute(tag, name) {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const match = tag.match(
    new RegExp(`\\b${escapedName}\\s*=\\s*(["'])(.*?)\\1`, "i")
  );

  return match?.[2] ?? "";
}

function findMeta(html, attribute, value) {
  return getTags(html, "meta").filter(
    (tag) =>
      getAttribute(tag, attribute).toLowerCase() === value.toLowerCase()
  );
}

function getTitle(html) {
  return [
    ...html.matchAll(/<title\b[^>]*>([\s\S]*?)<\/title>/gi),
  ].map(([, title]) => title.trim());
}

function validatePageMetadata(page, html) {
  const titleTags = getTitle(html);
  const descriptionTags = findMeta(html, "name", "description");
  const robotsTags = findMeta(html, "name", "robots");
  const canonicalTags = getTags(html, "link").filter(
    (tag) => getAttribute(tag, "rel").toLowerCase() === "canonical"
  );

  const ogTitleTags = findMeta(html, "property", "og:title");
  const ogDescriptionTags = findMeta(html, "property", "og:description");
  const ogUrlTags = findMeta(html, "property", "og:url");

  const twitterCardTags = findMeta(html, "name", "twitter:card");
  const twitterTitleTags = findMeta(html, "name", "twitter:title");
  const twitterDescriptionTags = findMeta(
    html,
    "name",
    "twitter:description"
  );

  const expectedCanonical = canonicalUrl(page.route);

  const canonical =
    canonicalTags.length === 1
      ? getAttribute(canonicalTags[0], "href")
      : "";

  const ogUrl =
    ogUrlTags.length === 1
      ? getAttribute(ogUrlTags[0], "content")
      : "";

  check(`${page.name}: HTML is not empty`, html.trim().length > 0);

  check(
    `${page.name}: Exactly one title`,
    titleTags.length === 1
  );

  check(
    `${page.name}: Exactly one description`,
    descriptionTags.length === 1
  );

  check(
    `${page.name}: Exactly one robots directive`,
    robotsTags.length === 1
  );

  check(
    `${page.name}: Exactly one canonical`,
    canonicalTags.length === 1
  );

  check(
    `${page.name}: Correct canonical URL`,
    canonical === expectedCanonical,
    canonical
  );

  check(
    `${page.name}: Canonical uses Adsrow HTTPS domain`,
    canonical.startsWith(`${SITE_ORIGIN}/`) &&
      !canonical.includes("www.adsrow.com")
  );

  check(
    `${page.name}: Exactly one OG title`,
    ogTitleTags.length === 1
  );

  check(
    `${page.name}: Exactly one OG description`,
    ogDescriptionTags.length === 1
  );

  check(
    `${page.name}: Exactly one OG URL`,
    ogUrlTags.length === 1
  );

  check(
    `${page.name}: OG URL matches canonical`,
    ogUrl === canonical
  );

  check(
    `${page.name}: Exactly one Twitter card`,
    twitterCardTags.length === 1
  );

  check(
    `${page.name}: Exactly one Twitter title`,
    twitterTitleTags.length === 1
  );

  check(
    `${page.name}: Exactly one Twitter description`,
    twitterDescriptionTags.length === 1
  );

  check(
    `${page.name}: Robots allows indexing`,
    getAttribute(robotsTags[0] || "", "content") === "index, follow"
  );
}

function validateNoIndexPage(page, html) {
  const titleTags = getTitle(html);
  const descriptionTags = findMeta(html, "name", "description");
  const robotsTags = findMeta(html, "name", "robots");

  const canonicalTags = getTags(html, "link").filter(
    (tag) => getAttribute(tag, "rel").toLowerCase() === "canonical"
  );

  const ogUrlTags = findMeta(html, "property", "og:url");

  check(`${page.name}: HTML is not empty`, html.trim().length > 0);

  check(
    `${page.name}: Exactly one title`,
    titleTags.length === 1
  );

  check(
    `${page.name}: Exactly one description`,
    descriptionTags.length === 1
  );

  check(
    `${page.name}: Exactly one robots directive`,
    robotsTags.length === 1
  );

  check(
    `${page.name}: Noindex directive`,
    getAttribute(robotsTags[0] || "", "content") === "noindex, nofollow"
  );

  check(
    `${page.name}: No canonical URL`,
    canonicalTags.length === 0
  );

  check(
    `${page.name}: No OG URL`,
    ogUrlTags.length === 0
  );
}

// --------------------------------------------------
// 1. Validate public prerendered pages
// --------------------------------------------------

for (const page of pages) {
  const html = await readDistFile(page.file);

  if (!html) {
    check(`${page.name}: File exists`, false, page.file);
    continue;
  }

  check(`${page.name}: File exists`, true);

  validatePageMetadata(page, html);
}

// --------------------------------------------------
// 2. Validate legal pages
// --------------------------------------------------

for (const page of legalPages) {
  const html = await readDistFile(page.file);

  if (!html) {
    check(`${page.name}: File exists`, false, page.file);
    continue;
  }

  validateNoIndexPage(page, html);
}

// --------------------------------------------------
// 3. Validate app.html and 404.html
// --------------------------------------------------

for (const page of specialPages) {
  const html = await readDistFile(page.file);

  if (!html) {
    check(`${page.name}: File exists`, false, page.file);
    continue;
  }

  validateNoIndexPage(page, html);

  if (page.file === "app.html") {
    check(
      "App: React root is empty",
      /<div id="root">\s*<\/div>/i.test(html)
    );
  }

  if (page.file === "404.html") {
    check(
      "404: React root contains rendered content",
      /<div id="root">\s*\S[\s\S]*?<\/div>/i.test(html)
    );
  }
}

// --------------------------------------------------
// 4. Validate sitemap
// --------------------------------------------------

let sitemap = "";

try {
  sitemap = await readFile(
    path.join(publicDir, "sitemap.xml"),
    "utf8"
  );
} catch {
  check("Sitemap: File exists", false);
}

if (sitemap) {
  check("Sitemap: File exists", true);

  const sitemapUrls = [
    ...sitemap.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi),
  ].map(([, url]) => url.trim());

  const expectedUrls = pages.map((page) =>
    canonicalUrl(page.route)
  );

  check(
    "Sitemap: Contains exactly ten public URLs",
    sitemapUrls.length === expectedUrls.length
  );

  check(
    "Sitemap: No duplicate URLs",
    new Set(sitemapUrls).size === sitemapUrls.length
  );

  check(
    "Sitemap: All public URLs are present",
    expectedUrls.every((url) => sitemapUrls.includes(url))
  );

  check(
    "Sitemap: Contains no unexpected URLs",
    sitemapUrls.every((url) => expectedUrls.includes(url))
  );

  check(
    "Sitemap: All URLs use Adsrow HTTPS domain",
    sitemapUrls.every(
      (url) =>
        url.startsWith(`${SITE_ORIGIN}/`) &&
        !url.includes("www.adsrow.com")
    )
  );

  check(
    "Sitemap: Uses sitemap XML namespace",
    /xmlns=["']http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9["']/.test(
      sitemap
    )
  );
}

// --------------------------------------------------
// 5. Validate robots.txt
// --------------------------------------------------

try {
  const robots = await readFile(
    path.join(publicDir, "robots.txt"),
    "utf8"
  );

  check(
    "Robots.txt: Allows public crawling",
    /User-agent:\s*\*/i.test(robots) &&
      /Allow:\s*\//i.test(robots)
  );

  check(
    "Robots.txt: Contains correct sitemap URL",
    robots.includes(`${SITE_ORIGIN}/sitemap.xml`)
  );
} catch {
  check("Robots.txt: File exists", false);
}

// --------------------------------------------------
// 6. Validate social sharing images
// --------------------------------------------------

const socialImages = [
  "adsrow-og-image.png",
  "brand/adsrow-logo-primary.png",
];

for (const image of socialImages) {
  check(
    `Social image: ${image} exists in public`,
    await fileExists(path.join(publicDir, image))
  );

  check(
    `Social image: ${image} exists in dist`,
    await fileExists(path.join(dist, image))
  );
}

// Check homepage social metadata.
const homepage = await readDistFile("index.html");

if (homepage) {
  const ogImages = findMeta(homepage, "property", "og:image");
  const twitterImages = findMeta(homepage, "name", "twitter:image");

  check(
    "Homepage: Exactly one OG image",
    ogImages.length === 1
  );

  check(
    "Homepage: Exactly one Twitter image",
    twitterImages.length === 1
  );

  check(
    "Homepage: OG and Twitter images match",
    getAttribute(ogImages[0] || "", "content") ===
      getAttribute(twitterImages[0] || "", "content")
  );
}

// --------------------------------------------------
// 7. Validate structured data
// --------------------------------------------------

if (homepage) {
  const jsonLdScripts = [
    ...homepage.matchAll(
      /<script\b(?=[^>]*type=["']application\/ld\+json["'])[^>]*>([\s\S]*?)<\/script>/gi
    ),
  ];

  check(
    "Structured data: At least two JSON-LD blocks",
    jsonLdScripts.length >= 2
  );

  const schemas = [];

  for (const [, json] of jsonLdScripts) {
    try {
      schemas.push(JSON.parse(json));
    } catch {
      check("Structured data: Valid JSON-LD syntax", false);
    }
  }

  if (schemas.length === jsonLdScripts.length) {
    check(
      "Structured data: Valid JSON-LD syntax",
      true
    );

    check(
      "Structured data: Organization schema exists",
      schemas.some((schema) => schema["@type"] === "Organization")
    );

    check(
      "Structured data: WebSite schema exists",
      schemas.some((schema) => schema["@type"] === "WebSite")
    );
  }
}

// --------------------------------------------------
// 8. Validate blog title encoding
// --------------------------------------------------

const blogHtml = await readDistFile("blog/index.html");

if (blogHtml) {
  const blogTitles = getTitle(blogHtml);

  const expectedBlogTitle =
    "Blog | Adsrow · Local Advertising Ideas for Vijayawada Businesses";

  check(
    "Blog: Correct title and UTF-8 encoding",
    blogTitles.length === 1 &&
      blogTitles[0] === expectedBlogTitle &&
      !blogTitles[0].includes("┬")
  );
}

// --------------------------------------------------
// 9. Print results
// --------------------------------------------------

console.log("\n======================================");
console.log(" ADSROW SEO VALIDATION REPORT");
console.log("======================================\n");

console.table(results);

const passed = results.filter(
  (result) => result.result === "PASS"
).length;

const failed = results.filter(
  (result) => result.result === "FAIL"
).length;

console.log("\n======================================");
console.log(`Total checks: ${results.length}`);
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);
console.log("======================================\n");

if (hasFailure) {
  console.error("SEO VALIDATION FAILED. Fix the issues before deployment.");
  process.exitCode = 1;
} else {
  console.log("SEO VALIDATION PASSED. All checks completed successfully.");
}