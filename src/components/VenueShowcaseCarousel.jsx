import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import {
  Building2Icon as Building2,
  CoffeeIcon as Coffee,
  DumbbellIcon as Dumbbell,
  HeartPulseIcon as HeartPulse,
  ShoppingBagIcon as ShoppingBag,
  ShoppingBasketIcon as ShoppingBasket,
  BriefcaseIcon as Briefcase,
} from "@animateicons/react/lucide";

const venues = [
{
image: "/venues/hospital-display.png",
icon: HeartPulse,
title: "Hospitals",
description: "Reach patients, visitors and healthcare professionals.",
alt: "Adsrow digital advertising screen in a hospital reception",
position: "50% 40%",
},
{
image: "/venues/lobby-display.png",
icon: Briefcase,
title: "Offices",
description: "Connect with professionals in modern workplace environments.",
alt: "Adsrow advertising screen in a wooden office lobby",
position: "50% 42%",
},
{
image: "/venues/residential-lobby.png",
icon: Building2,
title: "Residential Communities",
description:
"Connect with families and residents in the spaces they use every day.",
alt: "Adsrow portrait advertising screen beside an elevator",
position: "72% 50%",
},
{
image: "/venues/supermarket-display.png",
icon: ShoppingBasket,
title: "Supermarkets",
description: "Reach shoppers close to their purchase decisions.",
alt: "Adsrow digital advertising screen in a supermarket",
position: "65% 50%",
},
{
image: "/venues/mall-display.png",
icon: ShoppingBag,
title: "Shopping Malls",
description: "Connect with shoppers during high-intent retail visits.",
alt: "Adsrow advertising screen in a shopping mall",
position: "50% 50%",
},
{
image: "/venues/cafe-display.png",
icon: Coffee,
title: "Cafés",
description: "Reach customers during their everyday breaks.",
alt: "Adsrow advertising displays inside a cafe",
position: "50% 50%",
},
{
image: "/venues/gym-display.png",
icon: Dumbbell,
title: "Gyms",
description: "Reach health-focused, high-routine audiences.",
alt: "Adsrow advertising screen inside a modern gym",
position: "35% 50%",
},
];

// The second card starts centered.
const INITIAL_INDEX = 1;

function VenueShowcaseCarousel() {
const trackRef = useRef(null);
// Destination of the latest programmatic scroll, so hand scrolling can be
// told apart from button/dot navigation. null = no programmatic scroll.
const pendingScroll = useRef(null);
// Intended active card. Updated synchronously on every navigation so rapid
// repeated clicks advance exactly one card at a time.
const pendingIndex = useRef(INITIAL_INDEX);

const [active, setActive] = useState(INITIAL_INDEX);
const [reducedMotion, setReducedMotion] = useState(false);

// Respect the user's motion preference.
useEffect(() => {
const query = window.matchMedia("(prefers-reduced-motion: reduce)");
const update = () => setReducedMotion(query.matches);

update();
query.addEventListener("change", update);

return () => query.removeEventListener("change", update);
}, []);

// Calculate the card closest to the center of the carousel.
const getCenterIndex = useCallback(() => {
const track = trackRef.current;

if (!track) return 0;

const slides = Array.from(track.children);

if (!slides.length) return 0;

const trackCenter =
track.getBoundingClientRect().left + track.clientWidth / 2;

let nearestIndex = 0;
let nearestDistance = Infinity;

slides.forEach((slide, index) => {
const rect = slide.getBoundingClientRect();
const slideCenter = rect.left + rect.width / 2;

const distance = Math.abs(slideCenter - trackCenter);

if (distance < nearestDistance) {
nearestDistance = distance;
nearestIndex = index;
}
});

return nearestIndex;
}, []);

// Scroll a card to the center of the track. Returns the clamped scrollLeft
// actually requested, or null when the card does not exist.
const centerCard = useCallback((index, behavior) => {
const track = trackRef.current;

if (!track) return null;

const slide = Array.from(track.children)[index];

if (!slide) return null;

const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);

const targetScroll = Math.min(
Math.max(0, slide.offsetLeft + slide.offsetWidth / 2 - track.clientWidth / 2),
maxScroll
);

track.scrollTo({ left: targetScroll, behavior });

return targetScroll;
}, []);

// Center the selected card. Declared before every handler and effect that
// references it.
const goTo = useCallback(
(index, behavior = reducedMotion ? "auto" : "smooth") => {
const track = trackRef.current;

if (!track) return;

const slides = Array.from(track.children);

if (!slides.length) return;

const target = Math.max(0, Math.min(index, slides.length - 1));

// Record the destination before scrolling so rapid repeated clicks keep
// advancing one card at a time instead of skipping.
pendingIndex.current = target;
setActive(target);

pendingScroll.current = centerCard(target, behavior);
},
[centerCard, reducedMotion]
);

const move = (direction) => {
goTo(pendingIndex.current + direction);
};

// Keep the active dot in sync with the centered card while the user scrolls
// by hand (swipe, wheel, scrollbar). While a programmatic scroll is pending,
// the dot stays on the requested destination — the first and last cards
// cannot be geometrically centered, so geometry must not override them.
const handleScroll = () => {
if (pendingScroll.current !== null) return;

const index = getCenterIndex();

if (index !== pendingIndex.current) {
pendingIndex.current = index;
setActive(index);
}
};

// Any manual interaction hands control back to geometry-based syncing.
const handleUserIntent = () => {
pendingScroll.current = null;
};

// Keyboard navigation
const handleKeyDown = (event) => {
if (event.key === "ArrowRight") {
event.preventDefault();
move(1);
return;
}

if (event.key === "ArrowLeft") {
event.preventDefault();
move(-1);
return;
}

if (event.key === "Home") {
event.preventDefault();
goTo(0);
return;
}

if (event.key === "End") {
event.preventDefault();
goTo(venues.length - 1);
}
};

// Center the initial active card, keep it centered on resize, and clean up.
useEffect(() => {
const track = trackRef.current;

if (!track) return;

const frame = requestAnimationFrame(() => {
pendingIndex.current = INITIAL_INDEX;
setActive(INITIAL_INDEX);

pendingScroll.current = centerCard(INITIAL_INDEX, "auto");
});

const observer = new ResizeObserver(() => {
// Re-center the active card instantly; no animation on resize.
pendingScroll.current = centerCard(pendingIndex.current, "auto");
});

observer.observe(track);

track.addEventListener("wheel", handleUserIntent, { passive: true });
track.addEventListener("touchstart", handleUserIntent, { passive: true });
track.addEventListener("pointerdown", handleUserIntent);

return () => {
cancelAnimationFrame(frame);
observer.disconnect();
track.removeEventListener("wheel", handleUserIntent);
track.removeEventListener("touchstart", handleUserIntent);
track.removeEventListener("pointerdown", handleUserIntent);
};
}, [centerCard]);

return (
<section className="venue-showcase" aria-label="Explore Adsrow advertising venues" >
{/* Carousel */}
<div className="venue-showcase-track" ref={trackRef} tabIndex={0} role="group" aria-roledescription="carousel" aria-label="Adsrow venue showcase" onKeyDown={handleKeyDown} onScroll={handleScroll} >
{venues.map((venue, index) => {
const Icon = venue.icon;

return (
<div
className="venue-showcase-slide"
key={venue.title}
role="group"
aria-roledescription="slide"
aria-label={`${index + 1} of ${venues.length}: ${venue.title}`}
>
<article
className={`venue-showcase-card ${
index === active ? "is-active" : ""
}`}
>
<div className="venue-showcase-image">
<img
src={venue.image}
alt={venue.alt}
loading={index < 3 ? "eager" : "lazy"}
decoding="async"
draggable="false"
style={{
objectPosition: venue.position,
}}
/>
</div>

<div className="venue-showcase-caption">
<span
className="venue-showcase-icon"
aria-hidden="true"
>
<Icon size={23} strokeWidth={1.8} />
</span>

<div className="venue-showcase-caption-content">
<h3>{venue.title}</h3>
<p>{venue.description}</p>
</div>
</div>
</article>
</div>
);
})}
</div>

{/* Navigation below the images */}
<div className="venue-showcase-nav">
<button
type="button"
className="venue-showcase-arrow"
aria-label="Previous venue"
disabled={active === 0}
onClick={() => move(-1)}
>
<ArrowLeft size={20} />
</button>

<div className="venue-showcase-dots">
{venues.map((venue, index) => (
<button
key={venue.title}
type="button"
className={`venue-showcase-dot ${
index === active ? "is-active" : ""
}`}
aria-label={`Show ${venue.title}`}
aria-current={index === active ? "true" : undefined}
onClick={() => goTo(index)}
/>
))}
</div>

<button
type="button"
className="venue-showcase-arrow"
aria-label="Next venue"
disabled={active === venues.length - 1}
onClick={() => move(1)}
>
<ArrowRight size={20} />
</button>
</div>
</section>

);
}

export default VenueShowcaseCarousel;
