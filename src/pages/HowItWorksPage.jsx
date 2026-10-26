import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "../components/SiteComponents";
import { campaignSteps } from "../lib/siteContent";

function HowItWorksPage() {
  const steps = campaignSteps;

  return (
    <>
      <PageHero
        eyebrow="HOW IT WORKS"
        title="A clear process. No unnecessary complexity."
        description="Adsrow coordinates the screen network; advertisers choose where and when their campaign should play, then review the delivery information available for that campaign."
      />

      <section className="section">
        <div className="container process-list">
          {steps.map((step, index) => (
            <article className="process-row" key={step.title}>
              <span className="process-number">0{index + 1}</span>
              <div>
                <h2>{step.title}</h2>
                <p>{step.description}</p>
              </div>
              <span className="process-icon"><step.icon size={22} /></span>
            </article>
          ))}
        </div>
      </section>

      <section className="section section-soft">
        <div className="container simple-cta">
          <div>
            <h2>Ready to discuss your campaign?</h2>
            <p>Share your target areas, timing, and whether you already have a screen-ready image or video.</p>
          </div>
          <Link className="button" to="/contact">
            Get in Touch <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}

export default HowItWorksPage;
