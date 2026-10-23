import type { Metadata } from "next";
import { LocationExplorer } from "@/components/LocationExplorer";
import "./location.css";

export const metadata: Metadata = {
  title: "Location · Jutaku by MEMCO Skyline",
  description: "Find Jutaku in Begur, South Bengaluru, close to Singasandra and Hosa Road Metro.",
};

export default function LocationPage() {
  return <LocationExplorer />;
}
