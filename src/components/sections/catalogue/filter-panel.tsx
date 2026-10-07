import { Link } from "@tanstack/react-router";
import { Check as CheckIcon, ChevronDown } from "lucide-react";
import { useEffect, useId, useState, type ReactNode } from "react";
import { Slider } from "@/components/ui/slider";
import type { Category, Product } from "@/lib/catalogue";
import { facets } from "@/lib/catalogue";
import { cleanSearch, splitList, toggleInList, type CatalogueSearch, type SearchPatch } from "@/lib/catalogue-search";
import { formatPrice } from "@/lib/commerce";
import { t } from "@/i18n/fr";
import { cn } from "@/lib/utils";

export type SetSearch = (patch: SearchPatch) => void;

function Group({ title, children, defaultOpen = true, badge }: { title: string; children: ReactNode; defaultOpen?: boolean; badge?: number }) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  return (
    <div className="border-b py-4 last:border-b-0">
      <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls={id} className="flex w-full items-center justify-between gap-2 text-left font-display text-[0.95rem] font-bold text-ink">
        <span className="flex items-center gap-2">
          {title}
          {badge ? <span className="tabular grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[11px] text-primary-foreground">{badge}</span> : null}
        </span>
        <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition", open && "rotate-180")} aria-hidden />
      </button>
      <div id={id} hidden={!open} className="mt-3">{children}</div>
    </div>
  );
}

/** Case à cocher personnalisée (l'input natif reste accessible, masqué visuellement). */
function Check({ label, count, checked, onChange }: { label: string; count?: number; checked: boolean; onChange: () => void }) {
  return (
    <label className="group flex cursor-pointer items-center gap-3 rounded-xl px-2 py-2 text-sm transition-colors hover:bg-surface">
      <input type="checkbox" checked={checked} onChange={onChange} className="peer sr-only" />
      <span
        className={cn(
          "grid h-5 w-5 shrink-0 place-items-center rounded-md border-[1.5px] transition-colors peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring",
          checked ? "border-primary bg-primary text-primary-foreground" : "border-input bg-background group-hover:border-ink",
        )}
        aria-hidden
      >
        {checked && <CheckIcon className="h-3.5 w-3.5" strokeWidth={3} />}
      </span>
      <span className={cn("min-w-0 flex-1 truncate", checked && "font-semibold text-ink")}>{label}</span>
      {count !== undefined && <span className="tabular rounded-full bg-surface px-2 py-0.5 text-[11px] font-medium text-muted-foreground group-hover:bg-background">{count}</span>}
    </label>
  );
}

/** Interrupteur on/off pour les filtres simples (promo, stock). */
function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl px-2 py-2 text-sm transition-colors hover:bg-surface">
      <span className={cn(checked && "font-semibold text-ink")}>{label}</span>
      <input type="checkbox" role="switch" checked={checked} onChange={onChange} className="peer sr-only" />
      <span
        className={cn(
          "relative h-6 w-10 shrink-0 rounded-full transition-colors peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring",
          checked ? "bg-primary" : "bg-surface-2",
        )}
        aria-hidden
      >
        <span className={cn("absolute top-1 h-4 w-4 rounded-full bg-background shadow-card transition-all", checked ? "left-5" : "left-1")} />
      </span>
    </label>
  );
}

function PriceRange({ min, max, search, setSearch }: { min: number; max: number; search: CatalogueSearch; setSearch: SetSearch }) {
  const lo = Math.max(min, search.min ?? min);
  const hi = Math.min(max, search.max ?? max);
  const [val, setVal] = useState<[number, number]>([lo, hi]);
  useEffect(() => setVal([lo, hi]), [lo, hi]);
  if (max <= min) return <p className="text-sm text-muted-foreground">{formatPrice(min)}</p>;
  return (
    <div className="px-1 pt-1">
      <Slider
        min={min}
        max={max}
        step={100}
        value={val}
        minStepsBetweenThumbs={1}
        thumbLabels={["Prix minimum", "Prix maximum"]}
        onValueChange={(v) => setVal([v[0] ?? min, v[1] ?? max])}
        onValueCommit={(v) => {
          const [a = min, b = max] = v;
          setSearch({ min: a > min ? a : undefined, max: b < max ? b : undefined, page: undefined });
        }}
      />
      <div className="mt-4 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2">
        <div className="rounded-xl border bg-surface px-3 py-2">
          <p className="text-[10px] text-muted-foreground">Min</p>
          <p className="tabular truncate text-sm font-bold text-ink">{formatPrice(val[0])}</p>
        </div>
        <span className="h-px w-3 bg-border" aria-hidden />
        <div className="rounded-xl border bg-surface px-3 py-2">
          <p className="text-[10px] text-muted-foreground">Max</p>
          <p className="tabular truncate text-sm font-bold text-ink">{formatPrice(val[1])}</p>
        </div>
      </div>
    </div>
  );
}

/** Panneau de filtres partagé : barre latérale (desktop) et tiroir (mobile). */
export function FilterPanel({ scope, category, activeSub, search, setSearch }: {
  scope: Product[];
  category?: Category | undefined;
  activeSub?: string | undefined;
  search: CatalogueSearch;
  setSearch: SetSearch;
}) {
  const f = facets(scope);
  // Conserve les filtres en changeant de sous-catégorie (sans la pagination).
  const keep = cleanSearch({ ...search, page: undefined });
  const toggle = (key: keyof CatalogueSearch, value: string) =>
    setSearch({ [key]: toggleInList(search[key] as string | undefined, value), page: undefined });
  const subCls = (active: boolean) =>
    cn(
      "flex items-center justify-between rounded-xl px-3 py-2 text-sm transition-colors",
      active ? "bg-ink font-semibold text-ink-foreground" : "hover:bg-surface",
    );

  return (
    <div>
      {category ? (
        <Group title={t.catalogue.subcategory}>
          <ul className="space-y-0.5">
            <li>
              <Link to="/boutique/$category" params={{ category: category.slug }} search={keep} className={subCls(!activeSub)}>
                {t.catalogue.all}
              </Link>
            </li>
            {category.subcategories.map((s) => (
              <li key={s.slug}>
                <Link to="/boutique/$category/$subcategory" params={{ category: category.slug, subcategory: s.slug }} search={keep} className={subCls(activeSub === s.slug)}>
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </Group>
      ) : (
        f.categories.length > 1 && (
          <Group title={t.catalogue.category} badge={splitList(search.cat).length}>
            {f.categories.map((c) => (
              <Check key={c.value} label={c.label} count={c.count} checked={splitList(search.cat).includes(c.value)} onChange={() => toggle("cat", c.value)} />
            ))}
          </Group>
        )
      )}

      <Group title={t.catalogue.price}>
        <PriceRange min={f.priceMin} max={f.priceMax} search={search} setSearch={setSearch} />
      </Group>

      <Group title="Offres et disponibilité">
        <Toggle label={t.catalogue.promoOnly} checked={Boolean(search.promo)} onChange={() => setSearch({ promo: search.promo ? undefined : true, page: undefined })} />
        <Toggle label={t.catalogue.inStock} checked={Boolean(search.stock)} onChange={() => setSearch({ stock: search.stock ? undefined : true, page: undefined })} />
      </Group>

      {f.brands.length > 1 && (
        <Group title={t.catalogue.brand} badge={splitList(search.brand).length}>
          <div className="max-h-60 overflow-y-auto pr-1">
            {f.brands.map((b) => (
              <Check key={b.value} label={b.label} count={b.count} checked={splitList(search.brand).includes(b.value)} onChange={() => toggle("brand", b.value)} />
            ))}
          </div>
          <p className="mt-2 px-2 text-[11px] text-muted-foreground">{t.home.brandsNote}</p>
        </Group>
      )}

      {category?.attributes.map((a) => {
        const values = f.attrValues(a.key);
        if (values.length < 2) return null;
        return (
          <Group key={a.key} title={a.label} badge={splitList(search[a.key]).length} defaultOpen={splitList(search[a.key]).length > 0}>
            {values.map((v) => (
              <Check key={v.value} label={v.label} count={v.count} checked={splitList(search[a.key]).includes(v.value)} onChange={() => toggle(a.key, v.value)} />
            ))}
          </Group>
        );
      })}
    </div>
  );
}