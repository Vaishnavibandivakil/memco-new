import { memcoCrmFetch, readJson, responseMessage } from "@/lib/memco-api";

type EnquiryRequest = {
  name?: unknown;
  phone?: unknown;
  email?: unknown;
  interest?: unknown;
  pageUrl?: unknown;
  utmSource?: unknown;
  utmMedium?: unknown;
  utmCampaign?: unknown;
  consent?: unknown;
};

export async function POST(request: Request) {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return Response.json({ error: "Please submit the enquiry form again." }, { status: 415 });
  }

  let details: EnquiryRequest;
  try {
    details = await request.json() as EnquiryRequest;
    if (!details || typeof details !== "object" || Array.isArray(details)) throw new Error("Invalid request");
  } catch {
    return Response.json({ error: "Please submit the enquiry form again." }, { status: 400 });
  }

  const name = typeof details.name === "string" ? details.name.trim() : "";
  const phone = typeof details.phone === "string" ? details.phone.trim() : "";
  const email = typeof details.email === "string" ? details.email.trim() : "";
  const interest = details.interest === "Self use" || details.interest === "Investment" ? details.interest : "";
  const phoneDigits = phone.replace(/\D/g, "");
  const validName = name.length >= 2 && name.length <= 100;
  const validPhone = phoneDigits.length >= 10 && phoneDigits.length <= 15;
  const validEmail = !email || (email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
  const validConsent = details.consent === true;

  if (!validName || !validPhone || !validEmail || !interest || !validConsent) {
    const fields: Record<string, string> = {};
    if (!validName) fields.name = "Enter your full name (2–100 characters).";
    if (!validPhone) fields.phone = "Enter a valid phone number with 10–15 digits.";
    if (!validEmail) fields.email = "Enter a valid email address.";
    if (!interest) fields.interest = "Choose self use or investment.";
    if (!validConsent) fields.consent = "Please agree to be contacted about your enquiry.";
    return Response.json({ error: Object.values(fields).join(" "), fields }, { status: 400 });
  }

  const optionalString = (value: unknown, max = 500) => typeof value === "string" ? value.trim().slice(0, max) : "";
  const leadBody = {
    name,
    phone: phoneDigits,
    ...(email ? { email } : {}),
    message: `Interested in Jutaku for ${interest.toLowerCase()}.`,
    form_id: "jutaku-enquiry-form",
    page_url: optionalString(details.pageUrl, 1_000),
    utm_source: optionalString(details.utmSource),
    utm_medium: optionalString(details.utmMedium),
    utm_campaign: optionalString(details.utmCampaign),
  };

  try {
    const response = await memcoCrmFetch("/api/analytics/contact/capture", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(leadBody),
    });
    const result = await readJson(response);
    if (!response.ok || result.success === false) {
      console.error("MEMCO CRM rejected an enquiry", response.status, result);
      return Response.json({ error: responseMessage(result, "We couldn't submit your enquiry. Please try again shortly.") }, { status: response.status >= 400 && response.status < 500 ? 400 : 502 });
    }

    return Response.json({
      ok: true,
      status: typeof result.status === "string" ? result.status : "submitted",
      leadId: typeof result.lead_id === "string" ? result.lead_id : typeof result.id === "string" ? result.id : undefined,
    });
  } catch (error) {
    console.error("MEMCO CRM enquiry submission failed", error);
    return Response.json({ error: "Online enquiries are temporarily unavailable. Please try again shortly." }, { status: 502 });
  }
}
