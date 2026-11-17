"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type * as GeoJSON from "geojson";
import { ArrowRight, Building2, GraduationCap, Hospital, Hotel, LayoutGrid, MapPin, Minus, Navigation, Plus, Store, TrainFront, X } from "lucide-react";
import { Map, MapClusterLayer, MapMarker, MapRoute, MarkerContent, type MapRef } from "@/components/ui/map";
import { Map3DBuildings } from "@/components/ui/map-3d-buildings";
import { ADDRESS, SITE_COORDINATES } from "@/lib/data";
import { METRO_CONNECTIONS } from "@/data/metro-connectivity";
import { googleMetroPlaceId, JUTAKU_GOOGLE_PLACE_ID } from "@/data/metro-google-places";
import { METRO_GREEN_TRANSFER, METRO_ROUTE_POINTS } from "@/data/metro-station-locations";
import { LOCATION_CATEGORIES, LOCATION_DIRECTORY, type LocationCategory } from "@/data/location-directory";
import { ReturnLink } from "@/components/ReturnNavigation";

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

const HOME = { name: "Jutaku", category: "Home", distance: "", position: [SITE_COORDINATES.lng, SITE_COORDINATES.lat] } as const;
const PLACES = [HOME, ...LOCATION_DIRECTORY] as const;
const METRO_LINE_COLORS = { Yellow: "#c69b12", Green: "#00804d", Purple: "#7645a5", Pink: "#d26b91", Blue: "#367fb2" } as const;
const YELLOW_ACCESS_END = { Yellow: 8, Green: 0, Purple: 0, Pink: 2, Blue: 4 } as const;
const LOCATION_CLUSTER_SWITCH_ZOOM = 14.25;
const OPENFREEMAP_STYLE = "https://tiles.openfreemap.org/styles/bright";

type LocationClusterProperties = {
  placeIndex: number;
  name: string;
  category: LocationCategory;
};

export function LocationExplorer() {
  const mapRef = useRef<MapRef>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const metroButtonRef = useRef<HTMLButtonElement>(null);
  const metroPanelRef = useRef<HTMLElement>(null);
  const stationRouteRequestRef = useRef<AbortController | null>(null);
  const [selected, setSelected] = useState(0);
  const [category, setCategory] = useState<LocationCategory>("All");
  const [metroPanelOpen, setMetroPanelOpen] = useState(false);
  const [activeMetro, setActiveMetro] = useState<number | null>(null);
  const [activeStation, setActiveStation] = useState<number | null>(null);
  const [currentZoom, setCurrentZoom] = useState(12.2);
  const [stationRoadRoute, setStationRoadRoute] = useState<[number, number][] | null>(null);
  const [stationRoadDistanceMeters, setStationRoadDistanceMeters] = useState<number | null>(null);
  const [stationRouteLoading, setStationRouteLoading] = useState(false);
  const selectedPlace = PLACES[selected];
  const activeConnection = activeMetro === null ? null : METRO_CONNECTIONS[activeMetro];
  const activeRoute = activeConnection ? METRO_ROUTE_POINTS[activeConnection.line] : null;
  const selectedMetroStation = activeRoute && activeStation !== null ? activeRoute[activeStation] : null;
  const yellowAccess = activeConnection && activeConnection.line !== "Yellow" ? METRO_ROUTE_POINTS.Yellow.slice(YELLOW_ACCESS_END[activeConnection.line], 9).reverse() : null;
  const visiblePlaces = category === "All" ? LOCATION_DIRECTORY : LOCATION_DIRECTORY.filter((place) => place.category === category);
  const cardPosition = selectedMetroStation?.position ?? activeConnection?.position ?? selectedPlace.position;
  const homePlaceUrl = "https://www.google.com/maps/place/MEMCO+Skyline+Jutaku/@12.8742426,77.6382217,17z/data=!3m1!4b1!4m6!3m5!1s0x3bae6b00256cd43d:0x159453b3f51b5e1b!8m2!3d12.8742426!4d77.6407966!16s%2Fg%2F11xzz_6bnl";
  const stationPlaceId = activeConnection?.status.startsWith("In service") && selectedMetroStation ? googleMetroPlaceId(selectedMetroStation.name) : null;
  const directionsUrl = activeConnection
    ? stationPlaceId
      ? `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent("MEMCO Skyline Jutaku, Bengaluru")}&origin_place_id=${JUTAKU_GOOGLE_PLACE_ID}&destination=${encodeURIComponent(`${selectedMetroStation?.name} Metro Station, Bengaluru`)}&destination_place_id=${stationPlaceId}`
      : `https://www.google.com/maps/@?api=1&map_action=map&center=${cardPosition[1]}%2C${cardPosition[0]}&zoom=16`
    : selectedPlace.category === "Home"
      ? homePlaceUrl
      : `https://www.google.com/maps/dir/?api=1&destination=${cardPosition[1]}%2C${cardPosition[0]}`;
  const selectedImage = activeConnection ? CATEGORY_IMAGES.Metro : selectedPlace.category === "Home" ? "/images/jutaku-exterior-hero.webp" : CATEGORY_IMAGES[selectedPlace.category];
  const showClusters = !activeRoute && currentZoom < LOCATION_CLUSTER_SWITCH_ZOOM;
  const clusterData = useMemo<GeoJSON.FeatureCollection<GeoJSON.Point, LocationClusterProperties>>(() => {
    const places = category === "All" ? LOCATION_DIRECTORY : LOCATION_DIRECTORY.filter((place) => place.category === category);
    return {
      type: "FeatureCollection",
      features: places.map((place) => ({
        type: "Feature",
        properties: {
          placeIndex: LOCATION_DIRECTORY.indexOf(place) + 1,
          name: place.name,
          category: place.category,
        },
        geometry: { type: "Point", coordinates: [...place.position] },
      })),
    };
  }, [category]);

  const clearStationRoute = useCallback(() => {
    stationRouteRequestRef.current?.abort();
    stationRouteRequestRef.current = null;
    setStationRoadRoute(null);
    setStationRoadDistanceMeters(null);
    setStationRouteLoading(false);
  }, []);

  const choose = useCallback((index: number, scrollToMap = false) => {
    const place = PLACES[index];
    clearStationRoute();
    setMetroPanelOpen(false);
    setActiveMetro(null);
    setActiveStation(null);
    setSelected(index);
    mapRef.current?.flyTo({ center: [...place.position], zoom: index === 0 ? 13.5 : 14.5, duration: 950, essential: true });
    if (scrollToMap) stageRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [clearStationRoute]);

  const selectClusterPoint = useCallback((feature: GeoJSON.Feature<GeoJSON.Point, LocationClusterProperties>) => {
    const placeIndex = feature.properties?.placeIndex;
    if (typeof placeIndex === "number") choose(placeIndex);
  }, [choose]);

  const chooseCategory = (next: LocationCategory) => {
    clearStationRoute();
    setMetroPanelOpen(false);
    setActiveMetro(null);
    setActiveStation(null);
    setCategory(next);
    setSelected(0);
    const places = next === "All" ? PLACES : PLACES.filter((place) => place.category === "Home" || place.category === next);
    const lngs = places.map((place) => place.position[0]);
    const lats = places.map((place) => place.position[1]);
    mapRef.current?.fitBounds([[Math.min(...lngs), Math.min(...lats)], [Math.max(...lngs), Math.max(...lats)]], { padding: 90, maxZoom: 14, duration: 900, essential: true });
  };

  const showMetroOnMap = (index: number) => {
    clearStationRoute();
    const connection = METRO_CONNECTIONS[index];
    const route = METRO_ROUTE_POINTS[connection.line];
    const startingStation = route.findIndex((point) => point.name === (connection.line === "Yellow" ? "Singasandra" : connection.line === "Green" ? "RV Road" : connection.line === "Purple" ? "Majestic" : connection.line === "Pink" ? "Jayadeva Hospital" : "Central Silk Board"));
    setCategory("Metro");
    setActiveMetro(index);
    setActiveStation(startingStation < 0 ? 0 : startingStation);
    const points = [...route, ...(connection.line === "Purple" ? METRO_GREEN_TRANSFER : []), ...(connection.line === "Yellow" ? [] : METRO_ROUTE_POINTS.Yellow.slice(YELLOW_ACCESS_END[connection.line], 9))];
    const lngs = points.map((point) => point.position[0]);
    const lats = points.map((point) => point.position[1]);
    mapRef.current?.fitBounds([[Math.min(...lngs), Math.min(...lats)], [Math.max(...lngs), Math.max(...lats)]], {
      padding: window.innerWidth > 980 ? { top: 250, right: 475, bottom: 150, left: 65 } : { top: 65, right: 35, bottom: 110, left: 35 },
      maxZoom: 12.8,
      duration: 950,
      essential: true,
    });
    requestAnimationFrame(() => {
      const panel = metroPanelRef.current;
      const option = panel?.querySelector(".location-metro-option.is-active");
      if (panel && option) panel.scrollTo({ top: option.getBoundingClientRect().top - panel.getBoundingClientRect().top + panel.scrollTop - 12, behavior: "smooth" });
    });
    if (window.innerWidth <= 980) mapContainerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const focusMetroStation = (index: number) => {
    const point = activeRoute?.[index];
    if (!point) return;
    clearStationRoute();
    setActiveStation(index);
    setMetroPanelOpen(false);
    const routeBounds: [[number, number], [number, number]] = [
      [Math.min(SITE_COORDINATES.lng, point.position[0]), Math.min(SITE_COORDINATES.lat, point.position[1])],
      [Math.max(SITE_COORDINATES.lng, point.position[0]), Math.max(SITE_COORDINATES.lat, point.position[1])],
    ];
    const fitRoute = (bounds: [[number, number], [number, number]]) => mapRef.current?.fitBounds(bounds, {
      padding: window.innerWidth > 980
        ? { top: 160, right: Math.min(500, window.innerWidth * 0.43), bottom: 145, left: 70 }
        : { top: 60, right: 35, bottom: 60, left: 35 },
      maxZoom: 14.5,
      duration: 850,
      essential: true,
    });
    fitRoute(routeBounds);

    const controller = new AbortController();
    stationRouteRequestRef.current = controller;
    setStationRouteLoading(true);
    void fetch(`https://router.project-osrm.org/route/v1/driving/${SITE_COORDINATES.lng},${SITE_COORDINATES.lat};${point.position[0]},${point.position[1]}?overview=full&geometries=geojson`, { signal: controller.signal })
      .then((response) => response.ok ? response.json() : null)
      .then((data) => {
        if (controller.signal.aborted) return;
        const coordinates = data?.routes?.[0]?.geometry?.coordinates;
        if (!Array.isArray(coordinates) || coordinates.length < 2 || !coordinates.every((coordinate: unknown) => Array.isArray(coordinate) && coordinate.length === 2 && coordinate.every((value) => typeof value === "number" && Number.isFinite(value)))) return;
        const route = coordinates as [number, number][];
        setStationRoadRoute(route);
        const distance = data?.routes?.[0]?.distance;
        if (typeof distance === "number" && Number.isFinite(distance) && distance > 0) setStationRoadDistanceMeters(distance);
        const bounds = route.reduce<[[number, number], [number, number]]>((current, [lng, lat]) => [
          [Math.min(current[0][0], lng), Math.min(current[0][1], lat)],
          [Math.max(current[1][0], lng), Math.max(current[1][1], lat)],
        ], routeBounds);
        fitRoute(bounds);
      })
      .catch(() => {})
      .finally(() => {
        if (!controller.signal.aborted) setStationRouteLoading(false);
      });
    if (window.innerWidth <= 980) mapContainerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const closeMetroPanel = useCallback(() => {
    setMetroPanelOpen(false);
    if (activeConnection) mapRef.current?.flyTo({ center: [cardPosition[0], cardPosition[1]], zoom: 14, duration: 550, essential: true });
    metroButtonRef.current?.focus();
  }, [activeConnection, cardPosition]);

  const toggleMetroPanel = () => {
    if (metroPanelOpen) {
      closeMetroPanel();
      return;
    }
    setMetroPanelOpen(true);
    if (activeMetro !== null) showMetroOnMap(activeMetro);
  };

  useEffect(() => {
    return () => stationRouteRequestRef.current?.abort();
  }, []);

  useEffect(() => {
    if (!metroPanelOpen) return;
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMetroPanel();
      }
    };
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [metroPanelOpen, closeMetroPanel]);

  return (
    <main className="location-page" data-tone="light">
      <div ref={stageRef} className="location-stage">
      <div ref={mapContainerRef} className="location-map" aria-label="Map of Jutaku and nearby places">
        <Map ref={mapRef} className="location-map-canvas" theme="light" styles={{ light: OPENFREEMAP_STYLE, dark: OPENFREEMAP_STYLE }} center={[SITE_COORDINATES.lng, SITE_COORDINATES.lat]} zoom={12.2} pitch={55} bearing={-18} minZoom={10} maxZoom={18} canvasContextAttributes={{ antialias: true }} attributionControl={{ compact: false }} onViewportChange={(viewport) => setCurrentZoom(viewport.zoom)}>
          <Map3DBuildings />
          {yellowAccess && <MapRoute id="metro-access-yellow" coordinates={yellowAccess.map((point) => [...point.position])} color={METRO_LINE_COLORS.Yellow} width={4} opacity={0.9} interactive={false} />}
          {activeConnection?.line === "Purple" && <MapRoute id="metro-transfer-green" coordinates={METRO_GREEN_TRANSFER.map((point) => [...point.position])} color="#00804d" width={4} opacity={0.9} interactive={false} />}
          {activeRoute && activeConnection && <MapRoute key={activeConnection.line} id={`metro-route-${activeConnection.line.toLowerCase()}`} coordinates={activeRoute.map((point) => [...point.position])} color={METRO_LINE_COLORS[activeConnection.line]} width={4} opacity={0.9} dashArray={activeConnection.line === "Pink" || activeConnection.line === "Blue" ? [2, 2] : undefined} interactive={false} />}
          {stationRoadRoute && <MapRoute id="jutaku-station-road-route-outline" coordinates={stationRoadRoute} color="#fff" width={9} opacity={0.95} interactive={false} />}
          {stationRoadRoute && <MapRoute id="jutaku-station-road-route" coordinates={stationRoadRoute} color="#193c2c" width={5} opacity={0.95} interactive={false} />}
          {showClusters && <MapClusterLayer<LocationClusterProperties> data={clusterData} clusterMaxZoom={14} clusterRadius={60} clusterColors={["#006e52", "#006e52", "#006e52"]} clusterThresholds={[5, 12]} pointColor="#006e52" onPointClick={selectClusterPoint} />}
          {PLACES.map((item, index) => (activeRoute ? index === 0 : index === 0 || !showClusters && (category === "All" || item.category === category)) && (
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
          {activeRoute?.map((point, index) => (
            <MapMarker key={`${activeConnection?.line}-${point.name}`} longitude={point.position[0]} latitude={point.position[1]}>
              <MarkerContent>
                <button type="button" className={`location-route-pin is-${activeConnection?.line.toLowerCase()}${activeStation === index ? " is-selected" : ""}${activeConnection?.highlights.some((highlight) => highlight === point.name) ? " is-key" : ""}`} onClick={() => focusMetroStation(index)} aria-label={`Show directions from Jutaku to ${point.name} ${activeConnection?.line} Line station`} aria-pressed={activeStation === index}>
                  <span className="location-route-pin-dot" aria-hidden="true" /><span className="location-route-pin-label">{point.name}</span>
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
          <p className="location-summary">On Manipal County Road, between the Singasandra and Hosa Road Yellow Line stations.</p>
          <div className="location-head-actions">
            <Link href="/book-visit" className="location-book">Book a visit <ArrowRight size={16} aria-hidden="true" /></Link>
            {(category === "All" || category === "Metro") && <button ref={metroButtonRef} type="button" className="location-metro-jump" aria-controls="metro-connectivity" aria-expanded={metroPanelOpen} onClick={toggleMetroPanel}>See metro connections <ArrowRight size={16} aria-hidden="true" /></button>}
          </div>
        </div>
        <ReturnLink className="location-back" href="/#location" aria-label="Close location page"><X size={20} strokeWidth={1.7} aria-hidden="true" /></ReturnLink>
      </header>

      {metroPanelOpen && (
        <aside ref={metroPanelRef} id="metro-connectivity" className={`location-metro-panel${activeMetro !== null ? " is-route-active" : ""}`} aria-labelledby="location-metro-title">
          <div className="location-metro-panel-head">
            <div><span className="location-metro-kicker">Metro connectivity</span><h2 id="location-metro-title">How to reach Jutaku.</h2></div>
            <button type="button" className="location-metro-close" onClick={closeMetroPanel} aria-label="Close metro connections"><X size={19} aria-hidden="true" /></button>
          </div>
          <p className="location-metro-panel-intro">Choose a line, then tap a station to see its road route and distance from Jutaku. Pink and Blue station positions are indicative while construction continues.</p>
          <div className="location-metro-panel-routes">
            {METRO_CONNECTIONS.map((connection, index) => (
              <div key={connection.line} className={`location-metro-option is-${connection.line.toLowerCase()}${activeMetro === index ? " is-active" : ""}`}>
                <button type="button" className="location-metro-option-trigger" onClick={() => showMetroOnMap(index)} aria-pressed={activeMetro === index} aria-expanded={activeMetro === index} aria-controls={`metro-route-${connection.line.toLowerCase()}`}>
                  <span className="location-metro-option-top"><span className="location-metro-line-mark" aria-hidden="true" /><strong>{connection.line} Line</strong><small>{connection.stations.length} stations</small><ArrowRight size={18} aria-hidden="true" /></span>
                  <span className="location-metro-option-status">{connection.status}</span>
                  <span className="location-metro-option-station">{activeMetro === index ? "Showing" : "Show"} {connection.station} on map</span>
                </button>
                {activeMetro === index && <div id={`metro-route-${connection.line.toLowerCase()}`} className="location-metro-option-detail">
                  <div className="location-metro-steps" aria-label={`${connection.line} Line connection via ${connection.steps.join(", then ")}`}>{connection.steps.map((step, stepIndex) => <span key={step}>{stepIndex > 0 && <ArrowRight size={13} aria-hidden="true" />}<b>{step}</b></span>)}</div>
                  <p>{connection.description}</p>
                  <h3>How to reach Jutaku</h3>
                  <ol className="location-metro-journey">{connection.journey.map((leg) => <li key={leg.title}><strong>{leg.title}</strong><span>{leg.detail}</span></li>)}</ol>
                  <div className="location-metro-stations-heading"><h3>Station map</h3><span>{connection.stations.length} stops</span></div>
                  <p className="location-metro-stations-direction">{connection.stationsLabel}. Tap any stop for directions from Jutaku.</p>
                  <div className="location-metro-route-diagram" aria-label={`${connection.line} Line station route diagram`}>
                    <div className="location-metro-route-endpoint">{connection.stations[0]}</div>
                    <ol className="location-metro-stations">{connection.stations.map((station, stationIndex) => <li key={station} className={`${connection.highlights.some((highlight) => highlight === station) ? "is-key" : ""}${activeStation === stationIndex ? " is-current" : ""}`}><button type="button" onClick={() => focusMetroStation(stationIndex)} aria-label={`Show directions from Jutaku to ${station}`} aria-current={activeStation === stationIndex ? "location" : undefined}><span className="location-metro-station-node" aria-hidden="true" /><span>{station}</span>{connection.highlights.some((highlight) => highlight === station) && <small>{station === "Singasandra" || station === "Hosa Road" ? "Near Jutaku" : "Connection"}</small>}</button></li>)}</ol>
                    <div className="location-metro-route-endpoint is-end">{connection.stations[connection.stations.length - 1]}</div>
                  </div>
                </div>}
              </div>
            ))}
          </div>
          <p className="location-metro-panel-note">Note: Pink and Blue routes are under construction and may change.<span className="location-metro-panel-note-mark" aria-hidden="true">*</span></p>
        </aside>
      )}

      {!metroPanelOpen && <aside className={`location-card${activeConnection ? " is-station-route" : ""}`} aria-label={activeConnection ? "Directions from Jutaku to the selected station" : "Selected map place"}>
        {!activeConnection && <figure className="location-card-image">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img key={selectedPlace.name} src={selectedImage} alt={selectedPlace.category === "Home" ? "Jutaku tower and experience centre" : `Illustrative ${selectedPlace.category.toLowerCase()} scene`} />
          {selectedPlace.category !== "Home" && <figcaption>Illustrative image</figcaption>}
        </figure>}
        <div className="location-card-copy" aria-live="polite">
          <span className="location-card-index">{activeConnection ? `${activeConnection.line} Line · ${activeConnection.status}` : selectedPlace.category === "Home" ? "Visit Jutaku" : selectedPlace.category}</span>
          <h2>{selectedMetroStation?.name ?? activeConnection?.station ?? (selectedPlace.category === "Home" ? "MEMCO Skyline Jutaku" : selectedPlace.name)}</h2>
          <p>{activeConnection ? `From MEMCO Skyline Jutaku to ${selectedMetroStation?.name ?? activeConnection.station}${activeConnection.status.startsWith("In service") ? " Metro Station" : " planned station area"}. ${stationRouteLoading ? "Finding a road route…" : stationRoadDistanceMeters !== null ? `About ${(stationRoadDistanceMeters / 1000).toFixed(1)} km by road; route shown on the map.` : activeConnection.status.startsWith("In service") ? "Open Google Maps for the road route." : "Station location is indicative while construction continues."}` : selectedPlace.category === "Home" ? ADDRESS : `${selectedPlace.distance} from Jutaku.`}</p>
          <div className="location-card-actions">
            <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="location-card-action"><Navigation size={15} aria-hidden="true" /> {activeConnection ? stationPlaceId ? "Directions from Jutaku" : "View planned station area" : selectedPlace.category === "Home" ? "View on Google Maps" : "Get directions"}</a>
          </div>
        </div>
      </aside>}
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
          <p>Explore stations, healthcare, schools, work hubs and shopping around Jutaku.</p>
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
        <p className="location-directory-note">Distances are approximate straight-line measurements between map pins; travel routes may differ.</p>
      </section>
    </main>
  );
}
