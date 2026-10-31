import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { submitEnquiry } from "../lib/enquire";
import { recordSubmittedEnquiry } from "../lib/dashboard";

export function PageHero({ eyebrow = "ADSROW", title, description, children }) {
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

export function SectionHeading({ eyebrow, title, description, centered = false, className = "" }) {
  return (
    <div className={`section-heading ${centered ? "centered" : ""} ${className}`.trim()}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2>{title}</h2>
      {description && <p className="section-description">{description}</p>}
    </div>
  );
}

/* -------------------- FEATURE CARD --------------------
   Shared card component. Pass `index` (0-based) to opt into the
   Adsrow card design system: pastel surface, coordinated accent,
   per-card hover interaction. `decor` renders the icon again as an
   oversized outline icon in the background, `styled` builds a
   number + icon header row. */

export function FeatureCard({ icon: Icon, title, description, number, className = "", tabIndex, index, decor = false, styled = false }) {
  const themes = ["ads-card", "ads-card-interactive"];
  if (typeof index === "number") themes.push(`ads-accent-${(index % 6) + 1}`);
  const base = ["feature-card", ...themes, className].filter(Boolean).join(" ");

  return (
    <article className={base} tabIndex={tabIndex}>
      {styled && number && Icon ? (
        <div className="ads-card-head-row">
          <span className="ads-num" aria-hidden="true">{number}</span>
          <span className="feature-icon" aria-hidden="true">
            <Icon size={21} strokeWidth={1.7} />
          </span>
        </div>
      ) : (
        <>
          {number && <span className="feature-number">{number}</span>}

          {Icon && (
            <span className="feature-icon">
              <Icon size={21} strokeWidth={1.7} />
            </span>
          )}
        </>
      )}

      <h3>{title}</h3>
      <p>{description}</p>

      {decor && Icon && <Icon className="ads-card-decor" aria-hidden="true" />}
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

export function ComparisonTable() {
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

export function EnquiryForm() {
  const [form, setForm] = useState(initialEnquiry);
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [errorMessage, setErrorMessage] = useState("");
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const requestedInterest = new URLSearchParams(location.search).get("interest");
    if (requestedInterest) setForm((current) => ({ ...current, interest: requestedInterest }));
  }, [location.search]);

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

    setStatus("sending");
    setErrorMessage("");

    try {
      await submitEnquiry({ ...form, enquiryType: form.interest });
      if (user) recordSubmittedEnquiry(user.id);

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

export function EnquirySection({
  title = "Partner with Adsrow",
  description = "Share your business or community details and tell us how you would like to work with Adsrow.",
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
