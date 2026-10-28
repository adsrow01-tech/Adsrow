import { Link } from "react-router-dom";
import { ArrowUpRight, MapPin, ChartNoAxesCombined, Users, ClipboardCheck } from "lucide-react";
import { PageHero, SectionHeading, FeatureCard, ComparisonTable } from "../components/SiteComponents";

function WhyAdsrowPage() {
  const reasons = [
    { icon: MapPin, title: "Choose communities", description: "Select exact neighbourhoods and communities relevant to your customers, subject to current screen availability." },
    { icon: Users, title: "Reach residents at home", description: "Place a message in a lift-lobby setting where residents pause, rather than beside a moving road or in a one-time handout." },
    { icon: ClipboardCheck, title: "Coordinate through one team", description: "Plan selected locations, timing, creative, and campaign changes with Adsrow rather than arranging each community independently." },
    { icon: ChartNoAxesCombined, title: "Review campaign delivery", description: "Review proof of play by screen and date, QR scans by community, and campaign-number calls." },
  ];

  return (
    <>
      <PageHero
        eyebrow="WHY ADSROW"
        title="Not where they pass. Where they pause."
        description="Lift-lobby screens offer a community-based alternative to roadside billboards and pamphlet distribution, with location choices and campaign delivery reports."
      />

      <section className="section">
        <div className="container feature-grid feature-grid-four">
          {reasons.map((reason) => (
            <FeatureCard key={reason.title} {...reason} />
          ))}
        </div>
      </section>

      <section className="section section-soft">
        <div className="container">
          <SectionHeading
            eyebrow="WHAT YOU GET"
            title="Compare the placement and delivery options"
            description="Compare the available placements and campaign tracking. Results depend on selected locations and campaign goals."
          />
          <ComparisonTable />
        </div>
      </section>

      <section className="section section-soft">
        <div className="container simple-cta">
          <div>
            <h2>Let's find the right approach for your business.</h2>
            <p>Tell us what you want to promote and who you want to reach.</p>
          </div>
          <Link className="button" to="/contact">
            Talk to Adsrow <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}

export default WhyAdsrowPage;
