import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteFooter } from "@/components/SiteFooter";

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
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:px-8 md:py-20">
      <Link to="/" className="text-sm text-muted-foreground hover:text-primary">← Back</Link>
      <h1 className="mt-4 text-4xl font-black md:text-5xl">About VitalStats</h1>
      <p className="mt-5 text-lg text-muted-foreground">
        VitalStats is a fast, distraction-free window into the world's demographic data — designed for students, journalists, and the merely curious.
      </p>

      <section className="mt-10 space-y-4">
        <h2 className="text-2xl font-bold">Why it exists</h2>
        <p className="text-muted-foreground">
          Most demographic dashboards bury the numbers behind logins, ads, and clutter. VitalStats puts the figures one search away, side-by-side with their source year, so you always know when the data was published.
        </p>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-2xl font-bold">Who built it</h2>
        <p className="text-muted-foreground">
          Built by <span className="font-semibold text-foreground">Pranshi Tripathi</span>. Last updated 8 May 2026.
        </p>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-2xl font-bold">A note on accuracy</h2>
        <p className="text-muted-foreground">
          Numbers are pulled live from official sources — see the {" "}
          <Link to="/sources" className="underline hover:text-primary">Sources page</Link>. If you spot something odd, the discrepancy is almost always in the upstream dataset, not in VitalStats. We never round, edit, or interpret the values.
        </p>
      </section>

      <SiteFooter />
    </div>
  );
}
