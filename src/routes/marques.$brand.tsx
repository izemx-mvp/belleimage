import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, Banknote, ShieldCheck, Store, Truck } from "lucide-react";
import { useMemo, useState } from "react";
import { Crumbs, EmptyState, WhatsAppIcon } from "@/components/layout";
import { categoryIcons } from "@/components/brand";
import { ProductGrid, ProductRail } from "@/components/product";
import { site } from "@/config/site";
import { discount, getBrand, getBrands, getCategory, getProductsByBrand } from "@/lib/catalogue";
import { formatPrice, track, waLink } from "@/lib/commerce";
import { breadcrumbLd, pageHead } from "@/lib/seo";
import { t } from "@/i18n/fr";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/marques/$brand")({
  loader: ({ params }) => {
    if (!getBrand(params.brand)) throw notFound();
    return { slug: params.brand };
  },
  head: ({ params }) => {
    const b = getBrand(params.brand);
    if (!b) return {};
    return pageHead({
      title: `${b.name} — produits et prix`,
      description: `Produits ${b.name} disponibles chez Belle Image Kénitra : livraison à domicile et paiement à la livraison.`,
      path: `/marques/${b.slug}`,
      jsonLd: [breadcrumbLd([{ name: t.common.home, path: "/" }, { name: t.nav.brands, path: "/marques" }, { name: b.name, path: `/marques/${b.slug}` }])],
    });
  },
  component: BrandPage,
});

const pillarLabel: Record<string, string> = {
  electromenager: t.nav.electro,
  ameublement: t.nav.furniture,
  mixte: `${t.nav.electro} et ${t.nav.furniture}`,
};

type Sort = "pertinence" | "price-asc" | "price-desc";

function BrandPage() {
  const { slug } = Route.useLoaderData();
  const brand = getBrand(slug)!;
  const products = getProductsByBrand(slug);
  const [cat, setCat] = useState<string | null>(null);
  const [sort, setSort] = useState<Sort>("pertinence");

  // Catégories présentes dans la marque, avec leur nombre de produits.
  const cats = useMemo(() => {
    const m = new Map<string, number>();
    products.forEach((p) => m.set(p.category, (m.get(p.category) ?? 0) + 1));
    return [...m.entries()].map(([s, n]) => ({ cat: getCategory(s), slug: s, n })).filter((x) => x.cat);
  }, [products]);

  const promos = products.filter((p) => discount(p) > 0);
  const minPrice = products.length ? Math.min(...products.map((p) => p.price)) : 0;
  const maxDiscount = Math.max(0, ...promos.map(discount));
  const list = useMemo(() => {
    const l = products.filter((p) => !cat || p.category === cat);
    if (sort === "price-asc") return [...l].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") return [...l].sort((a, b) => b.price - a.price);
    return l;
  }, [products, cat, sort]);
  const others = getBrands().filter((b) => b.slug !== slug).slice(0, 8);

  return (
    <>
      {/* En-tête de marque : logo sur pastille blanche cerclée de rouge, chiffres clés */}
      <section className="relative overflow-hidden bg-ink text-ink-foreground">
        <div aria-hidden className="pointer-events-none absolute -left-40 -top-48 h-[30rem] w-[30rem] rounded-full border-[3px] border-primary/30" />
        <div aria-hidden className="pointer-events-none absolute -bottom-56 right-10 h-[26rem] w-[26rem] rounded-full border-[3px] border-primary/15" />
        <div className="container-x relative pb-12 pt-6 md:pb-16">
          <div className="[&_a]:text-ink-muted [&_a:hover]:text-primary [&_span[aria-current]]:text-ink-foreground [&_nav]:text-ink-muted">
            <Crumbs items={[
              { label: t.common.home, href: <Link to="/" className="hover:text-primary">{t.common.home}</Link> },
              { label: t.nav.brands, href: <Link to="/marques" className="hover:text-primary">{t.nav.brands}</Link> },
              { label: brand.name },
            ]} />
          </div>
          <div className="mt-10 grid items-center gap-10 md:grid-cols-[auto_minmax(0,1fr)] md:gap-14">
            <div className="relative mx-auto md:mx-0">
              <div aria-hidden className="absolute -inset-4 rounded-full border-[3px] border-primary" />
              <div className="grid h-44 w-44 place-items-center rounded-full bg-background p-8 shadow-lift md:h-52 md:w-52">
                {brand.logo
                  ? <img src={brand.logo} alt={brand.name} className="max-h-16 w-full object-contain" />
                  : <span className="font-display text-2xl font-extrabold text-ink">{brand.name}</span>}
              </div>
            </div>
            <div className="text-center md:text-left">
              <p className="text-sm font-semibold text-primary">{pillarLabel[brand.pillar] ?? t.nav.brands}</p>
              <h1 className="mt-2 font-display text-[2.6rem] font-extrabold leading-[1] tracking-[-0.03em] md:text-[4rem]">
                {brand.name}<span className="text-primary">.</span>
              </h1>
              <p className="mx-auto mt-4 max-w-xl leading-relaxed text-ink-muted md:mx-0 md:text-lg">
                Les produits {brand.name} chez Belle Image, garantis par la marque, livrés chez vous et payables à la livraison.
              </p>
              <dl className="mt-8 flex flex-wrap justify-center gap-y-4 md:justify-start">
                {[
                  { k: "Produits", v: String(products.length) },
                  ...(products.length ? [{ k: "À partir de", v: formatPrice(minPrice) }] : []),
                  ...(maxDiscount > 0 ? [{ k: "Remises jusqu'à", v: `-${maxDiscount}%` }] : []),
                ].map((s, i) => (
                  <div key={s.k} className={cn("px-6", i > 0 && "border-l border-ink-foreground/15", i === 0 && "md:pl-0")}>
                    <dt className="text-xs text-ink-muted">{s.k}</dt>
                    <dd className={cn("tabular mt-1 font-display text-2xl font-extrabold md:text-3xl", s.k.startsWith("Remises") && "text-primary")}>{s.v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* Réassurance marque */}
      <div className="border-b bg-surface">
        <ul className="container-x grid grid-cols-2 lg:grid-cols-4">
          {[
            { icon: ShieldCheck, title: "Garantie constructeur", text: `Produits ${brand.name} garantis` },
            { icon: Banknote, title: "Paiement à la livraison", text: "Aucun paiement en ligne" },
            { icon: Truck, title: "Livraison à domicile", text: "Selon votre ville" },
            { icon: Store, title: "À voir au showroom", text: "Kénitra, 7j/7" },
          ].map((r, i) => (
            <li key={r.title} className={cn("flex items-center gap-3 py-5", i % 2 === 1 && "border-l pl-4", i >= 2 && "border-t lg:border-t-0", "lg:border-l lg:px-6 lg:first:border-l-0 lg:first:pl-0")}>
              <r.icon className="h-6 w-6 shrink-0 text-primary" strokeWidth={1.75} aria-hidden />
              <div className="min-w-0">
                <p className="text-sm font-bold leading-tight text-ink">{r.title}</p>
                <p className="text-xs text-muted-foreground">{r.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Promotions de la marque */}
      {promos.length > 0 && (
        <section className="container-x pt-14 md:pt-20" aria-labelledby="brand-promos">
          <div className="mb-6 flex items-end justify-between gap-4">
            <h2 id="brand-promos" className="text-3xl font-extrabold text-ink md:text-4xl">Offres {brand.name}</h2>
            <span className="tabular rounded-full bg-primary px-3 py-1.5 text-sm font-bold text-primary-foreground">jusqu'à -{maxDiscount}%</span>
          </div>
          <ProductRail products={promos} label={`Offres ${brand.name}`} />
        </section>
      )}

      {/* Tous les produits, filtrables par catégorie */}
      <section className="container-x py-14 md:py-20" aria-labelledby="brand-all">
        <div className="mb-6 flex flex-col gap-5">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 id="brand-all" className="text-3xl font-extrabold text-ink md:text-4xl">Tous les produits {brand.name}</h2>
            <label className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">{t.catalogue.sort}</span>
              <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="h-10 cursor-pointer rounded-full border-[1.5px] border-input bg-background px-4 pr-9 text-sm font-semibold focus:border-ring focus:outline-none">
                <option value="pertinence">Pertinence</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
              </select>
            </label>
          </div>
          {cats.length > 1 && (
            <div role="group" aria-label="Filtrer par catégorie" className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:px-0">
              <button type="button" aria-pressed={!cat} onClick={() => setCat(null)} className={cn("shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors", !cat ? "border-ink bg-ink text-ink-foreground" : "bg-background hover:border-ink")}>
                Tout <span className="tabular opacity-60">{products.length}</span>
              </button>
              {cats.map(({ cat: c, slug: s, n }) => {
                const Icon = categoryIcons[c!.icon];
                return (
                  <button key={s} type="button" aria-pressed={cat === s} onClick={() => setCat(s)} className={cn("inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors", cat === s ? "border-ink bg-ink text-ink-foreground" : "bg-background hover:border-ink")}>
                    <Icon className="h-4 w-4 text-primary" aria-hidden />
                    {c!.name}
                    <span className="tabular opacity-60">{n}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
        {list.length ? (
          <ProductGrid key={`${cat}-${sort}`} products={list} priorityCount={2} />
        ) : (
          <div className="rounded-[2rem] border border-dashed">
            <EmptyState
              title="Pas encore de produit en ligne"
              text={`Les produits ${brand.name} arrivent bientôt sur le site. Demandez-nous la disponibilité au showroom.`}
              action={<Link to="/marques" className="btn btn-primary mt-2">{t.nav.brands}</Link>}
            />
          </div>
        )}
      </section>

      {/* Conseiller marque */}
      <section className="container-x" aria-labelledby="brand-help">
        <div className="grid overflow-hidden rounded-[2rem] bg-surface md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div className="p-7 md:p-10">
            <h2 id="brand-help" className="font-display text-2xl font-extrabold text-ink md:text-3xl">Un modèle {brand.name} précis en tête ?</h2>
            <p className="mt-3 max-w-lg text-muted-foreground">Tout notre stock n'est pas encore en ligne. Envoyez-nous la référence, nous vous confirmons le prix et la disponibilité.</p>
          </div>
          <div className="flex flex-col justify-center gap-3 border-t p-7 md:border-l md:border-t-0 md:p-10">
            <a
              href={waLink(`Bonjour Belle Image, je cherche un produit ${brand.name} : `)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("whatsapp_click", { location: "brand_help", brand: brand.slug })}
              className="btn btn-whatsapp w-full"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Demander sur WhatsApp
            </a>
            <a href={site.mapLink} target="_blank" rel="noopener noreferrer" className="btn btn-outline w-full">Voir au showroom</a>
          </div>
        </div>
      </section>

      {/* Autres marques */}
      {others.length > 0 && (
        <section className="container-x py-14 md:py-20" aria-labelledby="other-brands">
          <div className="mb-6 flex items-end justify-between gap-4">
            <h2 id="other-brands" className="text-2xl font-extrabold text-ink md:text-3xl">Autres marques</h2>
            <Link to="/marques" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
              Toutes les marques
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
          <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border bg-border sm:grid-cols-4">
            {others.map((b) => (
              <li key={b.slug} className="bg-background">
                <Link to="/marques/$brand" params={{ brand: b.slug }} className="grid h-24 place-items-center px-6 grayscale transition hover:bg-surface hover:grayscale-0 md:h-28">
                  {b.logo ? <img src={b.logo} alt={b.name} loading="lazy" className="max-h-10 w-full object-contain" /> : <span className="font-display font-bold text-ink">{b.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}