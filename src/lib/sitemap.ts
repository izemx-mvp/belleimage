// Génère le contenu de public/sitemap.xml à partir des données (voir src/test/sitemap.test.ts).
import { site } from "@/config/site";
import { getBrands, getCategories, getPosts, getProducts } from "./catalogue";

export const staticPaths = [
  "/", "/boutique", "/promotions", "/marques", "/a-propos", "/livraison-paiement", "/garantie-sav",
  "/conseils", "/contact", "/faq", "/cgv", "/mentions-legales",
];

export function sitemapPaths() {
  return [
    ...staticPaths,
    ...getCategories().flatMap((c) => [`/boutique/${c.slug}`, ...c.subcategories.map((s) => `/boutique/${c.slug}/${s.slug}`)]),
    ...getProducts().map((p) => `/produit/${p.slug}`),
    ...getBrands().map((b) => `/marques/${b.slug}`),
    ...getPosts().map((p) => `/conseils/${p.slug}`),
  ];
}

export function buildSitemap() {
  const urls = sitemapPaths()
    .map((p) => `  <url><loc>${site.url}${p === "/" ? "/" : p}</loc></url>`)
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}
