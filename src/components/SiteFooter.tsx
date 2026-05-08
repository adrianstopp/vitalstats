import { Link } from "@tanstack/react-router";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useI18n } from "@/lib/i18n";

export function SiteFooter() {
  const { t } = useI18n();
  return (
    <footer className="mt-16 border-t border-border pt-8 pb-10 text-center text-xs text-muted-foreground">
      <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
        <Link to="/" className="hover:text-primary">{t("nav.home")}</Link>
        <Link to="/sources" className="hover:text-primary">{t("nav.sources")}</Link>
        <Link to="/glossary" className="hover:text-primary">{t("nav.glossary")}</Link>
        <Link to="/about" className="hover:text-primary">{t("nav.about")}</Link>
      </nav>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-6">
        <ThemeToggle />
        <LanguageSwitcher />
      </div>
      <p className="mt-4">{t("footer.data")}</p>
    </footer>
  );
}
