import { useEffect, useRef, useState } from "react";

export default function Adsrow99Banner() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const bannerRef = useRef(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);

    const handleChange = (e) => {
      setReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  useEffect(() => {
    if (reducedMotion || !bannerRef.current) return;

    const markers = {
      tag: bannerRef.current.querySelector(".ar99-tag i"),
      live: bannerRef.current.querySelectorAll(".ar99-live i"),
    };

    if (markers.tag) {
      markers.tag.style.animation = "none";
      setTimeout(() => {
        if (bannerRef.current) {
          markers.tag.style.animation = "ar99-pulse 1.8s infinite";
        }
      }, 0);
    }

    const slides = bannerRef.current.querySelectorAll(".ar99-slide");
    slides.forEach((slide, index) => {
      slide.style.animation = "none";
      slide.style.opacity = "0";
      if (index === 0) {
        slide.style.opacity = "1";
      }
      setTimeout(() => {
        if (bannerRef.current) {
          slide.style.animation = `ar99-cycle 9s infinite`;
          slide.style.animationDelay = `${index * 3}s`;
        }
      }, 0);
    });

    const progress = bannerRef.current.querySelector(".ar99-progress");
    if (progress) {
      progress.style.animation = "none";
      setTimeout(() => {
        if (bannerRef.current) {
          progress.style.animation = "ar99-bar 3s linear infinite";
        }
      }, 0);
    }

    const marquee = bannerRef.current.querySelector(".ar99-track");
    if (marquee) {
      marquee.style.animation = "none";
      setTimeout(() => {
        if (bannerRef.current) {
          marquee.style.animation = "ar99-marquee 28s linear infinite";
        }
      }, 0);
    }

    const liveIndicators = bannerRef.current.querySelectorAll(".ar99-live i");
    liveIndicators.forEach((indicator) => {
      indicator.style.animation = "none";
      setTimeout(() => {
        if (bannerRef.current) {
          indicator.style.animation = "ar99-pulse-red 1.4s infinite";
        }
      }, 0);
    });
  }, [reducedMotion]);

  return (
    <section className="ar99" aria-labelledby="ar99-title" ref={bannerRef}>
      <div className="ar99-wrap">
        <div>
          <span className="ar99-tag">
            <i></i>Big reach. Small budget.
          </span>
          <h2 id="ar99-title" className="ar99-title">
            Advertise on Adsrow screens from just
          </h2>

          <div className="ar99-price" aria-label="Starting from 99 rupees per day">
            <span className="ar99-num">
              <sup>₹</sup>99
            </span>
            <span className="ar99-per">/day<small>Less than a cup of coffee</small></span>
          </div>

          <p className="ar99-sub">
            Your ad plays <b>about 960 times a day</b> in the places your customers wait: lift lobbies, cafés, gyms, malls and offices.
          </p>

          <div className="ar99-chips">
            <span className="ar99-chip">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7FE7D6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>10-second ad
            </span>
            <span className="ar99-chip">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7FE7D6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9"/>
                <polyline points="12 7 12 12 15 14"/>
              </svg>Plays every 2 minutes
            </span>
            <span className="ar99-chip">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7FE7D6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 11l3 3L22 4"/>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
              </svg>Proof-of-play report
            </span>
            <span className="ar99-chip">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7FE7D6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9"/>
                <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>
              </svg>Free ad design help
            </span>
          </div>

          <div className="ar99-ctas">
            <a className="ar99-btn p" href="/contact">Start at ₹99/day
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </a>
            <a className="ar99-btn s" href="https://wa.me/918374622055?text=Hi%20Adsrow%2C%20I%27m%20interested%20in%20the%20%E2%82%B999%2Fday%20plan.">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              WhatsApp us
            </a>
          </div>
          <p className="ar99-fine">₹99/day = ₹2,970 for 30 days: one 10-second slot on 2 screens, billed monthly. GST extra.</p>
        </div>

        <div className="ar99-visual" aria-hidden="true">
          <div className="ar99-badge">
            <span>Only</span><b>₹99</b><span>a day</span>
          </div>
          <div className="ar99-screen">
            <div className="ar99-display">
              <span className="ar99-live">
                <i></i>LIVE
              </span>
              <div className="ar99-slide">
                <small>Your clinic</small>
                <strong>Free health check this Sunday</strong>
                <em>Scan to book →</em>
              </div>
              <div className="ar99-slide">
                <small>Your restaurant</small>
                <strong>20% off dinner tonight</strong>
                <em>Order now →</em>
              </div>
              <div className="ar99-slide">
                <small>Your brand</small>
                <strong>Your ad here, from ₹99/day</strong>
                <em>Start today →</em>
              </div>
              <div className="ar99-progress"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="ar99-strip" aria-hidden="true">
        <div className="ar99-track">
          <span>Apartment lift lobbies</span>
          <span>Cafés &amp; restaurants</span>
          <span>Gyms</span>
          <span>Shopping malls</span>
          <span>Supermarkets</span>
          <span>Offices &amp; commercial spaces</span>
          <span>Apartment lift lobbies</span>
          <span>Cafés &amp; restaurants</span>
          <span>Gyms</span>
          <span>Shopping malls</span>
          <span>Supermarkets</span>
          <span>Offices &amp; commercial spaces</span>
        </div>
      </div>
    </section>
  );
}

// Custom hook for reduced motion detection
function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);

    const handleChange = (e) => {
      setReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return reducedMotion;
}
