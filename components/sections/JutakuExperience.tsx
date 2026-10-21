const EXPERIENCES = [
  { number: "01", title: "Make room for ideas", category: "Work · Create · Connect", image: "/images/kanso-coworking.webp", alt: "Shared coworking studio" },
  { number: "02", title: "Find your own rhythm", category: "Move · Play · Recharge", image: "/images/pilates-studio.webp", alt: "Pilates and movement studio" },
  { number: "03", title: "Come together", category: "Cook · Share · Celebrate", image: "/images/club-community-kitchen.webp", alt: "Community kitchen and dining space" },
];

export function JutakuExperience() {
  return (
    <section className="jx" aria-labelledby="jutaku-experience-title">
      <header className="jx-head">
        <div className="jx-heading">
          <p className="lbl">A new way to live · Jutaku</p>
          <h2 id="jutaku-experience-title" className="disp">JUTAKU<br />EXPERIENCE</h2>
        </div>
        <p className="jx-intro">Your home is just the beginning. Step into thoughtfully made spaces for work, wellbeing and the everyday moments that bring people together.</p>
        <span className="jx-mark" aria-hidden="true">J.</span>
      </header>
      <div className="jx-grid">
        {EXPERIENCES.map((experience) => (
          <article className="jx-card" key={experience.number}>
            <figure className="jx-image">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={experience.image} alt={experience.alt} loading="lazy" />
              <span className="jx-number lbl">{experience.number}</span>
            </figure>
            <div className="jx-card-copy">
              <h3 className="caps-serif">{experience.title}</h3>
              <p className="lbl">{experience.category}</p>
            </div>
          </article>
        ))}
      </div>
      <footer className="jx-foot">
        <span className="lbl">646 private spaces · One shared ecosystem</span>
        <span className="lbl">Memco Skyline · Begur, Bengaluru</span>
      </footer>
    </section>
  );
}
