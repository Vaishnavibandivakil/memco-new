"use client";

import { useSyncExternalStore } from "react";
import { LocationExplorer } from "@/components/LocationExplorer";
import { CustomStyleExample } from "@/components/MapComponent";
import { LocationHighlights } from "@/components/LocationHighlights";

const MOBILE_QUERY = "(max-width: 767px)";

function subscribeToMobileLayout(onChange: () => void) {
  const media = window.matchMedia(MOBILE_QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

function getMobileLayout() {
  return window.matchMedia(MOBILE_QUERY).matches;
}

export function ResponsiveLocationPage() {
  const isMobile = useSyncExternalStore(subscribeToMobileLayout, getMobileLayout, () => false);
  return isMobile ? <><CustomStyleExample /><section className="location-directory location-mobile-highlights" aria-label="Nearby distances"><h2>Closer to everything.</h2><p>Approximate distances from Jutaku.</p><LocationHighlights /></section></> : <LocationExplorer />;
}
