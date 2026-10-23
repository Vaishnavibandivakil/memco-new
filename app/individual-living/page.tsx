import type { Metadata } from "next";
import { LifestyleStory, LIFESTYLE_STORIES } from "@/components/LifestyleStory";

export const metadata: Metadata = {
  title: "Individual Living · Jutaku by MEMCO Skyline",
  description: "A private Jutaku home connected to spaces for work, wellness and open air at MEMCO Skyline.",
};

export default function IndividualLivingPage() {
  return <LifestyleStory story={LIFESTYLE_STORIES.individual} />;
}
