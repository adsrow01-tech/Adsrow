import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, UserRound } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getSubmittedEnquiryCount } from "../lib/dashboard";

export default function DashboardPage() {
  const { user } = useAuth();
  const [count, setCount] = useState(() => getSubmittedEnquiryCount(user?.id));
  const fullName = user?.user_metadata?.full_name || "";
  const phone = user?.user_metadata?.phone || "";

  useEffect(() => {
    setCount(getSubmittedEnquiryCount(user?.id));
  }, [user?.id]);

  return (
    <>
      <section className="dashboard-banner">
        <div className="container dashboard-heading">
          <p className="eyebrow">YOUR ADSROW ACCOUNT</p>
          <h1 className="page-title">Welcome back{fullName ? `, ${fullName.split(" ")[0]}` : ""}.</h1>
          <p className="body-copy">View your account details and keep track of your Adsrow enquiries.</p>
          <Link to="/partner-form" className="button">Partner with Adsrow <ArrowRight size={16} /></Link>
        </div>
      </section>

      <section className="dashboard-page section">
        <div className="container dashboard-grid">
          <article className="dashboard-card dashboard-stat-card">
            <span className="dashboard-icon"><CheckCircle2 size={20} /></span>
            <p className="dashboard-label">Submitted enquiries</p>
            <strong>{count}</strong>
            <small>Tracked from this browser</small>
            <Link to="/partner-form" className="dashboard-link">Start an enquiry <ArrowRight size={16} /></Link>
          </article>

          <article className="dashboard-card">
            <div className="dashboard-card-heading"><span className="dashboard-icon"><UserRound size={20} /></span><div><h2>Personal details</h2><p>Details associated with your Adsrow account.</p></div></div>
            <dl className="dashboard-profile-details">
              <div><dt>Full name</dt><dd>{fullName || "Not provided"}</dd></div>
              <div><dt>Email address</dt><dd>{user?.email || "Not available"}</dd></div>
              <div><dt>Mobile number</dt><dd>{phone || "Not provided"}</dd></div>
            </dl>
          </article>
        </div>
      </section>
    </>
  );
}
