import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import LoadingScreen from "../components/LoadingScreen";
import { useAuth } from "../context/AuthContext";
import { clearPendingGoogleLegalIntent, readPendingGoogleLegalIntent } from "../lib/termsAcceptance";
import { getSafeNextPath } from "../lib/redirect";
import { supabase } from "../lib/supabase";

function returnToAuthPage(mode, message) {
  const query = new URLSearchParams({ message });
  return `/${mode === "signup" ? "signup" : "login"}?${query.toString()}`;
}

export default function OAuthCallbackPage() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const handled = useRef(false);

  useEffect(() => {
    if (loading || handled.current) return;
    handled.current = true;

    const mode = searchParams.get("mode") === "signup" ? "signup" : "login";
    const nextPath = getSafeNextPath(searchParams.get("next"));
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const oauthError = searchParams.get("error_description") || searchParams.get("error") || hashParams.get("error_description") || hashParams.get("error");

    async function finish() {
      if (oauthError) {
        clearPendingGoogleLegalIntent();
        navigate(returnToAuthPage(mode, "Google sign-in was canceled or could not be completed. You can try again."), { replace: true });
        return;
      }

      if (!user) {
        clearPendingGoogleLegalIntent();
        navigate(returnToAuthPage(mode, "Google authentication could not be completed. Please try again."), { replace: true });
        return;
      }

      if (mode === "signup") {
        const intentId = readPendingGoogleLegalIntent();
        if (!intentId) throw new Error("The legal acceptance handoff is missing. Please restart Google signup.");

        const { data, error } = await supabase.functions.invoke("register-with-legal", {
          body: { action: "consume_google_legal_intent", intentId },
        });
        if (error) throw error;
        if (data?.accepted !== true) throw new Error(data?.error || "Legal acceptance could not be verified. Please restart Google signup.");
        clearPendingGoogleLegalIntent();
      }

      navigate(nextPath, { replace: true });
    }

    finish().catch(async () => {
      // Keep this callback as the only route after signup until the server
      // confirms both acceptance rows. A failed verification must not expose
      // the newly authenticated session to the rest of the application.
      try { await signOut(); } catch { /* fail closed even if local sign-out errors */ }
      navigate(returnToAuthPage(mode, "Google signup could not be verified. Please review the legal documents and try again."), { replace: true });
    });
  }, [loading, user, searchParams, navigate, signOut]);

  return <LoadingScreen />;
}
