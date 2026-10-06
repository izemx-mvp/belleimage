import { Link } from "@tanstack/react-router";
import { LayoutGrid, List, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { Crumbs, Drawer, EmptyState } from "@/components/layout";
import { SampleNote, Stars, iconForCategory } from "@/components/brand";
import { ProductGrid } from "@/components/product";
import { SmartImage } from "@/components/smart-image";
import { attrKeys } from "@/data/categories";
import { brandName, filterProducts, getCategory, scopeProducts, sortOptions, type Category, type Subcategory } from "@/lib/catalogue";
import { activeFilterCount, PAGE_SIZE, searchToFilters, splitList, toggleInList, type CatalogueSearch } from "@/lib/catalogue-search";
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

  return (
    <>
      <section className="relative overflow-hidden bg-surface">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full border-[28px] border-primary/10" aria-hidden />
        <div className="container-x relative grid items-center gap-6 py-8 md:grid-cols-[minmax(0,1fr)_260px] md:py-10">
          <div className="min-w-0">
            <Crumbs items={crumbs} />
            <p className="mt-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-primary"><Stars size={10} />{t.common.products(results.length)}</p>
            <h1 className="mt-2 text-3xl font-extrabold text-ink md:text-5xl">{title}</h1>
            <p className="mt-3 max-w-2xl text-muted-foreground md:text-lg">{intro}</p>
            <p className="mt-3"><SampleNote>{t.catalogue.sampleNote}</SampleNote></p>
          </div>
          {image && (
            <div className="hidden overflow-hidden rounded-2xl shadow-card md:block">
              <SmartImage name={image} alt={title} icon={iconForCategory(category?.slug)} aspect="1 / 1" priority />
            </div>
          )}
        </div>
      </section>

      <div className="container-x grid gap-8 py-8 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="hidden lg:block" aria-label={t.catalogue.filters}>
          <div className="sticky top-36 max-h-[calc(100vh-10rem)] overflow-y-auto pr-2">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-extrabold">{t.catalogue.filters}</h2>
              {nActive > 0 && <button type="button" onClick={reset} className="text-sm font-semibold text-primary hover:underline">{t.catalogue.reset}</button>}
            </div>
            {panel}
          </div>
        </aside>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3 border-b pb-4">
            <button type="button" onClick={() => setDrawer(true)} className="btn btn-outline py-2 text-sm lg:hidden">
              <SlidersHorizontal className="h-4 w-4" aria-hidden />{t.catalogue.filter}{nActive > 0 && <span className="tabular grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[11px] text-primary-foreground">{nActive}</span>}
            </button>
            <p className="tabular hidden text-sm text-muted-foreground sm:block" aria-live="polite">{t.catalogue.shown(shown.length, results.length)}</p>
            <div className="ml-auto flex items-center gap-2">
              <label className="flex items-center gap-2 text-sm">
                <span className="hidden text-muted-foreground sm:inline">{t.catalogue.sort}</span>
                <select
                  value={search.sort ?? "pertinence"}
                  onChange={(e) => setSearch({ sort: e.target.value === "pertinence" ? undefined : (e.target.value as CatalogueSearch["sort"]), page: undefined })}
                  className="h-10 rounded-full border-[1.5px] border-input bg-background px-3 pr-8 text-sm font-semibold focus:border-ring focus:outline-none"
                  aria-label={t.catalogue.sort}
                >
                  {sortOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </label>
              <div className="hidden rounded-full border p-1 sm:flex" role="group" aria-label="Affichage">
                <button type="button" onClick={() => setSearch({ view: undefined })} aria-pressed={view === "grid"} aria-label={t.catalogue.grid} className={cn("grid h-8 w-8 place-items-center rounded-full", view === "grid" ? "bg-ink text-ink-foreground" : "hover:bg-surface")}><LayoutGrid className="h-4 w-4" aria-hidden /></button>
                <button type="button" onClick={() => setSearch({ view: "list" })} aria-pressed={view === "list"} aria-label={t.catalogue.list} className={cn("grid h-8 w-8 place-items-center rounded-full", view === "list" ? "bg-ink text-ink-foreground" : "hover:bg-surface")}><List className="h-4 w-4" aria-hidden /></button>
              </div>
            </div>
          </div>

          {chips.length > 0 && (
            <ul className="flex flex-wrap items-center gap-2 pt-4">
              {chips.map((c) => (
                <li key={c.label}>
                  <button type="button" onClick={c.remove} aria-label={t.catalogue.removeFilter(c.label)} className="inline-flex items-center gap-1.5 rounded-full bg-ink px-3 py-1.5 text-xs font-semibold text-ink-foreground hover:bg-primary">
                    {c.label}<X className="h-3.5 w-3.5" aria-hidden />
                  </button>
                </li>
              ))}
              <li><button type="button" onClick={reset} className="px-2 text-xs font-semibold text-primary hover:underline">{t.catalogue.reset}</button></li>
            </ul>
          )}

          <div className="pt-6">
            {results.length === 0 ? (
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
            ) : (
              <>
                <ProductGrid key={`${view}-${results.length}-${search.sort ?? ""}`} products={shown} layout={view} priorityCount={view === "grid" ? 2 : 1} />
                {shown.length < results.length && (
                  <div className="mt-10 flex flex-col items-center gap-3">
                    <p className="tabular text-sm text-muted-foreground">{t.catalogue.shown(shown.length, results.length)}</p>
                    <div className="h-1 w-48 overflow-hidden rounded-full bg-surface-2"><div className="h-full bg-primary" style={{ width: `${(shown.length / results.length) * 100}%` }} /></div>
                    <button type="button" onClick={() => setSearch({ page: page + 1 })} className="btn btn-outline">{t.catalogue.loadMore}</button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <Drawer open={drawer} onClose={() => setDrawer(false)} side="left" label={t.catalogue.filters}>
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="font-display text-xl font-extrabold">{t.catalogue.filters}</h2>
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
