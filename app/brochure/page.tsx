import type { Metadata } from "next";
import { BrochureForm } from "@/components/BrochureForm";

export const metadata: Metadata = {
  title: "Enquire about Jutaku · MEMCO Skyline",
  description: "Connect with the MEMCO Skyline team about Jutaku homes and the Experience Centre.",
};

export default function BrochurePage() {
  return <BrochureForm />;
}
