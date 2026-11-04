const INTERIORS = [
  {
    image: "/images/design-living-2.webp",
    alt: "Open living area with kitchen and seating",
    label: "Living",
  },
  {
    image: "/images/interior-kitchen-new.jpg",
    alt: "Light-filled kitchen with warm wood cabinetry",
    label: "Kitchen",
  },
  {
    image: "/images/interior-bedroom-wardrobe.jpg",
    alt: "Bedroom with wardrobe and soft natural light",
    label: "Bedroom",
  },
] as const;

export function FloorPlanInteriors() {
  return (
    <section className="plan-interiors" aria-labelledby="plan-interiors-title">
      <div className="plan-interiors-head">
        <p>Interior views</p>
        <h3 id="plan-interiors-title">A closer look inside</h3>
      </div>
      <div className="plan-interiors-grid">
        {INTERIORS.map(({ image, alt, label }, index) => (
          <figure className={index === 0 ? "plan-interiors-image plan-interiors-image--main" : "plan-interiors-image"} key={label}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image} alt={alt} loading="lazy" />
            <figcaption>{label}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
