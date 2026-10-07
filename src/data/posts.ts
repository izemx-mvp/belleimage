// Articles conseils de Belle Image (conseils généraux, sans engagement chiffré sur les produits).
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
      { text: "Un réfrigérateur fonctionne jour et nuit pendant de longues années : il mérite qu'on prenne quelques minutes pour bien le choisir. Voici les points à vérifier avant l'achat." },
      { heading: "La bonne capacité", text: "Un repère courant est d'environ 100 litres par personne, à ajuster selon vos habitudes : si vous faites de grosses courses une fois par semaine ou recevez souvent, prévoyez plus large." },
      { heading: "No Frost ou froid statique", text: "Le No Frost évite la formation de givre et le dégivrage manuel. Le froid statique reste une option simple et économique. Pensez aussi à mesurer l'emplacement (hauteur, largeur, profondeur) et à vérifier le sens d'ouverture de la porte." },
      { heading: "La classe énergétique", text: "Plus la classe est performante, plus la consommation annuelle est faible. L'étiquette énergie indique la consommation en kWh par an : un bon moyen de comparer deux modèles." },
      { heading: "Comparer en showroom", text: "Nos conseillers vous accompagnent dans notre showroom de Kénitra pour comparer les modèles, les finitions et les rangements intérieurs." },
    ] },
  { slug: "economiser-energie-electromenager", title: "Électroménager : nos réflexes pour économiser l'énergie", category: "Électroménager", date: "2026-09-12", readMinutes: 4, relatedCategory: "lave-linge", image: "blog-economiser-energie",
    excerpt: "Classe énergétique, programmes éco, entretien : réduire la facture sans changer ses habitudes.",
    body: [
      { text: "Quelques gestes simples permettent de réduire la consommation de vos appareils au quotidien, sans rien sacrifier au confort." },
      { heading: "Lire l'étiquette énergie", text: "La classe énergétique et la consommation annuelle affichées sur l'étiquette permettent de comparer les appareils avant l'achat. Un modèle plus sobre se rentabilise sur la durée." },
      { heading: "Utiliser les programmes éco", text: "Lavez à basse température quand c'est possible, lancez le lave-vaisselle bien rempli et réglez le réfrigérateur autour de 4 °C : ce sont des réglages simples et efficaces." },
      { heading: "Entretenir régulièrement", text: "Un filtre propre, des joints en bon état et un appareil dégivré consomment moins. L'entretien prolonge aussi la durée de vie de vos équipements." },
    ] },
  { slug: "bien-choisir-son-climatiseur", title: "Split ou Inverter : quel climatiseur choisir ?", category: "Électroménager", date: "2026-09-05", readMinutes: 4, relatedCategory: "climatisation", image: "blog-economiser-energie",
    excerpt: "Puissance en BTU selon la surface, économies d'énergie et installation.",
    body: [
      { text: "Bien dimensionner son climatiseur est essentiel : trop faible, il peine à refroidir ; trop puissant, il consomme inutilement." },
      { heading: "Quelle puissance ?", text: "À titre indicatif : 9 000 BTU pour environ 15 m², 12 000 BTU pour environ 25 m² et 18 000 BTU pour environ 35 m². L'exposition, l'isolation et la hauteur sous plafond comptent aussi : un conseiller vous aide à affiner." },
      { heading: "Pourquoi l'Inverter", text: "Un climatiseur Inverter ajuste sa puissance en continu au lieu de s'arrêter et redémarrer. Résultat : une température plus stable, moins de bruit et, en général, une consommation plus faible sur la durée." },
      { heading: "Penser à l'installation", text: "L'emplacement des unités intérieure et extérieure et la qualité de la pose conditionnent les performances. Parlez-en avec notre équipe au moment de la commande." },
    ] },
  { slug: "amenager-son-salon", title: "Aménager son salon : nos idées", category: "Ameublement", date: "2026-08-22", readMinutes: 6, relatedCategory: "salons", image: "blog-amenager-salon",
    excerpt: "Canapé d'angle, salon marocain ou fauteuils : composer un salon accueillant.",
    body: [
      { text: "Le salon est la pièce où l'on vit et où l'on reçoit. Quelques principes simples aident à créer un espace confortable et harmonieux." },
      { heading: "Mesurer avant tout", text: "Relevez les dimensions de la pièce, repérez les fenêtres et les passages, et gardez une circulation d'au moins 80 cm autour des meubles principaux." },
      { heading: "Choisir le bon canapé", text: "Le canapé d'angle optimise l'espace et accueille toute la famille ; le salon marocain est idéal pour recevoir en nombre ; quelques fauteuils apportent de la souplesse." },
      { heading: "Harmoniser les couleurs", text: "Accordez les tissus avec les rideaux, le tapis et les murs. Une base neutre permet de changer facilement l'ambiance avec des coussins et des accessoires." },
      { heading: "Venir voir les compositions", text: "Rien ne remplace l'essai : venez vous asseoir et comparer les compositions dans notre showroom de Kénitra." },
    ] },
  { slug: "entretenir-son-lave-linge", title: "Entretenir son lave-linge pour qu'il dure", category: "Entretien", date: "2026-08-10", readMinutes: 3, relatedCategory: "lave-linge", image: "blog-economiser-energie",
    excerpt: "Filtre, joint, détartrage : les gestes simples à adopter.",
    body: [
      { text: "Un lave-linge bien entretenu lave mieux, consomme moins et dure plus longtemps. Voici les gestes à adopter." },
      { heading: "Les bons gestes", text: "Nettoyez le filtre de vidange régulièrement, essuyez le joint du hublot après les lavages et laissez la porte entrouverte pour éviter les odeurs." },
      { heading: "Un cycle d'entretien", text: "Lancez de temps en temps un cycle à vide à haute température pour éliminer les résidus de lessive et le calcaire. Respectez aussi les doses de lessive recommandées." },
    ] },
  { slug: "choisir-son-matelas", title: "Bien choisir son matelas", category: "Ameublement", date: "2026-07-28", readMinutes: 4, relatedCategory: "chambres", image: "blog-amenager-salon",
    excerpt: "Fermeté, épaisseur, dimensions : dormir mieux commence ici.",
    body: [
      { text: "Un bon matelas fait toute la différence sur la qualité du sommeil. Voici comment s'y retrouver." },
      { heading: "La fermeté", text: "Elle dépend de votre morphologie et de votre position de sommeil : un soutien ferme convient souvent à ceux qui dorment sur le dos ou le ventre, un accueil plus souple à ceux qui dorment sur le côté." },
      { heading: "Les dimensions", text: "Vérifiez la taille de votre sommier ou de votre lit avant l'achat, et pensez à l'espace de chacun si vous dormez à deux." },
      { heading: "Tester en showroom", text: "Le meilleur moyen de choisir reste de s'allonger quelques minutes : venez tester nos matelas dans notre showroom de Kénitra." },
    ] },
];
