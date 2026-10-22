import { Link } from "react-router-dom";
import { ArrowLeft, BarChart3, MonitorUp, Sparkles } from "lucide-react";
import "../styles/Auth.css";

export default function AuthLayout({ children }) {
  return (
    <section className="auth-page">
      <aside className="auth-visual" aria-label="Adsrow brand introduction">
        <Link to="/" className="auth-brand" aria-label="Adsrow home">
          ads<span>row</span><i>.</i><sup>®</sup>
        </Link>

        <div className="auth-visual-copy">
          <span className="auth-eyebrow">ADSROW NETWORK</span>
          <h1>Put your message in the right places.</h1>
          <p>Build a presence that feels local, visible, and relevant to the communities you want to reach.</p>
        </div>

        <div className="auth-visual-art" aria-hidden="true">
          <div className="auth-screen-card">
            <div className="auth-screen-top"><span /><span /><span /></div>
            <div className="auth-screen-content"><Sparkles size={18} /><strong>Reach the right audience</strong><small>Campaigns made visible</small></div>
            <div className="auth-screen-bars"><i /><i /><i /><i /></div>
          </div>
          <div className="auth-art-orb auth-art-orb-one" />
          <div className="auth-art-orb auth-art-orb-two" />
          <div className="auth-art-chip auth-art-chip-one"><MonitorUp size={15} /> Digital screens</div>
          <div className="auth-art-chip auth-art-chip-two"><BarChart3 size={15} /> Local reach</div>
        </div>

        <p className="auth-visual-footer">Brands. In the right places.</p>
      </aside>

      <main className="auth-content">
        <Link to="/" className="auth-back-home">
          <ArrowLeft size={17} />
          Back to Adsrow
        </Link>

        <section className="auth-card">
          {children}
          <p className="auth-footer">© {new Date().getFullYear()} Adsrow. All rights reserved.</p>
        </section>
      </main>
    </section>
  );
}

