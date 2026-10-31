import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowUpRight, MapPin, MessageCircle, Phone } from "lucide-react";
import { PageHero } from "../components/SiteComponents";
import { targetAreas } from "../lib/siteContent";
import { ENQUIRY_SERVER_MESSAGE, submitEnquiry, validateEnquiry } from "../lib/enquire";
import { recordSubmittedEnquiry } from "../lib/dashboard";
import { useAuth } from "../context/AuthContext";

const audienceOptions = [
  "Families at home",
  "Café & restaurant guests",
  "Gym-goers",
  "Hospital visitors",
  "Shoppers",
  "Office professionals",
  "Not sure, recommend for me",
];

const venueTypes = [
  "Apartment community",
  "Café / restaurant",
  "Gym",
  "Hospital / clinic",
  "Mall",
  "Supermarket",
  "Office / commercial",
  "Other",
];

const roleOptions = ["Owner", "Manager", "RWA / committee member", "Facility manager", "Other"];
const visitorOptions = ["Under 100", "100–500", "500–1,000", "1,000+"];

const advertiserInitial = {
  name: "",
  businessName: "",
  phone: "",
  promotion: "",
  audience: [],
  areas: [],
  startTime: "",
  adReady: "",
};

const venueInitial = {
  name: "",
  venueType: "",
  role: "",
  venueName: "",
  area: "",
  visitors: "",
  phone: "",
};

const advertiserRequired = ["name", "businessName", "promotion"];
const venueRequired = ["name", "venueType", "role", "venueName", "area"];

function requestedTab(search) {
  const params = new URLSearchParams(search);
  const values = [params.get("interest"), params.get("type"), params.get("enquiry")]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return /host|venue|screen partner/.test(values) ? "venue" : "advertiser";
}

function Field({ id, label, required = false, error, children }) {
  const errorId = `${id}-error`;
  return (
    <div className="contact-field">
      <label htmlFor={id}>{label}{required ? "*" : ""}</label>
      {children({
        id,
        "aria-required": required ? "true" : undefined,
        "aria-invalid": error ? "true" : "false",
        "aria-describedby": error ? errorId : undefined,
      })}
      {error && <p className="field-error" id={errorId} role="alert">{error}</p>}
    </div>
  );
}

function SelectField({ id, label, required = false, error, value, options, onChange, placeholder = "Select an option" }) {
  return (
    <Field id={id} label={label} required={required} error={error}>
      {(attributes) => (
        <select {...attributes} value={value} onChange={onChange}>
          <option value="">{placeholder}</option>
          {options.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
      )}
    </Field>
  );
}

function TextField({ id, label, required = false, error, value, onChange, placeholder, type = "text", inputMode, autoComplete }) {
  return (
    <Field id={id} label={label} required={required} error={error}>
      {(attributes) => (
        <input
          {...attributes}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          inputMode={inputMode}
          autoComplete={autoComplete}
        />
      )}
    </Field>
  );
}

function CheckList({ id, label, options, value, onChange }) {
  return (
    <fieldset className="contact-checklist">
      <legend>{label}</legend>
      <div className="contact-checklist-grid">
        {options.map((option) => (
          <label className="contact-check-option" key={option}>
            <input
              type="checkbox"
              name={id}
              value={option}
              checked={value.includes(option)}
              onChange={() => onChange(option)}
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function SuccessState({ kind }) {
  const advertiser = kind === "advertiser";
  return (
    <section className="contact-success ads-card ads-card-interactive ads-accent-4" role="status" aria-live="polite">
      <span className="contact-success-icon"><MessageCircle size={23} /></span>
      <h2>{advertiser ? "Got it. Your plan is on its way." : "Thanks. Let's plan a visit."}</h2>
      <p>{advertiser
        ? "Our team will follow up with suggested venues and a price."
        : "We'll contact you to fix a convenient time to see your space."}</p>
      <Link className="button" to={advertiser ? "/network" : "/host-a-screen"}>
        {advertiser ? "Explore the Network" : "Learn About Hosting"} <ArrowUpRight size={16} />
      </Link>
    </section>
  );
}

function EnquiryServerError() {
  const [beforePhone, afterPhone] = ENQUIRY_SERVER_MESSAGE.split("+91 83746 22055");
  return (
    <p className="form-status form-error" role="alert">
      {beforePhone}
      <a href="https://wa.me/918374622055" target="_blank" rel="noreferrer">+91 83746 22055</a>
      {afterPhone}
    </p>
  );
}

function EnquiryForm({ kind }) {
  const isAdvertiser = kind === "advertiser";
  const initial = isAdvertiser ? advertiserInitial : venueInitial;
  const requiredFields = isAdvertiser ? advertiserRequired : venueRequired;
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const { user } = useAuth();
  const formRef = useRef(null);
  const submittingRef = useRef(false);

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    if (status === "error") {
      setStatus("idle");
      setErrorMessage("");
    }
  }

  function toggleArrayValue(field, value) {
    const current = form[field];
    update(field, current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (submittingRef.current) return;

    const nextErrors = validateEnquiry(form, requiredFields);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      setStatus("idle");
      requestAnimationFrame(() => formRef.current?.querySelector('[aria-invalid="true"]')?.focus());
      return;
    }

    setStatus("sending");
    submittingRef.current = true;
    setErrorMessage("");
    const enquiryType = isAdvertiser ? "Advertiser enquiry" : "Venue partner enquiry";
    try {
      await submitEnquiry({ ...form, enquiryType });
      if (user) recordSubmittedEnquiry(user.id);
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMessage(ENQUIRY_SERVER_MESSAGE);
    } finally {
      submittingRef.current = false;
    }
  }

  if (status === "success") return <SuccessState kind={kind} />;

  return (
    <form className="enquiry-form contact-form" ref={formRef} onSubmit={handleSubmit} noValidate>
      <div className="form-row">
        <TextField id={`${kind}-name`} label="Your name" required error={errors.name} value={form.name} onChange={(event) => update("name", event.target.value)} placeholder="Full name" autoComplete="name" />
        {isAdvertiser
          ? <TextField id="business-name" label="Business name" required error={errors.businessName} value={form.businessName} onChange={(event) => update("businessName", event.target.value)} placeholder="e.g. Sri Sai Diagnostics" autoComplete="organization" />
          : <SelectField id="venue-type" label="Venue type" required error={errors.venueType} value={form.venueType} options={venueTypes} onChange={(event) => update("venueType", event.target.value)} />}
      </div>

      {isAdvertiser ? (
        <div className="form-row">
          <TextField id="advertiser-phone" label="Phone / WhatsApp" required error={errors.phone} value={form.phone} onChange={(event) => update("phone", event.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="10-digit mobile number" type="tel" inputMode="numeric" autoComplete="tel-national" />
          <SelectField id="promotion" label="What are you promoting?" required error={errors.promotion} value={form.promotion} options={["Real estate", "Food & restaurants", "Healthcare", "Education", "Automobile", "Retail & FMCG", "Finance", "Other"]} onChange={(event) => update("promotion", event.target.value)} />
        </div>
      ) : (
        <div className="form-row">
          <SelectField id="venue-role" label="Your role" required error={errors.role} value={form.role} options={roleOptions} onChange={(event) => update("role", event.target.value)} />
          <TextField id="venue-name" label="Venue name" required error={errors.venueName} value={form.venueName} onChange={(event) => update("venueName", event.target.value)} placeholder="e.g. Lake View Residency, Brew House Café" />
        </div>
      )}

      {isAdvertiser ? (
        <>
          <CheckList id="audience" label="Who do you want to reach?" options={audienceOptions} value={form.audience} onChange={(option) => toggleArrayValue("audience", option)} />
          <CheckList id="areas" label="Areas" options={[...targetAreas, "Anywhere in Vijayawada"]} value={form.areas} onChange={(option) => toggleArrayValue("areas", option)} />
          <div className="form-row">
            <SelectField id="start-time" label="When do you want to start?" value={form.startTime} options={["This week", "This month", "Just exploring"]} onChange={(event) => update("startTime", event.target.value)} />
            <SelectField id="ad-ready" label="Do you have an ad ready?" value={form.adReady} options={["Yes", "No, please design one"]} onChange={(event) => update("adReady", event.target.value)} />
          </div>
        </>
      ) : (
        <>
          <div className="form-row">
            <SelectField id="venue-area" label="Area" required error={errors.area} value={form.area} options={[...targetAreas, "Other"]} onChange={(event) => update("area", event.target.value)} />
            <SelectField id="venue-visitors" label="Daily visitors (approx.)" value={form.visitors} options={visitorOptions} onChange={(event) => update("visitors", event.target.value)} />
          </div>
          <TextField id="venue-phone" label="Phone / WhatsApp" required error={errors.phone} value={form.phone} onChange={(event) => update("phone", event.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="10-digit mobile number" type="tel" inputMode="numeric" autoComplete="tel-national" />
        </>
      )}

      {status === "error" && (errorMessage === ENQUIRY_SERVER_MESSAGE
        ? <EnquiryServerError />
        : <p className="form-status form-error" role="alert">{errorMessage}</p>)}
      <button className="button" type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Sending..." : isAdvertiser ? "Send Me a Plan" : "Request a Site Visit"}
        {status !== "sending" && <ArrowUpRight size={16} />}
      </button>
      {isAdvertiser && <p className="form-hint">No spam. No obligation. We'll only contact you about your enquiry.</p>}
    </form>
  );
}

function ContactPanel() {
  return (
    <aside className="contact-panel ads-card ads-card-interactive ads-accent-1" aria-labelledby="contact-panel-title">
      <h2 id="contact-panel-title">Prefer to talk?</h2>
      <a href="tel:+918374622055"><Phone size={18} /><span><strong>Call or WhatsApp</strong><br />+91 83746 22055</span></a>
      <a href="https://wa.me/918374622055" target="_blank" rel="noreferrer"><MessageCircle size={18} /><span>Message us on WhatsApp</span></a>
      <p><MapPin size={18} /><span><strong>Location</strong><br />Vijayawada, Andhra Pradesh</span></p>
    </aside>
  );
}

function ContactPage() {
  const location = useLocation();
  const tabRefs = useRef([]);
  const [activeTab, setActiveTab] = useState(() => requestedTab(location.search));

  useEffect(() => setActiveTab(requestedTab(location.search)), [location.search]);

  function handleTabKeyDown(event, index) {
    let nextIndex = index;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = (index + 1) % 2;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = (index + 1) % 2;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = 1;
    else return;
    event.preventDefault();
    setActiveTab(nextIndex === 0 ? "advertiser" : "venue");
    tabRefs.current[nextIndex]?.focus();
  }

  return (
    <>
      <PageHero
        eyebrow="CONTACT"
        title="Tell us who you want to reach. We'll send you a plan."
        description="Tell us your audience or venue and our team will follow up with a plan."
      />

      <section className="section contact-section">
        <div className="container contact-layout">
          <div className="contact-main">
            <div className="contact-tabs" role="tablist" aria-label="Choose your enquiry type">
              {[ ["advertiser", "I want to advertise"], ["venue", "I want to host a screen"] ].map(([tab, label], index) => (
                <button
                  key={tab}
                  ref={(element) => { tabRefs.current[index] = element; }}
                  id={`contact-tab-${tab}`}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab}
                  aria-controls={`contact-panel-${tab}`}
                  tabIndex={activeTab === tab ? 0 : -1}
                  className={`contact-tab ${activeTab === tab ? "active" : ""}`}
                  onClick={() => setActiveTab(tab)}
                  onKeyDown={(event) => handleTabKeyDown(event, index)}
                >
                  {label}
                </button>
              ))}
            </div>
            <div id="contact-panel-advertiser" role="tabpanel" aria-labelledby="contact-tab-advertiser" className="contact-form-panel" hidden={activeTab !== "advertiser"}>
              <EnquiryForm kind="advertiser" />
            </div>
            <div id="contact-panel-venue" role="tabpanel" aria-labelledby="contact-tab-venue" className="contact-form-panel" hidden={activeTab !== "venue"}>
              <EnquiryForm kind="venue" />
            </div>
          </div>
          <ContactPanel />
        </div>
      </section>
    </>
  );
}

export default ContactPage;
