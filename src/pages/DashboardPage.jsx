import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, UserRound } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { getSubmittedEnquiryCount } from "../lib/dashboard";

export default function DashboardPage() {
  const { user } = useAuth();
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || "");
  const [phone, setPhone] = useState(user?.user_metadata?.phone || "");
  const [count, setCount] = useState(() => getSubmittedEnquiryCount(user?.id));
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setCount(getSubmittedEnquiryCount(user?.id));
  }, [user?.id]);

  async function saveProfile(event) {
    event.preventDefault();
    setStatus("");
    setError("");
    setSaving(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        data: { full_name: fullName.trim(), phone: phone.trim() },
      });
      if (updateError) throw updateError;
      setStatus("Your profile details were updated.");
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Your profile could not be updated. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <section className="dashboard-banner">
        <div className="container dashboard-heading">
          <p className="eyebrow">YOUR ADSROW ACCOUNT</p>
          <h1 className="page-title">Welcome back{fullName ? `, ${fullName.split(" ")[0]}` : ""}.</h1>
          <p className="body-copy">Manage your profile and keep track of your Adsrow enquiries.</p>
          <Link to="/partner-form" className="button">Partner with Adsrow <ArrowRight size={16} /></Link>
        </div>
      </section>

      <section className="dashboard-page section">
        <div className="container">
        <div className="dashboard-grid">
          <article className="dashboard-card dashboard-stat-card">
            <span className="dashboard-icon"><CheckCircle2 size={20} /></span>
            <p className="dashboard-label">Submitted enquiries</p>
            <strong>{count}</strong>
            <small>Tracked from this browser</small>
            <Link to="/advertise" className="dashboard-link">Start an enquiry <ArrowRight size={16} /></Link>
          </article>

          <article className="dashboard-card">
            <div className="dashboard-card-heading"><span className="dashboard-icon"><UserRound size={20} /></span><div><h2>Personal details</h2><p>Keep your contact details up to date.</p></div></div>
            <form className="dashboard-form" onSubmit={saveProfile}>
              <label>Full name<input value={fullName} onChange={(event) => setFullName(event.target.value)} maxLength={100} autoComplete="name" /></label>
              <label>Email address<input value={user?.email || ""} readOnly disabled /></label>
              <label>Mobile number<input value={phone} onChange={(event) => setPhone(event.target.value)} type="tel" autoComplete="tel" placeholder="+91 98765 43210" /></label>
              {error && <p className="form-status form-error" role="alert">{error}</p>}
              {status && <p className="form-status form-success" role="status">{status}</p>}
              <button className="button dashboard-save" type="submit" disabled={saving}>{saving ? "Saving…" : "Save details"}</button>
            </form>
          </article>
        </div>
      </div>
      </section>
    </>
  );
}
