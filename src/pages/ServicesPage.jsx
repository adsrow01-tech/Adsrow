import { Link } from "react-router-dom";
import { ArrowUpRight, Monitor, MapPin, Palette, ChartNoAxesCombined, Building2, CheckCircle2, Users, ClipboardCheck } from "lucide-react";
import { PageHero, SectionHeading, FeatureCard } from "../components/SiteComponents";

function ServicesPage() {
  const services = [
    { icon: Monitor, title: "Community Screen Network", description: "Coordinate one campaign across selected gated communities through one Adsrow team, rather than arranging every venue on its own." },
    { icon: MapPin, title: "Area-Targeted Campaigns", description: "Choose communities near a project site, store, clinic, or other audience. Exact screens and availability are confirmed with the team." },
    { icon: Palette, title: "Ad Design and Video", description: "Provide an existing image or video, or ask Adsrow’s creative team to prepare screen-ready material for your brand." },
    { icon: ChartNoAxesCombined, title: "Campaign Reports", description: "Review proof of play by screen and date, QR-code scans by community, and calls placed through a campaign number where supported." },
  ];
  const audiences = [
    [Building2, "Real estate", "Project launches, site visits, and property offers."],
    [Users, "Restaurants and cafés", "Delivery offers and new menu announcements."],
    [Monitor, "Automobiles", "Test-drive invitations and festive offers."],
    [CheckCircle2, "Clinics and hospitals", "Health camps and specialist services."],
    [ClipboardCheck, "Education", "Admissions and coaching batches."],
    [MapPin, "Retail and local shops", "Sales and new store openings."],
  ];

  return (
    <>
      <PageHero
        eyebrow="OUR SERVICES"
        title="Everything you need to advertise on Adsrow."
        description="A community-screen network, location choices, screen-ready creative, and reporting coordinated through one team."
      >
        <Link className="button" to="/contact">
          Discuss Your Needs <ArrowUpRight size={16} />
        </Link>
      </PageHero>

      <section className="section">
        <div className="container feature-grid feature-grid-four">
          {services.map((service) => (
            <FeatureCard key={service.title} {...service} />
          ))}
        </div>
      </section>

      <section className="section section-soft">
        <div className="container">
          <SectionHeading
            eyebrow="WHO ADVERTISES ON ADSROW"
            title="Campaigns for local moments and needs"
            description="The supplied preview highlights these advertiser categories and campaign examples."
          />
          <div className="feature-grid audience-grid">
            {audiences.map(([Icon, title, description]) => (
              <FeatureCard key={title} icon={Icon} title={title} description={description} />
            ))}
          </div>
        </div>
      </section>

    </>
  );
}

export default ServicesPage;
