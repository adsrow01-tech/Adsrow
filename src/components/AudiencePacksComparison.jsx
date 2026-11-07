import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowUpRight, Check } from "lucide-react";
import PackageEnquirySection from "./PackageEnquirySection";
import {
  audiencePacks,
  campaignScreenPricing,
  cityPack,
  packageAudienceFilters,
  packageCommitments,
  packageInclusions,
  packagePriceNote,
  tryItAudience,
} from "../lib/packageData";
import "../styles/audience-packs.css";

function indianPrice(value) {
  return value.toLocaleString("en-IN");
}

function currentPrices(dailyPrice, discount, months) {
  const daily = Math.round(dailyPrice * (1 - discount));
  const monthly = daily * 30;
  return { daily, monthly, total: monthly * months };
}

function PartnerEnquiryLink({ pack, months, dailyPrice, children, className = "arap-btn", style }) {
  const params = new URLSearchParams({ pack, term: String(months), dailyPrice: String(dailyPrice) });
  if (pack === "try-it") params.set("screens", "2");
  return <Link className={className} style={style} to={`/partner-form?${params.toString()}`}>{children}</Link>;
}

function useAnimatedPrices(basePrice, months, discount) {
  const initialPrices = currentPrices(basePrice, discount, months);
  const [displayedPrices, setDisplayedPrices] = useState(initialPrices);
  const displayedPricesRef = useRef(initialPrices);

  useEffect(() => {
    const targetPrices = currentPrices(basePrice, discount, months);
    const startPrices = displayedPricesRef.current;
    const keys = ["daily", "monthly", "total"];
    const unchanged = keys.every((key) => startPrices[key] === targetPrices[key]);
    if (unchanged) return undefined;

    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finishAtTarget = () => {
      displayedPricesRef.current = targetPrices;
      setDisplayedPrices(targetPrices);
    };

    if (motionPreference.matches) {
      finishAtTarget();
      return undefined;
    }

    let animationFrame = null;
    let animationStart = null;
    const duration = 900;

    const animate = (timestamp) => {
      if (animationStart === null) animationStart = timestamp;
      const progress = Math.min((timestamp - animationStart) / duration, 1);
      const easedProgress = 1 - (1 - progress) ** 3;
      const nextPrices = Object.fromEntries(keys.map((key) => [
        key,
        Math.round(startPrices[key] + (targetPrices[key] - startPrices[key]) * easedProgress),
      ]));

      displayedPricesRef.current = nextPrices;
      setDisplayedPrices(nextPrices);

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
  }, [basePrice, months, discount]);

  return displayedPrices;
}

function PriceBlock({ basePrice, months, discount }) {
  const { daily, monthly, total } = useAnimatedPrices(basePrice, months, discount);
  return (
    <>
      <div className="arap-price"><b>₹{indianPrice(daily)}</b><small>/day</small></div>
      {months === 1 ? (
        <div className="arap-bill">₹{indianPrice(monthly)} for 30 days</div>
      ) : (
        <div className="arap-bill">
          <s>₹{indianPrice(basePrice)}</s> · ₹{indianPrice(monthly)}/month for {months} months (₹{indianPrice(total)} total)
        </div>
      )}
    </>
  );
}

function MatchLabel() {
  return <span className="arap-match">Best match for you</span>;
}

function PackageComparisonTable() {
  const tryDaily = campaignScreenPricing[2];
  const columns = [
    { id: "try-it", name: "Try It", daily: tryDaily, audience: tryItAudience, where: "2 locations near you", bestFor: "First-time advertisers" },
    ...audiencePacks,
    cityPack,
  ];
  const rows = [
    { label: "Price (1 month)", value: (pack) => `₹${indianPrice(pack.dailyPrice ?? pack.daily)}/day` },
    { label: "30-day total", value: (pack) => `₹${indianPrice((pack.dailyPrice ?? pack.daily) * 30)}` },
    { label: "People reached a day", value: (pack) => pack.audience },
    { label: "Where it plays", value: (pack) => pack.where },
    { label: "Best for", value: (pack) => pack.bestFor },
    { label: "3 / 6-month savings", value: (pack) => pack.id === "try-it" ? "—" : "10% / 15%" },
    { label: "Proof of play + QR tracking", value: () => "✓" },
  ];

  return (
    <section className="pk-compare" id="compare" aria-labelledby="pk-compare-title">
      <div className="pk-wrap">
        <div className="pk-eyebrow">Compare packs</div>
        <h2 className="pk-section-title" id="pk-compare-title">Every pack, <span>side by side.</span></h2>
        <div className="pk-table-wrap" tabIndex={0} aria-label="Scrollable package comparison table">
          <table>
            <thead><tr><th aria-label="Package feature" />{columns.map((pack) => <th className={pack.id === "city" ? "city" : ""} key={pack.id}>{pack.name}</th>)}</tr></thead>
            <tbody>{rows.map((row) => (
              <tr key={row.label}>
                <td>{row.label}</td>
                {columns.map((pack) => {
                  const highlight = pack.id === "city";
                  const isCheck = row.label === "Proof of play + QR tracking";
                  return <td key={pack.id} className={`${highlight ? "c " : ""}${(isCheck || row.label === "3 / 6-month savings") && pack.id !== "try-it" ? "ok" : ""}`.trim()}>{row.value(pack)}</td>;
                })}
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

const bookingSteps = [
  { title: "Choose your pack", description: 'Tap a pack above. Not sure? Use "I run a…" or WhatsApp us.' },
  { title: "Get your plan", description: "We confirm the exact venues, schedule and final price, usually within a day." },
  { title: "Go live and track", description: "Send your ad or let us design it. Get proof of play and QR scan reports." },
];

const packageFaqs = [
  { question: "Is the price per day or per month?", answer: "Prices are shown per day so they're easy to compare, and billed monthly in advance. GST is extra." },
  { question: "Who can use the ₹99 Try It plan?", answer: "Try It is for your first campaign only: 30 days on the two locations nearest your business. After that, move to any pack." },
  { question: "How do the 3- and 6-month savings work?", answer: "Commit for 3 months and save 10%, or 6 months and save 15%. You still pay month by month." },
  { question: "Can I change my ad during the campaign?", answer: "Yes. We update ads remotely, usually the same day, at no extra cost." },
  { question: "Will my competitor appear on the same screens?", answer: "Add a category lock and no direct competitor will run on your screens during your campaign." },
];

function BookingSteps() {
  return (
    <section className="pk-steps" aria-labelledby="pk-steps-title">
      <div className="pk-wrap">
        <div className="pk-eyebrow">How booking works</div>
        <h2 className="pk-section-title" id="pk-steps-title">Pick a pack today. <span>Go live this week.</span></h2>
        <div className="pk-step-grid">
          {bookingSteps.map((step, index) => (
            <article key={step.title}>
              <i aria-hidden="true">{index + 1}</i>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function PackageFaqs() {
  return (
    <section className="pk-faq" aria-labelledby="pk-faq-title">
      <div className="pk-wrap pk-faq-grid">
        <div><div className="pk-eyebrow">Pricing questions</div><h2 className="pk-section-title" id="pk-faq-title">Good to know <span>before you book.</span></h2></div>
        <div>{packageFaqs.map((faq) => <details key={faq.question}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}</div>
      </div>
    </section>
  );
}

function PackageFinalCta() {
  return (
    <section className="pk-final-cta">
      <div className="pk-wrap">
        <div className="pk-final-box">
          <div><h2>Not sure which pack fits your business?</h2><p>Tell us what you sell and where. We'll recommend a pack and send a clear price.</p></div>
          <div className="pk-final-actions">
            <Link className="pk-btn mint" to="/partner-form?type=advertiser">Get My Free Plan <ArrowUpRight size={16} aria-hidden="true" /></Link>
            <PackageEnquirySection className="pk-btn outline" name="pack recommendation" dailyPrice={campaignScreenPricing[2]} months={1}>WhatsApp Us</PackageEnquirySection>
          </div>
        </div>
      </div>
    </section>
  );
}

function AudiencePackCard({ pack, months, discount, highlighted, cardRef }) {
  const { daily } = currentPrices(pack.dailyPrice, discount, months);
  return (
    <article ref={cardRef} id={pack.id} className={`arap-card${highlighted ? " hl" : ""}`} data-pack={pack.key}>
      <MatchLabel />
      <div className="ic" aria-hidden="true">{pack.icon}</div>
      <div className="arap-name">{pack.name}</div>
      <div className="arap-who">{pack.who}</div>
      <div className="arap-reach"><b>{pack.audience}</b> {pack.audienceDescription}</div>
      <PriceBlock basePrice={pack.dailyPrice} months={months} discount={discount} />
      <div className="arap-fit">
        <h4>Great for</h4>
        <div className="arap-tags">
          {pack.greatFor.map((tag) => <span key={tag}>{tag}</span>)}
        </div>
        {pack.note && <div className="arap-not">{pack.note}</div>}
      </div>
      <details>
        <summary>What's inside</summary>
        <ul>{pack.details.map((detail) => <li key={detail}>{detail}</li>)}</ul>
      </details>
      <PartnerEnquiryLink
        className="arap-btn"
        pack={pack.id}
        dailyPrice={daily}
        months={months}
      >
        Choose {pack.id === "dine-out" ? "Dine-Out" : pack.id === "fitness" ? "Fitness" : "Neighbourhood"}
      </PartnerEnquiryLink>
    </article>
  );
}

function CityPackCard({ months, discount, highlighted, cardRef }) {
  const { daily } = currentPrices(cityPack.dailyPrice, discount, months);
  return (
    <article ref={cardRef} id="city" className={`arap-city${highlighted ? " hl" : ""}`} data-pack="city">
      <MatchLabel />
      <div>
        <span className="badge">{cityPack.badge}</span>
        <div className="arap-name">{cityPack.name}</div>
        <div className="arap-who">{cityPack.who}</div>
        <div className="arap-reach"><b>{cityPack.audience}</b> {cityPack.audienceDescription}</div>
      </div>
      <div className="arap-fit">
        <h4>Great for</h4>
        <div className="arap-tags">
          {cityPack.greatFor.map((tag) => <span key={tag}>{tag}</span>)}
        </div>
      </div>
      <div>
        <PriceBlock basePrice={cityPack.dailyPrice} months={months} discount={discount} />
        <PartnerEnquiryLink
          className="arap-btn"
          style={{ marginTop: 14 }}
          pack={cityPack.id}
          dailyPrice={daily}
          months={months}
        >
          Talk to Us <ArrowUpRight size={16} />
        </PartnerEnquiryLink>
      </div>
    </article>
  );
}

export default function AudiencePacksComparison() {
  const location = useLocation();
  const navigate = useNavigate();
  const initialParams = new URLSearchParams(location.search);
  const initialTerm = Number(initialParams.get("term"));
  const [months, setMonths] = useState(() => packageCommitments.some((term) => term.months === initialTerm) ? initialTerm : 1);
  const [selectedBusiness, setSelectedBusiness] = useState(() =>
    packageAudienceFilters.find((fit) => fit.slug === initialParams.get("for")) ?? null
  );
  const cardRefs = useRef({});
  const discount = packageCommitments.find((term) => term.months === months)?.discount ?? 0;

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const requestedTerm = Number(params.get("term"));
    setMonths(packageCommitments.some((term) => term.months === requestedTerm) ? requestedTerm : 1);
    setSelectedBusiness(packageAudienceFilters.find((fit) => fit.slug === params.get("for")) ?? null);
  }, [location.search]);

  useEffect(() => {
    if (!location.hash) return;
    const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (!target) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
  }, [location.hash]);

  useEffect(() => {
    if (!selectedBusiness || location.hash) return;
    const card = cardRefs.current[selectedBusiness.pack];
    if (!card) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    card.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "nearest" });
  }, [selectedBusiness, location.hash]);

  function updateQuery(key, value, keepHash = true) {
    const params = new URLSearchParams(location.search);
    if (value) params.set(key, value);
    else params.delete(key);
    const search = params.toString();
    navigate({ pathname: location.pathname, search: search ? `?${search}` : "", hash: keepHash ? location.hash : "" }, { replace: true });
  }

  function selectDuration(term) {
    setMonths(term);
    updateQuery("term", String(term));
  }

  function selectBusiness(fit) {
    const nextFit = selectedBusiness?.slug === fit.slug ? null : fit;
    setSelectedBusiness(nextFit);
    updateQuery("for", nextFit?.slug ?? "", false);
  }

  const tryItDailyPrice = campaignScreenPricing[2];
  const tryItMonthlyPrice = tryItDailyPrice * 30;
  const selectedPack = selectedBusiness
    ? [...audiencePacks, cityPack].find((pack) => pack.fit.includes(selectedBusiness.pack))
    : null;

  return (
    <main className="package-page">
      <section className="arap" id="packages" aria-labelledby="arap-title">
      <div className="arap-wrap">
        <div className="arap-head">
          <div className="arap-eyebrow">Audience packs</div>
          <h2 id="arap-title" className="arap-title">Choose who you want to reach. <span>We'll put you in front of them.</span></h2>
          <p className="arap-sub">Every pack targets a different crowd in a different mindset. Commit for longer and pay less every day.</p>
        </div>

        <div className="arap-controls">
          <div className="arap-pick" role="group" aria-label="Find the right pack for your business">
            <span>I run a…</span>
            {packageAudienceFilters.map((fit) => (
              <button
                key={fit.slug}
                type="button"
                aria-pressed={selectedBusiness?.slug === fit.slug}
                onClick={() => selectBusiness(fit)}
              >
                {fit.label}
              </button>
            ))}
          </div>
          <div className="arap-term" role="group" aria-label="Commitment length">
            {packageCommitments.map((term) => (
              <button
                key={term.months}
                type="button"
                aria-pressed={months === term.months}
                onClick={() => selectDuration(term.months)}
              >
                {term.label} {term.save && <em>{term.save}</em>}
              </button>
            ))}
          </div>
        </div>

        <div className="arap-try" id="try-it">
          <span className="tag">New advertisers</span>
          <div>
            <h2>Try It: your first campaign for ₹99 a day</h2>
            <p>About {tryItAudience.replace("~", "")} people a day at the two locations nearest your business. First campaign only, 30 days.</p>
          </div>
          <div className="pr">
            <div>
              <b>₹{indianPrice(tryItDailyPrice)}</b><small>/day</small>
              <div className="arap-try-total">₹{indianPrice(tryItMonthlyPrice)} for 30 days</div>
            </div>
            <PartnerEnquiryLink className="arap-btn" pack="try-it" dailyPrice={tryItDailyPrice} months={1} style={{ background: "var(--ink)", borderColor: "var(--ink)", color: "#fff", margin: 0 }}>
              Try It Now
            </PartnerEnquiryLink>
          </div>
        </div>

        <div className="arap-grid">
          {audiencePacks.map((pack) => (
            <AudiencePackCard
              key={pack.id}
              pack={pack}
              months={months}
              discount={discount}
              highlighted={Boolean(selectedBusiness && pack.fit.includes(selectedBusiness.pack))}
              cardRef={(node) => { cardRefs.current[pack.key] = node; }}
            />
          ))}
        </div>

      <CityPackCard months={months} discount={discount} highlighted={selectedBusiness?.pack === "city"} cardRef={(node) => { cardRefs.current.city = node; }} />

        <div className="arap-inc">
          <h2>Included in every pack</h2>
          {packageInclusions.map((inclusion) => (
            <span key={inclusion}><Check size={15} aria-hidden="true" />{inclusion}</span>
          ))}
        </div>

        <div className="arap-foot">
          <div className="arap-foot-copy">
            <p className="arap-fine">Prices are per day, billed monthly in advance, GST extra. Minimum 30 days. Savings apply when you commit for 3 or 6 months. Try It is for first campaigns only. Add-ons: category lock (no competitor on your screens), double frequency, video production. Audience figures are estimates based on typical daily footfall.</p>
            <p className="arap-confirmation-note">{packagePriceNote}</p>
          </div>
          <PackageEnquirySection className="arap-help" name={selectedPack?.name ?? "audience pack guidance"} dailyPrice={selectedPack?.dailyPrice ?? tryItDailyPrice} months={months} audience={selectedPack?.audience}>
            Not sure? WhatsApp us →
          </PackageEnquirySection>
        </div>
      </div>
      </section>
      <PackageComparisonTable />
      <BookingSteps />
      <PackageFaqs />
      <PackageFinalCta />
    </main>
  );
}
