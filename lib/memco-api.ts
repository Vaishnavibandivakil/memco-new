export const MEMCO_API_BASE_URL = (process.env.MEMCO_API_BASE_URL || "https://api.memcoskyline.com").replace(/\/$/, "");
export const MEMCO_CRM_BASE_URL = (process.env.MEMCO_CRM_BASE_URL || "https://crm.memcoskyline.com").replace(/\/$/, "");

function serviceFetch(baseUrl: string, path: string, init?: RequestInit) {
  return fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      ...init?.headers,
    },
    cache: "no-store",
    signal: AbortSignal.timeout(12_000),
  });
}

export async function memcoApiFetch(path: string, init?: RequestInit) {
  return serviceFetch(MEMCO_API_BASE_URL, path, init);
}

export async function memcoCrmFetch(path: string, init?: RequestInit) {
  return serviceFetch(MEMCO_CRM_BASE_URL, path, init);
}

export async function readJson(response: Response): Promise<Record<string, unknown>> {
  try {
    const value: unknown = await response.json();
    return value && typeof value === "object" && !Array.isArray(value)
      ? value as Record<string, unknown>
      : {};
  } catch {
    return {};
  }
}

export function responseMessage(value: Record<string, unknown>, fallback: string) {
  for (const key of ["error", "detail", "message"]) {
    if (typeof value[key] === "string" && value[key].trim()) return value[key].trim();
    if (Array.isArray(value[key])) {
      const messages = value[key].flatMap((item) => item && typeof item === "object" && "msg" in item && typeof item.msg === "string" ? [item.msg] : []);
      if (messages.length) return messages.join(" ");
    }
  }
  return fallback;
}
