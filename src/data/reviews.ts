// EXEMPLES D'AVIS — à remplacer par de vrais avis clients (Google, Facebook) avec leur accord.
// Ne jamais présenter ces textes comme des avis réels.
export type Review = { name: string; city: string; text: string; product: string };

export const sampleReviews: Review[] = [
  { name: "Client exemple 1", city: "Kénitra", product: "Électroménager", text: "Exemple d'avis : livraison rapide et installation soignée. Texte à remplacer par un avis client réel." },
  { name: "Client exemple 2", city: "Rabat", product: "Salon", text: "Exemple d'avis : conseils utiles en showroom, paiement à la livraison sans souci. Texte à remplacer." },
  { name: "Client exemple 3", city: "Kénitra", product: "Chambre", text: "Exemple d'avis : bon accueil et large choix. Texte à remplacer par un avis client réel." },
];
