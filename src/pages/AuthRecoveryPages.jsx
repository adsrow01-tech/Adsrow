import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, LockKeyhole, Mail } from "lucide-react";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

function RecoveryShell({ eyebrow, title, intro, children }) {
  return (
    <section className="auth-page recovery-page">
      <div className="auth-decoration" aria-hidden="true"><span /><span /><span /></div>
      <aside className="auth-aside">
        <Link to="/" className="auth-wordmark" aria-label="Adsrow home"><span>ads</span><b>row</b><i>.</i><sup>®</sup></Link>
        <div className="auth-aside-copy">
          <p className="auth-aside-kicker">ADSROW ACCOUNT ACCESS</p>
          <h2>Keep your account secure and in your control.</h2>
          <p>Use a secure email link to regain access or choose a new password.</p>
        </div>
      </aside>
      <div className="auth-panel"><div className="auth-card">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="auth-intro">{intro}</p>
        {children}
      </div></div>
    </section>
  );
}

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

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
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: new URL("/reset-password", window.location.origin).toString(),
      });
      if (error) throw error;
      setStatus("success");
      setMessage("If an account exists for that email, we sent a password reset link.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "The reset email could not be sent. Please try again.");
    }
  }

  return <RecoveryShell eyebrow="RESET YOUR PASSWORD" title="Forgot your password?" intro="Enter your account email and we’ll send a secure reset link.">
    <form className="auth-form" onSubmit={handleSubmit}>
      <label>Email address<span className="auth-input"><Mail size={17} /><input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required /></span></label>
      {message && <p className={`form-status ${status === "error" ? "form-error" : "form-success"}`} role={status === "error" ? "alert" : "status"}>{message}</p>}
      <button className="button auth-submit" type="submit" disabled={status === "loading"}>{status === "loading" ? "Sending…" : "Send reset link"}<ArrowRight size={17} /></button>
    </form>
    <Link to="/login" className="auth-back">Back to sign in</Link>
  </RecoveryShell>;
}

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    if (password.length < 8) {
      setStatus("error");
      setMessage("Your password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setStatus("error");
      setMessage("The passwords do not match.");
      return;
    }
    if (!isSupabaseConfigured || !user) {
      setStatus("error");
      setMessage("This reset link is invalid or has expired. Request a new link and try again.");
      return;
    }
    setStatus("loading");
    setMessage("");
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setStatus("success");
      setMessage("Your password has been updated. Redirecting to your account…");
      window.setTimeout(() => navigate("/dashboard", { replace: true }), 700);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "The password could not be updated. Request a new reset link.");
    }
  }

  if (loading) {
    return <RecoveryShell eyebrow="VERIFYING RESET LINK" title="Checking your reset link" intro="Please wait while we verify your secure recovery session." />;
  }

  return <RecoveryShell eyebrow="CHOOSE A NEW PASSWORD" title="Set a new password" intro="Choose a strong password with at least 8 characters.">
    <form className="auth-form" onSubmit={handleSubmit}>
      <label>New password<span className="auth-input"><LockKeyhole size={17} /><input type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={8} required /></span></label>
      <label>Confirm password<span className="auth-input"><LockKeyhole size={17} /><input type="password" autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} minLength={8} required /></span></label>
      {message && <p className={`form-status ${status === "error" ? "form-error" : "form-success"}`} role={status === "error" ? "alert" : "status"}>{message}</p>}
      <button className="button auth-submit" type="submit" disabled={status === "loading" || !user}>{status === "loading" ? "Updating…" : "Update password"}<ArrowRight size={17} /></button>
    </form>
    {!user && <p className="recovery-expired">This link may be expired. <Link to="/forgot-password">Request a new reset link</Link>.</p>}
    <Link to="/login" className="auth-back">Back to sign in</Link>
  </RecoveryShell>;
}
