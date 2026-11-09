import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ArrowRight, Monitor, MapPin, Users, Target, Palette, ChartNoAxesCombined, Building2, UtensilsCrossed, GraduationCap, Car, ShoppingBag, Eye, X, Check } from "lucide-react";
import { FeatureCard, ComparisonTable, SectionHeading } from "../components/SiteComponents";
import Adsrow99Banner from "../components/Adsrow99Banner";
import CardDeckCarousel from "../components/CardDeckCarousel";
import HomeHero from "../components/HomeHero";
import CampaignPackagesComparison from "../components/CampaignPackagesComparison";

const benefits = [
  { icon: Target, title: "Target by place and mindset", description: "Pick the type of place, the area, or both. Show a new housing project in apartment communities, a protein brand in gyms and a dinner offer in restaurants." },
  { icon: Monitor, title: "Book once. Play everywhere.", description: "One team handles 40 venues and every screen schedule. You make one call, not forty." },
  { icon: Palette, title: "Update your Ad in minutes", description: "New offer or new price? We update your ad remotely. No reprinting and no remounting." },
  { icon: ChartNoAxesCombined, title: "Proof you can count", description: "Get a play report by screen and date. Add QR codes and a tracked number to count real enquiries." },
  { icon: MapPin, title: "From one lift lobby to the whole city", description: "Start with a single lobby. Plan exactly the areas where your audience lives, works and shops." },
  { icon: Eye, title: "Full attention, no skip button", description: "Eye-level screens where people stand still: no feeds to scroll past and no button to skip, so your story plays in full." },
];

const categories = [
  { icon: Building2, title: "Real estate", label: "Homes · Offices", description: "Fill site visits from families at home and professionals at work." },
  { icon: UtensilsCrossed, title: "Restaurants & food brands", label: "Homes · Offices · Malls", description: "Win the ‘what’s for dinner?’ decision before it’s made." },
  { icon: Target, title: "Nutrition & sportswear", label: "Gyms · Homes", description: "Reach health-focused people at the right moment." },
  { icon: GraduationCap, title: "Schools & coaching", label: "Homes · Malls", description: "Talk to parents before admission season begins." },
  { icon: Car, title: "Auto dealers", label: "Offices · Malls · Homes", description: "Book test drives with buyers who have time to think." },
  { icon: ShoppingBag, title: "Retail & FMCG", label: "Supermarkets · Malls · Cafés", description: "Be the last brand shoppers see before they choose." },
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

const statisticsTargets = [20000, 75000, 850000];

function formatStatistic(value, index) {
  if (index === 2 && value >= statisticsTargets[index]) return "8.5 lakh+";
  return `${Math.floor(value).toLocaleString("en-IN")}+`;
}

function HomePage() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const proofGridRef = useRef(null);
  const statisticsStartedRef = useRef(prefersReducedMotion);
  const [statisticValues, setStatisticValues] = useState(() =>
    prefersReducedMotion ? statisticsTargets : [0, 0, 0]
  );
  const problemSectionRef = useRef(null);
  const networkSectionRef = useRef(null);
  const benefitsSectionRef = useRef(null);
  const advertisersSectionRef = useRef(null);
  const processSectionRef = useRef(null);
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
      statisticsStartedRef.current = true;
      setStatisticValues(statisticsTargets);
      grid.classList.add("is-entered");
      return undefined;
    }
    if (statisticsStartedRef.current) {
      grid.classList.add("is-entered");
      return undefined;
    }

    let animationFrame = null;
    const startCountUp = () => {
      if (statisticsStartedRef.current) return;
      statisticsStartedRef.current = true;
      const duration = 2000;
      let startTime = null;

      const animate = (timestamp) => {
        if (startTime === null) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const easedProgress = progress < 0.5
          ? 4 * progress ** 3
          : 1 - ((-2 * progress + 2) ** 3) / 2;

        setStatisticValues(statisticsTargets.map((target) =>
          progress === 1 ? target : Math.floor(target * easedProgress)
        ));

        if (progress < 1) animationFrame = requestAnimationFrame(animate);
      };

      animationFrame = requestAnimationFrame(animate);
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      grid.classList.add("is-entered");
      startCountUp();
      observer.disconnect();
    }, { threshold: 0.12, rootMargin: "0px 0px -24px 0px" });
    observer.observe(grid);
    return () => {
      observer.disconnect();
      if (animationFrame !== null) cancelAnimationFrame(animationFrame);
    };
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
      <HomeHero />

      <section className="home-quick-steps" aria-label="How Adsrow works in 10 seconds">
        <div className="container">
          <div className="home-quick-cards">
            <article className="home-quick-card home-quick-card-1">
              <span className="home-quick-card-num" aria-hidden="true"></span>
              <p className="home-quick-card-eyebrow">ADSROW IN 10 SECONDS</p>
              <h2 className="home-quick-card-title">Simple as<br />1·2·3</h2>
            </article>
            <article className="home-quick-card home-quick-card-2">
              <span className="home-quick-card-num" aria-hidden="true">01</span>
              <h3 className="home-quick-card-heading">You choose</h3>
              <p className="home-quick-card-copy">Pick the venues, areas and dates.</p>
            </article>
            <article className="home-quick-card home-quick-card-3">
              <span className="home-quick-card-num" aria-hidden="true">02</span>
              <h3 className="home-quick-card-heading">We play</h3>
              <p className="home-quick-card-copy">Your ad runs on every screen you booked, every 2 minutes.</p>
            </article>
            <article className="home-quick-card home-quick-card-4">
              <span className="home-quick-card-num" aria-hidden="true">03</span>
              <h3 className="home-quick-card-heading">You see results</h3>
              <p className="home-quick-card-copy">Get a play report, QR scans and calls.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="intro-strip home-proof-strip home-stats-strip">
        <div ref={proofGridRef} className={`container stats-grid home-proof-grid ${prefersReducedMotion ? "is-reduced" : "is-motion"}`}>
          <article className="stat-item home-card-interactive" tabIndex={0}><strong>{formatStatistic(statisticValues[0], 0)}</strong><span>daily audience</span></article>
          <article className="stat-item home-card-interactive" tabIndex={0}><strong>{formatStatistic(statisticValues[1], 1)}</strong><span>monthly reach</span></article>
          <article className="stat-item home-card-interactive" tabIndex={0}><strong>{formatStatistic(statisticValues[2], 2)}</strong><span>monthly ad views</span></article>
        </div>
      </section>

      <section className="intro-strip home-proof-strip">
        <Adsrow99Banner />
      </section>

      <section ref={problemSectionRef} className="section home-problem-section">
        <div className="container home-problem-content">
          <div className="home-problem-grid">
            <div className="home-problem-copy-wrap">
              <p className="eyebrow home-problem-eyebrow">THE PROBLEM</p>
              <h2>Your customers aren't looking at billboards. <span>They're waiting in line.</span></h2>
              <p className="home-problem-lead">Billboards are passed at speed. Pamphlets get thrown away. Social ads get scrolled past. Meanwhile, people spend hours a day waiting, and no one is speaking to them there.</p>
            </div>
            <div className="home-problem-cards">
              <div className="home-problem-card home-problem-card-no">
                <span className="home-problem-card-icon"><X size={20} aria-hidden="true" /></span>
                <div className="home-problem-card-text">
                  <h3>Billboards</h3>
                  <p>Seen for 2 seconds at 40 km/h</p>
                </div>
              </div>
              <div className="home-problem-card home-problem-card-no">
                <span className="home-problem-card-icon"><X size={20} aria-hidden="true" /></span>
                <div className="home-problem-card-text">
                  <h3>Pamphlets</h3>
                  <p>Straight into the bin</p>
                </div>
              </div>
              <div className="home-problem-card home-problem-card-no">
                <span className="home-problem-card-icon"><X size={20} aria-hidden="true" /></span>
                <div className="home-problem-card-text">
                  <h3>Social ads</h3>
                  <p>Scrolled past in a crowded feed</p>
                </div>
              </div>
              <div className="home-problem-card home-problem-card-yes">
                <span className="home-problem-card-icon"><Check size={20} aria-hidden="true" /></span>
                <div className="home-problem-card-text">
                  <h3>Adsrow screens</h3>
                  <p>Seen at eye level while people wait</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section ref={networkSectionRef} className="section section-soft home-network-section">
        <div className="container">
          <div className="home-network-intro">
            <p className="eyebrow">THE ADSROW NETWORK</p>
            <h2>Not where they pass. <span>Where they pause.</span></h2>
            <p className="home-network-description">We install screens where people stand still, then connect them into one network you can book with a single call. Morning at home, noon at work, evening at the checkout: one campaign covers it all.</p>
          </div>
          <div className="home-network-cards">
            <div className="home-network-card">
              <div className="home-network-card-label">MORNING</div>
              <div className="home-network-card-desc">Families in lift lobbies</div>
            </div>
            <div className="home-network-card">
              <div className="home-network-card-label">NOON</div>
              <div className="home-network-card-desc">Professionals in offices & cafés</div>
            </div>
            <div className="home-network-card">
              <div className="home-network-card-label">EVENING</div>
              <div className="home-network-card-desc">Shoppers & gym-goers </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section home-venues-section" aria-label="Venue selection">
        <div className="container">
          <div className="home-network-venues">
            <h2>Home. Work. Coffee. Workout. <span>Your ad is part of their routine.</span></h2>
            <p className="home-venues-sub">Choose one type of place or mix them all. Each one reaches a different audience in a different frame of mind.</p>
          </div>
        </div>
        <CardDeckCarousel />

        <div className="container"><div className="center-link"><Link className="text-link" to="/network">See the full network: venues, areas and screen photos <ArrowRight size={16} /></Link></div></div>
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
          <div className="home-benefits-heading"><SectionHeading centered className="home-section-heading" description="Everything you need to reach the right people, and prove it." title={<>One network. <span>Six</span> reasons it works harder.</>} /></div>
          <div className="feature-grid home-benefits-grid">
            {benefits.map(({ icon: Icon, ...benefit }, index) => (
              <article
                key={benefit.title}
                tabIndex={0}
                className={`home-card-interactive home-benefit-card home-benefit-card-${index + 1}`}
              >
                {index === 0 && (
                  <span className="benefit-badge">
                    <span className="benefit-badge-dot" aria-hidden="true" />
                    TARGETED BY DESIGN
                  </span>
                )}
                <span className="benefit-number" aria-hidden="true">{`0${index + 1}`}</span>
                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
                {index === 0 && (
                  <span className="benefit-meta">
                    <span className="benefit-meta-dots" aria-hidden="true"><i /><i /><i /></span>
                    40 venues · 7 moments that matter
                  </span>
                )}
                <Icon className="home-card-decor" aria-hidden="true" />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section ref={advertisersSectionRef} className="section section-soft home-advertisers-section">
        <div className="container">
          <SectionHeading eyebrow="WHO ADVERTISES WITH US" className="home-section-heading" description="Match your message to the place your buyers are in." title={<>Built for businesses that need <span>local customers.</span></>} />
          <div className="feature-grid feature-grid-three home-advertisers-grid">
            {categories.map(({ icon: Icon, ...category }, index) => (
              <article
                className={`feature-card home-card-interactive home-category-card home-category-card-${index + 1}`}
                tabIndex={0}
                key={category.title}
              >
                <div className="home-category-top">
                  <span className="feature-number">{`0${index + 1}`}</span>
                  <span className="feature-icon"><Icon size={20} strokeWidth={1.7} /></span>
                </div>
                <h3>{category.title}</h3>
                <p>{category.description}</p>
                <p className="home-venue-labels">{category.label}</p>
                <Icon className="home-card-decor" aria-hidden="true" />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section ref={processSectionRef} className="section section-soft home-process-section">
        <div className="container">
          <SectionHeading centered eyebrow="HOW IT WORKS" className="home-section-heading" title={<>Go live in <span>4 steps.</span></>} />
          <div className="feature-grid feature-grid-four home-process-cards">
            {steps.map(({ icon: Icon, ...step }, index) => <FeatureCard key={step.title} className={`home-card-interactive home-process-card home-process-card-${index + 1}`} tabIndex={0} number={`0${index + 1}`} icon={Icon} {...step} />)}
          </div>
          <div className="center-link"><Link className="button button-outline" to="/how-it-works">See the Full Process <ArrowRight size={16} /></Link></div>
        </div>
      </section>

      <section className="section section-navy home-comparison-section">
        <div className="container comparison-block home-comparison-block">
          <h2 className="home-heading home-comparison-heading">Same budget. <span>Smarter placement.</span></h2>
          <ComparisonTable rows={homeComparisonRows} highlightAdsrow />
        </div>
      </section>

      <CampaignPackagesComparison />

      <section className="host-banner">
        <div className="container host-banner-inner">
          <div>
            <p className="eyebrow eyebrow-light">FOR VENUE OWNERS</p>
            <h2 className="home-heading home-heading-on-dark">Turn your space into a screen that works for you.</h2>
            <p>We install and maintain the screen, and you get space for your own offers and notices.</p>
            <ul className="host-venue-chips" aria-label="Venue types that host Adsrow screens">
              <li>Cafés</li>
              <li>Gyms</li>
              <li>Malls</li>
              <li>Offices</li>
              <li>Apartments</li>
            </ul>
          </div>
          <Link className="button button-mint" to="/host-a-screen">Host a Screen <ArrowUpRight size={16} /></Link>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container simple-cta ads-card ads-card-interactive ads-accent-1">
          <div>
            <p className="eyebrow">READY TO GET STARTED?</p>
            <h2 className="home-heading">Tell us who you want to reach. We'll put you <span>in front of them.</span></h2>
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
