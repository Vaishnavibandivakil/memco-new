import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Terms & Conditions · MEMCO Skyline",
  description: "Terms for using the Jutaku website and its project information.",
};

const sections = [
  {
    title: "About this website",
    paragraphs: ["This website provides general information about MEMCO Skyline and Jutaku. You may use it to explore the project, view films and contact the team. Please use it lawfully and do not interfere with its operation."],
  },
  {
    title: "Project information",
    paragraphs: ["Images, videos, floor plans, illustrations, amenity descriptions, areas, distances, prices and availability are presented for general information and may change. Some visuals are artistic impressions. Please confirm current specifications, approvals, pricing, charges and availability with the MEMCO Skyline team and the applicable project documents before making a decision.", "The project RERA registration number shown on this site is PRM/KA/RERA/1251/310/PR/240426/008602."],
  },
  {
    title: "Enquiries and visits",
    paragraphs: ["Submitting an enquiry or preparing a visit request does not reserve a unit or confirm an appointment. A visit is arranged only after the team confirms it with you. This website does not take payments or complete property transactions."],
  },
  {
    title: "Investment information",
    paragraphs: ["Any discussion of rental income, appreciation or other potential returns is illustrative and is not a promise or guarantee. Outcomes depend on market conditions and the applicable project terms. Review the formal documents and seek independent advice where appropriate."],
  },
  {
    title: "External services and content",
    paragraphs: ["Links and embedded services such as WhatsApp, email, YouTube and maps are operated by other providers. Their own terms and privacy practices apply when you use them. The text, photographs, films, graphics and branding on this site belong to their respective owners and may not be reused without permission."],
  },
  {
    title: "Formal documents and changes",
    paragraphs: ["These website terms govern use of this site. Any purchase, booking or other property transaction is governed by the documents signed for that transaction and applicable law. Nothing on this page limits rights that cannot be limited under applicable law. We may update this page and the site from time to time."],
  },
];

export default function TermsAndConditionsPage() {
  return <LegalPage title="Terms & Conditions" introduction="Please read this information when using the Jutaku website and considering the project." sections={sections} relatedHref="/privacy-policy" relatedLabel="Read Privacy Policy" />;
}
