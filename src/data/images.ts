// Manifeste de toutes les images attendues dans src/assets/images/ (dossier plat).
// Formats acceptés : webp, jpg, jpeg, png, avif. Le nom de fichier (sans extension) doit
// correspondre exactement à `name`. Une image absente affiche un placeholder « IMAGE À REMPLACER ».

export type ImageSpec = {
  name: string;
  width: number;
  height: number;
  usage: string;
  alt: string;
  /** Photos réelles fournies par le client : restent en placeholder tant qu'elles manquent. */
  clientPhoto?: boolean;
};

const cat = (name: string, label: string): ImageSpec => ({
  name, width: 800, height: 800, usage: "Tuile catégorie (accueil) et visuel du rayon", alt: label,
});
const prod = (name: string, label: string): ImageSpec => ({
  name, width: 1000, height: 1000, usage: "Packshot produit sur fond blanc (object-fit contain)", alt: label,
});

export const imageManifest: ImageSpec[] = [
  // Le logo officiel est lu dans src/assets/belle-image-logo.png (voir src/lib/images.ts).
  { name: "logo", width: 447, height: 447, usage: "Logo Belle Image (header, menus, footer, assistant, espace client, favicon)", alt: "Belle Image — أحسن صورة" },
  { name: "hero-main", width: 1600, height: 1200, usage: "Hero de l'accueil (desktop)", alt: "Showroom Belle Image : électroménager et ameublement" },
  { name: "hero-mobile", width: 900, height: 1200, usage: "Hero de l'accueil (mobile)", alt: "Électroménager et ameublement Belle Image" },
  { name: "promo-menu-electromenager", width: 600, height: 800, usage: "Tuile promo du méga-menu Électroménager", alt: "Promotions électroménager" },
  { name: "promo-menu-ameublement", width: 600, height: 800, usage: "Tuile promo du méga-menu Ameublement", alt: "Promotions ameublement" },
  { name: "promo-banner-electromenager", width: 1600, height: 600, usage: "Bannière promotions de l'accueil", alt: "Promotions du moment sur l'électroménager" },
  { name: "promo-banner-ameublement", width: 1600, height: 600, usage: "Bannière ameublement de l'accueil", alt: "Salons, chambres et salles à manger Belle Image" },
  cat("cat-refrigerateurs", "Réfrigérateurs"),
  cat("cat-lave-linge", "Lave-linge"),
  cat("cat-cuisinieres-fours", "Cuisinières et fours"),
  cat("cat-tv-image", "Téléviseurs"),
  cat("cat-climatisation", "Climatiseurs"),
  cat("cat-petit-electromenager", "Petit électroménager"),
  cat("cat-salons", "Salons"),
  cat("cat-chambres", "Chambres à coucher"),
  cat("cat-salles-a-manger", "Salles à manger"),
  cat("cat-rangement", "Meubles de rangement"),
  prod("prod-refrigerateur-combine", "Réfrigérateur combiné"),
  prod("prod-refrigerateur-americain", "Réfrigérateur américain"),
  prod("prod-lave-linge-frontal", "Lave-linge frontal"),
  prod("prod-lave-vaisselle", "Lave-vaisselle"),
  prod("prod-cuisiniere-4-feux", "Cuisinière 4 feux"),
  prod("prod-four-encastrable", "Four encastrable"),
  prod("prod-micro-ondes", "Micro-ondes"),
  prod("prod-tv-55", "Téléviseur 55 pouces"),
  prod("prod-climatiseur-split", "Climatiseur split"),
  prod("prod-aspirateur", "Aspirateur"),
  prod("prod-robot-cuisine", "Robot de cuisine"),
  prod("prod-chauffe-eau", "Chauffe-eau"),
  prod("prod-salon-angle", "Salon d'angle"),
  prod("prod-salon-marocain", "Salon marocain"),
  prod("prod-canape-3-places", "Canapé 3 places"),
  prod("prod-lit-double", "Lit double"),
  prod("prod-armoire", "Armoire"),
  prod("prod-table-salle-a-manger", "Table de salle à manger"),
  prod("prod-meuble-tv", "Meuble TV"),
  prod("prod-commode", "Commode"),
  { name: "blog-choisir-refrigerateur", width: 1200, height: 675, usage: "Couverture d'article", alt: "Choisir son réfrigérateur" },
  { name: "blog-amenager-salon", width: 1200, height: 675, usage: "Couverture d'article", alt: "Aménager son salon" },
  { name: "blog-economiser-energie", width: 1200, height: 675, usage: "Couverture d'article", alt: "Économiser l'énergie à la maison" },
  { name: "showroom-1", width: 1200, height: 900, usage: "Bloc showroom et page À propos", alt: "Le showroom Belle Image à Kénitra", clientPhoto: true },
  { name: "showroom-2", width: 1200, height: 900, usage: "Bloc showroom et page À propos", alt: "Espace électroménager du showroom", clientPhoto: true },
  { name: "showroom-3", width: 1200, height: 900, usage: "Bloc showroom et page À propos", alt: "Espace ameublement du showroom", clientPhoto: true },
  { name: "og-belle-image", width: 1200, height: 630, usage: "Image Open Graph (partage réseaux sociaux)", alt: "Belle Image — Kénitra" },
];

export const imageSpec = (name: string) => imageManifest.find((i) => i.name === name);
