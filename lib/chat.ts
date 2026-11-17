import { ADDRESS, EMAIL, PHONE, RERA } from "@/lib/data";
import { ROUTE } from "@/lib/nearby-route";

export type ChatTopic = "homes" | "amenities" | "infrastructure" | "location" | "pricing" | "investment" | "investmentComparison" | "visit" | "experience" | "contact" | "rera" | "concept" | "other";
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
    text: "Smart ownership pairs a right-sized private home with around 50,000 sq ft of planned shared spaces. Music rooms, hosting kitchens and workspaces are there for occasions that need more room, alongside wellness, sport and rooftop spaces.",
    action: { label: "See the amenities", href: "/#amenities" },
  },
  infrastructure: {
    text: "The current building plan specifies high-speed Mitsubishi lifts at 9 km/h, dedicated service shafts and dual garbage chutes. Even floors are planned with clubrooms. Confirm final specifications and layouts with the MEMCO team.",
    action: { label: "See the building plan", href: "/floor-plans" },
  },
  location: {
    text: `The site is ${ADDRESS}. From Jutaku, Singasandra Metro is about ${ROUTE[0].distance} by road to the ${ROUTE[0].direction}, and Hosa Road Metro about ${ROUTE[1].distance} to the ${ROUTE[1].direction}. Road routes may vary.`,
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
        { title: "Metro within reach", body: `About ${ROUTE[0].distance} by road from Jutaku to Singasandra Metro.` },
        { title: "Complete ecosystem", body: "50,000+ sq ft of experience zones." },
        { title: "Smart ownership", body: "Keep private space right-sized while planned shared rooms expand what you can use." },
      ] },
    ],
    action: { label: "Speak with the team", href: "/#contact" },
  },
  investmentComparison: {
    text: "The published Jutaku concept pairs a private Urban Unit of around 500 sq ft with access to a wider 50,000 sq ft amenity plan. The site mentions revenue-sharing opportunities from bookable spaces, but it does not publish a guaranteed return or rental yield.",
    details: [
      "Homes are advertised from ₹68.5 lakhs, with premiums for floor rise, corner and east-facing units. Confirm the current price, charges and terms with the project team.",
      "Any resale appreciation, rental income or revenue share depends on future conditions and the applicable documents; none is guaranteed.",
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
    text: "Jutaku's smart ownership idea keeps the private Urban Unit right-sized while occasional-use spaces become part of a planned, shared community ecosystem. Music rooms, hosting kitchens and workspaces are examples; access and booking terms should be confirmed with the team.",
    action: { label: "Read the concept", href: "/#project" },
  },
  other: {
    text: "I can help with MEMCO Skyline Jutaku. Ask me about its homes, amenities, location, pricing or visits.",
  },
};

const intentPatterns: [ChatTopic, RegExp][] = [
  ["investmentComparison", /\b(roi|returns?|appreciation|rental offset|rent\w*|yield|acquisition|ticket size|15,?500|1\.6\s*(?:cr|crore))\b/i],
  ["investment", /\b(invest\w*|benefits?|revenue.sharing)\b/i],
  ["visit", /\b(book|booking|visits?|tour|appointment|walkthrough|viewing|schedule|reserve)\b/i],
  ["experience", /\b(jutaku experience|experience cent(?:re|er))\b/i],
  ["pricing", /\b(prices?|pricing|cost|budget|lakh|lakhs|payment|emi|finance|expensive)\b/i],
  ["location", /\b(where|address|location|metro|distance|commute|begur|singasandra|hosa|electronic city|nearby)\b/i],
  ["infrastructure", /\b(infrastructure|elevators?|lifts?|mitsubishi|shafts?|garbage|chutes?|even floors?|clubrooms?.*(?:floor|level)|(?:floor|level).*clubrooms?)\b/i],
  ["amenities", /\b(amenit|pool|swim|gym|fitness|rooftop|sport|pickleball|squash|garden|park|cowork|co-work|studio|kitchen|dining|wellness|yoga|clubroom|music|hosting)\w*/i],
  ["homes", /\b(homes?|houses?|apartments?|flats?|units?|floors?|sizes?|square feet|sq\.?\s*ft|layouts?|bedrooms?|available|availability)\b/i],
  ["contact", /\b(contact|call|phone|number|email|talk|speak|sales|agent|whatsapp)\b/i],
  ["rera", /\b(rera|registration|registered)\b/i],
  ["concept", /\b(memco|jutaku|concept|project|what is|tell me about|ownership)\b/i],
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
