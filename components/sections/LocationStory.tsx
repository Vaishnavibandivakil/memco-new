"use client";

import { useEffect, useRef, useState } from "react";
import { Map, MapMarker, MarkerContent, type MapRef } from "@/components/ui/map";
import { SITE_COORDINATES } from "@/lib/data";

const MAP_STYLE = "https://tiles.openfreemap.org/styles/bright";
const STAGES = [
  { center: [SITE_COORDINATES.lng, SITE_COORDINATES.lat] as [number, number], zoom: 15.5 },
  { center: [SITE_COORDINATES.lng, SITE_COORDINATES.lat] as [number, number], zoom: 11.6 },
  { center: [77.5946, 12.9716] as [number, number], zoom: 9.1 },
  { center: [77.2, 15.2] as [number, number], zoom: 5.2 },
] as const;
const ADDRESS = ["Manipal County Road", "Singasandra", "Bengaluru", "Karnataka 560114", "India"];

export function LocationStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const mapRef = useRef<MapRef>(null);
  const timers = useRef<number[]>([]);
  const started = useRef(false);
  const [mounted, setMounted] = useState(false);
  const [stage, setStage] = useState(0);

  const clearTimers = () => { timers.current.forEach(window.clearTimeout); timers.current = []; };
  const play = () => {
    clearTimers();
    setStage(0);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    [1, 2, 3, 4].forEach((next, index) => {
      timers.current.push(window.setTimeout(() => setStage(next), 1500 * (index + 1)));
    });
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || started.current) return;
      started.current = true;
      setMounted(true);
      play();
    }, { threshold: 0.72 });
    observer.observe(section);
    return () => { observer.disconnect(); clearTimers(); };
  }, []);

  useEffect(() => {
    if (stage === 4) return;
    const target = STAGES[stage];
    mapRef.current?.flyTo({ center: [...target.center], zoom: target.zoom, duration: stage === 0 ? 0 : 1350, essential: true });
  }, [stage]);

  return (
    <section id="location" ref={sectionRef} className="hz-panel rc" aria-labelledby="rc-title">
      <div className="rc-story">
        <div className="rc-copy">
          <div className="rc-heading">
            <p className="lbl rc-eyebrow">05 / The location</p>
            <h2 id="rc-title">Everything <em>within reach.</em></h2>
          </div>
          <div className={`rc-address${stage > 0 ? " is-expanded" : ""}`} aria-label="Jutaku address">
            <span className="rc-address-label">Jutaku / MEMCO Skyline</span>
            {ADDRESS.map((line, index) => <span key={line} className={`rc-address-line${stage >= index ? " is-revealed" : ""}${stage === index ? " is-current" : ""}`}>{line}</span>)}
          </div>
          <div className="rc-bottom">
            <p>Singasandra Metro ≈1.4 km <span aria-hidden="true">·</span> Hosa Road Metro ≈1.2 km</p>
            <div className="rc-actions">
              <button type="button" className="rc-replay" onClick={play} aria-label="Replay location animation">Replay <span aria-hidden="true">↻</span></button>
              <a className="rc-directions" href="/location">Explore the location <span aria-hidden="true">↗</span></a>
            </div>
          </div>
        </div>
        <div className="rc-visual" aria-label="Map zooming from Jutaku to India, followed by a Jutaku project rendering">
          {mounted && <div className="rc-map" aria-hidden={stage === 4}>
            <Map ref={mapRef} className="rc-map-canvas" theme="light" styles={{ light: MAP_STYLE, dark: MAP_STYLE }} center={[SITE_COORDINATES.lng, SITE_COORDINATES.lat]} zoom={STAGES[0].zoom} minZoom={4} maxZoom={17} interactive={false} attributionControl={{ compact: true }}>
              {stage < 2 && <MapMarker longitude={SITE_COORDINATES.lng} latitude={SITE_COORDINATES.lat}><MarkerContent><span className="rc-pin rc-pin-home"><i /><b>Jutaku</b></span></MarkerContent></MapMarker>}
            </Map>
          </div>}
          <div className={`rc-project-image${stage === 4 ? " is-visible" : ""}`} aria-hidden={stage !== 4}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/tower-hero.webp" alt="" loading="lazy" />
            <span>Jutaku · Singasandra</span>
          </div>
        </div>
      </div>
    </section>
  );
}
