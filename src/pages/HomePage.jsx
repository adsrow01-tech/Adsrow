import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowUpRight, ArrowRight, Monitor, MapPin, Palette, ChartNoAxesCombined, CheckCircle2, Users, ClipboardCheck } from "lucide-react";
import { SectionHeading, FeatureCard, ComparisonTable } from "../components/SiteComponents";
import { targetAreas, campaignSteps } from "../lib/siteContent";

function HomePage() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const [heroVideoFailed, setHeroVideoFailed] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(preference.matches);
    preference.addEventListener("change", updatePreference);
    return () => preference.removeEventListener("change", updatePreference);
  }, []);


  const services = [
    {
      icon: Monitor,
      title: "Digital Screen Advertising",
      description:
        "Run one campaign across selected gated communities through one Adsrow team, instead of arranging each venue separately.",
    },
    {
      icon: MapPin,
      title: "Location-Based Advertising",
      description:
        "Choose areas and communities near a project site, store, clinic, or other audience you want to reach, subject to availability.",
    },
    {
      icon: Palette,
      title: "Ad Creative Support",
      description:
        "Send an existing image or video, or ask the creative team to prepare screen-ready material for your brand.",
    },
    {
      icon: ChartNoAxesCombined,
      title: "Campaign Updates & Reports",
      description:
        "Review proof of play by screen and date, plus available QR scans by community and calls through your campaign number.",
    },
  ];

  return (
    <>
      <section className="home-hero home-hero-cinematic">
        <div className="home-hero-media" aria-hidden="true">
          {!prefersReducedMotion && !heroVideoFailed && (
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              fetchPriority="high"
              width="1376"
              height="768"
              tabIndex="-1"
              onError={() => setHeroVideoFailed(true)}
              src="/videos/demo-adsrow-pingpong.mp4"
            />
          )}
          <span className="home-hero-scrim" />
        </div>
        <div className="container home-hero-grid">
          <div className="home-hero-copy">
            <p className="eyebrow">
              <span className="eyebrow-dot" />
              DIGITAL ADVERTISING IN VIJAYAWADA
            </p>

            <h1>
              Your Brand, Right Where{" "}
              <span>Communities Connect.</span>
            </h1>

            <p className="hero-description">
              Adsrow places portrait 9:16 digital screens in gated-community
              lift lobbies, bringing your message into residents’ everyday
              spaces. Plan a campaign across selected Vijayawada communities
              with one team, then review where it played.
            </p>

            <div className="hero-actions">
              <Link className="button" to="/partner-form">
                Partner with Adsrow <ArrowUpRight size={16} />
              </Link>

              <Link className="text-link" to="/how-it-works">
                See How It Works <ArrowRight size={16} />
              </Link>
            </div>

            <p className="hero-trust">
              <CheckCircle2 size={17} />
              Community placements, coordinated in one campaign.
            </p>
          </div>

        </div>
      </section>

      <section className="intro-strip">
        <div className="container pilot-highlights">
          <div className="pilot-highlights-heading">
            <p className="eyebrow">VIJAYAWADA PILOT FIGURES IN THE PREVIEW</p>
            <p>These are pilot figures from the supplied preview. Confirm current screen and community availability with Adsrow.</p>
          </div>
          <div className="stats-grid">
            <div className="stat-item"><strong>30</strong><span>digital screens in the pilot</span></div>
            <div className="stat-item"><strong>20</strong><span>gated communities</span></div>
            <div className="stat-item"><strong>1</strong><span>dashboard described for managing the network</span></div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="WHAT WE DO"
            title="Everything you need to advertise on Adsrow"
            description="Coordinate community placements, audience areas, screen-ready creative, and campaign reporting through one team."
          />

          <div className="feature-grid feature-grid-four">
            {services.map((service) => (
              <FeatureCard key={service.title} {...service} />
            ))}
          </div>

          <div className="center-link">
            <Link className="text-link" to="/services">
              View All Services <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container location-feature">
          <div className="location-photo">
           <img
                   src="/adsrow-lobby.png"
                    alt="Adsrow advertising display in a lobby"
                   className="hero-image"
                  />
            <span className="photo-tag">
              <MapPin size={15} /> Vijayawada, Andhra Pradesh
            </span>
          </div>

          <div>
            <p className="eyebrow">ABOUT ADSROW</p>
            <h2 className="section-title">
              Connecting local businesses with residential communities.
            </h2>
            <p className="body-copy">
              Adsrow helps businesses explore digital advertising on screens
              in apartment communities. We coordinate campaign goals with
              potential placements and the people who manage those spaces.
            </p>

            <ul className="check-list">
              <li><CheckCircle2 size={17} /> Select communities close to your audience</li>
              <li><CheckCircle2 size={17} /> Coordinate campaign timing and updates with one team</li>
              <li><CheckCircle2 size={17} /> Review available proof of play and response tracking</li>
            </ul>

            <Link className="button button-outline" to="/locations">
              Explore Locations <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="INITIAL MARKET"
            title="Pilot areas across Vijayawada"
            description="These are the indicative areas shown in Adsrow’s pilot preview, not a list of confirmed live screens. The map is schematic; ask the team for current community availability."
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

      <section className="section">
        <div className="container">
          <SectionHeading
            centered
            eyebrow="HOW IT WORKS"
            title="A clear path to launch"
            description="Campaigns are coordinated with the Adsrow team, from your first enquiry through launch planning."
          />

          <div className="feature-grid home-process-grid">
            {campaignSteps.map((step, index) => (
              <FeatureCard
                key={step.title}
                number={`0${index + 1}`}
                icon={step.icon}
                title={step.title}
                description={step.description}
              />
            ))}
          </div>

          <div className="center-link">
            <Link className="text-link" to="/how-it-works">
              Learn How It Works <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="section section-navy">
        <div className="container why-home-grid">
          <div>
            <p className="eyebrow eyebrow-light">WHY ADSROW</p>
            <h2 className="section-title">Local campaigns, thoughtfully coordinated.</h2>
            <p className="body-copy">Adsrow brings businesses and residential communities together through a clear, people-first process.</p>
          </div>
          <div className="why-points">
            <p><MapPin size={19} /> Choose specific communities near your customers</p>
            <p><Users size={19} /> Reach residents in lift lobbies as they wait and pause</p>
            <p><ClipboardCheck size={19} /> Coordinate screens, time slots, creative and changes through one team</p>
            <p><ChartNoAxesCombined size={19} /> Review proof of play and available QR or call tracking</p>
          </div>
        </div>
        <div className="container comparison-block">
          <h3>Not where they pass. Where they pause.</h3>
          <p>A lift-lobby screen reaches residents inside their community. The preview compares that setting with a roadside billboard and pamphlet distribution.</p>
          <ComparisonTable />
        </div>
      </section>

      <section className="host-banner">
        <div className="container host-banner-inner">
          <div>
            <p className="eyebrow eyebrow-light">HAVE A SUITABLE SPACE?</p>
            <h2>Turn your community screen into an opportunity.</h2>
            <p>
              Adsrow’s preview describes installation and maintenance by its
              team, with space for community notices between ads. Share your
              property details to discuss suitability and partnership terms.
            </p>
          </div>

          <Link className="button button-white" to="/partner-form">
            Partner With Adsrow <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container simple-cta">
          <div>
            <p className="eyebrow">READY TO GET STARTED?</p>
            <h2>Let’s plan your next local campaign.</h2>
            <p>Share your goals and discuss suitable advertising options with the Adsrow team.</p>
          </div>
          <div className="cta-actions">
            <Link className="button" to="/partner-form">Start Your Campaign <ArrowUpRight size={16} /></Link>
            <Link className="text-link" to="/contact">Contact Us <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>

    </>
  );
}

export default HomePage;
