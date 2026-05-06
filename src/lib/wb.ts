// Shared World Bank fetch helper with retry + wider window so transient
// network errors and missing latest-year values don't surface as "no data".

export type WBLatest = { value: number; year: string } | null;

async function fetchWithRetry(url: string, attempts = 3): Promise<Response> {
  let lastErr: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url);
      if (res.ok) return res;
      lastErr = new Error(`HTTP ${res.status}`);
    } catch (e) {
      lastErr = e;
    }
    // small backoff: 250ms, 600ms
    await new Promise((r) => setTimeout(r, 250 + i * 350));
  }
  throw lastErr ?? new Error("fetch failed");
}

export async function fetchWBLatest(
  code: string,
  indicator: string,
  perPage = 20,
): Promise<WBLatest> {
  try {
    const res = await fetchWithRetry(
      `https://api.worldbank.org/v2/country/${code}/indicator/${indicator}?format=json&per_page=${perPage}`,
    );
    const json = await res.json();
    const points = (json[1] ?? []) as { date: string; value: number | null }[];
    const latest = points.find((p) => p.value !== null && p.value !== undefined);
    return latest
      ? { value: latest.value as number, year: latest.date }
      : null;
  } catch {
    return null;
  }
}

export async function fetchWBSeries(
  code: string,
  indicator: string,
  perPage = 40,
): Promise<{ date: string; value: number | null }[]> {
  try {
    const res = await fetchWithRetry(
      `https://api.worldbank.org/v2/country/${code}/indicator/${indicator}?format=json&per_page=${perPage}`,
    );
    const json = await res.json();
    return (json[1] ?? []) as { date: string; value: number | null }[];
  } catch {
    return [];
  }
}
