// Contenus juridiques — à faire relire par un professionnel. Ajouter RC, IF, ICE, hébergeur
// et déclaration CNDP dans les mentions légales avant la mise en ligne définitive.
import { site } from "@/config/site";

export type LegalSection = { title: string; paragraphs: string[] };

export const cgv: LegalSection[] = [
  { title: "1. Objet", paragraphs: [`Les présentes conditions générales de vente régissent les commandes passées sur le site ${site.name} et confirmées par téléphone ou WhatsApp.`] },
  { title: "2. Produits et prix", paragraphs: ["Les prix sont indiqués en dirhams marocains (DH), toutes taxes comprises. Les photos des produits sont non contractuelles.", "Les prix et la disponibilité sont confirmés par notre équipe au moment de la validation de la commande."] },
  { title: "3. Commande", paragraphs: ["La commande est transmise via WhatsApp sous forme de récapitulatif. Elle devient ferme après confirmation par Belle Image (appel ou message)."] },
  { title: "4. Paiement", paragraphs: ["Le paiement s'effectue à la livraison. Aucun paiement en ligne n'est demandé. Paiement en espèces à la réception."] },
  { title: "5. Livraison", paragraphs: ["Zones, délais et frais de livraison : voir la page Livraison & paiement. Le client vérifie l'état du produit à la réception."] },
  { title: "6. Garantie et service après-vente", paragraphs: ["Les produits bénéficient de la garantie légale et, le cas échéant, de la garantie constructeur. Durées et conditions selon la marque et le produit."] },
  { title: "7. Retours et échanges", paragraphs: ["Les demandes de retour et d'échange sont étudiées au cas par cas, conformément à la loi n° 31-08 édictant des mesures de protection du consommateur. Le produit doit être retourné en bon état, dans son emballage d'origine."] },
  { title: "8. Données personnelles", paragraphs: ["Les informations transmises (nom, téléphone, adresse) servent uniquement au traitement de la commande, conformément à la loi n° 09-08 relative à la protection des données à caractère personnel."] },
  { title: "9. Litiges", paragraphs: ["Les présentes conditions sont soumises au droit marocain. En cas de différend, une solution amiable est recherchée en priorité."] },
];

export const mentions: LegalSection[] = [
  { title: "Éditeur du site", paragraphs: [`${site.name} (${site.nameAr})`, `Adresse : ${site.address.full}, ${site.address.country}`, `Téléphone : ${site.phone}`, `E-mail : ${site.email}`] },
  { title: "Propriété intellectuelle", paragraphs: ["Le logo, les textes et les visuels de Belle Image sont protégés. Les marques citées appartiennent à leurs propriétaires respectifs."] },
  { title: "Données personnelles", paragraphs: ["Ce site ne stocke pas vos données sur un serveur : le panier, les favoris, l'espace client et le récapitulatif de commande restent dans votre navigateur. Les données envoyées via WhatsApp sont traitées par Belle Image pour la commande uniquement."] },
  { title: "Cookies et mesure d'audience", paragraphs: ["Le site peut utiliser des outils de mesure d'audience anonymes pour améliorer ses services."] },
];
