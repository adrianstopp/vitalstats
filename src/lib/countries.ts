export type Country = {
  cca3: string;
  name: { common: string; official: string };
  flag: string;
  flags: { svg: string; png: string };
  capital?: string[];
  region: string;
  subregion?: string;
  population: number;
  area: number;
  languages?: Record<string, string>;
  timezones: string[];
};

export type WBPoint = { date: string; value: number | null };

const REST_URL =
  "https://restcountries.com/v3.1/all?fields=cca3,name,flag,flags,capital,region,population,area,languages,timezones";

let cache: Promise<Country[]> | null = null;

export function fetchCountries(): Promise<Country[]> {
  if (!cache) {
    cache = (async () => {
      const [restRes, wbRes] = await Promise.all([
        fetch(REST_URL).then((r) => r.json()).catch(() => [] as Country[]),
        // Latest World Bank population for every country in one call (mrnev=1
        // returns the most recent non-empty value, typically 2024 in 2026).
        fetch(
          "https://api.worldbank.org/v2/country/all/indicator/SP.POP.TOTL?format=json&mrnev=1&per_page=400",
        )
          .then((r) => r.json())
          .catch(() => null),
      ]);
      const data = (restRes as Country[]) ?? [];
      const wbMap = new Map<string, number>();
      if (Array.isArray(wbRes) && Array.isArray(wbRes[1])) {
        for (const row of wbRes[1] as { countryiso3code: string; value: number | null }[]) {
          if (row.countryiso3code && typeof row.value === "number") {
            wbMap.set(row.countryiso3code, row.value);
          }
        }
      }
      // Override REST Countries' stale population with the latest World Bank value.
      for (const c of data) {
        const v = wbMap.get(c.cca3);
        if (v) c.population = Math.round(v);
      }
      return data.sort((a, b) => a.name.common.localeCompare(b.name.common));
    })().catch(() => [] as Country[]);
  }
  return cache;
}

export function fmtNum(n: number) {
  if (n >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return n.toString();
}

export const INDICATORS: { id: string; label: string; format: (v: number) => string }[] = [
  { id: "SP.POP.TOTL", label: "Population (total)", format: (v) => fmtNum(v) },
  { id: "SP.DYN.CBRT.IN", label: "Birth rate (per 1k people)", format: (v) => v.toFixed(1) },
  { id: "SP.DYN.CDRT.IN", label: "Death rate (per 1k people)", format: (v) => v.toFixed(1) },
  { id: "SP.DYN.LE00.IN", label: "Life expectancy (years)", format: (v) => v.toFixed(1) },
  { id: "SP.DYN.TFRT.IN", label: "Fertility rate (births/woman)", format: (v) => v.toFixed(2) },
  { id: "SP.POP.GROW", label: "Population growth (annual %)", format: (v) => `${v.toFixed(2)}%` },
  { id: "SP.URB.TOTL.IN.ZS", label: "Urban population", format: (v) => `${v.toFixed(1)}%` },
  { id: "SP.POP.0014.TO.ZS", label: "Population ages 0–14", format: (v) => `${v.toFixed(1)}%` },
  { id: "SP.POP.65UP.TO.ZS", label: "Population ages 65+", format: (v) => `${v.toFixed(1)}%` },
  { id: "SP.DYN.IMRT.IN", label: "Infant mortality (per 1k)", format: (v) => v.toFixed(1) },
  { id: "NY.GDP.PCAP.CD", label: "GDP per capita (USD)", format: (v) => `$${Math.round(v).toLocaleString()}` },
  { id: "EN.ATM.PM25.MC.M3", label: "Air pollution (PM2.5 µg/m³)", format: (v) => v.toFixed(1) },
  { id: "EN.GHG.CO2.PC.CE.AR5", label: "CO₂ emissions (t per capita)", format: (v) => v.toFixed(2) },
];
