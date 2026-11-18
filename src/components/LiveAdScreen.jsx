import { useEffect, useRef, useState } from "react";
import "../styles/live-ad-screen.css";

// Advertisement content and visual treatment adapted from Option 1 in the supplied HTML reference.
export const ADSROW_ADS = [
  { k: "RESTAURANT · NEAR YOU", h: "Breakfast combo ₹60", s: "7–10 AM, dine-in or delivery.", q: "Scan to order on WhatsApp", bg: "linear-gradient(165deg,#FF9A4D,#F2552C 60%,#C93A1E)", v: "Lift lobby · Patamata", slot: 0 },
  { k: "REAL ESTATE", h: "2 & 3 BHK, ready to move", s: "30+ amenities. Book a site visit.", q: "Scan to book a visit", bg: "linear-gradient(165deg,#2C74E8,#0B3D91 65%,#082F70)", v: "Lift lobby · Benz Circle", slot: 1 },
  { k: "CLINIC", h: "Free dental check-up", s: "This Sunday, 10 AM to 2 PM.", q: "Scan to reserve a slot", bg: "linear-gradient(165deg,#22D3A6,#0FB98A 55%,#0B7F62)", v: "Gym reception · Labbipet", slot: 2 },
  { k: "YOUR AD HERE", h: "Your business, seen daily", s: "This slot could be yours from ₹99 a day.", q: "Scan to book this slot", bg: "linear-gradient(165deg,#2A3157,#12152B 70%)", v: "Café counter · Governorpet", slot: 3, you: true },
  { k: "SUPERMARKET", h: "Weekend veggie sale, 15% off", s: "Fresh produce, Saturday and Sunday.", q: "Scan for the offer", bg: "linear-gradient(165deg,#3FBF6F,#1E9E50 60%,#137A3B)", v: "Billing queue · Gunadala", slot: 6 },
  { k: "FITNESS", h: "Join this month, save 20%", s: "Personal training slots open.", q: "Scan to claim the offer", bg: "linear-gradient(165deg,#8F7BFF,#5B44E0 60%,#3F2BB5)", v: "Gym floor · Patamata", slot: 4 },
  { k: "COACHING", h: "Admissions open", s: "Classes 8 to 12. Free demo class.", q: "Scan to book a demo", bg: "linear-gradient(165deg,#FFC93D,#F5A700 55%,#D98E00)", v: "Lift lobby · Gunadala", slot: 5 },
];

const screens = [
  { id: "gym", start: 2, venue: "Gym floor · Labbipet", label: "Gyms", subtitle: "Reception and floor", size: "side", duration: 4500 },
  { id: "lift", start: 2, venue: "Lift lobby · Patamata", label: "Lift lobbies", subtitle: "Apartments", size: "mid", duration: 4000 },
  { id: "supermarket", start: 6, venue: "Billing queue · Gunadala", label: "Supermarkets", subtitle: "Billing queues", size: "mid", duration: 5000 },
  { id: "cafe", start: 1, venue: "Café · Benz Circle", label: "Cafés", subtitle: "Counters and tables", size: "side", duration: 5500 },
];

function drawQr(canvas, seed) {
  const context = canvas?.getContext("2d");
  if (!context) return;
  const count = 21;
  const pixel = Math.floor(canvas.width / count);
  let randomSeed = seed * 7919 + 13;
  const random = () => {
    randomSeed = (randomSeed * 9301 + 49297) % 233280;
    return randomSeed / 233280;
  };
  context.fillStyle = "#fff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#12152B";
  for (let y = 0; y < count; y += 1) {
    for (let x = 0; x < count; x += 1) {
      if (random() > 0.52) context.fillRect(x * pixel, y * pixel, pixel, pixel);
    }
  }
  [[0, 0], [count - 7, 0], [0, count - 7]].forEach(([x, y]) => {
    context.fillStyle = "#12152B";
    context.fillRect(x * pixel, y * pixel, 7 * pixel, 7 * pixel);
    context.fillStyle = "#fff";
    context.fillRect((x + 1) * pixel, (y + 1) * pixel, 5 * pixel, 5 * pixel);
    context.fillStyle = "#12152B";
    context.fillRect((x + 2) * pixel, (y + 2) * pixel, 3 * pixel, 3 * pixel);
  });
}

function QrCanvas({ seed, size = 84 }) {
  const canvasRef = useRef(null);
  useEffect(() => drawQr(canvasRef.current, seed), [seed]);
  return <canvas ref={canvasRef} width={size} height={size} aria-label="Illustrative QR code" />;
}

function LiveAdScreen({ screen, reducedMotion }) {
  const [index, setIndex] = useState(screen.start);
  const [clock, setClock] = useState(() => new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }));
  const ad = ADSROW_ADS[index];

  useEffect(() => {
    if (reducedMotion) return undefined;
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % ADSROW_ADS.length), screen.duration);
    return () => window.clearInterval(timer);
  }, [reducedMotion, screen.duration]);

  useEffect(() => {
    const timer = window.setInterval(() => setClock(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })), 30000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className={`col ${screen.size}`}>
      <div className={`lv${screen.size === "side" ? " sm" : ""}`} style={{ "--dur": `${screen.duration / 1000}s` }}>
        <div className="lv-scr">
          <div className="lv-face" style={{ background: ad.bg }}>
            <span className="lv-blob b1" />
            <span className="lv-blob b2" />
            <div className="lv-hud">
              <span className="lv-live"><i />LIVE</span>
              <span className="lv-venue">{screen.venue}</span>
              <span className="lv-clock">{clock}</span>
            </div>
            <div className={`lv-body${reducedMotion ? "" : " lv-in"}`} key={`${screen.id}-${index}`}>
              <small>{ad.k}</small>
              <strong>{ad.h}</strong>
              <span>{ad.s}</span>
              <div className="lv-qr"><QrCanvas seed={index + 3} />{ad.q}</div>
            </div>
            <div className="lv-foot">
              <div className="lv-row"><span>{ad.you ? `Your slot · ${ad.slot + 1} of 12` : `Slot ${ad.slot + 1} of 12`}</span></div>
              <div className="lv-prog"><i key={`${screen.id}-progress-${index}`} className={reducedMotion ? "" : "run"} /></div>
            </div>
            <div className="lv-glare" />
          </div>
          <div className="lv-chin"><b>adsrow.</b><QrCanvas seed={99} size={63} /></div>
        </div>
        <div className="lv-floor" />
      </div>
      <p>{screen.label}</p>
      <span>{screen.subtitle}</span>
    </div>
  );
}

export default function LiveAdScreens({ reducedMotion }) {
  return <div className="home-signage-frame" role="group" aria-label="Advertising screens at gyms, lift lobbies, supermarkets and cafés"><div className="quad">{screens.map((screen) => <LiveAdScreen key={screen.id} screen={screen} reducedMotion={reducedMotion} />)}</div></div>;
}
