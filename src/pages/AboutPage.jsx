import { Link } from "react-router-dom";
import { ArrowUpRight, Building2, MessageCircle, MapPin } from "lucide-react";
import { FeatureCard, SectionHeading } from "../components/SiteComponents";

const values = [
  {
    icon: Building2,
    title: "Venues first",
    description: "Every ad is checked and matched to the space. Our partners' audiences come first.",
  },
  {
    icon: MessageCircle,
    title: "Straight answers",
    description: "Clear prices, clear terms and reports that show exactly what ran.",
  },
  {
    icon: MapPin,
    title: "Local, for real",
    description: "We live and work here. We know these neighbourhoods by name.",
  },
];

function AboutPage() {
  return (
    <>
      <section className="page-hero about-hero">
        <div className="container about-hero-grid">
          <div className="about-hero-copy">
            <p className="eyebrow">ABOUT ADSROW</p>
            <h1>We connect local brands with the places people spend their day.</h1>
            <p className="page-hero-description">
              Adsrow is a Vijayawada company building one screen network across the places people live, eat, shop, work and get well.
            </p>
          </div>
          <figure className="about-hero-visual">
            <img
              src="/photos/lift-lobby-family.png"
              alt="Portrait digital advertising display in a residential lift lobby"
              width="1200"
              height="900"
              fetchPriority="high"
              decoding="async"
            />
            <figcaption>Local messages in the places people pause.</figcaption>
          </figure>
        </div>
      </section>

      <section className="section about-story-section">
        <div className="container about-story-grid">
          <div className="about-story-visual">
            <img
              src="/photos/supermarket-checkout.png"
              alt="Digital Adsrow screen displayed in a real-world venue"
              width="1200"
              height="900"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="about-story-copy">
            <p className="eyebrow">OUR STORY</p>
            <h2>Why we started</h2>
            <p>Local businesses had two options: a billboard few people noticed, or pamphlets that went straight in the bin.</p>
            <p>Yet their customers spent hours each day waiting: in lift lobbies, cafés, clinics and checkout queues. We built Adsrow to put the right local message in those moments.</p>
            <p>We began with a 30-screen pilot. Today we're building a 60-screen network across 40 venues, and we're still growing.</p>
          </div>
        </div>
      </section>

      <section className="section section-soft about-values-section">
        <div className="container">
          <SectionHeading eyebrow="OUR PRINCIPLES" title="What we stand for" />
          <div className="feature-grid feature-grid-three about-values-grid">
            {values.map(({ icon: Icon, title, description }, index) => (
              <FeatureCard
                key={title}
                className="about-value-card"
                index={index}
                styled
                decor
                number={`0${index + 1}`}
                icon={Icon}
                title={title}
                description={description}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="section about-founder-section">
        <div className="container">
          <SectionHeading eyebrow="LEADERSHIP" title="Founder & CEO" />
          <article className="about-founder-card ads-card ads-card-interactive ads-accent-1">
            <div className="about-founder-mark" aria-hidden="true">
              <span>RN</span>
              <small>FOUNDER & CEO</small>
            </div>
            <div className="about-founder-copy">
              <p className="eyebrow">FOUNDER & CEO</p>
              <h2>Raviteja Nagulapalli</h2>
              <p>Raviteja has spent 10 years building relationships with developers, businesses and agencies across Andhra Pradesh. He founded Adsrow to give local brands a better way to reach their city.</p>
            </div>
          </article>
        </div>
      </section>

      <section className="section section-soft about-final-section">
        <div className="container">
          <div className="about-final-cta ads-card ads-card-featured ads-card-interactive">
            <div>
              <p className="eyebrow">GET IN TOUCH</p>
              <h2>Let's talk about your next campaign.</h2>
            </div>
            <div className="about-final-actions">
              <Link className="button" to="/contact?type=advertiser">Talk to Our Team <ArrowUpRight size={16} /></Link>
              <Link className="button button-outline" to="/contact?type=venue">Host a Screen <ArrowUpRight size={16} /></Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default AboutPage;
