import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { ShopProvider } from "@/store/shop";
import { AuthProvider } from "@/store/auth";
import { TopBar, Header, Footer, CartDrawer, FloatingButtons, SearchBox } from "@/components/layout";
import { Assistant } from "@/components/assistant";
import { Stars } from "@/components/brand";
import { getCategories } from "@/lib/catalogue";
import { getImage, logMissingImages } from "@/lib/images";
import { storeLd } from "@/lib/seo";
import { t } from "@/i18n/fr";

function NotFoundComponent() {
  return (
    <div className="container-x flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <div className="relative grid h-36 w-36 place-items-center rounded-full border-[10px] border-primary">
        <Stars size={22} />
      </div>
      <p className="mt-8 font-display text-7xl font-extrabold text-ink">404</p>
      <h1 className="mt-1 text-2xl font-extrabold text-ink">{t.notFound.title}</h1>
      <p className="mt-2 max-w-md text-muted-foreground">{t.notFound.text}</p>
      <div className="mt-6 w-full max-w-md text-left"><SearchBox /></div>
      <ul className="mt-8 flex max-w-2xl flex-wrap justify-center gap-2">
        {getCategories().map((c) => (
          <li key={c.slug}><Link to="/boutique/$category" params={{ category: c.slug }} className="inline-block rounded-full bg-surface px-4 py-2 text-sm font-semibold hover:bg-primary hover:text-primary-foreground">{c.name}</Link></li>
        ))}
      </ul>
      <Link to="/" className="mt-8 text-sm font-semibold text-primary hover:underline">← {t.notFound.home}</Link>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">La page n'a pas pu se charger</h1>
        <p className="mt-2 text-sm text-muted-foreground">Un problème est survenu. Réessayez ou revenez à l'accueil.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button onClick={() => { router.invalidate(); reset(); }} className="btn btn-primary">Réessayer</button>
          <a href="/" className="btn btn-outline">Accueil</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#E30613" },
      { name: "format-detection", content: "telephone=no" },
      { title: "Belle Image — Électroménager & Ameublement à Kénitra" },
      { name: "description", content: "Belle Image, showroom d'électroménager et d'ameublement à Kénitra depuis 2003. Livraison à domicile, paiement à la livraison." },
      { property: "og:site_name", content: "Belle Image" },
      { property: "og:locale", content: "fr_MA" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      // Favicon et icône d'écran d'accueil : le logo officiel (favicon.png de repli s'il manque).
      { rel: "icon", type: "image/png", href: getImage("logo") ?? "/favicon.png" },
      { rel: "apple-touch-icon", href: getImage("logo") ?? "/favicon.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@600;700;800&display=swap" },
    ],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(storeLd()) }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang={t.lang} dir={t.dir}>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

// Pas de fondu au premier rendu (SSR + hydratation) : le contenu est visible immédiatement,
// les transitions de 200 ms ne s'appliquent qu'aux navigations suivantes.
let firstPaint = true;

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const path = useRouterState({ select: (s) => s.location.pathname });
  useEffect(() => {
    firstPaint = false;
    logMissingImages();
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <ShopProvider>
      <AuthProvider>
        <a href="#contenu" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground">{t.common.skipToContent}</a>
        <TopBar />
        <Header />
        <motion.main id="contenu" tabIndex={-1} className="outline-none" key={path} initial={firstPaint ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
          <Outlet />
        </motion.main>
        <Footer />
        <CartDrawer />
        <FloatingButtons />
        <Assistant />
      </AuthProvider>
      </ShopProvider>
    </QueryClientProvider>
  );
}
