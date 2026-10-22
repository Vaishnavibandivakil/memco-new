import type { Metadata } from "next";
import { InsightsLibrary } from "@/components/Insights";

export const metadata: Metadata = {
  title: "Insights · MEMCO Skyline Jutaku",
  description: "Films and stories from the Jutaku Experience Centre, amenities and people behind MEMCO Skyline.",
};

export default function InsightsPage() {
  return <InsightsLibrary />;
}
