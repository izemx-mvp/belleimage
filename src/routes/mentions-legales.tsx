import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/sections/shared/legal-page";
import { mentions } from "@/data/legal";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/mentions-legales")({
  head: () => pageHead({ title: "Mentions légales", description: "Mentions légales du site Belle Image (Kénitra) : éditeur, hébergement, données personnelles.", path: "/mentions-legales" }),
  component: () => <LegalPage title="Mentions légales" intro="Informations légales sur l'éditeur du site et le traitement des données." sections={mentions} />,
});
