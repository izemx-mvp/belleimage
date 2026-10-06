// CONTENU EXEMPLE — données de l'espace client démo (profil, adresses, commandes).
// Restaurées par « Réinitialiser la démo ». Aucune donnée réelle.
import { site } from "@/config/site";
import { sampleOrder, type AccountData, type Address } from "@/lib/account";

const addresses: Address[] = [
  { id: "adr-maison", label: "Maison", zone: "kenitra", district: "Bir Rami", address: "Rue exemple 12, Résidence exemple, appt 3 (CONTENU EXEMPLE)", isDefault: true },
  { id: "adr-parents", label: "Chez mes parents", zone: "rabat-sale", district: "Hay Riad", address: "Avenue exemple 45 (CONTENU EXEMPLE)", isDefault: false },
];
const [home, parents] = addresses as [Address, Address];

/** Copie fraîche des données exemple (jamais partagée entre deux réinitialisations). */
export function seedAccount(): AccountData {
  return structuredClone({
    profile: { name: site.demoAccount.name, phone: site.demoAccount.phone, email: "client.demo@exemple.ma", city: "Kénitra" },
    addresses,
    orders: [
      sampleOrder("BI-20260921-K7PQ", "2026-09-21T10:24:00.000Z", "Livrée", [
        { slug: "lave-linge-hublot-8-kg", qty: 1 },
        { slug: "aspirateur-traineau-sans-sac", qty: 1 },
      ], home),
      sampleOrder("BI-20260930-M3RT", "2026-09-30T16:05:00.000Z", "En livraison", [
        { slug: "canape-dangle-5-places", qty: 1 },
      ], parents),
      sampleOrder("BI-20261004-X9WA", "2026-10-04T09:40:00.000Z", "Confirmée", [
        { slug: "smart-tv-55-4k-uhd", qty: 1 },
        { slug: "meuble-tv-180-cm", qty: 1 },
      ], home),
    ],
  });
}
