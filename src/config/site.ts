// Toutes les informations commerciales de Belle Image sont centralisées ici.
// Les valeurs marquées "À CONFIRMER" doivent être validées par le magasin.

export type DeliveryZone = {
  id: string;
  label: string;
  fee: number; // en DH — À CONFIRMER
  delay: string; // À CONFIRMER
  cities: string; // villes couvertes — À CONFIRMER
  note?: string;
};

export type WarrantyRow = { scope: string; duration: string; coverage: string };

export const site = {
  name: "Belle Image",
  nameAr: "أحسن صورة",
  tagline: "Ameublement & Électroménager à Kénitra depuis 2003",
  foundedYear: 2003,
  brandsCount: 15, // « environ 15 grandes marques »
  referencesCount: 10000, // « Plus de 10 000 références » — À CONFIRMER
  referencesLabel: "Plus de 10 000 références",
  referencesConfirmed: false,
  url: "https://belleimage.ma", // NOM DE DOMAINE À CONFIRMER
  address: {
    street: "Rue 9, Magasin 141, Khabazate",
    city: "Kénitra",
    country: "Maroc",
    countryCode: "MA",
    full: "Rue 9, Magasin 141, Khabazate, Kénitra",
  },
  mapEmbed: "https://www.google.com/maps?q=Khabazate%2C%20K%C3%A9nitra%2C%20Maroc&output=embed",
  mapLink: "https://www.google.com/maps/search/?api=1&query=Belle+Image+Khabazate+K%C3%A9nitra",
  phone: "05 37 36 40 33",
  phoneIntl: "+212537364033",
  whatsapp: "212600000000", // NUMÉRO WHATSAPP À CONFIRMER (format international sans +)
  whatsappDisplay: "06 00 00 00 00",
  email: "contact@belleimage.ma", // ADRESSE E-MAIL À CONFIRMER
  hours: {
    label: "7j/7 · 09:00 – 22:00",
    days: "Lundi – Dimanche",
    open: "09:00",
    close: "22:00",
  },
  social: {
    facebook: "https://www.facebook.com/Belleimagekenitra",
    instagram: "https://www.instagram.com/", // COMPTE INSTAGRAM À CONFIRMER
  },
  deliveryZones: [
    { id: "kenitra", label: "Kénitra", fee: 0, delay: "24 – 48 h", cities: "Kénitra et environs immédiats" },
    { id: "rabat-sale", label: "Rabat – Salé", fee: 150, delay: "2 – 3 jours", cities: "Rabat, Salé, Témara" },
    { id: "autres", label: "Autres villes", fee: 300, delay: "3 – 7 jours", cities: "Reste du Maroc, selon volume" },
  ] as DeliveryZone[],
  freeDeliveryThreshold: 5000, // SEUIL DE LIVRAISON OFFERTE À CONFIRMER
  // ESPACE CLIENT DÉMO — identifiants publics de démonstration, aucun compte réel.
  demoAccount: { phone: "06 00 00 00 00", password: "demo2026", name: "Client Démo" },
  deliveryOptions: [
    { title: "Livraison à l'étage", text: "Montée à l'étage des gros articles, à préciser lors de la confirmation de commande." },
    { title: "Installation électroménager", text: "Raccordement et mise en service (lave-linge, climatiseur, cuisinière…) sur demande." },
    { title: "Montage des meubles", text: "Montage des salons, chambres et armoires à domicile sur demande." },
  ],
  warranty: {
    electro: "Garantie constructeur selon la marque",
    furniture: "Garantie Belle Image sur l'ameublement",
    default: "Garantie constructeur",
    table: [
      { scope: "Gros électroménager (froid, lavage, cuisson)", duration: "Selon la marque", coverage: "Garantie constructeur, pièces et main-d'œuvre" },
      { scope: "TV & image", duration: "Selon la marque", coverage: "Garantie constructeur" },
      { scope: "Climatisation", duration: "Selon la marque", coverage: "Garantie constructeur, selon les conditions d'installation" },
      { scope: "Petit électroménager", duration: "Selon la marque", coverage: "Garantie constructeur" },
      { scope: "Ameublement (salons, chambres, rangement)", duration: "Selon le produit", coverage: "Garantie Belle Image (structure et finitions)" },
    ] as WarrantyRow[],
  },
} as const;

export type Site = typeof site;
