import { Link } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { useEffect, useId, useState, type ReactNode } from "react";
import { Slider } from "@/components/ui/slider";
import type { Category, Product } from "@/lib/catalogue";
import { facets } from "@/lib/catalogue";
import { cleanSearch, splitList, toggleInList, type CatalogueSearch, type SearchPatch } from "@/lib/catalogue-search";
import { formatPrice } from "@/lib/commerce";
import { t } from "@/i18n/fr";
import { cn } from "@/lib/utils";

export type SetSearch = (patch: SearchPatch) => void;

function Group({ title, children, defaultOpen = true }: { title: string; children: ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  return (
    <div className="border-b py-4 last:border-b-0">
      <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls={id} className="flex w-full items-center justify-between text-left font-display text-sm font-bold uppercase tracking-wide text-ink">
        {title}<ChevronDown className={cn("h-4 w-4 transition", open && "rotate-180")} aria-hidden />
      </button>
      <div id={id} hidden={!open} className="mt-3">{children}</div>
    </div>
  );
}

function Check({ label, count, checked, onChange }: { label: string; count?: number; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-lg px-1 py-1.5 text-sm hover:bg-surface">
      <input type="checkbox" checked={checked} onChange={onChange} className="h-4 w-4 shrink-0 accent-[var(--primary)]" />
      <span className="min-w-0 flex-1 truncate">{label}</span>
      {count !== undefined && <span className="tabular text-xs text-muted-foreground">{count}</span>}
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
    <div className="px-1">
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
      <div className="tabular mt-3 flex justify-between text-sm font-semibold">
        <span>{formatPrice(val[0])}</span><span>{formatPrice(val[1])}</span>
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

  return (
    <div>
      {category ? (
        <Group title={t.catalogue.subcategory}>
          <ul className="space-y-0.5">
            <li>
              <Link to="/boutique/$category" params={{ category: category.slug }} search={keep}
                className={cn("block rounded-lg px-2 py-1.5 text-sm hover:bg-surface", !activeSub && "bg-primary-soft font-semibold text-primary-deep")}>
                {t.catalogue.all}
              </Link>
            </li>
            {category.subcategories.map((s) => (
              <li key={s.slug}>
                <Link to="/boutique/$category/$subcategory" params={{ category: category.slug, subcategory: s.slug }} search={keep}
                  className={cn("block rounded-lg px-2 py-1.5 text-sm hover:bg-surface", activeSub === s.slug && "bg-primary-soft font-semibold text-primary-deep")}>
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </Group>
      ) : (
        f.categories.length > 1 && (
          <Group title={t.catalogue.category}>
            {f.categories.map((c) => (
              <Check key={c.value} label={c.label} count={c.count} checked={splitList(search.cat).includes(c.value)} onChange={() => toggle("cat", c.value)} />
            ))}
          </Group>
        )
      )}

      <Group title={t.catalogue.price}>
        <PriceRange min={f.priceMin} max={f.priceMax} search={search} setSearch={setSearch} />
      </Group>

      <Group title={t.nav.promos}>
        <Check label={t.catalogue.promoOnly} checked={Boolean(search.promo)} onChange={() => setSearch({ promo: search.promo ? undefined : true, page: undefined })} />
        <Check label={t.catalogue.inStock} checked={Boolean(search.stock)} onChange={() => setSearch({ stock: search.stock ? undefined : true, page: undefined })} />
      </Group>

      {f.brands.length > 1 && (
        <Group title={t.catalogue.brand}>
          <div className="max-h-56 overflow-y-auto pr-1">
            {f.brands.map((b) => (
              <Check key={b.value} label={b.label} count={b.count} checked={splitList(search.brand).includes(b.value)} onChange={() => toggle("brand", b.value)} />
            ))}
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">{t.home.brandsNote}</p>
        </Group>
      )}

      {category?.attributes.map((a) => {
        const values = f.attrValues(a.key);
        if (values.length < 2) return null;
        return (
          <Group key={a.key} title={a.label}>
            {values.map((v) => (
              <Check key={v.value} label={v.label} count={v.count} checked={splitList(search[a.key]).includes(v.value)} onChange={() => toggle(a.key, v.value)} />
            ))}
          </Group>
        );
      })}
    </div>
  );
}
