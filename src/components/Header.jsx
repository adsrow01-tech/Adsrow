
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

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="adsrow-header">
      <div className="container adsrow-nav">
        <Link to="/" className="adsrow-logo" onClick={closeMenu}>
          <span className="logo-icon">a</span>
          adsrow
        </Link>

        <nav className={menuOpen ? 'nav-links open' : 'nav-links'}>
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === '/'}
              onClick={closeMenu}
            >
              {link.name}
            </NavLink>
          ))}

          {/* Mobile authentication links */}
          <Link
            to="/login"
            className="nav-link mobile-auth-link"
            onClick={closeMenu}
          >
            Log in
          </Link>

          <Link
            to="/signup"
            className="button mobile-auth"
            onClick={closeMenu}
          >
            Get Started <ArrowUpRight size={16} />
          </Link>

          {/* Mobile Contact Us */}
          <Link
            to="/contact"
            className="button mobile-contact"
            onClick={closeMenu}
          >
            Contact Us <ArrowUpRight size={16} />
          </Link>
        </nav>

        {/* Desktop authentication buttons */}
        <div className="desktop-auth">
          <Link to="/login" className="nav-link">
            Log in
          </Link>

          <Link to="/signup" className="button">
            Get Started <ArrowUpRight size={16} />
          </Link>
        </div>

        {/* Existing desktop Contact Us button */}
        <Link to="/contact" className="button desktop-contact">
          Contact Us <ArrowUpRight size={16} />
        </Link>

        <button
          type="button"
          className="menu-toggle"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  );
}

