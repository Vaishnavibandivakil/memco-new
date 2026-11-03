import { ADDRESS, EMAIL, PHONE, RERA } from "@/lib/data";
import { ROUTE } from "@/lib/nearby-route";

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
    text: "Jutaku plans 646 Urban Units of around 500 sq ft, with access to shared spaces for work, wellness, dining and sport. The available layouts and prices should be confirmed with the MEMCO team.",
    action: { label: "Explore the homes", href: "/#project" },
  },
  amenities: {
    text: "The amenity plan covers around 50,000 sq ft. It includes a 56 ft rooftop pool, an 18,800 sq ft sports deck, a 12,800 sq ft wellness hub, Culinary Studios, creator rooms and Serenity Park.",
    action: { label: "See the amenities", href: "/#amenities" },
  },
  location: {
    text: `The site is ${ADDRESS}. Singasandra Metro is approximately ${ROUTE[0].distance} to the ${ROUTE[0].direction}, and Hosa Road Metro is ${ROUTE[1].distance} to the ${ROUTE[1].direction}, measured in a straight line. Travel distances vary by route.`,
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
        { title: "Metro within reach", body: `About ${ROUTE[0].distance} straight-line from Singasandra Metro.` },
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
    text: "Jutaku's idea is private ownership with shared access: an Urban Unit of around 500 sq ft and a wider 50,000 sq ft amenity plan for work, fitness, food, sport and time outdoors.",
    action: { label: "Read the concept", href: "/#project" },
  },
  other: {
    text: "I can help with MEMCO Skyline Jutaku. Ask me about its homes, amenities, location, pricing or visits.",
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

export function unknownJutakuAnswer(): ChatReply {
  return {
    topic: "other",
    text: "That’s a Jutaku project question, but I don’t have a confirmed answer here. Please check with the project team for the latest details.",
    action: { label: "Contact the team", href: "/#contact" },
  };
}

export function answerChat(question: string): ChatReply {
  const input = question.trim();
  if (/\b(founder|who founded|ceo|chairman|leadership)\b/i.test(input) && /\b(jutaku|skyline)\b/i.test(input)) return unknownJutakuAnswer();
  const topic = intentPatterns.find(([, pattern]) => pattern.test(input))?.[0] ?? "other";
  return { topic, ...answers[topic] };
}
