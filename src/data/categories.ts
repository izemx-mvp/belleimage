export type Pillar = "electromenager" | "ameublement";

export type Subcategory = { slug: string; name: string };
export type Category = {
  slug: string;
  name: string;
  pillar: Pillar;
  icon: IconKey;
  /** Nom d'image du système d'images (cat-*). */
  image: string;
  intro: string;
  subcategories: Subcategory[];
  attributes: { key: AttrKey; label: string }[];
};

export type IconKey =
  | "fridge" | "washer" | "oven" | "tv" | "ac" | "blender"
  | "sofa" | "bed" | "dining" | "wardrobe";

/** Attributs filtrables (clé = nom du search param). */
export const attrKeys = ["capacite", "energie", "couleur", "feux", "taille", "resolution", "puissance", "places", "matiere"] as const;
export type AttrKey = (typeof attrKeys)[number];

export const pillars: { slug: Pillar; name: string; intro: string; promoImage: string }[] = [
  { slug: "electromenager", name: "Électroménager", promoImage: "promo-menu-electromenager",
    intro: "Froid, lavage, cuisson, image et climatisation : les grandes marques réunies dans notre showroom." },
  { slug: "ameublement", name: "Ameublement", promoImage: "promo-menu-ameublement",
    intro: "Salons, chambres, salles à manger et rangement pour toute la maison." },
];

export const categories: Category[] = [
  { slug: "refrigerateurs", name: "Réfrigérateurs", pillar: "electromenager", icon: "fridge", image: "cat-refrigerateurs",
    intro: "Combinés, américains, congélateurs : conservez mieux, plus longtemps.",
    subcategories: [{ slug: "combines", name: "Combinés" }, { slug: "side-by-side", name: "Américains (side-by-side)" }, { slug: "congelateurs", name: "Congélateurs" }],
    attributes: [{ key: "capacite", label: "Capacité" }, { key: "energie", label: "Classe énergétique" }, { key: "couleur", label: "Couleur" }] },
  { slug: "lave-linge", name: "Lave-linge", pillar: "electromenager", icon: "washer", image: "cat-lave-linge",
    intro: "Lave-linge hublot, lavantes-séchantes et lave-vaisselle : le lavage sans effort.",
    subcategories: [{ slug: "hublot", name: "Hublot" }, { slug: "lavante-sechante", name: "Lavante-séchante" }, { slug: "lave-vaisselle", name: "Lave-vaisselle" }],
    attributes: [{ key: "capacite", label: "Capacité" }, { key: "energie", label: "Classe énergétique" }] },
  { slug: "cuisson", name: "Cuisinières & fours", pillar: "electromenager", icon: "oven", image: "cat-cuisinieres-fours",
    intro: "Cuisinières, fours et plaques pour toutes les cuisines.",
    subcategories: [{ slug: "cuisinieres", name: "Cuisinières" }, { slug: "fours", name: "Fours" }, { slug: "plaques", name: "Plaques" }],
    attributes: [{ key: "feux", label: "Nombre de feux" }, { key: "couleur", label: "Couleur" }] },
  { slug: "tv-image", name: "TV & image", pillar: "electromenager", icon: "tv", image: "cat-tv-image",
    intro: "Smart TV, 4K et grands écrans pour le salon.",
    subcategories: [{ slug: "smart-tv", name: "Smart TV" }, { slug: "grands-ecrans", name: "Grands écrans" }],
    attributes: [{ key: "taille", label: "Taille d'écran" }, { key: "resolution", label: "Résolution" }] },
  { slug: "climatisation", name: "Climatisation", pillar: "electromenager", icon: "ac", image: "cat-climatisation",
    intro: "Climatiseurs split et inverter, chauffe-eau : le confort toute l'année.",
    subcategories: [{ slug: "split", name: "Split mural" }, { slug: "inverter", name: "Inverter" }, { slug: "chauffe-eau", name: "Chauffe-eau" }],
    attributes: [{ key: "puissance", label: "Puissance" }, { key: "energie", label: "Classe énergétique" }] },
  { slug: "petit-electromenager", name: "Petit électroménager", pillar: "electromenager", icon: "blender", image: "cat-petit-electromenager",
    intro: "Robots, aspirateurs, micro-ondes et indispensables du quotidien.",
    subcategories: [{ slug: "cuisine", name: "Préparation culinaire" }, { slug: "entretien", name: "Entretien" }],
    attributes: [{ key: "couleur", label: "Couleur" }] },
  { slug: "salons", name: "Salons", pillar: "ameublement", icon: "sofa", image: "cat-salons",
    intro: "Canapés, salons marocains et fauteuils pour recevoir.",
    subcategories: [{ slug: "canapes", name: "Canapés" }, { slug: "salons-marocains", name: "Salons marocains" }, { slug: "fauteuils", name: "Fauteuils" }],
    attributes: [{ key: "places", label: "Places" }, { key: "matiere", label: "Matière" }, { key: "couleur", label: "Couleur" }] },
  { slug: "chambres", name: "Chambres", pillar: "ameublement", icon: "bed", image: "cat-chambres",
    intro: "Lits, chambres complètes et matelas pour bien dormir.",
    subcategories: [{ slug: "chambres-completes", name: "Chambres complètes" }, { slug: "lits", name: "Lits" }, { slug: "matelas", name: "Matelas" }],
    attributes: [{ key: "taille", label: "Dimensions" }, { key: "matiere", label: "Matière" }] },
  { slug: "salles-a-manger", name: "Salles à manger", pillar: "ameublement", icon: "dining", image: "cat-salles-a-manger",
    intro: "Tables, chaises et ensembles pour les repas en famille.",
    subcategories: [{ slug: "tables", name: "Tables" }, { slug: "ensembles", name: "Ensembles" }],
    attributes: [{ key: "places", label: "Places" }, { key: "matiere", label: "Matière" }] },
  { slug: "rangement", name: "Rangement", pillar: "ameublement", icon: "wardrobe", image: "cat-rangement",
    intro: "Armoires, commodes et meubles TV.",
    subcategories: [{ slug: "armoires", name: "Armoires" }, { slug: "commodes", name: "Commodes" }, { slug: "meubles-tv", name: "Meubles TV" }],
    attributes: [{ key: "matiere", label: "Matière" }, { key: "couleur", label: "Couleur" }] },
];
