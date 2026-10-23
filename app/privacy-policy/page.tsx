import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy · MEMCO Skyline",
  description: "How the Jutaku website handles enquiries, visits and third-party services.",
};

const sections = [
  {
    title: "Who we are",
    paragraphs: ["This website presents MEMCO Skyline and Jutaku in Begur, Bengaluru. MEMCO Skyline is the point of contact for questions about this website and enquiries submitted through it."],
  },
  {
    title: "Information you choose to share",
    paragraphs: ["When you enquire, you may provide your name, phone number, email address and whether you are interested in a home for self use or investment. When you submit a visit request, you may also provide your preferred date, time and number of guests. Please share only the details needed for your enquiry."],
  },
  {
    title: "How enquiries are sent",
    paragraphs: ["The enquiry form opens WhatsApp with a message containing the details you entered; you choose whether to send it. The visit form sends your details to this website's server, which uses an email delivery provider to forward the request to MEMCO Skyline. The site does not store either form in its own database. MEMCO Skyline may use information you send to respond and arrange a visit or follow up about your enquiry.", "The on-page sales chat answers questions from information built into the website. Its conversation stays in your current browser session and is cleared when you close the chat. The Find your fit prompt stores a date in your browser so it does not appear again for four days."],
  },
  {
    title: "Other services on the site",
    paragraphs: ["This site displays video thumbnails and opens YouTube videos when you choose to watch them. Map features request map tiles or routes from external providers. If you choose Find my location and request directions, your browser asks for location permission and route coordinates are sent to the route provider. The map keeps some route information in your browser session.", "WhatsApp, email, YouTube, map providers and the website host may process technical information under their own privacy practices when you use those services."],
  },
  {
    title: "Your choices",
    paragraphs: ["You can choose whether to send a prepared WhatsApp message or submit a visit request. If you have contacted MEMCO Skyline and want to update your details, ask about information held in your enquiry or stop further contact, write to info@memcoskyline.com. We will respond in line with applicable requirements."],
  },
  {
    title: "Updates",
    paragraphs: ["We may update this page if the website or our handling of enquiries changes. The date above shows when this version was last updated."],
  },
];

export default function PrivacyPolicyPage() {
  return <LegalPage title="Privacy Policy" introduction="A clear view of what happens when you explore Jutaku or contact the MEMCO Skyline team." sections={sections} relatedHref="/terms-and-conditions" relatedLabel="Read Terms & Conditions" />;
}
