"use client";

import { useEffect, useRef, useState } from "react";
import { ArcElement, Chart as ChartJS, PolarAreaController, RadialLinearScale, type Plugin } from "chart.js";

ChartJS.register(ArcElement, PolarAreaController, RadialLinearScale);

const TOTAL = 500.45;
const AREAS = [
  { label: "Private living", value: 327.13, colors: ["#82c19b", "#006e42"] },
  { label: "Mechanical & utilities", value: 85.23, colors: ["#cde6d3", "#4d9e70"] },
  { label: "Corridors & safety lobbies", value: 49, colors: ["#e3eacb", "#93a967"] },
  { label: "Club amenities", value: 39.09, colors: ["#ffc9ae", "#e43d3b"] },
] as const;

const format = (value: number) => value.toFixed(2);
const percentage = (value: number) => `${(value / TOTAL * 100).toFixed(2)}%`;
// The petal lengths are deliberately compressed so the smaller allocations stay readable.
const displayValue = (value: number) => .46 + .33 * Math.sqrt(value / AREAS[0].value);

const petalAnnotations: Plugin<"polarArea"> = {
  id: "jutakuPetalAnnotations",
  beforeDatasetsDraw(chart) {
    const arcs = chart.getDatasetMeta(0).data as ArcElement[];
    const scale = chart.scales.r as RadialLinearScale | undefined;
    if (!scale || !arcs.length) return;
    const { ctx } = chart;
    const radius = scale.drawingArea * .96;
    ctx.save();
    ctx.strokeStyle = "#b6cbbd";
    ctx.lineWidth = 1.2;
    ctx.setLineDash([2, 4]);
    arcs.forEach((arc) => {
      const start = arc.startAngle + .035;
      const end = arc.endAngle - .035;
      const inner = radius * .11;
      ctx.beginPath();
      ctx.moveTo(arc.x + Math.cos(start) * inner, arc.y + Math.sin(start) * inner);
      ctx.lineTo(arc.x + Math.cos(start) * radius, arc.y + Math.sin(start) * radius);
      ctx.arc(arc.x, arc.y, radius, start, end);
      ctx.lineTo(arc.x + Math.cos(end) * inner, arc.y + Math.sin(end) * inner);
      ctx.closePath();
      ctx.stroke();
    });
    ctx.restore();
  },
  afterDatasetsDraw(chart) {
    const arcs = chart.getDatasetMeta(0).data as ArcElement[];
    const { ctx } = chart;
    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    arcs.forEach((arc, index) => {
      const mid = (arc.startAngle + arc.endAngle) / 2;
      const distance = arc.outerRadius * .58;
      const x = arc.x + Math.cos(mid) * distance;
      const y = arc.y + Math.sin(mid) * distance;
      ctx.fillStyle = index === 0 ? "#fff" : "#10241a";
      ctx.font = `600 ${Math.max(14, Math.min(23, arc.outerRadius * .105))}px Montserrat, sans-serif`;
      ctx.fillText(`${Math.round(AREAS[index].value)}`, x, y);
    });
    ctx.restore();
  },
};

export function AreaBreakdownChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const active = hovered ?? selected;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const chart = new ChartJS(canvas, {
      type: "polarArea",
      data: {
        labels: AREAS.map((area) => area.label),
        datasets: [{
          data: AREAS.map((area) => displayValue(area.value)),
          backgroundColor: (context) => {
            const area = AREAS[context.dataIndex];
            if (!area) return "#006e42";
            const { ctx, chartArea } = context.chart;
            if (!chartArea) return area.colors[1];
            const centerX = (chartArea.left + chartArea.right) / 2;
            const centerY = (chartArea.top + chartArea.bottom) / 2;
            const gradient = ctx.createRadialGradient(centerX, centerY, 12, centerX, centerY, Math.min(chartArea.width, chartArea.height) * .48);
            gradient.addColorStop(0, area.colors[0]);
            gradient.addColorStop(1, area.colors[1]);
            return gradient;
          },
          borderWidth: 0,
          borderRadius: 20,
          spacing: 8,
          hoverOffset: 0,
        }],
      },
      plugins: [petalAnnotations],
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 750 },
        layout: { padding: 28 },
        scales: { r: { display: false, min: 0, max: 1, startAngle: 45 } },
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false },
        },
        onHover: (_, elements) => setHovered((current) => current === (elements[0]?.index ?? null) ? current : (elements[0]?.index ?? null)),
        onClick: (_, elements) => { if (elements[0]) setSelected(elements[0].index); },
      },
    });
    return () => chart.destroy();
  }, []);

  const select = (index: number) => {
    setSelected(index);
  };

  return (
    <figure className="st-chart" data-rise>
      <div className="st-chart-copy">
        <figcaption className="st-chart-head">
          <h3>Inside 500.45 sq ft.</h3>
          <p>A right-sized private home, with planned music rooms, hosting kitchens and workspaces for the moments that need more room.</p>
        </figcaption>
        <div className="st-chart-key" aria-label="Area categories">
          <div className="st-chart-key-heading"><span>Standard unit breakdown</span><span>500.45 sq ft SBA</span></div>
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
              <span className="st-chart-key-index"><i style={{ backgroundColor: area.colors[1] }} aria-hidden="true" />0{index + 1}</span>
              <span className="st-chart-key-main"><span>{area.label}</span><span className="st-chart-key-track" aria-hidden="true"><i style={{ width: percentage(area.value), backgroundColor: area.colors[1] }} /></span></span>
              <span className="st-chart-key-figure"><strong>{format(area.value)}</strong><small>sq ft <em>{percentage(area.value)}</em></small></span>
            </button>
          ))}
        </div>
      </div>
      <div className="st-polar-visual">
        <canvas ref={canvasRef} role="img" aria-label="Four-part radial chart showing the standard unit's 500.45 square foot super built-up area" />
        <span className="st-polar-center" aria-hidden="true">500.45<small>sq ft total</small></span>
      </div>
    </figure>
  );
}
