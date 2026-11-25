import Link from "next/link";

const leaders = [
  { name: "Joshua Rajkumar", role: "CEO, MEMCO", note: "Leads MEMCO, the Bengaluru engineering company behind MEMCO Skyline." },
  { name: "Miriam Rajkumar", role: "Director, MEMCO", note: "Part of the parent company's leadership team as MEMCO expands into real estate." },
  { name: "VPS Raju", role: "Project Director, Real Estate", note: "Leads MEMCO's real estate project work and development direction." },
];

export function About() {
  return (
    <section id="about" className="about" data-tone="light" aria-labelledby="about-title">
      <div className="about-intro">
        <p className="lbl">About MEMCO Skyline</p>
        <h2 id="about-title">Built on <span>41 years</span> of MEMCO experience.</h2>
        <p>Jutaku is a MEMCO Skyline project backed by the experience of its parent company, MEMCO Associates. Founded in Bengaluru in 1985, MEMCO works across engineering, infrastructure and technology.</p>
        <a href="https://memco.in/" target="_blank" rel="noopener noreferrer">Meet the parent company <span aria-hidden="true">↗</span></a>
      </div>
      <div className="about-team">
        <div className="about-team-heading"><p className="lbl">The people behind MEMCO</p><a href="https://memco.in/leadership/" target="_blank" rel="noopener noreferrer">MEMCO leadership <span aria-hidden="true">↗</span></a></div>
        <div className="about-team-list">
          {leaders.map((person) => <article key={person.name}><h3>{person.name}</h3><p className="about-role">{person.role}</p><p>{person.note}</p></article>)}
        </div>
        <Link className="about-book" href="/book-visit">Meet the Jutaku team at the Experience Centre</Link>
      </div>
    </section>
  );
}
