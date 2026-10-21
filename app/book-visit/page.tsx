import type { Metadata } from "next";
import { BookingForm } from "@/components/BookingForm";

export const metadata: Metadata = {
  title: "Book your JUTAKU Experience · MEMCO Skyline",
  description: "Choose a preferred date and time for a visit to the Jutaku Experience Centre.",
};

export default function BookVisitPage() {
  return <BookingForm />;
}
