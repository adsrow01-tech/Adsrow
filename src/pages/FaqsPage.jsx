import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { PageHero } from "../components/SiteComponents";

function FaqsPage() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    ["How much does an Adsrow campaign cost?", "The supplied preview does not publish rates. Send your target areas, campaign length, and creative needs; the Adsrow team can reply with a suggested plan, communities to target, and pricing."],
    ["Can I choose specific communities?", "Yes. The preview describes choosing communities and areas closest to your customers, or asking Adsrow to suggest a mix. Ask the team for the full community list and screen photos, and confirm current availability."],
    ["What kind of ad do I need?", "The preview supports an image or video. If you do not have screen-ready material, Adsrow’s creative team can prepare images or videos for your brand. Confirm the exact file requirements with the team."],
    ["Can I change my ad during the campaign?", "The preview describes remote campaign updates, including changing offers or prices. Contact Adsrow with the update; timing for a specific campaign should be confirmed with the team."],
    ["How do I know my ad actually played?", "The preview describes proof-of-play reporting by screen and date, so you can review where the ad ran rather than relying only on an installation photo."],
    ["What campaign tracking is available?", "The preview lists QR-code scans by community and calls made through a campaign number. Confirm which tracking options are available for your campaign."],
    ["What does a screen-hosting partnership include?", "The preview says Adsrow installs and maintains the display, and that associations can use it for community notices between ads. Ads are reviewed for family-friendly content, and partnership terms are explained before installation."],
    ["How can our community or venue enquire?", "Share the property or community name, Vijayawada area, shared space, and an association or owner contact. The team can discuss suitability, installation, maintenance, and partnership terms before anything is installed."],
  ];

  return (
    <>
      <PageHero
        eyebrow="HELP CENTRE"
        title="Frequently asked questions"
        description="Answers based on the supplied Adsrow preview. Confirm campaign pricing, current screen availability, and campaign-specific support with the team."
      />

      <section className="section">
        <div className="container faq-list">
          {faqs.map(([question, answer], index) => (
            <article className="faq-item" key={question}>
              <button
                className="faq-question"
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                aria-expanded={openIndex === index}
              >
                <span>{question}</span>
                <ChevronDown
                  size={20}
                  className={openIndex === index ? "rotated" : ""}
                />
              </button>

              {openIndex === index && (
                <p className="faq-answer">{answer}</p>
              )}
            </article>
          ))}
        </div>
      </section>

    </>
  );
}

export default FaqsPage;
