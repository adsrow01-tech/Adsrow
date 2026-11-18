import { useEffect, useState } from "react";
import { ArrowRight, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import FourScreenShowcase from "./FourScreenShowcase";
import "../styles/home-hero.css";
import LiveAdScreens from "./LiveAdScreen";

export default function HomeHero() {
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(preference.matches);
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  return (
    <section className={`home-dynamic-hero${reducedMotion ? " motion-reduced" : ""}`} aria-labelledby="home-hero-title">
      <div className="home-dynamic-wrap">
        <div className="home-dynamic-copy">
          <p className="home-dynamic-eyebrow"><span aria-hidden="true" />Vijayawada's everyday screen network</p>
          <h1 id="home-hero-title">
            Reach <span className="home-dynamic-highlight">20,000+</span> people a day while they wait.
          </h1>
          <p className="home-dynamic-description">Your ad plays on screens in lift lobbies, gyms, supermarkets and cafés, at eye level, where people stand and wait. Pick the areas, book on WhatsApp, and go live in days.</p>
          <div className="home-dynamic-actions">
            <Link className="home-dynamic-primary" to="/contact">Start My Campaign <ArrowUpRight size={16} /></Link>
            <Link className="home-dynamic-secondary" to="/network">Explore the Network <ArrowRight size={16} /></Link>
          </div>
          <p className="home-dynamic-trust"><CheckCircle2 size={18} />One booking · One invoice · One play report</p>
        </div>
        <LiveAdScreens reducedMotion={reducedMotion} />

        <div className="home-dynamic-stage" aria-hidden="true"><FourScreenShowcase /></div>
      </div>
    </section>
  );
}
