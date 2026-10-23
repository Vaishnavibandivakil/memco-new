"use client";

import { useEffect, useRef, useState } from "react";

type Space = { name: string; detail: string; image: string; alt: string; tag: string };

const INTERVAL = 5600;

export function LifestyleGallery({ spaces }: { spaces: Space[] }) {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!root.current) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.2 });
    observer.observe(root.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || reduced || spaces.length < 2) return;
    const timer = window.setTimeout(() => {
      setActive((value) => (value + 1) % spaces.length);
      setCycle((value) => value + 1);
    }, INTERVAL);
    return () => window.clearTimeout(timer);
  }, [active, cycle, visible, reduced, spaces.length]);

  const select = (index: number) => {
    setActive(index);
    setCycle((value) => value + 1);
  };

  return (
    <div className="persona-gallery" ref={root}>
      <div className="persona-gallery-media" data-rise>
        {spaces.map((space, index) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={space.image}
            src={space.image}
            alt={space.alt}
            loading={index === 0 ? "eager" : "lazy"}
            className={index === active ? "is-active" : ""}
            aria-hidden={index !== active}
          />
        ))}
      </div>
      <div className="persona-gallery-options" aria-label="Explore Jutaku spaces">
        {spaces.map((space, index) => (
          <button
            type="button"
            className={index === active ? "is-active" : ""}
            aria-pressed={index === active}
            key={space.name}
            onClick={() => select(index)}
          >
            <span className="persona-gallery-index">{String(index + 1).padStart(2, "0")}</span>
            <span className="persona-gallery-option-copy">
              <small>{space.tag}</small>
              <strong>{space.name}</strong>
              <span>{space.detail}</span>
            </span>
            <span className="persona-gallery-progress" aria-hidden="true"><i key={`${active}-${cycle}-${visible}`} style={{ animationDuration: `${INTERVAL}ms`, animationPlayState: visible && !reduced ? "running" : "paused" }} /></span>
          </button>
        ))}
      </div>
    </div>
  );
}
