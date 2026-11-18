import { LOCATION_HIGHLIGHTS } from "@/lib/data";
import { formatRoadDistance } from "@/lib/location-road-distances";

const directoryNames: Record<string, string> = {
  "Manipal Clinics": "Manipal Clinic",
  "Hosa Road Metro Station": "Hosa Road",
  "Singasandra Metro Station": "Singasandra",
};

export function LocationHighlights({ roadDistances = {} }: { roadDistances?: Record<string, number> }) {
  return (
    <div className="location-highlights" aria-label="Nearby distances from Jutaku">
      {LOCATION_HIGHLIGHTS.map((place) => (
        <div className="location-highlight" key={place.name}>
          <span>{place.type}</span>
          <strong>{place.name}</strong>
          <b>{roadDistances[directoryNames[place.name]] ? formatRoadDistance(roadDistances[directoryNames[place.name]]) : place.distance}</b>
        </div>
      ))}
    </div>
  );
}
