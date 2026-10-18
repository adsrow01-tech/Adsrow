
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, ArrowUpRight } from 'lucide-react';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About Us', path: '/about' },
  { name: 'Services', path: '/services' },
  { name: 'Locations', path: '/locations' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="adsrow-header">
      <div className="container adsrow-nav">
        <Link to="/" className="adsrow-logo">
          <span className="logo-icon">a</span>
          adsrow
        </Link>

        <nav className={menuOpen ? 'nav-links open' : 'nav-links'}>
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === '/'}
              onClick={() => setMenuOpen(false)}
            >
              {link.name}
            </NavLink>
          ))}

          <Link
            to="/contact"
            className="button mobile-contact"
            onClick={() => setMenuOpen(false)}
          >
            Contact Us <ArrowUpRight size={16} />
          </Link>
        </nav>

        <Link to="/contact" className="button desktop-contact">
          Contact Us <ArrowUpRight size={16} />
        </Link>

        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  );
}
