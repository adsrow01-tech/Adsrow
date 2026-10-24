import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const MAX_ATTEMPTS = 3;

function corsHeaders(request: Request) {
  const configuredOrigins = (Deno.env.get("APP_ORIGINS") ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
  const requestOrigin = request.headers.get("Origin") ?? "";
  const allowed = !requestOrigin || configuredOrigins.includes(requestOrigin);
  return {
    allowed,
    headers: {
      "Access-Control-Allow-Origin": requestOrigin && allowed ? requestOrigin : "null",
      "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Vary": "Origin",
    },
  };
}

function json(body: Record<string, unknown>, headers: Record<string, string>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...headers, "Content-Type": "application/json" },
  });
}

function escapeHtml(value: string) {
  const entities: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  };
  return value.replace(/[&<>'"]/g, (character) => entities[character] ?? character);
}

async function updateDelivery(admin: ReturnType<typeof createClient>, userId: string, values: Record<string, unknown>) {
  const { error } = await admin.from("welcome_email_deliveries").update(values).eq("user_id", userId);
  return error;
}

Deno.serve(async (request) => {
  const { allowed, headers } = corsHeaders(request);
  if (!allowed) return json({ error: "Origin is not allowed." }, headers, 403);
  if (request.method === "OPTIONS") return new Response("ok", { headers });
  if (request.method !== "POST") return json({ error: "Method not allowed" }, headers, 405);

  const authorization = request.headers.get("Authorization");
  const token = authorization?.replace(/^Bearer\s+/i, "");
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const brevoApiKey = Deno.env.get("BREVO_API_KEY");
  const senderEmail = Deno.env.get("BREVO_SENDER_EMAIL");
  const senderName = Deno.env.get("BREVO_SENDER_NAME") ?? "Adsrow";

  if (!token || !supabaseUrl || !supabaseAnonKey || !serviceRoleKey || !brevoApiKey || !senderEmail) {
    return json({ error: "Welcome email service is not configured." }, headers, 500);
  }

  const userClient = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: { user }, error: userError } = await userClient.auth.getUser(token);
  if (userError || !user) return json({ error: "Authentication required." }, headers, 401);
  if (!user.email || !user.email_confirmed_at) {
    return json({ sent: false, reason: "email_not_verified" }, headers, 403);
  }

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: delivery, error: deliveryError } = await admin
    .from("welcome_email_deliveries")
    .select("status, attempts, email, claimed_at")
    .eq("user_id", user.id)
    .maybeSingle();
  if (deliveryError) return json({ error: "Could not read welcome email status." }, headers, 500);
  if (!delivery) return json({ sent: false, reason: "not_eligible" }, headers);
  if (delivery.status === "sent") return json({ sent: true, alreadySent: true }, headers);
  if (delivery.status === "uncertain") return json({ sent: false, reason: "delivery_uncertain" }, headers, 202);
  if (delivery.status === "sending") {
    const claimAge = delivery.claimed_at ? Date.now() - Date.parse(delivery.claimed_at) : 0;
    if (claimAge > 15 * 60 * 1000) {
      await updateDelivery(admin, user.id, { status: "uncertain", last_error: "Previous delivery attempt did not report an outcome." });
      return json({ sent: false, reason: "delivery_uncertain" }, headers, 202);
    }
    return json({ sent: false, reason: "delivery_in_progress" }, headers, 202);
  }
  if (delivery.attempts >= MAX_ATTEMPTS) return json({ sent: false, reason: "retry_limit_reached" }, headers, 202);

  const { data: claimed, error: claimError } = await admin
    .from("welcome_email_deliveries")
    .update({
      status: "sending",
      attempts: delivery.attempts + 1,
      claimed_at: new Date().toISOString(),
      last_error: null,
      email: user.email,
    })
    .eq("user_id", user.id)
    .in("status", ["pending", "failed"])
    .lt("attempts", MAX_ATTEMPTS)
    .select("status")
    .maybeSingle();
  if (claimError) return json({ error: "Could not reserve the welcome email." }, headers, 500);
  if (!claimed) return json({ sent: false, reason: "delivery_in_progress" }, headers, 202);

  const rawDisplayName = String(user.user_metadata?.full_name ?? user.email.split("@")[0]);
  const displayName = escapeHtml(rawDisplayName);
  const htmlContent = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Adsrow</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f4f7fb;color:#17233d;font-family:Arial,Helvetica,sans-serif;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">Your Adsrow account is ready. Explore a simpler way to plan local advertising.</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;background-color:#f4f7fb;">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:640px;background-color:#ffffff;border:1px solid #e4ebf3;border-radius:16px;box-shadow:0 10px 28px rgba(23,35,61,0.07);">
            <tr>
              <td style="padding:30px 40px 24px;border-bottom:1px solid #edf1f6;">
                <a href="https://adsrow01.vercel.app" style="display:inline-block;text-decoration:none;">
                  <img src="https://adsrow01.vercel.app/adsrow-logo.png" width="144" alt="Adsrow" style="display:block;width:144px;height:auto;border:0;">
                </a>
              </td>
            </tr>
            <tr>
              <td style="padding:48px 40px 18px;">
                <p style="margin:0 0 14px;color:#3ba7f2;font-size:12px;font-weight:700;letter-spacing:1.5px;line-height:1.4;text-transform:uppercase;">Welcome to Adsrow</p>
                <h1 style="margin:0;color:#0b274f;font-size:36px;font-weight:700;line-height:1.16;letter-spacing:-0.8px;">Your advertising journey starts here.</h1>
                <p style="margin:22px 0 0;color:#52647b;font-size:16px;line-height:1.7;">Hello ${displayName}, your Adsrow account is ready. Adsrow helps you simplify your advertising journey and reach the communities that matter to your business.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:18px 40px 40px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td style="border-radius:8px;background-color:#104493;">
                      <a href="https://adsrow01.vercel.app" style="display:inline-block;padding:15px 24px;border:1px solid #104493;border-radius:8px;color:#ffffff;font-size:15px;font-weight:700;line-height:1.2;text-decoration:none;">Explore Adsrow</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:28px 40px;background-color:#f8fafc;border-top:1px solid #edf1f6;border-bottom:1px solid #edf1f6;">
                <h2 style="margin:0 0 10px;color:#0b274f;font-size:18px;font-weight:700;line-height:1.35;">What you can do next</h2>
                <p style="margin:0;color:#627289;font-size:14px;line-height:1.7;">Visit your account to learn more about Adsrow, explore advertising options, and start planning your next campaign with a clear, local focus.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:28px 40px 30px;">
                <p style="margin:0;color:#104493;font-size:14px;font-weight:700;line-height:1.5;">Adsrow</p>
                <p style="margin:8px 0 0;color:#8795a8;font-size:12px;line-height:1.6;">Local advertising, made straightforward.</p>
                <p style="margin:18px 0 0;color:#a0adbc;font-size:11px;line-height:1.6;">© 2026 Adsrow. All rights reserved.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  let response;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { accept: "application/json", "api-key": brevoApiKey, "content-type": "application/json" },
      body: JSON.stringify({
        sender: { name: senderName, email: senderEmail },
        to: [{ email: user.email, name: rawDisplayName }],
        subject: "Welcome to Adsrow",
        htmlContent,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);
  } catch {
    await updateDelivery(admin, user.id, { status: "uncertain", last_error: "Brevo request outcome was unknown." });
    return json({ sent: false, reason: "delivery_uncertain" }, headers, 202);
  }

  if (response.ok) {
    const updateError = await updateDelivery(admin, user.id, { status: "sent", sent_at: new Date().toISOString(), claimed_at: null, last_error: null });
    if (updateError) return json({ sent: false, reason: "delivery_uncertain" }, headers, 202);
    return json({ sent: true }, headers);
  }

  const definiteRejection = response.status >= 400 && response.status < 500;
  await updateDelivery(admin, user.id, {
    status: definiteRejection ? "failed" : "uncertain",
    claimed_at: null,
    last_error: definiteRejection ? `Brevo rejected the request (${response.status}).` : `Brevo returned ${response.status}.`,
  });
  return json({ sent: false, reason: definiteRejection ? "delivery_failed" : "delivery_uncertain" }, headers, definiteRejection ? 502 : 202);
});
