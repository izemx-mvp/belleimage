import { createFileRoute } from "@tanstack/react-router";
import { ShopByUniverse } from "@/components/sections/home/categories";
import { Advice, FinalCta, HomeFaq } from "@/components/sections/home/closing";
import { CompanyBlock } from "@/components/sections/home/company";
import { Hero, HomeReassurance } from "@/components/sections/home/hero";
import { BestSellers, PromotionsBlock } from "@/components/sections/home/promotions";
import { ShowroomBand } from "@/components/sections/home/showroom";
import { BrandsWall, Reviews } from "@/components/sections/home/trust";
import { WaysToBuy } from "@/components/sections/home/ways-to-buy";
import { faqLd } from "@/components/sections/shared/faq-list";
import { homeFaq } from "@/data/faq";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () =>
    pageHead({
      title: "Belle Image — Électroménager & Ameublement à Kénitra, paiement à la livraison",
      description:
        "Belle Image, showroom d'électroménager et d'ameublement à Kénitra depuis 2003 : environ 15 grandes marques, livraison à domicile et paiement à la livraison.",
      path: "/",
      jsonLd: [faqLd(homeFaq)],
    }),
  component: Index,
});

/**
 * Vitrine + boutique, en alternance :
 * boutique (univers, promos) → entreprise (qui sommes-nous, chiffres) → pont (deux façons d'acheter)
 * → boutique (meilleures ventes) → confiance (marques, avis) → contenu (conseils, FAQ) → contact.
 */
function Index() {
  return (
    <>
      <Hero />
      <HomeReassurance />
      <ShopByUniverse />
      <PromotionsBlock />
      <CompanyBlock />
      <ShowroomBand />
      <WaysToBuy />
      <div className="bg-surface">
        <BestSellers />
      </div>
      <BrandsWall />
      <Reviews />
      <Advice />
      <HomeFaq />
      <FinalCta />
    </>
  );
}