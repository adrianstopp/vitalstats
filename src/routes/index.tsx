import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { fetchCountries, fmtNum, type Country } from "@/lib/countries";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  const [countries, setCountries] = useState<Country[]>([]);
  const [query, setQuery] = useState("");
  const [highlight, setHighlight] = useState(0);

  useEffect(() => {
    fetchCountries().then(setCountries);
  }, []);

  const [allOpen, setAllOpen] = useState(false);
  const [devOpen, setDevOpen] = useState(false);
  const [dingOpen, setDingOpen] = useState(false);
  const [pickedDev, setPickedDev] = useState<Country | null>(null);
  const [pickedDing, setPickedDing] = useState<Country | null>(null);

  // ISO cca3 codes commonly classified as "developed economies" (IMF Advanced Economies + a few high-income micro-states).
  const DEVELOPED = new Set([
    "USA","CAN","GBR","FRA","DEU","ITA","JPN","AUS","NZL","AUT","BEL","DNK","FIN",
    "GRC","ISL","IRL","ISR","LUX","NLD","NOR","PRT","ESP","SWE","CHE","KOR","SGP",
    "TWN","CZE","EST","LVA","LTU","SVK","SVN","CYP","MLT","HUN","POL","HRV","SMR",
    "AND","MCO","LIE","VAT",
  ]);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return countries
      .filter((c) => c.name.common.toLowerCase().includes(q))
      .sort((a, b) => {
        const ai = a.name.common.toLowerCase().indexOf(q);
        const bi = b.name.common.toLowerCase().indexOf(q);
        return ai - bi;
      })
      .slice(0, 20);
  }, [countries, query]);

  const sortedAll = useMemo(
    () => [...countries].sort((a, b) => a.name.common.localeCompare(b.name.common)),
    [countries],
  );

  const go = (c: Country) => navigate({ to: "/country/$code", params: { code: c.cca3 } });

  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-12 md:px-8 md:py-20">
      <header>
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium uppercase tracking-widest text-clay backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          Live data · World Bank & REST Countries
        </div>
        <h1 className="mt-6 text-5xl font-black leading-[0.95] md:text-7xl">
          The pulse of{" "}
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-ember)" }}>
            every nation
          </span>
          .
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
          Search any country to open its full demographic profile — population, life expectancy, fertility, urbanisation and more.
        </p>
      </header>

      <div className="mt-10 rounded-3xl border border-border bg-card/70 p-4 backdrop-blur md:p-6" style={{ boxShadow: "var(--shadow-warm)" }}>
        <input
          autoFocus
          value={query}
          onChange={(e) => { setQuery(e.target.value); setHighlight(0); }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") { e.preventDefault(); setHighlight((h) => Math.min(h + 1, matches.length - 1)); }
            else if (e.key === "ArrowUp") { e.preventDefault(); setHighlight((h) => Math.max(h - 1, 0)); }
            else if (e.key === "Enter" && matches[highlight]) { go(matches[highlight]); }
          }}
          placeholder="Search a country (e.g. Sweden) and press Enter…"
          className="w-full rounded-xl border border-border bg-background/70 px-5 py-4 text-lg outline-none ring-ring focus:ring-2"
        />

        {matches.length > 0 && (
          <ul className="mt-4 max-h-[50vh] space-y-1 overflow-y-auto pr-1">
            {matches.map((c, i) => (
              <li key={c.cca3}>
                <button
                  onClick={() => go(c)}
                  onMouseEnter={() => setHighlight(i)}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition ${
                    i === highlight ? "bg-primary text-primary-foreground shadow-md" : "hover:bg-secondary"
                  }`}
                >
                  <span className="text-2xl">{c.flag}</span>
                  <span className="flex-1 truncate font-semibold">{c.name.common}</span>
                  <span className={`text-xs ${i === highlight ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                    {fmtNum(c.population)} · {c.region}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}

        {countries.length === 0 && (
          <p className="mt-4 text-center text-sm text-muted-foreground">Loading countries…</p>
        )}

        {countries.length > 0 && !query && (
          <div className="mt-4 rounded-xl border border-border bg-background/50">
            <button
              type="button"
              onClick={() => setAllOpen((o) => !o)}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition hover:bg-secondary"
            >
              <span className="text-2xl">{sortedAll[0]?.flag}</span>
              <span className="flex-1 truncate font-semibold">{sortedAll[0]?.name.common}</span>
              <span className="text-xs text-muted-foreground">Browse all {sortedAll.length}</span>
              <svg
                width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                className={`text-muted-foreground transition-transform ${allOpen ? "rotate-180" : ""}`}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            {allOpen && (
              <ul className="max-h-[50vh] space-y-1 overflow-y-auto border-t border-border p-2">
                {sortedAll.map((c) => (
                  <li key={c.cca3}>
                    <button
                      onClick={() => go(c)}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition hover:bg-secondary"
                    >
                      <span className="text-xl">{c.flag}</span>
                      <span className="flex-1 truncate">{c.name.common}</span>
                      <span className="text-xs text-muted-foreground">{c.region}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {countries.length > 0 && !query && (() => {
          const developed = sortedAll.filter((c) => DEVELOPED.has(c.cca3));
          const developing = sortedAll.filter((c) => !DEVELOPED.has(c.cca3));
          const Panel = ({
            title, list, open, setOpen, picked, setPicked,
          }: {
            title: string; list: Country[]; open: boolean; setOpen: (v: boolean) => void;
            picked: Country | null; setPicked: (c: Country | null) => void;
          }) => (
            <div className="rounded-xl border border-border bg-background/50">
              <button
                type="button"
                onClick={() => setOpen(!open)}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition hover:bg-secondary"
              >
                <span className="flex-1 truncate font-semibold">
                  {picked ? <><span className="mr-2">{picked.flag}</span>{picked.name.common}</> : title}
                </span>
                <span className="text-xs text-muted-foreground">{list.length}</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  className={`text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}>
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              {open && (
                <ul className="max-h-[50vh] space-y-1 overflow-y-auto border-t border-border p-2">
                  {list.map((c) => {
                    const sel = picked?.cca3 === c.cca3;
                    return (
                      <li key={c.cca3}>
                        <button
                          onClick={() => { setPicked(sel ? null : c); setOpen(false); }}
                          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition ${
                            sel ? "bg-primary text-primary-foreground" : "hover:bg-secondary"
                          }`}
                        >
                          <span className="text-xl">{c.flag}</span>
                          <span className="flex-1 truncate">{c.name.common}</span>
                          <span className={`text-xs ${sel ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{c.region}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
          return (
            <>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <Panel title="Developed countries" list={developed} open={devOpen} setOpen={setDevOpen} picked={pickedDev} setPicked={setPickedDev} />
                <Panel title="Developing countries" list={developing} open={dingOpen} setOpen={setDingOpen} picked={pickedDing} setPicked={setPickedDing} />
              </div>
              {pickedDev && pickedDing && (
                <button
                  onClick={() => navigate({ to: "/compare/$a/$b", params: { a: pickedDev.cca3, b: pickedDing.cca3 } })}
                  className="mt-4 w-full rounded-xl bg-primary px-5 py-3 text-base font-semibold text-primary-foreground shadow-md transition hover:opacity-90"
                  style={{ boxShadow: "var(--shadow-warm)" }}
                >
                  Compare {pickedDev.flag} {pickedDev.name.common} vs {pickedDing.flag} {pickedDing.name.common} →
                </button>
              )}
            </>
          );
        })()}
      </div>

      {countries.length > 0 && !query && (
        <div className="mt-10">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Most populous</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {[...countries].sort((a, b) => b.population - a.population).slice(0, 6).map((c) => (
              <Link
                key={c.cca3}
                to="/country/$code"
                params={{ code: c.cca3 }}
                className="group rounded-2xl border border-border bg-card/70 p-4 backdrop-blur transition hover:-translate-y-0.5 hover:border-primary"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{c.flag}</span>
                  <div>
                    <div className="font-bold group-hover:text-primary">{c.name.common}</div>
                    <div className="text-xs text-muted-foreground">{fmtNum(c.population)} people</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <footer className="mt-auto pt-16 text-center text-xs text-muted-foreground">
        Data: REST Countries · World Bank Open Data
      </footer>
    </div>
  );
}
