// Toutes les informations commerciales de Belle Image sont centralisées ici.
// Les valeurs marquées "À CONFIRMER" doivent être validées par le magasin.

export type DeliveryZone = {
  id: string;
  label: string;
  fee: number; // en DH — À CONFIRMER
  delay: string; // À CONFIRMER
  note?: string;
};

export const site = {
  name: "Belle Image",
  nameAr: "أحسن صورة",
  tagline: "Ameublement & Électroménager à Kénitra depuis 2003",
  foundedYear: 2003,
  brandsCount: 15,
  referencesCount: 10000, // "Plus de 10 000 références" — À CONFIRMER
  referencesConfirmed: false,
  url: "https://belleimage.ma", // À CONFIRMER
  address: {
    street: "Rue 9, Magasin 141, Khabazate",
    city: "Kénitra",
    country: "Maroc",
    countryCode: "MA",
    full: "Rue 9, Magasin 141, Khabazate, Kénitra",
  },
  mapEmbed:
    "https://www.google.com/maps?q=Khabazate%2C%20K%C3%A9nitra%2C%20Maroc&output=embed",
  mapLink: "https://www.google.com/maps/search/?api=1&query=Belle+Image+Khabazate+K%C3%A9nitra",
  phone: "05 37 36 40 33",
  phoneIntl: "+212537364033",
  whatsapp: "212600000000", // NUMÉRO WHATSAPP À CONFIRMER (format international sans +)
  whatsappDisplay: "06 00 00 00 00 (à confirmer)",
  email: "contact@belleimage.ma", // À CONFIRMER
  hours: { label: "7j/7 · 09:00 – 22:00", days: "Lundi – Dimanche", open: "09:00", close: "22:00" },
  social: {
    facebook: "https://www.facebook.com/Belleimagekenitra",
    instagram: "https://www.instagram.com/", // À CONFIRMER
  },
  deliveryZones: [
    { id: "kenitra", label: "Kénitra", fee: 0, delay: "24 – 48 h", note: "Tarif à confirmer" },
    { id: "rabat-sale", label: "Rabat – Salé", fee: 150, delay: "2 – 3 jours", note: "Tarif à confirmer" },
    { id: "autres", label: "Autres villes", fee: 300, delay: "3 – 7 jours", note: "Tarif à confirmer" },
  ] satisfies DeliveryZone[],
  freeDeliveryThreshold: 5000, // À CONFIRMER
  warranty: {
    electro: "Garantie constructeur selon la marque (durée à confirmer par produit)",
    furniture: "Garantie Belle Image sur l'ameublement (durée à confirmer)",
    default: "Garantie constructeur — durée à confirmer",
  },
} as const;

export type Site = typeof site;
