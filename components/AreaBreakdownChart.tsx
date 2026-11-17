"use client";

import { useEffect, useRef, useState } from "react";
import { ArcElement, Chart as ChartJS, DoughnutController, Tooltip } from "chart.js";

ChartJS.register(ArcElement, DoughnutController, Tooltip);

const TOTAL = 500.45;
const AREAS = [
  { label: "Private living", value: 327.13, color: "#006e42", detail: "Space inside the home for everyday living." },
  { label: "Club amenities", value: 39.09, color: "#277e9a", detail: "An allocation toward shared sport, dining, and club spaces." },
  { label: "Corridors & safety lobbies", value: 49, color: "#cc634b", detail: "The calculated balance for residential corridors and safety lobbies." },
  { label: "Mechanical & utilities", value: 85.23, color: "#d49a18", detail: "Building services such as lifts, staircases, and utility rooms." },
] as const;

const format = (value: number) => value.toFixed(2);
const percentage = (value: number) => `${(value / TOTAL * 100).toFixed(2)}%`;

export function AreaBreakdownChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<ChartJS<"doughnut"> | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const active = hovered ?? selected;
  const focus = active === null ? null : AREAS[active];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const chart = new ChartJS(canvas, {
      type: "doughnut",
      data: {
        labels: AREAS.map((area) => area.label),
        datasets: [{
          data: AREAS.map((area) => area.value),
          backgroundColor: AREAS.map((area) => area.color),
          borderColor: "#f5f0e8",
          borderWidth: 3,
          hoverOffset: 9,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "62%",
        animation: { duration: 700 },
        plugins: {
          legend: { display: false },
          tooltip: {
            displayColors: false,
            backgroundColor: "#123a2b",
            padding: 12,
            callbacks: {
              label: (context) => `${format(Number(context.raw))} sq ft · ${percentage(Number(context.raw))}`,
            },
          },
        },
        onHover: (_, elements) => setHovered((current) => current === (elements[0]?.index ?? null) ? current : (elements[0]?.index ?? null)),
        onClick: (_, elements) => { if (elements[0]) setSelected(elements[0].index); },
      },
    });
    chartRef.current = chart;
    return () => { chart.destroy(); chartRef.current = null; };
  }, []);

  const select = (index: number) => {
    setSelected(index);
    chartRef.current?.setActiveElements([{ datasetIndex: 0, index }]);
    chartRef.current?.update();
  };

  return (
    <figure className="st-chart" data-rise>
      <figcaption className="st-chart-head">
        <p className="lbl">SBA breakdown per unit</p>
        <h3>Inside 500.45 sq ft.</h3>
      </figcaption>
      <div className="st-chart-visual">
        <canvas ref={canvasRef} role="img" aria-label="Doughnut chart of the standard unit's 500.45 square foot super built-up area" />
        <div className="st-chart-center" aria-live="polite">
          <strong>{format(focus?.value ?? TOTAL)}</strong>
          <span>{focus ? "sq ft" : "sq ft total"}</span>
          <small>{focus?.label ?? "Super built-up area"}</small>
        </div>
      </div>
      <div className="st-chart-key" aria-label="Area categories">
        {AREAS.map((area, index) => (
          <button
            type="button"
            key={area.label}
            className={active === index ? "is-active" : ""}
            aria-pressed={selected === index}
            onClick={() => select(index)}
            onMouseEnter={() => setHovered(index)}
            onMouseLeave={() => setHovered(null)}
            onFocus={() => setHovered(index)}
            onBlur={() => setHovered(null)}
          >
            <i style={{ backgroundColor: area.color }} aria-hidden="true" />
            <span>{area.label}</span>
            <b>{format(area.value)} <small>sq ft</small></b>
          </button>
        ))}
      </div>
      <p className="st-chart-detail" aria-live="polite">{focus?.detail ?? "Hover, tap, or choose a category to explore the area allocation."}</p>
      <p className="st-chart-note">The 49.00 sq ft corridor figure is calculated as the balance of the stated total; the supplied graphic labels it 49.01 sq ft.</p>
    </figure>
  );
}
