import { supabase } from "./supabase";

export async function sendWelcomeEmail() {
  if (!supabase) return;
  const { error } = await supabase.functions.invoke("send-welcome-email");
  if (error) throw error;
}
