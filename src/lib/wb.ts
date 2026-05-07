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
  perPage = 60,
): Promise<WBLatest> {
  try {
    // mrv=1 asks the World Bank for the single Most Recent Value (non-null),
    // which is more reliable than scanning per_page results when the latest
    // year hasn't been published yet for a given country/indicator.
    const res = await fetchWithRetry(
      `https://api.worldbank.org/v2/country/${code}/indicator/${indicator}?format=json&mrv=1`,
    );
    const json = await res.json();
    let points = (json[1] ?? []) as { date: string; value: number | null }[];
    let latest = points.find((p) => p.value !== null && p.value !== undefined);
    if (!latest) {
      // Fallback: pull a wider window and pick the newest non-null value.
      const res2 = await fetchWithRetry(
        `https://api.worldbank.org/v2/country/${code}/indicator/${indicator}?format=json&per_page=${perPage}`,
      );
      const json2 = await res2.json();
      points = (json2[1] ?? []) as { date: string; value: number | null }[];
      latest = points.find((p) => p.value !== null && p.value !== undefined);
    }
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
