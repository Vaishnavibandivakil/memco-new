import { SITE_COORDINATES } from "@/lib/data";

const site = [SITE_COORDINATES.lng, SITE_COORDINATES.lat] as const;

function distanceKm([fromLng, fromLat]: readonly [number, number], [toLng, toLat]: readonly [number, number]) {
  const radians = (degrees: number) => degrees * Math.PI / 180;
  const latitude = radians(toLat - fromLat);
  const longitude = radians(toLng - fromLng);
  const a = Math.sin(latitude / 2) ** 2 + Math.cos(radians(fromLat)) * Math.cos(radians(toLat)) * Math.sin(longitude / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(a));
}

function bearing([fromLng, fromLat]: readonly [number, number], [toLng, toLat]: readonly [number, number]) {
  const radians = (degrees: number) => degrees * Math.PI / 180;
  const latitude1 = radians(fromLat);
  const latitude2 = radians(toLat);
  const longitude = radians(toLng - fromLng);
  return (Math.atan2(Math.sin(longitude) * Math.cos(latitude2), Math.cos(latitude1) * Math.sin(latitude2) - Math.sin(latitude1) * Math.cos(latitude2) * Math.cos(longitude)) * 180 / Math.PI + 360) % 360;
}

const compass = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];

// Station coordinates used for the displayed straight-line distances and bearings.
const stations = [
  { name: "Singasandra Metro", position: [77.64485, 12.88082] as const },
  { name: "Hosa Road Metro", position: [77.65248, 12.87078] as const },
  { name: "Electronic City Metro", position: [77.67112, 12.84649] as const },
  { name: "MG Road Metro", position: [77.60683, 12.975536] as const },
];

export const ROUTE = stations.map((station) => ({
  ...station,
  distance: `${distanceKm(site, station.position).toFixed(1)} km`,
  direction: compass[Math.round(bearing(site, station.position) / 22.5) % compass.length],
}));
