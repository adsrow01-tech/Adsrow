import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ChevronDown, Phone } from "lucide-react";
import { FeatureCard, SectionHeading } from "../components/SiteComponents";
import {
  hostPartnerBenefits,
  hostScreenBenefits,
  hostScreenFaqs,
  hostScreenSteps,
} from "../lib/siteContent";

const venueEnquiryLink = "/contact?type=venue";

function HostFaqAccordion() {
  const [openIndex, setOpenIndex] = useState(0);
  const questionRefs = useRef([]);

  function handleQuestionKeyDown(event, index) {
    let nextIndex;
    if (event.key === "ArrowDown") nextIndex = (index + 1) % hostScreenFaqs.length;
    else if (event.key === "ArrowUp") nextIndex = (index - 1 + hostScreenFaqs.length) % hostScreenFaqs.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = hostScreenFaqs.length - 1;
    else return;

    event.preventDefault();
    questionRefs.current[nextIndex]?.focus();
  }

  return (
    <div className="faq-list host-faq-list">
      {hostScreenFaqs.map(({ question, answer }, index) => {
        const isOpen = openIndex === index;
        const questionId = `host-faq-question-${index}`;
        const answerId = `host-faq-answer-${index}`;
        return (
          <article className={`faq-item ads-accent-${(index % 6) + 1}${isOpen ? " is-open" : ""}`} key={question}>
            <h3 className="faq-heading">
              <button
                ref={(element) => { questionRefs.current[index] = element; }}
                id={questionId}
                className="faq-question"
                type="button"
                aria-expanded={isOpen}
                aria-controls={answerId}
                onClick={() => setOpenIndex(isOpen ? -1 : index)}
                onKeyDown={(event) => handleQuestionKeyDown(event, index)}
              >
                <span>{question}</span>
                <ChevronDown size={20} className={isOpen ? "rotated" : ""} aria-hidden="true" />
              </button>
            </h3>
            <div
              className={`faq-answer-panel${isOpen ? " is-open" : ""}`}
              id={answerId}
              role="region"
              aria-labelledby={questionId}
              aria-hidden={!isOpen}
              inert={!isOpen}
            >
              <div className="faq-answer-inner">
                <p className="faq-answer">{answer}</p>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function HostAScreenPage() {
  return (
    <>
      <section className="page-hero host-screen-hero">
        <div className="container host-screen-hero-grid">
          <div className="host-screen-hero-copy">
            <p className="eyebrow">FOR VENUE OWNERS AND MANAGERS</p>
            <h1>Put a screen to work in your space.</h1>
            <p className="page-hero-description">
              We work with venue owners to place digital screens in shared spaces. Installation, maintenance, costs and partnership terms can be discussed before anything is agreed.
            </p>
            <Link className="button" to={venueEnquiryLink}>
              Request a Site Visit <ArrowUpRight size={16} />
            </Link>
          </div>
          <figure className="host-screen-hero-visual">
            <img
              src="/photos/corporate-hub.png"
              alt="Digital advertising screen in a corporate office lobby"
              width="1200"
              height="900"
              fetchPriority="high"
              decoding="async"
            />
            <figcaption>A shared-space screen for venue notices and advertising.</figcaption>
          </figure>
        </div>
      </section>

      <section className="section host-benefits-section">
        <div className="container">
          <SectionHeading
            eyebrow="VENUE BENEFITS"
            title="What a screen does for your venue"
            description="A screen can help share timely information with people already in your space."
          />
          <div className="feature-grid host-venue-grid">
            {hostScreenBenefits.map(({ icon: Icon, title, description }, index) => (
              <FeatureCard
                key={title}
                className="host-venue-card"
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

      <section className="section section-soft host-partner-section">
        <div className="container">
          <SectionHeading
            eyebrow="PARTNER TERMS"
            title="Every partner gets"
            description="Discuss the details with Adsrow and have the agreed terms documented before installation."
          />
          <div className="host-partner-grid">
            {hostPartnerBenefits.map(({ title, description }, index) => (
              <article className={`host-partner-card ads-card ads-card-interactive ads-accent-${(index % 6) + 1}`} key={title}>
                <span className="ads-num" aria-hidden="true">0{index + 1}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
              </article>
            ))}
          </div>
          <p className="host-terms-note">No-cost installation and maintenance, revenue-share terms, and responsibility for power and internet require confirmation for each partnership.</p>
        </div>
      </section>

      <section className="section host-process-section">
        <div className="container">
          <SectionHeading eyebrow="HOW IT WORKS" title="A clear process, from enquiry to installation" />
          <ol className="host-process-grid">
            {hostScreenSteps.map(({ title, description }, index) => (
              <li className={`host-process-card ads-card ads-card-interactive ads-accent-${(index % 6) + 1}`} key={title}>
                <span className="ads-num" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section section-soft host-faq-section">
        <div className="container host-faq-container">
          <SectionHeading eyebrow="PARTNERSHIPS" title="Venue partner FAQs" />
          <HostFaqAccordion />
        </div>
      </section>

      <section className="section host-final-section">
        <div className="container">
          <div className="host-final-cta ads-card ads-card-featured ads-card-interactive">
            <div>
              <p className="eyebrow">PARTNER WITH ADSROW</p>
              <h2>Your space already has the audience. Let's put it to work.</h2>
            </div>
            <div className="host-final-actions">
              <Link className="button" to={venueEnquiryLink}>Request a Site Visit <ArrowUpRight size={16} /></Link>
              <a className="host-phone-link" href="tel:+918374622055"><Phone size={16} />Call +91 83746 22055</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default HostAScreenPage;
