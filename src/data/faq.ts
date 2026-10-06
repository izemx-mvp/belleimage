// FAQ — contenu à valider par le magasin. Les éléments marqués À CONFIRMER doivent être vérifiés.
import { site } from "@/config/site";
import { formatPrice } from "@/lib/commerce";

export type FaqItem = { q: string; a: string };
export type FaqGroup = { id: string; title: string; items: FaqItem[] };

const zones = site.deliveryZones.map((z) => `${z.label} (${z.delay})`).join(", ");

export const faqGroups: FaqGroup[] = [
  { id: "commande", title: "Commande", items: [
    { q: "Comment passer commande ?", a: "Ajoutez vos produits au panier, remplissez le formulaire de commande puis envoyez le récapitulatif sur WhatsApp. Notre équipe vous rappelle pour confirmer la disponibilité, la date et l'adresse de livraison." },
    { q: "Ma commande est-elle confirmée dès l'envoi du message ?", a: "Non : elle est confirmée après l'appel ou le message de notre équipe. Rien n'est débité, vous payez uniquement à la livraison." },
    { q: "Puis-je commander par téléphone ?", a: `Oui, appelez-nous au ${site.phone}, ${site.hours.label}.` },
  ] },
  { id: "livraison", title: "Livraison", items: [
    { q: "Livrez-vous à domicile ?", a: `Oui. Zones et délais indicatifs : ${zones}. Les frais exacts vous sont confirmés par notre équipe avant l'envoi.` },
    { q: "La livraison est-elle offerte ?", a: `La livraison est offerte dès ${formatPrice(site.freeDeliveryThreshold)} d'achat.` },
    { q: "Livrez-vous à l'étage et installez-vous les appareils ?", a: "Des options de livraison à l'étage, d'installation et de montage sont proposées. Conditions et tarifs précisés lors de la confirmation de commande." },
  ] },
  { id: "paiement", title: "Paiement", items: [
    { q: "Comment payer ?", a: "Vous payez à la livraison, à la réception de votre commande. Aucun paiement en ligne n'est demandé sur ce site." },
    { q: "Quels moyens de paiement acceptez-vous à la livraison ?", a: "Espèces à la livraison. Pour tout autre moyen de paiement, renseignez-vous auprès de notre équipe." },
  ] },
  { id: "garantie", title: "Garantie & SAV", items: [
    { q: "Les produits sont-ils garantis ?", a: "Oui. L'électroménager bénéficie de la garantie constructeur (durée selon la marque). L'ameublement bénéficie d'une garantie Belle Image." },
    { q: "Que faire en cas de panne ?", a: "Contactez-nous par WhatsApp ou par téléphone avec votre référence de commande et une photo du problème : nous organisons la prise en charge avec le SAV de la marque." },
  ] },
  { id: "retours", title: "Retours & échanges", items: [
    { q: "Puis-je échanger ou retourner un produit ?", a: "La politique de retour et d'échange est en cours de rédaction (À COMPLÉTER). Contactez-nous : nous étudions chaque demande." },
    { q: "Que faire si le produit arrive endommagé ?", a: "Vérifiez le colis devant le livreur et signalez immédiatement tout dommage. Procédure détaillée À COMPLÉTER." },
  ] },
];

/** Sélection courte pour l'accueil. */
export const homeFaq: FaqItem[] = [
  faqGroups[1]!.items[0]!,
  faqGroups[2]!.items[0]!,
  faqGroups[3]!.items[0]!,
  faqGroups[4]!.items[0]!,
  faqGroups[1]!.items[2]!,
];
