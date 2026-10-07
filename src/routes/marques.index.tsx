import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, HeartHandshake, Scale, ShieldCheck, Store } from "lucide-react";
import { useState } from "react";
import { Crumbs, WhatsAppIcon } from "@/components/layout";
import { ProductGrid, ProductThumb } from "@/components/product";
import { site } from "@/config/site";
import { getBrands, getProductsByBrand } from "@/lib/catalogue";
import { track, waLink } from "@/lib/commerce";
import { breadcrumbLd, pageHead } from "@/lib/seo";
import { t } from "@/i18n/fr";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/marques/")({
  head: () =>
    pageHead({
      title: "Nos marques",
      description: "Les grandes marques d'électroménager et d'ameublement réunies dans le showroom Belle Image à Kénitra : livraison à domicile et paiement à la livraison.",
      path: "/marques",
      jsonLd: [breadcrumbLd([{ name: t.common.home, path: "/" }, { name: t.nav.brands, path: "/marques" }])],
    }),
  component: BrandsPage,
});

type Brand = ReturnType<typeof getBrands>[number];
type Filter = "all" | "electromenager" | "ameublement";

const pillarLabel: Record<string, string> = {
  electromenager: t.nav.electro,
  ameublement: t.nav.furniture,
  mixte: `${t.nav.electro} et ${t.nav.furniture}`,
};

const filters: { id: Filter; label: string }[] = [
  { id: "all", label: "Toutes les marques" },
  { id: "electromenager", label: t.nav.electro },
  { id: "ameublement", label: t.nav.furniture },
];

const reasons = [
  { icon: ShieldCheck, title: "Garantie constructeur", text: "Chaque produit est couvert par la garantie de sa marque, et notre équipe suit le dossier pour vous." },
  { icon: Scale, title: "Comparer en vrai", text: "Plusieurs marques côte à côte au showroom : voyez les finitions et les tailles avant de choisir." },
  { icon: HeartHandshake, title: "Un conseil neutre", text: "Nos conseillers vous orientent vers la marque qui correspond à votre usage et votre budget." },
  { icon: Store, title: "Payé à la livraison", text: "Commandez en ligne ou au showroom : vous réglez à la réception, sans paiement en ligne." },
];

function BrandLogo({ b, className }: { b: Brand; className?: string }) {
  return b.logo ? (
    <img src={b.logo} alt={b.name} loading="lazy" className={cn("max-h-full w-full object-contain", className)} />
  ) : (
    <span className={cn("font-display text-xl font-extrabold tracking-tight text-ink", className)}>{b.name}</span>
  );
}

/** Bande défilante de logos : le "mur de marques" du magasin. */
function LogoMarquee({ brands }: { brands: Brand[] }) {
  const row = [...brands, ...brands];
  return (
    <div className="relative overflow-hidden py-2 [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]" aria-hidden>
      <div className="flex w-max animate-[marquee-x_40s_linear_infinite] gap-3 motion-reduce:animate-none hover:[animation-play-state:paused]">
        {row.map((b, i) => (
          <span key={`${b.slug}-${i}`} className="grid h-20 w-40 shrink-0 place-items-center rounded-2xl bg-background px-6 py-4 shadow-card">
            <BrandLogo b={b} className="max-h-10" />
          </span>
        ))}
      </div>
      <style>{`@keyframes marquee-x { to { transform: translateX(-50%); } }`}</style>
    </div>
  );
}

function BrandCard({ b }: { b: Brand }) {
  const products = getProductsByBrand(b.slug);
  return (
    <Link to="/marques/$brand" params={{ brand: b.slug }} className="group flex h-full flex-col rounded-[1.75rem] border bg-card p-2 transition-[border-color,box-shadow] duration-300 hover:border-ink/20 hover:shadow-lift">
      <span className="relative grid h-36 place-items-center overflow-hidden rounded-[1.35rem] bg-surface px-8">
        <span aria-hidden className="absolute -right-10 -top-10 h-28 w-28 rounded-full border-[3px] border-primary/0 transition-colors duration-500 group-hover:border-primary/25" />
        <BrandLogo b={b} className="max-h-14 transition-transform duration-500 group-hover:scale-105" />
      </span>
      <span className="flex flex-1 items-end justify-between gap-3 px-3 pb-3 pt-4">
        <span className="min-w-0">
          <span className="block truncate font-display text-lg font-bold text-ink">{b.name}</span>
          <span className="block text-xs text-muted-foreground">{pillarLabel[b.pillar] ?? ""}</span>
          <span className="tabular mt-2 inline-flex rounded-full bg-surface px-2.5 py-1 text-[11px] font-semibold text-ink">{t.common.products(products.length)}</span>
        </span>
        <span className="flex shrink-0 items-center">
          {products.slice(0, 3).map((p, i) => (
            <span key={p.slug} className={cn("h-11 w-11 overflow-hidden rounded-full border-2 border-background bg-surface p-1", i > 0 && "-ml-3")}>
              <ProductThumb p={p} />
            </span>
          ))}
          <span className="-ml-3 grid h-11 w-11 place-items-center rounded-full border-2 border-background bg-ink text-ink-foreground transition-colors group-hover:bg-primary">
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </span>
        </span>
      </span>
    </Link>
  );
}

function BrandsPage() {
  const brands = getBrands();
  const [filter, setFilter] = useState<Filter>("all");
  const shown = brands.filter((b) => filter === "all" || b.pillar === filter || b.pillar === "mixte");
  const ranked = [...brands].sort((a, b) => getProductsByBrand(b.slug).length - getProductsByBrand(a.slug).length).filter((b) => getProductsByBrand(b.slug).length > 0);
  const [spot, setSpot] = useState(ranked[0]?.slug);
  const spotBrand = ranked.find((b) => b.slug === spot);
  const spotProducts = spot ? getProductsByBrand(spot).slice(0, 4) : [];
  const total = brands.reduce((n, b) => n + getProductsByBrand(b.slug).length, 0);

  return (
    <>
      {/* En-tête : titre + mur de logos défilant */}
      <section className="relative overflow-hidden border-b bg-surface">
        <div aria-hidden className="pointer-events-none absolute -right-40 -top-56 h-[30rem] w-[30rem] rounded-full border-[3px] border-primary/15" />
        <div className="container-x relative pb-10 pt-8 md:pb-14 md:pt-12">
          <Crumbs items={[{ label: t.common.home, href: <Link to="/" className="hover:text-primary">{t.common.home}</Link> }, { label: t.nav.brands }]} />
          <div className="mt-8 grid gap-8 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:items-end">
            <div>
              <p className="text-sm font-semibold text-primary">{t.nav.brands}</p>
              <h1 className="mt-2 font-display text-[2.4rem] font-extrabold leading-[1] tracking-[-0.03em] text-ink md:text-[3.6rem]">
                Les grandes marques, réunies sous un même toit<span className="text-primary">.</span>
              </h1>
            </div>
            <div>
              <p className="leading-relaxed text-muted-foreground md:text-lg">Électroménager et ameublement : nous sélectionnons des marques reconnues et vous aidons à les comparer, en ligne ou au showroom.</p>
              <dl className="mt-6 flex gap-8">
                <div><dt className="text-xs text-muted-foreground">Marques</dt><dd className="tabular font-display text-3xl font-extrabold text-ink">{brands.length}</dd></div>
                <div><dt className="text-xs text-muted-foreground">Produits en ligne</dt><dd className="tabular font-display text-3xl font-extrabold text-ink">{total}</dd></div>
                <div><dt className="text-xs text-muted-foreground">Depuis</dt><dd className="tabular font-display text-3xl font-extrabold text-primary">{site.foundedYear}</dd></div>
              </dl>
            </div>
          </div>
        </div>
        {brands.length > 3 && <div className="relative pb-10"><LogoMarquee brands={brands} /></div>}
      </section>

      {/* Toutes les marques */}
      <section className="container-x py-14 md:py-20" aria-labelledby="all-brands">
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <h2 id="all-brands" className="text-3xl font-extrabold text-ink md:text-4xl">Choisir une marque</h2>
          <div role="group" aria-label="Filtrer par univers" className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:px-0">
            {filters.map((f) => (
              <button
                key={f.id}
                type="button"
                aria-pressed={filter === f.id}
                onClick={() => setFilter(f.id)}
                className={cn("shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors", filter === f.id ? "border-ink bg-ink text-ink-foreground" : "bg-background hover:border-ink")}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {shown.map((b) => <li key={b.slug}><BrandCard b={b} /></li>)}
        </ul>
        <p className="mt-5 text-xs text-muted-foreground">{t.home.brandsNote}</p>
      </section>

      {/* Explorer une marque : sélecteur + ses produits */}
      {spotBrand && (
        <section className="bg-surface py-16 md:py-20" aria-labelledby="spot">
          <div className="container-x">
            <div className="mb-8 flex flex-col gap-5">
              <h2 id="spot" className="text-3xl font-extrabold text-ink md:text-4xl">Explorer par marque</h2>
              <div role="tablist" aria-label="Marques" className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:px-0">
                {ranked.map((b) => (
                  <button
                    key={b.slug}
                    type="button"
                    role="tab"
                    aria-selected={spot === b.slug}
                    onClick={() => setSpot(b.slug)}
                    className={cn("shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors", spot === b.slug ? "border-primary bg-primary text-primary-foreground" : "bg-background hover:border-ink")}
                  >
                    {b.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid gap-4 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,2.4fr)] lg:gap-5" role="tabpanel">
              <div className="relative flex flex-col justify-between overflow-hidden rounded-[1.75rem] bg-ink p-7 text-ink-foreground">
                <div aria-hidden className="absolute -bottom-20 -right-20 h-56 w-56 rounded-full border-[3px] border-primary/40" />
                <div className="relative">
                  <span className="grid h-24 place-items-center rounded-2xl bg-background px-6"><BrandLogo b={spotBrand} className="max-h-12" /></span>
                  <p className="mt-6 font-display text-3xl font-extrabold">{spotBrand.name}</p>
                  <p className="mt-1 text-sm text-ink-muted">{pillarLabel[spotBrand.pillar]}, {t.common.products(getProductsByBrand(spotBrand.slug).length).toLowerCase()}</p>
                </div>
                <Link to="/marques/$brand" params={{ brand: spotBrand.slug }} className="btn btn-primary relative mt-8 w-fit">
                  Tout {spotBrand.name}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>
              <ProductGrid key={spot} products={spotProducts} className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4" />
            </div>
          </div>
        </section>
      )}

      {/* Pourquoi acheter vos marques chez Belle Image */}
      <section className="container-x py-16 md:py-24" aria-labelledby="why">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,2fr)] lg:gap-16">
          <div>
            <h2 id="why" className="text-3xl font-extrabold leading-[1.05] text-ink md:text-4xl">Pourquoi acheter vos marques chez Belle Image</h2>
            <p className="mt-4 text-muted-foreground">Depuis {site.foundedYear}, un magasin de Kénitra qui connaît ses produits.</p>
          </div>
          <ul className="grid border-t sm:grid-cols-2">
            {reasons.map((r) => (
              <li key={r.title} className="flex gap-5 border-b py-7 sm:odd:pr-8 sm:even:border-l sm:even:pl-8">
                <r.icon className="mt-1 h-7 w-7 shrink-0 text-primary" strokeWidth={1.75} aria-hidden />
                <div>
                  <h3 className="text-lg font-extrabold text-ink">{r.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{r.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Marque introuvable */}
      <section className="container-x pb-4" aria-labelledby="missing">
        <div className="relative overflow-hidden rounded-[2rem] bg-primary px-6 py-12 text-primary-foreground md:px-12 md:py-14">
          <div aria-hidden className="absolute -right-20 -top-24 h-72 w-72 rounded-full border-[3px] border-primary-foreground/25" />
          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <h2 id="missing" className="font-display text-3xl font-extrabold leading-tight md:text-4xl">Vous cherchez une autre marque ?</h2>
              <p className="mt-3 text-primary-foreground/90">Tout notre stock n'est pas encore en ligne. Dites-nous ce que vous cherchez, nous vérifions la disponibilité au showroom.</p>
            </div>
            <a
              href={waLink("Bonjour Belle Image, je cherche un produit de la marque : ")}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("whatsapp_click", { location: "brands_missing" })}
              className="btn shrink-0 bg-background px-6 text-ink hover:bg-surface"
            >
              <WhatsAppIcon className="h-5 w-5 text-whatsapp" />
              Demander sur WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}