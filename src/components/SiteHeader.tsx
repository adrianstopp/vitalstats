import { Link } from "@tanstack/react-router";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-8">
        <Link to="/" className="group flex items-center gap-2" aria-label="VitalStats — home">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-xl text-primary-foreground shadow-sm"
            style={{ background: "var(--gradient-ember)" }}
            aria-hidden
          >
            <span className="text-base font-black">V</span>
          </span>
          <span className="text-lg font-black tracking-tight group-hover:text-primary">
            VitalStats
          </span>
        </Link>
      </div>
    </header>
  );
}
