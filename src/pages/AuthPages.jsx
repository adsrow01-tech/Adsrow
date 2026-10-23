import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowRight, LockKeyhole, Mail, UserRound } from "lucide-react";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import { isVerifiedUser, useAuth } from "../context/AuthContext";
import GoogleIcon from "../components/GoogleIcon";

export function getSafeNextPath(value) {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) return "/";
  try {
    const target = new URL(value, window.location.origin);
    if (target.origin !== window.location.origin) return "/";
    return `${target.pathname}${target.search}${target.hash}`;
  } catch {
    return "/";
  }
}

export function getAuthCallbackUrl(nextPath) {
  const callback = new URL("/auth/callback", window.location.origin);
  callback.searchParams.set("next", getSafeNextPath(nextPath));
  return callback.toString();
}

function getFriendlyAuthError(error) {
  const message = String(error?.message || "");
  const normalized = message.toLowerCase();
  if (error?.code === "email_not_confirmed" || normalized.includes("email not confirmed")) {
    return "Please verify your email before signing in. You can request a new confirmation email below.";
  }
  if (normalized.includes("invalid login credentials")) {
    return "The email or password is incorrect. Check your details and try again.";
  }
  if (normalized.includes("already registered") || normalized.includes("already exists")) {
    return "An account with this email already exists. Sign in or use password recovery instead.";
  }
  if (normalized.includes("expired") || normalized.includes("invalid token") || normalized.includes("otp")) {
    return "This link is invalid or has expired. Request a new email and try again.";
  }
  return message || "Authentication could not be completed. Please try again.";
}

function AuthBanner() {
  return (
    <>
      <div className="auth-decoration" aria-hidden="true"><span /><span /><span /></div>
      <aside className="auth-aside">
        <Link to="/" className="auth-wordmark" aria-label="Adsrow home"><span>ads</span><b>row</b><i>.</i><sup>®</sup></Link>
        <div className="auth-aside-copy">
          <p className="auth-aside-kicker">LOCAL ADVERTISING, MADE SIMPLE</p>
          <h2>Reach the right people, right where they live.</h2>
          <p>Plan and manage campaigns across digital screens in local communities with Adsrow.</p>
          <div className="auth-aside-detail"><span className="auth-aside-dot" /> Built for local businesses and communities</div>
        </div>
        <span className="auth-aside-footer">Adsrow · Vijayawada, Andhra Pradesh</span>
      </aside>
    </>
  );
}

function AuthPage({ mode }) {
  const signup = mode === "signup";
  const recovery = mode === "recovery";
  const reset = mode === "reset";
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, verified, loading: authLoading, refreshSession, signOut } = useAuth();
  const nextPath = getSafeNextPath(searchParams.get("next"));
  const authRequired = searchParams.get("reason") === "auth-required";
  const verifyReason = ["verify-email", "confirmation-expired", "confirmation-required"].includes(searchParams.get("reason"));
  const needsVerification = verifyReason || Boolean(user && !verified);
  const authSwitchPath = `${signup ? "/login" : "/signup"}?next=${encodeURIComponent(nextPath)}${authRequired ? "&reason=auth-required" : verifyReason ? `&reason=${searchParams.get("reason")}` : ""}`;
  const [name, setName] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [canResend, setCanResend] = useState(needsVerification);

  useEffect(() => {
    if (user?.email && !email) setEmail(user.email);
  }, [user?.email, email]);

  useEffect(() => {
    if (user && !verified) setCanResend(true);
  }, [user, verified]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!isSupabaseConfigured) {
      setStatus("error");
      setMessage("Account access is not configured yet. Please contact Adsrow.");
      return;
    }
    if (status === "loading") return;
    if (reset && password !== passwordConfirm) {
      setStatus("error");
      setMessage("The passwords do not match. Check both fields and try again.");
      return;
    }

    setStatus("loading");
    setMessage("");
    try {
      if (recovery) {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: new URL(`/reset-password?next=${encodeURIComponent(nextPath)}`, window.location.origin).toString(),
        });
        if (error) throw error;
        setStatus("success");
        setMessage("If an account exists for this email, a password reset link is on its way.");
        return;
      }

      if (reset) {
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
        const restoredUser = await refreshSession();
        setStatus("success");
        setMessage("Your password has been updated.");
        if (isVerifiedUser(restoredUser)) navigate(nextPath, { replace: true });
        else {
          await signOut();
          navigate(`/login?next=${encodeURIComponent(nextPath)}&reason=verify-email`, { replace: true });
        }
        return;
      }

      const result = signup
        ? await supabase.auth.signUp({
            email: email.trim(),
            password,
            options: {
              data: { full_name: name.trim() },
              emailRedirectTo: getAuthCallbackUrl(nextPath),
            },
          })
        : await supabase.auth.signInWithPassword({ email: email.trim(), password });

      if (result.error) throw result.error;
      const resultUser = result.data.user || result.data.session?.user || null;
      if (signup && (!result.data.session || !isVerifiedUser(resultUser))) {
        setStatus("success");
        setCanResend(true);
        setMessage(`Check your email to verify your account. The confirmation link will return you${nextPath !== "/" ? " to your requested page" : " to Adsrow"}.`);
        return;
      }
      if (!isVerifiedUser(resultUser)) {
        if (result.data.session) await supabase.auth.signOut();
        await refreshSession();
        setCanResend(true);
        setStatus("error");
        setMessage("Please verify your email before accessing Adsrow. You can request a new confirmation email below.");
        return;
      }
      await refreshSession();
      navigate(nextPath, { replace: true });
    } catch (error) {
      const friendlyMessage = getFriendlyAuthError(error);
      setStatus("error");
      setMessage(friendlyMessage);
      if (String(error?.code || "") === "email_not_confirmed" || String(error?.message || "").toLowerCase().includes("email not confirmed")) {
        setCanResend(true);
      }
    }
  }

  async function resendConfirmation() {
    if (!isSupabaseConfigured || !email.trim() || status === "loading") return;
    setStatus("loading");
    setMessage("");
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email.trim(),
        options: { emailRedirectTo: getAuthCallbackUrl(nextPath) },
      });
      if (error) throw error;
      setStatus("success");
      setCanResend(true);
      setMessage("A new confirmation email has been requested. Check your inbox and spam folder.");
    } catch (error) {
      setStatus("error");
      setMessage(getFriendlyAuthError(error));
    }
  }

  async function signInWithGoogle() {
    if (!isSupabaseConfigured) {
      setStatus("error");
      setMessage("Account access is not configured yet. Please contact Adsrow.");
      return;
    }
    setStatus("loading");
    setMessage("");
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: getAuthCallbackUrl(nextPath), skipBrowserRedirect: true },
      });
      if (error) throw error;
      if (!data?.url) throw new Error("Google sign-in could not be started. Check the provider configuration.");
      window.location.assign(data.url);
    } catch (error) {
      setStatus("error");
      setMessage(getFriendlyAuthError(error));
    }
  }

  if ((signup || mode === "login") && !authLoading && verified) {
    return <Navigate to={nextPath} replace />;
  }

  if ((signup || mode === "login" || reset) && authLoading) {
    return <section className="auth-page"><AuthBanner /><div className="auth-panel"><p role="status">Checking your account…</p></div></section>;
  }

  if (reset && !user) {
    return <section className="auth-page"><AuthBanner /><div className="auth-panel"><div className="auth-card"><p className="eyebrow">ACCOUNT RECOVERY</p><h1>Reset link unavailable</h1><p className="auth-intro">This password reset link is invalid or has expired. Request a new link to continue.</p><Link className="button auth-submit" to={`/forgot-password?next=${encodeURIComponent(nextPath)}`}>Request a new reset link <ArrowRight size={17} /></Link><Link to="/login" className="auth-back">Back to sign in</Link></div></div></section>;
  }

  const title = signup ? "Create your account" : recovery ? "Reset your password" : reset ? "Choose a new password" : "Sign in to Adsrow";
  const intro = signup ? "Get started with your Adsrow account." : recovery ? "Enter your email and we’ll send a secure reset link." : reset ? "Choose a new password for your Adsrow account." : "Enter your details to continue.";
  const reasonMessage = authRequired
    ? "Please log in or create an account to continue."
    : searchParams.get("reason") === "confirmation-expired"
        ? "This confirmation link is invalid or has expired. Request a new email below."
        : searchParams.get("reason") === "confirmation-required"
          ? "We couldn't complete email confirmation. Sign in after verifying your email or request a new link."
          : needsVerification
            ? "Verify your email before accessing Adsrow."
            : "";

  return (
    <section className="auth-page">
      <AuthBanner />
      <div className="auth-panel">
        <div className="auth-card">
          <p className="eyebrow">{signup ? "JOIN ADSROW" : recovery || reset ? "ACCOUNT RECOVERY" : "WELCOME BACK"}</p>
          <h1>{title}</h1>
          <p className="auth-intro">{intro}</p>
          {reasonMessage && <p className="form-status auth-required-notice" role="status">{reasonMessage}</p>}
          {!isSupabaseConfigured && <p className="form-status form-error" role="alert">Supabase account access is not configured for this deployment.</p>}

          {!recovery && !reset && <>
            <button className="google-auth-button" type="button" onClick={signInWithGoogle} disabled={status === "loading" || (signup && !acceptedTerms) || !isSupabaseConfigured}>
              <GoogleIcon />{status === "loading" ? "Connecting to Google…" : `${signup ? "Sign up" : "Sign in"} with Google`}
            </button>
            <div className="auth-divider"><span>or continue with email</span></div>
          </>}

          <form className="auth-form" onSubmit={handleSubmit}>
            {signup && <label>Full name<span className="auth-input"><UserRound size={17} /><input autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" required /></span></label>}
            {!reset && <label>Email address<span className="auth-input"><Mail size={17} /><input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required /></span></label>}
            {(signup || mode === "login" || reset) && <label>{reset ? "New password" : "Password"}<span className="auth-input"><LockKeyhole size={17} /><input type="password" autoComplete={signup ? "new-password" : reset ? "new-password" : "current-password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder={signup || reset ? "At least 8 characters" : "Your password"} minLength={signup || reset ? 8 : undefined} required /></span></label>}
            {reset && <label>Confirm new password<span className="auth-input"><LockKeyhole size={17} /><input type="password" autoComplete="new-password" value={passwordConfirm} onChange={(event) => setPasswordConfirm(event.target.value)} placeholder="Enter your new password again" minLength={8} required /></span></label>}
            {message && <p className={`form-status ${status === "error" ? "form-error" : "form-success"}`} role={status === "error" ? "alert" : "status"}>{message}</p>}
            <button className="button auth-submit" type="submit" disabled={status === "loading" || (signup && !acceptedTerms) || !isSupabaseConfigured}>
              {status === "loading" ? "Please wait…" : recovery ? "Send reset link" : reset ? "Update password" : signup ? "Create account" : "Sign in"}<ArrowRight size={17} />
            </button>
          </form>

          {canResend && !recovery && !reset && <button className="auth-inline-action" type="button" onClick={resendConfirmation} disabled={status === "loading" || !email.trim() || !isSupabaseConfigured}>Resend confirmation email</button>}
          {signup && <label className="terms-check terms-after-auth"><input type="checkbox" checked={acceptedTerms} onChange={(event) => setAcceptedTerms(event.target.checked)} /><span>I agree to Adsrow’s <Link to="/terms" onClick={(event) => event.stopPropagation()}>Terms and Conditions</Link> and <Link to="/privacy" onClick={(event) => event.stopPropagation()}>Privacy Policy</Link>.</span></label>}
          {mode === "login" && <p className="auth-switch"><Link to={`/forgot-password?next=${encodeURIComponent(nextPath)}`}>Forgot your password?</Link></p>}
          {(mode === "login" || signup) && <p className="auth-switch">{signup ? "Already have an account?" : "New to Adsrow?"} <Link to={authSwitchPath}>{signup ? "Sign in" : "Create an account"}</Link></p>}
          {recovery && <p className="auth-switch">Remember your password? <Link to={`/login?next=${encodeURIComponent(nextPath)}`}>Sign in</Link></p>}
          {reset && <p className="auth-switch"><Link to={`/forgot-password?next=${encodeURIComponent(nextPath)}`}>Request another reset link</Link></p>}
          <Link to="/login" className="auth-back">← Back to sign in</Link>
        </div>
      </div>
    </section>
  );
}

export function LoginPage() { return <AuthPage mode="login" />; }
export function SignupPage() { return <AuthPage mode="signup" />; }
export function ForgotPasswordPage() { return <AuthPage mode="recovery" />; }
export function ResetPasswordPage() { return <AuthPage mode="reset" />; }

export function AuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const { user, verified, loading } = useAuth();
  const nextPath = getSafeNextPath(searchParams.get("next"));
  if (loading) return <section className="auth-page"><AuthBanner /><div className="auth-panel"><p role="status">Verifying your account…</p></div></section>;
  if (verified) return <Navigate to={nextPath} replace />;
  const reason = searchParams.has("error") || searchParams.has("error_code")
    ? "confirmation-expired"
    : user ? "verify-email" : "confirmation-required";
  return <Navigate to={`/login?next=${encodeURIComponent(nextPath)}&reason=${reason}`} replace />;
}
