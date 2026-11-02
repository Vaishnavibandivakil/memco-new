import type { Metadata } from "next";
import { LocationExplorer } from "@/components/LocationExplorer";
import "./location.css";

export const metadata: Metadata = {
  title: "Location · Jutaku by MEMCO Skyline",
  description: "Find Jutaku on Manipal County Road in Singasandra, South Bengaluru, close to Singasandra and Hosa Road Metro.",
};

export default function LocationPage() {
  return <LocationExplorer />;
}
