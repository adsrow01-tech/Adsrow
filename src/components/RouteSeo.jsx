import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getPageStructuredData, getSeoMetadata } from "../lib/seoMetadata";

function setMeta(attribute, key, content) {
  const selector = `meta[${attribute}="${key}"]`;
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = content;
}

export default function RouteSeo() {
  const { pathname } = useLocation();

  useEffect(() => {
    const metadata = getSeoMetadata(pathname);
    document.title = metadata.title;
    setMeta("name", "description", metadata.description);
    setMeta("name", "robots", metadata.robots);
    setMeta("property", "og:title", metadata.title);
    setMeta("property", "og:description", metadata.description);
    setMeta("property", "og:type", "website");
    setMeta("property", "og:site_name", "Adsrow");
    setMeta("property", "og:locale", "en_IN");
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", metadata.title);
    setMeta("name", "twitter:description", metadata.description);

    const ogUrl = document.head.querySelector('meta[property="og:url"]');
    if (metadata.canonical) {
      let canonical = document.head.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement("link");
        canonical.rel = "canonical";
        document.head.appendChild(canonical);
      }
      canonical.href = metadata.canonical;
      if (ogUrl) ogUrl.content = metadata.canonical;
      else setMeta("property", "og:url", metadata.canonical);
    } else {
      document.head.querySelector('link[rel="canonical"]')?.remove();
      ogUrl?.remove();
    }

    const schema = getPageStructuredData(pathname);
    let schemaElement = document.head.querySelector("script[data-adsrow-page-schema]");
    if (schema) {
      if (!schemaElement) {
        schemaElement = document.createElement("script");
        schemaElement.type = "application/ld+json";
        schemaElement.dataset.adsrowPageSchema = "true";
        document.head.appendChild(schemaElement);
      }
      schemaElement.textContent = JSON.stringify(schema);
    } else {
      schemaElement?.remove();
    }
  }, [pathname]);

  return null;
}
