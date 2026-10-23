import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowRight, LockKeyhole, Mail, UserRound } from "lucide-react";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import GoogleIcon from "../components/GoogleIcon";

function getSafeNextPath(value) {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) return "/";
  try {
    const target = new URL(value, window.location.origin);
    if (target.origin !== window.location.origin) return "/";
    return `${target.pathname}${target.search}${target.hash}`;
  } catch {
    return "/";
  }
}

function AuthPage({ mode }) {
  const signup = mode === "signup";
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requestedPath = searchParams.get("next");
  const nextPath = getSafeNextPath(requestedPath);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!isSupabaseConfigured) {
      setStatus("error");
      setMessage("Account access is not configured yet. Please contact Adsrow.");
      return;
    }

    setStatus("loading");
    setMessage("");
    try {
      const result = signup
        ? await supabase.auth.signUp({
            email: email.trim(),
            password,
            options: { data: { full_name: name.trim() } },
          })
        : await supabase.auth.signInWithPassword({ email: email.trim(), password });

      if (result.error) throw result.error;

      if (signup && !result.data.session) {
        setStatus("success");
        setMessage("Your account is ready. Check your email for a confirmation link before signing in.");
        return;
      }

      navigate(nextPath, { replace: true });
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Authentication could not be completed. Please try again.");
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
        options: {
          redirectTo: new URL(nextPath, window.location.origin).toString(),
          skipBrowserRedirect: true,
        },
      });
      if (error) throw error;
      if (!data?.url) throw new Error("Supabase did not return a Google sign-in URL. Check the Google provider configuration.");
      window.location.assign(data.url);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Google sign-in could not be started. Please try again.");
    }
  }

  return (
    <section className="auth-page">
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
      <div className="auth-panel">
      <div className="auth-card">
        <p className="eyebrow">{signup ? "JOIN ADSROW" : "WELCOME BACK"}</p>
        <h1>{signup ? "Create your account" : "Sign in to Adsrow"}</h1>
        <p className="auth-intro">{signup ? "Get started with your Adsrow account." : "Enter your details to continue."}</p>

        <button className="google-auth-button" type="button" onClick={signInWithGoogle} disabled={status === "loading" || (signup && !acceptedTerms)}>
          <GoogleIcon />{status === "loading" ? "Connecting to Google…" : `${signup ? "Sign up" : "Sign in"} with Google`}
        </button>
        <div className="auth-divider"><span>or continue with email</span></div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {signup && <label>Full name<span className="auth-input"><UserRound size={17} /><input autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required /></span></label>}
          <label>Email address<span className="auth-input"><Mail size={17} /><input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required /></span></label>
          <label>Password<span className="auth-input"><LockKeyhole size={17} /><input type="password" autoComplete={signup ? "new-password" : "current-password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder={signup ? "At least 8 characters" : "Your password"} minLength={signup ? 8 : undefined} required /></span></label>
          {message && <p className={`form-status ${status === "error" ? "form-error" : "form-success"}`} role={status === "error" ? "alert" : "status"}>{message}</p>}
          <button className="button auth-submit" type="submit" disabled={status === "loading" || (signup && !acceptedTerms)}>{status === "loading" ? "Please wait…" : signup ? "Create account" : "Sign in"}<ArrowRight size={17} /></button>
        </form>

        {signup && <label className="terms-check terms-after-auth"><input type="checkbox" checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} /><span>I agree to Adsrow’s <Link to="/terms" onClick={(e) => e.stopPropagation()}>Terms and Conditions</Link> and <Link to="/privacy" onClick={(e) => e.stopPropagation()}>Privacy Policy</Link>.</span></label>}

        <p className="auth-switch">{signup ? "Already have an account?" : "New to Adsrow?"} <Link to={signup ? `/login?next=${encodeURIComponent(nextPath)}` : `/signup?next=${encodeURIComponent(nextPath)}`}>{signup ? "Sign in" : "Create an account"}</Link></p>
        <Link to="/" className="auth-back">← Back to Adsrow</Link>
      </div>
      </div>
    </section>
  );
}

export function LoginPage() { return <AuthPage mode="login" />; }
export function SignupPage() { return <AuthPage mode="signup" />; }
