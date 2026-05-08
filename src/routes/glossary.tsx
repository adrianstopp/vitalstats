import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteFooter } from "@/components/SiteFooter";
import { useI18n } from "@/lib/i18n";

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

const KEYS = ["population","birthRate","deathRate","lifeExp","fertility","popGrowth","urban","infant","gdppc","pm25","co2","hdi"];

function GlossaryPage() {
  const { t } = useI18n();
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:px-8 md:py-20">
      <Link to="/" className="text-sm text-muted-foreground hover:text-primary">{t("back")}</Link>
      <h1 className="mt-4 text-4xl font-black md:text-5xl">{t("glossary.title")}</h1>
      <p className="mt-4 text-lg text-muted-foreground">{t("glossary.intro")}</p>

      <dl className="mt-10 divide-y divide-border rounded-2xl border border-border bg-card/70">
        {KEYS.map((k) => (
          <div key={k} className="px-5 py-4">
            <dt className="font-semibold">{t(`g.${k}.term`)}</dt>
            <dd className="mt-1 text-sm text-muted-foreground">{t(`g.${k}.def`)}</dd>
          </div>
        ))}
      </dl>

      <SiteFooter />
    </div>
  );
}
