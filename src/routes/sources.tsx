import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteFooter } from "@/components/SiteFooter";
import { INDICATORS } from "@/lib/countries";

export const Route = createFileRoute("/sources")({
  head: () => ({
    meta: [
      { title: "Sources & Methodology — VitalStats" },
      { name: "description", content: "Where VitalStats data comes from: World Bank Open Data, REST Countries, and how each indicator is computed." },
      { property: "og:title", content: "Sources & Methodology — VitalStats" },
      { property: "og:description", content: "Datasets and methodology behind VitalStats." },
    ],
  }),
  component: SourcesPage,
});

function SourcesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:px-8 md:py-20">
      <Link to="/" className="text-sm text-muted-foreground hover:text-primary">← Back</Link>
      <h1 className="mt-4 text-4xl font-black md:text-5xl">Sources &amp; Methodology</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        VitalStats aggregates demographic data from public datasets. We never modify the underlying numbers — only format and rank them.
      </p>

      <section className="mt-10 space-y-4">
        <h2 className="text-2xl font-bold">Datasets</h2>
        <div className="rounded-2xl border border-border bg-card/70 p-5">
          <h3 className="font-semibold">World Bank Open Data</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Most demographic and economic indicators come from the World Bank API
            (<code className="text-xs">api.worldbank.org/v2</code>). We request the most recent non-empty value per country.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card/70 p-5">
          <h3 className="font-semibold">REST Countries</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Country names, flags, capitals, area, and languages come from
            {" "}<a className="underline" href="https://restcountries.com" target="_blank" rel="noreferrer">restcountries.com</a>.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card/70 p-5">
          <h3 className="font-semibold">UNDP Human Development Index</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            HDI values reflect the latest published UNDP Human Development Report.
          </p>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold">Indicator codes</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Each indicator on a country page maps directly to a World Bank series ID. Click through for the full official documentation.
        </p>
        <ul className="mt-4 divide-y divide-border rounded-2xl border border-border bg-card/70">
          {INDICATORS.map((ind) => (
            <li key={ind.id} className="flex items-center justify-between gap-4 px-4 py-3">
              <span className="text-sm">{ind.label}</span>
              <a
                className="text-xs font-mono text-muted-foreground underline hover:text-primary"
                href={`https://data.worldbank.org/indicator/${ind.id}`}
                target="_blank"
                rel="noreferrer"
              >
                {ind.id}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="text-2xl font-bold">Refresh cadence</h2>
        <p className="text-sm text-muted-foreground">
          Data is fetched live in your browser on each visit — there is no intermediate cache. Most World Bank indicators are updated annually, with a 1–2 year lag.
        </p>
      </section>

      <SiteFooter />
    </div>
  );
}
