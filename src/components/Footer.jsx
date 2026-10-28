import { Link } from "react-router-dom";
import { ArrowUpRight, MapPin } from "lucide-react";
import BrandWordmark from "./BrandWordmark";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand-column">
          <Link to="/" className="brand footer-brand" aria-label="Adsrow home">
            <BrandWordmark />
          </Link>

          <p>
            Helping businesses reach local audiences through digital
            advertising screens.
          </p>

          <p className="footer-location">
            <MapPin size={15} />
            Vijayawada, Andhra Pradesh
          </p>
        </div>

        <div className="footer-column">
          <h3>Explore</h3>
          <Link to="/about">About Us</Link>
          <Link to="/services">Services</Link>
          <Link to="/network">Our Network</Link>
          <Link to="/faqs">FAQs</Link>
        </div>

        <div className="footer-column">
          <h3>For Business</h3>
          <Link to="/services">Advertise With Us</Link>
          <Link to="/partner-form">Partner with Adsrow</Link>
          <Link to="/host-a-screen">Host a Screen</Link>
          <Link to="/why-adsrow">Why Adsrow</Link>
          <Link to="/how-it-works">How It Works</Link>
        </div>

        <div className="footer-column">
          <h3>Have a campaign in mind?</h3>
          <p>Tell us what you want to promote and discuss your options.</p>
          <Link to="/partner-form" className="footer-link">
            Partner with Adsrow <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>

      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} Adsrow. All rights reserved.</span>
        <span>Local advertising, made straightforward.</span>
      </div>
    </footer>
  );
}

export default Footer;
