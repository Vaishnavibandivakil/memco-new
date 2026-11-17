import { SITE_COORDINATES } from "@/lib/data";
import { METRO_ROUTE_POINTS } from "@/data/metro-station-locations";

const site = [SITE_COORDINATES.lng, SITE_COORDINATES.lat] as const;

function bearing([fromLng, fromLat]: readonly [number, number], [toLng, toLat]: readonly [number, number]) {
  const radians = (degrees: number) => degrees * Math.PI / 180;
  const latitude1 = radians(fromLat);
  const latitude2 = radians(toLat);
  const longitude = radians(toLng - fromLng);
  return (Math.atan2(Math.sin(longitude) * Math.cos(latitude2), Math.cos(latitude1) * Math.sin(latitude2) - Math.sin(latitude1) * Math.cos(latitude2) * Math.cos(longitude)) * 180 / Math.PI + 360) % 360;
}

const compass = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];

// OSRM road distances from the Jutaku pin to the station pins, checked 17 Nov 2026.
// Approximate values can change with road access and routing updates.
const stations = [
  { name: "Singasandra Metro", roadDistanceMeters: 1715.2 },
  { name: "Hosa Road Metro", roadDistanceMeters: 1512.3 },
  { name: "Kudlu Gate Metro", roadDistanceMeters: 2238.8 },
  { name: "Beratena Agrahara Metro", roadDistanceMeters: 2475.5 },
].map((station) => {
  const point = METRO_ROUTE_POINTS.Yellow.find((item) => item.name === station.name.replace(/ Metro$/, ""));
  if (!point) throw new Error(`Missing Yellow Line station: ${station.name}`);
  return { ...station, position: point.position };
});

export const ROUTE = stations.map((station) => ({
  ...station,
  distance: `${(station.roadDistanceMeters / 1000).toFixed(1)} km`,
  direction: compass[Math.round(bearing(site, station.position) / 22.5) % compass.length],
}));
