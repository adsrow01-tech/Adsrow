import { supabase } from "./supabase";

export const ADSROW_TERMS_VERSION = "2026-11-09-v1";
const PENDING_KEY = "adsrow:pending-terms-acceptance";
const ACCEPTED_KEY = "adsrow:accepted-terms-version";

export function hasLocalTermsAcceptance(contentHash) {
  try {
    const value = JSON.parse(localStorage.getItem(ACCEPTED_KEY) || "null");
    return value?.termsVersion === ADSROW_TERMS_VERSION && (!contentHash || value.contentHash === contentHash);
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

export function savePendingTermsAcceptance(contentHash) {
  const pending = { termsVersion: ADSROW_TERMS_VERSION, contentHash, acceptedAt: new Date().toISOString() };
  try { localStorage.setItem(PENDING_KEY, JSON.stringify(pending)); localStorage.setItem(ACCEPTED_KEY, JSON.stringify({ termsVersion: ADSROW_TERMS_VERSION, contentHash })); } catch { /* storage may be unavailable */ }
  return pending;
}

export async function persistPendingTermsAcceptance(userId) {
  if (!supabase || !userId) return { ok: false, skipped: true };
  let pending;
  try { pending = JSON.parse(localStorage.getItem(PENDING_KEY) || "null"); } catch { pending = null; }
  if (!pending || pending.termsVersion !== ADSROW_TERMS_VERSION) return { ok: true, skipped: true };
  const { error } = await supabase.from("terms_acceptances").upsert({ user_id: userId, terms_version: pending.termsVersion, content_hash: pending.contentHash, accepted_at: pending.acceptedAt }, { onConflict: "user_id,terms_version" });
  if (error) return { ok: false, error };
  try { localStorage.removeItem(PENDING_KEY); } catch { /* ignore */ }
  return { ok: true };
}
