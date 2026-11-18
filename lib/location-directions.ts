import { googleMetroPlaceId, JUTAKU_GOOGLE_PLACE_ID } from "@/data/metro-google-places";
import { googlePlaceId } from "@/data/location-google-places";

type Destination = {
  name: string;
  category: string;
};

// Use named Google listing IDs for establishments and stations. Neighbourhoods
// use their full locality name, since they do not have a single entrance.
export function directionsFromJutaku({ name, category }: Destination) {
  const destinationPlaceId = category === "Metro" ? googleMetroPlaceId(name) : googlePlaceId(name);
  if (!destinationPlaceId && category !== "Areas") throw new Error(`No verified Google Maps place for ${name}`);

  const params = new URLSearchParams({
    api: "1",
    origin: "MEMCO Skyline Jutaku, Bengaluru, Karnataka",
    origin_place_id: JUTAKU_GOOGLE_PLACE_ID,
    destination: `${name}${category === "Metro" ? " Metro Station" : ""}, Bengaluru, Karnataka`,
    travelmode: "driving",
  });
  if (destinationPlaceId) params.set("destination_place_id", destinationPlaceId);
  return `https://www.google.com/maps/dir/?${params.toString()}`;
}
