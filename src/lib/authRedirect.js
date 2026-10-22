export function getAuthCallbackUrl(location) {
  const destination = location?.state?.from;
  const next = destination
    ? `${destination.pathname}${destination.search || ""}${destination.hash || ""}`
    : "/";
  const callbackUrl = new URL("/auth/callback", window.location.origin);

  if (next !== "/" && next.startsWith("/") && !next.startsWith("//")) {
    callbackUrl.searchParams.set("next", next);
  }

  return callbackUrl.toString();
}
