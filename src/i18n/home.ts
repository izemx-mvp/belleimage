import { site } from "@/config/site";

/**
 * Textes des nouvelles sections "vitrine" de l'accueil.
 * Séparés de fr.ts pour rester lisibles ; même logique : prêt pour une version arabe.
 */
export const homeCopy = {
  heroCtaSecondary: "Découvrir Belle Image",

  universesTitle: "Deux univers, un seul magasin",
  universesIntro:
    "Électroménager et ameublement réunis sous le même toit : équipez votre cuisine, votre buanderie, votre salon et vos chambres au même endroit.",
  universes: {
    electromenager: {
      title: "Électroménager",
      text: "Froid, lavage, cuisson, image et climatisation, des grandes marques pour tous les budgets.",
      cta: "Tout l'électroménager",
      image: "promo-menu-electromenager",
    },
    ameublement: {
      title: "Ameublement",
      text: "Salons, chambres, salles à manger et rangements pour une maison qui vous ressemble.",
      cta: "Tout l'ameublement",
      image: "promo-menu-ameublement",
    },
  },

  companyLabel: "Qui sommes-nous",
  companyTitle: `Une enseigne de Kénitra, depuis ${site.foundedYear}`,
  companyText:
    "Belle Image est un magasin d'électroménager et d'ameublement installé à Kénitra. Notre métier : vous aider à bien équiper votre maison, avec des produits de grandes marques, des conseils honnêtes et un service qui continue après l'achat.",
  companyCta: "Notre histoire",
  services: [
    { title: "Conseil personnalisé", text: "Des conseillers pour vous orienter selon votre besoin et votre budget." },
    { title: "Livraison et installation", text: "Livraison à domicile, installation selon le produit." },
    { title: "Garantie et SAV", text: "Garantie constructeur et suivi après l'achat par notre équipe." },
    { title: "Un large choix", text: `${site.brandsCount} grandes marques en électroménager et ameublement.` },
  ],

  waysTitle: "Deux façons d'acheter",
  waysIntro: "Commandez en ligne depuis votre canapé, ou venez voir les produits en vrai. Dans les deux cas, vous payez à la livraison.",
  online: {
    title: "En ligne",
    subtitle: "Commandez ici, payez à la livraison",
    cta: "Commencer mes achats",
  },
  store: {
    title: "Au showroom",
    subtitle: "Voyez, touchez, comparez",
    points: [
      "Une large sélection de produits exposés en magasin",
      "Un conseiller pour comparer les modèles avec vous",
      "Livraison à domicile de vos achats",
    ],
    cta: "Préparer ma visite",
  },
} as const;