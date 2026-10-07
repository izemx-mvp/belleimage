// Marques vendues par Belle Image (logos fournis par le magasin).
import bosch from "@/assets/logos/Bosch-logo.png";
import candy from "@/assets/logos/candy-logo.png";
import krohler from "@/assets/logos/krohler-logo.png";
import samsung from "@/assets/logos/Samsung-Logo.png";
import schleizer from "@/assets/logos/schleizer-logo.png";
import siera from "@/assets/logos/Siera-logo.png";
import taurus from "@/assets/logos/taurus-logo.png";
import tivoli from "@/assets/logos/Logo-Tivoli.png";

export type Brand = { slug: string; name: string; logo: string; pillar: "electromenager" | "ameublement" | "mixte"; confirmed: boolean };

export const brands: Brand[] = [
  { slug: "bosch", name: "Bosch", logo: bosch },
  { slug: "samsung", name: "Samsung", logo: samsung },
  { slug: "candy", name: "Candy", logo: candy },
  { slug: "taurus", name: "Taurus", logo: taurus },
  { slug: "krohler", name: "Kröhler", logo: krohler },
  { slug: "schleizer", name: "Schleizer", logo: schleizer },
  { slug: "siera", name: "Siera", logo: siera },
  { slug: "tivoli", name: "Tivoli", logo: tivoli },
].map((b) => ({ ...b, pillar: "electromenager" as const, confirmed: true }));
