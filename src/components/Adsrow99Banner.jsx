import { useEffect, useRef, useState } from "react";
import { campaignScreenPricing as pricing } from "../lib/siteContent";

const screenOptions = [2, 4, 6, 8, 10];
const formatRupees = (amount) => `₹${amount.toLocaleString("en-IN")}`;

function useAnimatedCalculatorValues(targetValues) {
  const [displayedValues, setDisplayedValues] = useState(targetValues);
  const displayedValuesRef = useRef(targetValues);

  useEffect(() => {
    const startValues = displayedValuesRef.current;
    const keys = ["dailyPrice", "monthlyPrice", "estimatedPlays", "estimatedAudience"];
    const unchanged = keys.every((key) => startValues[key] === targetValues[key]);
    if (unchanged) return undefined;

    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finishAtTarget = () => {
      displayedValuesRef.current = targetValues;
      setDisplayedValues(targetValues);
    };

    if (motionPreference.matches) {
      finishAtTarget();
      return undefined;
    }

    let animationFrame = null;
    let animationStart = null;
    const duration = 800;

    const animate = (timestamp) => {
      if (animationStart === null) animationStart = timestamp;
      const progress = Math.min((timestamp - animationStart) / duration, 1);
      const easedProgress = 1 - (1 - progress) ** 3;
      const nextValues = Object.fromEntries(keys.map((key) => [
        key,
        Math.round(startValues[key] + (targetValues[key] - startValues[key]) * easedProgress),
      ]));

      displayedValuesRef.current = nextValues;
      setDisplayedValues(nextValues);

      if (progress < 1) animationFrame = requestAnimationFrame(animate);
      else animationFrame = null;
    };

    const handleMotionPreferenceChange = (event) => {
      if (!event.matches) return;
      if (animationFrame !== null) cancelAnimationFrame(animationFrame);
      animationFrame = null;
      finishAtTarget();
    };

    motionPreference.addEventListener?.("change", handleMotionPreferenceChange);
    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame !== null) cancelAnimationFrame(animationFrame);
      motionPreference.removeEventListener?.("change", handleMotionPreferenceChange);
    };
  }, [targetValues.dailyPrice, targetValues.monthlyPrice, targetValues.estimatedPlays, targetValues.estimatedAudience]);

  return displayedValues;
}

export default function Adsrow99Banner() {
  const [screens, setScreens] = useState(2);
  const dailyPrice = pricing[screens];
  const monthlyPrice = dailyPrice * 30;
  const estimatedPlays = screens * 480;
  const estimatedAudience = Math.round((screens * 325) / 50) * 50;
  const displayedValues = useAnimatedCalculatorValues({ dailyPrice, monthlyPrice, estimatedPlays, estimatedAudience });
  const enquiryMessage = [
    "Hi Adsrow Team!",
    "",
    "I'm interested in advertising with Adsrow.",
    "",
    "Here are my selected plan details:",
    "",
    `• Number of screens: ${screens}`,
    `• Daily price: ${formatRupees(dailyPrice)}`,
    `• 30-day campaign cost: ${formatRupees(monthlyPrice)}`,
    `• Estimated daily plays: ~${estimatedPlays.toLocaleString("en-IN")}`,
    "",
    "I'd like to know more about this plan.",
    "",
    "Please help me with the following:",
    "",
    "1. What locations are available near my business?",
    "2. How can I get my advertisement displayed?",
    "3. What is the campaign activation process?",
    "4. What details do you need from me to get started?",
    "",
    "My business details:",
    "",
    "• Business name:",
    "• Business category:",
    "• Business location:",
    "• Preferred campaign start date:",
    "",
    "Please guide me through the next steps.",
    "",
    "Thank you!",
  ].join("\n");
  const whatsappHref = `https://wa.me/918374622055?text=${encodeURIComponent(enquiryMessage)}`;

  return (
    <section className="ar99-calc" aria-labelledby="ar99-calc-title">
      <div className="ar99-calc-wrap">
        <div className="ar99-calc-copy">
          <p className="ar99-calc-eyebrow">Big reach. Small budget.</p>
          <h2 id="ar99-calc-title">
            Start at ₹99 a day. <span>Grow when it works.</span>
          </h2>
          <p className="ar99-calc-description">
            Pick how many screens near your business you want. See your daily price, plays and reach instantly. Free ad design on your first campaign.
          </p>
        </div>

        <div className="ar99-calc-card">
          <div className="ar99-calc-slider-heading">
            <label htmlFor="ar99-calc-screens">Screens near your business</label>
            <output htmlFor="ar99-calc-screens" aria-live="polite">{screens}</output>
          </div>
          <input
            id="ar99-calc-screens"
            className="ar99-calc-range"
            type="range"
            min="2"
            max="10"
            step="2"
            value={screens}
            onChange={(event) => setScreens(Number(event.target.value))}
            aria-valuetext={`${screens} screens`}
          />
          <div className="ar99-calc-ticks" aria-hidden="true">
            {screenOptions.map((count) => <span key={count}>{count}</span>)}
          </div>

          <div className="ar99-calc-results" aria-live="polite" aria-atomic="true">
            <div className="ar99-calc-result ar99-calc-result-price">
              <b>{formatRupees(displayedValues.dailyPrice)}</b>
              <span>per day</span>
            </div>
            <div className="ar99-calc-result">
              <b>~{displayedValues.estimatedPlays.toLocaleString("en-IN")}</b>
              <span>plays a day</span>
            </div>
            <div className="ar99-calc-result">
              <b>~{displayedValues.estimatedAudience.toLocaleString("en-IN")}</b>
              <span>people a day</span>
            </div>
          </div>

          <p className="ar99-calc-monthly">
            30-day campaign: <b>{formatRupees(displayedValues.monthlyPrice)}</b>
          </p>
          <a className="ar99-calc-cta" href={whatsappHref} target="_blank" rel="noopener noreferrer">
            Book this plan <span aria-hidden="true">↗</span>
          </a>
          <p className="ar99-calc-disclaimer">
            Billed monthly · GST extra · Plays and reach are estimates
          </p>
        </div>
      </div>
    </section>
  );
}
