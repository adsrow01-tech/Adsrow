import { supabase } from "./supabase";

async function describeFunctionError(error) {
  try {
    const response = error?.context;
    if (response && typeof response.clone === "function") {
      const body = await response.clone().json();
      if (typeof body?.error === "string" && body.error.trim()) return body.error;
      if (typeof body?.message === "string" && body.message.trim()) return body.message;
    }
  } catch {
    // The gateway may return an empty or non-JSON response for network/CORS failures.
  }
  const message = String(error?.message ?? "");
  if (/failed to send a request|fetch|network|cors/i.test(message)) {
    return "The signup service is unavailable right now. Please try again shortly.";
  }
  return message || "Registration could not be completed. Please try again.";
}

export async function registerWithLegal({ email, password, fullName, nextPath }) {
  if (!supabase) throw new Error("Account access is not configured yet. Please contact Adsrow.");

  const { data, error } = await supabase.functions.invoke("register-with-legal", {
    body: {
      email,
      password,
      fullName,
      nextPath,
    },
  });
  if (error) throw new Error(await describeFunctionError(error));
  if (!data?.user) throw new Error(data?.error || "Registration could not be completed. Please try again.");

  if (data.session?.access_token && data.session?.refresh_token) {
    const { error: sessionError } = await supabase.auth.setSession(data.session);
    if (sessionError) throw sessionError;
  }

  return data;
}
