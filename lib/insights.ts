export type InsightVideo = {
  id: string;
  title: string;
  previewTitle?: string;
  category: string;
  description: string;
  image: string;
  fallbackImage: string;
};

// Video IDs and editorial topics are from MEMCO Skyline's News & Events section.
export const INSIGHT_VIDEOS: InsightVideo[] = [
  {
    id: "vFXXJuXyhbw",
    title: "The vision for Jutaku",
    previewTitle: "The project vision",
    category: "Site & vision",
    description: "The project's concept, planning and design before the community takes shape.",
    image: "/images/homepage-master.webp",
    fallbackImage: "/images/homepage-master.webp",
  },
  {
    id: "MgZtkpUkwnI",
    title: "Every tree has a place",
    previewTitle: "Tree relocation",
    category: "The landscape",
    description: "A look at MEMCO Skyline's tree transplantation work.",
    image: "/images/serenity-park.webp",
    fallbackImage: "/images/serenity-park.webp",
  },
  {
    id: "hgZz-oA7Oz4",
    title: "The Experience Centre is open",
    previewTitle: "Experience Centre",
    category: "Experience Centre",
    description: "A first look inside the place where Jutaku comes to life.",
    image: "/images/experience-center-reception.webp",
    fallbackImage: "/images/experience-center-reception.webp",
  },
  {
    id: "y-n4mi0bihA",
    title: "A day with Sumit Nagal",
    previewTitle: "Sumit at Jutaku",
    category: "People & events",
    description: "Sumit Nagal and Sunil Yajaman visit the Jutaku Experience Centre.",
    image: "https://i.ytimg.com/vi/y-n4mi0bihA/maxresdefault.jpg",
    fallbackImage: "/images/experience-center.webp",
  },
  {
    id: "HyKLDx3Xbws",
    title: "From DJing to cricket",
    category: "Inside Jutaku",
    description: "Sumit Nagal explores the different ways to spend a day at Jutaku.",
    image: "/images/club-jamming.jpg",
    fallbackImage: "/images/club-jamming.jpg",
  },
  {
    id: "LktomrqfmNg",
    title: "Meet Sumit Nagal",
    category: "People & events",
    description: "Jutaku's brand ambassador on the thinking behind the project.",
    image: "https://i.ytimg.com/vi/LktomrqfmNg/maxresdefault.jpg",
    fallbackImage: "/images/pickleball.webp",
  },
  {
    id: "FjBli6q4MgY",
    title: "Around the amenities",
    previewTitle: "The amenities",
    category: "The ecosystem",
    description: "A tour of the shared spaces planned across Jutaku.",
    image: "/images/amenity-pool.jpg",
    fallbackImage: "/images/amenity-pool.jpg",
  },
];
