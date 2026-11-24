import { SITE_COORDINATES } from "@/lib/data";
import { METRO_ROUTE_POINTS } from "@/data/metro-station-locations";

const NEARBY_METRO_STATIONS = [
  ["Yellow", "Singasandra"],
  ["Yellow", "Hosa Road"],
  ["Yellow", "Kudlu Gate"],
  ["Yellow", "Hongasandra"],
  ["Yellow", "Bommanahalli"],
  ["Yellow", "BTM Layout"],
  ["Yellow", "Beratena Agrahara"],
  ["Yellow", "Central Silk Board"],
  ["Yellow", "Electronic City"],
  ["Yellow", "Infosys Foundation Konappana Agrahara"],
  ["Pink", "Hulimavu"],
  ["Pink", "Kalena Agrahara"],
  ["Green", "Jaya Prakash Nagar"],
  ["Green", "Yelachenahalli"],
  ["Green", "Banashankari"],
  ["Purple", "MG Road"],
] as const;

const METRO_DIRECTORY_POINTS = NEARBY_METRO_STATIONS.map(([line, name]) => {
  const point = METRO_ROUTE_POINTS[line].find((station) => station.name === name);
  if (!point) throw new Error(`Missing ${line} Line station: ${name}`);
  return { name, category: "Metro" as const, line, position: point.position };
});

const LOCATION_DIRECTORY_POINTS = [
  { name: "Pralaksha Hospital", category: "Healthcare", position: [77.6559772, 12.8708567] as const },
  { name: "Springleaf Hospital", category: "Healthcare", position: [77.6675444, 12.8525896] as const },
  { name: "Vimalalaya Hospital", category: "Healthcare", position: [77.6803671, 12.8349475] as const },
  { name: "Oxford College of Engineering", category: "Education", position: [77.6313057, 12.9016798] as const },
  { name: "Dayananda Sagar University City Campus", category: "Education", position: [77.641989, 12.887428] as const },
  { name: "St. Francis School Hongasandra", category: "Education", position: [77.625671, 12.889067] as const },
  { name: "Ekana Multi Specialty Hospitals", category: "Healthcare", position: [77.6240364, 12.870509] as const },
  { name: "National Public School HSR", category: "Education", position: [77.6429455, 12.9165205] as const },
  { name: "Manipal Clinics Begur", category: "Healthcare", position: [77.6145983, 12.8624562] as const },
  { name: "HSR Layout", category: "Areas", position: [77.66298215593662, 12.911692993764753] as const },
  { name: "PES University Electronic City Campus", category: "Education", position: [77.6647081, 12.8614515] as const },
  { name: "Rainbow Children's Hospital Bannerghatta", category: "Healthcare", position: [77.6007898, 12.9033775] as const },
  { name: "Sri Chaitanya Techno School Hulimavu", category: "Education", position: [77.595183, 12.8800218] as const },
  { name: "XIME Bengaluru", category: "Education", position: [77.675163, 12.847954] as const },
  { name: "Apollo Hospitals Bannerghatta", category: "Healthcare", position: [77.5985971, 12.8961976] as const },
  { name: "Infosys Electronic City", category: "IT Parks", position: [77.6640689, 12.8502542] as const },
  { name: "Bosch Limited Singasandra", category: "IT Parks", position: [77.6606831, 12.8709067] as const },
  { name: "HSBC Electronic Data Processing", category: "IT Parks", position: [77.5993711, 12.8920442] as const },
  { name: "Cinepolis SJR Arekere", category: "Commercial", position: [77.598006, 12.891461] as const },
  { name: "Fortis Hospital Bannerghatta", category: "Healthcare", position: [77.5986197, 12.8948217] as const },
  { name: "Kalyani Magnum Infotech Park", category: "IT Parks", position: [77.597125, 12.8994981] as const },
  { name: "Vega City Mall", category: "Commercial", position: [77.600899, 12.9077] as const },
  { name: "Jayadeva Hospital", category: "Healthcare", position: [77.5992075, 12.9178903] as const },
  { name: "IIM Bengaluru", category: "Education", position: [77.6012434, 12.894524] as const },
  { name: "Gopalan Innovation Mall", category: "Commercial", position: [77.5995815, 12.9144032] as const },
  { name: "Shoppers Stop Bannerghatta", category: "Commercial", position: [77.6003677, 12.9121906] as const },
  { name: "Forum South Bengaluru", category: "Commercial", position: [77.5633138, 12.888352] as const },
  { name: "St. John's Medical College Hospital", category: "Healthcare", position: [77.6186969, 12.9295368] as const },
  { name: "Koramangala", category: "Areas", position: [77.64731499516013, 12.92336154410972] as const },
  { name: "Christ University", category: "Education", position: [77.6059112, 12.9344479] as const },
  { name: "Royal Meenakshi Mall", category: "Commercial", position: [77.595766, 12.8757] as const },
  { name: "Nexus Koramangala Mall", category: "Commercial", position: [77.6111143, 12.9346691] as const },
  { name: "Ibis Bengaluru Hosur Road", category: "Hotels", position: [77.6320229, 12.9006997] as const },
  { name: "Jaya Nagar", category: "Areas", position: [77.61091883483327, 12.92664799452708] as const },
  ...METRO_DIRECTORY_POINTS,
] as const;

// Other directory distances use straight-line estimates between map pins.
// Travel distances depend on the route.
function distanceFromSite([lng, lat]: readonly [number, number]) {
  const toRadians = (degrees: number) => degrees * Math.PI / 180;
  const latitudeDelta = toRadians(lat - SITE_COORDINATES.lat);
  const longitudeDelta = toRadians(lng - SITE_COORDINATES.lng);
  const a = Math.sin(latitudeDelta / 2) ** 2
    + Math.cos(toRadians(SITE_COORDINATES.lat)) * Math.cos(toRadians(lat))
    * Math.sin(longitudeDelta / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(a));
}

export const LOCATION_DIRECTORY = LOCATION_DIRECTORY_POINTS.map((place) => {
  const distanceKm = distanceFromSite(place.position);
  const suppliedDistance = place.name === "Singasandra" ? "1.4 km"
    : place.name === "Hosa Road" ? "1.2 km"
    : undefined;
  return {
    ...place,
    distanceKm,
    distance: suppliedDistance ?? (distanceKm < 1
      ? `${Math.round(distanceKm * 10) * 100} m`
      : `${distanceKm.toFixed(1)} km`),
  };
}).sort((a, b) => a.distanceKm - b.distanceKm);

export const LOCATION_CATEGORIES = [
  "All",
  "Metro",
  "Healthcare",
  "Education",
  "IT Parks",
  "Commercial",
  "Areas",
  "Hotels",
] as const;

export type LocationCategory = (typeof LOCATION_CATEGORIES)[number];
