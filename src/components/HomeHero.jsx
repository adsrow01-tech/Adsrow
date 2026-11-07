import { useEffect, useState } from "react";
import { ArrowRight, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import "../styles/home-hero.css";

const creatives = [
  { moment: "resting between sets.", phraseColor: "#0b8f78", label: "YOUR GYM", title: "Your ad, on screens across the city.", action: "Start a campaign →", className: "brand" },
  { moment: "waiting for their order.", phraseColor: "#c2410c", label: "YOUR RESTAURANT", title: "Make time for something delicious.", action: "View the menu →", className: "cafe" },
  { moment: "waiting for the lift.", phraseColor: "#0b3d91", label: "YOUR PROJECT", title: "A new address. A fresh start.", action: "Discover more →", className: "project" },
];
const venues = [
  { image: "/venues/residential-lobby.jpg", label: "Lift lobbies", className: "lobby" },
  { image: "/venues/cafe-display.jpg", label: "Cafés", className: "cafe" },
  { image: "/venues/gym-display.jpg", label: "Gyms", className: "gym" },
];

export default function HomeHero() {
  const [active, setActive] = useState(0);
  const activeCreative = creatives[active];
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(preference.matches);
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (reducedMotion) return undefined;
    const hero = document.querySelector(".home-dynamic-hero");
    if (!hero) return undefined;
    let timer;
    let visible = true;
    const start = () => {
      window.clearInterval(timer);
      if (visible && !document.hidden) timer = window.setInterval(() => setActive((index) => (index + 1) % creatives.length), 5000);
    };
    const observer = "IntersectionObserver" in window
      ? new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; start(); }, { threshold: 0.2 })
      : null;
    observer?.observe(hero);
    const onVisibility = () => start();
    document.addEventListener("visibilitychange", onVisibility);
    start();
    return () => {
      window.clearInterval(timer);
      observer?.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reducedMotion]);

  return (
    <section className={`home-dynamic-hero${reducedMotion ? " motion-reduced" : ""}`} aria-labelledby="home-hero-title">
      <div className="home-dynamic-wrap">
        <div className="home-dynamic-copy">
          <p className="home-dynamic-eyebrow"><span aria-hidden="true" />Vijayawada's everyday screen network</p>
          <h1 id="home-hero-title" aria-label={`Reach 20,000+ people a day while they're ${activeCreative.moment}`}>
            Reach <span className="home-dynamic-highlight">20,000+ people</span> a day while they're
            <span className="home-dynamic-rotator" aria-hidden="true" style={{ "--active-phrase-color": activeCreative.phraseColor }}>{creatives.map((creative, index) => <span className={index === active ? "is-active" : ""} key={creative.className}>{creative.moment}</span>)}</span>
          </h1>
          <p className="home-dynamic-description">Put your ad on digital screens in apartment lift lobbies, restaurants, cafés and gyms. Pick your audience, book once and get proof every ad played, from ₹99 a day.</p>
          <div className="home-dynamic-actions">
            <Link className="home-dynamic-primary" to="/partner-form">Start My Campaign <ArrowUpRight size={16} /></Link>
            <Link className="home-dynamic-secondary" to="/network">Explore the Network <ArrowRight size={16} /></Link>
          </div>
          <p className="home-dynamic-trust"><CheckCircle2 size={18} />One booking · One invoice · One play report</p>
        </div>

        <div className="home-dynamic-stage" aria-hidden="true">
          {venues.map((venue) => <div className={`home-dynamic-photo ${venue.className}`} key={venue.label}><img src={venue.image} alt="" /><span>{venue.label}</span></div>)}
          <div className="home-dynamic-device"><div className="home-dynamic-screen">
            <span className="home-dynamic-live"><i />LIVE</span>
            <div className="home-dynamic-ads">{creatives.map((creative, index) => <div className={`home-dynamic-ad ${creative.className}${index === active ? " is-active" : ""}`} key={creative.className}><small>{creative.label}</small><strong>{creative.title}</strong><em>{creative.action}</em></div>)}</div>
          </div></div>
          <div className="home-dynamic-price"><small>From</small>₹99/day</div>
        </div>
      </div>
    </section>
  );
}
