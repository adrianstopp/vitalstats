import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { fetchCountries, fmtNum, INDICATORS, type Country, type WBPoint } from "@/lib/countries";
import { fetchWBLatest, fetchWBSeries } from "@/lib/wb";

export const Route = createFileRoute("/country/$code")({
  component: CountryPage,
});

function CountryPage() {
  const { code } = Route.useParams();
  const navigate = useNavigate();
  const [country, setCountry] = useState<Country | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [stats, setStats] = useState<Record<string, { value: number; year: string } | null>>({});
  const [loadingStats, setLoadingStats] = useState(true);
  const [history, setHistory] = useState<WBPoint[]>([]);

  useEffect(() => {
    fetchCountries().then((all) => {
      const c = all.find((x) => x.cca3 === code);
      if (!c) setNotFound(true);
      else setCountry(c);
    });
  }, [code]);

  useEffect(() => {
    if (!country) return;
    setLoadingStats(true);
    setStats({});
    setHistory([]);

    Promise.all(
      INDICATORS.map(async (ind) => {
        const v = await fetchWBLatest(country.cca3, ind.id, 60);
        return [ind.id, v] as const;
      })
    ).then((results) => {
      setStats(Object.fromEntries(results));
      setLoadingStats(false);
    });

    fetchWBSeries(country.cca3, "SP.POP.TOTL", 40).then((pts) => {
      setHistory(pts.filter((p) => p.value !== null).reverse());
    });
  }, [country]);

  if (notFound) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="text-4xl font-black">Country not found</h1>
        <Link to="/" className="mt-6 inline-block rounded-md bg-primary px-4 py-2 text-primary-foreground">Back to search</Link>
      </div>
    );
  }

  if (!country) {
    return <div className="mx-auto max-w-7xl px-4 py-20 text-center text-muted-foreground">Loading…</div>;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-10 md:px-8 md:py-14">
      <div className="flex items-center justify-between">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary">
          <span aria-hidden>←</span> Back to search
        </Link>
        <button
          onClick={() => navigate({ to: "/" })}
          className="text-xs uppercase tracking-widest text-muted-foreground hover:text-primary"
        >
          New search
        </button>
      </div>

      <section
        className="relative overflow-hidden rounded-3xl p-8 md:p-10"
        style={{ background: "var(--gradient-ember)", boxShadow: "var(--shadow-warm)" }}
      >
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full opacity-30" style={{ background: "var(--sun)" }} />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="text-primary-foreground">
            <div className="text-sm font-medium uppercase tracking-widest opacity-80">
              {country.region}{country.subregion ? ` · ${country.subregion}` : ""}
            </div>
            <h1 className="mt-2 text-5xl font-black md:text-6xl">{country.name.common}</h1>
            <p className="mt-1 text-base opacity-80">{country.name.official}</p>
            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm opacity-90">
              <span><strong>Capital:</strong> {country.capital?.[0] ?? "—"}</span>
              <span><strong>Area:</strong> {country.area.toLocaleString()} km²</span>
              <span><strong>Languages:</strong> {country.languages ? Object.values(country.languages).slice(0, 3).join(", ") : "—"}</span>
            </div>
          </div>
          <img src={country.flags.svg} alt={`Flag of ${country.name.common}`} className="h-28 w-44 rounded-xl object-cover ring-4 ring-white/30" />
        </div>
      </section>

      {(() => {
        const wbPop = stats["SP.POP.TOTL"];
        const pop = wbPop?.value ?? country.population;
        const popSub = wbPop ? `${fmtNum(pop)} people · World Bank ${wbPop.year}` : `${fmtNum(pop)} people`;
        return (
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard label="Population" value={Math.round(pop).toLocaleString()} sub={popSub} accent="primary" />
            <StatCard label="Density" value={`${(pop / Math.max(country.area, 1)).toFixed(1)}`} sub="people / km²" accent="coral" />
            <StatCard label="Timezones" value={String(country.timezones.length)} sub={country.timezones.slice(0, 2).join(", ")} accent="sun" />
          </section>
        );
      })()}

      <section className="rounded-3xl border border-border bg-card/70 p-6 backdrop-blur md:p-8" style={{ boxShadow: "var(--shadow-soft)" }}>
        <div className="mb-5 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold">Recent indicators</h2>
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
                <div className="mt-2 text-2xl font-bold" style={{ color: "var(--ember)" }}>
                  {s ? ind.format(s.value) : loadingStats ? "…" : "—"}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{s ? `as of ${s.year}` : "no data"}</div>
              </div>
            );
          })}
        </div>
      </section>

      {history.length > 1 && <PopulationChart data={history} />}
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
      <h2 className="text-2xl font-bold">Population over time</h2>
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
