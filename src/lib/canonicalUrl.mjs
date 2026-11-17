const SITE_ORIGIN = "https://adsrow.com";

export function canonicalUrl(pathname) {
  const pathOnly = String(pathname || "/").split(/[?#]/, 1)[0];
  const segments = pathOnly.split("/").filter(Boolean);
  return `${SITE_ORIGIN}/${segments.length ? `${segments.join("/")}/` : ""}`;
}
