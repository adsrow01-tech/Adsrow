import { useState } from "react";
import {
  Routes,
  Route,
  Link,
  NavLink,
  Navigate,
  Outlet,
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
  Building2,
  CheckCircle2,
  Target,
  Users,
  MessageCircle,
  ClipboardCheck,
  ChevronDown,
  Mail,
} from "lucide-react";

/* -------------------- NAVBAR -------------------- */

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Locations", path: "/locations" },
    { name: "How It Works", path: "/how-it-works" },
  ];

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link
          to="/"
          className="brand"
          onClick={() => setMenuOpen(false)}
        >
          <span className="brand-mark">a</span>
          <span>adsrow</span>
        </Link>

        <nav className={`nav-links ${menuOpen ? "is-open" : ""}`}>
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === "/"}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
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
          <Link to="/" className="brand">
            <span className="brand-mark">a</span>
            <span>adsrow</span>
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

/* -------------------- ENQUIRY FORM -------------------- */

function EnquiryForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    interest: "Advertising on screens",
    message: "",
  });

  function updateForm(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  function submitForm(event) {
    event.preventDefault();

    const subject = encodeURIComponent(
      `Adsrow enquiry - ${form.interest}`
    );

    const body = encodeURIComponent(
      `Name: ${form.name}\n` +
      `Email: ${form.email}\n` +
      `Phone: ${form.phone}\n` +
      `Interest: ${form.interest}\n` +
      `Message: ${form.message}`
    );

    window.location.href =
      `mailto:hello@adsrow.com?subject=${subject}&body=${body}`;
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

      <button className="button" type="submit">
        Send Enquiry <ArrowUpRight size={16} />
      </button>

      <p className="form-hint">
        The form prepares an email. A backend is needed to save enquiries
        directly on the website.
      </p>
    </form>
  );
}

/* -------------------- ENQUIRY SECTION -------------------- */

function EnquirySection({
  title = "Let's talk about your next campaign",
  description = "Tell us what you need and we'll help you explore the right options.",
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

function HomePage() {
  const services = [
    {
      icon: Monitor,
      title: "Digital Screen Advertising",
      description:
        "Promote your business on screens in selected local spaces.",
    },
    {
      icon: MapPin,
      title: "Location-Based Advertising",
      description:
        "Explore locations that make sense for your target audience.",
    },
    {
      icon: Palette,
      title: "Ad Creative Support",
      description:
        "Prepare clear visual content suited to your advertising screen.",
    },
    {
      icon: ChartNoAxesCombined,
      title: "Campaign Updates",
      description:
        "Discuss placements, campaign timing, and available updates.",
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
              Make your brand part of the{" "}
              <span>places people go.</span>
            </h1>

            <p className="hero-description">
              Reach local audiences through digital screens in everyday
              spaces. Adsrow makes it easier to plan your next campaign.
            </p>

            <div className="hero-actions">
              <Link className="button" to="/advertise">
                Plan an Ad Campaign <ArrowUpRight size={16} />
              </Link>

              <Link className="text-link" to="/locations">
                Explore Locations <ArrowRight size={16} />
              </Link>
            </div>

            <p className="hero-trust">
              <CheckCircle2 size={17} />
              Local focus. Clear process. Practical advertising.
            </p>
          </div>

          <div className="hero-visual">
            <img
                  src="/adsrow-screen.png"
                  alt="Adsrow digital advertising screen"
                  className="hero-image"
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
        <div className="container intro-strip-inner">
          <strong>Helping local businesses get noticed</strong>
          <span>
            Digital screens <b>·</b> Local reach <b>·</b> Straightforward service
          </span>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="WHAT WE DO"
            title="Advertising made easier"
            description="From choosing a location to preparing your campaign, we help you work through the details."
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
            <p className="eyebrow">LOCAL KNOWLEDGE</p>
            <h2 className="section-title">
              Be seen where your customers already are.
            </h2>
            <p className="body-copy">
              Different places bring different audiences. Explore screen
              locations and find options that suit your campaign goals.
            </p>

            <ul className="check-list">
              <li><CheckCircle2 size={17} /> Explore potential locations</li>
              <li><CheckCircle2 size={17} /> Match campaigns to local audiences</li>
              <li><CheckCircle2 size={17} /> Get guidance before you start</li>
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
            centered
            eyebrow="HOW IT WORKS"
            title="Three simple steps"
            description="A clear process from your first enquiry to your campaign going live."
          />

          <div className="feature-grid feature-grid-three">
            <FeatureCard
              number="01"
              icon={Building2}
              title="Tell Us Your Goal"
              description="Share what you want to promote and who you want to reach."
            />
            <FeatureCard
              number="02"
              icon={MapPin}
              title="Choose Your Options"
              description="Discuss suitable locations, screens, and creative requirements."
            />
            <FeatureCard
              number="03"
              icon={Monitor}
              title="Plan the Launch"
              description="Confirm campaign details and coordinate the next steps."
            />
          </div>

          <div className="center-link">
            <Link className="text-link" to="/how-it-works">
              Learn How It Works <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="host-banner">
        <div className="container host-banner-inner">
          <div>
            <p className="eyebrow eyebrow-light">HAVE A SUITABLE SPACE?</p>
            <h2>Want to host an advertising screen?</h2>
            <p>
              Tell us about your building or location and explore whether it
              could be suitable.
            </p>
          </div>

          <Link className="button button-white" to="/host-a-screen">
            Host a Screen <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>

      <EnquirySection />
    </>
  );
}

/* -------------------- ABOUT PAGE -------------------- */

function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="ABOUT ADSROW"
        title="Local advertising, with a clear purpose."
        description="We help businesses explore digital screen advertising in local spaces, with a practical approach from planning to campaign delivery."
      />

      <section className="section">
        <div className="container about-grid">
          <div>
            <p className="eyebrow">WHO WE ARE</p>
            <h2 className="section-title">
              Built around local businesses and real places.
            </h2>
          </div>

          <div>
            <p className="body-copy">
              Adsrow focuses on making digital advertising more approachable
              for businesses that want to reach people in their local area.
              We connect campaign goals with advertising opportunities in
              everyday spaces.
            </p>
            <p className="body-copy">
              Our approach is straightforward: understand what you need,
              discuss available options, and help you plan the next step.
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
            title="A straightforward way to advertise"
            description="We focus on making campaigns easier to understand and plan."
          />

          <div className="feature-grid feature-grid-three">
            <FeatureCard icon={Target} title="Clear Goals" description="Start with what you want to achieve and who you want to reach." />
            <FeatureCard icon={MapPin} title="Local Understanding" description="Consider locations and the audiences around them." />
            <FeatureCard icon={Users} title="Helpful Communication" description="Understand the next steps and who to contact with questions." />
          </div>
        </div>
      </section>
    </>
  );
}

/* -------------------- SERVICES PAGE -------------------- */

function ServicesPage() {
  const services = [
    { icon: Monitor, title: "Digital Screen Advertising", description: "Promote your business, product, or service on digital screens in selected local spaces." },
    { icon: MapPin, title: "Location-Based Advertising", description: "Explore locations based on your target audience, campaign goals, and budget." },
    { icon: Palette, title: "Ad Creative Support", description: "Prepare clear visual content suited to the screen format and viewing distance." },
    { icon: ChartNoAxesCombined, title: "Campaign Updates", description: "Discuss campaign progress and the information available for your placement." },
    { icon: ClipboardCheck, title: "Campaign Planning", description: "Work through timing, creative requirements, placements, and launch arrangements." },
    { icon: MessageCircle, title: "Campaign Guidance", description: "Get answers about the process before confirming your plan." },
  ];

  return (
    <>
      <PageHero
        eyebrow="OUR SERVICES"
        title="Practical advertising support, from start to finish."
        description="Explore services that can help you plan a digital screen campaign for your business."
      >
        <Link className="button" to="/contact">
          Discuss Your Needs <ArrowUpRight size={16} />
        </Link>
      </PageHero>

      <section className="section">
        <div className="container feature-grid feature-grid-three">
          {services.map((service) => (
            <FeatureCard key={service.title} {...service} />
          ))}
        </div>
      </section>

      <EnquirySection title="Not sure which service you need?" />
    </>
  );
}

/* -------------------- LOCATIONS PAGE -------------------- */

function LocationsPage() {
  const locations = [
    { icon: Building2, title: "Residential Communities", description: "Explore opportunities in shared community spaces, where permitted." },
    { icon: MapPin, title: "Retail and Shopping Areas", description: "Consider locations where shoppers and visitors spend time." },
    { icon: Users, title: "Office and Commercial Spaces", description: "Explore suitable screens in business buildings and professional environments." },
    { icon: Monitor, title: "Everyday Gathering Spaces", description: "Consider suitable venues where people pause, wait, or meet." },
  ];

  return (
    <>
      <PageHero
        eyebrow="OUR LOCATIONS"
        title="Find a place that fits your audience."
        description="Explore potential digital screen placements in Vijayawada and discuss which locations may suit your campaign."
      >
        <Link className="button" to="/contact">
          Ask About Locations <ArrowUpRight size={16} />
        </Link>
      </PageHero>

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="LOCATION TYPES"
            title="Reach people in everyday spaces"
            description="The right placement depends on your campaign, audience, timing, and available screens."
          />

          <div className="feature-grid feature-grid-four">
            {locations.map((location) => (
              <FeatureCard key={location.title} {...location} />
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
  const steps = [
    { icon: MessageCircle, title: "Share Your Requirements", text: "Tell us about your business, campaign goal, target audience, and preferred timeline." },
    { icon: MapPin, title: "Discuss Suitable Options", text: "Discuss relevant locations, screen availability, creative formats, and budget considerations." },
    { icon: ClipboardCheck, title: "Confirm the Campaign Plan", text: "Review campaign details, content requirements, timing, and next steps before confirming." },
    { icon: Monitor, title: "Prepare for Launch", text: "Coordinate the required creative and launch arrangements with the team." },
  ];

  return (
    <>
      <PageHero
        eyebrow="HOW IT WORKS"
        title="A clear process. No unnecessary complexity."
        description="We make it easier to understand the steps involved in planning a digital screen advertising campaign."
      />

      <section className="section">
        <div className="container process-list">
          {steps.map((step, index) => (
            <article className="process-row" key={step.title}>
              <span className="process-number">0{index + 1}</span>
              <div>
                <h2>{step.title}</h2>
                <p>{step.text}</p>
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
            <p>Start with a short enquiry and learn about your options.</p>
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
    { icon: MapPin, title: "Local Focus", description: "Explore advertising opportunities in and around Vijayawada." },
    { icon: MessageCircle, title: "Direct Communication", description: "Discuss your needs and ask questions before making a decision." },
    { icon: ClipboardCheck, title: "Clear Next Steps", description: "Understand what is needed to prepare your campaign." },
    { icon: Users, title: "Business-First Approach", description: "Start with your audience and goals, not a one-size-fits-all plan." },
  ];

  return (
    <>
      <PageHero
        eyebrow="WHY ADSROW"
        title="A straightforward way to plan local advertising."
        description="We focus on helping you understand your options, choose suitable placements, and move forward with a clear plan."
      />

      <section className="section">
        <div className="container feature-grid feature-grid-four">
          {reasons.map((reason) => (
            <FeatureCard key={reason.title} {...reason} />
          ))}
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
    ["What is Adsrow?", "Adsrow helps businesses explore digital screen advertising opportunities in local spaces."],
    ["Where are your advertising locations?", "We focus on Vijayawada and can discuss location options based on availability and your campaign requirements."],
    ["How do I start an advertising campaign?", "Send us an enquiry with your business details, campaign goal, audience, and timeline."],
    ["Can you help with ad creative?", "Creative requirements depend on the screen and campaign. Tell us what you have and we can discuss available support."],
    ["How much does a campaign cost?", "Pricing can depend on placement, duration, creative requirements, and availability. Contact us for details."],
    ["Can my building host a screen?", "Share details about your property and location so the team can review whether it may be suitable."],
  ];

  return (
    <>
      <PageHero
        eyebrow="HELP CENTRE"
        title="Frequently asked questions"
        description="Quick answers about advertising with Adsrow and hosting a digital screen."
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

      <EnquirySection title="Still have a question?" />
    </>
  );
}

/* -------------------- ADVERTISE PAGE -------------------- */

function AdvertisePage() {
  return (
    <>
      <PageHero
        eyebrow="ADVERTISE WITH ADSROW"
        title="Bring your message to local spaces."
        description="Tell us what you're promoting and who you want to reach. We'll help you explore suitable digital screen advertising options."
      />

      <section className="section">
        <div className="container advertise-grid">
          <div>
            <p className="eyebrow">GET STARTED</p>
            <h2 className="section-title">Plan a campaign around your goals.</h2>
            <p className="body-copy">
              Whether you're introducing a business, promoting an offer, or
              building local awareness, start by sharing a few details with
              our team.
            </p>
            <ul className="check-list">
              <li><CheckCircle2 size={17} /> Discuss potential locations</li>
              <li><CheckCircle2 size={17} /> Review screen requirements</li>
              <li><CheckCircle2 size={17} /> Understand timing and next steps</li>
            </ul>
          </div>

          <div className="plain-note">
            <h3>What to include in your enquiry</h3>
            <p>Business or brand name</p>
            <p>Product or service you want to promote</p>
            <p>Audience or locations you're interested in</p>
            <p>Preferred dates and budget, if known</p>
          </div>
        </div>
      </section>

      <EnquirySection title="Tell us about your campaign" />
    </>
  );
}

/* -------------------- HOST A SCREEN PAGE -------------------- */

function HostAScreenPage() {
  return (
    <>
      <PageHero
        eyebrow="HOST A SCREEN"
        title="Have a space that could host a digital screen?"
        description="Apartment associations, building managers, and property owners can tell us about their location and explore the next steps."
      />

      <section className="section">
        <div className="container feature-grid feature-grid-three">
          <FeatureCard icon={Building2} title="Tell Us About the Property" description="Share the property type, location, and kind of shared space available." />
          <FeatureCard icon={Users} title="Consider the Audience" description="Describe the people who use the building or visit the space." />
          <FeatureCard icon={MapPin} title="Review Suitability" description="Our team can discuss the details and whether the location may be suitable." />
        </div>
      </section>

      <section className="section section-soft">
        <div className="container host-requirements">
          <h2 className="section-title">A few helpful details</h2>
          <ul className="check-list">
            <li><CheckCircle2 size={17} /> Property name and location</li>
            <li><CheckCircle2 size={17} /> Property type and shared areas</li>
            <li><CheckCircle2 size={17} /> Contact details for the owner or association</li>
            <li><CheckCircle2 size={17} /> Relevant permissions or restrictions</li>
          </ul>
          <p className="small-note">
            Screen installation and commercial arrangements depend on review,
            permissions, and agreement.
          </p>
        </div>
      </section>

      <EnquirySection title="Tell us about your space" />
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
        description="Have a campaign in mind or a location to discuss? Send us an enquiry and tell us what you need."
      />

      <section className="section">
        <div className="container contact-info-grid">
          <article className="contact-info-card">
            <span className="feature-icon"><Mail size={20} /></span>
            <h3>Email Enquiry</h3>
            <p>Use the enquiry form to prepare a message with your details.</p>
          </article>

          <article className="contact-info-card">
            <span className="feature-icon"><MapPin size={20} /></span>
            <h3>Our Focus Area</h3>
            <p>Vijayawada, Andhra Pradesh</p>
          </article>

          <article className="contact-info-card">
            <span className="feature-icon"><MessageCircle size={20} /></span>
            <h3>What to Tell Us</h3>
            <p>Share your goals, preferred locations, timeline, or questions.</p>
          </article>
        </div>
      </section>

      <EnquirySection title="Send us your enquiry" />
    </>
  );
}

/* -------------------- APP ROUTES -------------------- */

function Layout() {
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
        <Route path="/advertise" element={<AdvertisePage />} />
        <Route path="/host-a-screen" element={<HostAScreenPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}