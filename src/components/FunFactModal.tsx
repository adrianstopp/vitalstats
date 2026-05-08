import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getFunFact } from "@/lib/funfact.functions";
import { useI18n } from "@/lib/i18n";

export function FunFactModal({ country, code }: { country: string; code: string }) {
  const { t, lang } = useI18n();
  const [open, setOpen] = useState(false);
  const [fact, setFact] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const fetchFact = useServerFn(getFunFact);

  useEffect(() => {
    setOpen(true);
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="funfact-title"
    >
      <button
        aria-label={t("funfact.close")}
        onClick={() => setOpen(false)}
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
      />
      <div
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-border bg-card p-6 text-card-foreground shadow-xl animate-in fade-in slide-in-from-bottom-4"
        style={{ boxShadow: "var(--shadow-warm)" }}
      >
        <div
          className="absolute -right-12 -top-12 h-40 w-40 rounded-full opacity-30"
          style={{ background: "var(--gradient-ember)" }}
        />
        <div className="relative">
          <div className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--ember)" }}>
            {country}
          </div>
          <h2 id="funfact-title" className="mt-1 text-2xl font-black">{t("funfact.title")}</h2>
          <div className="mt-4 min-h-[3rem] text-base leading-relaxed">
            {loading && <span className="text-muted-foreground">{t("funfact.loading")}</span>}
            {!loading && error && <span className="text-muted-foreground">{t("funfact.error")}</span>}
            {!loading && !error && fact}
          </div>
          <button
            onClick={() => setOpen(false)}
            className="mt-5 inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            {t("funfact.close")}
          </button>
        </div>
      </div>
    </div>
  );
}
