import { googleMetroPlaceId, JUTAKU_GOOGLE_PLACE_ID } from "@/data/metro-google-places";

type Destination = {
  name: string;
  category: string;
};

// Only open Google directions where both endpoints have verified Place IDs.
// Name searches and bare coordinates can be relabeled as unrelated businesses.
export function directionsFromJutaku({ name, category }: Destination) {
  const stationPlaceId = category === "Metro" ? googleMetroPlaceId(name) : null;
  if (!stationPlaceId) throw new Error(`No verified Google Maps place for ${name}`);

  const params = new URLSearchParams({
    api: "1",
    origin: "MEMCO Skyline Jutaku, Bengaluru, Karnataka",
    origin_place_id: JUTAKU_GOOGLE_PLACE_ID,
    destination: `${name} Metro Station, Bengaluru, Karnataka`,
    destination_place_id: stationPlaceId,
    travelmode: "driving",
  });
  return `https://www.google.com/maps/dir/?${params.toString()}`;
}
