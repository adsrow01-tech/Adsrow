import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import "../styles/card-deck-carousel.css";

const slides = [
  { image: "/venues/residential-lobby.jpg", title: "Residential Communities", caption: "Families at home, morning and evening.", alt: "Adsrow advertising screen beside a residential lift lobby" },
  { image: "/venues/office-display.jpg", title: "Offices", caption: "Professionals in modern workplace environments.", alt: "Adsrow advertising screen in an office lobby" },
  { image: "/venues/cafe-display.jpg", title: "Cafés", caption: "Customers during their everyday breaks.", alt: "Adsrow advertising screen inside a café" },
  { image: "/venues/mall-display.jpg", title: "Shopping Malls", caption: "Shoppers during high-intent retail visits.", alt: "Adsrow advertising screen in a shopping mall" },
  { image: "/venues/supermarket-display.jpg", title: "Supermarkets", caption: "Shoppers close to their purchase decisions.", alt: "Adsrow advertising screen in a supermarket" },
  { image: "/venues/gym-display.jpg", title: "Gyms", caption: "Health-focused, high-routine audiences.", alt: "Adsrow advertising screen inside a modern gym" },
];

function wrapIndex(index) {
  return (index + slides.length) % slides.length;
}

export default function CardDeckCarousel() {
  const [active, setActive] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const pointerStart = useRef(null);
  const deckRef = useRef(null);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const move = useCallback((direction) => {
    setActive((current) => wrapIndex(current + direction));
    setDragX(0);
  }, []);

  useEffect(() => {
    if (reducedMotion || isDragging) return undefined;
    const timer = window.setInterval(() => move(1), 4600);
    return () => window.clearInterval(timer);
  }, [isDragging, move, reducedMotion]);

  const handlePointerDown = (event) => {
    pointerStart.current = event.clientX;
    setIsDragging(true);
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const handlePointerMove = (event) => {
    if (pointerStart.current === null) return;
    setDragX(event.clientX - pointerStart.current);
  };

  const finishPointer = () => {
    if (pointerStart.current === null) return;
    const distance = dragX;
    pointerStart.current = null;
    setIsDragging(false);
    if (Math.abs(distance) > 55) move(distance < 0 ? 1 : -1);
    else setDragX(0);
  };

  const handleKeyDown = (event) => {
    if (event.key === "ArrowRight") { event.preventDefault(); move(1); }
    if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); }
    if (event.key === "Home") { event.preventDefault(); setActive(0); }
    if (event.key === "End") { event.preventDefault(); setActive(slides.length - 1); }
  };

  return (
    <section className="card-deck-carousel" aria-label="Adsrow venue showcase">
      <div className="card-deck-layout">
        <div className="card-deck-visual">
          <div
            ref={deckRef}
            className={`card-deck-stage${isDragging ? " is-dragging" : ""}`}
            tabIndex={0}
            onKeyDown={handleKeyDown}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={finishPointer}
            onPointerCancel={finishPointer}
            onPointerLeave={isDragging ? finishPointer : undefined}
          >
            {slides.map((slide, index) => {
              const offset = (index - active + slides.length) % slides.length;
              const visibleOffset = offset > 3 ? offset - slides.length : offset;
              const positionClass = visibleOffset < 0 ? `behind-${Math.abs(visibleOffset)}` : visibleOffset;
              const isActive = index === active;
              const style = isActive && dragX ? { transform: `translate3d(${dragX}px, 0, 0) rotate(${dragX / 18}deg)` } : undefined;
              return (
                <article
                  className={`card-deck-card card-deck-card-${positionClass}${isActive ? " is-active" : ""}`}
                  key={slide.title}
                  style={style}
                  aria-hidden={!isActive}
                >
                  <img src={slide.image} alt={slide.alt} draggable="false" loading={index < 2 ? "eager" : "lazy"} />
                </article>
              );
            })}
          </div>
          <div className="card-deck-controls">
            <button type="button" className="card-deck-arrow" aria-label="Previous venue" onClick={() => move(-1)}><ArrowLeft size={21} /></button>
            <div className="card-deck-count" aria-label={`Slide ${active + 1} of ${slides.length}`}><strong>{String(active + 1).padStart(2, "0")}</strong><span>/</span><span>{String(slides.length).padStart(2, "0")}</span></div>
            <button type="button" className="card-deck-arrow" aria-label="Next venue" onClick={() => move(1)}><ArrowRight size={21} /></button>
          </div>
        </div>
        <div className="card-deck-copy" aria-live="polite">
          <h3>{slides[active].title}</h3>
          <p>{slides[active].caption}</p>
        </div>
      </div>
    </section>
  );
}
