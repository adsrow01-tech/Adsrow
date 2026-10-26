import { Link } from "react-router-dom";
import { ArrowRight, Monitor, Building2, CheckCircle2, ClipboardCheck } from "lucide-react";
import { PageHero, FeatureCard } from "../components/SiteComponents";

function HostAScreenPage() {
  return (
    <>
      <PageHero
        eyebrow="HOST A SCREEN"
        title="Host an Adsrow screen in your community."
        description="Apartment associations, residential communities, property owners, and eligible venue partners can enquire about a digital display for their shared space. The supplied preview identifies gated communities and apartments as the current pilot focus."
      />

      <section className="section">
        <div className="container feature-grid feature-grid-three">
          <FeatureCard icon={Building2} title="Share the location" description="Tell us the community or property name, Vijayawada area, and the shared space being considered." />
          <FeatureCard icon={Monitor} title="Discuss installation and care" description="The preview says Adsrow installs and maintains the display. The team can review site details with the association or owner." />
          <FeatureCard icon={ClipboardCheck} title="Review terms before installation" description="Discuss community notices, ad-content review, and partnership terms before any installation is agreed." />
        </div>
      </section>

      <section className="section section-soft">
        <div className="container host-requirements">
          <h2 className="section-title">How the screen partnership works</h2>
          <p className="body-copy">The preview describes community announcements running between ads. Ad content is reviewed before going live to keep it family-friendly, and partnership terms are explained clearly before installation.</p>
          <ul className="check-list">
            <li><CheckCircle2 size={17} /> Adsrow team installation and maintenance, as described in the preview</li>
            <li><CheckCircle2 size={17} /> Space for association or community notices between advertisements</li>
            <li><CheckCircle2 size={17} /> Review of ad content before it goes live</li>
            <li><CheckCircle2 size={17} /> Partnership terms discussed before installation</li>
          </ul>
          <p className="small-note">
            Enquire with the property name, area, shared-space details, and an association or owner contact. The team must confirm current suitability and terms.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container text-center">
          <h2 className="section-title">Tell us about your space</h2>
          <p className="body-copy">Share your community details and hosting requirements with Adsrow.</p>
          <Link className="button" to="/partner-form?interest=Hosting%20a%20screen">Enquire About Hosting <ArrowRight size={16} /></Link>
        </div>
      </section>

    </>
  );
}

export default HostAScreenPage;
