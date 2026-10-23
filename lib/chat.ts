import { ADDRESS, EMAIL, PHONE, RERA } from "@/lib/data";

export type ChatTopic = "homes" | "amenities" | "location" | "pricing" | "investment" | "investmentComparison" | "visit" | "experience" | "contact" | "rera" | "concept" | "other";
export type ChatReply = {
  topic: ChatTopic;
  text: string;
  details?: string[];
  sections?: { heading: string; items: { title: string; body: string }[] }[];
  action?: { label: string; href: string };
};

const answers: Record<ChatTopic, Omit<ChatReply, "topic">> = {
  homes: {
    text: "Jutaku has 646 private spaces of about 500 sq ft each. The homes are designed around everyday use, with shared places for work, sport and downtime nearby.",
    action: { label: "Explore the homes", href: "/#project" },
  },
  amenities: {
    text: "There are 50,000 sq ft of shared spaces, including a rooftop pool, sports deck, wellness hub, gardens, dining spaces and creator studios.",
    action: { label: "See the amenities", href: "/#amenities" },
  },
  location: {
    text: `The site is ${ADDRESS}. Singasandra Metro is about 600 m away, Hosa Road Metro 1.2 km and Electronic City 3 km.`,
    action: { label: "Explore the location", href: "/location" },
  },
  pricing: {
    text: "Homes start from ₹68.5 lakhs. The final price depends on the floor and unit; floor rise, corner and east-facing premiums may apply. The team can confirm current pricing and availability.",
    action: { label: "Book a visit", href: "/book-visit" },
  },
  investment: {
    text: "Investment benefits at Jutaku",
    sections: [
      { heading: "What you get", items: [
        { title: "Private space (~500 sq ft)", body: "Your private sanctuary with smart, efficient design." },
        { title: "Access to the full ecosystem", body: "50,000 sq ft of experience zones at your fingertips." },
        { title: "Revenue-sharing opportunities", body: "Potential income from bookable spaces in the ecosystem, subject to the project terms." },
      ] },
      { heading: "Investment highlights", items: [
        { title: "Connected living", body: "Everyday access to the IT corridor." },
        { title: "Metro within reach", body: "About 0.6 km from Singasandra Metro." },
        { title: "Complete ecosystem", body: "50,000+ sq ft of experience zones." },
        { title: "Smart ownership", body: "Potential value in an established IT hub; returns are not guaranteed." },
      ] },
    ],
    action: { label: "Speak with the team", href: "/#contact" },
  },
  investmentComparison: {
    text: "MEMCO’s Manipal County comparison cites an average acquisition cost of ₹15,500 per sq ft for RERA-approved projects, including charges except registration. It lists a ₹1.6 crore minimum ticket size outside Jutaku; Jutaku’s entry ticket is about 44% of that benchmark.",
    details: [
      "Two possible ways to earn a return are future resale appreciation and rental income or rental offset. Neither return is guaranteed.",
      "The rental case highlights metro and road access, smaller homes and shared amenities as possible drivers of demand. These are project-provided comparisons; check current prices, rents and charges before deciding.",
    ],
    action: { label: "Speak with the team", href: "/#contact" },
  },
  visit: {
    text: "You can reserve a one-hour walkthrough of the Jutaku Experience Centre. Choose a day, time and number of guests on the booking page.",
    action: { label: "Choose a visit time", href: "/book-visit" },
  },
  experience: {
    text: "The Jutaku Experience Centre is a place to explore the project in person. A guided one-hour visit gives you time to see the spaces and ask the team about homes, amenities and availability.",
    action: { label: "Book your experience", href: "/book-visit" },
  },
  contact: {
    text: `You can reach the MEMCO Skyline team at ${PHONE} or ${EMAIL}. The Experience Centre is in Singasandra, South Bengaluru.`,
    action: { label: "Call the team", href: `tel:${PHONE.replace(/[^+\d]/g, "")}` },
  },
  rera: {
    text: `The RERA registration number shown on this site is ${RERA}. Please verify project and purchase details with the sales team before making a decision.`,
    action: { label: "Contact the team", href: `mailto:${EMAIL}` },
  },
  concept: {
    text: "Jutaku combines a private home with access to a larger shared lifestyle. The idea is a compact place of your own, with more room for work, play and community beyond its walls.",
    action: { label: "Read the concept", href: "/#project" },
  },
  other: {
    text: "I can help with homes, pricing, amenities, location and visits. For a specific question, the MEMCO Skyline team can help directly.",
    action: { label: "Contact the team", href: `mailto:${EMAIL}` },
  },
};

const intentPatterns: [ChatTopic, RegExp][] = [
  ["investmentComparison", /\b(roi|returns?|appreciation|rental offset|rent\w*|yield|acquisition|ticket size|15,?500|1\.6\s*(?:cr|crore))\b/i],
  ["investment", /\b(invest\w*|benefits?|smart ownership|revenue.sharing)\b/i],
  ["visit", /\b(book|booking|visits?|tour|appointment|walkthrough|viewing|schedule|reserve)\b/i],
  ["experience", /\b(jutaku experience|experience cent(?:re|er))\b/i],
  ["pricing", /\b(prices?|pricing|cost|budget|lakh|lakhs|payment|emi|finance|expensive)\b/i],
  ["location", /\b(where|address|location|metro|distance|commute|begur|singasandra|hosa|electronic city|nearby)\b/i],
  ["amenities", /\b(amenit|pool|swim|gym|fitness|rooftop|sport|pickleball|squash|garden|park|cowork|co-work|studio|kitchen|dining|wellness|yoga)\w*/i],
  ["homes", /\b(homes?|houses?|apartments?|flats?|units?|floors?|sizes?|square feet|sq\.?\s*ft|layouts?|bedrooms?|available|availability)\b/i],
  ["contact", /\b(contact|call|phone|number|email|talk|speak|sales|agent|whatsapp)\b/i],
  ["rera", /\b(rera|registration|registered)\b/i],
  ["concept", /\b(jutaku|concept|project|what is|tell me about|ownership)\b/i],
];

export function answerChat(question: string): ChatReply {
  const input = question.trim();
  const topic = intentPatterns.find(([, pattern]) => pattern.test(input))?.[0] ?? "other";
  return { topic, ...answers[topic] };
}
