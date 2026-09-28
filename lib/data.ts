export type Room = {
  slug: string;
  index: string;
  name: string;
  title: [string, string];
  italic: string;
  photo: string;
  caption: string;
};

/* Four interior renders from memcoskyline.com (gallery/flat-interior). Captions are the site's own. */
export const ROOMS: Room[] = [
  { slug: "bedroom", index: "01", name: "The Bedroom", title: ["The", "Bedroom"], italic: "Bed against the wardrobe wall, balcony light from the left.", photo: "/images/interior-bedroom.jpg", caption: "Master Bedroom" },
  { slug: "kitchen", index: "02", name: "The Kitchen", title: ["The", "Kitchen"], italic: "Counter on two walls, so nothing is more than a step away.", photo: "/images/interior-kitchen.jpg", caption: "L-Shaped Modern Kitchen" },
  { slug: "entry", index: "03", name: "The Entry", title: ["The", "Entry"], italic: "The kitchen as you see it from the front door.", photo: "/images/interior-kitchen-entry.jpg", caption: "Kitchen Entry View" },
  { slug: "bathroom", index: "04", name: "The Bathroom", title: ["The", "Bathroom"], italic: "Glass shower and one long counter.", photo: "/images/interior-bathroom.jpg", caption: "Modern Bathroom" },
];

export type Amenity = { id: string; index: string; name: string; desc: string; area?: string; photo: string; detail: string[] };

/* Zones, areas, descriptions and sub-bullets are verbatim from memcoskyline.com/amenities. */
export const AMENITIES: Amenity[] = [
  { id: "skyline-sports", index: "01", name: "Skyline Sports Deck", desc: "Rooftop multi-sport facilities", area: "18,800", photo: "/images/rooftop-court.jpg", detail: ["Pickleball + Box Cricket + Squash"] },
  { id: "performance-wellness", index: "02", name: "Performance & Wellness Hub", desc: "Performance training and wellness facilities", area: "12,800", photo: "/images/sports-gym.jpg", detail: ["Fully Equipped Gym", "Pilates Studio", "Indoor Sports", "Fitness Classes"] },
  { id: "wellness", index: "03", name: "Wellness & Recovery", desc: "Yoga, Zumba and a recovery zone inside the Hub", photo: "/images/recovery-zone.webp", detail: ["Yoga & Zumba Studio", "Recovery Zone", "Meditation Zones"] },
  { id: "serenity-park", index: "04", name: "Serenity Park", desc: "Private green spaces and meditation zones", area: "12,000", photo: "/images/walking-trails.jpg", detail: ["Walking Trails", "Garden Spaces", "Meditation Zones"] },
  { id: "culinary-studios", index: "05", name: "Culinary Studios", desc: "Shared kitchen and dining spaces", area: "6,000", photo: "/images/club-community-kitchen.webp", detail: ["Community Kitchen", "Private Dining"] },
  { id: "clubrooms-creator", index: "06", name: "Clubrooms & Creator Studios", desc: "Professional studios and collaborative clubrooms", area: "4,000", photo: "/images/club-podcast.jpg", detail: ["Podcasting Room", "DJ Studios", "Co-working", "Community Dining"] },
  { id: "experience-arena", index: "07", name: "Experience Arena", desc: "AV-enabled events and screenings", area: "2,800", photo: "/images/experience-arena.webp", detail: ["Events & Concerts", "Movie Screenings"] },
  { id: "aqua-lounge", index: "08", name: "Skyline Aqua Lounge", desc: "Rooftop pool with panoramic skyline views", area: "2,600", photo: "/images/rooftop-pool.jpg", detail: ["56 ft length", "24/7 access"] },
  { id: "ground-sports", index: "09", name: "Ground Sports", desc: "Open-air courts for quick active breaks", area: "1,200", photo: "/images/pickleball.webp", detail: ["Half Court Basketball"] },
  { id: "laundry-services", index: "10", name: "Laundry & Services", desc: "Daily convenience, handled on-site", area: "600", photo: "/images/experience-center-reception.webp", detail: ["Laundry Room", "Pressing Area"] },
];

export const WELLNESS_TABS = [
  { label: "01 Gym & Strength", photo: "/images/sports-gym.jpg", alt: "Fully equipped gym" },
  { label: "02 Pilates & Yoga", photo: "/images/sports-pilates.jpg", alt: "Pilates studio" },
  { label: "03 Recovery Zone", photo: "/images/recovery-zone.webp", alt: "Recovery zone" },
  { label: "04 Squash & Pickleball", photo: "/images/rooftop-squash.webp", alt: "Rooftop squash court" },
];

export const RETREAT_TABS = [
  { label: "01 Serenity Park", photo: "/images/serenity-park.webp", alt: "Serenity Park" },
  { label: "02 Walking Trails", photo: "/images/walking-trails.jpg", alt: "Landscaped walking and jogging trail" },
  { label: "03 Garden Spaces", photo: "/images/design-trees.webp", alt: "Garden spaces with preserved trees" },
  { label: "04 Meditation Zones", photo: "/images/recovery-zone.webp", alt: "Meditation zone" },
  { label: "05 Gazebos", photo: "/images/gazebos.webp", alt: "Gazebos" },
];

export const COLLAGE = [
  { photo: "/images/interior-bedroom.jpg", alt: "Master bedroom", room: "bedroom" },
  { photo: "/images/interior-kitchen.jpg", alt: "L-shaped modern kitchen", room: "kitchen" },
  { photo: "/images/club-jamming.jpg", alt: "Jamming room", amenity: "clubrooms-creator" },
  { photo: "/images/rooftop-bbq.jpg", alt: "Rooftop BBQ lounge", amenity: "skyline-sports" },
  { photo: "/images/sports-bowling.webp", alt: "Bowling alley", amenity: "performance-wellness" },
];

export const NEARBY: [string, string][] = [
  ["Singasandra Metro", "0.6 km"],
  ["Hosa Road Metro", "1.2 km"],
  ["Electronic City", "3 km"],
  ["MG Road", "12 km"],
];

/* "Explore Nearby" category counts from the site's location data */
export const COUNTS: [string, number][] = [
  ["Healthcare", 10], ["IT Parks", 4], ["Commercial", 7], ["Metro", 14], ["Areas", 3], ["Hotels", 1], ["Education", 9],
];

export const PHONE = "+91-9187224980";
export const EMAIL = "info@memcoskyline.com";
export const RERA = "PRM/KA/RERA/1251/310/PR/240426/008602";
export const ADDRESS = "Off NH7 on Manipal County Road, Bengaluru 560068";

export type Post = { slug: string; kicker: string; title: string; excerpt: string; meta?: string; photo: string; alt: string };

/* News & Events, as published by MEMCO Skyline (copy from the site's "Stay Connected" feed) */
export const NEWS: Post[] = [
  { slug: "golden-hour", kicker: "Event", title: "Jutaku\u2019s Golden Hour", excerpt: "A first look at Jutaku, a community being built for people who work hard, live well and know their neighbours by name. A sundowner right where it is all coming up, with live music, a DJ and a sunset you will not want to miss.", meta: "22 August \u00b7 5:00 to 10:00 PM \u00b7 MEMCO Skyline, Singasandra", photo: "/images/rooftop-dining.jpg", alt: "Rooftop dining at sunset" },
  { slug: "tree-transplantation", kicker: "MEMCO", title: "Tree transplantation", excerpt: "348 trees surveyed. 115 stood in the construction path. Every one transplanted, zero lost.", photo: "/images/design-trees.webp", alt: "Preserved trees on the site" },
  { slug: "experience-center", kicker: "Walkthrough", title: "Experience Center walkthrough", excerpt: "Step inside the Urban Unit and see how ownership becomes a lifestyle, not just an address.", photo: "/images/experience-center-reception.webp", alt: "Experience Center reception" },
  { slug: "sumit-nagal", kicker: "Brand Ambassador", title: "Sumit Nagal", excerpt: "India\u2019s No.1 men\u2019s tennis player and JUTAKU Brand Ambassador. Less space, more possibility.", photo: "/images/rooftop-court.jpg", alt: "Rooftop sports court" },
  { slug: "amenities-tour", kicker: "Tour", title: "Amenities tour", excerpt: "50,000 sq ft across every Core. A different vibe for every evening, all one address.", photo: "/images/club-cowork.jpg", alt: "Co-working clubroom" },
];
