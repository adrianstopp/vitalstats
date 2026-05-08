import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteFooter } from "@/components/SiteFooter";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — VitalStats" },
      { name: "description", content: "About VitalStats — a clean, fast window into world demographics." },
      { property: "og:title", content: "About — VitalStats" },
      { property: "og:description", content: "About VitalStats and the person behind it." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { t } = useI18n();
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:px-8 md:py-20">
      <Link to="/" className="text-sm text-muted-foreground hover:text-primary">{t("back")}</Link>
      <h1 className="mt-4 text-4xl font-black md:text-5xl">{t("about.title")}</h1>
      <p className="mt-5 text-lg text-muted-foreground">{t("about.lede")}</p>

      <section className="mt-10 space-y-4">
        <h2 className="text-2xl font-bold">{t("about.why")}</h2>
        <p className="text-muted-foreground">{t("about.why.body")}</p>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-2xl font-bold">{t("about.who")}</h2>
        <p className="text-muted-foreground">
          {t("about.who.body.a")} <span className="font-semibold text-foreground">Pranshi Tripathi</span>. {t("about.who.body.b")}
        </p>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-2xl font-bold">{t("about.accuracy")}</h2>
        <p className="text-muted-foreground">
          {t("about.accuracy.body.a")} <Link to="/sources" className="underline hover:text-primary">{t("about.accuracy.body.link")}</Link>{t("about.accuracy.body.b")}
        </p>
      </section>

      <SiteFooter />
    </div>
  );
}
