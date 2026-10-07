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
  brandsCount: 8,
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
  mapEmbed:
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d26379.395771197807!2d-6.597917546949112!3d34.26322657697465!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda759ef7264fe89%3A0x70bea08fabba215d!2sBelle%20Image%20Sarl!5e0!3m2!1sfr!2sma!4v1791306437140!5m2!1sfr!2sma",
  mapLink: "https://maps.app.goo.gl/kA5k2LNooYsxT8Q39",
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
