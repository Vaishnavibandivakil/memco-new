import { googleMetroPlaceId, JUTAKU_GOOGLE_PLACE_ID } from "@/data/metro-google-places";

type Destination = {
  name: string;
  category: string;
};

// Keep both endpoints explicit. A missing origin makes Google Maps substitute the
// visitor's location; a bare destination coordinate can acquire an unrelated name.
export function directionsFromJutaku({ name, category }: Destination) {
  const params = new URLSearchParams({
    api: "1",
    origin: "MEMCO Skyline Jutaku, Bengaluru, Karnataka",
    origin_place_id: JUTAKU_GOOGLE_PLACE_ID,
    destination: category === "Metro"
      ? `${name} Metro Station, Bengaluru, Karnataka`
      : `${name}, Bengaluru, Karnataka`,
    travelmode: "driving",
  });
  const stationPlaceId = category === "Metro" ? googleMetroPlaceId(name) : null;
  if (stationPlaceId) params.set("destination_place_id", stationPlaceId);
  return `https://www.google.com/maps/dir/?${params.toString()}`;
}
