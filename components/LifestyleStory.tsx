import Link from "next/link";
import { X } from "lucide-react";
import { LifestyleGallery } from "@/components/LifestyleGallery";
import { Reveals } from "@/components/Reveals";
import { SmoothScroll } from "@/components/SmoothScroll";
import { AMENITIES } from "@/lib/data";

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
    introduction: "A private home of about 500 sq ft, with places to work, train and unwind within the same community.",
    heroImage: "/images/interior-bedroom-open-plan.jpg", heroAlt: "Light-filled Jutaku bedroom with a desk and window seating",
    figures: [
      { value: "~500", label: "sq ft of private space" },
      { value: "50,000", label: "sq ft of shared spaces" },
      { value: "646", label: "private spaces" },
    ],
    ideaTitle: "A place of your own. More beyond the door.",
    idea: "MEMCO Skyline brings a compact private home together with useful spaces across the wider Jutaku ecosystem. Move from quiet time at home to work, fitness and open air without leaving the community.",
    sectionTitle: "Make room for every part of your day.",
    spaces: [
      { name: "Work close to home", detail: "The 4,000 sq ft Clubrooms & Creator Studios include co-working and podcasting spaces.", image: "/images/club-cowork.jpg", alt: "Jutaku co-working space", tag: "Work / create" },
      { name: "Find your rhythm", detail: "The 12,800 sq ft Performance & Wellness Hub brings together a gym, Pilates and fitness classes.", image: "/images/amenity-yoga.jpg", alt: "Wellness and yoga space", tag: "Move / rest" },
      { name: "Step outside", detail: "Serenity Park offers 12,000 sq ft of landscaped green space, walking trails and meditation zones.", image: "/images/walking-trails.jpg", alt: "Tree-lined walking trails", tag: "Open air" },
    ],
    other: { label: "Modern couple", href: "/modern-couple", image: "/images/residence-living.webp" },
  },
  couple: {
    name: "Modern couple", title: "Together.\nRoom to live.",
    introduction: "An efficient private home, with shared places for dinner, downtime and an active weekend just beyond it.",
    heroImage: "/images/residence-living.webp", heroAlt: "Warm, furnished Jutaku living space",
    figures: [
      { value: "~500", label: "sq ft of private space" },
      { value: "6,000", label: "sq ft of culinary studios" },
      { value: "18,800", label: "sq ft of Skyline Sports Deck" },
    ],
    ideaTitle: "Your home for two. A larger life around it.",
    idea: "At Jutaku, your private space connects to a 50,000 sq ft ecosystem. Spend an evening cooking together, take a swim above the city or meet friends in the shared spaces.",
    sectionTitle: "More ways to spend time together.",
    spaces: [
      { name: "Cook and gather", detail: "The 6,000 sq ft Culinary Studios include a community kitchen and private dining spaces.", image: "/images/amenity-culinary.jpg", alt: "Jutaku culinary studio and dining area", tag: "Dine / host" },
      { name: "Take a rooftop break", detail: "The Skyline Aqua Lounge has a 56 ft rooftop pool, panoramic views and 24/7 access.", image: "/images/amenity-pool.jpg", alt: "Rooftop swimming pool", tag: "Swim / unwind" },
      { name: "Play your way", detail: "The 18,800 sq ft Skyline Sports Deck is planned for pickleball, box cricket and squash.", image: "/images/pickleball.webp", alt: "Jutaku pickleball court", tag: "Play / connect" },
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
          <Link className="subpage-close persona-close" href="/#top" aria-label="Close and return to Jutaku home" title="Return to Jutaku home"><X size={20} strokeWidth={1.7} aria-hidden="true" /></Link>
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
          <p className="persona-kicker">Built for dual-income couples</p>
          <h2 id="persona-couple-title">Designed around <em>two careers</em>, together.</h2>
        </div>
        <div className="persona-couple-content"><div className="persona-couple-duo">
          <article data-rise>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/club-cowork.jpg" alt="Quiet work area at Jutaku" loading="lazy" />
            <div><span>01 / His space</span><h3>His unit.</h3><p>Built for calls, deep focus and a workday on his terms.</p></div>
          </article>
          <article data-rise>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/kanso-coworking.webp" alt="A second quiet work area at Jutaku" loading="lazy" />
            <div><span>02 / Her space</span><h3>Her unit.</h3><p>Room for ideas and uninterrupted flow on her terms.</p></div>
          </article>
        </div>
        <div className="persona-couple-together" data-fade>
          <p className="persona-kicker">His & her space, together</p>
          <h3><span>Two zones.</span><span>One seamless life.</span></h3>
          <p>Private when you need to focus. Connected when the day is yours to share.</p>
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
              <p data-fade data-delay="0.16">Your home connects to spaces for working, creating, meeting friends, moving and unwinding. These are all nine experience zones published by MEMCO Skyline.</p>
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
              <h2 id="persona-details-title">Made for more than the everyday.</h2>
            </div>
            <div className="persona-bento-stat" data-fade><span>01 / Private spaces</span><strong>646</strong><p>Homes designed around daily life.</p></div>
            <div className="persona-bento-stat" data-fade><span>02 / Site</span><strong>2.78</strong><p>Acres for the wider Jutaku community.</p></div>
            <figure className="persona-bento-image" data-rise>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/chandelier-atrium.webp" alt="Chandelier above the Jutaku atrium" loading="lazy" />
            </figure>
            <figure className="persona-bento-image" data-rise>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/interior-entry-new.jpg" alt="Jutaku home interior" loading="lazy" />
            </figure>
            <div className="persona-bento-stat" data-fade><span>03 / Outdoors</span><strong>74.5%</strong><p>Of the site planned as open space.</p></div>
            <div className="persona-bento-stat" data-fade><span>04 / Landscape</span><strong>290+</strong><p>Trees preserved on the site.</p></div>
            <div className="persona-bento-copy persona-bento-ownership" data-fade>
              <span>05 / Access</span>
              <h3>More beyond your door.</h3>
              <p>About 500 sq ft to call your own, connected to 50,000 sq ft of shared experiences. Bookable spaces may offer revenue-sharing opportunities, subject to the project terms.</p>
            </div>
            <div className="persona-bento-copy persona-bento-safety" data-fade>
              <span>06 / Peace of mind</span>
              <h3>Considered from the start.</h3>
              <p>Visitor management, 24/7 security, biometric access, fire safety and an intercom system are included in the published plan.</p>
            </div>
            <div className="persona-bento-copy persona-bento-design" data-fade>
              <span>07 / Design</span>
              <h3>Built around real life.</h3>
              <p>Usable layouts, natural light and ventilation, tree preservation, water conservation, energy-efficient materials and waste management. Backed by MEMCO’s 40+ years in engineering.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="persona-end" aria-labelledby="persona-visit-title">
        <div className="persona-end-panel">
          <div className="persona-end-copy">
            <p className="persona-kicker" data-fade>Visit Jutaku</p>
            <h2 id="persona-visit-title" data-fade data-delay="0.08">Come see what life here could feel like.</h2>
            <p className="persona-end-description" data-fade data-delay="0.16">Spend an hour at the Experience Centre. See the model home, learn about the shared spaces and get your questions answered in person.</p>
            <Link className="persona-action" href="/book-visit" data-fade data-delay="0.2">Book your visit</Link>
          </div>
          <figure className="persona-end-image" data-rise>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/experience-center-reception.webp" alt="Jutaku Experience Centre exterior" loading="lazy" />
          </figure>
        </div>
      </section>
      <section className="persona-next" aria-label="Another way to live at Jutaku">
        <div><p className="persona-kicker" data-fade>Continue exploring</p><h2 data-fade data-delay="0.08">Another way<br />to feel at home.</h2></div>
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
