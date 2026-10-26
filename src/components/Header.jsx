import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, ArrowUpRight, CircleUserRound } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import BrandWordmark from "./BrandWordmark";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    try {
      await signOut();
    } catch {
      // Local state is cleared immediately even if Supabase sign-out fails.
    }
    setMenuOpen(false);
    navigate("/", { replace: true });
  }

  const links = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Locations", path: "/locations" },
    { name: "How It Works", path: "/how-it-works" },
    { name: "Host a Screen", path: "/host-a-screen" },
    { name: "Contact Us", path: "/contact" },
  ];

  useEffect(() => {
    if (!menuOpen) return undefined;

    function closeOnEscape(event) {
      if (event.key === "Escape") setMenuOpen(false);
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link
          to="/"
          className="brand header-brand"
          aria-label="Adsrow home"
          onClick={() => setMenuOpen(false)}
        >
          <BrandWordmark />
        </Link>

        <nav id="primary-navigation" className={`nav-links ${menuOpen ? "is-open" : ""}`}>
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === "/"}
              onClick={() => {
                setMenuOpen(false);
                window.scrollTo({ top: 0, left: 0, behavior: "instant" });
              }}
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              {link.name}
            </NavLink>
          ))}

          <Link
            to="/partner-form"
            className="button mobile-contact"
            onClick={() => setMenuOpen(false)}
          >
            Partner with Adsrow <ArrowUpRight size={16} />
          </Link>
          {user ? <><Link to="/dashboard" className="auth-nav-link mobile-auth-link" onClick={() => setMenuOpen(false)}>Dashboard</Link><button className="mobile-auth-link" onClick={handleSignOut}>Sign out</button></> : <>
            <Link to="/login" className="auth-nav-link mobile-auth-link" onClick={() => setMenuOpen(false)}>Log in</Link>
            <Link to="/signup" className="button mobile-signup" onClick={() => setMenuOpen(false)}>Create account</Link>
          </>}
        </nav>

        {user ? <div className="header-account"><Link to="/dashboard" className="header-user" title="Open your dashboard" aria-label={`Open dashboard for ${user.email || "your account"}`}><CircleUserRound size={23} /><span className="header-user-label">{user.user_metadata?.full_name || user.email}</span></Link><button className="header-signout" onClick={handleSignOut}>Sign out</button></div> : <div className="header-auth-links">
          <Link to="/login" className="header-login">Log in</Link>
          <Link to="/signup" className="button header-signup">Sign up</Link>
        </div>}
        <Link to="/partner-form" className="button desktop-contact">
          Partner with Adsrow <ArrowUpRight size={16} />
        </Link>

        <button
          type="button"
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
        >
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>
    </header>
  );
}

export default Header;
