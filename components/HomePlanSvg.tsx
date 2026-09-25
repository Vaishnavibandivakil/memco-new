import type { Unit } from "@/lib/inventory";

const S = 44; // px per metre

/** Furnished home plan (asset G stand-in, procedural). Room labels + dims in m; entry marked with the red triangle. */
export function HomePlanSvg({ unit }: { unit: Unit }) {
  const W = Math.max(...unit.rooms.map((r) => r.rect_m[0] + r.rect_m[2])) * S + 2;
  const H = Math.max(...unit.rooms.map((r) => r.rect_m[1] + r.rect_m[3])) * S + 2;
  return (
    <svg className="plan-svg" viewBox={`0 0 ${W} ${H + 14}`} role="img" aria-label={`${unit.type === "CORNER" ? "Corner Urban Unit" : "Urban Unit"} plan, sample layout`}>
      <g transform="translate(1,13)">
        {unit.rooms.map((r) => {
          const [x, y, w, h] = r.rect_m.map((v) => v * S);
          const isBalc = r.label === "Balcony";
          return (
            <g key={r.label} className={`plan-room${isBalc ? " is-balcony" : ""}`}>
              <rect x={x} y={y} width={w} height={h} pathLength={1} />
              <text x={x + 8} y={y + 16} className="plan-label">{r.label.toUpperCase()}</text>
              <text x={x + 8} y={y + 28} className="plan-dim">{r.rect_m[2].toFixed(1)} × {r.rect_m[3].toFixed(1)} M</text>
              {r.label === "Bedroom" && <rect x={x + w * 0.2} y={y + h * 0.35} width={w * 0.55} height={h * 0.55} rx="3" className="plan-furn" pathLength={1} />}
              {r.label === "Living & Dining" && <><rect x={x + w * 0.1} y={y + h * 0.55} width={w * 0.5} height={h * 0.22} rx="3" className="plan-furn" pathLength={1} /><circle cx={x + w * 0.78} cy={y + h * 0.4} r={h * 0.16} className="plan-furn" pathLength={1} /></>}
              {r.label === "Kitchen" && <rect x={x + 6} y={y + h - 22} width={w - 12} height={14} className="plan-furn" pathLength={1} />}
              {r.label === "Bath" && <><rect x={x + 6} y={y + 6} width={w * 0.45} height={h * 0.32} rx="2" className="plan-furn" pathLength={1} /><circle cx={x + w - 14} cy={y + h - 14} r={7} className="plan-furn" pathLength={1} /></>}
            </g>
          );
        })}
        {/* entry — red triangle at the top of the plan */}
        <path d={`M ${W * 0.62 - 5} -12 l 10 0 l -5 9 z`} className="plan-entry" />
      </g>
    </svg>
  );
}
