/**
 * Illustration data for home-plan preview cards only. These generated units are
 * not a project inventory and must not imply an actual floor count or availability.
 */
export type UnitType = "URBAN" | "CORNER";
export type UnitStatus = "available" | "sold" | "hold";
export type Room = { label: string; rect_m: [number, number, number, number] };
export type Unit = {
  code: string; level: number; pos: number; type: UnitType;
  carpet_sqft: number; balcony_sqft: number; facing: string;
  footprint_m: [number, number, number, number];   // x, y, w, h on the plate (metres)
  rooms: Room[]; status: UnitStatus;
};
export type Zone = { id: string; name: string; area: string; rect_m: [number, number, number, number] };
export type Level = { level: number; label: string; kind: "homes" | "amenity" | "lobby" | "rooftop"; plate: "A" | null; sharedWith: string; units: Unit[]; zones?: Zone[] };

export const PLATE_M: [number, number] = [30, 20];   // plate footprint in metres

const URBAN_ROOMS: Room[] = [
  { label: "Living & Dining", rect_m: [0, 0, 4.2, 3.6] },
  { label: "Kitchen", rect_m: [4.2, 0, 3.3, 2.2] },
  { label: "Bedroom", rect_m: [0, 3.6, 3.6, 3.4] },
  { label: "Bath", rect_m: [3.6, 3.6, 1.9, 2.1] },
  { label: "Study", rect_m: [5.5, 2.2, 2, 2.0] },
  { label: "Balcony", rect_m: [3.6, 5.7, 3.9, 1.3] },
];
const CORNER_ROOMS: Room[] = [
  { label: "Living & Dining", rect_m: [0, 0, 4.6, 3.8] },
  { label: "Kitchen", rect_m: [4.6, 0, 3.4, 2.4] },
  { label: "Bedroom", rect_m: [0, 3.8, 3.8, 3.6] },
  { label: "Bath", rect_m: [3.8, 3.8, 2, 2.2] },
  { label: "Study", rect_m: [5.8, 2.4, 2.2, 2.0] },
  { label: "Balcony", rect_m: [3.8, 6, 4.2, 1.4] },
];

const POSITIONS: { pos: number; type: UnitType; footprint: [number, number, number, number]; facing: string }[] = [
  { pos: 1, type: "CORNER", footprint: [0, 0, 7.5, 7.5], facing: "North · Central greens" },
  { pos: 2, type: "URBAN", footprint: [7.5, 0, 7.5, 7.5], facing: "North · Central greens" },
  { pos: 3, type: "URBAN", footprint: [15, 0, 7.5, 7.5], facing: "North · Central greens" },
  { pos: 4, type: "CORNER", footprint: [22.5, 0, 7.5, 7.5], facing: "North-east · Greens & road" },
  { pos: 5, type: "CORNER", footprint: [0, 12.5, 7.5, 7.5], facing: "South-west · Road side" },
  { pos: 6, type: "URBAN", footprint: [7.5, 12.5, 7.5, 7.5], facing: "South · Road · Metro side" },
  { pos: 7, type: "URBAN", footprint: [15, 12.5, 7.5, 7.5], facing: "South · Road · Metro side" },
  { pos: 8, type: "CORNER", footprint: [22.5, 12.5, 7.5, 7.5], facing: "South-east · Road side" },
];

function seededSold(level: number, pos: number) {
  // deterministic ~25 % "sold" so the demo is stable between reloads
  return ((level * 7 + pos * 13) % 4) === 0;
}

function buildLevels(): Level[] {
  const out: Level[] = [];
  for (const l of [3, 4]) {
    const code = String(l).padStart(2, "0");
    const shared = "Illustrative layout preview";
    const units: Unit[] = POSITIONS.map((p) => ({
      code: `${code}${String(p.pos).padStart(2, "0")}`, level: l, pos: p.pos, type: p.type,
      carpet_sqft: p.type === "CORNER" ? 588 : 504, balcony_sqft: p.type === "CORNER" ? 52 : 50,
      facing: p.facing, footprint_m: p.footprint, rooms: p.type === "CORNER" ? CORNER_ROOMS : URBAN_ROOMS,
      status: seededSold(l, p.pos) ? "sold" : "available",
    }));
    out.push({ level: l, label: `Level ${code}`, kind: "homes", plate: "A", sharedWith: shared, units });
  }
  return out;
}

let cache: Level[] | null = null;
/** Single reader — later swapped for the CMS / Sheet endpoint without touching the explorer. */
export function getInventory(): Level[] { return (cache ??= buildLevels()); }
export const getLevel = (l: number) => getInventory().find((x) => x.level === l)!;
export const homeLevels = () => getInventory().filter((x) => x.kind === "homes").map((x) => x.level);
/** a level opens in the explorer if it has homes or an amenity plan */
export const hasPlate = (l: Level) => l.kind === "homes" || !!l.zones?.length;
export const findUnit = (code: string) => { for (const l of getInventory()) { const u = l.units.find((x) => x.code === code); if (u) return u; } return null; };
export const typeName = (t: UnitType) => (t === "CORNER" ? "Corner Urban Unit" : "Urban Unit");
export const SAMPLE_NOTE = "Sample layout, not a MEMCO Skyline drawing";
