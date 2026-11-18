import { useEffect, useState } from "react";
import { ChartNoAxesCombined, Eye, MapPin, Monitor, Palette, Target } from "lucide-react";
import "../styles/six-reasons-screen-hub.css";

const reasons = [
  {
    icon: Target,
    label: "01 · THE RIGHT PEOPLE",
    title: "The right people",
    description: "Pick apartments, gyms or cafés in the areas you choose.",
    adTitle: "Seen by your neighbourhood",
    adDescription: "Pick apartments, gyms or cafés in the areas you choose.",
    note: "Apartments · Gyms · Cafés",
    venue: "Lift lobby · Patamata",
    color: "#0B3D91",
  },
  {
    icon: Monitor,
    label: "02 · ONE BOOKING",
    title: "One booking",
    description: "One WhatsApp chat books every screen. We handle the rest.",
    adTitle: "One chat. Every screen.",
    adDescription: "Book on WhatsApp and we schedule every venue for you.",
    note: "Book in 2 minutes",
    venue: "Gym floor · Labbipet",
    color: "#087F70",
  },
  {
    icon: Palette,
    label: "03 · CHANGE ANYTIME",
    title: "Change anytime",
    description: "New offer or price? We update your ad remotely. No reprinting.",
    adTitle: "New price? Live today.",
    adDescription: "We update your ad remotely. No reprinting, no remounting.",
    note: "Updated remotely",
    venue: "Café counter · Benz Circle",
    color: "#C74728",
  },
  {
    icon: ChartNoAxesCombined,
    label: "04 · REAL PROOF",
    title: "Real proof",
    description: "Play reports by screen and date, plus QR scans to count enquiries.",
    adTitle: "Every play, counted.",
    adDescription: "Play reports by screen and date, plus QR scans for enquiries.",
    note: "Proof of play",
    venue: "Lift lobby · Gunadala",
    color: "#252943",
  },
  {
    icon: MapPin,
    label: "05 · START SMALL, GROW",
    title: "Start small, grow",
    description: "Begin with one lobby. Add areas as the results come in.",
    adTitle: "One lobby to the whole city.",
    adDescription: "Begin with one lobby. Add areas as the results come in.",
    note: "From ₹99 a day",
    venue: "Lift lobby · Moghalrajpuram",
    color: "#5140B8",
  },
  {
    icon: Eye,
    label: "06 · FULL ATTENTION",
    title: "Full attention",
    description: "Eye-level screens where people wait. Nothing to scroll or skip.",
    adTitle: "No scroll. No skip.",
    adDescription: "Eye-level screens where people wait. Your ad plays in full.",
    note: "10 seconds, full screen",
    venue: "Gym reception · Governorpet",
    color: "#A16A00",
  },
];

function useReducedMotionPreference() {
  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(preference.matches);
    updatePreference();
    preference.addEventListener("change", updatePreference);
    return () => preference.removeEventListener("change", updatePreference);
  }, []);

  return reducedMotion;
}

function ReasonCard({ reason, index, active, onSelect, side }) {
  const Icon = reason.icon;

  return (
    <button
      type="button"
      className={`srh-card srh-card-${side}${active ? " is-active" : ""}`}
      aria-pressed={active}
      aria-label={`Show reason ${index + 1}: ${reason.title}`}
      onClick={onSelect}
    >
      <span className="srh-card-icon" aria-hidden="true"><Icon size={19} strokeWidth={1.8} /></span>
      <span className="srh-card-copy">
        <span className="srh-card-label">{reason.label}</span>
        <span className="srh-card-title">{reason.title}</span>
        <span className="srh-card-description">{reason.description}</span>
      </span>
    </button>
  );
}

function AdvertisingScreen({ reason, index, reducedMotion }) {
  return (
    <div className="srh-screen-shell" aria-label="Adsrow portrait advertising screen">
      <div className="srh-screen-bezel">
        <div className="srh-screen-face" style={{ "--srh-ad-color": reason.color }}>
          <div className="srh-screen-hud" aria-hidden="true">
            <span className="srh-live"><i />LIVE</span>
            <span className="srh-venue">{reason.venue}</span>
          </div>
          <div className={`srh-ad-copy${reducedMotion ? "" : " is-entering"}`} key={index}>
            <span className="srh-ad-kicker">ADSROW · {reason.label.split(" · ").slice(1).join(" ")}</span>
            <strong>{reason.adTitle}</strong>
            <span className="srh-ad-description">{reason.adDescription}</span>
            <span className="srh-ad-note">{reason.note}</span>
          </div>
          <div className="srh-screen-progress" aria-hidden="true"><i key={index} className={reducedMotion ? "is-complete" : ""} /></div>
        </div>
        <div className="srh-screen-chin" aria-label="Adsrow"><span>adsrow.</span></div>
      </div>
      <span className="srh-screen-foot" aria-hidden="true" />
    </div>
  );
}

export default function SixReasonsScreenHub() {
  const reducedMotion = useReducedMotionPreference();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (reducedMotion) return undefined;
    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % reasons.length);
    }, 4500);
    return () => window.clearInterval(intervalId);
  }, [reducedMotion]);

  const activeReason = reasons[activeIndex];

  return (
    <div className="srh-hub">
      <div className="srh-column srh-column-left" aria-label="Reasons one through three">
        {reasons.slice(0, 3).map((reason, index) => (
          <ReasonCard key={reason.title} reason={reason} index={index} active={activeIndex === index} onSelect={() => setActiveIndex(index)} side="left" />
        ))}
      </div>
      <div className="srh-screen-column" aria-live="polite" aria-atomic="true">
        <AdvertisingScreen reason={activeReason} index={activeIndex} reducedMotion={reducedMotion} />
      </div>
      <div className="srh-column srh-column-right" aria-label="Reasons four through six">
        {reasons.slice(3).map((reason, index) => {
          const reasonIndex = index + 3;
          return <ReasonCard key={reason.title} reason={reason} index={reasonIndex} active={activeIndex === reasonIndex} onSelect={() => setActiveIndex(reasonIndex)} side="right" />;
        })}
      </div>
    </div>
  );
}
