const GOOGLE_LEGAL_INTENT_KEY = "adsrow:pending-google-legal-intent";

export const ADSROW_TERMS_VERSION = "2026-11-09-v1";

export async function createTermsContentHash(content) {
  const bytes = new TextEncoder().encode(content);
  const digest = await globalThis.crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (value) => value.toString(16).padStart(2, "0")).join("");
}

// Only the opaque, server-issued intent id is kept in sessionStorage. The
// accepted version and hashes remain server-side until Google authentication.
export function savePendingGoogleLegalIntent(intentId) {
  if (typeof intentId !== "string" || !/^[0-9a-f-]{36}$/i.test(intentId)) return false;
  try {
    window.sessionStorage.setItem(GOOGLE_LEGAL_INTENT_KEY, intentId);
    return window.sessionStorage.getItem(GOOGLE_LEGAL_INTENT_KEY) === intentId;
  } catch {
    return false;
  }
}

export function readPendingGoogleLegalIntent() {
  try {
    const intentId = window.sessionStorage.getItem(GOOGLE_LEGAL_INTENT_KEY);
    return typeof intentId === "string" && /^[0-9a-f-]{36}$/i.test(intentId) ? intentId : null;
  } catch {
    return null;
  }
}

export function clearPendingGoogleLegalIntent() {
  try { window.sessionStorage.removeItem(GOOGLE_LEGAL_INTENT_KEY); } catch { /* ignore unavailable storage */ }
}
