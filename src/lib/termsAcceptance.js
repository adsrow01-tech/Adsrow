import { supabase } from "./supabase";

export const ADSROW_TERMS_VERSION = "2026-11-09-v1";
const PENDING_KEY = "adsrow:pending-terms-acceptance";
const ACCEPTED_KEY = "adsrow:accepted-terms-version";

export function hasLocalTermsAcceptance(hashes) {
  try {
    const value = JSON.parse(localStorage.getItem(ACCEPTED_KEY) || "null");
    if (!value || value.termsVersion !== ADSROW_TERMS_VERSION) return false;
    return Object.entries(hashes).every(([type, hash]) => value.documentHashes?.[type] === hash);
  } catch { return false; }
}

export function createTermsContentHash(content) {
  let hash = 2166136261;
  for (let index = 0; index < content.length; index += 1) {
    hash ^= content.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `fnv1a-${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

// entries: [{ type: "terms" | "privacy", contentHash }] — one pending record per
// acknowledged document so the acceptance trail stores document type, version,
// timestamp and content hash for each.
export function savePendingTermsAcceptance(entries) {
  const acceptedAt = new Date().toISOString();
  const pendingEntries = entries.map(({ type, contentHash }) => ({ type, termsVersion: ADSROW_TERMS_VERSION, contentHash, acceptedAt }));
  const documentHashes = Object.fromEntries(entries.map(({ type, contentHash }) => [type, contentHash]));
  try {
    localStorage.setItem(PENDING_KEY, JSON.stringify({ entries: pendingEntries, documentHashes }));
    localStorage.setItem(ACCEPTED_KEY, JSON.stringify({ termsVersion: ADSROW_TERMS_VERSION, documentHashes }));
  } catch { /* storage may be unavailable */ }
  return pendingEntries;
}

function readPendingEntries() {
  try {
    const pending = JSON.parse(localStorage.getItem(PENDING_KEY) || "null");
    if (!pending) return [];
    if (Array.isArray(pending.entries)) {
      return pending.entries.filter((entry) => entry.termsVersion === ADSROW_TERMS_VERSION && entry.type);
    }
    // Legacy single-document handoff from the earlier acceptance flow.
    if (pending.termsVersion === ADSROW_TERMS_VERSION && typeof pending.contentHash === "string") {
      return [{ type: "terms", termsVersion: pending.termsVersion, contentHash: pending.contentHash, acceptedAt: pending.acceptedAt ?? new Date().toISOString() }];
    }
    return [];
  } catch { return []; }
}

export async function persistPendingTermsAcceptance(userId) {
  if (!supabase || !userId) return { ok: false, skipped: true };
  const entries = readPendingEntries();
  if (!entries.length) return { ok: true, skipped: true };
  for (const entry of entries) {
    const { error } = await supabase.from("terms_acceptances").upsert(
      { user_id: userId, document_type: entry.type, terms_version: entry.termsVersion, content_hash: entry.contentHash, accepted_at: entry.acceptedAt },
      { onConflict: "user_id,document_type,terms_version" }
    );
    if (error) return { ok: false, error };
  }
  // Every document persisted before the pending handoff is dropped.
  try { localStorage.removeItem(PENDING_KEY); } catch { /* ignore */ }
  return { ok: true };
}
