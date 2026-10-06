export type Pillar = "electromenager" | "ameublement";

export type Subcategory = { slug: string; name: string };
export type Category = {
  slug: string;
  name: string;
  pillar: Pillar;
  icon: IconKey;
  intro: string;
  subcategories: Subcategory[];
  attributes: { key: string; label: string }[];
};

export type IconKey =
  | "fridge" | "washer" | "oven" | "tv" | "ac" | "blender"
  | "sofa" | "bed" | "dining" | "wardrobe";

export const pillars: { slug: Pillar; name: string; intro: string }[] = [
  { slug: "electromenager", name: "Électroménager", intro: "Froid, lavage, cuisson, image et climatisation : les grandes marques réunies dans notre showroom." },
  { slug: "ameublement", name: "Ameublement", intro: "Salons, chambres, salles à manger et rangement pour toute la maison." },
];

export const categories: Category[] = [
  { slug: "refrigerateurs", name: "Réfrigérateurs", pillar: "electromenager", icon: "fridge",
    intro: "Combinés, side-by-side, congélateurs : conservez mieux, plus longtemps.",
    subcategories: [{ slug: "combines", name: "Combinés" }, { slug: "side-by-side", name: "Side-by-side" }, { slug: "congelateurs", name: "Congélateurs" }],
    attributes: [{ key: "capacite", label: "Capacité" }, { key: "energie", label: "Classe énergétique" }, { key: "couleur", label: "Couleur" }] },
  { slug: "lave-linge", name: "Lave-linge", pillar: "electromenager", icon: "washer",
    intro: "Hublot, top ou séchants : le linge propre sans effort.",
    subcategories: [{ slug: "hublot", name: "Hublot" }, { slug: "lavante-sechante", name: "Lavante-séchante" }],
    attributes: [{ key: "capacite", label: "Capacité" }, { key: "energie", label: "Classe énergétique" }] },
  { slug: "cuisson", name: "Cuisinières & fours", pillar: "electromenager", icon: "oven",
    intro: "Cuisinières, fours et plaques pour toutes les cuisines.",
    subcategories: [{ slug: "cuisinieres", name: "Cuisinières" }, { slug: "fours", name: "Fours" }, { slug: "plaques", name: "Plaques" }],
    attributes: [{ key: "feux", label: "Nombre de feux" }, { key: "couleur", label: "Couleur" }] },
  { slug: "tv-image", name: "TV & image", pillar: "electromenager", icon: "tv",
    intro: "Smart TV, 4K et grands écrans pour le salon.",
    subcategories: [{ slug: "smart-tv", name: "Smart TV" }, { slug: "grands-ecrans", name: "Grands écrans" }],
    attributes: [{ key: "taille", label: "Taille d'écran" }, { key: "resolution", label: "Résolution" }] },
  { slug: "climatisation", name: "Climatisation", pillar: "electromenager", icon: "ac",
    intro: "Climatiseurs split et inverter pour l'été comme l'hiver.",
    subcategories: [{ slug: "split", name: "Split mural" }, { slug: "inverter", name: "Inverter" }],
    attributes: [{ key: "puissance", label: "Puissance" }, { key: "energie", label: "Classe énergétique" }] },
  { slug: "petit-electromenager", name: "Petit électroménager", pillar: "electromenager", icon: "blender",
    intro: "Blenders, aspirateurs, micro-ondes et indispensables du quotidien.",
    subcategories: [{ slug: "cuisine", name: "Préparation culinaire" }, { slug: "entretien", name: "Entretien" }],
    attributes: [{ key: "couleur", label: "Couleur" }] },
  { slug: "salons", name: "Salons", pillar: "ameublement", icon: "sofa",
    intro: "Canapés, salons marocains et fauteuils pour recevoir.",
    subcategories: [{ slug: "canapes", name: "Canapés" }, { slug: "salons-marocains", name: "Salons marocains" }, { slug: "fauteuils", name: "Fauteuils" }],
    attributes: [{ key: "places", label: "Places" }, { key: "matiere", label: "Matière" }, { key: "couleur", label: "Couleur" }] },
  { slug: "chambres", name: "Chambres", pillar: "ameublement", icon: "bed",
    intro: "Lits, chambres complètes et matelas pour bien dormir.",
    subcategories: [{ slug: "chambres-completes", name: "Chambres complètes" }, { slug: "lits", name: "Lits" }, { slug: "matelas", name: "Matelas" }],
    attributes: [{ key: "taille", label: "Dimensions" }, { key: "matiere", label: "Matière" }] },
  { slug: "salles-a-manger", name: "Salles à manger", pillar: "ameublement", icon: "dining",
    intro: "Tables, chaises et buffets pour les repas en famille.",
    subcategories: [{ slug: "tables", name: "Tables" }, { slug: "ensembles", name: "Ensembles" }],
    attributes: [{ key: "places", label: "Places" }, { key: "matiere", label: "Matière" }] },
  { slug: "rangement", name: "Rangement", pillar: "ameublement", icon: "wardrobe",
    intro: "Armoires, commodes et meubles TV.",
    subcategories: [{ slug: "armoires", name: "Armoires" }, { slug: "meubles-tv", name: "Meubles TV" }],
    attributes: [{ key: "matiere", label: "Matière" }, { key: "couleur", label: "Couleur" }] },
];
