import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy · MEMCO Skyline",
  description: "How the Jutaku website handles enquiries, visits and third-party services.",
};

const sections = [
  {
    title: "Who we are",
    paragraphs: ["This website presents MEMCO Skyline and Jutaku in Singasandra, Bengaluru. MEMCO Skyline is the point of contact for questions about this website and enquiries submitted through it."],
  },
  {
    title: "Information you choose to share",
    paragraphs: ["When you enquire, you may provide your name, phone number, email address and whether you are interested in a home for self use or investment. When you submit a visit request, you may also provide your preferred date, time and number of guests. Please share only the details needed for your enquiry."],
  },
  {
    title: "How enquiries are sent",
    paragraphs: ["The enquiry form sends the details you enter through this website's server to the MEMCO Skyline CRM. The visit form sends your selected date, time and contact details through this website's server to the MEMCO Skyline booking service. MEMCO Skyline may use the submitted information to respond, arrange a visit and follow up about your enquiry.", "When the AI chat service is available, chat questions and recent replies are sent through this website's server to Omega Plus to generate an answer. Please do not include sensitive personal or financial information in chat. If the AI service is unavailable, the chat uses answers built into this website. The site does not store chat conversations in its own database; the visible conversation is cleared when you close the chat. Omega Plus may process requests under its own privacy practices. The Find your fit prompt stores a date in your browser so it does not appear again for four days."],
  },
  {
    title: "Other services on the site",
    paragraphs: ["This site displays video thumbnails and opens YouTube videos when you choose to watch them. Map features request map tiles or routes from external providers. If you choose Find my location and request directions, your browser asks for location permission and route coordinates are sent to the route provider. The map keeps some route information in your browser session.", "The CRM, YouTube, map providers and the website host may process technical information under their own privacy practices when you use those services."],
  },
  {
    title: "Your choices",
    paragraphs: ["You can choose whether to submit an enquiry or visit booking. If you have contacted MEMCO Skyline and want to update your details, ask about information held in your enquiry or stop further contact, write to info@memcoskyline.com. We will respond in line with applicable requirements."],
  },
  {
    title: "Updates",
    paragraphs: ["We may update this page if the website or our handling of enquiries changes. The date above shows when this version was last updated."],
  },
];

export default function PrivacyPolicyPage() {
  return <LegalPage title="Privacy Policy" introduction="A clear view of what happens when you explore Jutaku or contact the MEMCO Skyline team." sections={sections} relatedHref="/terms-and-conditions" relatedLabel="Read Terms & Conditions" />;
}
