export type BlogStory = {
  slug: string;
  category: string;
  title: string;
  summary: string;
  image: string;
  alt: string;
};

// Editorial topics for the journal preview. Full articles can be added at /blog later.
export const BLOG_STORIES: BlogStory[] = [
  {
    slug: "right-sized-living",
    category: "The home",
    title: "The art of right-sized living",
    summary: "A private Urban Unit, shaped around everyday routines.",
    image: "/images/intro/living.webp",
    alt: "Jutaku living room with a warm, open layout",
  },
  {
    slug: "shared-by-design",
    category: "The community",
    title: "More room, shared by design",
    summary: "Music rooms, hosting kitchens and workspaces beyond the front door.",
    image: "/images/intro/creator-studio.webp",
    alt: "Jutaku creator studio with space to meet and work",
  },
  {
    slug: "rooftop-life",
    category: "The rooftop",
    title: "A different view of the everyday",
    summary: "Open-air spaces and a planned pool above the city.",
    image: "/images/rooftop-pool.jpg",
    alt: "Illustrative rooftop pool at Jutaku",
  },
  {
    slug: "connected-location",
    category: "The neighbourhood",
    title: "Between Begur Road and Hosa Road",
    summary: "A closer look at the connections around Jutaku.",
    image: "/images/jutaku-exterior-hero.webp",
    alt: "Illustrative view of MEMCO Skyline Jutaku",
  },
  {
    slug: "experience-centre",
    category: "The experience",
    title: "Step inside the Experience Centre",
    summary: "See the spaces and ideas behind Jutaku in person.",
    image: "/images/experience-centre-new.webp",
    alt: "Jutaku Experience Centre interior",
  },
];
