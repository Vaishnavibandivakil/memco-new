import type { Metadata } from "next";
import { BrochureForm } from "@/components/BrochureForm";

export const metadata: Metadata = {
  title: "Download the Jutaku project overview · MEMCO Skyline",
  description: "A short overview of Jutaku homes, shared spaces and the South Bengaluru neighbourhood.",
};

export default function BrochurePage() {
  return <BrochureForm />;
}
