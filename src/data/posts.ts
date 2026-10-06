// CONTENU EXEMPLE À REMPLACER — articles conseils.
export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  category: "Électroménager" | "Ameublement" | "Entretien";
  date: string;
  readMinutes: number;
  body: string[];
  relatedCategory: string;
};

export const posts: Post[] = [
  { slug: "choisir-son-refrigerateur", title: "Comment choisir son réfrigérateur ?", category: "Électroménager", date: "2026-09-20", readMinutes: 5, relatedCategory: "refrigerateurs",
    excerpt: "Capacité, No Frost, classe énergétique : les critères essentiels avant d'acheter.",
    body: ["Article à compléter par l'équipe Belle Image.", "Pistes : estimer la capacité selon la taille du foyer (environ 100 L par personne), privilégier le No Frost pour éviter le dégivrage, vérifier les dimensions de l'emplacement.", "Nos conseillers vous accompagnent en showroom pour comparer les modèles."] },
  { slug: "bien-choisir-son-climatiseur", title: "Split ou Inverter : quel climatiseur choisir ?", category: "Électroménager", date: "2026-09-05", readMinutes: 4, relatedCategory: "climatisation",
    excerpt: "Puissance en BTU selon la surface, économies d'énergie et installation.",
    body: ["Article à compléter par l'équipe Belle Image.", "Pistes : 9 000 BTU pour ~15 m², 12 000 BTU pour ~25 m², 18 000 BTU pour ~35 m² (à confirmer avec un conseiller).", "L'Inverter ajuste sa puissance et consomme moins sur la durée."] },
  { slug: "amenager-son-salon", title: "Aménager son salon : nos idées", category: "Ameublement", date: "2026-08-22", readMinutes: 6, relatedCategory: "salons",
    excerpt: "Canapé d'angle, salon marocain ou fauteuils : composer un salon accueillant.",
    body: ["Article à compléter par l'équipe Belle Image.", "Pistes : mesurer la pièce, prévoir la circulation, harmoniser les couleurs avec les rideaux et le tapis.", "Venez voir nos compositions en showroom à Kénitra."] },
  { slug: "entretenir-son-lave-linge", title: "Entretenir son lave-linge pour qu'il dure", category: "Entretien", date: "2026-08-10", readMinutes: 3, relatedCategory: "lave-linge",
    excerpt: "Filtre, joint, détartrage : les gestes simples à adopter.",
    body: ["Article à compléter par l'équipe Belle Image.", "Pistes : nettoyer le filtre chaque mois, laisser le hublot entrouvert, lancer un cycle à vide à haute température."] },
  { slug: "choisir-son-matelas", title: "Bien choisir son matelas", category: "Ameublement", date: "2026-07-28", readMinutes: 4, relatedCategory: "chambres",
    excerpt: "Fermeté, épaisseur, dimensions : dormir mieux commence ici.",
    body: ["Article à compléter par l'équipe Belle Image.", "Pistes : tester en showroom, choisir la fermeté selon la morphologie, vérifier la taille du sommier."] },
];
