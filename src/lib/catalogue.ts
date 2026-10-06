// Couche d'accès aux données : remplacer ces fonctions par des appels API plus tard.
import { products, type Product } from "@/data/products";
import { categories, pillars, type Category } from "@/data/categories";
import { brands } from "@/data/brands";
import { posts } from "@/data/posts";

export const normalize = (s: string) =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

export const getProducts = () => products;
export const getProductBySlug = (slug: string) => products.find((p) => p.slug === slug);
export const getCategories = () => categories;
export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);
export const getCategoriesByPillar = (pillar: string) => categories.filter((c) => c.pillar === pillar);
export const getPillars = () => pillars;
export const getBrands = () => brands;
export const getBrand = (slug: string) => brands.find((b) => b.slug === slug);
export const getPosts = () => posts;
export const getPost = (slug: string) => posts.find((p) => p.slug === slug);

export const brandName = (slug: string) => getBrand(slug)?.name ?? "Marque à confirmer";
export const discount = (p: Product) => (p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0);
export const getPromotions = () => products.filter((p) => p.oldPrice).sort((a, b) => discount(b) - discount(a));
export const getBestSellers = (pillar?: string) =>
  products.filter((p) => p.bestSeller && (!pillar || getCategory(p.category)?.pillar === pillar));
export const countInCategory = (slug: string) => products.filter((p) => p.category === slug).length;

export const getRelated = (p: Product, n = 4) =>
  products.filter((x) => x.category === p.category && x.slug !== p.slug).slice(0, n);
export const getBoughtTogether = (p: Product, n = 3) => {
  const pillar = getCategory(p.category)?.pillar;
  return products.filter((x) => x.category !== p.category && getCategory(x.category)?.pillar === pillar).slice(0, n);
};

function score(hay: string, q: string) {
  const h = normalize(hay);
  const terms = normalize(q).split(/\s+/).filter(Boolean);
  if (!terms.length) return 0;
  let s = 0;
  for (const t of terms) {
    if (h.includes(t)) s += t.length > 2 ? 3 : 1;
    else if (t.length > 3 && h.includes(t.slice(0, -1))) s += 2; // pluriels / fautes légères
    else if (t.length > 4 && h.includes(t.slice(0, 4))) s += 1;
  }
  return s;
}

export function searchProducts(q: string, limit = 20) {
  return products
    .map((p) => ({ p, s: score(`${p.name} ${p.specLine} ${getCategory(p.category)?.name} ${brandName(p.brand)}`, q) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, limit)
    .map((x) => x.p);
}
export function searchCategories(q: string): Category[] {
  return categories.filter((c) => score(`${c.name} ${c.subcategories.map((s) => s.name).join(" ")}`, q) > 1);
}
export function searchPosts(q: string) {
  return posts.filter((p) => score(`${p.title} ${p.excerpt}`, q) > 2);
}

export type Filters = {
  sub?: string;
  brand?: string[];
  min?: number;
  max?: number;
  promo?: boolean;
  stock?: boolean;
  attrs?: Record<string, string[]>;
  sort?: "pertinence" | "prix-asc" | "prix-desc" | "nouveautes" | "promotions";
};

export function filterProducts(list: Product[], f: Filters) {
  let r = list.filter((p) => {
    if (f.sub && p.subcategory !== f.sub) return false;
    if (f.brand?.length && !f.brand.includes(p.brand)) return false;
    if (f.min != null && p.price < f.min) return false;
    if (f.max != null && p.price > f.max) return false;
    if (f.promo && !p.oldPrice) return false;
    if (f.stock && p.stock === "order") return false;
    if (f.attrs) for (const [k, vals] of Object.entries(f.attrs)) if (vals.length && !vals.includes(p.attrs[k])) return false;
    return true;
  });
  switch (f.sort) {
    case "prix-asc": r = [...r].sort((a, b) => a.price - b.price); break;
    case "prix-desc": r = [...r].sort((a, b) => b.price - a.price); break;
    case "nouveautes": r = [...r].sort((a, b) => b.createdAt.localeCompare(a.createdAt)); break;
    case "promotions": r = [...r].sort((a, b) => discount(b) - discount(a)); break;
  }
  return r;
}
