import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/sections/shared/legal-page";
import { cgv } from "@/data/legal";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/cgv")({
  head: () => pageHead({ title: "Conditions générales de vente", description: "Conditions générales de vente Belle Image : commande, paiement à la livraison, livraison, garantie et retours.", path: "/cgv" }),
  component: () => <LegalPage title="Conditions générales de vente" intro="Les règles qui encadrent vos commandes chez Belle Image." sections={cgv} />,
});
