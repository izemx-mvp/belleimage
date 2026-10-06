// CONTENU EXEMPLE À REMPLACER — produits, prix et caractéristiques fictifs pour la maquette.
import { brands } from "./brands";

export type Stock = "in" | "low" | "order";
export type Product = {
  slug: string;
  name: string;
  brand: string; // slug de marque
  category: string;
  subcategory: string;
  price: number;
  oldPrice?: number;
  stock: Stock;
  rating: number;
  reviews: number;
  isNew?: boolean;
  bestSeller?: boolean;
  dealEndsAt?: string; // ISO — promo avec compte à rebours
  specLine: string;
  attrs: Record<string, string>;
  specs: [string, string][];
  colors?: string[];
  sizes?: string[];
  warranty: string;
  description: string;
  sample: true;
  createdAt: string;
};

type Seed = [name: string, cat: string, sub: string, price: number, old: number | 0, stock: Stock, spec: string, attrs: Record<string, string>, flags?: string];

const seeds: Seed[] = [
  ["Réfrigérateur combiné No Frost 350 L", "refrigerateurs", "combines", 6499, 7499, "in", "350 L · No Frost · A+", { capacite: "350 L", energie: "A+", couleur: "Inox" }, "best deal"],
  ["Réfrigérateur combiné 450 L inox", "refrigerateurs", "combines", 8999, 0, "in", "450 L · No Frost · A++", { capacite: "450 L", energie: "A++", couleur: "Inox" }, "new"],
  ["Réfrigérateur side-by-side 600 L", "refrigerateurs", "side-by-side", 15999, 17999, "low", "600 L · Distributeur d'eau", { capacite: "600 L", energie: "A+", couleur: "Noir" }, "best"],
  ["Congélateur coffre 300 L", "refrigerateurs", "congelateurs", 4299, 0, "in", "300 L · Coffre", { capacite: "300 L", energie: "A+", couleur: "Blanc" }],
  ["Réfrigérateur double porte 250 L", "refrigerateurs", "combines", 3999, 4499, "in", "250 L · Double porte", { capacite: "250 L", energie: "A", couleur: "Blanc" }],
  ["Lave-linge hublot 8 kg", "lave-linge", "hublot", 4999, 5699, "in", "8 kg · 1400 tr/min · A+++", { capacite: "8 kg", energie: "A+++" }, "best deal"],
  ["Lave-linge hublot 10 kg Inverter", "lave-linge", "hublot", 6999, 0, "in", "10 kg · Moteur Inverter", { capacite: "10 kg", energie: "A+++" }, "new"],
  ["Lavante-séchante 9/6 kg", "lave-linge", "lavante-sechante", 8499, 9499, "low", "9 kg lavage · 6 kg séchage", { capacite: "9 kg", energie: "A" }],
  ["Lave-linge hublot 7 kg", "lave-linge", "hublot", 3799, 0, "in", "7 kg · 1200 tr/min", { capacite: "7 kg", energie: "A++" }],
  ["Cuisinière 5 feux 90 cm", "cuisson", "cuisinieres", 4599, 5199, "in", "5 feux gaz · Four 110 L", { feux: "5 feux", couleur: "Inox" }, "best"],
  ["Cuisinière 4 feux 60 cm", "cuisson", "cuisinieres", 2999, 0, "in", "4 feux gaz · Four 60 L", { feux: "4 feux", couleur: "Blanc" }],
  ["Four encastrable multifonction", "cuisson", "fours", 3499, 3999, "order", "70 L · 8 fonctions", { feux: "—", couleur: "Noir" }, "deal"],
  ["Plaque de cuisson gaz 5 feux", "cuisson", "plaques", 1899, 0, "in", "Verre trempé · 5 feux", { feux: "5 feux", couleur: "Noir" }],
  ["Smart TV 55\" 4K UHD", "tv-image", "smart-tv", 5499, 6299, "in", "55\" · 4K · HDR", { taille: "55\"", resolution: "4K" }, "best deal"],
  ["Smart TV 43\" Full HD", "tv-image", "smart-tv", 2999, 0, "in", "43\" · Full HD · Wi-Fi", { taille: "43\"", resolution: "Full HD" }],
  ["Smart TV 65\" 4K QLED", "tv-image", "grands-ecrans", 9999, 11499, "low", "65\" · 4K · QLED", { taille: "65\"", resolution: "4K" }, "new"],
  ["Smart TV 75\" 4K", "tv-image", "grands-ecrans", 14999, 0, "order", "75\" · 4K · Dolby", { taille: "75\"", resolution: "4K" }],
  ["Climatiseur split 12 000 BTU", "climatisation", "split", 4299, 4899, "in", "12 000 BTU · Chaud/froid", { puissance: "12 000 BTU", energie: "A" }, "best"],
  ["Climatiseur Inverter 18 000 BTU", "climatisation", "inverter", 6999, 7999, "in", "18 000 BTU · Inverter A++", { puissance: "18 000 BTU", energie: "A++" }, "deal"],
  ["Climatiseur Inverter 24 000 BTU", "climatisation", "inverter", 8999, 0, "low", "24 000 BTU · Inverter", { puissance: "24 000 BTU", energie: "A++" }],
  ["Blender chauffant 1,7 L", "petit-electromenager", "cuisine", 899, 1099, "in", "1,7 L · 1200 W", { couleur: "Inox" }, "deal"],
  ["Robot pâtissier 5 L", "petit-electromenager", "cuisine", 1999, 0, "in", "5 L · 1000 W", { couleur: "Rouge" }, "new"],
  ["Aspirateur traîneau sans sac", "petit-electromenager", "entretien", 1299, 1499, "in", "2000 W · Sans sac", { couleur: "Gris" }, "best"],
  ["Micro-ondes grill 25 L", "petit-electromenager", "cuisine", 1099, 0, "in", "25 L · Grill", { couleur: "Noir" }],
  ["Canapé d'angle 5 places", "salons", "canapes", 8999, 10499, "in", "5 places · Tissu", { places: "5", matiere: "Tissu", couleur: "Gris" }, "best deal"],
  ["Canapé 3 places velours", "salons", "canapes", 5499, 0, "in", "3 places · Velours", { places: "3", matiere: "Velours", couleur: "Vert" }, "new"],
  ["Salon marocain moderne 8 places", "salons", "salons-marocains", 14999, 16999, "order", "8 places · Sur mesure", { places: "8", matiere: "Tissu", couleur: "Beige" }, "best"],
  ["Fauteuil relax", "salons", "fauteuils", 2499, 2899, "in", "1 place · Simili cuir", { places: "1", matiere: "Simili cuir", couleur: "Noir" }],
  ["Chambre à coucher complète", "chambres", "chambres-completes", 13999, 15999, "low", "Lit 160 · Armoire · 2 chevets", { taille: "160×200", matiere: "Bois MDF" }, "best deal"],
  ["Lit double 160×200 capitonné", "chambres", "lits", 3999, 0, "in", "160×200 · Tête capitonnée", { taille: "160×200", matiere: "Tissu" }, "new"],
  ["Matelas mousse haute densité", "chambres", "matelas", 2299, 2699, "in", "160×200 · Épaisseur 25 cm", { taille: "160×200", matiere: "Mousse" }, "best"],
  ["Lit enfant 90×190", "chambres", "lits", 1799, 0, "in", "90×190 · Avec tiroir", { taille: "90×190", matiere: "Bois MDF" }],
  ["Table à manger 6 places", "salles-a-manger", "tables", 3499, 3999, "in", "6 places · Plateau verre", { places: "6", matiere: "Verre" }, "deal"],
  ["Ensemble table + 8 chaises", "salles-a-manger", "ensembles", 7999, 0, "order", "8 places · Bois massif", { places: "8", matiere: "Bois" }, "best"],
  ["Table extensible 4–8 places", "salles-a-manger", "tables", 4999, 0, "in", "Extensible · Bois", { places: "8", matiere: "Bois" }, "new"],
  ["Armoire 3 portes miroir", "rangement", "armoires", 4299, 4899, "in", "3 portes · Miroir central", { matiere: "Bois MDF", couleur: "Blanc" }, "best"],
  ["Meuble TV 180 cm", "rangement", "meubles-tv", 1999, 2399, "in", "180 cm · LED", { matiere: "Bois MDF", couleur: "Noyer" }, "deal"],
  ["Commode 6 tiroirs", "rangement", "armoires", 1599, 0, "in", "6 tiroirs", { matiere: "Bois MDF", couleur: "Chêne" }],
  ["Armoire 2 portes coulissantes", "rangement", "armoires", 3499, 0, "low", "2 portes coulissantes", { matiere: "Bois MDF", couleur: "Gris" }],
  ["Fauteuil d'appoint scandinave", "salons", "fauteuils", 1499, 1799, "in", "Pieds bois · Tissu", { places: "1", matiere: "Tissu", couleur: "Beige" }],
];

const slugify = (s: string) =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/["']/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const furniture = ["salons", "chambres", "salles-a-manger", "rangement"];
const now = new Date("2026-10-06T00:00:00Z").getTime();

export const products: Product[] = seeds.map(([name, cat, sub, price, old, stock, spec, attrs, flags = ""], i) => {
  const isFurniture = furniture.includes(cat);
  const brandPool = brands.filter((b) => (isFurniture ? b.pillar !== "electromenager" : b.pillar !== "ameublement"));
  const brand = brandPool[i % brandPool.length].slug;
  return {
    slug: slugify(name),
    name,
    brand,
    category: cat,
    subcategory: sub,
    price,
    oldPrice: old || undefined,
    stock,
    rating: 4 + ((i * 7) % 10) / 10,
    reviews: 0,
    isNew: flags.includes("new"),
    bestSeller: flags.includes("best"),
    dealEndsAt: flags.includes("deal") ? new Date(now + ((i % 5) + 3) * 86400000).toISOString() : undefined,
    specLine: spec,
    attrs,
    specs: [
      ...Object.entries(attrs).map(([k, v]) => [k.charAt(0).toUpperCase() + k.slice(1), v] as [string, string]),
      ["Référence", `BI-${String(1000 + i)}`],
      ["Marque", "Marque à confirmer"],
      ["Garantie", isFurniture ? "À confirmer" : "Garantie constructeur — à confirmer"],
    ],
    colors: attrs.couleur ? [attrs.couleur, isFurniture ? "Beige" : "Blanc"] : undefined,
    sizes: cat === "chambres" && sub !== "lits" ? undefined : undefined,
    warranty: isFurniture ? "Garantie Belle Image — durée à confirmer" : "Garantie constructeur — durée à confirmer",
    description: `${name} — fiche exemple à remplacer par la description réelle du produit (caractéristiques, usages, points forts). CONTENU EXEMPLE À REMPLACER.`,
    sample: true,
    createdAt: new Date(now - i * 86400000 * 3).toISOString(),
  };
});
