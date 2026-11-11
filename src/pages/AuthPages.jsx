import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowRight, LockKeyhole, Mail, UserRound, X } from "lucide-react";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import GoogleIcon from "../components/GoogleIcon";
import { useAuth } from "../context/AuthContext";
import { getSafeNextPath } from "../lib/redirect";
import { registerWithLegal } from "../lib/registration";
import { privacySections, refundSections, termsSections } from "./LegalPages";
import { createTermsContentHash } from "../lib/termsAcceptance";

const TERMS_READY_FOR_ACCEPTANCE = false;
const TERMS_CONTENT_HASH = createTermsContentHash(termsSections.map(([heading, text]) => `${heading}\n${text}`).join("\n"));
const PRIVACY_CONTENT_HASH = createTermsContentHash(privacySections.map(([heading, text]) => `${heading}\n${text}`).join("\n"));

function LegalDocumentModal({ initialDocument, onAccepted, onClose }) {
  const [activeDocument, setActiveDocument] = useState(initialDocument === "privacy" ? "privacy" : "terms");
  const [readDocuments, setReadDocuments] = useState({});
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const scrollRef = useRef(null);
  const scrollTops = useRef({});
  // Terms and Privacy are the required documents; the Refund policy is viewable
  // in the same modal as "review only" and is not part of the agreement checkbox.
  const REQUIRED_DOCUMENTS = ["terms", "privacy"];
  const LEGAL_DOCUMENTS = {
    terms: { title: "Terms & Conditions", contentHash: TERMS_CONTENT_HASH, sections: termsSections },
    privacy: { title: "Privacy Policy", contentHash: PRIVACY_CONTENT_HASH, sections: privacySections },
    refund: { title: "Refund & Cancellation Policy", contentHash: null, sections: refundSections },
  };
  const documentMeta = LEGAL_DOCUMENTS[activeDocument];
  const requiredRead = REQUIRED_DOCUMENTS.every((document) => readDocuments[document]);
  function markReadToEnd() {
    const node = scrollRef.current;
    if (node && node.scrollTop + node.clientHeight >= node.scrollHeight - 8) {
      setReadDocuments((current) => (current[activeDocument] ? current : { ...current, [activeDocument]: true }));
    }
  }
  function switchDocument(nextDocument) {
    const node = scrollRef.current;
    if (node) scrollTops.current[activeDocument] = node.scrollTop;
    setActiveDocument(nextDocument);
  }
  useEffect(() => {
    const node = scrollRef.current;
    if (node) node.scrollTop = scrollTops.current[activeDocument] ?? 0;
    // A document can already fit entirely on screen; check once after paint.
    requestAnimationFrame(markReadToEnd);
  }, [activeDocument]);
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, []);
  function accept() {
    if (!agreed || !requiredRead || !TERMS_READY_FOR_ACCEPTANCE) return;
    onAccepted(REQUIRED_DOCUMENTS.map((document) => ({ type: document, contentHash: LEGAL_DOCUMENTS[document].contentHash })));
    onClose();
  }
  return <div className="terms-modal-overlay"><section className="terms-gate terms-modal" role="dialog" aria-modal="true" aria-labelledby="terms-gate-title">
    <div className="terms-gate-header"><div className="terms-modal-heading"><div><h1 id="terms-gate-title">{documentMeta.title}</h1>{activeDocument === "refund" && <button type="button" className="legal-inline-link terms-modal-back" onClick={() => switchDocument("terms")}>← Back to Terms &amp; Privacy</button>}</div><button type="button" className="terms-modal-close" onClick={onClose} aria-label="Close legal document"><X size={20} /></button></div><p>Please read each required document before creating your account.</p><p>Adsrow Media Network Private Limited · Effective date: [●] · Last updated: [●]</p>
    <div className="terms-tabs" role="tablist" aria-label="Legal documents">{Object.entries(LEGAL_DOCUMENTS).map(([key, meta]) => <button key={key} type="button" role="tab" aria-selected={activeDocument === key} data-read={readDocuments[key] ? "true" : undefined} className="terms-tab" onClick={() => key === activeDocument ? undefined : switchDocument(key)}>{meta.title}{!REQUIRED_DOCUMENTS.includes(key) && <span className="terms-tab-note">review only</span>}</button>)}</div></div>
    <div className="terms-gate-document" ref={scrollRef} onScroll={markReadToEnd} tabIndex={0} aria-label={`Adsrow ${documentMeta.title} document`}>
      {documentMeta.sections.map(([heading, text]) => <section key={heading}><h2>{heading}</h2>{text.split(/\n\n+/).map((paragraph, index) => <p key={index}>{paragraph.split("\n").map((line, lineIndex, lines) => <span key={lineIndex}>{line}{lineIndex < lines.length - 1 && <br />}</span>)}</p>)}</section>)}
    </div>
    <div className="terms-gate-acceptance"><label><input type="checkbox" checked={agreed} onChange={(event) => setAgreed(event.target.checked)} disabled={!requiredRead || !TERMS_READY_FOR_ACCEPTANCE} /> <span>I have read and agree to the Adsrow Terms &amp; Conditions and acknowledge the Privacy Policy.</span></label><p className="terms-gate-progress">{!TERMS_READY_FOR_ACCEPTANCE ? "Acceptance is currently unavailable." : !requiredRead ? "Scroll to the end of each required document to continue." : agreed ? "You have reached the end of each required document and agreed to proceed." : "Check the box to confirm you agree."}</p>{error && <p className="form-status form-error" role="alert">{error}</p>}<button className="button terms-gate-button" type="button" disabled={!agreed || !requiredRead || !TERMS_READY_FOR_ACCEPTANCE} onClick={accept}>Accept &amp; Continue <ArrowRight size={17} /></button></div>
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
  const [acceptedDocuments, setAcceptedDocuments] = useState({});
  const [activeLegalDocument, setActiveLegalDocument] = useState(null);

  useEffect(() => {
    if (!authLoading && user) {
      navigate(nextPath, { replace: true });
    }
  }, [authLoading, user, nextPath, navigate]);

  useEffect(() => {
    const notice = searchParams.get("message");
    if (notice) setMessage(notice);
  }, [searchParams]);

  async function handleSubmit(event) {
    event.preventDefault();
    const acceptedTerms = acceptedDocuments.terms === TERMS_CONTENT_HASH && acceptedDocuments.privacy === PRIVACY_CONTENT_HASH;
    if (signup && !acceptedTerms) {
      setStatus("error");
      setMessage("Please review and accept the Terms & Conditions and Privacy Policy before creating an account.");
      return;
    }
    if (!isSupabaseConfigured) {
      setStatus("error");
      setMessage("Account access is not configured yet. Please contact Adsrow.");
      return;
    }

    setStatus("loading");
    setMessage("");
    try {
      const result = signup
        ? await registerWithLegal({ email: email.trim(), password, fullName: name.trim(), nextPath })
        : await supabase.auth.signInWithPassword({ email: email.trim(), password });

      if (result.error) throw result.error;

      if (signup && result.requiresEmailConfirmation) {
        setStatus("success");
        setMessage("Your account is ready. Check your email for a confirmation link. After verification, you will return to your requested page.");
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
    {signup && activeLegalDocument && <LegalDocumentModal initialDocument={activeLegalDocument} onAccepted={(entries) => setAcceptedDocuments(Object.fromEntries(entries.map((entry) => [entry.type, entry.contentHash])))} onClose={() => setActiveLegalDocument(null)} />}
    <section className="auth-page">
      <div className="auth-decoration" aria-hidden="true"><span /><span /><span /></div>
      <aside className="auth-aside">
        <Link to="/" className="auth-wordmark" aria-label="Adsrow home"><img src="/brand/adsrow-logo-primary.png" alt="Adsrow" width={149} height={32} /></Link>
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
