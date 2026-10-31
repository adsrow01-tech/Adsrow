import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { PageHero, SectionHeading } from "../components/SiteComponents";
import { advertiserFaqs, venuePartnerFaqs } from "../lib/siteContent";

function FaqAccordion({ id, items }) {
  const [openIndex, setOpenIndex] = useState(0);
  const questionRefs = useRef([]);

  function handleQuestionKeyDown(event, index) {
    let nextIndex;
    if (event.key === "ArrowDown") nextIndex = (index + 1) % items.length;
    else if (event.key === "ArrowUp") nextIndex = (index - 1 + items.length) % items.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = items.length - 1;
    else return;

    event.preventDefault();
    questionRefs.current[nextIndex]?.focus();
  }

  return (
    <div className="faq-list">
      {items.map(({ question, answer, contactType, linkLabel }, index) => {
        const isOpen = openIndex === index;
        const questionId = `${id}-question-${index}`;
        const answerId = `${id}-answer-${index}`;
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
                <p className="faq-answer">
                  {answer}
                  {contactType && (
                    <>
                      {" "}
                      <Link className="faq-contact-link" to={`/contact?type=${contactType}`}>
                        {linkLabel}
                      </Link>
                      .
                    </>
                  )}
                </p>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function FaqsPage() {
  return (
    <>
      <PageHero eyebrow="HELP CENTRE" title="Questions, answered.">
        <p className="page-hero-description faq-hero-contact">
          Can't find what you need? Call or WhatsApp{" "}
          <a href="tel:+918374622055">+91 83746 22055</a>.{" "}
          <a href="https://wa.me/918374622055" target="_blank" rel="noreferrer">Message us on WhatsApp</a>.
        </p>
      </PageHero>

      <section className="section faq-section">
        <div className="container faq-section-container">
          <SectionHeading eyebrow="CAMPAIGNS" title="For advertisers" />
          <FaqAccordion id="advertiser-faq" items={advertiserFaqs} />
        </div>
      </section>

      <section className="section section-soft faq-section faq-venue-section">
        <div className="container faq-section-container">
          <SectionHeading eyebrow="PARTNERSHIPS" title="For venue partners" />
          <FaqAccordion id="venue-faq" items={venuePartnerFaqs} />
        </div>
      </section>
    </>
  );
}

export default FaqsPage;
