"use client";

import { useEffect, useRef, useState } from "react";
import { Map, MapMarker, MarkerContent, type MapRef } from "@/components/ui/map";
import { SITE_COORDINATES } from "@/lib/data";
import { ROUTE } from "@/lib/nearby-route";

const MAP_STYLE = "https://tiles.openfreemap.org/styles/bright";
const STAGES = [
  { label: "Jutaku", caption: "The project, on Manipal County Road", zoom: 15.4, center: [SITE_COORDINATES.lng, SITE_COORDINATES.lat] as [number, number] },
  { label: "The neighbourhood", caption: "Singasandra and Hosa Road", zoom: 13.6, center: [SITE_COORDINATES.lng + 0.003, SITE_COORDINATES.lat + 0.004] as [number, number] },
  { label: "South Bengaluru", caption: "Four nearby Yellow Line stations", zoom: 12.4, center: [SITE_COORDINATES.lng + 0.004, SITE_COORDINATES.lat + 0.006] as [number, number] },
  { label: "The project", caption: "Jutaku by MEMCO Skyline", zoom: 12.4, center: [SITE_COORDINATES.lng, SITE_COORDINATES.lat] as [number, number] },
] as const;

export function LocationStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const mapRef = useRef<MapRef>(null);
  const timers = useRef<number[]>([]);
  const started = useRef(false);
  const [mounted, setMounted] = useState(false);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || started.current) return;
      started.current = true;
      setMounted(true);
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      [1, 2, 3].forEach((next, index) => {
        timers.current.push(window.setTimeout(() => setStage(next), 1500 * (index + 1)));
      });
    }, { threshold: 0.38 });
    observer.observe(section);
    return () => { observer.disconnect(); timers.current.forEach(window.clearTimeout); };
  }, []);

  useEffect(() => {
    if (stage === 3) return;
    const target = STAGES[stage];
    mapRef.current?.flyTo({ center: [...target.center], zoom: target.zoom, duration: stage === 0 ? 0 : 1100, essential: true });
  }, [stage]);

  const selectStage = (next: number) => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
    setStage(next);
  };

  return (
    <section id="location" ref={sectionRef} className="hz-panel rc" aria-labelledby="rc-title">
      <div className="rc-story">
        <div className="rc-copy">
          <div>
            <p className="lbl rc-eyebrow">05 / The location</p>
            <h2 id="rc-title">Everything<br /><em>within reach.</em></h2>
            <p className="rc-intro">Located between Begur Road and Hosa Road, with the Yellow Line close to home.</p>
          </div>
          <div className="rc-address" aria-label="Jutaku address">
            <span>MEMCO Skyline · Jutaku</span>
            <strong>Manipal County Road</strong>
            <strong>Singasandra</strong>
            <strong>Bengaluru, Karnataka 560114</strong>
          </div>
          <div className="rc-bottom">
            <p className="rc-stations-title">Yellow Line · approximate road distances from Jutaku</p>
            <div className="rc-stations">
              {ROUTE.map((station) => <div key={station.name}><span>{station.name.replace(/ Metro$/, "")}</span><b>≈{station.distance}</b></div>)}
            </div>
            <div className="rc-actions">
              <div className="rc-steps" aria-label="Location story views">
                {STAGES.map((item, index) => <button key={item.label} type="button" className={stage === index ? "is-active" : ""} onClick={() => selectStage(index)} aria-label={`Show ${item.label}`} aria-pressed={stage === index}><span /></button>)}
              </div>
              <a className="rc-directions" href="/location">Explore the location <span aria-hidden="true">↗</span></a>
            </div>
          </div>
        </div>
        <div className="rc-visual" aria-label="Jutaku location story">
          {mounted && <div className="rc-map" aria-hidden={stage === 3}>
            <Map ref={mapRef} className="rc-map-canvas" theme="light" styles={{ light: MAP_STYLE, dark: MAP_STYLE }} center={[SITE_COORDINATES.lng, SITE_COORDINATES.lat]} zoom={STAGES[0].zoom} minZoom={10} maxZoom={17} interactive={false} attributionControl={{ compact: true }}>
              <MapMarker longitude={SITE_COORDINATES.lng} latitude={SITE_COORDINATES.lat}><MarkerContent><span className="rc-pin rc-pin-home"><i /><b>Jutaku</b></span></MarkerContent></MapMarker>
              {ROUTE.map((station) => <MapMarker key={station.name} longitude={station.position[0]} latitude={station.position[1]}><MarkerContent><span className="rc-pin rc-pin-station"><i /><b>{station.name.replace(/ Metro$/, "")}</b></span></MarkerContent></MapMarker>)}
            </Map>
          </div>}
          <div className={`rc-project-image${stage === 3 ? " is-visible" : ""}`} aria-hidden={stage !== 3}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/jutaku-exterior-hero.webp" alt="" loading="lazy" />
          </div>
          <div className="rc-visual-top"><span>JUTAKU / SINGASANDRA</span><span>12.8742426° N · 77.6407966° E</span></div>
          <div className="rc-visual-bottom"><span>{String(stage + 1).padStart(2, "0")} / 04</span><span>{STAGES[stage].caption}</span></div>
        </div>
      </div>
    </section>
  );
}
