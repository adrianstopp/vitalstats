import { LANGUAGES, useI18n, type LangCode } from "@/lib/i18n";

export function LanguageSwitcher() {
  const { lang, setLang, t } = useI18n();
  return (
    <label className="inline-flex items-center gap-2 text-xs text-muted-foreground">
      <span className="uppercase tracking-widest">{t("lang.label")}</span>
      <select
        value={lang}
        onChange={(e) => setLang(e.target.value as LangCode)}
        className="rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      >
        {LANGUAGES.map((l) => (
          <option key={l.code} value={l.code}>{l.label}</option>
        ))}
      </select>
    </label>
  );
}
