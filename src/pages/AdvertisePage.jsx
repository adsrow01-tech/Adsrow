import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { PageHero } from "../components/SiteComponents";

function AdvertisePage() {
  return (
    <>
      <PageHero
        eyebrow="ADVERTISE WITH ADSROW"
        title="Plan a campaign around your audience."
        description="Choose the communities and areas you want to reach, share your campaign timing, and tell us whether you have screen-ready creative or need support. The team can confirm placements and pricing."
      />

      <section className="section">
        <div className="container advertise-grid">
          <div>
            <p className="eyebrow">GET STARTED</p>
            <h2 className="section-title">Plan a campaign around your goals.</h2>
            <p className="body-copy">
              Whether you are launching a property, promoting a restaurant
              offer, inviting test drives, sharing a health camp, or promoting
              admissions, tell the team who you want to reach and where.
            </p>
            <ul className="check-list">
              <li><CheckCircle2 size={17} /> Choose areas or communities near your intended audience</li>
              <li><CheckCircle2 size={17} /> Discuss campaign length and time slots</li>
              <li><CheckCircle2 size={17} /> Submit an image or video, or ask about design support</li>
              <li><CheckCircle2 size={17} /> Review available proof of play and tracking options</li>
            </ul>
          </div>

          <div className="plain-note">
            <h3>What to include in your enquiry</h3>
            <p>Business or brand name</p>
            <p>Product or service you want to promote</p>
            <p>Audience, neighbourhoods, or communities you want to reach</p>
            <p>Preferred campaign length and time slots</p>
            <p>Whether you have an image or video, or need creative support</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container text-center">
          <h2 className="section-title">Ready to plan your campaign?</h2>
          <p className="body-copy">Share your goals and target communities with Adsrow.</p>
          <Link className="button" to="/partner-form">Start Your Campaign <ArrowRight size={16} /></Link>
        </div>
      </section>

    </>
  );
}

export default AdvertisePage;
