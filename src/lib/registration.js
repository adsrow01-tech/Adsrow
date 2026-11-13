import { supabase } from "./supabase";
import { describeFunctionError } from "./functionErrors.mjs";

export { describeFunctionError };

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
