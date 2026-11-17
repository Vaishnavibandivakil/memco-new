"use client";

import { useEffect, useRef, useState } from "react";
import { BubbleController, Chart as ChartJS, LinearScale, PointElement, Tooltip } from "chart.js";

ChartJS.register(BubbleController, LinearScale, PointElement, Tooltip);

const TOTAL = 500.45;
const AREAS = [
  { label: "Private living", value: 327.13, detail: "Space inside the home for everyday living." },
  { label: "Mechanical & utilities", value: 85.23, detail: "Building services such as lifts, staircases, and utility rooms." },
  { label: "Corridors & safety lobbies", value: 49, detail: "The calculated balance for residential corridors and safety lobbies." },
  { label: "Club amenities", value: 39.09, detail: "An allocation toward shared sport, dining, and club spaces." },
] as const;

const format = (value: number) => value.toFixed(2);
const percentage = (value: number) => `${(value / TOTAL * 100).toFixed(2)}%`;

function AreaBubble({ area }: { area: typeof AREAS[number] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const radius = (width: number) => width * (0.23 + 0.21 * Math.sqrt(area.value / AREAS[0].value));
    const chart = new ChartJS(canvas, {
      type: "bubble",
      data: {
        datasets: [{
          label: area.label,
          data: [{ x: 0, y: 0, r: radius(canvas.parentElement?.clientWidth ?? 180) }],
          borderWidth: 0,
          clip: false,
          hoverRadius: 4,
          backgroundColor: (context) => {
            const { chartArea, ctx } = context.chart;
            if (!chartArea) return "#e82930";
            const x = (chartArea.left + chartArea.right) / 2;
            const y = (chartArea.top + chartArea.bottom) / 2;
            const r = radius(chartArea.width);
            const gradient = ctx.createRadialGradient(x - r * .25, y - r * .28, r * .02, x, y, r);
            gradient.addColorStop(0, "#ffe0ce");
            gradient.addColorStop(.38, "#fa7155");
            gradient.addColorStop(1, "#df3028");
            return gradient;
          },
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 650 },
        scales: {
          x: { display: false, min: -1, max: 1 },
          y: { display: false, min: -1, max: 1 },
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            displayColors: false,
            backgroundColor: "#123a2b",
            padding: 12,
            callbacks: { label: () => `${format(area.value)} sq ft · ${percentage(area.value)}` },
          },
        },
        onResize: (resized, size) => {
          resized.data.datasets[0].data[0] = { x: 0, y: 0, r: radius(Math.min(size.width, size.height)) };
          resized.update("none");
        },
      },
    });
    return () => chart.destroy();
  }, [area]);

  return (
    <span className="st-bubble-visual">
      <canvas ref={canvasRef} aria-hidden="true" />
    </span>
  );
}

export function AreaBreakdownChart() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const active = hovered ?? selected;
  const focus = active === null ? null : AREAS[active];

  return (
    <figure className="st-chart" data-rise>
      <figcaption className="st-chart-head">
        <p className="lbl">SBA breakdown per unit</p>
        <strong>500.45 <span>sq ft total saleable built-up area</span></strong>
      </figcaption>
      <div className="st-bubbles" aria-label="Standard unit area breakdown">
        {AREAS.map((area, index) => (
          <button
            type="button"
            key={area.label}
            className={`st-bubble-card${active === index ? " is-active" : ""}`}
            aria-pressed={selected === index}
            aria-label={`${area.label}: ${format(area.value)} square feet, ${percentage(area.value)} of the standard unit`}
            onClick={() => setSelected(index)}
            onMouseEnter={() => setHovered(index)}
            onMouseLeave={() => setHovered(null)}
            onFocus={() => setHovered(index)}
            onBlur={() => setHovered(null)}
          >
            <span className="st-bubble-label"><strong>{percentage(area.value)}</strong><span>{area.label}</span></span>
            <AreaBubble area={area} />
            <span className="st-bubble-value">{format(area.value)} sq ft</span>
          </button>
        ))}
      </div>
      <p className="st-chart-detail" aria-live="polite">{focus ? `${focus.label} · ${format(focus.value)} sq ft. ${focus.detail}` : "Select a circle to explore its area allocation."}</p>
      <p className="st-chart-note">Circle sizes are illustrative. The 49.00 sq ft corridor balance makes the stated figures total 500.45 sq ft; the supplied graphic rounds it to 49.01 sq ft.</p>
    </figure>
  );
}
