import { memcoApiFetch, readJson, responseMessage } from "@/lib/memco-api";

type CrmSlot = {
  slot_start?: unknown;
  slot_end?: unknown;
  label?: unknown;
  available?: unknown;
  is_full?: unknown;
  booked_count?: unknown;
};

type ApiDay = { day_index?: unknown; date?: unknown; day_label?: unknown; slots?: unknown };

function isoForDay(baseIso: string, dayIndex: number) {
  const date = new Date(`${baseIso}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + dayIndex - 1);
  return date.toISOString().slice(0, 10);
}

export async function GET() {
  try {
    const response = await memcoApiFetch("/api/booking/availability");
    const result = await readJson(response);
    if (!response.ok) {
      return Response.json({ error: responseMessage(result, "Visit times are temporarily unavailable.") }, { status: 502 });
    }

    const baseIso = typeof result.base_iso === "string" && /^\d{4}-\d{2}-\d{2}$/.test(result.base_iso)
      ? result.base_iso
      : "";
    const sourceDays = Array.isArray(result.days) ? result.days as ApiDay[] : [];
    const days = sourceDays.flatMap((day) => {
      if (!Number.isInteger(day.day_index) || !Array.isArray(day.slots)) return [];
      const dayIndex = Number(day.day_index);
      const date = typeof day.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(day.date)
        ? day.date
        : isoForDay(baseIso, dayIndex);
      const slots = (day.slots as CrmSlot[]).flatMap((slot) => {
        if (typeof slot.slot_start !== "string" || !/^\d{2}:\d{2}$/.test(slot.slot_start)) return [];
        return [{
          slot_start: slot.slot_start,
          slot_end: typeof slot.slot_end === "string" ? slot.slot_end : "",
          label: typeof slot.label === "string" ? slot.label : slot.slot_start,
          available: typeof slot.available === "number" ? slot.available : slot.is_full === true ? 0 : 1,
          is_full: slot.is_full === true,
          booked_count: typeof slot.booked_count === "number" ? slot.booked_count : 0,
        }];
      });
      return [{
        day_index: dayIndex,
        date,
        day_label: typeof day.day_label === "string" ? day.day_label : "",
        slots,
      }];
    });

    if (!baseIso || !days.length) {
      console.error("MEMCO API returned invalid availability data", result);
      return Response.json({ error: "Visit times are temporarily unavailable." }, { status: 502 });
    }

    return Response.json({
      base_iso: baseIso,
      start_day_index: typeof result.start_day_index === "number" ? result.start_day_index : undefined,
      end_day_index: typeof result.end_day_index === "number" ? result.end_day_index : undefined,
      days,
    });
  } catch (error) {
    console.error("MEMCO API availability request failed", error);
    return Response.json({ error: "Visit times are temporarily unavailable." }, { status: 502 });
  }
}
