import { Link } from "react-router-dom";
import { ArrowRight, MapPin, MessageCircle, Mail } from "lucide-react";
import { PageHero } from "../components/SiteComponents";

function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="CONTACT ADSROW"
        title="Let's start with a conversation."
        description="Tell us what you want to promote or which community may host a screen. Include your target area, timing, and creative status; for hosting, share the property and shared-space details. Adsrow can discuss availability, pricing, and next steps."
      />

      <section className="section">
        <div className="container contact-info-grid">
          <article className="contact-info-card">
            <span className="feature-icon"><Mail size={20} /></span>
            <h3>Advertiser enquiry</h3>
            <p>Share your goal, target areas, timing, and creative needs. The team can reply with a suggested plan, communities to target, and pricing.</p>
          </article>

          <article className="contact-info-card">
            <span className="feature-icon"><MapPin size={20} /></span>
            <h3>Our Focus Area</h3>
            <p>The preview’s pilot map lists indicative Vijayawada areas. Ask the team to confirm specific communities and screens.</p>
          </article>

          <article className="contact-info-card">
            <span className="feature-icon"><MessageCircle size={20} /></span>
            <h3>What to Tell Us</h3>
            <p>For screen hosting, include the property or community name, area, shared space, and association or owner contact.</p>
          </article>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container simple-cta">
          <div>
            <p className="eyebrow">PARTNER WITH ADSROW</p>
            <h2>Ready to discuss a campaign or host a screen?</h2>
          </div>
          <Link className="button" to="/partner-form">
            Send a partner enquiry <ArrowRight size={17} />
          </Link>
        </div>
      </section>

    </>
  );
}

export default ContactPage;
