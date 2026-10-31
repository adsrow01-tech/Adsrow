import { Link } from "react-router-dom";
import { ArrowUpRight, MapPin } from "lucide-react";
import { SectionHeading } from "../components/SiteComponents";
import VijayawadaCoverageMap from "../components/VijayawadaCoverageMap";
import { targetAreas, venueCategories } from "../lib/siteContent";

const enquiryLink = "/contact?type=advertiser";

function NetworkPage() {
  return (
    <>
      <section className="page-hero network-hero">
        <div className="container network-hero-grid">
          <div className="network-hero-copy">
            <p className="eyebrow">OUR NETWORK</p>
            <h1>60 screens. 40 venues. Seven ways to reach Vijayawada.</h1>
            <p className="page-hero-description">
              From apartment lifts to hospital receptions, our screens sit where people wait. Ask for the full venue list with screen photos.
            </p>
            <Link className="button" to={enquiryLink}>
              Get the Venue List <ArrowUpRight size={16} />
            </Link>
            <div className="network-scale-note">
              <strong>60 screens <span>·</span> 40 venues</strong>
              <span>Ask Adsrow to confirm current availability and participating venues.</span>
            </div>
          </div>
          
        </div>
      </section>

      <section className="section network-venues-section">
        <div className="container">
          <SectionHeading
            eyebrow="SEVEN VENUE TYPES"
            title="Every venue, a different mindset."
            description="Choose the places that fit your audience. Ask the Adsrow team for current venue availability and screen photos."
          />
          <div className="network-venue-grid">
            {venueCategories.map(({ icon: Icon, title, audience, bestFor }, index) => (
              <article className={`network-venue-card ads-card ads-card-interactive ads-accent-${(index % 6) + 1}`} key={title}>
                <div className="network-venue-card-top">
                  <span className="network-venue-icon" aria-hidden="true"><Icon size={21} strokeWidth={1.8} /></span>
                  <span className="network-venue-index ads-num" aria-hidden="true">0{index + 1}</span>
                </div>
                <h3>{title}</h3>
                <div className="network-venue-detail">
                  <h4>Audience</h4>
                  <p>{audience}</p>
                </div>
                <div className="network-venue-detail network-best-for">
                  <h4>Best for</h4>
                  <p>{bestFor}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <VijayawadaCoverageMap />

      <section className="section section-soft network-areas-section">
        <div className="container">
          <SectionHeading
            eyebrow="CITY COVERAGE"
            title="Where you'll find us in Vijayawada"
            description="These areas are part of the Vijayawada coverage map. Specific venues and live screens in each area need confirmation."
          />
          <div className="network-area-grid">
            {targetAreas.map((area, index) => (
              <div className={`network-area-card ads-accent-${(index % 6) + 1}`} key={area}>
                <MapPin size={17} aria-hidden="true" />
                <span>{area}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section network-final-section">
        <div className="container">
          <div className="location-callout network-final-cta ads-card ads-card-featured ads-card-interactive">
            <span className="callout-icon"><MapPin size={24} /></span>
            <div>
              <h2>Looking for a specific venue or area?</h2>
              <p>Tell us who you want to reach. We'll show you the screens that get you there.</p>
            </div>
            <Link className="button" to={enquiryLink}>
              Ask Our Team <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default NetworkPage;
