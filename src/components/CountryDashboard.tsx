import { useEffect, useMemo, useState } from "react";

type Country = {
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
  currencies?: Record<string, { name: string; symbol?: string }>;
  timezones: string[];
  latlng?: [number, number];
  maps?: { googleMaps: string };
};

type WBPoint = { date: string; value: number | null };

const REST_URL =
  "https://restcountries.com/v3.1/all?fields=cca3,name,flag,flags,capital,region,subregion,population,area,languages,timezones";

const INDICATORS: { id: string; label: string; format: (v: number) => string }[] = [
  { id: "SP.DYN.LE00.IN", label: "Life expectancy (years)", format: (v) => v.toFixed(1) },
  { id: "SP.DYN.TFRT.IN", label: "Fertility rate (births/woman)", format: (v) => v.toFixed(2) },
  { id: "SP.POP.GROW", label: "Population growth (annual %)", format: (v) => `${v.toFixed(2)}%` },
  { id: "SP.URB.TOTL.IN.ZS", label: "Urban population", format: (v) => `${v.toFixed(1)}%` },
  { id: "SP.POP.0014.TO.ZS", label: "Population ages 0–14", format: (v) => `${v.toFixed(1)}%` },
  { id: "SP.POP.65UP.TO.ZS", label: "Population ages 65+", format: (v) => `${v.toFixed(1)}%` },
  { id: "SP.DYN.IMRT.IN", label: "Infant mortality (per 1k)", format: (v) => v.toFixed(1) },
  { id: "NY.GDP.PCAP.CD", label: "GDP per capita (USD)", format: (v) => `$${Math.round(v).toLocaleString()}` },
];

function fmtNum(n: number) {
  if (n >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return n.toString();
}

export function CountryDashboard() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Country | null>(null);
  const [stats, setStats] = useState<Record<string, { value: number; year: string } | null>>({});
  const [loadingStats, setLoadingStats] = useState(false);
  const [history, setHistory] = useState<WBPoint[]>([]);

  useEffect(() => {
    fetch(REST_URL)
      .then((r) => r.json())
      .then((data: Country[]) => {
        const sorted = data.sort((a, b) => a.name.common.localeCompare(b.name.common));
        setCountries(sorted);
        const initial = sorted.find((c) => c.cca3 === "JPN") ?? sorted[0];
        setSelected(initial);
      })
      .catch(() => {});
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return countries;
    const q = query.toLowerCase();
    return countries.filter((c) => c.name.common.toLowerCase().includes(q));
  }, [countries, query]);

  useEffect(() => {
    if (!selected) return;
    setLoadingStats(true);
    setStats({});
    setHistory([]);

    Promise.all(
      INDICATORS.map(async (ind) => {
        try {
          const res = await fetch(
            `https://api.worldbank.org/v2/country/${selected.cca3}/indicator/${ind.id}?format=json&per_page=10`
          );
          const json = await res.json();
          const points: WBPoint[] = json[1] ?? [];
          const latest = points.find((p) => p.value !== null);
          return [ind.id, latest ? { value: latest.value as number, year: latest.date } : null] as const;
        } catch {
          return [ind.id, null] as const;
        }
      })
    ).then((results) => {
      setStats(Object.fromEntries(results));
      setLoadingStats(false);
    });

    // population history (last 30y)
    fetch(`https://api.worldbank.org/v2/country/${selected.cca3}/indicator/SP.POP.TOTL?format=json&per_page=40`)
      .then((r) => r.json())
      .then((j) => {
        const pts: WBPoint[] = (j[1] ?? []).filter((p: WBPoint) => p.value !== null).reverse();
        setHistory(pts);
      })
      .catch(() => {});
  }, [selected]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-14">
      <header className="mb-10 md:mb-14">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium uppercase tracking-widest text-clay backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          Live data · World Bank & REST Countries
        </div>
        <h1 className="mt-5 text-5xl font-black leading-[0.95] md:text-7xl">
          The pulse of <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-ember)" }}>every nation</span>.
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
          Search any country to explore the most recent demographic indicators —
          population, life expectancy, fertility, urbanisation and more.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-[320px_1fr]">
        {/* Sidebar */}
        <aside className="rounded-3xl border border-border bg-card/70 p-4 backdrop-blur" style={{ boxShadow: "var(--shadow-soft)" }}>
          <input
            value={query}
            onChange={(e) => {
              const v = e.target.value;
              setQuery(v);
              const q = v.trim().toLowerCase();
              if (!q) return;
              const exact = countries.find((c) => c.name.common.toLowerCase() === q);
              if (exact) setSelected(exact);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const q = query.trim().toLowerCase();
                if (!q) return;
                const match =
                  countries.find((c) => c.name.common.toLowerCase() === q) ??
                  countries.find((c) => c.name.common.toLowerCase().startsWith(q)) ??
                  countries.find((c) => c.name.common.toLowerCase().includes(q));
                if (match) {
                  setSelected(match);
                  setQuery("");
                }
              }
            }}
            placeholder="Search & press Enter (e.g. Sweden)…"
            className="w-full rounded-xl border border-border bg-background/70 px-4 py-3 text-sm outline-none ring-ring focus:ring-2"
          />
          <ul className="mt-4 max-h-[60vh] space-y-1 overflow-y-auto pr-1">
            {filtered.map((c) => {
              const active = selected?.cca3 === c.cca3;
              return (
                <li key={c.cca3}>
                  <button
                    onClick={() => setSelected(c)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm transition ${
                      active
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "hover:bg-secondary"
                    }`}
                  >
                    <span className="text-lg">{c.flag}</span>
                    <span className="flex-1 truncate font-medium">{c.name.common}</span>
                    <span className={`text-xs ${active ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                      {fmtNum(c.population)}
                    </span>
                  </button>
                </li>
              );
            })}
            {countries.length === 0 && (
              <li className="px-3 py-6 text-center text-sm text-muted-foreground">Loading countries…</li>
            )}
          </ul>
        </aside>

        {/* Main */}
        <main className="space-y-6">
          {selected && (
            <>
              <section
                className="relative overflow-hidden rounded-3xl p-8 md:p-10"
                style={{ background: "var(--gradient-ember)", boxShadow: "var(--shadow-warm)" }}
              >
                <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full opacity-30" style={{ background: "var(--sun)" }} />
                <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                  <div className="text-primary-foreground">
                    <div className="text-sm font-medium uppercase tracking-widest opacity-80">{selected.region}{selected.subregion ? ` · ${selected.subregion}` : ""}</div>
                    <h2 className="mt-2 text-5xl font-black md:text-6xl">{selected.name.common}</h2>
                    <p className="mt-1 text-base opacity-80">{selected.name.official}</p>
                    <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm opacity-90">
                      <span><strong>Capital:</strong> {selected.capital?.[0] ?? "—"}</span>
                      <span><strong>Area:</strong> {selected.area.toLocaleString()} km²</span>
                      <span><strong>Languages:</strong> {selected.languages ? Object.values(selected.languages).slice(0, 3).join(", ") : "—"}</span>
                    </div>
                  </div>
                  <img src={selected.flags.svg} alt={`Flag of ${selected.name.common}`} className="h-28 w-44 rounded-xl object-cover ring-4 ring-white/30" />
                </div>
              </section>

              <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <StatCard label="Population" value={selected.population.toLocaleString()} sub={`${fmtNum(selected.population)} people`} accent="primary" />
                <StatCard label="Density" value={`${(selected.population / Math.max(selected.area, 1)).toFixed(1)}`} sub="people / km²" accent="coral" />
                <StatCard label="Timezones" value={String(selected.timezones.length)} sub={selected.timezones.slice(0, 2).join(", ")} accent="sun" />
              </section>

              <section className="rounded-3xl border border-border bg-card/70 p-6 backdrop-blur md:p-8" style={{ boxShadow: "var(--shadow-soft)" }}>
                <div className="mb-5 flex items-end justify-between">
                  <div>
                    <h3 className="text-2xl font-bold">Recent indicators</h3>
                    <p className="text-sm text-muted-foreground">Latest values from the World Bank Open Data API</p>
                  </div>
                  {loadingStats && <span className="text-xs text-muted-foreground">Loading…</span>}
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {INDICATORS.map((ind) => {
                    const s = stats[ind.id];
                    return (
                      <div key={ind.id} className="rounded-2xl border border-border bg-background/50 p-4">
                        <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{ind.label}</div>
                        <div className="mt-2 text-2xl font-bold text-ember">
                          {s ? ind.format(s.value) : loadingStats ? "…" : "—"}
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">{s ? `as of ${s.year}` : "no data"}</div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {history.length > 1 && <PopulationChart data={history} />}
            </>
          )}
        </main>
      </div>

      <footer className="mt-16 border-t border-border pt-6 text-center text-xs text-muted-foreground">
        Data: <a className="underline hover:text-primary" href="https://restcountries.com" target="_blank" rel="noreferrer">REST Countries</a> · <a className="underline hover:text-primary" href="https://data.worldbank.org" target="_blank" rel="noreferrer">World Bank Open Data</a>
      </footer>
    </div>
  );
}

function StatCard({
  label, value, sub, accent,
}: { label: string; value: string; sub: string; accent: "primary" | "coral" | "sun" }) {
  const bg =
    accent === "primary" ? "var(--gradient-ember)" :
    accent === "coral" ? "linear-gradient(135deg, var(--coral), var(--primary))" :
    "var(--gradient-warm)";
  return (
    <div className="relative overflow-hidden rounded-2xl p-6 text-primary-foreground" style={{ background: bg, boxShadow: "var(--shadow-soft)" }}>
      <div className="text-xs font-semibold uppercase tracking-widest opacity-85">{label}</div>
      <div className="mt-2 text-4xl font-black">{value}</div>
      <div className="mt-1 text-sm opacity-85">{sub}</div>
    </div>
  );
}

function PopulationChart({ data }: { data: WBPoint[] }) {
  const w = 800, h = 240, pad = 30;
  const values = data.map((d) => d.value as number);
  const min = Math.min(...values), max = Math.max(...values);
  const xs = (i: number) => pad + (i * (w - 2 * pad)) / (data.length - 1);
  const ys = (v: number) => h - pad - ((v - min) / Math.max(max - min, 1)) * (h - 2 * pad);
  const path = data.map((d, i) => `${i === 0 ? "M" : "L"} ${xs(i).toFixed(1)} ${ys(d.value as number).toFixed(1)}`).join(" ");
  const area = `${path} L ${xs(data.length - 1)} ${h - pad} L ${xs(0)} ${h - pad} Z`;
  const firstYear = data[0].date, lastYear = data[data.length - 1].date;

  return (
    <section className="rounded-3xl border border-border bg-card/70 p-6 backdrop-blur md:p-8" style={{ boxShadow: "var(--shadow-soft)" }}>
      <h3 className="text-2xl font-bold">Population over time</h3>
      <p className="text-sm text-muted-foreground">{firstYear} → {lastYear}</p>
      <svg viewBox={`0 0 ${w} ${h}`} className="mt-4 w-full">
        <defs>
          <linearGradient id="warm-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--coral)" stopOpacity="0.55" />
            <stop offset="100%" stopColor="var(--sun)" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#warm-fill)" />
        <path d={path} fill="none" stroke="var(--ember)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <text x={pad} y={h - 8} fontSize="11" fill="var(--muted-foreground)">{firstYear}: {fmtNum(values[0])}</text>
        <text x={w - pad} y={h - 8} fontSize="11" textAnchor="end" fill="var(--muted-foreground)">{lastYear}: {fmtNum(values[values.length - 1])}</text>
      </svg>
    </section>
  );
}
