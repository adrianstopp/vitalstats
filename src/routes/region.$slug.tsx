import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { fetchCountries, fmtNum, type Country } from "@/lib/countries";
import { SiteFooter } from "@/components/SiteFooter";
import { useI18n } from "@/lib/i18n";

const REGIONS: Record<string, { name: string; key: string }> = {
  africa: { name: "Africa", key: "home.continent.africa" },
  americas: { name: "Americas", key: "home.continent.americas" },
  asia: { name: "Asia", key: "home.continent.asia" },
  europe: { name: "Europe", key: "home.continent.europe" },
  oceania: { name: "Oceania", key: "home.continent.oceania" },
};

export const Route = createFileRoute("/region/$slug")({
  beforeLoad: ({ params }) => {
    if (!REGIONS[params.slug.toLowerCase()]) throw notFound();
  },
  head: ({ params }) => {
    const name = REGIONS[params.slug.toLowerCase()]?.name ?? "Region";
    return {
      meta: [
        { title: `${name} — VitalStats` },
        { name: "description", content: `Demographic overview of every country in ${name}.` },
      ],
    };
  },
  component: RegionPage,
  notFoundComponent: NotFound,
});

function NotFound() {
  const { t } = useI18n();
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <h1 className="text-4xl font-black">{t("region.notFound")}</h1>
      <Link to="/" className="mt-6 inline-block rounded-md bg-primary px-4 py-2 text-primary-foreground">{t("backHome")}</Link>
    </div>
  );
}

function RegionPage() {
  const { t } = useI18n();
  const { slug } = Route.useParams();
  const region = REGIONS[slug.toLowerCase()];
  const [countries, setCountries] = useState<Country[]>([]);

  useEffect(() => { fetchCountries().then(setCountries); }, []);

  const list = useMemo(
    () => countries.filter((c) => c.region === region?.name).sort((a, b) => b.population - a.population),
    [countries, region],
  );

  const totalPop = list.reduce((s, c) => s + (c.population ?? 0), 0);
  const totalArea = list.reduce((s, c) => s + (c.area ?? 0), 0);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 md:px-8 md:py-16">
      <Link to="/" className="text-sm text-muted-foreground hover:text-primary">{t("back")}</Link>
      <h1 className="mt-4 text-5xl font-black md:text-6xl">{region ? t(region.key) : ""}</h1>
      <p className="mt-3 text-lg text-muted-foreground">
        {list.length} {t("region.countries")} · {fmtNum(totalPop)} {t("label.people")} · {fmtNum(totalArea)} km²
      </p>

      <div className="mt-10 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        {list.map((c) => (
          <Link key={c.cca3} to="/country/$code" params={{ code: c.cca3 }}
            className="group rounded-2xl border border-border bg-card/70 p-4 backdrop-blur transition hover:-translate-y-0.5 hover:border-primary">
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
          <p className="text-muted-foreground">{t("region.empty")}</p>
        )}
      </div>

      <SiteFooter />
    </div>
  );
}
