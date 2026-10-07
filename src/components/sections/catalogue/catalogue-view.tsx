import { Link } from "@tanstack/react-router";
import { Banknote, LayoutGrid, List, SlidersHorizontal, Truck, X } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { Crumbs, Drawer, EmptyState } from "@/components/layout";
import { categoryIcons, iconForCategory } from "@/components/brand";
import { ProductGrid } from "@/components/product";
import { SmartImage } from "@/components/smart-image";
import { attrKeys } from "@/data/categories";
import {
  brandName, filterProducts, getCategoriesByPillar, getCategory, getPillars, scopeProducts, sortOptions,
  type Category, type Subcategory,
} from "@/lib/catalogue";
import { activeFilterCount, cleanSearch, PAGE_SIZE, searchToFilters, splitList, toggleInList, type CatalogueSearch } from "@/lib/catalogue-search";
import { formatPrice } from "@/lib/commerce";
import { t } from "@/i18n/fr";
import { cn } from "@/lib/utils";
import { FilterPanel, type SetSearch } from "./filter-panel";

type Props = {
  search: CatalogueSearch;
  setSearch: SetSearch;
  category?: Category | undefined;
  sub?: Subcategory | undefined;
  title: string;
  intro: string;
  image?: string | undefined;
  crumbs: { label: string; href?: ReactNode }[];
};

const chipCls = (active: boolean) =>
  cn(
    "inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
    active ? "border-ink bg-ink text-ink-foreground" : "bg-background text-ink hover:border-ink",
  );

/** Raccourcis sous le titre : sous-catégories (page catégorie) ou catégories (boutique). */
function QuickNav({ category, sub, search }: { category?: Category | undefined; sub?: Subcategory | undefined; search: CatalogueSearch }) {
  const keep = cleanSearch({ ...search, page: undefined });

  if (category) {
    return (
      <nav aria-label={t.catalogue.subcategory} className="no-scrollbar -mx-4 mt-7 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:px-0">
        <Link to="/boutique/$category" params={{ category: category.slug }} search={keep} className={chipCls(!sub)} aria-current={!sub ? "page" : undefined}>
          {t.catalogue.all}
        </Link>
        {category.subcategories.map((s) => (
          <Link key={s.slug} to="/boutique/$category/$subcategory" params={{ category: category.slug, subcategory: s.slug }} search={keep}
            className={chipCls(sub?.slug === s.slug)} aria-current={sub?.slug === s.slug ? "page" : undefined}>
            {s.name}
          </Link>
        ))}
      </nav>
    );
  }

  const cats = search.pillar
    ? getCategoriesByPillar(search.pillar)
    : getPillars().flatMap((p) => getCategoriesByPillar(p.slug));
  if (search.q || cats.length === 0) return null;
  return (
    <nav aria-label={t.catalogue.category} className="no-scrollbar -mx-4 mt-7 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:px-0">
      {cats.map((c) => {
        const Icon = categoryIcons[c.icon];
        return (
          <Link key={c.slug} to="/boutique/$category" params={{ category: c.slug }} className={chipCls(false)}>
            <Icon className="h-4 w-4 text-primary" aria-hidden />
            {c.name}
          </Link>
        );
      })}
    </nav>
  );
}

export function CatalogueView({ search, setSearch, category, sub, title, intro, image, crumbs }: Props) {
  const [drawer, setDrawer] = useState(false);
  const scope = useMemo(
    () => scopeProducts({ q: search.q, pillar: search.pillar, category: category?.slug, sub: sub?.slug }),
    [search.q, search.pillar, category?.slug, sub?.slug],
  );
  const results = useMemo(() => filterProducts(scope, searchToFilters(search)), [scope, search]);
  const page = search.page ?? 1;
  const shown = results.slice(0, page * PAGE_SIZE);
  const view = search.view ?? "grid";
  const nActive = activeFilterCount(search);
  const reset = () => setSearch({ cat: undefined, brand: undefined, min: undefined, max: undefined, promo: undefined, stock: undefined, page: undefined, ...Object.fromEntries(attrKeys.map((k) => [k, undefined])) });

  const chips: { label: string; remove: () => void }[] = [
    ...splitList(search.cat).map((c) => ({ label: getCategory(c)?.name ?? c, remove: () => setSearch({ cat: toggleInList(search.cat, c), page: undefined }) })),
    ...splitList(search.brand).map((b) => ({ label: brandName(b), remove: () => setSearch({ brand: toggleInList(search.brand, b), page: undefined }) })),
    ...(search.min !== undefined || search.max !== undefined
      ? [{ label: `${formatPrice(search.min ?? 0)} – ${search.max !== undefined ? formatPrice(search.max) : "max"}`, remove: () => setSearch({ min: undefined, max: undefined, page: undefined }) }]
      : []),
    ...(search.promo ? [{ label: t.nav.promos, remove: () => setSearch({ promo: undefined, page: undefined }) }] : []),
    ...(search.stock ? [{ label: t.product.inStock, remove: () => setSearch({ stock: undefined, page: undefined }) }] : []),
    ...attrKeys.flatMap((k) => splitList(search[k]).map((v) => ({ label: v, remove: () => setSearch({ [k]: toggleInList(search[k], v), page: undefined }) }))),
  ];

  const panel = <FilterPanel scope={scope} category={category} activeSub={sub?.slug} search={search} setSearch={setSearch} />;
  const Icon = iconForCategory(category?.slug);
  const endsWithPunct = /[.?!…»"]$/.test(title);

  return (
    <>
      {/* En-tête : titre fort, image ronde cerclée de rouge (le logo), raccourcis */}
      <section className="relative overflow-hidden border-b bg-surface">
        <div className="pointer-events-none absolute -right-40 -top-56 h-[30rem] w-[30rem] rounded-full border-[3px] border-primary/15" aria-hidden />
        <div className="container-x relative py-8 md:py-12">
          <Crumbs items={crumbs} />
          <div className="mt-6 grid items-center gap-8 md:grid-cols-[minmax(0,1fr)_auto]">
            <div className="min-w-0">
              <p className="tabular text-sm font-semibold text-primary">{t.common.products(results.length)}</p>
              <h1 className="mt-2 font-display text-[2.2rem] font-extrabold leading-[1.02] tracking-[-0.03em] text-ink md:text-[3.4rem]">
                {title}
                {!endsWithPunct && <span className="text-primary">.</span>}
              </h1>
              <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground md:text-lg">{intro}</p>
              <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-ink">
                <li className="flex items-center gap-2"><Banknote className="h-4 w-4 text-primary" aria-hidden />Paiement à la livraison</li>
                <li className="flex items-center gap-2"><Truck className="h-4 w-4 text-primary" aria-hidden />Livraison à domicile</li>
              </ul>
            </div>
            {image && (
              <div className="relative hidden md:block">
                <div className="absolute -inset-3 rounded-full border-[3px] border-primary/40" aria-hidden />
                <div className="h-52 w-52 overflow-hidden rounded-full bg-background shadow-lift lg:h-60 lg:w-60">
                  <SmartImage name={image} alt={title} icon={Icon} className="h-full w-full" priority />
                </div>
              </div>
            )}
          </div>
          <QuickNav category={category} sub={sub} search={search} />
        </div>
      </section>

      <div className="container-x grid gap-8 py-8 lg:grid-cols-[272px_minmax(0,1fr)] lg:gap-10 lg:py-10">
        <aside className="hidden lg:block" aria-label={t.catalogue.filters}>
          <div className="sticky top-40 max-h-[calc(100vh-11rem)] overflow-y-auto rounded-[1.5rem] border bg-background p-5">
            <div className="flex items-center justify-between pb-1">
              <h2 className="flex items-center gap-2 font-display text-lg font-extrabold">
                <SlidersHorizontal className="h-4 w-4 text-primary" aria-hidden />
                {t.catalogue.filters}
              </h2>
              {nActive > 0 && <button type="button" onClick={reset} className="text-sm font-semibold text-primary hover:underline">{t.catalogue.reset}</button>}
            </div>
            {panel}
          </div>
        </aside>

        <div className="min-w-0">
          {/* Barre d'outils */}
          <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-surface p-2 pl-3">
            <button type="button" onClick={() => setDrawer(true)} className="btn btn-ink py-2 text-sm lg:hidden">
              <SlidersHorizontal className="h-4 w-4" aria-hidden />
              {t.catalogue.filter}
              {nActive > 0 && <span className="tabular grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[11px] text-primary-foreground">{nActive}</span>}
            </button>
            <p className="tabular hidden text-sm text-muted-foreground sm:block" aria-live="polite">
              <span className="font-bold text-ink">{results.length}</span> {results.length > 1 ? "produits" : "produit"}
            </p>
            <div className="ml-auto flex items-center gap-2">
              <label className="relative flex items-center gap-2 text-sm">
                <span className="hidden text-muted-foreground sm:inline">{t.catalogue.sort}</span>
                <select
                  value={search.sort ?? "pertinence"}
                  onChange={(e) => setSearch({ sort: e.target.value === "pertinence" ? undefined : (e.target.value as CatalogueSearch["sort"]), page: undefined })}
                  className="h-10 cursor-pointer rounded-full border-[1.5px] border-transparent bg-background px-4 pr-9 text-sm font-semibold shadow-card focus:border-ring focus:outline-none"
                  aria-label={t.catalogue.sort}
                >
                  {sortOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </label>
              <div className="hidden rounded-full bg-background p-1 shadow-card sm:flex" role="group" aria-label="Affichage">
                <button type="button" onClick={() => setSearch({ view: undefined })} aria-pressed={view === "grid"} aria-label={t.catalogue.grid} className={cn("grid h-8 w-8 place-items-center rounded-full transition-colors", view === "grid" ? "bg-ink text-ink-foreground" : "hover:bg-surface")}><LayoutGrid className="h-4 w-4" aria-hidden /></button>
                <button type="button" onClick={() => setSearch({ view: "list" })} aria-pressed={view === "list"} aria-label={t.catalogue.list} className={cn("grid h-8 w-8 place-items-center rounded-full transition-colors", view === "list" ? "bg-ink text-ink-foreground" : "hover:bg-surface")}><List className="h-4 w-4" aria-hidden /></button>
              </div>
            </div>
          </div>

          {chips.length > 0 && (
            <ul className="flex flex-wrap items-center gap-2 pt-4">
              {chips.map((c) => (
                <li key={c.label}>
                  <button type="button" onClick={c.remove} aria-label={t.catalogue.removeFilter(c.label)} className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary-soft px-3 py-1.5 text-xs font-semibold text-primary-deep transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground">
                    {c.label}
                    <X className="h-3.5 w-3.5" aria-hidden />
                  </button>
                </li>
              ))}
              <li><button type="button" onClick={reset} className="px-2 text-xs font-semibold text-ink underline-offset-4 hover:underline">{t.catalogue.reset}</button></li>
            </ul>
          )}

          <div className="pt-6">
            {results.length === 0 ? (
              <div className="rounded-[2rem] border border-dashed">
                <EmptyState
                  title={t.catalogue.emptyTitle}
                  text={t.catalogue.emptyText}
                  action={
                    <div className="mt-2 flex flex-wrap justify-center gap-2">
                      {nActive > 0 && <button type="button" onClick={reset} className="btn btn-primary">{t.catalogue.reset}</button>}
                      <Link to="/contact" className="btn btn-outline">{t.nav.contact}</Link>
                    </div>
                  }
                />
              </div>
            ) : (
              <>
                <ProductGrid key={`${view}-${results.length}-${search.sort ?? ""}`} products={shown} layout={view} priorityCount={view === "grid" ? 2 : 1} />
                {shown.length < results.length && (
                  <div className="mt-12 flex flex-col items-center gap-4">
                    <p className="tabular text-sm text-muted-foreground">{t.catalogue.shown(shown.length, results.length)}</p>
                    <div className="h-1.5 w-56 overflow-hidden rounded-full bg-surface-2">
                      <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${(shown.length / results.length) * 100}%` }} />
                    </div>
                    <button type="button" onClick={() => setSearch({ page: page + 1 })} className="btn btn-ink px-8">{t.catalogue.loadMore}</button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <Drawer open={drawer} onClose={() => setDrawer(false)} side="left" label={t.catalogue.filters}>
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="flex items-center gap-2 font-display text-xl font-extrabold">
            <SlidersHorizontal className="h-5 w-5 text-primary" aria-hidden />
            {t.catalogue.filters}
          </h2>
          <button type="button" onClick={() => setDrawer(false)} className="grid h-10 w-10 place-items-center rounded-full hover:bg-surface" aria-label={t.common.close}><X className="h-5 w-5" aria-hidden /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-4">{panel}</div>
        <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-2 border-t p-4">
          <button type="button" onClick={reset} className="btn btn-outline">{t.catalogue.reset}</button>
          <button type="button" onClick={() => setDrawer(false)} className="btn btn-primary">{t.catalogue.apply(results.length)}</button>
        </div>
      </Drawer>
    </>
  );
}