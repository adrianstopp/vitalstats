import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteFooter } from "@/components/SiteFooter";
import { INDICATORS } from "@/lib/countries";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/sources")({
  head: () => ({
    meta: [
      { title: "Sources & Methodology — VitalStats" },
      { name: "description", content: "Where VitalStats data comes from." },
      { property: "og:title", content: "Sources & Methodology — VitalStats" },
      { property: "og:description", content: "Datasets and methodology behind VitalStats." },
    ],
  }),
  component: SourcesPage,
});

function SourcesPage() {
  const { t } = useI18n();
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:px-8 md:py-20">
      <Link to="/" className="text-sm text-muted-foreground hover:text-primary">{t("back")}</Link>
      <h1 className="mt-4 text-4xl font-black md:text-5xl">{t("sources.title")}</h1>
      <p className="mt-4 text-lg text-muted-foreground">{t("sources.intro")}</p>

      <section className="mt-10 space-y-4">
        <h2 className="text-2xl font-bold">{t("sources.datasets")}</h2>
        <div className="rounded-2xl border border-border bg-card/70 p-5">
          <h3 className="font-semibold">{t("sources.wb.title")}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{t("sources.wb.body")}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card/70 p-5">
          <h3 className="font-semibold">{t("sources.rest.title")}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{t("sources.rest.body")}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card/70 p-5">
          <h3 className="font-semibold">{t("sources.hdi.title")}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{t("sources.hdi.body")}</p>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold">{t("sources.codes")}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{t("sources.codes.body")}</p>
        <ul className="mt-4 divide-y divide-border rounded-2xl border border-border bg-card/70">
          {INDICATORS.map((ind) => (
            <li key={ind.id} className="flex items-center justify-between gap-4 px-4 py-3">
              <span className="text-sm">{t(`ind.${ind.id}`)}</span>
              <a className="text-xs font-mono text-muted-foreground underline hover:text-primary"
                 href={`https://data.worldbank.org/indicator/${ind.id}`} target="_blank" rel="noreferrer">
                {ind.id}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="text-2xl font-bold">{t("sources.cadence")}</h2>
        <p className="text-sm text-muted-foreground">{t("sources.cadence.body")}</p>
      </section>

      <SiteFooter />
    </div>
  );
}
