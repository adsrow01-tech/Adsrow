import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ArrowRight, CheckCircle2, Monitor, MapPin, Users, Target, Palette, ChartNoAxesCombined } from "lucide-react";
import { SectionHeading, FeatureCard } from "../components/SiteComponents";
import { campaignPackages, venueCategories } from "../lib/siteContent";

const benefits = [
  { icon: Target, title: "Target by place and mindset", description: "Choose venue types, areas or both. Put a diagnostic offer in hospitals and a protein brand in gyms." },
  { icon: Monitor, title: "Book once. Play everywhere.", description: "One team handles 40 venues and every screen schedule. You make one call, not forty." },
  { icon: Palette, title: "Change your ad in minutes", description: "New offer or new price? We update your ad remotely. No reprinting and no remounting." },
  { icon: ChartNoAxesCombined, title: "See proof. Count leads.", description: "Get a play report by screen and date. Add QR codes and a tracked number to count real enquiries." },
];

const categories = [
  ["Real estate", "Homes · Offices", "Fill site visits from families at home and professionals at work."],
  ["Restaurants & food brands", "Homes · Offices · Malls", "Win the ‘what’s for dinner?’ decision before it’s made."],
  ["Clinics, labs & pharmacies", "Hospitals · Gyms · Homes", "Reach health-conscious people at the right moment."],
  ["Schools & coaching", "Homes · Malls", "Talk to parents before admission season begins."],
  ["Auto dealers", "Offices · Malls · Homes", "Book test drives with buyers who have time to think."],
  ["Retail & FMCG", "Supermarkets · Malls · Cafés", "Be the last brand shoppers see before they choose."],
];

const steps = [
  { icon: Users, title: "Tell us your goal", description: "What you sell and who you want to reach." },
  { icon: MapPin, title: "Get your plan", description: "Venues, schedule and price, sent to you." },
  { icon: Palette, title: "Send your ad", description: "Use your own, or our team designs it." },
  { icon: Monitor, title: "Go live. Track it.", description: "Play reports, QR scans and calls." },
];

const homeComparisonRows = [
  ["Reaches people while they wait", "No, they're driving", "Rarely", "Yes, at 40 venues"],
  ["Target a mindset", "No", "No", "Homes, health, shopping, work"],
  ["Choose exact locations", "One site", "Hard to control", "Pick venues and areas"],
  ["Change your ad", "Reprint and remount", "Reprint", "In minutes"],
  ["Proof your ad ran", "A photo, if you ask", "None", "Play report"],
  ["Track enquiries", "No", "No", "QR + call tracking"],
];

function HomePage() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const proofGridRef = useRef(null);
  const problemSectionRef = useRef(null);
  const networkSectionRef = useRef(null);
  const benefitsSectionRef = useRef(null);
  const advertisersSectionRef = useRef(null);
  const processSectionRef = useRef(null);
  const packagesSectionRef = useRef(null);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(preference.matches);
    preference.addEventListener("change", updatePreference);
    return () => preference.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    const grid = proofGridRef.current;
    if (!grid) return undefined;
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      grid.classList.add("is-entered");
      return undefined;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      grid.classList.add("is-entered");
      observer.disconnect();
    }, { threshold: 0.12, rootMargin: "0px 0px -24px 0px" });
    observer.observe(grid);
    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  useEffect(() => {
    const section = benefitsSectionRef.current;
    if (!section || prefersReducedMotion || !("IntersectionObserver" in window)) return undefined;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      section.classList.add("is-entered");
      observer.disconnect();
    }, { threshold: 0.12, rootMargin: "0px 0px -24px 0px" });
    observer.observe(section);
    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  useEffect(() => {
    const section = advertisersSectionRef.current;
    if (!section || prefersReducedMotion || !("IntersectionObserver" in window)) return undefined;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      section.classList.add("is-entered");
      observer.disconnect();
    }, { threshold: 0.12, rootMargin: "0px 0px -24px 0px" });
    observer.observe(section);
    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  useEffect(() => {
    const section = processSectionRef.current;
    if (!section || prefersReducedMotion || !("IntersectionObserver" in window)) return undefined;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      section.classList.add("is-entered");
      observer.disconnect();
    }, { threshold: 0.12, rootMargin: "0px 0px -24px 0px" });
    observer.observe(section);
    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  useEffect(() => {
    const section = packagesSectionRef.current;
    if (!section || prefersReducedMotion || !("IntersectionObserver" in window)) return undefined;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      section.classList.add("is-entered");
      observer.disconnect();
    }, { threshold: 0.12, rootMargin: "0px 0px -24px 0px" });
    observer.observe(section);
    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  useEffect(() => {
    const section = networkSectionRef.current;
    if (!section || prefersReducedMotion || !("IntersectionObserver" in window)) return undefined;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      section.classList.add("is-entered");
      observer.disconnect();
    }, { threshold: 0.12, rootMargin: "0px 0px -24px 0px" });
    observer.observe(section);
    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  useEffect(() => {
    const section = problemSectionRef.current;
    if (!section || prefersReducedMotion || !("IntersectionObserver" in window)) return undefined;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      section.classList.add("is-entered");
      observer.disconnect();
    }, { threshold: 0.18, rootMargin: "0px 0px -24px 0px" });
    observer.observe(section);
    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  return (
    <>
      <section className="home-hero home-hero-cinematic">
        <div className="home-hero-media" aria-hidden="true">
          {!prefersReducedMotion && (
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
              src="/videos/demo-adsrow-pingpong.mp4"
            />
          )}
          <span className="home-hero-scrim" />
        </div>
        <div className="container home-hero-grid">
          <div className="home-hero-copy">
            <p className="eyebrow"><span className="eyebrow-dot" />VIJAYAWADA'S EVERYDAY SCREEN NETWORK</p>
            <h1>Reach people <span>where they pause.</span></h1>
            <p className="hero-description">60 digital screens across 40 venues: lift lobbies, cafés, gyms, hospitals, malls and offices. Choose your audience, book once and get proof every ad played.</p>
            <div className="hero-actions">
              <Link className="button" to="/partner-form">Plan My Campaign <ArrowUpRight size={16} /></Link>
              <Link className="text-link" to="/network">Explore the Network <ArrowRight size={16} /></Link>
            </div>
            <p className="hero-trust"><CheckCircle2 size={17} />One booking · One invoice · One play report</p>
          </div>
        </div>
      </section>

      <section className="intro-strip home-proof-strip">
        <div ref={proofGridRef} className={`container stats-grid home-proof-grid ${prefersReducedMotion ? "is-reduced" : "is-motion"}`}>
          <article className="stat-item home-card-interactive" tabIndex={0}><strong>60</strong><span>digital screens</span></article>
          <article className="stat-item home-card-interactive" tabIndex={0}><strong>40</strong><span>venues across the city</span></article>
          <article className="stat-item home-card-interactive" tabIndex={0}><strong>7</strong><span>venue types, from homes to hospitals</span></article>
          <article className="stat-item home-proof-highlight home-card-interactive" tabIndex={0}><strong>Every</strong><span>play logged by screen and date</span></article>
        </div>
      </section>

      <section ref={problemSectionRef} className="section home-problem-section">
        <div className="container home-problem-content">
          <p className="eyebrow home-problem-eyebrow">THE PROBLEM</p>
          <div className="home-problem-grid">
            <h2>Your customers aren't on the highway. They're in the <span>queue.</span></h2>
            <div className="home-problem-copy-wrap">
              <p className="home-problem-lead">Billboards catch people at 40 km/h. Pamphlets go in the bin. Social feeds bury your offer under everyone else's.</p>
              <p className="body-copy home-problem-copy">Your customers spend their day waiting: for the lift, a coffee, a doctor, the checkout. That's where their attention is, and until now nobody owned those moments.</p>
            </div>
          </div>
        </div>
      </section>

      <section ref={networkSectionRef} className="section section-soft home-network-section">
        <div className="container">
          <div className="home-network-intro">
            <p className="eyebrow">THE ADSROW NETWORK</p>
            <h2>Not where they pass. <span>Where they pause.</span></h2>
            <p className="home-network-description">We put screens where people stand still: at eye level, for minutes not seconds. Then we connect every screen into one network you can book in a single call. Reach families at home in the morning, professionals at work by noon and shoppers at the checkout by evening. One campaign covers all of it.</p>
          </div>
          <SectionHeading
            className="home-section-heading"
            title={<>40 venues. <span>Seven moments</span> that matter.</>}
          />
          <div className="feature-grid feature-grid-four home-venue-grid">
            {venueCategories.map(({ icon: Icon, title, summary }) => <FeatureCard key={title} className="home-card-interactive home-venue-card" tabIndex={0} icon={Icon} title={title} description={summary} />)}
          </div>
          <div className="center-link"><Link className="text-link" to="/network">See the full network: venues, areas and screen photos <ArrowRight size={16} /></Link></div>
        </div>
      </section>

      {/*
      <section className="section home-location-section">
        <div className="container home-location-layout">
          <div className="home-location-copy">
            <p className="eyebrow">CITY COVERAGE</p>
            <h2>Digital screens across <span>Vijayawada.</span></h2>
            <p>Explore the Vijayawada areas that are part of the Adsrow coverage map. Specific venues and live screens in each area need confirmation.</p>
            <p className="home-location-note"><span className="home-location-note-dot" />Screen markers are illustrative area references, not confirmed installed-screen coordinates.</p>
          </div>

          <figure className="home-location-map" aria-labelledby="home-location-map-caption">
            <svg className={`home-location-map-svg ${isMapPanning ? "is-panning" : ""}`} viewBox="0 0 760 520" role="img" aria-label="Illustrative Adsrow digital screen coverage map centered on Vijayawada" onPointerDown={startMapPan} onPointerMove={moveMapPan} onPointerUp={stopMapPan} onPointerCancel={stopMapPan}>
              <defs>
                <pattern id="home-map-grid" width="36" height="36" patternUnits="userSpaceOnUse">
                  <path d="M 36 0 L 0 0 0 36" fill="none" stroke="#b9def0" strokeOpacity=".42" strokeWidth="1" />
                </pattern>
                <filter id="home-map-shadow" x="-30%" y="-30%" width="160%" height="160%">
                  <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#164a9a" floodOpacity=".16" />
                </filter>
              </defs>
              <rect className="home-map-surface" x="0" y="0" width="760" height="520" rx="20" />
              <rect className="home-map-grid" x="0" y="0" width="760" height="520" rx="20" />
              <g className="home-map-viewport" transform={`translate(${380 + mapPan.x} ${260 + mapPan.y}) scale(${mapZoom}) translate(-380 -260)`}>
              <path className="home-map-river" d="M 60 84 C 160 122, 202 183, 294 211 S 446 279, 508 355 S 640 450, 758 432" />
              <path className="home-map-road" d="M 88 390 C 202 326, 280 314, 383 280 S 575 196, 704 118" />
              <path className="home-map-road" d="M 164 72 C 237 152, 310 226, 372 292 S 494 402, 637 478" />
              <path className="home-map-coverage" d="M 182 253 C 208 171, 319 111, 431 132 C 543 152, 640 239, 627 338 C 613 438, 493 472, 371 445 C 253 420, 145 355, 182 253 Z" />
              <text className="home-map-coverage-label" x="395" y="166">ILLUSTRATIVE COVERAGE AREA</text>

              {mapIsClustered && (
                <g
                  className="home-map-screen-cluster"
                  role="button"
                  tabIndex="0"
                  aria-label="Eight illustrative screen area markers around Vijayawada"
                  transform="translate(414 286)"
                  onClick={() => setMapZoom(1.45)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setMapZoom(1.45);
                    }
                  }}
                >
                  <circle className="home-map-cluster-halo" r="31" />
                  <circle className="home-map-cluster-circle" r="21" />
                  <text className="home-map-cluster-count" y="5">8</text>
                  <text className="home-map-cluster-label" y="48">Screen areas</text>
                </g>
              )}

              {!mapIsClustered && vijayawadaScreenAreas.map((area) => {
                const point = projectVijayawadaPoint(area);
                const isActive = activeScreenArea === area.name;
                const tooltipX = clampMapValue(point.x + area.labelDx - 72, 12, 596);
                const tooltipY = clampMapValue(point.y + area.labelDy - 50, 12, 450);
                return (
                  <g
                    className={`home-map-screen-area ${isActive ? "is-active" : ""}`}
                    key={area.name}
                    role="button"
                    tabIndex="0"
                    aria-label={`${area.name}, illustrative screen area marker`}
                    transform={`translate(${point.x} ${point.y})`}
                    onMouseEnter={() => setActiveScreenArea(area.name)}
                    onMouseLeave={() => setActiveScreenArea(null)}
                    onFocus={() => setActiveScreenArea(area.name)}
                    onBlur={() => setActiveScreenArea(null)}
                    onClick={() => setActiveScreenArea((current) => current === area.name ? null : area.name)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setActiveScreenArea((current) => current === area.name ? null : area.name);
                      }
                    }}
                  >
                    <circle className="home-map-screen-glow" r="17" />
                    <rect className="home-map-screen-marker" x="-10" y="-8" width="20" height="14" rx="2" />
                    <path className="home-map-screen-stand" d="M -4 9 H 4 M 0 6 V 9" />
                    <text className="home-map-area-label" x={area.labelDx} y={area.labelDy} textAnchor={area.anchor}>{area.name}</text>
                    {isActive && (
                      <g className="home-map-tooltip" transform={`translate(${tooltipX - point.x} ${tooltipY - point.y})`} pointerEvents="none">
                        <rect width="144" height="42" rx="8" />
                        <text x="12" y="17">{area.name}</text>
                        <text className="home-map-tooltip-subtitle" x="12" y="32">Illustrative area marker</text>
                      </g>
                    )}
                  </g>
                );
              })}

              {(() => {
                const point = projectVijayawadaPoint({ lat: 16.5062, lon: 80.6480 });
                return (
                  <g className="home-map-city-marker" transform={`translate(${point.x} ${point.y})`}>
                    <circle className="home-map-city-pulse" r="24" />
                    <circle className="home-map-city-dot" r="8" />
                    <path className="home-map-city-stem" d="M 0 8 V 19" />
                    <g className="home-map-city-label" transform="translate(14 -49)">
                      <rect width="132" height="32" rx="8" />
                      <text x="13" y="21">Vijayawada</text>
                    </g>
                  </g>
                );
              })()}
              </g>
            </svg>
            <div className="home-map-controls" aria-label="Map controls">
              <button type="button" aria-label="Zoom in" onClick={() => setMapZoom((current) => Math.min(1.65, current + .15))}>+</button>
              <button type="button" aria-label="Zoom out" onClick={() => setMapZoom((current) => Math.max(1, current - .15))}>−</button>
              <button type="button" aria-label="Reset map zoom" onClick={() => { setMapZoom(1.15); setMapPan({ x: 0, y: 0 }); }}>Reset</button>
            </div>
            <figcaption id="home-location-map-caption" className="home-location-map-caption">
              <span className="home-map-legend-item"><span className="home-map-legend-screen" />Illustrative screen area</span>
              <span className="home-map-legend-item"><span className="home-map-legend-cluster" />Vijayawada coverage area</span>
            </figcaption>
          </figure>
        </div>
      </section>
      */}

      <section ref={benefitsSectionRef} className="section section-soft home-benefits-section">
        <div className="container">
          <div className="home-benefits-heading"><SectionHeading centered className="home-section-heading" title={<>One network. <span>Every way</span> to target.</>} /></div>
          <div className="feature-grid home-benefits-grid">
            {benefits.map(({ icon: Icon, ...benefit }, index) => <FeatureCard key={benefit.title} className={`home-card-interactive home-benefit-card home-benefit-card-${index + 1}`} tabIndex={0} number={`0${index + 1}`} icon={Icon} {...benefit} />)}
          </div>
        </div>
      </section>

      <section ref={advertisersSectionRef} className="section section-soft home-advertisers-section">
        <div className="container">
          <SectionHeading eyebrow="WHO ADVERTISES WITH US" className="home-section-heading" title={<>Match your message to the <span>moment.</span></>} />
          <div className="feature-grid feature-grid-three home-advertisers-grid">
            {categories.map(([title, label, description]) => <article className="feature-card home-card-interactive home-category-card" tabIndex={0} key={title}><h3>{title}</h3><p>{description}</p><p className="home-venue-labels">{label}</p></article>)}
          </div>
        </div>
      </section>

      <section ref={processSectionRef} className="section section-soft home-process-section">
        <div className="container">
          <SectionHeading centered eyebrow="HOW IT WORKS" className="home-section-heading" title={<>Go live in <span>4 steps.</span></>} />
          <div className="feature-grid feature-grid-four home-process-cards">
            {steps.map(({ icon: Icon, ...step }, index) => <FeatureCard key={step.title} className="home-card-interactive home-process-card" tabIndex={0} number={`0${index + 1}`} icon={Icon} {...step} />)}
          </div>
          <div className="center-link"><Link className="button button-outline" to="/how-it-works">See the Full Process <ArrowRight size={16} /></Link></div>
        </div>
      </section>

      <section className="section section-navy">
        <div className="container comparison-block home-comparison-block">
          <h2 className="home-heading home-comparison-heading">Same budget. <span>Smarter placement.</span></h2>
          <div className="comparison-wrap" role="region" aria-label="Advertising format comparison" tabIndex="0">
            <table className="comparison-table">
              <thead><tr><th scope="col">What you get</th><th scope="col">Billboard</th><th scope="col">Pamphlets</th><th scope="col">Adsrow</th></tr></thead>
              <tbody>{homeComparisonRows.map(([benefit, billboard, pamphlets, adsrow]) => <tr key={benefit}><th scope="row">{benefit}</th><td>{billboard}</td><td>{pamphlets}</td><td>{adsrow}</td></tr>)}</tbody>
            </table>
          </div>
        </div>
      </section>

      <section ref={packagesSectionRef} className="section section-soft home-packages-section">
        <div className="container">
          <SectionHeading centered eyebrow="CAMPAIGN PACKAGES" className="home-section-heading" title={<>Start small. <span>Scale what works.</span></>} />
          <div className="feature-grid feature-grid-four home-package-grid">
            {campaignPackages.map(({ name, screens, duration, price, customQuote }) => <article className="feature-card home-card-interactive home-package-card" tabIndex={0} key={name}><h3>{name}</h3><p>{screens === "All 60" ? "All 60 screens" : `${screens} screens`} · {duration}</p><strong className="home-price-placeholder">{customQuote ? "Custom quote" : price ? `From ₹${price}` : "Price on request"}</strong></article>)}
          </div>
          <div className="center-link"><Link className="button button-outline" to="/services">Compare Packages <ArrowRight size={16} /></Link></div>
        </div>
      </section>

      <section className="host-banner">
        <div className="container host-banner-inner">
          <div>
            <p className="eyebrow eyebrow-light">FOR VENUE OWNERS AND MANAGERS</p>
            <h2 className="home-heading home-heading-on-dark">Own a café, gym, clinic or building? <span>Host a screen.</span></h2>
            <p>We install and maintain the screen. You get space for your own offers and notices.</p>
          </div>
          <Link className="button button-white" to="/host-a-screen">Host a Screen <ArrowUpRight size={16} /></Link>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container simple-cta">
          <div>
            <p className="eyebrow">READY TO GET STARTED?</p>
            <h2 className="home-heading">Tell us who you want to reach. We'll show you <span>where they pause.</span></h2>
            <p>Get a free plan with venues, a schedule and a clear price. No obligation.</p>
          </div>
          <div className="cta-actions">
            <Link className="button" to="/partner-form">Get My Free Plan <ArrowUpRight size={16} /></Link>
            <a className="text-link" href="https://wa.me/918374622055" target="_blank" rel="noreferrer">WhatsApp Us <ArrowRight size={16} /></a>
          </div>
        </div>
      </section>
    </>
  );
}

export default HomePage;
