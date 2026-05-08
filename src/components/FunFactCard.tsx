import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getFunFact } from "@/lib/funfact.functions";
import { useI18n } from "@/lib/i18n";

export function FunFactCard({ country, code }: { country: string; code: string }) {
  const { t, lang } = useI18n();
  const [fact, setFact] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [open, setOpen] = useState(true);
  const [minimized, setMinimized] = useState(false);
  const fetchFact = useServerFn(getFunFact);

  useEffect(() => {
    setOpen(true);
    setMinimized(false);
    setFact("");
    setError(false);
    setLoading(true);
    const cacheKey = `vitalstats:funfact:${code}:${lang}`;
    let cancelled = false;
    try {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) { setFact(cached); setLoading(false); return; }
    } catch { /* ignore */ }

    fetchFact({ data: { country, lang } })
      .then((r) => {
        if (cancelled) return;
        const f = r?.fact ?? "";
        setFact(f);
        try { sessionStorage.setItem(cacheKey, f); } catch { /* ignore */ }
      })
      .catch(() => { if (!cancelled) setError(true); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [code, lang, country, fetchFact]);

  if (!open) return null;

  if (minimized) {
    return (
      <button
        onClick={() => setMinimized(false)}
        aria-label={t("funfact.title")}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full text-2xl text-primary-foreground shadow-lg transition-transform hover:scale-105 animate-in fade-in slide-in-from-bottom-2"
        style={{ background: "var(--gradient-ember)", boxShadow: "var(--shadow-warm)" }}
      >
        💡
      </button>
    );
  }

  return (
    <aside
      role="complementary"
      aria-labelledby="funfact-title"
      className="fixed bottom-6 right-6 z-40 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-border bg-card text-card-foreground animate-in fade-in slide-in-from-bottom-4"
      style={{ boxShadow: "var(--shadow-warm)" }}
    >
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-30"
        style={{ background: "var(--gradient-ember)" }}
      />
      <div className="relative p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--ember)" }}>
              {country}
            </div>
            <h2 id="funfact-title" className="mt-0.5 text-lg font-black leading-tight">
              ✨ {t("funfact.title")}
            </h2>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <button
              onClick={() => setMinimized(true)}
              aria-label="Minimize"
              className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              –
            </button>
            <button
              onClick={() => setOpen(false)}
              aria-label={t("funfact.close")}
              className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              ✕
            </button>
          </div>
        </div>
        <p className="mt-3 min-h-[3rem] text-sm leading-relaxed">
          {loading && <span className="text-muted-foreground">{t("funfact.loading")}</span>}
          {!loading && error && <span className="text-muted-foreground">{t("funfact.error")}</span>}
          {!loading && !error && fact}
        </p>
      </div>
    </aside>
  );
}
