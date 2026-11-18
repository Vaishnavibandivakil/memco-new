import { LOCATION_HIGHLIGHTS } from "@/lib/data";

export function LocationHighlights() {
  return (
    <div className="location-highlights" aria-label="Nearby distances from Jutaku">
      {LOCATION_HIGHLIGHTS.map((place) => (
        <div className="location-highlight" key={place.name}>
          <span>{place.type}</span>
          <strong>{place.name}</strong>
          <b>{place.distance}</b>
        </div>
      ))}
    </div>
  );
}
