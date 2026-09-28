import type { Metadata } from "next";

import { CustomStyleExample } from "@/components/MapComponent";
import "./map.css";

export const metadata: Metadata = {
  title: "Explore Nearby · MEMCO Skyline",
  description: "Explore places and routes near MEMCO Skyline.",
};

export default function MapPage() {
  return <CustomStyleExample />;
}
