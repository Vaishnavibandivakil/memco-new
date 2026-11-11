"use client";

import { useEffect } from "react";
import { useMap } from "@/components/ui/map";

export function Map3DBuildings({ active = true }: { active?: boolean }) {
  const { map, isLoaded } = useMap();

  useEffect(() => {
    if (!map || !isLoaded) return;

    const sourceId = "openfreemap-3d-buildings";
    const layerId = "openfreemap-3d-buildings-layer";

    const removeBuildings = () => {
      try {
        if (map.getLayer(layerId)) map.removeLayer(layerId);
        if (map.getSource(sourceId)) map.removeSource(sourceId);
      } catch {
        // Ignore map style teardown races.
      }
    };

    if (!active) {
      removeBuildings();
      return;
    }

    const labelLayerId = (map.getStyle().layers ?? []).find(
      (layer) => layer.type === "symbol" && Boolean(layer.layout?.["text-field"]),
    )?.id;

    if (!map.getSource(sourceId)) {
      map.addSource(sourceId, {
        type: "vector",
        url: "https://tiles.openfreemap.org/planet",
      });
    }

    if (!map.getLayer(layerId)) {
      map.addLayer(
        {
          id: layerId,
          type: "fill-extrusion",
          source: sourceId,
          "source-layer": "building",
          minzoom: 14,
          filter: ["!=", ["get", "hide_3d"], true],
          paint: {
            "fill-extrusion-color": "#e8e5dc",
            "fill-extrusion-opacity": 0.92,
            "fill-extrusion-height": [
              "interpolate",
              ["linear"],
              ["zoom"],
              14,
              0,
              15,
              ["get", "render_height"],
            ],
            "fill-extrusion-base": [
              "interpolate",
              ["linear"],
              ["zoom"],
              14,
              0,
              15,
              ["coalesce", ["get", "render_min_height"], 0],
            ],
          },
        },
        labelLayerId,
      );
    }

    return removeBuildings;
  }, [active, isLoaded, map]);

  return null;
}
