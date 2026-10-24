import { useEffect, useState } from "react";
import {
  Routes,
  Route,
  Link,
  NavLink,
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";
import {
  Menu,
  X,
  ArrowUpRight,
  ArrowRight,
  Monitor,
  MapPin,
  Palette,
  ChartNoAxesCombined,
  CalendarDays,
  Building2,
  CheckCircle2,
  Target,
  Users,
  MessageCircle,
  ClipboardCheck,
  ChevronDown,
  Mail,
  CircleUserRound,
} from "lucide-react";
import { submitEnquiry } from "./lib/enquire";
import { LoginPage, SignupPage } from "./pages/AuthPages";
import { ForgotPasswordPage, ResetPasswordPage } from "./pages/AuthRecoveryPages";
import { PrivacyPage, TermsPage } from "./pages/LegalPages";
import DashboardPage from "./pages/DashboardPage";
import { useAuth } from "./context/AuthContext";
import { supabase } from "./lib/supabase";
import { recordSubmittedEnquiry } from "./lib/dashboard";

/* -------------------- NAVBAR -------------------- */

function BrandWordmark() {
  return (
    <span className="header-wordmark" aria-hidden="true">
      <span className="wordmark-ads">ads</span><span className="wordmark-row">row</span><span className="wordmark-dot">.</span><sup>®</sup>
    </span>
  );
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useAuth();

  function handleSignOut() {
    if (!supabase) return;
    void supabase.auth.signOut().catch(() => {
      // Auth state remains unchanged when sign-out cannot reach Supabase.
    });
    setMenuOpen(false);
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
            to="/advertise"
            className="button mobile-contact"
            onClick={() => setMenuOpen(false)}
          >
            Advertise With Us <ArrowUpRight size={16} />
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
        <Link to="/advertise" className="button desktop-contact">
          Advertise With Us <ArrowUpRight size={16} />
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

/* -------------------- FOOTER -------------------- */

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
          <Link to="/locations">Locations</Link>
          <Link to="/faqs">FAQs</Link>
        </div>

        <div className="footer-column">
          <h3>For Business</h3>
          <Link to="/advertise">Advertise With Us</Link>
          <Link to="/host-a-screen">Host a Screen</Link>
          <Link to="/why-adsrow">Why Adsrow</Link>
          <Link to="/how-it-works">How It Works</Link>
        </div>

        <div className="footer-column">
          <h3>Have a campaign in mind?</h3>
          <p>Tell us what you want to promote and discuss your options.</p>
          <Link to="/contact" className="footer-link">
            Send an enquiry <ArrowUpRight size={16} />
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

/* -------------------- COMMON PAGE HERO -------------------- */

function PageHero({ eyebrow = "ADSROW", title, description, children }) {
  return (
    <section className="page-hero">
      <div className="container">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        {description && (
          <p className="page-hero-description">{description}</p>
        )}
        {children}
      </div>
    </section>
  );
}

/* -------------------- SECTION HEADING -------------------- */

function SectionHeading({ eyebrow, title, description, centered = false }) {
  return (
    <div className={`section-heading ${centered ? "centered" : ""}`}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2>{title}</h2>
      {description && <p className="section-description">{description}</p>}
    </div>
  );
}

/* -------------------- FEATURE CARD -------------------- */

function FeatureCard({ icon: Icon, title, description, number }) {
  return (
    <article className="feature-card">
      {number && <span className="feature-number">{number}</span>}

      {Icon && (
        <span className="feature-icon">
          <Icon size={21} strokeWidth={1.7} />
        </span>
      )}

      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  );
}

const comparisonRows = [
  ["Reaches residents inside their community", "No", "Sometimes", "Yes"],
  ["Choose exact locations", "One site", "Hard to control", "Pick communities"],
  ["Change your ad anytime", "Reprint and remount", "Reprint", "In minutes"],
  ["Proof your ad ran", "Photo, if asked", "No", "Play report"],
  ["Track enquiries", "No", "No", "QR and call tracking"],
];

function ComparisonTable() {
  return (
    <div className="comparison-wrap" role="region" aria-label="Advertising format comparison" tabIndex="0">
      <table className="comparison-table">
        <thead>
          <tr>
            <th scope="col">What you get</th>
            <th scope="col">Billboard</th>
            <th scope="col">Pamphlets</th>
            <th scope="col">Adsrow</th>
          </tr>
        </thead>
        <tbody>
          {comparisonRows.map(([benefit, billboard, pamphlets, adsrow]) => (
            <tr key={benefit}>
              <th scope="row">{benefit}</th>
              <td>{billboard}</td>
              <td>{pamphlets}</td>
              <td>{adsrow}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* -------------------- ENQUIRY FORM -------------------- */

const initialEnquiry = {
  name: "",
  email: "",
  phone: "",
  interest: "Advertising on screens",
  message: "",
};

function EnquiryForm() {
  const [form, setForm] = useState(initialEnquiry);
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [errorMessage, setErrorMessage] = useState("");
  const { user } = useAuth();

  function updateForm(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });

    if (status === "success") {
      setStatus("idle");
    }
  }

  async function submitForm(event) {
    event.preventDefault();

    // Prevent duplicate submissions while a request is in flight.
    if (status === "sending") {
      return;
    }

    if (!user) {
      setStatus("error");
      setErrorMessage("Please sign in before submitting an enquiry.");
      return;
    }

    setStatus("sending");
    setErrorMessage("");

    try {
      await submitEnquiry({ ...form, enquiryType: form.interest });

      recordSubmittedEnquiry(user?.id);

      setForm({ ...initialEnquiry });
      setStatus("success");
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "We couldn't submit your enquiry. Please check your connection and try again."
      );
    }
  }

  return (
    <form className="enquiry-form" onSubmit={submitForm}>
      <div className="form-row">
        <label>
          Full Name
          <input
            name="name"
            value={form.name}
            onChange={updateForm}
            placeholder="Your name"
            required
          />
        </label>

        <label>
          Email Address
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={updateForm}
            placeholder="you@example.com"
            required
          />
        </label>
      </div>

      <div className="form-row">
        <label>
          Phone Number
          <input
            name="phone"
            value={form.phone}
            onChange={updateForm}
            placeholder="Your phone number"
          />
        </label>

        <label>
          Interested In
          <select
            name="interest"
            value={form.interest}
            onChange={updateForm}
          >
            <option>Advertising on screens</option>
            <option>Hosting a screen</option>
            <option>Ad creative support</option>
            <option>Other enquiry</option>
          </select>
        </label>
      </div>

      <label>
        Message
        <textarea
          name="message"
          value={form.message}
          onChange={updateForm}
          rows="4"
          placeholder="Tell us about your requirements..."
        />
      </label>

      {status === "success" && (
        <p className="form-status form-success" role="status">
          Thank you for contacting Adsrow! Your enquiry has been submitted
          successfully.
        </p>
      )}

      {status === "error" && (
        <p className="form-status form-error" role="alert">
          {errorMessage}
        </p>
      )}

      <button
        className="button"
        type="submit"
        disabled={status === "sending"}
      >
        {status === "sending" ? (
          "Sending..."
        ) : (
          <>
            Send Enquiry <ArrowUpRight size={16} />
          </>
        )}
      </button>

      <p className="form-hint">
        Include your business or community name, preferred Vijayawada areas, campaign timing, and whether you have an image or video ready. Screen hosts can share the property area and available shared space.
      </p>
    </form>
  );
}

/* -------------------- ENQUIRY SECTION -------------------- */

function EnquirySection({
  title = "Let's talk about your next campaign",
  description = "Tell us whether you’re planning an ad campaign or asking about hosting a screen. The Adsrow team can discuss target communities, pricing, creative support, campaign timing, or partnership terms.",
}) {
  return (
    <section className="section enquiry-section">
      <div className="container enquiry-grid">
        <div>
          <p className="eyebrow">GET IN TOUCH</p>
          <h2>{title}</h2>
          <p className="section-description">{description}</p>
        </div>

        <EnquiryForm />
      </div>
    </section>
  );
}

/* -------------------- HOME PAGE -------------------- */

const targetAreas = [
  "Bhavanipuram",
  "Governorpet",
  "Labbipet",
  "Moghalrajpuram",
  "Benz Circle",
  "Patamata",
  "Gunadala",
  "Ajit Singh Nagar",
  "Kanuru",
  "Poranki",
];

const campaignSteps = [
  {
    icon: MapPin,
    title: "Choose locations",
    description: "Select communities and areas near your audience, or ask the Adsrow team to suggest a suitable mix.",
  },
  {
    icon: CalendarDays,
    title: "Pick your schedule",
    description: "Discuss campaign length and time slots, including the periods that best fit your audience.",
  },
  {
    icon: Palette,
    title: "Share your ad",
    description: "Send a screen-ready image or video, or ask about creative support from the Adsrow team.",
  },
  {
    icon: Monitor,
    title: "Coordinate the launch",
    description: "The Adsrow team coordinates playback across the selected screens and can discuss remote campaign updates.",
  },
  {
    icon: ChartNoAxesCombined,
    title: "Review your report",
    description: "Review available proof of play, QR scans by community, and calls made through a campaign number.",
  },
];

function HomePage() {

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
      <section className="home-hero">
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
              Adsrow places digital screens in gated-community lift lobbies,
              bringing your message into residents’ everyday spaces. Plan a
              campaign across selected Vijayawada communities with one team,
              then review where it played.
            </p>

            <div className="hero-actions">
              <Link className="button" to="/advertise">
                Advertise With Us <ArrowUpRight size={16} />
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

          <div className="hero-visual">
              <img
                src="/adsrow-lobby.png"
                alt="Digital advertising screen in an apartment lobby"
                className="hero-image"
                fetchPriority="high"
              />

            <div className="hero-image-caption">
              <span className="caption-icon">
                <Monitor size={20} />
              </span>
              <span>
                <strong>Advertising that fits the location</strong>
                <small>Reach people in everyday spaces</small>
              </span>
            </div>
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

          <Link className="button button-white" to="/host-a-screen">
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
            <Link className="button" to="/advertise">Start Your Campaign <ArrowUpRight size={16} /></Link>
            <Link className="text-link" to="/contact">Contact Us <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>

    </>
  );
}

/* -------------------- ABOUT PAGE -------------------- */

function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="ABOUT ADSROW"
        title="A community-screen network for local advertisers."
        description="Adsrow brings digital advertising into gated-community lift lobbies, coordinating businesses, residential associations, screen-ready creative, and campaign reporting through one team."
      />

      <section className="section">
        <div className="container about-grid">
          <div>
            <p className="eyebrow">WHO WE ARE</p>
            <h2 className="section-title">
              One coordinated campaign across selected communities.
            </h2>
          </div>

          <div>
            <p className="body-copy">
              Adsrow’s preview describes a network of digital screens inside
              gated communities. Advertisers choose areas and communities that
              fit their audience, while Adsrow coordinates each selected
              placement through one team.
            </p>
            <p className="body-copy">
              The setting is different from a roadside billboard or a one-time
              pamphlet drop: residents encounter a screen in their lift lobby
              as part of their everyday community. Campaign timing, creative,
              remote updates, and available reports are discussed around the
              selected screens.
            </p>
            <Link to="/contact" className="text-link">
              Talk to Our Team <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container">
          <SectionHeading
            eyebrow="WHAT GUIDES US"
            title="Built around community, choice, and visibility"
            description="The pilot model brings location selection and campaign coordination together, with delivery information to review after launch."
          />

          <div className="feature-grid feature-grid-three">
            <FeatureCard icon={Target} title="Community-level placement" description="Choose residential communities and areas relevant to the people you want to reach." />
            <FeatureCard icon={MapPin} title="One team for selected locations" description="Coordinate a campaign across multiple communities without arranging each venue separately." />
            <FeatureCard icon={ChartNoAxesCombined} title="Delivery you can review" description="The preview describes proof of play by screen and date, with QR and campaign-call tracking options." />
          </div>
        </div>
      </section>
    </>
  );
}

/* -------------------- SERVICES PAGE -------------------- */

function ServicesPage() {
  const services = [
    { icon: Monitor, title: "Community Screen Network", description: "Coordinate one campaign across selected gated communities through one Adsrow team, rather than arranging every venue on its own." },
    { icon: MapPin, title: "Area-Targeted Campaigns", description: "Choose communities near a project site, store, clinic, or other audience. Exact screens and availability are confirmed with the team." },
    { icon: Palette, title: "Ad Design and Video", description: "Provide an existing image or video, or ask Adsrow’s creative team to prepare screen-ready material for your brand." },
    { icon: ChartNoAxesCombined, title: "Campaign Reports", description: "Review proof of play by screen and date, QR-code scans by community, and calls placed through a campaign number where supported." },
  ];
  const audiences = [
    [Building2, "Real estate", "Project launches, site visits, and property offers."],
    [Users, "Restaurants and cafés", "Delivery offers and new menu announcements."],
    [Monitor, "Automobiles", "Test-drive invitations and festive offers."],
    [CheckCircle2, "Clinics and hospitals", "Health camps and specialist services."],
    [ClipboardCheck, "Education", "Admissions and coaching batches."],
    [MapPin, "Retail and local shops", "Sales and new store openings."],
  ];

  return (
    <>
      <PageHero
        eyebrow="OUR SERVICES"
        title="Everything you need to advertise on Adsrow."
        description="A community-screen network, location choices, screen-ready creative, and reporting coordinated through one team."
      >
        <Link className="button" to="/contact">
          Discuss Your Needs <ArrowUpRight size={16} />
        </Link>
      </PageHero>

      <section className="section">
        <div className="container feature-grid feature-grid-four">
          {services.map((service) => (
            <FeatureCard key={service.title} {...service} />
          ))}
        </div>
      </section>

      <section className="section section-soft">
        <div className="container">
          <SectionHeading
            eyebrow="WHO ADVERTISES ON ADSROW"
            title="Campaigns for local moments and needs"
            description="The supplied preview highlights these advertiser categories and campaign examples."
          />
          <div className="feature-grid audience-grid">
            {audiences.map(([Icon, title, description]) => (
              <FeatureCard key={title} icon={Icon} title={title} description={description} />
            ))}
          </div>
        </div>
      </section>

    </>
  );
}

/* -------------------- LOCATIONS PAGE -------------------- */

function LocationsPage() {
  const locations = [
    { icon: Building2, title: "Gated communities and apartments", status: "Pilot focus · listed live in the preview", description: "The preview identifies residential communities as the current venue category. Ask Adsrow to confirm specific communities and screens." },
    { icon: Users, title: "Gyms and fitness centres", status: "Coming soon in the preview", description: "Shown as a future venue category; availability and timing need confirmation." },
    { icon: MapPin, title: "Supermarkets and malls", status: "Coming soon in the preview", description: "Shown as a planned venue category, not as a current screen location." },
    { icon: Monitor, title: "Offices and commercial spaces", status: "Coming soon in the preview", description: "Shown as a planned venue category; contact the team about future suitability." },
  ];

  return (
    <>
      <PageHero
        eyebrow="OUR LOCATIONS"
        title="Find a place that fits your audience."
        description="The supplied preview describes a Vijayawada pilot focused on gated communities. Specific communities and screen availability should be confirmed with Adsrow."
      >
        <Link className="button" to="/contact">
          Ask About Locations <ArrowUpRight size={16} />
        </Link>
      </PageHero>

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="PILOT VENUE STATUS"
            title="Residential communities come first"
            description="These status labels follow the supplied preview. It does not provide a public list of confirmed live community addresses."
          />

          <div className="feature-grid feature-grid-four">
            {locations.map(({ icon: Icon, title, status, description }) => (
              <article className="feature-card location-status-card" key={title}>
                <span className="feature-icon"><Icon size={21} /></span>
                <p className="location-status">{status}</p>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container">
          <SectionHeading
            eyebrow="INDICATIVE PILOT AREAS"
            title="Vijayawada, Andhra Pradesh"
            description="The schematic pilot map names these areas. They indicate the rollout focus, not specific confirmed screens; ask Adsrow for its community list and screen photos."
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

      <section className="section section-soft">
        <div className="container location-callout">
          <span className="callout-icon"><MapPin size={24} /></span>
          <div>
            <h2>Looking for a specific area?</h2>
            <p>Tell us the neighbourhood or audience you want to reach.</p>
          </div>
          <Link className="button" to="/contact">
            Ask Our Team <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}

/* -------------------- HOW IT WORKS PAGE -------------------- */

function HowItWorksPage() {
  const steps = campaignSteps;

  return (
    <>
      <PageHero
        eyebrow="HOW IT WORKS"
        title="A clear process. No unnecessary complexity."
        description="Adsrow coordinates the screen network; advertisers choose where and when their campaign should play, then review the delivery information available for that campaign."
      />

      <section className="section">
        <div className="container process-list">
          {steps.map((step, index) => (
            <article className="process-row" key={step.title}>
              <span className="process-number">0{index + 1}</span>
              <div>
                <h2>{step.title}</h2>
                <p>{step.description}</p>
              </div>
              <span className="process-icon"><step.icon size={22} /></span>
            </article>
          ))}
        </div>
      </section>

      <section className="section section-soft">
        <div className="container simple-cta">
          <div>
            <h2>Ready to discuss your campaign?</h2>
            <p>Share your target areas, timing, and whether you already have a screen-ready image or video.</p>
          </div>
          <Link className="button" to="/contact">
            Get in Touch <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}

/* -------------------- WHY ADSROW PAGE -------------------- */

function WhyAdsrowPage() {
  const reasons = [
    { icon: MapPin, title: "Choose communities", description: "Select exact neighbourhoods and communities relevant to your customers, subject to current screen availability." },
    { icon: Users, title: "Reach residents at home", description: "Place a message in a lift-lobby setting where residents pause, rather than beside a moving road or in a one-time handout." },
    { icon: ClipboardCheck, title: "Coordinate through one team", description: "Plan selected locations, timing, creative, and campaign changes with Adsrow rather than arranging each community independently." },
    { icon: ChartNoAxesCombined, title: "Review campaign delivery", description: "The preview describes proof of play by screen and date, with QR scans by community and campaign-number calls." },
  ];

  return (
    <>
      <PageHero
        eyebrow="WHY ADSROW"
        title="Not where they pass. Where they pause."
        description="The supplied preview positions lift-lobby screens as a community-based alternative to roadside billboards and pamphlet distribution, with location choices and campaign delivery reports."
      />

      <section className="section">
        <div className="container feature-grid feature-grid-four">
          {reasons.map((reason) => (
            <FeatureCard key={reason.title} {...reason} />
          ))}
        </div>
      </section>

      <section className="section section-soft">
        <div className="container">
          <SectionHeading
            eyebrow="WHAT YOU GET"
            title="Compare the placement and delivery options"
            description="This comparison follows the supplied Adsrow preview. Outcomes depend on selected placements and available campaign tracking."
          />
          <ComparisonTable />
        </div>
      </section>

      <section className="section section-soft">
        <div className="container simple-cta">
          <div>
            <h2>Let's find the right approach for your business.</h2>
            <p>Tell us what you want to promote and who you want to reach.</p>
          </div>
          <Link className="button" to="/contact">
            Talk to Adsrow <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}

/* -------------------- FAQ PAGE -------------------- */

function FaqsPage() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    ["How much does an Adsrow campaign cost?", "The supplied preview does not publish rates. Send your target areas, campaign length, and creative needs; the Adsrow team can reply with a suggested plan, communities to target, and pricing."],
    ["Can I choose specific communities?", "Yes. The preview describes choosing communities and areas closest to your customers, or asking Adsrow to suggest a mix. Ask the team for the full community list and screen photos, and confirm current availability."],
    ["What kind of ad do I need?", "The preview supports an image or video. If you do not have screen-ready material, Adsrow’s creative team can prepare images or videos for your brand. Confirm the exact file requirements with the team."],
    ["Can I change my ad during the campaign?", "The preview describes remote campaign updates, including changing offers or prices. Contact Adsrow with the update; timing for a specific campaign should be confirmed with the team."],
    ["How do I know my ad actually played?", "The preview describes proof-of-play reporting by screen and date, so you can review where the ad ran rather than relying only on an installation photo."],
    ["What campaign tracking is available?", "The preview lists QR-code scans by community and calls made through a campaign number. Confirm which tracking options are available for your campaign."],
    ["What does a screen-hosting partnership include?", "The preview says Adsrow installs and maintains the display, and that associations can use it for community notices between ads. Ads are reviewed for family-friendly content, and partnership terms are explained before installation."],
    ["How can our community or venue enquire?", "Share the property or community name, Vijayawada area, shared space, and an association or owner contact. The team can discuss suitability, installation, maintenance, and partnership terms before anything is installed."],
  ];

  return (
    <>
      <PageHero
        eyebrow="HELP CENTRE"
        title="Frequently asked questions"
        description="Answers based on the supplied Adsrow preview. Confirm campaign pricing, current screen availability, and campaign-specific support with the team."
      />

      <section className="section">
        <div className="container faq-list">
          {faqs.map(([question, answer], index) => (
            <article className="faq-item" key={question}>
              <button
                className="faq-question"
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                aria-expanded={openIndex === index}
              >
                <span>{question}</span>
                <ChevronDown
                  size={20}
                  className={openIndex === index ? "rotated" : ""}
                />
              </button>

              {openIndex === index && (
                <p className="faq-answer">{answer}</p>
              )}
            </article>
          ))}
        </div>
      </section>

    </>
  );
}

/* -------------------- ADVERTISE PAGE -------------------- */

function AdvertisePage() {
  return (
    <>
      <PageHero
        eyebrow="ADVERTISE WITH ADSROW"
        title="Plan a campaign around your audience."
        description="Choose the communities and areas you want to reach, share your campaign timing, and tell us whether you have screen-ready creative or need support. The team can confirm placements and pricing."
      />

      <section className="section">
        <div className="container advertise-grid">
          <div>
            <p className="eyebrow">GET STARTED</p>
            <h2 className="section-title">Plan a campaign around your goals.</h2>
            <p className="body-copy">
              Whether you are launching a property, promoting a restaurant
              offer, inviting test drives, sharing a health camp, or promoting
              admissions, tell the team who you want to reach and where.
            </p>
            <ul className="check-list">
              <li><CheckCircle2 size={17} /> Choose areas or communities near your intended audience</li>
              <li><CheckCircle2 size={17} /> Discuss campaign length and time slots</li>
              <li><CheckCircle2 size={17} /> Submit an image or video, or ask about design support</li>
              <li><CheckCircle2 size={17} /> Review available proof of play and tracking options</li>
            </ul>
          </div>

          <div className="plain-note">
            <h3>What to include in your enquiry</h3>
            <p>Business or brand name</p>
            <p>Product or service you want to promote</p>
            <p>Audience, neighbourhoods, or communities you want to reach</p>
            <p>Preferred campaign length and time slots</p>
            <p>Whether you have an image or video, or need creative support</p>
          </div>
        </div>
      </section>

    </>
  );
}

/* -------------------- HOST A SCREEN PAGE -------------------- */

function HostAScreenPage() {
  return (
    <>
      <PageHero
        eyebrow="HOST A SCREEN"
        title="Host an Adsrow screen in your community."
        description="Apartment associations, residential communities, property owners, and eligible venue partners can enquire about a digital display for their shared space. The supplied preview identifies gated communities and apartments as the current pilot focus."
      />

      <section className="section">
        <div className="container feature-grid feature-grid-three">
          <FeatureCard icon={Building2} title="Share the location" description="Tell us the community or property name, Vijayawada area, and the shared space being considered." />
          <FeatureCard icon={Monitor} title="Discuss installation and care" description="The preview says Adsrow installs and maintains the display. The team can review site details with the association or owner." />
          <FeatureCard icon={ClipboardCheck} title="Review terms before installation" description="Discuss community notices, ad-content review, and partnership terms before any installation is agreed." />
        </div>
      </section>

      <section className="section section-soft">
        <div className="container host-requirements">
          <h2 className="section-title">How the screen partnership works</h2>
          <p className="body-copy">The preview describes community announcements running between ads. Ad content is reviewed before going live to keep it family-friendly, and partnership terms are explained clearly before installation.</p>
          <ul className="check-list">
            <li><CheckCircle2 size={17} /> Adsrow team installation and maintenance, as described in the preview</li>
            <li><CheckCircle2 size={17} /> Space for association or community notices between advertisements</li>
            <li><CheckCircle2 size={17} /> Review of ad content before it goes live</li>
            <li><CheckCircle2 size={17} /> Partnership terms discussed before installation</li>
          </ul>
          <p className="small-note">
            Enquire with the property name, area, shared-space details, and an association or owner contact. The team must confirm current suitability and terms.
          </p>
        </div>
      </section>

    </>
  );
}

/* -------------------- CONTACT PAGE -------------------- */

function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="CONTACT ADSROW"
        title="Let's start with a conversation."
        description="Tell us what you want to promote or which community may host a screen. Include your target area, timing, and creative status; for hosting, share the property and shared-space details. Adsrow can discuss availability, pricing, and next steps."
      />

      <section className="section">
        <div className="container contact-info-grid">
          <article className="contact-info-card">
            <span className="feature-icon"><Mail size={20} /></span>
            <h3>Advertiser enquiry</h3>
            <p>Share your goal, target areas, timing, and creative needs. The team can reply with a suggested plan, communities to target, and pricing.</p>
          </article>

          <article className="contact-info-card">
            <span className="feature-icon"><MapPin size={20} /></span>
            <h3>Our Focus Area</h3>
            <p>The preview’s pilot map lists indicative Vijayawada areas. Ask the team to confirm specific communities and screens.</p>
          </article>

          <article className="contact-info-card">
            <span className="feature-icon"><MessageCircle size={20} /></span>
            <h3>What to Tell Us</h3>
            <p>For screen hosting, include the property or community name, area, shared space, and association or owner contact.</p>
          </article>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container simple-cta">
          <div>
            <p className="eyebrow">PARTNER WITH ADSROW</p>
            <h2>Ready to discuss a campaign or host a screen?</h2>
          </div>
          <Link className="button" to="/partner-form">
            Send a partner enquiry <ArrowRight size={17} />
          </Link>
        </div>
      </section>

    </>
  );
}

/* -------------------- APP ROUTES -------------------- */

function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return (
    <div className="site-shell">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function ProtectedAdvertisePage() {
  const { user, loading } = useAuth();
  if (loading) return <section className="section"><div className="container"><p>Checking your account…</p></div></section>;
  if (!user) return <Navigate to="/login?next=%2Fadvertise" replace />;
  return <AdvertisePage />;
}

function ProtectedDashboardPage() {
  const { user, loading } = useAuth();
  if (loading) return <section className="section"><div className="container"><p>Checking your account…</p></div></section>;
  if (!user) return <Navigate to="/login" replace />;
  return <DashboardPage />;
}

function ProtectedPartnerFormPage() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <section className="section"><div className="container"><p>Checking your account…</p></div></section>;
  }

  if (!user) {
    const destination = `${location.pathname}${location.search}`;
    return <Navigate to={`/login?next=${encodeURIComponent(destination)}`} replace />;
  }

  return (
    <>
      <PageHero
        eyebrow="PARTNER WITH ADSROW"
        title="Tell us how you would like to partner."
        description="Share your business or community details and our team will follow up with next steps."
      />
      <EnquirySection />
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/locations" element={<LocationsPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/why-adsrow" element={<WhyAdsrowPage />} />
        <Route path="/faqs" element={<FaqsPage />} />
        <Route path="/advertise" element={<ProtectedAdvertisePage />} />
        <Route path="/partner-form" element={<ProtectedPartnerFormPage />} />
        <Route path="/dashboard" element={<ProtectedDashboardPage />} />
        <Route path="/host-a-screen" element={<HostAScreenPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
