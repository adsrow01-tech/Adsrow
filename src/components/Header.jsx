import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, ArrowUpRight, CircleUserRound } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import BrandWordmark from "./BrandWordmark";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isCompact, setIsCompact] = useState(() => window.scrollY > 28);
  const brandRef = useRef(null);
  const partnerCtaRef = useRef(null);
  const lastCompactRef = useRef(isCompact);
  const transitionStartRectsRef = useRef(null);
  const transitionFrameRef = useRef(0);
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

  useEffect(() => {
    let frame = 0;
    const updateCompactState = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const nextCompact = window.scrollY > 28;
        if (nextCompact === lastCompactRef.current) return;
        transitionStartRectsRef.current = {
          brand: brandRef.current?.getBoundingClientRect(),
          cta: partnerCtaRef.current?.getBoundingClientRect(),
        };
        lastCompactRef.current = nextCompact;
        setIsCompact(nextCompact);
      });
    };
    window.addEventListener("scroll", updateCompactState, { passive: true });
    updateCompactState();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateCompactState);
    };
  }, []);

  useLayoutEffect(() => {
    const startRects = transitionStartRectsRef.current;
    transitionStartRectsRef.current = null;
    if (!startRects || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const elements = [
      [brandRef.current, startRects.brand],
      [partnerCtaRef.current, startRects.cta],
    ].filter(([element, start]) => element && start?.width > 0);
    const moved = [];
    const finishTransition = (event) => {
      if (event.propertyName !== "transform") return;
      event.currentTarget.removeEventListener("transitionend", finishTransition);
      event.currentTarget.style.removeProperty("transition");
      event.currentTarget.style.removeProperty("transform");
    };

    elements.forEach(([element, start]) => {
      const destination = element.getBoundingClientRect();
      if (!destination.width) return;
      const x = start.left - destination.left;
      const y = start.top - destination.top;
      if (Math.abs(x) < 1 && Math.abs(y) < 1) return;
      element.style.transition = "none";
      element.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      element.getBoundingClientRect();
      element.addEventListener("transitionend", finishTransition);
      moved.push(element);
    });

    if (!moved.length) return undefined;
    transitionFrameRef.current = requestAnimationFrame(() => {
      moved.forEach((element) => {
        element.style.transition = "transform 240ms cubic-bezier(.2,.7,.2,1)";
        element.style.transform = "translate3d(0, 0, 0)";
      });
    });

    return () => {
      cancelAnimationFrame(transitionFrameRef.current);
      moved.forEach((element) => {
        element.removeEventListener("transitionend", finishTransition);
        element.style.removeProperty("transition");
        element.style.removeProperty("transform");
      });
    };
  }, [isCompact]);

  useEffect(() => {
    if (isCompact && menuOpen) setMenuOpen(false);
  }, [isCompact, menuOpen]);

  return (
    <header className={`site-header${isCompact ? " is-compact" : ""}`}>
      <div className="container header-inner">
        <div className="header-brand-cta">
          <Link
            to="/"
            className="brand header-brand"
            ref={brandRef}
            aria-label="Adsrow home"
            onClick={() => setMenuOpen(false)}
          >
            <BrandWordmark />
          </Link>
          <Link to="/partner-form" className="button desktop-contact" ref={partnerCtaRef}>
            Partner with Adsrow <ArrowUpRight size={16} />
          </Link>
        </div>

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
