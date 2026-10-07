// Couche d'accès aux données : remplacer ces fonctions par des appels API plus tard,
// sans toucher aux composants (ils n'importent jamais src/data/products directement).
import { products, type Product } from "@/data/products";
import { categories, pillars, type Category, type Pillar, type Subcategory } from "@/data/categories";
import { brands } from "@/data/brands";
import { posts } from "@/data/posts";

export type { Product, Category, Pillar, Subcategory };

export const normalize = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

export const getProducts = () => products;
export const getProductBySlug = (slug: string) => products.find((p) => p.slug === slug);
export const getCategories = () => categories;
export const getCategory = (slug: string | undefined) => categories.find((c) => c.slug === slug);
export const getSubcategory = (cat: string, sub: string) => getCategory(cat)?.subcategories.find((s) => s.slug === sub);
export const getCategoriesByPillar = (pillar: string) => categories.filter((c) => c.pillar === pillar);
export const getPillars = () => pillars;
export const getPillar = (slug: string | undefined) => pillars.find((p) => p.slug === slug);
export const getBrands = () => brands;
export const getBrand = (slug: string) => brands.find((b) => b.slug === slug);
export const getPosts = () => [...posts].sort((a, b) => b.date.localeCompare(a.date));
export const getPost = (slug: string) => posts.find((p) => p.slug === slug);
export const getLatestPosts = (n = 3) => getPosts().slice(0, n);

export const brandName = (slug: string) => getBrand(slug)?.name ?? "Belle Image";
export const pillarOf = (p: Product) => getCategory(p.category)?.pillar;
export const discount = (p: Product) => (p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0);
export const savings = (p: Product) => (p.oldPrice ? p.oldPrice - p.price : 0);
export const getPromotions = () => products.filter((p) => p.oldPrice).sort((a, b) => discount(b) - discount(a));
export const getBestSellers = (pillar?: string) => products.filter((p) => p.bestSeller && (!pillar || pillarOf(p) === pillar));
export const getProductsByBrand = (slug: string) => products.filter((p) => p.brand === slug);
export const countInCategory = (slug: string) => products.filter((p) => p.category === slug).length;
export const getProductsInCategory = (slug: string, n?: number) => {
  const list = products.filter((p) => p.category === slug);
  return n ? list.slice(0, n) : list;
};

export const getRelated = (p: Product, n = 4) => {
  const same = products.filter((x) => x.category === p.category && x.slug !== p.slug);
  // Même sous-catégorie d'abord.
  return [...same.filter((x) => x.subcategory === p.subcategory), ...same.filter((x) => x.subcategory !== p.subcategory)].slice(0, n);
};
export const getBoughtTogether = (p: Product, n = 3) => {
  const pillar = pillarOf(p);
  return products.filter((x) => x.category !== p.category && pillarOf(x) === pillar && x.price < p.price).slice(0, n);
};

/* ---------------- Recherche locale floue ---------------- */

/** Distance d'édition bornée (Levenshtein) — petite et suffisante pour quelques milliers de mots. */
export function editDistance(a: string, b: string, max = 2): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      const v = Math.min(prev[j]! + 1, cur[j - 1]! + 1, prev[j - 1]! + (a[i - 1] === b[j - 1] ? 0 : 1));
      cur.push(v);
      if (v < rowMin) rowMin = v;
    }
    if (rowMin > max) return max + 1;
    prev = cur;
  }
  return prev[b.length]!;
}

const STOP = new Set(["de", "du", "des", "la", "le", "les", "un", "une", "et", "a", "pour", "avec", "en", "je", "cherche", "veux", "voudrais", "un", "mon", "ma"]);

/** Mot `w` proche du terme `t` (1 faute jusqu'à 7 lettres, 2 au-delà), entier ou en préfixe. */
function isTypo(w: string, t: string) {
  if (w.length < 4) return false;
  const tol = t.length >= 8 ? 2 : 1;
  return editDistance(w, t, tol) <= tol || (w.length > t.length && editDistance(w.slice(0, t.length), t, tol) <= tol);
}

/** Score de pertinence d'un texte pour une requête (0 = aucun rapport). */
export function score(hay: string, q: string) {
  const h = normalize(hay);
  const words = h.split(/[^a-z0-9]+/).filter(Boolean);
  const terms = normalize(q).split(/[^a-z0-9]+/).filter((t) => t && !STOP.has(t));
  if (!terms.length) return 0;
  let s = 0;
  for (const t of terms) {
    if (h.includes(t)) s += t.length > 2 ? 3 : 1;
    else if (t.length > 3 && h.includes(t.replace(/s$|x$/, ""))) s += 2; // pluriels
    else if (t.length >= 5 && words.some((w) => isTypo(w, t))) s += 2; // faute de frappe
    else if (t.length > 4 && h.includes(t.slice(0, 4))) s += 1;
  }
  return s;
}

const productHay = (p: Product) => {
  const c = getCategory(p.category);
  const sub = c?.subcategories.find((s) => s.slug === p.subcategory);
  return `${p.name} ${p.specLine} ${c?.name ?? ""} ${sub?.name ?? ""} ${brandName(p.brand)} ${Object.values(p.attrs).join(" ")}`;
};

export function searchProducts(q: string, limit = 20) {
  return products
    .map((p) => ({ p, s: score(productHay(p), q) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, limit)
    .map((x) => x.p);
}
export function searchCategories(q: string): Category[] {
  return categories
    .map((c) => ({ c, s: score(`${c.name} ${c.subcategories.map((s) => s.name).join(" ")}`, q) }))
    .filter((x) => x.s > 1)
    .sort((a, b) => b.s - a.s)
    .map((x) => x.c);
}
export function searchPosts(q: string) {
  return posts.filter((p) => score(`${p.title} ${p.excerpt}`, q) > 2);
}

/* ---------------- Filtres ---------------- */

export type SortKey = "pertinence" | "prix-asc" | "prix-desc" | "nouveautes" | "promotions";
export const sortOptions: { value: SortKey; label: string }[] = [
  { value: "pertinence", label: "Pertinence" },
  { value: "prix-asc", label: "Prix croissant" },
  { value: "prix-desc", label: "Prix décroissant" },
  { value: "nouveautes", label: "Nouveautés" },
  { value: "promotions", label: "Meilleures promotions" },
];

export type Filters = {
  q?: string | undefined;
  pillar?: string | undefined;
  cats?: string[] | undefined;
  category?: string | undefined;
  sub?: string | undefined;
  brand?: string[] | undefined;
  min?: number | undefined;
  max?: number | undefined;
  promo?: boolean | undefined;
  stock?: boolean | undefined;
  attrs?: Record<string, string[]> | undefined;
  sort?: SortKey | undefined;
};

/** Produits d'une portée (pillar / catégorie / sous-catégorie / requête), avant filtres fins. */
export function scopeProducts(f: Pick<Filters, "q" | "pillar" | "category" | "sub">) {
  let list = f.q ? searchProducts(f.q, 999) : products;
  if (f.pillar) list = list.filter((p) => pillarOf(p) === f.pillar);
  if (f.category) list = list.filter((p) => p.category === f.category);
  if (f.sub) list = list.filter((p) => p.subcategory === f.sub);
  return list;
}

export function filterProducts(list: Product[], f: Filters) {
  let r = list.filter((p) => {
    if (f.category && p.category !== f.category) return false;
    if (f.sub && p.subcategory !== f.sub) return false;
    if (f.pillar && pillarOf(p) !== f.pillar) return false;
    if (f.cats?.length && !f.cats.includes(p.category)) return false;
    if (f.brand?.length && !f.brand.includes(p.brand)) return false;
    if (f.min != null && p.price < f.min) return false;
    if (f.max != null && p.price > f.max) return false;
    if (f.promo && !p.oldPrice) return false;
    if (f.stock && p.stock === "order") return false;
    if (f.attrs) {
      for (const [k, vals] of Object.entries(f.attrs)) {
        const v = p.attrs[k];
        if (vals.length && (v === undefined || !vals.includes(v))) return false;
      }
    }
    return true;
  });
  switch (f.sort) {
    case "prix-asc": r = [...r].sort((a, b) => a.price - b.price); break;
    case "prix-desc": r = [...r].sort((a, b) => b.price - a.price); break;
    case "nouveautes": r = [...r].sort((a, b) => b.createdAt.localeCompare(a.createdAt)); break;
    case "promotions": r = [...r].sort((a, b) => discount(b) - discount(a)); break;
    default:
      // Pertinence : l'ordre de recherche s'il y a une requête, sinon meilleures ventes puis promos.
      if (!f.q) r = [...r].sort((a, b) => Number(b.bestSeller) - Number(a.bestSeller) || discount(b) - discount(a));
  }
  return r;
}

export type Facet = { value: string; label: string; count: number };

/** Valeurs disponibles (avec effectif) pour construire la barre de filtres. */
export function facets(list: Product[]) {
  const count = (get: (p: Product) => string | undefined) => {
    const m = new Map<string, number>();
    for (const p of list) {
      const v = get(p);
      if (v) m.set(v, (m.get(v) ?? 0) + 1);
    }
    return m;
  };
  const brandsM = count((p) => p.brand);
  brandsM.delete("");
  const catsM = count((p) => p.category);
  const prices = list.map((p) => p.price);
  const attrValues = (key: string): Facet[] =>
    [...count((p) => p.attrs[key])].map(([value, n]) => ({ value, label: value, count: n })).sort((a, b) => a.label.localeCompare(b.label, "fr", { numeric: true }));
  return {
    brands: [...brandsM].map(([value, n]) => ({ value, label: brandName(value), count: n })).sort((a, b) => a.label.localeCompare(b.label)),
    categories: categories.filter((c) => catsM.has(c.slug)).map((c) => ({ value: c.slug, label: c.name, count: catsM.get(c.slug) ?? 0 })),
    priceMin: prices.length ? Math.floor(Math.min(...prices) / 100) * 100 : 0,
    priceMax: prices.length ? Math.ceil(Math.max(...prices) / 100) * 100 : 0,
    attrValues,
  };
}
