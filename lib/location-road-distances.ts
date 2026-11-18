"use client";

import { useEffect, useState } from "react";
import { LOCATION_DIRECTORY } from "@/data/location-directory";
import { SITE_COORDINATES } from "@/lib/data";

export function formatRoadDistance(meters: number) {
  return meters < 1000
    ? `${Math.round(meters / 100) * 100} m`
    : `${(meters / 1000).toFixed(1)} km`;
}

// One distance-matrix request supplies the directory without displaying the
// straight-line pin distances as though they were travel distances.
export function useLocationRoadDistances() {
  const [distances, setDistances] = useState<Record<string, number>>({});

  useEffect(() => {
    const controller = new AbortController();
    const positions = [[SITE_COORDINATES.lng, SITE_COORDINATES.lat], ...LOCATION_DIRECTORY.map((place) => place.position)];
    const coordinates = positions.map(([lng, lat]) => `${lng},${lat}`).join(";");
    const timeout = window.setTimeout(() => controller.abort(), 15000);

    void fetch(`https://router.project-osrm.org/table/v1/driving/${coordinates}?sources=0&annotations=distance`, { signal: controller.signal })
      .then((response) => response.ok ? response.json() : null)
      .then((data) => {
        const row = data?.distances?.[0];
        if (controller.signal.aborted || data?.code !== "Ok" || !Array.isArray(row) || row.length !== positions.length) return;
        const next: Record<string, number> = {};
        LOCATION_DIRECTORY.forEach((place, index) => {
          const meters = row[index + 1];
          if (typeof meters === "number" && Number.isFinite(meters) && meters > 0) next[place.name] = meters;
        });
        setDistances(next);
      })
      .catch(() => {})
      .finally(() => window.clearTimeout(timeout));

    return () => { controller.abort(); window.clearTimeout(timeout); };
  }, []);

  return distances;
}
