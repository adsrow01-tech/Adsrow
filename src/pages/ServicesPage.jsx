import { Link } from "react-router-dom";
import { ArrowUpRight, Phone } from "lucide-react";
import { SectionHeading } from "../components/SiteComponents";
import {
  addOnAvailabilityNote,
  adSpecifications,
  adSpecsTip,
  adStandards,
  audiencePacks,
  campaignAddOns,
  campaignPackageNote,
  campaignPackages,
  includedServices,
} from "../lib/siteContent";

const advertiserContact = "/contact?type=advertiser";

function packagePrice(pkg) {
  if (pkg.customQuote) return "Custom quote";
  return pkg.price ? `From ₹${pkg.price}` : "Price on request";
}

function ServicesPage() {
  return (
    <>
      <section className="page-hero services-hero">
        <div className="container services-hero-grid">
          <div className="services-hero-copy">
            <p className="eyebrow">ADVERTISE WITH ADSROW</p>
            <h1>Pick your audience. We'll put you in front of them.</h1>
            <p className="page-hero-description">
              Screens, targeting, creative and reports, all handled by one team. You focus on the calls and walk-ins.
            </p>
            <Link className="button" to={advertiserContact}>
              Plan My Campaign <ArrowUpRight size={16} />
            </Link>
          </div>
          <figure className="services-hero-visual">
            <img
              src="/photos/premium-mall.png"
              alt="Digital advertising display in a busy shopping mall"
              width="1200"
              height="900"
              fetchPriority="high"
              decoding="async"
            />
            <figcaption>Reach people where they already spend time.</figcaption>
          </figure>
        </div>
      </section>

      <section className="section service-packs-section">
        <div className="container">
          <SectionHeading
            eyebrow="AUDIENCE PACKS"
            title="Buy the audience, not just the screen."
            description="Not sure which venues to pick? Start with a pack built around the people you want to reach."
          />
          <div className="service-pack-grid">
            {audiencePacks.map(({ title, category, description }, index) => (
              <article className={`service-pack-card ads-card ads-card-interactive ads-accent-${(index % 6) + 1}`} key={title}>
                <span className="service-pack-index">Audience pack</span>
                <span className="ads-num" aria-hidden="true">0{index + 1}</span>
                <h3>{title}</h3>
                <p className="service-pack-category">{category}</p>
                <p className="service-pack-description">{description}</p>
              </article>
            ))}
          </div>
          <p className="service-availability-note">Venue and screen availability can change. Ask Adsrow to confirm placements for your campaign.</p>
        </div>
      </section>

      <section className="section section-soft services-included-section">
        <div className="container">
          <SectionHeading title="What's included" />
          <div className="services-included-grid">
            {includedServices.map(({ title, description }, index) => (
              <article className={`services-included-card ads-card ads-card-interactive ads-accent-${(index % 6) + 1}`} key={title}>
                <span className="ads-num" aria-hidden="true">0{index + 1}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section services-packages-section" id="packages">
        <div className="container">
          <SectionHeading
            eyebrow="CAMPAIGN PACKAGES"
            title="Pick a size. Mix any venues."
            description="Choose a starting package, then confirm the final venue mix and availability with the team."
          />
          <div className="campaign-package-grid">
            {campaignPackages.map((pkg, index) => (
              <article className={`campaign-package-card ads-card ads-card-interactive ads-accent-${(index % 6) + 1}`} key={pkg.name}>
                <span className="ads-num" aria-hidden="true">0{index + 1}</span>
                <h3>{pkg.name}</h3>
                <dl>
                  <div><dt>Screens</dt><dd>{pkg.screens}</dd></div>
                  <div><dt>Duration</dt><dd>{pkg.duration}</dd></div>
                  <div><dt>Best for</dt><dd>{pkg.bestFor}</dd></div>
                </dl>
                <p className="campaign-package-price">{packagePrice(pkg)}</p>
              </article>
            ))}
          </div>
          <p className="campaign-package-note">{campaignPackageNote}</p>
          <p className="service-availability-note">Package placements depend on current screen availability. Confirm final details and pricing before booking.</p>
        </div>
      </section>

      <section className="section section-soft services-addons-section">
        <div className="container">
          <SectionHeading
            eyebrow="OPTIONAL EXTRAS"
            title="Add-ons for your campaign"
            description="Ask the team which options are available for your selected venues and schedule."
          />
          <div className="services-addon-grid">
            {campaignAddOns.map(({ title, description }, index) => (
              <article className={`services-addon-card ads-card ads-card-interactive ads-accent-${(index % 6) + 1}`} key={title}>
                <span className="ads-num" aria-hidden="true">0{index + 1}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
          <p className="service-availability-note">{addOnAvailabilityNote}</p>
        </div>
      </section>

      <section className="section services-specs-section">
        <div className="container">
          <SectionHeading
            eyebrow="CREATIVE GUIDE"
            title="Ad specs, at a glance."
            description="Confirm final file requirements with Adsrow before sending your creative."
          />
          <div className="ad-specs-wrap" role="region" aria-label="Advertising creative specifications" tabIndex="0">
            <table className="ad-specs-table">
              <thead>
                <tr><th scope="col">Format</th><th scope="col">Size</th><th scope="col">Length</th><th scope="col">File types</th></tr>
              </thead>
              <tbody>
                {adSpecifications.map((spec) => (
                  <tr key={spec.format}>
                    <th scope="row">{spec.format}</th>
                    <td>{spec.size}</td>
                    <td>{spec.length}</td>
                    <td>{spec.fileTypes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="ad-specs-notes">
            <p className="ad-specs-tip"><strong>Quick tip</strong>{adSpecsTip}</p>
            <p className="ad-standards-copy">{adStandards}</p>
          </div>
        </div>
      </section>

      <section className="section section-soft services-final-section">
        <div className="container">
          <div className="services-final-cta ads-card ads-card-featured ads-card-interactive">
            <div>
              <p className="eyebrow">LET'S PLAN YOUR CAMPAIGN</p>
              <h2>Not sure which pack fits?</h2>
              <p>Tell us your goal and budget. We'll recommend the venues and send you a price.</p>
            </div>
            <div className="services-final-actions">
              <Link className="button" to={advertiserContact}>Get a Recommendation <ArrowUpRight size={16} /></Link>
              <a className="services-phone-link" href="tel:+918374622055"><Phone size={16} />Call +91 83746 22055</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default ServicesPage;
