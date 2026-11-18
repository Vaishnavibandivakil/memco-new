import { LOCATION_HIGHLIGHTS } from "@/lib/data";
import { formatRoadDistance } from "@/lib/location-road-distances";

const directoryNames: Record<string, string> = {
  "Manipal Clinics": "Manipal Clinics Begur",
  "Hosa Road Metro Station": "Hosa Road",
  "Singasandra Metro Station": "Singasandra",
};

const verifiedFallbackDistances: Record<string, string> = {
  "Manipal Clinics": "4.3 km",
};

export function LocationHighlights({ roadDistances = {} }: { roadDistances?: Record<string, number> }) {
  return (
    <div className="location-highlights" aria-label="Nearby distances from Jutaku">
      {LOCATION_HIGHLIGHTS.map((place) => (
        <div className="location-highlight" key={place.name}>
          <span>{place.type}</span>
          <strong>{place.name === "Manipal Clinics" ? "Manipal Clinics Begur" : place.name}</strong>
          <b>{roadDistances[directoryNames[place.name]] ? formatRoadDistance(roadDistances[directoryNames[place.name]]) : verifiedFallbackDistances[place.name] ?? place.distance}</b>
        </div>
      ))}
    </div>
  );
}
