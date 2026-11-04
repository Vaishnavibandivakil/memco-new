import type { Metadata } from "next";
import { FloorPlanExplorer } from "@/components/FloorPlanExplorer";
import "./floor-plans.css";

export const metadata: Metadata = {
  title: "Floor plans · Jutaku by MEMCO Skyline",
  description: "Explore the Urban Unit, adjoining layouts and typical floor drawings for Jutaku by MEMCO Skyline.",
};

export default function FloorPlansPage() {
  return <FloorPlanExplorer />;
}
