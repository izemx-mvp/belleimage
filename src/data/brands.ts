// Liste des marques — À CONFIRMER par le magasin (~15 grandes marques).
export type Brand = { slug: string; name: string; pillar: "electromenager" | "ameublement" | "mixte"; confirmed: boolean };

export const brands: Brand[] = Array.from({ length: 15 }, (_, i) => ({
  slug: `marque-${String(i + 1).padStart(2, "0")}`,
  name: `Marque ${String(i + 1).padStart(2, "0")}`,
  pillar: i < 10 ? "electromenager" : i < 14 ? "ameublement" : "mixte",
  confirmed: false,
}));
