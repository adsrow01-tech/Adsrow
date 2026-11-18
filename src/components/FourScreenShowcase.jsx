import { useEffect, useMemo, useRef, useState } from "react";
import "../styles/four-screen-showcase.css";

const ads = {
  restaurant: { k: "RESTAURANT · NEAR YOU", h: "Breakfast combo ₹60", s: "7–10 AM, dine-in or delivery.", q: "Scan to order on WhatsApp", bg: "linear-gradient(165deg,#FF9A4D,#F2552C 60%,#C93A1E)", v: "Café · Benz Circle", slot: 0 },
  estate: { k: "REAL ESTATE", h: "2 & 3 BHK, ready to move", s: "30+ amenities. Book a site visit.", q: "Scan to book a visit", bg: "linear-gradient(165deg,#2C74E8,#0B3D91 65%,#082F70)", v: "Gym floor · Labbipet", slot: 1 },
  clinic: { k: "CLINIC", h: "Free dental check-up", s: "This Sunday, 10 AM to 2 PM.", q: "Scan to reserve a slot", bg: "linear-gradient(165deg,#22D3A6,#0FB98A 55%,#0B7F62)", v: "Lift lobby · Patamata", slot: 2 },
  yourAd: { k: "YOUR AD HERE", h: "Your business, seen daily", s: "This slot could be yours from ₹99 a day.", q: "Scan to book this slot", bg: "linear-gradient(165deg,#2A3157,#12152B 70%)", v: "Billing queue · Gunadala", slot: 3, you: true },
  supermarket: { k: "SUPERMARKET", h: "Weekend veggie sale, 15% off", s: "Fresh produce, Saturday and Sunday.", q: "Scan for the offer", bg: "linear-gradient(165deg,#3FBF6F,#1E9E50 60%,#137A3B)", v: "Billing queue · Gunadala", slot: 6 },
  fitness: { k: "FITNESS", h: "Join this month, save 20%", s: "Personal training slots open.", q: "Scan to claim the offer", bg: "linear-gradient(165deg,#8F7BFF,#5B44E0 60%,#3F2BB5)", v: "Gym floor · Labbipet", slot: 4 },
  coaching: { k: "COACHING", h: "Admissions open", s: "Classes 8 to 12. Free demo class.", q: "Scan to book a demo", bg: "linear-gradient(165deg,#FFC93D,#F5A700 55%,#D98E00)", v: "Lift lobby · Patamata", slot: 5 },
};

const screens = [
  { label: "Gyms", subtitle: "Reception and floor", venue: "Gym floor · Labbipet", className: "side", dur: 4500, ads: [ads.estate, ads.fitness, ads.clinic] },
  { label: "Lift lobbies", subtitle: "Apartments", venue: "Lift lobby · Patamata", className: "mid", dur: 4000, ads: [ads.clinic, ads.estate, ads.coaching] },
  { label: "Supermarkets", subtitle: "Billing queues", venue: "Billing queue · Gunadala", className: "mid", dur: 5000, ads: [ads.yourAd, ads.supermarket, ads.estate] },
  { label: "Cafés", subtitle: "Counters and tables", venue: "Café · Benz Circle", className: "side", dur: 5500, ads: [ads.restaurant, ads.yourAd, ads.supermarket] },
];

function useReducedMotion() {
  const [reduced, setReduced] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return reduced;
}

function drawQr(canvas, seed = 99) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const n = 21;
  const p = Math.floor(canvas.width / n);
  let randomSeed = seed * 7919 + 13;
  const random = () => {
    randomSeed = (randomSeed * 9301 + 49297) % 233280;
    return randomSeed / 233280;
  };
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#12152B";
  for (let yy = 0; yy < n; yy += 1) for (let xx = 0; xx < n; xx += 1) if (random() > 0.52) ctx.fillRect(xx * p, yy * p, p, p);
  [[0, 0], [n - 7, 0], [0, n - 7]].forEach(([x, y]) => {
    ctx.fillStyle = "#12152B"; ctx.fillRect(x * p, y * p, 7 * p, 7 * p);
    ctx.fillStyle = "#fff"; ctx.fillRect((x + 1) * p, (y + 1) * p, 5 * p, 5 * p);
    ctx.fillStyle = "#12152B"; ctx.fillRect((x + 2) * p, (y + 2) * p, 3 * p, 3 * p);
  });
}

function QrCanvas({ seed }) {
  const ref = useRef(null);
  useEffect(() => { drawQr(ref.current, seed); }, [seed]);
  return <canvas ref={ref} width="84" height="84" aria-label="QR code" />;
}

function LiveScreen({ screen }) {
  const reducedMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [now, setNow] = useState(() => new Date());
  const ad = screen.ads[index % screen.ads.length];
  const clock = useMemo(() => {
    const hours = now.getHours();
    const minutes = now.getMinutes();
    return ((hours % 12) || 12) + ":" + (minutes < 10 ? "0" : "") + minutes + (hours < 12 ? " AM" : " PM");
  }, [now]);

  useEffect(() => {
    if (reducedMotion) return undefined;
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % screen.ads.length), screen.dur);
    return () => window.clearInterval(timer);
  }, [reducedMotion, screen.ads.length, screen.dur]);
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className={"lv " + screen.className} style={{ "--dur": (screen.dur / 1000) + "s" }}>
      <div className="lv-scr">
        <div className="lv-face" style={{ background: ad.bg }}>
          <span className="lv-blob b1" /><span className="lv-blob b2" />
          <div className="lv-hud">
            <span className="lv-live"><i />LIVE</span>
            <span className="lv-venue">{screen.venue}</span>
            <span className="lv-clock">{clock}</span>
          </div>
          <div className={"lv-body" + (reducedMotion ? "" : " lv-in")} key={index}>
            <small>{ad.k}</small>
            <strong>{ad.h}</strong>
            <span>{ad.s}</span>
            <div className="lv-qr"><QrCanvas seed={index + 3} />{ad.q}</div>
          </div>
          <div className="lv-foot">
            <div className="lv-row"><span>{ad.you ? "Your slot · " : "Slot "}{ad.slot + 1} of 12</span></div>
            <div className="lv-prog"><i key={index} className={reducedMotion ? "" : "run"} /></div>
          </div>
          <div className="lv-glare" />
        </div>
        <div className="lv-chin"><b>adsrow.</b><QrCanvas seed={99} /></div>
      </div>
      <div className="lv-floor" />
    </div>
  );
}

export default function FourScreenShowcase() {
  return (
    <div className="quad">
      {screens.map((screen) => (
        <div className={"col " + screen.className} key={screen.label}>
          <LiveScreen screen={screen} />
          <p>{screen.label}</p>
          <span>{screen.subtitle}</span>
        </div>
      ))}
    </div>
  );
}
