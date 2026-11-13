import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsGate } from "../_shared/cors.mjs";

const MIN_PASSWORD_LENGTH = 8;

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

function isUuid(value: unknown): value is string {
  return typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function logFailure(requestId: string, stage: string, error: unknown) {
  const detail = (error instanceof Error ? error.message : String(error))
    .replace(/Bearer\s+[A-Za-z0-9._~+/-]+=*/gi, "Bearer [REDACTED]")
    .replace(/\b(access_token|refresh_token|apikey|password)=([^&\s]+)/gi, "$1=[REDACTED]")
    .replace(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/g, "[REDACTED_EMAIL]");
  console.error(JSON.stringify({
    event: "register-with-legal.failure",
    requestId,
    stage,
    errorName: error instanceof Error ? error.name : "UnknownError",
    detail: detail.slice(0, 400),
  }));
}

Deno.serve(async (request) => {
  const requestId = crypto.randomUUID();
  let headers: Record<string, string> = {};
  let stage = "request_setup";
  try {
  const cors = corsGate(request, {
    appOrigins: Deno.env.get("APP_ORIGINS"),
    publicAppOrigin: Deno.env.get("PUBLIC_APP_ORIGIN"),
  });
  if (cors.response) return cors.response;
  headers = cors.headers;
  if (request.method !== "POST") return json({ error: "Method not allowed" }, headers, 405);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const approvedVersion = Deno.env.get("ADSROW_TERMS_VERSION");
  const approvedTermsHash = Deno.env.get("ADSROW_TERMS_HASH");
  const approvedPrivacyHash = Deno.env.get("ADSROW_PRIVACY_HASH");
  const requestOrigin = request.headers.get("Origin") ?? "";

  const missingConfiguration = [
    ["SUPABASE_URL", supabaseUrl],
    ["SUPABASE_ANON_KEY", anonKey],
    ["SUPABASE_SERVICE_ROLE_KEY", serviceRoleKey],
    ["ADSROW_TERMS_VERSION", approvedVersion],
    ["ADSROW_TERMS_HASH", approvedTermsHash],
    ["ADSROW_PRIVACY_HASH", approvedPrivacyHash],
  ].filter(([, value]) => !value).map(([name]) => name);
  if (missingConfiguration.length) {
    console.error(JSON.stringify({ event: "register-with-legal.configuration_missing", requestId, missing: missingConfiguration }));
    return json({
      error: "Signup is not configured yet. Please contact Adsrow support.",
      code: "registration_not_configured",
      requestId,
      missingConfiguration,
    }, headers, 503);
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid registration request." }, headers, 400);
  }

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const authClient = createClient(supabaseUrl, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  if (body.action === "create_google_legal_intent") {
    if (
      body.termsVersion !== approvedVersion ||
      body.termsContentHash !== approvedTermsHash ||
      body.privacyContentHash !== approvedPrivacyHash
    ) {
      return json({ error: "The legal documents have changed. Please review them again." }, headers, 409);
    }

    const intentId = crypto.randomUUID();
    stage = "create_google_legal_intent.insert";
    const { error } = await admin.from("signup_legal_intents").insert({
      intent_id: intentId,
      terms_version: approvedVersion,
      terms_content_hash: approvedTermsHash,
      privacy_content_hash: approvedPrivacyHash,
    });
    if (error) {
      logFailure(requestId, stage, error);
      return json({ error: "Legal acceptance could not be prepared. Please try again.", code: "legal_intent_create_failed", requestId }, headers, 500);
    }
    return json({ intentId, expiresInSeconds: 900 }, headers);
  }

  if (body.action === "consume_google_legal_intent") {
    if (!isUuid(body.intentId)) return json({ error: "Invalid legal acceptance handoff." }, headers, 400);
    const bearer = request.headers.get("Authorization")?.match(/^Bearer\s+(.+)$/i)?.[1];
    if (!bearer) return json({ error: "Google authentication is required to finish signup." }, headers, 401);

    stage = "consume_google_legal_intent.verify_user";
    const { data: authData, error: authError } = await authClient.auth.getUser(bearer);
    const authenticatedUser = authData?.user;
    if (authError || !authenticatedUser) return json({ error: "Google authentication could not be verified." }, headers, 401);
    const providers = [authenticatedUser.app_metadata?.provider, ...(authenticatedUser.identities ?? []).map((identity) => identity.provider)];
    if (!providers.includes("google")) return json({ error: "A Google account is required to finish signup." }, headers, 403);

    stage = "consume_google_legal_intent.consume_rpc";
    const { data: accepted, error: consumeError } = await admin.rpc("consume_google_signup_legal_intent", {
      p_intent_id: body.intentId,
      p_user_id: authenticatedUser.id,
    });
    if (consumeError || accepted !== true) {
      if (consumeError) logFailure(requestId, stage, consumeError);
      return json({ error: "Legal acceptance could not be verified. Please restart Google signup.", code: "legal_acceptance_consume_failed", requestId }, headers, 409);
    }
    return json({ accepted: true }, headers);
  }

  if (body.action !== undefined) return json({ error: "Unsupported registration action." }, headers, 400);

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const fullName = typeof body.fullName === "string" ? body.fullName.trim().slice(0, 160) : "";
  const nextPath = safeNextPath(body.nextPath);
  const legalIntentId = crypto.randomUUID();

  if (!isValidEmail(email) || password.length < MIN_PASSWORD_LENGTH || !fullName) {
    return json({ error: "Please provide a valid name, email address, and password." }, headers, 400);
  }

  stage = "email_signup.create_intent";
  const { error: intentError } = await admin.from("signup_legal_intents").insert({
    intent_id: legalIntentId,
    terms_version: approvedVersion,
    terms_content_hash: approvedTermsHash,
    privacy_content_hash: approvedPrivacyHash,
  });
  if (intentError) {
    logFailure(requestId, stage, intentError);
    return json({ error: "Registration could not be started. Please try again.", code: "legal_intent_create_failed", requestId }, headers, 500);
  }

  const redirectOrigin = requestOrigin || Deno.env.get("PUBLIC_APP_ORIGIN") || "";
  const emailRedirectTo = redirectOrigin
    ? new URL(`/login?next=${encodeURIComponent(nextPath)}&message=${encodeURIComponent("Email verified. You can continue.")}`, redirectOrigin).toString()
    : undefined;

  stage = "email_signup.auth_sign_up";
  const { data, error } = await authClient.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, adsrow_legal_intent_id: legalIntentId },
      ...(emailRedirectTo ? { emailRedirectTo } : {}),
    },
  });

  if (error || !data.user) {
    if (error) logFailure(requestId, stage, error);
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
  stage = "email_signup.verify_acceptances";
  const { data: acceptances, error: acceptanceError } = await admin
    .from("terms_acceptances")
    .select("document_type")
    .eq("user_id", data.user.id)
    .eq("terms_version", approvedVersion);
  if (acceptanceError || new Set((acceptances ?? []).map((row) => row.document_type)).size !== 2) {
    if (acceptanceError) logFailure(requestId, stage, acceptanceError);
    await admin.auth.admin.deleteUser(data.user.id);
    await admin.from("signup_legal_intents").delete().eq("intent_id", legalIntentId);
    return json({ error: "Registration could not be verified. Please try again." }, headers, 500);
  }

  return json({
    user: data.user,
    session: data.session,
    requiresEmailConfirmation: !data.session,
  }, headers);
  } catch (error) {
    logFailure(requestId, stage, error);
    return json({
      error: "Registration could not be completed right now. Please try again shortly.",
      code: "registration_internal_error",
      requestId,
    }, headers, 500);
  }
});
