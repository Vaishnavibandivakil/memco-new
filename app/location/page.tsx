import type { Metadata } from "next";
import { ResponsiveLocationPage } from "@/components/ResponsiveLocationPage";
import "./location.css";
import "../map/map.css";

export const metadata: Metadata = {
  title: "Location · Jutaku by MEMCO Skyline",
  description: "Find Jutaku on Manipal County Road in Singasandra, South Bengaluru, close to Singasandra and Hosa Road Metro.",
};

export default function LocationPage() {
  return <ResponsiveLocationPage />;
}
