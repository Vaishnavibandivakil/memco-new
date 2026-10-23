import type { Metadata } from "next";
import { FloorPlanExplorer } from "@/components/FloorPlanExplorer";
import "./floor-plans.css";

export const metadata: Metadata = {
  title: "Floor plans · Jutaku by MEMCO Skyline",
  description: "Explore Jutaku's supplied ground floor master plan, building layouts and Studio Type 1 plan.",
};

export default async function FloorPlansPage({ searchParams }: { searchParams: Promise<{ floor?: string }> }) {
  const requestedFloor = Number((await searchParams).floor ?? 0);
  const initialFloor = Number.isInteger(requestedFloor) && requestedFloor >= 0 && requestedFloor <= 14 ? requestedFloor : 0;
  return <FloorPlanExplorer initialFloor={initialFloor} />;
}
