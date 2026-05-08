import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { fetchCountries, fmtNum, type Country } from "@/lib/countries";
import { SiteFooter } from "@/components/SiteFooter";

const REGIONS: Record<string, string> = {
  africa: "Africa",
  americas: "Americas",
  asia: "Asia",
  europe: "Europe",
  oceania: "Oceania",
};

export const Route = createFileRoute("/region/$slug")({
  beforeLoad: ({ params }) => {
    if (!REGIONS[params.slug.toLowerCase()]) throw notFound();
  },
  head: ({ params }) => {
    const name = REGIONS[params.slug.toLowerCase()] ?? "Region";
    return {
      meta: [
        { title: `${name} — VitalStats` },
        { name: "description", content: `Demographic overview of every country in ${name}.` },
        { property: "og:title", content: `${name} — VitalStats` },
        { property: "og:description", content: `Population, life expectancy and rankings across ${name}.` },
      ],
    };
  },
  component: RegionPage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <h1 className="text-4xl font-black">Region not found</h1>
      <Link to="/" className="mt-6 inline-block rounded-md bg-primary px-4 py-2 text-primary-foreground">Back home</Link>
    </div>
  ),
});

function RegionPage() {
  const { slug } = Route.useParams();
  const region = REGIONS[slug.toLowerCase()];
  const [countries, setCountries] = useState<Country[]>([]);

  useEffect(() => {
    fetchCountries().then(setCountries);
  }, []);

  const list = useMemo(
    () => countries.filter((c) => c.region === region).sort((a, b) => b.population - a.population),
    [countries, region],
  );

  const totalPop = list.reduce((s, c) => s + (c.population ?? 0), 0);
  const totalArea = list.reduce((s, c) => s + (c.area ?? 0), 0);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 md:px-8 md:py-16">
      <Link to="/" className="text-sm text-muted-foreground hover:text-primary">← Back</Link>
      <h1 className="mt-4 text-5xl font-black md:text-6xl">{region}</h1>
      <p className="mt-3 text-lg text-muted-foreground">
        {list.length} countries · {fmtNum(totalPop)} people · {fmtNum(totalArea)} km²
      </p>

      <div className="mt-10 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        {list.map((c) => (
          <Link
            key={c.cca3}
            to="/country/$code"
            params={{ code: c.cca3 }}
            className="group rounded-2xl border border-border bg-card/70 p-4 backdrop-blur transition hover:-translate-y-0.5 hover:border-primary"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">{c.flag}</span>
              <div className="min-w-0 flex-1">
                <div className="truncate font-bold group-hover:text-primary">{c.name.common}</div>
                <div className="text-xs text-muted-foreground">{fmtNum(c.population)} · {c.subregion ?? ""}</div>
              </div>
            </div>
          </Link>
        ))}
        {countries.length > 0 && list.length === 0 && (
          <p className="text-muted-foreground">No countries found for this region.</p>
        )}
      </div>

      <SiteFooter />
    </div>
  );
}
