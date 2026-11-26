"use client";

import { useEffect, useRef, useState } from "react";
import { Map, MapMarker, MapRoute, MarkerContent, type MapRef } from "@/components/ui/map";
import { MapCredit } from "@/components/ui/MapCredit";
import { LOCATION_DIRECTORY } from "@/data/location-directory";
import { SITE_COORDINATES } from "@/lib/data";

const MAP_STYLE = "https://tiles.openfreemap.org/styles/bright";
const STAGES = [
  { center: [SITE_COORDINATES.lng, SITE_COORDINATES.lat] as [number, number], zoom: 15.5 },
  { center: [SITE_COORDINATES.lng, SITE_COORDINATES.lat] as [number, number], zoom: 11.6 },
  { center: [77.5946, 12.9716] as [number, number], zoom: 9.1 },
  { center: [77.2, 15.2] as [number, number], zoom: 5.2 },
] as const;
// Reuse the verified pins and Google listings on the location page.
const NEARBY = [
  { name: "Hosa Road", label: "Hosa Road Metro" },
  { name: "Singasandra", label: "Singasandra Metro" },
  { name: "Pralaksha Hospital", label: "Pralaksha Hospital" },
  { name: "Dayananda Sagar University City Campus", label: "Dayananda Sagar University" },
  { name: "HSR Layout", label: "HSR Layout" },
  { name: "Koramangala", label: "Koramangala" },
  { name: "MG Road", label: "MG Road" },
].map(({ name, label }) => {
  const place = LOCATION_DIRECTORY.find((entry) => entry.name === name);
  if (!place) throw new Error(`Missing location: ${name}`);
  return { ...place, label };
});

export function LocationStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const mapRef = useRef<MapRef>(null);
  const timers = useRef<number[]>([]);
  const routeRequest = useRef<AbortController | null>(null);
  const started = useRef(false);
  const [mounted, setMounted] = useState(false);
  const [stage, setStage] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [route, setRoute] = useState<[number, number][] | null>(null);
  const [roadDistance, setRoadDistance] = useState<number | null>(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [directLine, setDirectLine] = useState(false);
  const selectedPlace = selected === null ? null : NEARBY[selected];

  const clearTimers = () => { timers.current.forEach(window.clearTimeout); timers.current = []; };
  const play = () => {
    clearTimers();
    routeRequest.current?.abort();
    setSelected(null);
    setRoute(null);
    setRoadDistance(null);
    setRouteLoading(false);
    setStage(0);
    mapRef.current?.flyTo({ center: STAGES[0].center, zoom: STAGES[0].zoom, duration: 0, essential: true });
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
    return () => { observer.disconnect(); clearTimers(); routeRequest.current?.abort(); };
  }, []);

  useEffect(() => {
    if (stage === 4 || selected !== null) return;
    const target = STAGES[stage];
    mapRef.current?.flyTo({ center: [...target.center], zoom: target.zoom, duration: stage === 0 ? 0 : 1350, essential: true });
  }, [stage, selected]);

  const fitRoute = (coordinates: [number, number][]) => {
    const bounds = coordinates.reduce<[[number, number], [number, number]]>((current, [lng, lat]) => [
      [Math.min(current[0][0], lng), Math.min(current[0][1], lat)],
      [Math.max(current[1][0], lng), Math.max(current[1][1], lat)],
    ], [[SITE_COORDINATES.lng, SITE_COORDINATES.lat], [SITE_COORDINATES.lng, SITE_COORDINATES.lat]]);
    mapRef.current?.fitBounds(bounds, { padding: window.innerWidth > 760 ? 80 : 95, maxZoom: 14.7, duration: 850, essential: true });
  };

  const selectPlace = (index: number) => {
    const place = NEARBY[index];
    clearTimers();
    routeRequest.current?.abort();
    setSelected(index);
    setRoadDistance(null);
    setStage(0);
    const direct: [number, number][] = [[SITE_COORDINATES.lng, SITE_COORDINATES.lat], [place.position[0], place.position[1]]];
    setRoute(direct);
    setDirectLine(true);
    setRouteLoading(true);
    fitRoute(direct);

    const controller = new AbortController();
    routeRequest.current = controller;
    const timeout = window.setTimeout(() => controller.abort(), 12000);
    void fetch(`https://router.project-osrm.org/route/v1/driving/${SITE_COORDINATES.lng},${SITE_COORDINATES.lat};${place.position[0]},${place.position[1]}?overview=full&geometries=geojson`, { signal: controller.signal })
      .then((response) => response.ok ? response.json() : null)
      .then((data) => {
        if (controller.signal.aborted) return;
        const coordinates = data?.routes?.[0]?.geometry?.coordinates;
        if (!Array.isArray(coordinates) || coordinates.length < 2 || !coordinates.every((point: unknown) => Array.isArray(point) && point.length === 2 && point.every((value) => typeof value === "number" && Number.isFinite(value)))) return;
        const road = coordinates as [number, number][];
        setRoute(road);
        setDirectLine(false);
        const distance = data?.routes?.[0]?.distance;
        if (typeof distance === "number" && Number.isFinite(distance) && distance > 0) setRoadDistance(distance);
        fitRoute(road);
      })
      .catch(() => {})
      .finally(() => {
        window.clearTimeout(timeout);
        if (routeRequest.current === controller) {
          routeRequest.current = null;
          setRouteLoading(false);
        }
      });
  };

  return (
    <section id="location" ref={sectionRef} className="hz-panel rc" aria-labelledby="rc-title">
      <div className="rc-story">
        <div className="rc-copy">
          <div className="rc-heading">
            <p className="lbl rc-eyebrow">05 / The location</p>
            <h2 id="rc-title">Everything <em>within reach.</em></h2>
            <a className="rc-explore" href="/location">Explore location</a>
          </div>
          <div className="rc-nearby">
            <div className="rc-place-list">
              {NEARBY.map((place, index) => <button key={place.name} type="button" className={`rc-place${selected === index ? " is-selected" : ""}`} onClick={() => selectPlace(index)} aria-pressed={selected === index} aria-label={`Show directions from Jutaku to ${place.label}`}>
                {place.label}
              </button>)}
            </div>
          </div>
          <p className="rc-route-status" aria-live="polite">{selectedPlace ? `${selectedPlace.label} · ${routeLoading ? "Finding road route…" : directLine ? "Road route unavailable" : roadDistance !== null ? `About ${(roadDistance / 1000).toFixed(1)} km by road` : "Route shown on map"}` : ""}</p>
        </div>
        <div className="rc-visual" aria-label={selectedPlace ? `Map showing directions from Jutaku to ${selectedPlace.label}` : "Map zooming from Jutaku to India, followed by a Jutaku project rendering"}>
          {mounted && <div className="rc-map" aria-hidden={!selectedPlace && stage === 4}>
            <Map ref={mapRef} className="rc-map-canvas" theme="light" styles={{ light: MAP_STYLE, dark: MAP_STYLE }} center={[SITE_COORDINATES.lng, SITE_COORDINATES.lat]} zoom={STAGES[0].zoom} minZoom={4} maxZoom={17} interactive={false} attributionControl={false}>
              {route && <><MapRoute key={directLine ? "direct-outline" : "road-outline"} id={directLine ? "rc-direct-outline" : "rc-road-outline"} coordinates={route} color="#fff" width={9} opacity={.95} dashArray={directLine ? [2, 2] : undefined} interactive={false} /><MapRoute key={directLine ? "direct" : "road"} id={directLine ? "rc-direct" : "rc-road"} coordinates={route} color="#006b3d" width={5} opacity={.95} dashArray={directLine ? [2, 2] : undefined} interactive={false} /></>}
              {(selectedPlace || stage < 2) && <MapMarker longitude={SITE_COORDINATES.lng} latitude={SITE_COORDINATES.lat}><MarkerContent><span className="rc-pin rc-pin-home"><i /><b>Jutaku</b></span></MarkerContent></MapMarker>}
              {selectedPlace && <MapMarker longitude={selectedPlace.position[0]} latitude={selectedPlace.position[1]}><MarkerContent><span className="rc-pin rc-pin-destination"><i /><b>{selectedPlace.label}</b></span></MarkerContent></MapMarker>}
            </Map>
          </div>}
          <div className={`rc-project-image${stage === 4 && !selectedPlace ? " is-visible" : ""}`} aria-hidden={stage !== 4 || selectedPlace !== null}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/tower-hero.webp" alt="" loading="lazy" />
            <span>Jutaku · Singasandra</span>
          </div>
          {mounted && (stage !== 4 || selectedPlace) && <MapCredit />}
        </div>
      </div>
    </section>
  );
}
