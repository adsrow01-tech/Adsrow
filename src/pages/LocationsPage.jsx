import { Link } from "react-router-dom";
import { ArrowUpRight, Monitor, MapPin, Building2, Users } from "lucide-react";
import { PageHero, SectionHeading } from "../components/SiteComponents";
import { targetAreas } from "../lib/siteContent";

function LocationsPage() {
  const locations = [
    { icon: Building2, title: "Gated communities and apartments", status: "Pilot focus · listed live in the preview", description: "The preview identifies residential communities as the current venue category. Ask Adsrow to confirm specific communities and screens." },
    { icon: Users, title: "Gyms and fitness centres", status: "Coming soon in the preview", description: "Shown as a future venue category; availability and timing need confirmation." },
    { icon: MapPin, title: "Supermarkets and malls", status: "Coming soon in the preview", description: "Shown as a planned venue category, not as a current screen location." },
    { icon: Monitor, title: "Offices and commercial spaces", status: "Coming soon in the preview", description: "Shown as a planned venue category; contact the team about future suitability." },
  ];

  return (
    <>
      <PageHero
        eyebrow="OUR LOCATIONS"
        title="Find a place that fits your audience."
        description="The supplied preview describes a Vijayawada pilot focused on gated communities. Specific communities and screen availability should be confirmed with Adsrow."
      >
        <Link className="button" to="/contact">
          Ask About Locations <ArrowUpRight size={16} />
        </Link>
      </PageHero>

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="PILOT VENUE STATUS"
            title="Residential communities come first"
            description="These status labels follow the supplied preview. It does not provide a public list of confirmed live community addresses."
          />

          <div className="feature-grid feature-grid-four">
            {locations.map(({ icon: Icon, title, status, description }) => (
              <article className="feature-card location-status-card" key={title}>
                <span className="feature-icon"><Icon size={21} /></span>
                <p className="location-status">{status}</p>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container">
          <SectionHeading
            eyebrow="INDICATIVE PILOT AREAS"
            title="Vijayawada, Andhra Pradesh"
            description="The schematic pilot map names these areas. They indicate the rollout focus, not specific confirmed screens; ask Adsrow for its community list and screen photos."
          />
          <div className="area-grid">
            {targetAreas.map((area) => (
              <div className="area-card" key={area}>
                <MapPin size={17} />
                {area}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container location-callout">
          <span className="callout-icon"><MapPin size={24} /></span>
          <div>
            <h2>Looking for a specific area?</h2>
            <p>Tell us the neighbourhood or audience you want to reach.</p>
          </div>
          <Link className="button" to="/contact">
            Ask Our Team <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}

export default LocationsPage;
