// Search params du catalogue : validation (validateSearch) et conversion en filtres.
// Les listes sont stockées sous forme de chaînes séparées par des virgules (URL lisibles).
import { attrKeys, type AttrKey } from "@/data/categories";
import type { Filters, SortKey } from "./catalogue";

export type CatalogueSearch = {
  q?: string;
  pillar?: string;
  cat?: string;
  brand?: string;
  min?: number;
  max?: number;
  promo?: boolean;
  stock?: boolean;
  sort?: SortKey;
  view?: "grid" | "list";
  page?: number;
} & Partial<Record<AttrKey, string>>;

const sorts: SortKey[] = ["pertinence", "prix-asc", "prix-desc", "nouveautes", "promotions"];

const str = (v: unknown) => {
  if (typeof v === "number") return String(v);
  if (typeof v !== "string") return undefined;
  const s = v.trim().slice(0, 120);
  return s || undefined;
};
const num = (v: unknown) => {
  const n = typeof v === "number" ? v : typeof v === "string" && v.trim() !== "" ? Number(v) : NaN;
  return Number.isFinite(n) && n >= 0 ? Math.round(n) : undefined;
};
const bool = (v: unknown) => (v === true || v === "true" || v === "1" || v === 1 ? true : undefined);

/** Valide des search params bruts : toute valeur invalide est ignorée (jamais d'erreur). */
export function validateCatalogueSearch(raw: Record<string, unknown>): CatalogueSearch {
  const out: CatalogueSearch = {};
  const q = str(raw["q"]); if (q) out.q = q;
  const pillar = str(raw["pillar"]); if (pillar === "electromenager" || pillar === "ameublement") out.pillar = pillar;
  const cat = str(raw["cat"]); if (cat) out.cat = cat;
  const brand = str(raw["brand"]); if (brand) out.brand = brand;
  const min = num(raw["min"]); if (min !== undefined) out.min = min;
  const max = num(raw["max"]); if (max !== undefined) out.max = max;
  if (bool(raw["promo"])) out.promo = true;
  if (bool(raw["stock"])) out.stock = true;
  const sort = str(raw["sort"]) as SortKey | undefined; if (sort && sorts.includes(sort) && sort !== "pertinence") out.sort = sort;
  if (raw["view"] === "list") out.view = "list";
  const page = num(raw["page"]); if (page && page > 1) out.page = Math.min(page, 50);
  for (const k of attrKeys) {
    const v = str(raw[k]);
    if (v) out[k] = v;
  }
  return out;
}

export const splitList = (v: string | undefined) => (v ? v.split(",").map((x) => x.trim()).filter(Boolean) : []);
export const joinList = (vals: string[]) => (vals.length ? vals.join(",") : undefined);

/** Bascule une valeur dans une liste séparée par des virgules. */
export function toggleInList(current: string | undefined, value: string) {
  const list = splitList(current);
  return joinList(list.includes(value) ? list.filter((x) => x !== value) : [...list, value]);
}

export function searchToFilters(s: CatalogueSearch, scope: { category?: string | undefined; sub?: string | undefined } = {}): Filters {
  const attrs: Record<string, string[]> = {};
  for (const k of attrKeys) {
    const vals = splitList(s[k]);
    if (vals.length) attrs[k] = vals;
  }
  return {
    q: s.q,
    pillar: s.pillar,
    cats: splitList(s.cat),
    category: scope.category,
    sub: scope.sub,
    brand: splitList(s.brand),
    min: s.min,
    max: s.max,
    promo: s.promo,
    stock: s.stock,
    attrs,
    sort: s.sort ?? "pertinence",
  };
}

/** Nombre de filtres actifs (hors tri, vue, page et requête). */
export function activeFilterCount(s: CatalogueSearch) {
  let n = splitList(s.cat).length + splitList(s.brand).length;
  if (s.min !== undefined || s.max !== undefined) n++;
  if (s.promo) n++;
  if (s.stock) n++;
  for (const k of attrKeys) n += splitList(s[k]).length;
  return n;
}

export const PAGE_SIZE = 12;

/** Modification partielle des search params (undefined = supprimer la clé). */
export type SearchPatch = { [K in keyof CatalogueSearch]?: CatalogueSearch[K] | undefined };

/** Supprime les clés vides pour garder des URL propres. */
export function cleanSearch(s: SearchPatch): CatalogueSearch {
  return Object.fromEntries(Object.entries(s).filter(([, v]) => v !== undefined && v !== "" && v !== false)) as CatalogueSearch;
}
