import { readFile } from "node:fs/promises";
import path from "node:path";

const homepagePath = path.resolve("dist/index.html");
let html;

try {
  html = await readFile(homepagePath, "utf8");
} catch {
  throw new Error("Missing dist/index.html. Run npm run build first.");
}

const visibleText = html
  .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
  .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
  .replace(/<[^>]+>/g, " ")
  .replace(/&amp;/g, "&")
  .replace(/&quot;/g, '"')
  .replace(/&#x27;|&#39;/g, "'")
  .replace(/\s+/g, " ")
  .trim();

const expectedText = [
  "One network. Six reasons it works harder.",
  "Everything you need to reach the right people, and prove it.",
  "The right people",
  "One booking",
  "Change anytime",
  "Real proof",
  "Start small, grow",
  "Full attention",
];
const missingText = expectedText.filter((text) => !visibleText.includes(text));
const benefitSections = html.match(/<section\b[^>]*\bhome-benefits-section\b[^>]*>/g) ?? [];
const reasonCards = html.match(/<button\b[^>]*\bsrh-card\b[^>]*>/g) ?? [];

if (missingText.length || benefitSections.length !== 1 || reasonCards.length !== 6) {
  const details = [
    missingText.length ? `Missing visible text: ${missingText.join("; ")}` : null,
    benefitSections.length !== 1 ? `Expected one benefits section; found ${benefitSections.length}` : null,
    reasonCards.length !== 6 ? `Expected six reason cards; found ${reasonCards.length}` : null,
  ].filter(Boolean);
  throw new Error(`Prerender validation failed for ${homepagePath}: ${details.join(". ")}`);
}

console.log(`Prerender validation passed: ${homepagePath} includes the heading, subtitle, six reasons and one section.`);
