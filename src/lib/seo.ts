// SEO : balises par page (head() des routes) et données structurées JSON-LD.
import { site } from "@/config/site";
import { getImage } from "./images";
import { brandName, getCategory, type Product } from "./catalogue";

const abs = (path: string) => (path.startsWith("http") ? path : `${site.url}${path.startsWith("/") ? "" : "/"}${path}`);

type HeadInput = {
  title: string;
  description: string;
  path: string;
  /** Nom d'image du système d'images ; défaut og-belle-image. Omise si le fichier manque. */
  image?: string | undefined;
  type?: "website" | "article" | "product";
  jsonLd?: object[];
  noindex?: boolean;
};

export function pageHead({ title, description, path, image, type = "website", jsonLd = [], noindex }: HeadInput) {
  const fullTitle = path === "/" ? title : `${title} | Belle Image Kénitra`;
  const img = getImage(image) ?? getImage("og-belle-image");
  const meta: Record<string, string>[] = [
    { title: fullTitle },
    { name: "description", content: description },
    { property: "og:title", content: fullTitle },
    { property: "og:description", content: description },
    { property: "og:url", content: abs(path) },
    { property: "og:type", content: type },
    { name: "twitter:title", content: fullTitle },
    { name: "twitter:description", content: description },
  ];
  if (img) meta.push({ property: "og:image", content: abs(img) }, { name: "twitter:image", content: abs(img) });
  if (noindex) meta.push({ name: "robots", content: "noindex, follow" });
  return {
    meta,
    links: [{ rel: "canonical", href: abs(path) }],
    scripts: jsonLd.map((d) => ({ type: "application/ld+json", children: JSON.stringify(d) })),
  };
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: abs(it.path) })),
  };
}

export function productLd(p: Product) {
  const img = getImage(p.image);
  const availability = p.stock === "order" ? "https://schema.org/BackOrder" : p.stock === "low" ? "https://schema.org/LimitedAvailability" : "https://schema.org/InStock";
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    sku: p.slug,
    description: p.description,
    category: getCategory(p.category)?.name,
    brand: { "@type": "Brand", name: brandName(p.brand) },
    ...(img ? { image: [abs(img)] } : {}),
    offers: {
      "@type": "Offer",
      url: abs(`/produit/${p.slug}`),
      priceCurrency: "MAD",
      price: p.price.toFixed(2),
      availability,
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: site.name },
    },
  };
}

export function storeLd() {
  const logo = getImage("logo");
  return {
    "@context": "https://schema.org",
    "@type": ["HomeGoodsStore", "LocalBusiness"],
    name: site.name,
    alternateName: site.nameAr,
    url: site.url,
    telephone: site.phoneIntl,
    foundingDate: String(site.foundedYear),
    ...(logo ? { logo: abs(logo), image: abs(logo) } : {}),
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressCountry: site.address.countryCode,
    },
    openingHoursSpecification: [{
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: site.hours.open,
      closes: site.hours.close,
    }],
    paymentAccepted: "Cash",
    currenciesAccepted: "MAD",
    sameAs: [site.social.facebook],
  };
}
