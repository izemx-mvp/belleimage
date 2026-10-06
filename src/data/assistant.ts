import { site } from "@/config/site";

export type QA = { id: string; keywords: string[]; question: string; answer: string };

export const assistantQA: QA[] = [
  { id: "paiement", keywords: ["paiement", "payer", "cash", "livraison paiement", "carte", "espece"],
    question: "Comment se passe le paiement ?",
    answer: "Vous payez à la livraison, en espèces, à la réception de votre commande. Aucun paiement en ligne n'est demandé." },
  { id: "livraison", keywords: ["livraison", "livrer", "delai", "frais", "ville", "domicile"],
    question: "Livrez-vous chez moi ?",
    answer: `Oui, nous livrons à domicile : ${site.deliveryZones.map((z) => `${z.label} (${z.delay})`).join(", ")}. Les tarifs exacts sont à confirmer avec notre équipe.` },
  { id: "garantie", keywords: ["garantie", "sav", "panne", "reparation", "apres vente"],
    question: "Les produits sont-ils garantis ?",
    answer: "Oui. L'électroménager bénéficie de la garantie constructeur (durée selon la marque, à confirmer). Notre SAV vous accompagne par téléphone ou WhatsApp." },
  { id: "horaires", keywords: ["horaire", "heure", "ouvert", "showroom", "adresse", "magasin", "ou etes"],
    question: "Quels sont vos horaires ?",
    answer: `Notre showroom est ouvert ${site.hours.label}, au ${site.address.full}.` },
  { id: "retour", keywords: ["retour", "echange", "rembourse"],
    question: "Puis-je échanger un produit ?",
    answer: "La politique d'échange et de retour est en cours de rédaction (À CONFIRMER). Contactez-nous sur WhatsApp, nous trouverons une solution." },
  { id: "installation", keywords: ["installation", "installer", "montage", "monter", "etage"],
    question: "Proposez-vous l'installation ?",
    answer: "Des options de livraison à l'étage, d'installation et de montage existent (conditions à confirmer). Demandez-nous lors de la confirmation de commande." },
];

export const budgetRanges = [
  { id: "b1", label: "Moins de 2 000 DH", min: 0, max: 2000 },
  { id: "b2", label: "2 000 – 5 000 DH", min: 2000, max: 5000 },
  { id: "b3", label: "5 000 – 10 000 DH", min: 5000, max: 10000 },
  { id: "b4", label: "Plus de 10 000 DH", min: 10000, max: Infinity },
];
