import { Outlet, Link, createRootRoute, HeadContent, Scripts, ScriptOnce } from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { I18nProvider, useI18n } from "@/lib/i18n";
import { SiteHeader } from "@/components/SiteHeader";

const themeScript = `(function(){try{var t=localStorage.getItem("vitalstats:theme");if(!t){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";}if(t==="dark"){document.documentElement.classList.add("dark");}}catch(e){}})();`;

function NotFoundComponent() {
  return (
    <I18nProvider>
      <NotFoundInner />
    </I18nProvider>
  );
}

function NotFoundInner() {
  const { t } = useI18n();
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold">{t("404.title")}</h2>
        <div className="mt-6">
          <Link to="/" className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
            {t("404.cta")}
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "VitalStats — Live Country Demographics" },
      { name: "description", content: "Explore live and recent demographic statistics for every country in the world." },
      { property: "og:title", content: "VitalStats — Live Country Demographics" },
      { name: "twitter:title", content: "VitalStats — Live Country Demographics" },
      { property: "og:description", content: "Explore live and recent demographic statistics for every country in the world." },
      { name: "twitter:description", content: "Explore live and recent demographic statistics for every country in the world." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/380027f6-ba49-4d25-83ea-f51013a3fb1d/id-preview-9392ea22--9cfa1ef5-467f-4dea-af7c-7251ac50c20d.lovable.app-1778057954108.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/380027f6-ba49-4d25-83ea-f51013a3fb1d/id-preview-9392ea22--9cfa1ef5-467f-4dea-af7c-7251ac50c20d.lovable.app-1778057954108.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,700;9..144,900&family=Inter:wght@400;500;600;700&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: () => <I18nProvider><Outlet /></I18nProvider>,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <ScriptOnce>{themeScript}</ScriptOnce>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
