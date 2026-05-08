import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { fetchCountries, fmtNum, type Country } from "@/lib/countries";
import { HDI_2022 } from "@/lib/hdi";
import { fetchWBSeries } from "@/lib/wb";
import { useI18n } from "@/lib/i18n";

type Series = { date: string; value: number | null }[];

export const Route = createFileRoute("/compare/$a/$b")({
  component: ComparePage,
});

type Metric = {
  id: string;
  label: string;
  format: (v: number) => string;
  source: "wb" | "hdi";
  // World Bank indicator id when source === "wb"
  wb?: string;
  higherIsBetter?: boolean;
};

const METRICS: Metric[] = [
  { id: "pop", label: "Population", source: "wb", wb: "SP.POP.TOTL", format: (v) => fmtNum(v) },
  { id: "gdp", label: "GDP (current US$)", source: "wb", wb: "NY.GDP.MKTP.CD", format: (v) => `$${fmtNum(v)}`, higherIsBetter: true },
  { id: "gdppc", label: "GDP per capita (US$)", source: "wb", wb: "NY.GDP.PCAP.CD", format: (v) => `$${Math.round(v).toLocaleString()}`, higherIsBetter: true },
  { id: "hdi", label: "Human Development Index", source: "hdi", format: (v) => v.toFixed(3), higherIsBetter: true },
  { id: "energy", label: "Energy use (kg oil eq. per capita)", source: "wb", wb: "EG.USE.PCAP.KG.OE", format: (v) => Math.round(v).toLocaleString() },
  { id: "life", label: "Life expectancy (years)", source: "wb", wb: "SP.DYN.LE00.IN", format: (v) => v.toFixed(1), higherIsBetter: true },
];

type Val = { value: number; year: string } | null;

import { fetchWBLatest } from "@/lib/wb";
async function fetchWB(code: string, indicator: string): Promise<Val> {
  return fetchWBLatest(code, indicator);
}

async function fetchHDI(code: string): Promise<Val> {
  const v = HDI_2022[code];
  if (!v || v <= 0) return null;
  return { value: v, year: "2022" };
}

function ComparePage() {
  const { t } = useI18n();
  const { a, b } = Route.useParams();
  const [countries, setCountries] = useState<Country[]>([]);
  const [data, setData] = useState<Record<string, { a: Val; b: Val }>>({});
  const [loading, setLoading] = useState(true);
  const [popSeries, setPopSeries] = useState<{ a: Series; b: Series }>({ a: [], b: [] });
  const [gdpSeries, setGdpSeries] = useState<{ a: Series; b: Series }>({ a: [], b: [] });

  useEffect(() => { fetchCountries().then(setCountries); }, []);

  const ca = useMemo(() => countries.find((c) => c.cca3 === a) ?? null, [countries, a]);
  const cb = useMemo(() => countries.find((c) => c.cca3 === b) ?? null, [countries, b]);

  useEffect(() => {
    setLoading(true);
    setData({});
    Promise.all(
      METRICS.map(async (m) => {
        const fetcher = m.source === "wb"
          ? (code: string) => fetchWB(code, m.wb!)
          : (code: string) => fetchHDI(code);
        const [va, vb] = await Promise.all([fetcher(a), fetcher(b)]);
        return [m.id, { a: va, b: vb }] as const;
      }),
    ).then((r) => { setData(Object.fromEntries(r)); setLoading(false); });

    // 65-year history (World Bank coverage starts in 1960 — the longest free
    // open dataset for country-level population/GDP).
    Promise.all([
      fetchWBSeries(a, "SP.POP.TOTL", 200),
      fetchWBSeries(b, "SP.POP.TOTL", 200),
    ]).then(([sa, sb]) => setPopSeries({
      a: sa.filter((p) => p.value !== null).reverse(),
      b: sb.filter((p) => p.value !== null).reverse(),
    }));
    Promise.all([
      fetchWBSeries(a, "NY.GDP.MKTP.CD", 200),
      fetchWBSeries(b, "NY.GDP.MKTP.CD", 200),
    ]).then(([sa, sb]) => setGdpSeries({
      a: sa.filter((p) => p.value !== null).reverse(),
      b: sb.filter((p) => p.value !== null).reverse(),
    }));
  }, [a, b]);

  if (countries.length && (!ca || !cb)) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="text-3xl font-black">{t("country.notFound")}</h1>
        <Link to="/" className="mt-6 inline-block rounded-md bg-primary px-4 py-2 text-primary-foreground">{t("back")}</Link>
      </div>
    );
  }
  if (!ca || !cb) {
    return <div className="mx-auto max-w-6xl px-4 py-20 text-center text-muted-foreground">{t("loading")}</div>;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-10 md:px-8 md:py-14">
      <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary">
        <span aria-hidden>←</span> {t("compare.back")}
      </Link>

      <section
        className="relative overflow-hidden rounded-3xl p-6 md:p-10"
        style={{ background: "var(--gradient-ember)", boxShadow: "var(--shadow-warm)" }}
      >
        <div className="grid grid-cols-1 gap-6 text-primary-foreground md:grid-cols-[1fr_auto_1fr] md:items-center">
          <CountryHeader c={ca} align="left" />
          <div className="text-center text-3xl font-black opacity-80 md:text-4xl">{t("home.vs")}</div>
          <CountryHeader c={cb} align="right" />
        </div>
      </section>

      <section className="rounded-3xl border border-border bg-card/70 p-4 backdrop-blur md:p-6" style={{ boxShadow: "var(--shadow-soft)" }}>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold">{t("compare.title")}</h2>
            <p className="text-sm text-muted-foreground">{t("compare.sub")}</p>
          </div>
          {loading && <span className="text-xs text-muted-foreground">{t("loading")}</span>}
        </div>

        <div className="overflow-hidden rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-secondary/60 text-left">
                <th className="px-4 py-3 font-semibold">Indicator</th>
                <th className="px-4 py-3 text-right font-semibold">{ca.flag} {ca.name.common}</th>
                <th className="px-4 py-3 text-right font-semibold">{cb.flag} {cb.name.common}</th>
              </tr>
            </thead>
            <tbody>
              {METRICS.map((m) => {
                const d = data[m.id];
                const va = d?.a, vb = d?.b;
                let aHi = false, bHi = false;
                if (va && vb && m.higherIsBetter !== undefined) {
                  if (va.value > vb.value) aHi = m.higherIsBetter; else if (vb.value > va.value) bHi = m.higherIsBetter;
                  else { /* tie */ }
                  if (m.higherIsBetter === false) { aHi = !aHi; bHi = !bHi; }
                }
                return (
                  <tr key={m.id} className="border-t border-border">
                    <td className="px-4 py-3 font-medium">{m.label}</td>
                    <td className={`px-4 py-3 text-right ${aHi ? "font-bold text-primary" : ""}`}>
                      {va ? <>{m.format(va.value)} <span className="text-xs text-muted-foreground">({va.year})</span></> : <span className="text-muted-foreground">—</span>}
                    </td>
                    <td className={`px-4 py-3 text-right ${bHi ? "font-bold text-primary" : ""}`}>
                      {vb ? <>{m.format(vb.value)} <span className="text-xs text-muted-foreground">({vb.year})</span></> : <span className="text-muted-foreground">—</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Bold values indicate the higher-performing country for that indicator (where “higher is better” applies). Dashes mean the source has no recent published value.
        </p>
      </section>

      <DualLineChart
        title="Population over time"
        subtitle={`${ca.name.common} vs ${cb.name.common} · World Bank, 1960–present`}
        a={popSeries.a} b={popSeries.b} ca={ca} cb={cb}
        format={(v) => fmtNum(v)}
      />
      <DualLineChart
        title="Economic growth (GDP, current US$)"
        subtitle={`${ca.name.common} vs ${cb.name.common} · World Bank, 1960–present`}
        a={gdpSeries.a} b={gdpSeries.b} ca={ca} cb={cb}
        format={(v) => `$${fmtNum(v)}`}
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <Link to="/country/$code" params={{ code: ca.cca3 }} className="rounded-2xl border border-border bg-card/70 p-4 text-center font-semibold backdrop-blur transition hover:border-primary hover:text-primary">
          Full profile: {ca.flag} {ca.name.common}
        </Link>
        <Link to="/country/$code" params={{ code: cb.cca3 }} className="rounded-2xl border border-border bg-card/70 p-4 text-center font-semibold backdrop-blur transition hover:border-primary hover:text-primary">
          Full profile: {cb.flag} {cb.name.common}
        </Link>
      </div>
    </div>
  );
}

function CountryHeader({ c, align }: { c: Country; align: "left" | "right" }) {
  return (
    <div className={align === "right" ? "md:text-right" : ""}>
      <div className={`flex items-center gap-3 ${align === "right" ? "md:justify-end" : ""}`}>
        <img src={c.flags.svg} alt={`Flag of ${c.name.common}`} className="h-12 w-20 rounded-md object-cover ring-2 ring-white/30" />
        <div>
          <div className="text-2xl font-black md:text-3xl">{c.name.common}</div>
          <div className="text-xs uppercase tracking-widest opacity-80">{c.region}</div>
        </div>
      </div>
    </div>
  );
}

function DualLineChart({
  title, subtitle, a, b, ca, cb, format,
}: {
  title: string; subtitle: string;
  a: Series; b: Series; ca: Country; cb: Country;
  format: (v: number) => string;
}) {
  const w = 800, h = 280, padL = 50, padR = 20, padT = 24, padB = 30;

  if (a.length < 2 && b.length < 2) {
    return (
      <section className="rounded-3xl border border-border bg-card/70 p-6 backdrop-blur md:p-8" style={{ boxShadow: "var(--shadow-soft)" }}>
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
        <p className="mt-6 text-sm text-muted-foreground">No historical data available for this pair.</p>
      </section>
    );
  }

  const allYears = [...a, ...b].map((p) => Number(p.date));
  const minYear = Math.min(...allYears);
  const maxYear = Math.max(...allYears);
  const allValues = [...a, ...b].map((p) => p.value as number);
  const minVal = 0;
  const maxVal = Math.max(...allValues);

  const xs = (year: number) => padL + ((year - minYear) / Math.max(maxYear - minYear, 1)) * (w - padL - padR);
  const ys = (v: number) => h - padB - ((v - minVal) / Math.max(maxVal - minVal, 1)) * (h - padT - padB);

  const toPath = (s: Series) =>
    s.map((d, i) => `${i === 0 ? "M" : "L"} ${xs(Number(d.date)).toFixed(1)} ${ys(d.value as number).toFixed(1)}`).join(" ");

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((t) => minVal + t * (maxVal - minVal));
  const xTicks = [minYear, Math.round((minYear + maxYear) / 2), maxYear];

  return (
    <section className="rounded-3xl border border-border bg-card/70 p-6 backdrop-blur md:p-8" style={{ boxShadow: "var(--shadow-soft)" }}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
        <div className="flex gap-4 text-xs">
          <span className="inline-flex items-center gap-2"><span className="h-1 w-4 rounded" style={{ background: "var(--ember)" }} /> {ca.flag} {ca.name.common}</span>
          <span className="inline-flex items-center gap-2"><span className="h-1 w-4 rounded" style={{ background: "var(--coral)" }} /> {cb.flag} {cb.name.common}</span>
        </div>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="mt-4 w-full">
        {yTicks.map((t, i) => (
          <g key={i}>
            <line x1={padL} x2={w - padR} y1={ys(t)} y2={ys(t)} stroke="var(--border)" strokeDasharray="3 3" />
            <text x={padL - 6} y={ys(t) + 4} textAnchor="end" fontSize="10" fill="var(--muted-foreground)">{format(t)}</text>
          </g>
        ))}
        {xTicks.map((y, i) => (
          <text key={i} x={xs(y)} y={h - 8} textAnchor="middle" fontSize="10" fill="var(--muted-foreground)">{y}</text>
        ))}
        {a.length > 1 && <path d={toPath(a)} fill="none" stroke="var(--ember)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />}
        {b.length > 1 && <path d={toPath(b)} fill="none" stroke="var(--coral)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />}
      </svg>
    </section>
  );
}
