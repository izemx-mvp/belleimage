// Réponses du conseiller (sans IA) : correspondance par mots-clés, insensible aux accents.
import { site } from "@/config/site";
import { formatPrice } from "@/lib/commerce";

export type QA = { id: string; keywords: string[]; question: string; answer: string };

export const assistantQA: QA[] = [
  { id: "paiement", keywords: ["paiement", "payer", "cash", "espece", "carte", "credit", "facilite"],
    question: "Comment se passe le paiement ?",
    answer: "Vous payez à la livraison, à la réception de votre commande. Aucun paiement en ligne n'est demandé. Pour les facilités de paiement, renseignez-vous auprès de notre équipe." },
  { id: "livraison", keywords: ["livraison", "livrer", "livrez", "delai", "frais", "domicile", "rabat", "sale"],
    question: "Livrez-vous chez moi ?",
    answer: `Oui, nous livrons à domicile : ${site.deliveryZones.map((z) => `${z.label} (${z.delay})`).join(", ")}. Livraison offerte dès ${formatPrice(site.freeDeliveryThreshold)}. Les frais exacts sont confirmés par notre équipe.` },
  { id: "garantie", keywords: ["garantie", "garanti", "sav", "panne", "reparation", "apres vente"],
    question: "Les produits sont-ils garantis ?",
    answer: "Oui. L'électroménager bénéficie de la garantie constructeur (durée selon la marque) et l'ameublement d'une garantie Belle Image. Notre SAV vous accompagne par téléphone ou WhatsApp." },
  { id: "horaires", keywords: ["horaire", "heure", "ouvert", "ouverture", "showroom", "adresse", "magasin", "ou etes", "localisation"],
    question: "Quels sont vos horaires ?",
    answer: `Notre showroom est ouvert ${site.hours.label}, au ${site.address.full}. Venez voir, toucher et comparer !` },
  { id: "retour", keywords: ["retour", "echange", "rembourse", "annuler", "annulation"],
    question: "Puis-je échanger un produit ?",
    answer: "Contactez-nous sur WhatsApp ou par téléphone : nous étudions chaque demande d'échange ou de retour." },
  { id: "installation", keywords: ["installation", "installer", "montage", "monter", "etage"],
    question: "Proposez-vous l'installation ?",
    answer: "Des options de livraison à l'étage, d'installation et de montage existent. Demandez-les lors de la confirmation de commande." },
  { id: "commande", keywords: ["commander", "commande", "whatsapp", "confirmer"],
    question: "Comment commander ?",
    answer: "Ajoutez vos produits au panier puis cliquez sur « Commander ». Remplissez vos coordonnées : le récapitulatif part sur WhatsApp et notre équipe vous rappelle pour confirmer. Vous payez à la livraison." },
];

export const budgetRanges = [
  { id: "b1", label: "Moins de 2 000 DH", min: 0, max: 2000 },
  { id: "b2", label: "2 000 – 5 000 DH", min: 2000, max: 5000 },
  { id: "b3", label: "5 000 – 10 000 DH", min: 5000, max: 10000 },
  { id: "b4", label: "Plus de 10 000 DH", min: 10000, max: Number.MAX_SAFE_INTEGER },
];
