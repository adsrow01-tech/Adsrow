const AUTH_ENTRY_PATHS = new Set(["/login", "/signup"]);

export function getSafeNextPath(value) {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) return "/";

  try {
    const target = new URL(value, window.location.origin);
    if (target.origin !== window.location.origin || AUTH_ENTRY_PATHS.has(target.pathname)) return "/";
    return `${target.pathname}${target.search}${target.hash}`;
  } catch {
    return "/";
  }
}

export function getCurrentPath(location) {
  return `${location.pathname}${location.search}${location.hash}`;
}
