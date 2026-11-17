import { useEffect, useState } from "react";
import "../styles/home-reasons-hub.css";

const SLIDE_DURATION_MS = 4200;

const reasons = [
  { icon: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>', k: "01 · THE RIGHT PEOPLE", t: "The right people", d: "Pick apartments, gyms or cafés in the areas you choose.", h: "Seen by your neighbourhood", s: "Pick apartments, gyms or cafés in the areas you choose.", foot: "Apartments · Gyms · Cafés", bg: "linear-gradient(165deg,#2C74E8,#0B3D91 65%,#082F70)", venue: "Lift lobby · Patamata" },
  { icon: '<path d="M4 5h16v11H8l-4 4z"/>', k: "02 · ONE BOOKING", t: "One booking", d: "One WhatsApp chat books every screen. We handle the rest.", h: "One chat. Every screen.", s: "Book on WhatsApp and we schedule every venue for you.", foot: "Book in 2 minutes", bg: "linear-gradient(165deg,#22D3A6,#0FB98A 55%,#0B7F62)", venue: "Gym floor · Labbipet" },
  { icon: '<path d="M4 20h4L19 9l-4-4L4 16v4z"/><path d="M13 7l4 4"/>', k: "03 · CHANGE ANYTIME", t: "Change anytime", d: "New offer or price? We update your ad remotely. No reprinting.", h: "New price? Live today.", s: "We update your ad remotely. No reprinting, no remounting.", foot: "Updated remotely", bg: "linear-gradient(165deg,#FF9A4D,#F2552C 60%,#C93A1E)", venue: "Café counter · Benz Circle" },
  { icon: '<path d="M4 19V5M4 19h16"/><path d="M8 15l4-4 3 3 5-6"/>', k: "04 · REAL PROOF", t: "Real proof", d: "Play reports by screen and date, plus QR scans to count enquiries.", h: "Every play, counted.", s: "Play reports by screen and date, plus QR scans for enquiries.", foot: "Proof of play", bg: "linear-gradient(165deg,#2A3157,#12152B 70%)", venue: "Lift lobby · Gunadala" },
  { icon: '<path d="M4 20V10l5-4 5 4v10"/><path d="M14 20v-6h6v6"/><path d="M2 20h20"/>', k: "05 · START SMALL, GROW", t: "Start small, grow", d: "Begin with one lobby. Add areas as the results come in.", h: "One lobby to the whole city.", s: "Begin with one lobby. Add areas as the results come in.", foot: "From ₹99 a day", bg: "linear-gradient(165deg,#8F7BFF,#5B44E0 60%,#3F2BB5)", venue: "Lift lobby · Moghalrajpuram" },
  { icon: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>', k: "06 · FULL ATTENTION", t: "Full attention", d: "Eye-level screens where people wait. Nothing to scroll or skip.", h: "No scroll. No skip.", s: "Eye-level screens where people wait. Your ad plays in full.", foot: "10 seconds, full screen", bg: "linear-gradient(165deg,#FFC93D,#F5A700 55%,#D98E00)", venue: "Gym reception · Governorpet" },
];

function AdCopy({ ad }) {
  return (
    <>
      <span className="reasons-ad-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: ad.icon }} /></span>
      <small>{ad.k}</small>
      <strong>{ad.h}</strong>
      <span className="reasons-ad-description">{ad.s}</span>
      <b className="reasons-ad-tag">{ad.foot}</b>
    </>
  );
}

function AdScreen({ slide, prefersReducedMotion, onPreviousExit }) {
  const { index, previousIndex, sequence } = slide;
  const ad = reasons[index];
  const clock = new Date().toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });

  return (
    <div className="reasons-device" aria-label={`Adsrow advertising screen showing ${ad.t}`}>
      <div className="reasons-device-bezel">
        <div className="reasons-display" style={{ background: ad.bg, "--reasons-slide-duration": `${SLIDE_DURATION_MS}ms` }}>
          <span className="reasons-glow reasons-glow-one" aria-hidden="true" />
          <span className="reasons-glow reasons-glow-two" aria-hidden="true" />
          <div className="reasons-display-hud"><span className="reasons-live"><i />LIVE</span><span className="reasons-venue">{ad.venue}</span><time>{clock}</time></div>
          {previousIndex !== null && !prefersReducedMotion && (
            <div
              className="reasons-ad-copy reasons-ad-copy-exit"
              key={`exit-${sequence}-${previousIndex}`}
              onAnimationEnd={() => onPreviousExit(sequence)}
              aria-hidden="true"
            >
              <AdCopy ad={reasons[previousIndex]} />
            </div>
          )}
          <div className={`reasons-ad-copy reasons-ad-copy-enter${prefersReducedMotion ? " is-static" : ""}`} key={`enter-${sequence}-${index}`}>
            <AdCopy ad={ad} />
          </div>
          <div className="reasons-ad-footer"><span>Reason {index + 1} of 6</span><div className="reasons-ad-progress" aria-hidden="true"><i key={sequence} className={prefersReducedMotion ? "is-complete" : ""} /></div></div>
          <div className="reasons-glare" aria-hidden="true" />
        </div>
        <div className="reasons-device-chin"><b>adsrow.</b></div>
      </div>
      <span className="reasons-device-floor" aria-hidden="true" />
    </div>
  );
}

function ReasonCard({ reason, index, active, onSelect, side }) {
  return (
    <button type="button" className={`reasons-card reasons-card-${side}${active ? " is-active" : ""}`} aria-pressed={active} onClick={() => onSelect(index)}>
      <span className="reasons-card-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: reason.icon }} /></span>
      <span className="reasons-card-copy"><strong>{reason.t}</strong><span>{reason.d}</span></span>
      <span className="reasons-connector" aria-hidden="true" />
    </button>
  );
}

export default function HomeReasonsHub({ prefersReducedMotion }) {
  const [slide, setSlide] = useState({ index: 0, previousIndex: null, sequence: 0 });

  useEffect(() => {
    if (prefersReducedMotion) return undefined;
    const timer = window.setTimeout(() => {
      setSlide((current) => ({
        index: (current.index + 1) % reasons.length,
        previousIndex: current.index,
        sequence: current.sequence + 1,
      }));
    }, SLIDE_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [prefersReducedMotion, slide.sequence]);

  const selectReason = (index) => {
    setSlide((current) => ({ index, previousIndex: current.index, sequence: current.sequence + 1 }));
  };

  const finishPreviousAd = (sequence) => {
    setSlide((current) => current.sequence === sequence ? { ...current, previousIndex: null } : current);
  };

  return (
    <div className="home-reasons-hub">
      <div className="reasons-column reasons-column-left">
        {reasons.slice(0, 3).map((reason, index) => <ReasonCard key={reason.t} {...{ reason, index, onSelect: selectReason }} active={slide.index === index} side="left" />)}
      </div>
      <div className="reasons-screen-wrap"><AdScreen slide={slide} prefersReducedMotion={prefersReducedMotion} onPreviousExit={finishPreviousAd} /></div>
      <div className="reasons-column reasons-column-right">
        {reasons.slice(3).map((reason, offset) => {
          const index = offset + 3;
          return <ReasonCard key={reason.t} {...{ reason, index, onSelect: selectReason }} active={slide.index === index} side="right" />;
        })}
      </div>
    </div>
  );
}
