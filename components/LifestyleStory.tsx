import Link from "next/link";
import { X } from "lucide-react";
import { LifestyleGallery } from "@/components/LifestyleGallery";
import { Reveals } from "@/components/Reveals";
import { SmoothScroll } from "@/components/SmoothScroll";
import { AMENITIES } from "@/lib/data";
import { ReturnLink } from "@/components/ReturnNavigation";

const experienceZones = [
  "performance-wellness", "clubrooms-creator", "culinary-studios",
  "experience-arena", "skyline-sports", "aqua-lounge",
  "ground-sports", "laundry-services", "serenity-park",
].map((id) => AMENITIES.find((amenity) => amenity.id === id)!);

type Story = {
  name: string;
  title: string;
  introduction: string;
  heroImage: string;
  heroAlt: string;
  figures: { value: string; label: string }[];
  ideaTitle: string;
  idea: string;
  sectionTitle: string;
  spaces: { name: string; detail: string; image: string; alt: string; tag: string }[];
  other: { label: string; href: string; image: string };
};

// Project facts and named spaces follow MEMCO Skyline's published project page.
export const LIFESTYLE_STORIES: Record<"individual" | "couple", Story> = {
  individual: {
    name: "Individual living", title: "Your space.\nYour pace.",
    introduction: "A private Urban Unit for the hours you keep to yourself. Co-working, fitness and open air are close at hand when you step out.",
    heroImage: "/images/interior-bedroom-open-plan.jpg", heroAlt: "Light-filled Jutaku bedroom with a desk and window seating",
    figures: [
      { value: "~500", label: "sq ft of private space" },
      { value: "50,000", label: "sq ft of shared spaces" },
      { value: "646", label: "private spaces" },
    ],
    ideaTitle: "A home for the quiet moments. Spaces for the rest.",
    idea: "Work in the Clubrooms & Creator Studios. Train in the Performance & Wellness Hub. Take the long way home through Serenity Park. Each is part of the same site.",
    sectionTitle: "Work, move and step outside.",
    spaces: [
      { name: "Clubrooms & Creator Studios", detail: "Co-working, podcasting and community dining across 4,000 sq ft.", image: "/images/club-cowork.jpg", alt: "Jutaku co-working space", tag: "Work / create" },
      { name: "Performance & Wellness Hub", detail: "A gym, Pilates, indoor sports and fitness classes across 12,800 sq ft.", image: "/images/amenity-yoga.jpg", alt: "Wellness and yoga space", tag: "Move / rest" },
      { name: "Serenity Park", detail: "12,000 sq ft of trails and gardens, with places to pause among the trees.", image: "/images/walking-trails.jpg", alt: "Tree-lined walking trails", tag: "Open air" },
    ],
    other: { label: "Modern couple", href: "/modern-couple", image: "/images/residence-living.webp" },
  },
  couple: {
    name: "Modern couple", title: "Together.\nRoom for both.",
    introduction: "A place to return to together. Co-working rooms for separate workdays; Culinary Studios, a rooftop pool and sports spaces for time shared.",
    heroImage: "/images/residence-living.webp", heroAlt: "Warm, furnished Jutaku living space",
    figures: [
      { value: "~500", label: "sq ft of private space" },
      { value: "6,000", label: "sq ft of culinary studios" },
      { value: "18,800", label: "sq ft of Skyline Sports Deck" },
    ],
    ideaTitle: "Room for two, and room to be yourself.",
    idea: "When the workday takes you in different directions, co-working rooms are close at hand. Later, meet in the Culinary Studios, by the rooftop pool or on the sports deck.",
    sectionTitle: "Cook, swim and play together.",
    spaces: [
      { name: "Culinary Studios", detail: "Across 6,000 sq ft, cook together or gather around a private dining table.", image: "/images/amenity-culinary.jpg", alt: "Jutaku culinary studio and dining area", tag: "Dine / host" },
      { name: "Skyline Aqua Lounge", detail: "A 56 ft pool on the roof, with panoramic views and access planned around the clock.", image: "/images/amenity-pool.jpg", alt: "Rooftop swimming pool", tag: "Swim / unwind" },
      { name: "Skyline Sports Deck", detail: "Pickleball, box cricket and squash above the city, across 18,800 sq ft.", image: "/images/pickleball.webp", alt: "Jutaku pickleball court", tag: "Play / connect" },
    ],
    other: { label: "Individual living", href: "/individual-living", image: "/images/interior-bedroom-open-plan.jpg" },
  },
};

export function LifestyleStory({ story }: { story: Story }) {
  return (
    <main className="persona-page" data-tone="light">
      <SmoothScroll />
      <section className="persona-hero" aria-labelledby="persona-title">
        <div className="persona-hero-copy">
          <p className="persona-kicker" data-fade>A way to live</p>
          <h1 id="persona-title" data-fade>{story.title.split("\n").map((line) => <span key={line}>{line}</span>)}</h1>
          <ReturnLink className="subpage-close persona-close" href="/#top" aria-label="Close and return to Jutaku home" title="Return to Jutaku home"><X size={20} strokeWidth={1.7} aria-hidden="true" /></ReturnLink>
          <div className="persona-hero-aside" data-fade data-delay="0.12">
            <p className="persona-lede">{story.introduction}</p>
            <Link className="persona-action" href="/book-visit">Book your visit</Link>
          </div>
        </div>
        <figure className="persona-hero-image" data-rise>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={story.heroImage} alt={story.heroAlt} />
        </figure>
      </section>

      <section className="persona-overview" aria-labelledby="persona-idea-title">
        <div className="persona-idea">
          <p className="persona-kicker" data-fade>The idea</p>
          <h2 id="persona-idea-title" data-fade data-delay="0.08">{story.ideaTitle}</h2>
          <p data-fade data-delay="0.16">{story.idea}</p>
        </div>
        <div className="persona-facts" aria-label="Jutaku project facts">
          {story.figures.map((figure, index) => <div key={figure.label} data-fade data-delay={String(index * 0.1)}><strong>{figure.value}</strong><span>{figure.label}</span></div>)}
        </div>
      </section>

      {story.name === "Modern couple" && <section className="persona-couple" aria-labelledby="persona-couple-title">
        <div className="persona-couple-heading" data-fade>
          <p className="persona-kicker">For two working lives</p>
          <h2 id="persona-couple-title">Room for <em>two routines</em>, together.</h2>
        </div>
        <div className="persona-couple-content"><div className="persona-couple-duo">
          <article data-rise>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/club-cowork.jpg" alt="Quiet work area at Jutaku" loading="lazy" />
            <div><span>01 / His space</span><h3>His unit.</h3><p>Room for the calls and focused hours, with the Clubrooms a short walk away.</p></div>
          </article>
          <article data-rise>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/kanso-coworking.webp" alt="A second quiet work area at Jutaku" loading="lazy" />
            <div><span>02 / Her space</span><h3>Her unit.</h3><p>Space for her ideas, with another setting for work in the Creator Studios.</p></div>
          </article>
        </div>
        <div className="persona-couple-together" data-fade>
          <p className="persona-kicker">His & her space, together</p>
          <h3><span>Two workdays.</span><span>One home.</span></h3>
          <p>Separate workdays. A place to meet again when they end.</p>
          <div aria-label="Spaces for two careers"><span>Private</span><span>Flexible</span><span>Connected</span></div>
        </div></div>
      </section>}

      <section className="persona-spaces" aria-labelledby="persona-spaces-title">
        <div className="persona-spaces-head"><p className="persona-kicker" data-fade>The ecosystem</p><h2 id="persona-spaces-title" data-fade data-delay="0.08">{story.sectionTitle}</h2></div>
        <LifestyleGallery spaces={story.spaces} />
      </section>

      <section className="persona-complete" aria-labelledby="persona-complete-title">
        <div className="persona-complete-inner">
          <div className="persona-complete-intro">
            <p className="persona-kicker" data-fade>Beyond the highlights</p>
            <div>
              <h2 id="persona-complete-title" data-fade data-delay="0.08">The whole Jutaku experience.</h2>
              <p data-fade data-delay="0.16">See the planned spaces for training, creating, cooking, sport and time outdoors. Each zone has a clear use.</p>
            </div>
          </div>
          <div className="persona-zone-list">
            {experienceZones.map((zone, index) => (
              <div className="persona-zone" key={zone.id} data-fade>
                <span className="persona-zone-number">{String(index + 1).padStart(2, "0")}</span>
                <div><h3>{zone.name}</h3><p>{zone.detail.join(" · ")}</p></div>
                <span className="persona-zone-area">{zone.area} sq ft</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="persona-details" aria-labelledby="persona-details-title">
        <div className="persona-details-inner">
          <div className="persona-bento">
            <div className="persona-bento-heading" data-fade>
              <p>The project</p>
              <h2 id="persona-details-title">A closer look at Jutaku.</h2>
            </div>
            <div className="persona-bento-stat" data-fade><span>01 / Private spaces</span><strong>646</strong><p>Urban Units within one managed community.</p></div>
            <div className="persona-bento-stat" data-fade><span>02 / Site</span><strong>2.78</strong><p>Acres for the wider Jutaku community.</p></div>
            <figure className="persona-bento-image" data-rise>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/chandelier-atrium.webp" alt="Chandelier at the Jutaku Experience Centre" loading="lazy" />
            </figure>
            <figure className="persona-bento-image" data-rise>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/interior-entry-new.jpg" alt="Jutaku home interior" loading="lazy" />
            </figure>
            <div className="persona-bento-stat" data-fade><span>03 / Outdoors</span><strong>74.5%</strong><p>Of the site planned as open space.</p></div>
            <div className="persona-bento-stat" data-fade><span>04 / Landscape</span><strong>290+</strong><p>Trees preserved on the site.</p></div>
            <div className="persona-bento-copy persona-bento-ownership" data-fade>
              <span>05 / Access</span>
              <h3>Private ownership, shared access.</h3>
              <p>Own an Urban Unit of around 500 sq ft and use the wider 50,000 sq ft amenity plan. Confirm access and booking details for individual spaces with the MEMCO team.</p>
            </div>
            <div className="persona-bento-copy persona-bento-safety" data-fade>
              <span>06 / Peace of mind</span>
              <h3>Security in the plan.</h3>
              <p>Visitor management, 24/7 security, biometric access, fire safety and an intercom system are included in the published plan.</p>
            </div>
            <div className="persona-bento-copy persona-bento-design" data-fade>
              <span>07 / Design</span>
              <h3>Design with a purpose.</h3>
              <p>The published design principles bring together functional layouts, natural light and ventilation, tree preservation, water conservation and energy-efficient materials.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="persona-end" aria-labelledby="persona-visit-title">
        <div className="persona-end-panel">
          <div className="persona-end-copy">
            <p className="persona-kicker" data-fade>Visit Jutaku</p>
            <h2 id="persona-visit-title" data-fade data-delay="0.08">See Jutaku for yourself.</h2>
            <p className="persona-end-description" data-fade data-delay="0.16">Visit the Experience Centre to see the model home, explore the amenity plan and speak to the team about pricing and availability.</p>
            <Link className="persona-action" href="/book-visit" data-fade data-delay="0.2">Book your visit</Link>
          </div>
          <figure className="persona-end-image" data-rise>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/experience-center-reception.webp" alt="Reception at the Jutaku Experience Centre" loading="lazy" />
          </figure>
        </div>
      </section>
      <section className="persona-next" aria-label="Another way to live at Jutaku">
        <div><p className="persona-kicker" data-fade>Continue exploring</p><h2 data-fade data-delay="0.08">Explore another<br />way to live here.</h2></div>
        <Link className="persona-next-link" href={story.other.href} data-rise>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={story.other.image} alt="" loading="lazy" />
          <span>{story.other.label}</span>
        </Link>
      </section>
      <Reveals />
    </main>
  );
}
