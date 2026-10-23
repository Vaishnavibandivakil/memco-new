import type { Metadata } from "next";
import { LifestyleStory, LIFESTYLE_STORIES } from "@/components/LifestyleStory";

export const metadata: Metadata = {
  title: "Modern Couple · Jutaku by MEMCO Skyline",
  description: "See the private homes and shared dining, rooftop and sports spaces at Jutaku by MEMCO Skyline.",
};

export default function ModernCouplePage() {
  return <LifestyleStory story={LIFESTYLE_STORIES.couple} />;
}
