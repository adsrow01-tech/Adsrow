import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

// Update this value once the campaign turnaround is confirmed by the business team.
const campaignTimelineDays = 7;

const steps = [
  {
    title: "Choose your audience",
    description: "Pick venue types, areas or an audience pack. Or tell us your goal and we'll suggest the strongest mix.",
  },
  {
    title: "Set your schedule",
    description: "Choose how long you run and when you play. Offices peak at lunch, gyms in the evening and malls at weekends.",
  },
  {
    title: "Send your ad, or let us make it",
    description: "Upload a screen-ready image or video. No ad yet? Our creative team will design one.",
  },
  {
    title: "We launch it",
    description: "Your ad goes live on every screen you booked, at the same time. Need a change mid-campaign? We update it remotely.",
  },
  {
    title: "You see the results",
    description: "Get proof of play by screen and date, plus QR scans by venue and tracked calls.",
  },
];

function HowItWorksPage() {
  useEffect(() => {
    const previousTitle = document.title;
    const descriptionMeta = document.querySelector('meta[name="description"]');
    const previousDescription = descriptionMeta?.getAttribute("content");

    document.title = "How It Works | Adsrow";
    descriptionMeta?.setAttribute(
      "content",
      "See how Adsrow helps businesses plan, launch, and manage digital screen advertising across Vijayawada."
    );

    return () => {
      document.title = previousTitle;
      if (previousDescription !== null) descriptionMeta?.setAttribute("content", previousDescription);
    };
  }, []);

  return (
    <main className="how-it-works-page">
      <section className="how-hero">
        <div className="container how-hero-inner">
          <p className="eyebrow">HOW IT WORKS</p>
          <h1>From first call to live screens in <span>{campaignTimelineDays}</span> days.</h1>
          <p className="how-hero-subtitle">You choose who and when. We handle the rest and show you the results.</p>
          <p className="how-timing-note">{campaignTimelineDays} days is a target timeline and is subject to confirmation for your campaign.</p>
        </div>
      </section>

      <section className="section how-process-section" aria-labelledby="how-process-title">
        <div className="container">
          <div className="section-heading how-section-heading">
            <p className="eyebrow">THE PROCESS</p>
            <h2 id="how-process-title">Five steps to your campaign.</h2>
          </div>
          <ol className="how-step-list">
            {steps.map(({ title, description }, index) => (
              <li className={`how-step ads-accent-${(index % 6) + 1}`} key={title}>
                <span className="how-step-number" aria-hidden="true">0{index + 1}</span>
                <div className="how-step-copy">
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="how-capability-note">
            Confirm availability for your campaign: creative production, remote updates, proof-of-play reports, QR scans and tracked calls.
          </p>
        </div>
      </section>

      <section className="section how-cta-section">
        <div className="container how-cta-card ads-card ads-card-featured ads-card-interactive">
          <div>
            <p className="eyebrow">READY WHEN YOU ARE</p>
            <h2>Step one takes two minutes.</h2>
            <p>Tell us who you want to reach, your dates and whether your ad is ready.</p>
          </div>
          <Link className="button how-cta-button" to="/contact">
            Start My Plan <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  );
}

export default HowItWorksPage;
