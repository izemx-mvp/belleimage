// CONTENU EXEMPLE À REMPLACER — produits, prix et caractéristiques fictifs pour la maquette.
// Marques : « Marque à confirmer ». Accès uniquement via src/lib/catalogue.ts.
import { brands } from "./brands";

export type Stock = "in" | "low" | "order";
export type Product = {
  slug: string;
  name: string;
  brand: string; // slug de marque
  category: string;
  subcategory: string;
  /** Nom d'image du système d'images (prod-*). Plusieurs produits peuvent partager une image. */
  image: string;
  /** Images supplémentaires de la galerie (noms du système d'images). */
  gallery: string[];
  price: number;
  oldPrice?: number | undefined;
  stock: Stock;
  /** Nombre d'avis réels : 0 tant qu'aucun avis n'est collecté (aucune note affichée). */
  reviews: number;
  isNew: boolean;
  bestSeller: boolean;
  dealEndsAt?: string | undefined; // ISO — promo avec compte à rebours
  specLine: string;
  attrs: Record<string, string>;
  specs: [string, string][];
  colors?: string[] | undefined;
  sizes?: string[] | undefined;
  warranty: string;
  description: string;
  sample: true;
  createdAt: string;
};

type Seed = [name: string, cat: string, sub: string, image: string, price: number, old: number, stock: Stock, spec: string, attrs: Record<string, string>, flags?: string];

const seeds: Seed[] = [
  ["Réfrigérateur combiné No Frost 350 L", "refrigerateurs", "combines", "prod-refrigerateur-combine", 6499, 7499, "in", "350 L · No Frost · A+", { capacite: "350 L", energie: "A+", couleur: "Inox" }, "best deal"],
  ["Réfrigérateur combiné 450 L inox", "refrigerateurs", "combines", "prod-refrigerateur-combine", 8999, 0, "in", "450 L · No Frost · A++", { capacite: "450 L", energie: "A++", couleur: "Inox" }, "new"],
  ["Réfrigérateur américain 600 L", "refrigerateurs", "side-by-side", "prod-refrigerateur-americain", 15999, 17999, "low", "600 L · Distributeur d'eau", { capacite: "600 L", energie: "A+", couleur: "Noir" }, "best"],
  ["Congélateur coffre 300 L", "refrigerateurs", "congelateurs", "prod-refrigerateur-combine", 4299, 0, "in", "300 L · Coffre", { capacite: "300 L", energie: "A+", couleur: "Blanc" }],
  ["Réfrigérateur double porte 250 L", "refrigerateurs", "combines", "prod-refrigerateur-combine", 3999, 4499, "in", "250 L · Double porte", { capacite: "250 L", energie: "A", couleur: "Blanc" }],
  ["Lave-linge hublot 8 kg", "lave-linge", "hublot", "prod-lave-linge-frontal", 4999, 5699, "in", "8 kg · 1400 tr/min · A+++", { capacite: "8 kg", energie: "A+++" }, "best deal"],
  ["Lave-linge hublot 10 kg Inverter", "lave-linge", "hublot", "prod-lave-linge-frontal", 6999, 0, "in", "10 kg · Moteur Inverter", { capacite: "10 kg", energie: "A+++" }, "new"],
  ["Lavante-séchante 9/6 kg", "lave-linge", "lavante-sechante", "prod-lave-linge-frontal", 8499, 9499, "low", "9 kg lavage · 6 kg séchage", { capacite: "9 kg", energie: "A" }],
  ["Lave-linge hublot 7 kg", "lave-linge", "hublot", "prod-lave-linge-frontal", 3799, 0, "in", "7 kg · 1200 tr/min", { capacite: "7 kg", energie: "A++" }],
  ["Lave-vaisselle 14 couverts", "lave-linge", "lave-vaisselle", "prod-lave-vaisselle", 5299, 5999, "in", "14 couverts · 6 programmes", { capacite: "14 couverts", energie: "A++" }, "deal"],
  ["Lave-vaisselle 12 couverts", "lave-linge", "lave-vaisselle", "prod-lave-vaisselle", 3999, 0, "in", "12 couverts · 5 programmes", { capacite: "12 couverts", energie: "A+" }],
  ["Cuisinière 5 feux 90 cm", "cuisson", "cuisinieres", "prod-cuisiniere-4-feux", 4599, 5199, "in", "5 feux gaz · Four 110 L", { feux: "5 feux", couleur: "Inox" }, "best"],
  ["Cuisinière 4 feux 60 cm", "cuisson", "cuisinieres", "prod-cuisiniere-4-feux", 2999, 0, "in", "4 feux gaz · Four 60 L", { feux: "4 feux", couleur: "Blanc" }],
  ["Four encastrable multifonction", "cuisson", "fours", "prod-four-encastrable", 3499, 3999, "order", "70 L · 8 fonctions", { couleur: "Noir" }, "deal"],
  ["Plaque de cuisson gaz 5 feux", "cuisson", "plaques", "prod-cuisiniere-4-feux", 1899, 0, "in", "Verre trempé · 5 feux", { feux: "5 feux", couleur: "Noir" }],
  ["Smart TV 55\" 4K UHD", "tv-image", "smart-tv", "prod-tv-55", 5499, 6299, "in", "55\" · 4K · HDR", { taille: "55\"", resolution: "4K" }, "best deal"],
  ["Smart TV 43\" Full HD", "tv-image", "smart-tv", "prod-tv-55", 2999, 0, "in", "43\" · Full HD · Wi-Fi", { taille: "43\"", resolution: "Full HD" }],
  ["Smart TV 65\" 4K QLED", "tv-image", "grands-ecrans", "prod-tv-55", 9999, 11499, "low", "65\" · 4K · QLED", { taille: "65\"", resolution: "4K" }, "new"],
  ["Smart TV 75\" 4K", "tv-image", "grands-ecrans", "prod-tv-55", 14999, 0, "order", "75\" · 4K · Dolby", { taille: "75\"", resolution: "4K" }],
  ["Climatiseur split 12 000 BTU", "climatisation", "split", "prod-climatiseur-split", 4299, 4899, "in", "12 000 BTU · Chaud/froid", { puissance: "12 000 BTU", energie: "A" }, "best"],
  ["Climatiseur Inverter 18 000 BTU", "climatisation", "inverter", "prod-climatiseur-split", 6999, 7999, "in", "18 000 BTU · Inverter A++", { puissance: "18 000 BTU", energie: "A++" }, "deal"],
  ["Climatiseur Inverter 24 000 BTU", "climatisation", "inverter", "prod-climatiseur-split", 8999, 0, "low", "24 000 BTU · Inverter", { puissance: "24 000 BTU", energie: "A++" }],
  ["Chauffe-eau électrique 80 L", "climatisation", "chauffe-eau", "prod-chauffe-eau", 1899, 2199, "in", "80 L · Thermostat réglable", { puissance: "80 L", energie: "B" }],
  ["Chauffe-eau à gaz 10 L", "climatisation", "chauffe-eau", "prod-chauffe-eau", 1599, 0, "in", "10 L/min · Allumage automatique", { puissance: "10 L/min" }, "new"],
  ["Blender chauffant 1,7 L", "petit-electromenager", "cuisine", "prod-robot-cuisine", 899, 1099, "in", "1,7 L · 1200 W", { couleur: "Inox" }, "deal"],
  ["Robot pâtissier 5 L", "petit-electromenager", "cuisine", "prod-robot-cuisine", 1999, 0, "in", "5 L · 1000 W", { couleur: "Rouge" }, "new"],
  ["Aspirateur traîneau sans sac", "petit-electromenager", "entretien", "prod-aspirateur", 1299, 1499, "in", "2000 W · Sans sac", { couleur: "Gris" }, "best"],
  ["Micro-ondes grill 25 L", "petit-electromenager", "cuisine", "prod-micro-ondes", 1099, 0, "in", "25 L · Grill", { couleur: "Noir" }],
  ["Canapé d'angle 5 places", "salons", "canapes", "prod-salon-angle", 8999, 10499, "in", "5 places · Tissu", { places: "5", matiere: "Tissu", couleur: "Gris" }, "best deal"],
  ["Canapé 3 places velours", "salons", "canapes", "prod-canape-3-places", 5499, 0, "in", "3 places · Velours", { places: "3", matiere: "Velours", couleur: "Vert" }, "new"],
  ["Salon marocain moderne 8 places", "salons", "salons-marocains", "prod-salon-marocain", 14999, 16999, "order", "8 places · Sur mesure", { places: "8", matiere: "Tissu", couleur: "Beige" }, "best"],
  ["Fauteuil relax", "salons", "fauteuils", "prod-canape-3-places", 2499, 2899, "in", "1 place · Simili cuir", { places: "1", matiere: "Simili cuir", couleur: "Noir" }],
  ["Fauteuil d'appoint scandinave", "salons", "fauteuils", "prod-canape-3-places", 1499, 1799, "in", "Pieds bois · Tissu", { places: "1", matiere: "Tissu", couleur: "Beige" }],
  ["Chambre à coucher complète", "chambres", "chambres-completes", "prod-lit-double", 13999, 15999, "low", "Lit 160 · Armoire · 2 chevets", { taille: "160×200", matiere: "Bois MDF" }, "best deal"],
  ["Lit double 160×200 capitonné", "chambres", "lits", "prod-lit-double", 3999, 0, "in", "160×200 · Tête capitonnée", { taille: "160×200", matiere: "Tissu" }, "new"],
  ["Matelas mousse haute densité", "chambres", "matelas", "prod-lit-double", 2299, 2699, "in", "Épaisseur 25 cm", { taille: "160×200", matiere: "Mousse" }, "best"],
  ["Lit enfant 90×190", "chambres", "lits", "prod-lit-double", 1799, 0, "in", "90×190 · Avec tiroir", { taille: "90×190", matiere: "Bois MDF" }],
  ["Table à manger 6 places", "salles-a-manger", "tables", "prod-table-salle-a-manger", 3499, 3999, "in", "6 places · Plateau verre", { places: "6", matiere: "Verre" }, "deal"],
  ["Ensemble table + 8 chaises", "salles-a-manger", "ensembles", "prod-table-salle-a-manger", 7999, 0, "order", "8 places · Bois massif", { places: "8", matiere: "Bois" }, "best"],
  ["Table extensible 4–8 places", "salles-a-manger", "tables", "prod-table-salle-a-manger", 4999, 0, "in", "Extensible · Bois", { places: "8", matiere: "Bois" }, "new"],
  ["Armoire 3 portes miroir", "rangement", "armoires", "prod-armoire", 4299, 4899, "in", "3 portes · Miroir central", { matiere: "Bois MDF", couleur: "Blanc" }, "best"],
  ["Armoire 2 portes coulissantes", "rangement", "armoires", "prod-armoire", 3499, 0, "low", "2 portes coulissantes", { matiere: "Bois MDF", couleur: "Gris" }],
  ["Meuble TV 180 cm", "rangement", "meubles-tv", "prod-meuble-tv", 1999, 2399, "in", "180 cm · LED", { matiere: "Bois MDF", couleur: "Noyer" }, "deal"],
  ["Commode 6 tiroirs", "rangement", "commodes", "prod-commode", 1599, 0, "in", "6 tiroirs", { matiere: "Bois MDF", couleur: "Chêne" }],
];

const slugify = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/["']/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const furniture = ["salons", "chambres", "salles-a-manger", "rangement"];
const categoryImage: Record<string, string> = {
  refrigerateurs: "cat-refrigerateurs", "lave-linge": "cat-lave-linge", cuisson: "cat-cuisinieres-fours", "tv-image": "cat-tv-image",
  climatisation: "cat-climatisation", "petit-electromenager": "cat-petit-electromenager", salons: "cat-salons", chambres: "cat-chambres",
  "salles-a-manger": "cat-salles-a-manger", rangement: "cat-rangement",
};
const attrLabels: Record<string, string> = {
  capacite: "Capacité", energie: "Classe énergétique", couleur: "Couleur", feux: "Feux", taille: "Dimensions / taille",
  resolution: "Résolution", puissance: "Puissance / débit", places: "Places", matiere: "Matière",
};
// Date de référence fixe : rendu identique serveur/client.
const ref = new Date("2026-10-06T00:00:00Z").getTime();

export const products: Product[] = seeds.map(([name, cat, sub, image, price, old, stock, spec, attrs, flags = ""], i) => {
  const isFurniture = furniture.includes(cat);
  const brandPool = brands.filter((b) => (isFurniture ? b.pillar !== "electromenager" : b.pillar !== "ameublement"));
  const brand = brandPool[i % brandPool.length]?.slug ?? "marque-01";
  return {
    slug: slugify(name),
    name,
    brand,
    category: cat,
    subcategory: sub,
    image,
    gallery: [categoryImage[cat] ?? image],
    price,
    oldPrice: old || undefined,
    stock,
    reviews: 0,
    isNew: flags.includes("new"),
    bestSeller: flags.includes("best"),
    dealEndsAt: flags.includes("deal") ? new Date(ref + ((i % 5) + 10) * 86400000).toISOString() : undefined,
    specLine: spec,
    attrs,
    specs: [
      ...Object.entries(attrs).map(([k, v]) => [attrLabels[k] ?? k, v] as [string, string]),
      ["Référence", `BI-${String(1000 + i)} (exemple)`],
      ["Marque", brands.find((b) => b.slug === brand)?.name ?? "Belle Image"],
      ["Dimensions (L × H × P)", "À COMPLÉTER"],
      ["Garantie", isFurniture ? "Garantie Belle Image" : "Garantie constructeur"],
    ],
    colors: attrs["couleur"] ? [attrs["couleur"], isFurniture ? "Beige" : "Blanc"].filter((c, k, a) => a.indexOf(c) === k) : undefined,
    sizes: sub === "matelas" ? ["140×190", "160×200", "180×200"] : undefined,
    warranty: isFurniture ? "Garantie Belle Image" : "Garantie constructeur selon la marque",
    description: `${name} — fiche exemple à remplacer par la description réelle du produit (caractéristiques, usages, points forts). CONTENU EXEMPLE À REMPLACER.`,
    sample: true,
    createdAt: new Date(ref - i * 86400000 * 3).toISOString(),
  };
});
