/* Project facts follow memcoskyline.com; editorial copy is written for this site. */
import { ROUTE } from "@/lib/nearby-route";

export const HOTSPOTS = [
  { id: "roof", x: 27, y: 10, mobileX: 50, mobileY: 43, title: "Skyline Aqua Lounge", body: "A 56 ft rooftop pool, with access planned around the clock.", photo: "/images/rooftop-pool.jpg" },
  { id: "homes", x: 29, y: 39, mobileX: 51, mobileY: 58, title: "Urban Units · 646", body: "A private home of around 500 sq ft, with a park, pool, studios and sports spaces on site.", photo: "/images/interior-bedroom.jpg" },
  { id: "park", x: 24, y: 80, mobileX: 50, mobileY: 73, title: "Serenity Park", body: "12,000 sq ft of planned paths, gardens and quiet places among the trees.", photo: "/images/walking-trails.jpg" },
];

export const REASONS = [
  {
    title: "Two metros. One address.",
    photo: "/images/balcony-exterior.webp",
    body: `From Jutaku on Manipal County Road, Singasandra and Hosa Road Yellow Line stations are about ${ROUTE[0].distance} and ${ROUTE[1].distance} away by road. Distances are approximate.`,
    tag: "Singasandra, South Bengaluru",
  },
  {
    title: "Own 500. Experience 50,000",
    photo: "/images/rooftop-court.jpg",
    body: "An Urban Unit of around 500 sq ft to make your own, connected to about 50,000 sq ft of planned spaces for work, sport, dining and leisure.",
    tag: "The Jutaku concept",
  },
  {
    title: "Rooted in this place",
    photo: "/images/design-trees.webp",
    body: "The project reports 348 trees surveyed and 115 transplanted from the construction path. Serenity Park is planned across 12,000 sq ft.",
    tag: "Serenity Park · 12,000 sq ft",
  },
];

export const AMENITY_SLIDES = [
  { name: "Arrival Lobby", label: "Arrival · Lobby", body: "Step inside the planned lobby before moving through the shared spaces at Jutaku.", photo: "/images/design-lobby.webp" },
  { name: "CCTV & Security", label: "Arrival · Security", body: "CCTV monitoring and 24/7 security are part of the plan for the building.", photo: "/images/amenity-cctv.webp" },
  { name: "Lift Access", label: "Everyday infrastructure", body: "The lift lobby connects the homes with shared spaces across the building.", photo: "/images/amenity-lift-lobby.webp" },
  { name: "Fire Safety", label: "Everyday infrastructure", body: "Fire exits and safety equipment are included in the building plan.", photo: "/images/amenity-fire-safety.webp" },
  { name: "Waste Sorting", label: "Everyday infrastructure", body: "Separate chutes for recyclables and organic waste make daily disposal simpler.", photo: "/images/amenity-waste-sorting.webp" },
  { name: "Wellness Hub", label: "Podium · 12,800 sq ft", body: "From a morning gym session to Pilates or a fitness class, make movement part of the day.", photo: "/images/amenity-yoga.jpg" },
  { name: "Culinary Studios", label: "6,000 sq ft", body: "Cook in the community kitchen; gather around a table in the private dining rooms.", photo: "/images/amenity-culinary.jpg" },
  { name: "Creator Studios", label: "Clubrooms · 4,000 sq ft", body: "Find a desk, record a podcast or make something in the DJ studio.", photo: "/images/amenity-creator-studio.jpg" },
  { name: "Experience Arena", label: "2,800 sq ft", body: "A space for screenings, performances and the evenings that bring everyone together.", photo: "/images/experience-arena.webp" },
  { name: "Rooftop BBQ Lounge", label: "Open-air social space", body: "Bring dinner into the open air, with barbecue seating and a rooftop view.", photo: "/images/amenity-rooftop-dining.jpg" },
  { name: "Skyline Sports Deck", label: "Rooftop · 18,800 sq ft", body: "Take a game of pickleball, box cricket or squash up to the roof.", photo: "/images/rooftop-futsal.jpg" },
  { name: "Skyline Aqua Lounge", label: "Rooftop · 2,600 sq ft", body: "Swim above the city in a 56 ft pool, with access planned around the clock.", photo: "/images/amenity-pool.jpg" },
];

export const PRICE = "₹68.5 Lakhs*";
export const PRICE_NOTE = "*Premium pricing applicable based on floor rise, corner unit, east facing.";
