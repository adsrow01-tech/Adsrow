import { Link } from "react-router-dom";
import { ArrowRight, MapPin, ChartNoAxesCombined, Target } from "lucide-react";
import { PageHero, SectionHeading, FeatureCard } from "../components/SiteComponents";

function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="ABOUT ADSROW"
        title="A community-screen network for local advertisers."
        description="Adsrow brings digital advertising into gated-community lift lobbies, coordinating businesses, residential associations, screen-ready creative, and campaign reporting through one team."
      />

      <section className="section">
        <div className="container about-grid">
          <div>
            <p className="eyebrow">WHO WE ARE</p>
            <h2 className="section-title">
              One coordinated campaign across selected communities.
            </h2>
          </div>

          <div>
            <p className="body-copy">
              Adsrow’s preview describes a network of digital screens inside
              gated communities. Advertisers choose areas and communities that
              fit their audience, while Adsrow coordinates each selected
              placement through one team.
            </p>
            <p className="body-copy">
              The setting is different from a roadside billboard or a one-time
              pamphlet drop: residents encounter a screen in their lift lobby
              as part of their everyday community. Campaign timing, creative,
              remote updates, and available reports are discussed around the
              selected screens.
            </p>
            <Link to="/contact" className="text-link">
              Talk to Our Team <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container">
          <SectionHeading
            eyebrow="WHAT GUIDES US"
            title="Built around community, choice, and visibility"
            description="The pilot model brings location selection and campaign coordination together, with delivery information to review after launch."
          />

          <div className="feature-grid feature-grid-three">
            <FeatureCard icon={Target} title="Community-level placement" description="Choose residential communities and areas relevant to the people you want to reach." />
            <FeatureCard icon={MapPin} title="One team for selected locations" description="Coordinate a campaign across multiple communities without arranging each venue separately." />
            <FeatureCard icon={ChartNoAxesCombined} title="Delivery you can review" description="The preview describes proof of play by screen and date, with QR and campaign-call tracking options." />
          </div>
        </div>
      </section>
    </>
  );
}

export default AboutPage;
