import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const MIN_PASSWORD_LENGTH = 8;

function corsHeaders(request: Request) {
  const configuredOrigins = (Deno.env.get("APP_ORIGINS") ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
  const requestOrigin = request.headers.get("Origin") ?? "";
  const allowedOrigins = new Set([
    "https://adsrow.com",
    "https://www.adsrow.com",
    Deno.env.get("PUBLIC_APP_ORIGIN")?.trim() ?? "",
    ...configuredOrigins,
  ].filter(Boolean));
  const allowed = !requestOrigin || allowedOrigins.has(requestOrigin);
  return {
    allowed,
    headers: {
      "Access-Control-Allow-Origin": requestOrigin && allowed ? requestOrigin : "null",
      "Access-Control-Allow-Headers": "apikey, authorization, content-type, x-client-info",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Vary": "Origin",
    },
  };
}

function json(body: Record<string, unknown>, headers: Record<string, string>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...headers, "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}

function isValidEmail(email: unknown) {
  return typeof email === "string" && email.length <= 320 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function safeNextPath(value: unknown) {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) return "/";
  return value;
}

Deno.serve(async (request) => {
  const { allowed, headers } = corsHeaders(request);
  if (!allowed) return json({ error: "Origin is not allowed." }, headers, 403);
  if (request.method === "OPTIONS") return new Response("ok", { headers });
  if (request.method !== "POST") return json({ error: "Method not allowed" }, headers, 405);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const approvedVersion = Deno.env.get("ADSROW_TERMS_VERSION");
  const approvedTermsHash = Deno.env.get("ADSROW_TERMS_HASH");
  const approvedPrivacyHash = Deno.env.get("ADSROW_PRIVACY_HASH");
  const requestOrigin = request.headers.get("Origin") ?? "";

  if (!supabaseUrl || !anonKey || !serviceRoleKey || !approvedVersion || !approvedTermsHash || !approvedPrivacyHash) {
    return json({ error: "Registration is not configured." }, headers, 503);
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid registration request." }, headers, 400);
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const fullName = typeof body.fullName === "string" ? body.fullName.trim().slice(0, 160) : "";
  const nextPath = safeNextPath(body.nextPath);
  const legalIntentId = crypto.randomUUID();

  if (!isValidEmail(email) || password.length < MIN_PASSWORD_LENGTH || !fullName) {
    return json({ error: "Please provide a valid name, email address, and password." }, headers, 400);
  }

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const authClient = createClient(supabaseUrl, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { error: intentError } = await admin.from("signup_legal_intents").insert({
    intent_id: legalIntentId,
    terms_version: approvedVersion,
    terms_content_hash: approvedTermsHash,
    privacy_content_hash: approvedPrivacyHash,
  });
  if (intentError) return json({ error: "Registration could not be started. Please try again." }, headers, 500);

  const redirectOrigin = requestOrigin || Deno.env.get("PUBLIC_APP_ORIGIN") || "";
  const emailRedirectTo = redirectOrigin
    ? new URL(`/login?next=${encodeURIComponent(nextPath)}&message=${encodeURIComponent("Email verified. You can continue.")}`, redirectOrigin).toString()
    : undefined;

  const { data, error } = await authClient.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, adsrow_legal_intent_id: legalIntentId },
      ...(emailRedirectTo ? { emailRedirectTo } : {}),
    },
  });

  if (error || !data.user) {
    await admin.from("signup_legal_intents").delete().eq("intent_id", legalIntentId);
    return json({ error: "Registration could not be completed. If you already have an account, please sign in instead." }, headers, 400);
  }

  // Supabase may return an obfuscated user for an existing email when email
  // enumeration protection is enabled. Never treat that response as a newly
  // created user and never delete it during compensation.
  if (!data.user.identities?.length) {
    await admin.from("signup_legal_intents").delete().eq("intent_id", legalIntentId);
    return json({ error: "Registration could not be completed. If you already have an account, please sign in instead." }, headers, 400);
  }

  // The trigger is the atomic enforcement point. This check detects a
  // misconfigured/stale migration before returning success to the browser.
  const { data: acceptances, error: acceptanceError } = await admin
    .from("terms_acceptances")
    .select("document_type")
    .eq("user_id", data.user.id)
    .eq("terms_version", approvedVersion);
  if (acceptanceError || new Set((acceptances ?? []).map((row) => row.document_type)).size !== 2) {
    await admin.auth.admin.deleteUser(data.user.id);
    await admin.from("signup_legal_intents").delete().eq("intent_id", legalIntentId);
    return json({ error: "Registration could not be verified. Please try again." }, headers, 500);
  }

  return json({
    user: data.user,
    session: data.session,
    requiresEmailConfirmation: !data.session,
  }, headers);
});
