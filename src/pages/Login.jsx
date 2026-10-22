import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";
import AuthLayout from "../components/AuthLayout";
import GoogleIcon from "../components/GoogleIcon";
import { supabase, supabaseConfig } from "../lib/supabase";
import { getAuthCallbackUrl } from "../lib/authRedirect";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  async function handleForgotPassword(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    if (!supabaseConfig) {
      setError("Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.");
      return;
    }
    const email = new FormData(event.currentTarget.closest("form")).get("email");
    if (!email) {
      setError("Enter your email address first.");
      return;
    }
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });
    if (resetError) setError(resetError.message);
    else setMessage("If an account exists for that email, we sent a password reset link.");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    if (!supabaseConfig) {
      setError("Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.");
      return;
    }
    const form = new FormData(event.currentTarget);
    setLoading(true);
    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: form.get("email"), password: form.get("password"),
    });
    setLoading(false);
    if (loginError) setError(loginError.message);
    else {
      const destination = location.state?.from;
      navigate(destination ? `${destination.pathname}${destination.search || ""}${destination.hash || ""}` : "/", { replace: true });
    }
  }

  async function handleGoogleSignIn() {
    setError("");
    setMessage("");
    if (!supabaseConfig) {
      setError("Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.");
      return;
    }
    setGoogleLoading(true);
    const { error: googleError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: getAuthCallbackUrl(location) },
    });
    if (googleError) {
      setGoogleLoading(false);
      setError(googleError.message);
    }
  }

  return (
    <AuthLayout>
      <div className="auth-heading">
        <span className="auth-eyebrow">WELCOME BACK</span>
        <h1>Welcome back.</h1>
        <p>Sign in to continue to your Adsrow account.</p>
        {location.state?.message && <p className="auth-message auth-info" role="status">{location.state.message}</p>}
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label htmlFor="email">Email address</label>

        <div className="auth-input-wrap">
          <Mail size={19} />

          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            required
          />
        </div>

        <div className="auth-password-heading">
          <label htmlFor="password">Password</label>

          <button
            type="button"
            className="auth-text-button"
            onClick={handleForgotPassword}
          >
            Forgot password?
          </button>
        </div>

        <div className="auth-input-wrap">
          <LockKeyhole size={19} />

          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            autoComplete="current-password"
            required
          />

          <button
            type="button"
            className="auth-icon-button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
          </button>
        </div>

        {error && <p className="auth-message auth-error" role="alert">{error}</p>}
        {message && <p className="auth-message auth-success" role="status">{message}</p>}

        <button type="submit" className="auth-submit" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"} {!loading && <ArrowRight size={19} />}
        </button>

        <div className="auth-divider"><span>OR</span></div>

        <button type="button" className="auth-google" onClick={handleGoogleSignIn} disabled={loading || googleLoading}>
          <GoogleIcon />
          {googleLoading ? "Connecting to Google…" : "Continue with Google"}
        </button>
      </form>

      <div className="auth-divider">
        <span>NEW TO ADSROW?</span>
      </div>

      <p className="auth-switch">
        Don't have an account?{" "}
        <Link to="/signup">Create an account</Link>
      </p>
    </AuthLayout>
  );
}

