const ALLOWED_HEADERS = "authorization, apikey, content-type, x-client-info";
const ALLOWED_METHODS = "POST, OPTIONS";
const BUILT_IN_ORIGINS = ["https://adsrow.com", "https://www.adsrow.com"];

function normalizeConfiguredOrigin(value) {
  if (typeof value !== "string" || !value.trim()) return null;
  try {
    const url = new URL(value.trim());
    if (!["https:", "http:"].includes(url.protocol) || url.username || url.password) return null;
    if (url.pathname !== "/" || url.search || url.hash) return null;
    return url.origin;
  } catch {
    return null;
  }
}

function normalizeRequestOrigin(value) {
  if (typeof value !== "string" || !value || value === "null") return null;
  try {
    const url = new URL(value);
    if (!["https:", "http:"].includes(url.protocol) || url.username || url.password) return null;
    if (url.pathname !== "/" || url.search || url.hash) return null;
    return url.origin;
  } catch {
    return null;
  }
}

export function corsGate(request, { appOrigins = "", publicAppOrigin = "" } = {}) {
  const requestOrigin = request.headers.get("Origin") ?? "";
  const normalizedOrigin = normalizeRequestOrigin(requestOrigin);
  const configuredOrigins = String(appOrigins)
    .split(",")
    .map(normalizeConfiguredOrigin)
    .filter(Boolean);
  const publicOrigin = normalizeConfiguredOrigin(publicAppOrigin);
  const allowedOrigins = new Set([...BUILT_IN_ORIGINS, ...configuredOrigins, ...(publicOrigin ? [publicOrigin] : [])]);
  const allowed = !requestOrigin || (normalizedOrigin !== null && allowedOrigins.has(normalizedOrigin));
  const headers = {
    "Access-Control-Allow-Origin": allowed && requestOrigin ? requestOrigin : "null",
    "Access-Control-Allow-Headers": ALLOWED_HEADERS,
    "Access-Control-Allow-Methods": ALLOWED_METHODS,
    "Vary": "Origin",
  };

  if (!allowed) {
    return {
      allowed: false,
      headers,
      response: new Response(JSON.stringify({ error: "Origin is not allowed." }), {
        status: 403,
        headers: { ...headers, "Content-Type": "application/json", "Cache-Control": "no-store" },
      }),
    };
  }

  if (request.method === "OPTIONS") {
    return { allowed: true, headers, response: new Response(null, { status: 204, headers }) };
  }

  return { allowed: true, headers, response: null };
}
