import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  UserRound,
  Mail,
  Phone,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";
import AuthLayout from "../components/AuthLayout";
import GoogleIcon from "../components/GoogleIcon";
import { supabase, supabaseConfig } from "../lib/supabase";
import { getAuthCallbackUrl } from "../lib/authRedirect";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    const form = new FormData(event.currentTarget);
    const password = form.get("password");
    const confirmPassword = form.get("confirmPassword");
    const mobile = String(form.get("mobile") || "").replace(/\D/g, "");

    if (password !== confirmPassword) {
      setError("Your passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Your password must contain at least 8 characters.");
      return;
    }

    if (mobile.length < 7 || mobile.length > 15) {
      setError("Enter a valid mobile number.");
      return;
    }

    if (!supabaseConfig) {
      setError("Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.");
      return;
    }

    setLoading(true);
    const { data, error: signupError } = await supabase.auth.signUp({
      email: form.get("email"),
      password,
      options: { data: { full_name: form.get("fullName"), mobile: `${form.get("countryCode")}${mobile}` } },
    });
    setLoading(false);

    if (signupError) {
      setError(signupError.message);
      return;
    }

    if (data.session) navigate("/");
    else setMessage("Account created. Check your email to confirm your account.");
  }

  async function handleGoogleSignUp() {
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
        <span className="auth-eyebrow">GET </span>
        <h1>Create your account.</h1>
        <p>Join Adsrow and bring your brand to the right places.</p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label htmlFor="fullName">Full name</label>

        <div className="auth-input-wrap">
          <UserRound size={19} />

          <input
            id="fullName"
            name="fullName"
            placeholder="Your full name"
            autoComplete="name"
            maxLength={100}
            required
          />
        </div>

        <label htmlFor="signupEmail">Email address</label>

        <div className="auth-input-wrap">
          <Mail size={19} />

          <input
            id="signupEmail"
            name="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            required
          />
        </div>

        <label htmlFor="mobile">Mobile number</label>

        <div className="auth-phone">
          <div className="auth-input-wrap">
            <select name="countryCode" aria-label="Country code" defaultValue="+91">
              <option value="+91">IN +91</option>
              <option value="+1">US +1</option>
              <option value="+44">UK +44</option>
              <option value="+61">AU +61</option>
              <option value="+971">AE +971</option>
            </select>
          </div>
          <div className="auth-input-wrap">
            <Phone size={19} />
            <input id="mobile" name="mobile" type="tel" inputMode="tel" placeholder="98765 43210" autoComplete="tel" required />
          </div>
        </div>

        <label htmlFor="signupPassword">Password</label>

        <div className="auth-input-wrap">
          <LockKeyhole size={19} />

          <input
            id="signupPassword"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="At least 8 characters"
            autoComplete="new-password"
            minLength={8}
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

        <label htmlFor="confirmPassword">Confirm password</label>

        <div className="auth-input-wrap">
          <LockKeyhole size={19} />

          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Re-enter your password"
            autoComplete="new-password"
            required
          />

          <button
            type="button"
            className="auth-icon-button"
            onClick={() =>
              setShowConfirmPassword(!showConfirmPassword)
            }
            aria-label={
              showConfirmPassword ? "Hide password" : "Show password"
            }
          >
            {showConfirmPassword ? (
              <EyeOff size={19} />
            ) : (
              <Eye size={19} />
            )}
          </button>
        </div>

        {error && (
          <p className="auth-message auth-error" role="alert">
            {error}
          </p>
        )}

        {message && <p className="auth-message auth-success" role="status">{message}</p>}

        <label className="auth-checkline">
          <input type="checkbox" name="terms" required />
          <span>I agree to the applicable terms and privacy policy.</span>
        </label>

        <button type="submit" className="auth-submit" disabled={loading}>
          {loading ? "Creating account…" : "Create account"} {!loading && <ArrowRight size={19} />}
        </button>

        <div className="auth-divider"><span>OR</span></div>

        <button type="button" className="auth-google" onClick={handleGoogleSignUp} disabled={loading || googleLoading}>
          <GoogleIcon />
          {googleLoading ? "Connecting to Google…" : "Continue with Google"}
        </button>
      </form>

      <div className="auth-divider">
        <span>ALREADY A MEMBER?</span>
      </div>

      <p className="auth-switch">
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </AuthLayout>
  );
}

