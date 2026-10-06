// CONTENU EXEMPLE À REMPLACER — articles conseils (pistes de rédaction, à compléter par l'équipe).
export type PostCategory = "Électroménager" | "Ameublement" | "Entretien";
export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  category: PostCategory;
  date: string;
  readMinutes: number;
  /** Nom d'image de couverture (blog-*). */
  image: string;
  body: { heading?: string; text: string }[];
  relatedCategory: string;
};

export const postCategories: PostCategory[] = ["Électroménager", "Ameublement", "Entretien"];

export const posts: Post[] = [
  { slug: "choisir-son-refrigerateur", title: "Comment choisir son réfrigérateur ?", category: "Électroménager", date: "2026-09-20", readMinutes: 5, relatedCategory: "refrigerateurs", image: "blog-choisir-refrigerateur",
    excerpt: "Capacité, No Frost, classe énergétique : les critères essentiels avant d'acheter.",
    body: [
      { text: "Article à compléter par l'équipe Belle Image (À COMPLÉTER)." },
      { heading: "La bonne capacité", text: "Piste : estimer la capacité selon la taille du foyer (repère courant : environ 100 L par personne, à adapter)." },
      { heading: "No Frost ou froid statique", text: "Piste : le No Frost évite le dégivrage manuel ; vérifier aussi les dimensions de l'emplacement et le sens d'ouverture." },
      { heading: "Comparer en showroom", text: "Nos conseillers vous accompagnent en showroom à Kénitra pour comparer les modèles." },
    ] },
  { slug: "economiser-energie-electromenager", title: "Électroménager : 7 réflexes pour économiser l'énergie", category: "Électroménager", date: "2026-09-12", readMinutes: 4, relatedCategory: "lave-linge", image: "blog-economiser-energie",
    excerpt: "Classe énergétique, programmes éco, entretien : réduire la facture sans changer ses habitudes.",
    body: [
      { text: "Article à compléter par l'équipe Belle Image (À COMPLÉTER)." },
      { heading: "Lire l'étiquette énergie", text: "Piste : expliquer la classe énergétique et la consommation annuelle indiquée sur l'étiquette." },
      { heading: "Programmes éco", text: "Piste : lavage à basse température, lave-vaisselle bien rempli, réfrigérateur réglé autour de 4 °C (à valider)." },
    ] },
  { slug: "bien-choisir-son-climatiseur", title: "Split ou Inverter : quel climatiseur choisir ?", category: "Électroménager", date: "2026-09-05", readMinutes: 4, relatedCategory: "climatisation", image: "blog-economiser-energie",
    excerpt: "Puissance en BTU selon la surface, économies d'énergie et installation.",
    body: [
      { text: "Article à compléter par l'équipe Belle Image (À COMPLÉTER)." },
      { heading: "Quelle puissance ?", text: "Piste : 9 000 BTU pour ~15 m², 12 000 BTU pour ~25 m², 18 000 BTU pour ~35 m² (à affiner avec un conseiller)." },
      { heading: "Pourquoi l'Inverter", text: "Piste : l'Inverter ajuste sa puissance et consomme généralement moins sur la durée." },
    ] },
  { slug: "amenager-son-salon", title: "Aménager son salon : nos idées", category: "Ameublement", date: "2026-08-22", readMinutes: 6, relatedCategory: "salons", image: "blog-amenager-salon",
    excerpt: "Canapé d'angle, salon marocain ou fauteuils : composer un salon accueillant.",
    body: [
      { text: "Article à compléter par l'équipe Belle Image (À COMPLÉTER)." },
      { heading: "Mesurer avant tout", text: "Piste : mesurer la pièce, prévoir la circulation, harmoniser les couleurs avec les rideaux et le tapis." },
      { heading: "Venir voir les compositions", text: "Venez voir nos compositions en showroom à Kénitra." },
    ] },
  { slug: "entretenir-son-lave-linge", title: "Entretenir son lave-linge pour qu'il dure", category: "Entretien", date: "2026-08-10", readMinutes: 3, relatedCategory: "lave-linge", image: "blog-economiser-energie",
    excerpt: "Filtre, joint, détartrage : les gestes simples à adopter.",
    body: [
      { text: "Article à compléter par l'équipe Belle Image (À COMPLÉTER)." },
      { heading: "Les bons gestes", text: "Piste : nettoyer le filtre chaque mois, laisser le hublot entrouvert, lancer un cycle à vide à haute température." },
    ] },
  { slug: "choisir-son-matelas", title: "Bien choisir son matelas", category: "Ameublement", date: "2026-07-28", readMinutes: 4, relatedCategory: "chambres", image: "blog-amenager-salon",
    excerpt: "Fermeté, épaisseur, dimensions : dormir mieux commence ici.",
    body: [
      { text: "Article à compléter par l'équipe Belle Image (À COMPLÉTER)." },
      { heading: "Tester en showroom", text: "Piste : tester en showroom, choisir la fermeté selon la morphologie, vérifier la taille du sommier." },
    ] },
];
