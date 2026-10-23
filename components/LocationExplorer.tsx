"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Building2, GraduationCap, Hospital, Hotel, LayoutGrid, MapPin, Minus, Navigation, Plus, Store, TrainFront, X } from "lucide-react";
import { Map, MapMarker, MarkerContent, type MapRef } from "@/components/ui/map";
import { ADDRESS } from "@/lib/data";
import { LOCATION_CATEGORIES, LOCATION_DIRECTORY, type LocationCategory } from "@/data/location-directory";

const CATEGORY_ICONS = {
  All: LayoutGrid,
  Metro: TrainFront,
  Healthcare: Hospital,
  Education: GraduationCap,
  "IT Parks": Building2,
  Commercial: Store,
  Areas: MapPin,
  Hotels: Hotel,
} as const;

const CATEGORY_IMAGES = {
  Metro: "/images/location/metro.jpg",
  Healthcare: "/images/location/healthcare.webp",
  Education: "/images/location/education.webp",
  "IT Parks": "/images/location/it-parks.webp",
  Commercial: "/images/location/commercial.webp",
  Areas: "/images/location/areas.jpg",
  Hotels: "/images/location/hotels.webp",
} as const;

const HOME = { name: "Jutaku", category: "Home", distance: "", position: [77.662, 12.878] } as const;
const PLACES = [HOME, ...LOCATION_DIRECTORY] as const;

export function LocationExplorer() {
  const mapRef = useRef<MapRef>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState(0);
  const [category, setCategory] = useState<LocationCategory>("All");
  const selectedPlace = PLACES[selected];
  const visiblePlaces = category === "All" ? LOCATION_DIRECTORY : LOCATION_DIRECTORY.filter((place) => place.category === category);
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${selectedPlace.position[1]}%2C${selectedPlace.position[0]}`;
  const selectedImage = selectedPlace.category === "Home" ? "/images/jutaku-exterior-hero.webp" : CATEGORY_IMAGES[selectedPlace.category];

  const choose = (index: number, scrollToMap = false) => {
    const place = PLACES[index];
    setSelected(index);
    mapRef.current?.flyTo({ center: [...place.position], zoom: index === 0 ? 13.5 : 14.5, duration: 950, essential: true });
    if (scrollToMap) stageRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const chooseCategory = (next: LocationCategory) => {
    setCategory(next);
    setSelected(0);
    const places = next === "All" ? PLACES : PLACES.filter((place) => place.category === "Home" || place.category === next);
    const lngs = places.map((place) => place.position[0]);
    const lats = places.map((place) => place.position[1]);
    mapRef.current?.fitBounds([[Math.min(...lngs), Math.min(...lats)], [Math.max(...lngs), Math.max(...lats)]], { padding: 90, maxZoom: 14, duration: 900, essential: true });
  };

  return (
    <main className="location-page" data-tone="light">
      <div ref={stageRef} className="location-stage">
      <div className="location-map" aria-label="Map of Jutaku and nearby places">
        <Map ref={mapRef} className="location-map-canvas" theme="light" center={[77.64, 12.885]} zoom={12.2} minZoom={10} maxZoom={18} attributionControl={{ compact: false }}>
          {PLACES.map((item, index) => (category === "All" || item.category === "Home" || item.category === category) && (
            <MapMarker key={item.name} longitude={item.position[0]} latitude={item.position[1]}>
              <MarkerContent>
                <button type="button" className={`location-pin${selected === index ? " is-active" : ""}${index === 0 ? " is-home" : ""}`} onClick={() => choose(index)} aria-label={`Show ${item.name}`} aria-pressed={selected === index}>
                  {index === 0 ? <span className="location-pin-brand">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/images/memco-logo.svg" alt="" />
                  </span> : <span className="location-pin-dot" />}
                  <span className="location-pin-label">{item.name}</span>
                </button>
              </MarkerContent>
            </MapMarker>
          ))}
        </Map>
        <div className="location-controls" aria-label="Map controls">
          <button type="button" onClick={() => mapRef.current?.zoomIn({ duration: 450 })} aria-label="Zoom in"><Plus size={18} aria-hidden="true" /></button>
          <button type="button" onClick={() => mapRef.current?.zoomOut({ duration: 450 })} aria-label="Zoom out"><Minus size={18} aria-hidden="true" /></button>
        </div>
      </div>

      <header className="location-head">
        <div>
          <h1>Closer to everything.</h1>
          <p className="location-summary">Between Singasandra and Hosa Road metro, with everyday essentials close by.</p>
          <p className="location-intro">{ADDRESS}</p>
          <Link href="/book-visit" className="location-book">Book a visit <ArrowRight size={16} aria-hidden="true" /></Link>
        </div>
        <Link className="location-back" href="/#location" aria-label="Close location page and return to the location section"><X size={20} strokeWidth={1.7} aria-hidden="true" /></Link>
      </header>

      <aside className="location-card" aria-label="Selected map place">
        <figure className="location-card-image">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img key={selectedPlace.name} src={selectedImage} alt={selectedPlace.category === "Home" ? "Jutaku tower and experience centre" : `Illustrative ${selectedPlace.category.toLowerCase()} scene`} />
          {selectedPlace.category !== "Home" && <figcaption>Illustrative image</figcaption>}
        </figure>
        <div className="location-card-copy" aria-live="polite">
          <span className="location-card-index">{selectedPlace.category === "Home" ? "Visit Jutaku" : selectedPlace.category}</span>
          <h2>{selectedPlace.category === "Home" ? "See it for yourself." : selectedPlace.name}</h2>
          <p>{selectedPlace.category === "Home" ? "The Experience Centre is on Manipal County Road, between Singasandra and Hosa Road." : `${selectedPlace.distance} from Jutaku.`}</p>
          <div className="location-card-actions">
            <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="location-card-action"><Navigation size={15} aria-hidden="true" /> Get directions</a>
          </div>
        </div>
      </aside>
      <div className="location-filters" role="group" aria-label="Filter map places by sector">
        {LOCATION_CATEGORIES.map((item) => {
          const Icon = CATEGORY_ICONS[item];
          const count = item === "All" ? LOCATION_DIRECTORY.length : LOCATION_DIRECTORY.filter((place) => place.category === item).length;
          return <button key={item} type="button" className={`location-filter${category === item ? " is-active" : ""}`} onClick={() => chooseCategory(item)} aria-pressed={category === item}><Icon size={17} strokeWidth={1.7} aria-hidden="true" /><span>{item}</span><small>{count}</small></button>;
        })}
      </div>
      </div>

      <section className="location-directory" aria-labelledby="location-directory-title">
        <div className="location-directory-heading">
          <div><span>Explore nearby</span><h2 id="location-directory-title">Around Jutaku.</h2></div>
          <p>Find the places that matter to your everyday life.</p>
        </div>
        <div className="location-directory-count" aria-live="polite">{visiblePlaces.length} {visiblePlaces.length === 1 ? "place" : "places"} {category === "All" ? "nearby" : `in ${category}`}</div>
        <ul className="location-directory-list">
          {visiblePlaces.map((place) => (
            <li key={place.name}>
              <div className="location-directory-place"><strong>{place.name}</strong><span>{place.distance} <i aria-hidden="true">·</i> {place.category}</span></div>
              <button type="button" onClick={() => choose(LOCATION_DIRECTORY.indexOf(place) + 1, true)} aria-label={`View ${place.name} on the map`}>View <ArrowRight size={15} aria-hidden="true" /></button>
            </li>
          ))}
        </ul>
        <p className="location-directory-note">Distances are approximate.</p>
      </section>
    </main>
  );
}
