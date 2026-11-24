export type BlogStory = {
  slug: string;
  category: string;
  title: string;
  summary: string;
  image: string;
  alt: string;
  paragraphs: string[];
};

export const BLOG_STORIES: BlogStory[] = [
  {
    slug: "right-sized-living",
    category: "The home",
    title: "The art of right-sized living",
    summary: "A private Urban Unit, shaped around everyday routines.",
    image: "/images/intro/living.webp",
    alt: "Jutaku living room with a warm, open layout",
    paragraphs: [
      "At Jutaku, the standard Urban Unit is measured at 500.45 sq ft super built-up. The area breakdown assigns 327.13 sq ft to private living: a place for the routines of the day, from resting and cooking to working at home.",
      "A right-sized home starts with what you use every day. Activities that call for more room can happen beyond the front door, in shared spaces planned for the wider community.",
      "The private unit and the building work together. One gives you a base of your own; the planned music rooms, hosting kitchens and workspaces offer room for the moments that need it.",
    ],
  },
  {
    slug: "shared-by-design",
    category: "The community",
    title: "More room, shared by design",
    summary: "Music rooms, hosting kitchens and workspaces beyond the front door.",
    image: "/images/intro/creator-studio.webp",
    alt: "Jutaku creator studio with space to meet and work",
    paragraphs: [
      "Jutaku's plan treats shared rooms as an extension of the private home. Music rooms, creator studios, hosting kitchens and workspaces are intended for activities that do not need to occupy an apartment every day.",
      "Those spaces serve different rhythms: focused work, a meal with friends, or an evening spent making something. Each has a purpose, and together they add another dimension to life in the building.",
      "The idea is to keep the home personal while making more space available through the community. That balance is central to Jutaku's approach to urban living.",
    ],
  },
  {
    slug: "rooftop-life",
    category: "The rooftop",
    title: "A different view of the everyday",
    summary: "Open-air spaces and a planned pool above the city.",
    image: "/images/rooftop-pool.jpg",
    alt: "Illustrative rooftop pool at Jutaku",
    paragraphs: [
      "Jutaku's rooftop plan includes a 56 ft pool, alongside outdoor areas for sport and gathering. It adds another layer to a deliberately compact private home: room to move, pause and spend time outside the apartment.",
      "The Skyline Aqua Lounge is planned with around-the-clock access. Other rooftop spaces in the plan include a sports deck and places to dine in the open air.",
      "A swim, a game or a meal with friends can each have a place above the city. The roof is designed to be part of everyday life, rather than a view enjoyed only from below.",
    ],
  },
  {
    slug: "connected-location",
    category: "The neighbourhood",
    title: "Between Begur Road and Hosa Road",
    summary: "A closer look at the connections around Jutaku.",
    image: "/images/jutaku-exterior-hero.webp",
    alt: "Illustrative view of MEMCO Skyline Jutaku",
    paragraphs: [
      "Jutaku is on Manipal County Road in Singasandra, between Begur Road and Hosa Road. Its position connects the project to the surrounding neighbourhood and the wider city.",
      "Singasandra and Hosa Road Yellow Line stations are about 1.4 km and 1.2 km away respectively. Kudlu Gate and Beratena Agrahara are the next stops in either direction. These distances are approximate.",
      "The location page brings nearby transport, work destinations, schools and healthcare together, so you can explore what sits around the address as well as the route to it.",
    ],
  },
  {
    slug: "experience-centre",
    category: "The experience",
    title: "Step inside the Experience Centre",
    summary: "See the spaces and ideas behind Jutaku in person.",
    image: "/images/experience-centre-new.webp",
    alt: "Jutaku Experience Centre interior",
    paragraphs: [
      "The Jutaku Experience Centre is open for visitors. It offers a way to explore the project's ideas beyond the images on a screen and to speak with the MEMCO Skyline team in person.",
      "A visit is a chance to discuss the Urban Units, the planned shared spaces and the details that matter to your own routine. It can help connect the larger vision of Jutaku with the practical questions of choosing a home.",
      "If you would like to visit, the website's booking page lets you choose a preferred date and time for a Jutaku experience.",
    ],
  },
];
