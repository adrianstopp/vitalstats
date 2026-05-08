import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/glossary")({
  head: () => ({
    meta: [
      { title: "Glossary — VitalStats" },
      { name: "description", content: "Plain-language definitions for demographic terms used in VitalStats." },
      { property: "og:title", content: "Glossary — VitalStats" },
      { property: "og:description", content: "Demographic terms explained simply." },
    ],
  }),
  component: GlossaryPage,
});

const TERMS: { term: string; def: string }[] = [
  { term: "Population", def: "The total number of people residing in a country, typically the mid-year estimate from the World Bank." },
  { term: "Birth rate", def: "Live births per 1,000 people in a year. A 'crude' rate — not adjusted for age structure." },
  { term: "Death rate", def: "Deaths per 1,000 people in a year. Also crude, so older populations naturally show higher rates." },
  { term: "Life expectancy", def: "The average number of years a newborn would live if current mortality patterns stayed the same." },
  { term: "Fertility rate", def: "The average number of children a woman would have over her lifetime at current age-specific birth rates. ~2.1 is replacement level." },
  { term: "Population growth", def: "Annual percentage change in population, accounting for births, deaths, and net migration." },
  { term: "Urban population", def: "Share of people living in areas classified as urban by national statistical offices." },
  { term: "Infant mortality", def: "Deaths of children under 1 year per 1,000 live births." },
  { term: "GDP per capita", def: "Gross Domestic Product divided by population — a rough measure of average economic output per person." },
  { term: "PM2.5", def: "Fine particulate matter under 2.5 micrometres in air. Long-term exposure is linked to respiratory and cardiovascular disease." },
  { term: "CO₂ per capita", def: "Annual carbon dioxide emissions per person, in tonnes." },
  { term: "HDI (Human Development Index)", def: "A composite UN score combining life expectancy, education, and income. 0–1 scale, higher is better." },
];

function GlossaryPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:px-8 md:py-20">
      <Link to="/" className="text-sm text-muted-foreground hover:text-primary">← Back</Link>
      <h1 className="mt-4 text-4xl font-black md:text-5xl">Glossary</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Quick, plain-language definitions for the terms used across VitalStats.
      </p>

      <dl className="mt-10 divide-y divide-border rounded-2xl border border-border bg-card/70">
        {TERMS.map((t) => (
          <div key={t.term} className="px-5 py-4">
            <dt className="font-semibold">{t.term}</dt>
            <dd className="mt-1 text-sm text-muted-foreground">{t.def}</dd>
          </div>
        ))}
      </dl>

      <SiteFooter />
    </div>
  );
}
