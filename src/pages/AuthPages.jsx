import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowRight, LockKeyhole, Mail, UserRound, X } from "lucide-react";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import GoogleIcon from "../components/GoogleIcon";
import { useAuth } from "../context/AuthContext";
import { getSafeNextPath } from "../lib/redirect";
import { privacySections, termsSections } from "./LegalPages";
import { createTermsContentHash, hasLocalTermsAcceptance, persistPendingTermsAcceptance, savePendingTermsAcceptance } from "../lib/termsAcceptance";

const TERMS_READY_FOR_ACCEPTANCE = false;
const TERMS_CONTENT_HASH = createTermsContentHash(termsSections.map(([heading, text]) => `${heading}\n${text}`).join("\n"));

function LegalDocumentModal({ documentType, onAccepted, onClose, onOpenPrivacy }) {
  const isTerms = documentType === "terms";
  const sections = isTerms ? termsSections : privacySections;
  const title = isTerms ? "Terms & Conditions" : "Privacy Policy";
  const scrollRef = useRef(null);
  const [atEnd, setAtEnd] = useState(false);
  const [checked, setChecked] = useState(false);
  const [error, setError] = useState("");
  function updatePosition() {
    const node = scrollRef.current;
    if (node) setAtEnd(node.scrollTop + node.clientHeight >= node.scrollHeight - 8);
  }
  function accept() {
    if (!checked || !atEnd) return;
    if (!TERMS_READY_FOR_ACCEPTANCE) return;
    try { savePendingTermsAcceptance(TERMS_CONTENT_HASH); onAccepted(); onClose(); } catch { setError("We could not save your acceptance. Please try again."); }
  }
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, []);
  return <div className="terms-modal-overlay"><section className="terms-gate terms-modal" role="dialog" aria-modal="true" aria-labelledby="terms-gate-title">
    <div className="terms-gate-header"><div className="terms-modal-heading"><div><p className="eyebrow">ADSROW LEGAL · DRAFT</p><h1 id="terms-gate-title">{title}</h1></div><button type="button" className="terms-modal-close" onClick={onClose} aria-label="Close legal document"><X size={20} /></button></div><p>Please read the document before creating your account.</p><p>Adsrow Media Network Private Limited · Effective date: [●] · Last updated: [●]</p></div>
    <div className="terms-gate-notice" role="note"><strong>DRAFT — UNDER LEGAL REVIEW</strong><br />This document contains unresolved placeholders and must be completed and approved before publication.</div>
    <div className="terms-gate-document" ref={scrollRef} onScroll={updatePosition} tabIndex={0} aria-label="Adsrow Terms and Conditions document">
      {sections.map(([heading, text]) => <section key={heading}><h2>{heading}</h2>{text.split(/\n\n+/).map((paragraph, index) => <p key={index}>{paragraph.split("\n").map((line, lineIndex, lines) => <span key={lineIndex}>{line}{lineIndex < lines.length - 1 && <br />}</span>)}</p>)}</section>)}
    </div>
    <div className="terms-gate-acceptance">{isTerms && <><label><input type="checkbox" checked={checked} onChange={(event) => setChecked(event.target.checked)} disabled={!atEnd || !TERMS_READY_FOR_ACCEPTANCE} /> <span>I have read and agree to the Adsrow Terms &amp; Conditions and acknowledge the <button type="button" className="legal-inline-link" onClick={onOpenPrivacy}>Privacy Policy</button>.</span></label><p className="terms-gate-progress">{!TERMS_READY_FOR_ACCEPTANCE ? "Acceptance is unavailable while this policy remains a draft." : atEnd ? "You have reached the end of the document." : "Scroll to the end of the document to continue."}</p>{error && <p className="form-status form-error" role="alert">{error}</p>}<button className="button terms-gate-button" type="button" disabled={!checked || !atEnd || !TERMS_READY_FOR_ACCEPTANCE} onClick={accept}>Accept &amp; Continue <ArrowRight size={17} /></button></>}<p className="terms-gate-related"><Link to="/refund-policy">Refund &amp; Cancellation Policy</Link></p></div>
  </section></div>;
}

function AuthPage({ mode }) {
  const signup = mode === "signup";
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requestedPath = searchParams.get("next");
  const nextPath = getSafeNextPath(requestedPath);
  const { user, loading: authLoading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(() => signup && hasLocalTermsAcceptance(TERMS_CONTENT_HASH));
  const [activeLegalDocument, setActiveLegalDocument] = useState(null);

  useEffect(() => {
    if (!authLoading && user) {
      persistPendingTermsAcceptance(user.id).then((result) => {
        if (result.error && signup) {
          setStatus("error");
          setMessage("We could not record your Terms acceptance. Please contact Adsrow before continuing.");
          return;
        }
        navigate(nextPath, { replace: true });
      });
    }
  }, [authLoading, user, nextPath, navigate, signup]);

  useEffect(() => {
    const notice = searchParams.get("message");
    if (notice) setMessage(notice);
  }, [searchParams]);

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
            options: {
              data: { full_name: name.trim() },
              emailRedirectTo: new URL(`/login?next=${encodeURIComponent(nextPath)}&message=${encodeURIComponent("Email verified. You can continue.")}`, window.location.origin).toString(),
            },
          })
        : await supabase.auth.signInWithPassword({ email: email.trim(), password });

      if (result.error) throw result.error;

      if (signup && !result.data.session) {
        setStatus("success");
        setMessage("Your account is ready. Check your email for a confirmation link. After verification, you will return to your requested page.");
        return;
      }

      const acceptance = await persistPendingTermsAcceptance(result.data?.user?.id);
      if (acceptance.error && signup) {
        setStatus("error");
        setMessage("We could not record your Terms acceptance. Please contact Adsrow before continuing.");
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
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: new URL(nextPath, window.location.origin).toString(),
        },
      });
      if (error) throw error;
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Google sign-in could not be started. Please try again.");
    }
  }

  return (
    <>
    {signup && activeLegalDocument && <LegalDocumentModal documentType={activeLegalDocument} onAccepted={() => setAcceptedTerms(true)} onClose={() => setActiveLegalDocument(null)} onOpenPrivacy={() => setActiveLegalDocument("privacy")} />}
    <section className="auth-page">
      <div className="auth-decoration" aria-hidden="true"><span /><span /><span /></div>
      <aside className="auth-aside">
        <Link to="/" className="auth-wordmark" aria-label="Adsrow home"><span>ads</span><b>row</b><i>.</i><sup>®</sup></Link>
        <div className="auth-aside-copy">
          <p className="auth-aside-kicker">LOCAL ADVERTISING, MADE SIMPLE</p>
          <h2>{signup ? "Reach the right people, right where they live." : "Reach people where they pause."}</h2>
          <p>Plan and manage campaigns across digital screens in local communities with Adsrow.</p>
          <div className="auth-aside-detail"><span className="auth-aside-dot" /> Built for local businesses and communities</div>
        </div>
        <span className="auth-aside-footer">Adsrow · Vijayawada, Andhra Pradesh</span>
      </aside>
      <div className="auth-panel">
      <div className="auth-card">
        <p className="eyebrow">{signup ? "JOIN ADSROW" : "WELCOME BACK"}</p>
        <h1>{signup ? "Create your Adsrow account" : "Welcome back"}</h1>
        <p className="auth-intro">{signup
          ? "Create an account to manage your profile and see enquiries submitted from this browser."
          : "Log in to manage your Adsrow profile and keep track of enquiries from this browser."}</p>

        <button className="google-auth-button" type="button" onClick={signInWithGoogle} disabled={status === "loading"}>
          <GoogleIcon />{status === "loading" ? "Connecting to Google…" : `${signup ? "Sign up" : "Sign in"} with Google`}
        </button>
        <div className="auth-divider"><span>or continue with email</span></div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {signup && <label>Full name<span className="auth-input"><UserRound size={17} /><input autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required /></span></label>}
          <label>Email address<span className="auth-input"><Mail size={17} /><input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required /></span></label>
          <label>Password<span className="auth-input"><LockKeyhole size={17} /><input type="password" autoComplete={signup ? "new-password" : "current-password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder={signup ? "At least 8 characters" : "Your password"} minLength={signup ? 8 : undefined} required /></span></label>
          {!signup && <Link to="/forgot-password" className="auth-forgot">Forgot your password?</Link>}
          {message && <p className={`form-status ${status === "error" ? "form-error" : "form-success"}`} role={status === "error" ? "alert" : "status"}>{message}</p>}
          <button className="button auth-submit" type="submit" disabled={status === "loading"}>{status === "loading" ? "Please wait…" : signup ? "Create Account" : "Log In"}<ArrowRight size={17} /></button>
        </form>

        {signup && <p className="auth-legal-links"><button type="button" onClick={() => setActiveLegalDocument("terms")}>Terms &amp; Conditions</button><span> · </span><button type="button" onClick={() => setActiveLegalDocument("privacy")}>Privacy Policy</button></p>}

        {signup
          ? <p className="auth-switch">Already have an account? <Link to={`/login?next=${encodeURIComponent(nextPath)}`}>Sign in</Link></p>
          : <p className="auth-switch">New to Adsrow? You don't need an account to enquire. <Link to="/contact">Get a free plan →</Link></p>}
        <Link to="/" className="auth-back">← Back to Adsrow</Link>
      </div>
      </div>
    </section>
    </>
  );
}

export function LoginPage() { return <AuthPage mode="login" />; }
export function SignupPage() { return <AuthPage mode="signup" />; }
