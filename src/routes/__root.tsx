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
import { TopBar, Header, Footer, CartDrawer, FloatingButtons } from "@/components/layout";
import { Assistant } from "@/components/assistant";
import { Stars } from "@/components/brand";
import { site } from "@/config/site";
import { t } from "@/i18n/fr";

function NotFoundComponent() {
  return (
    <div className="container-x flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <div className="grid h-36 w-36 place-items-center rounded-full border-[10px] border-primary"><Stars size={22} /></div>
      <h1 className="mt-8 text-6xl font-extrabold text-ink">404</h1>
      <p className="mt-2 text-lg text-muted-foreground">Cette page n'existe pas ou a été déplacée.</p>
      <form action="/boutique" className="mt-6 flex w-full max-w-md gap-2">
        <input name="q" placeholder={t.search.placeholder} aria-label="Rechercher" className="field rounded-full" />
        <button className="btn btn-primary">Rechercher</button>
      </form>
      <Link to="/" className="mt-4 text-sm font-semibold text-primary">← Retour à l'accueil</Link>
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

const storeSchema = {
  "@context": "https://schema.org",
  "@type": "HomeGoodsStore",
  name: site.name,
  alternateName: site.nameAr,
  telephone: site.phoneIntl,
  foundingDate: String(site.foundedYear),
  url: site.url,
  address: { "@type": "PostalAddress", streetAddress: site.address.street, addressLocality: site.address.city, addressCountry: site.address.countryCode },
  openingHoursSpecification: [{ "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], opens: site.hours.open, closes: site.hours.close }],
  paymentAccepted: "Cash",
  currenciesAccepted: "MAD",
  sameAs: [site.social.facebook],
};

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#E30613" },
      { title: "Belle Image — Électroménager & Ameublement à Kénitra" },
      { name: "description", content: "Belle Image, showroom d'électroménager et d'ameublement à Kénitra depuis 2003. Livraison à domicile, paiement à la livraison." },
      { property: "og:site_name", content: "Belle Image" },
      { property: "og:locale", content: "fr_MA" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@600;700;800&display=swap" },
    ],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(storeSchema) }],
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

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <QueryClientProvider client={queryClient}>
      <ShopProvider>
        <a href="#contenu" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground">Aller au contenu</a>
        <TopBar />
        <Header />
        <motion.main id="contenu" key={path} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
          <Outlet />
        </motion.main>
        <Footer />
        <CartDrawer />
        <FloatingButtons />
        <Assistant />
      </ShopProvider>
    </QueryClientProvider>
  );
}
