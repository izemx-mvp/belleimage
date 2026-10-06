import { createFileRoute, Link } from "@tanstack/react-router";
import { Banknote, CheckCircle2, PackageCheck, Truck } from "lucide-react";
import { Crumbs, PageHero } from "@/components/layout";
import { Reassurance, SampleNote, SectionTitle } from "@/components/brand";
import { site } from "@/config/site";
import { formatPrice } from "@/lib/commerce";
import { breadcrumbLd, pageHead } from "@/lib/seo";
import { t } from "@/i18n/fr";

export const Route = createFileRoute("/livraison-paiement")({
  head: () =>
    pageHead({
      title: "Livraison & paiement à la livraison",
      description: "Zones, délais et frais de livraison Belle Image (Kénitra, Rabat-Salé, tout le Maroc). Paiement à la livraison, sans paiement en ligne.",
      path: "/livraison-paiement",
      jsonLd: [breadcrumbLd([{ name: t.common.home, path: "/" }, { name: "Livraison & paiement", path: "/livraison-paiement" }])],
    }),
  component: DeliveryPage,
});

const codSteps = [
  "Vous passez commande sur le site : le récapitulatif part sur WhatsApp.",
  "Notre équipe vous rappelle pour confirmer les produits, la date et l'adresse.",
  "Le livreur vous remet la commande : vous vérifiez l'état des produits.",
  "Vous payez à la réception. Aucun paiement en ligne, aucune carte demandée.",
];

function DeliveryPage() {
  return (
    <>
      <PageHero
        eyebrow="Livraison & paiement"
        title="Livré chez vous, payé à la livraison"
        intro="Commandez en toute confiance : vous ne payez qu'au moment de recevoir vos produits."
        crumbs={<Crumbs items={[{ label: t.common.home, href: <Link to="/" className="hover:text-primary">{t.common.home}</Link> }, { label: "Livraison & paiement" }]} />}
      />
      <div className="container-x space-y-16 py-12 md:py-16">
        <section aria-labelledby="zones">
          <SectionTitle eyebrow="Zones & tarifs" title="Où et en combien de temps ?" id="zones" />
          <div className="overflow-x-auto rounded-3xl border">
            <table className="w-full min-w-[560px] text-sm">
              <caption className="sr-only">Zones de livraison, délais et frais</caption>
              <thead className="bg-ink text-left text-ink-foreground">
                <tr><th scope="col" className="px-5 py-4">Zone</th><th scope="col" className="px-5 py-4">Villes couvertes</th><th scope="col" className="px-5 py-4">Délai indicatif</th><th scope="col" className="px-5 py-4 text-right">Frais</th></tr>
              </thead>
              <tbody>
                {site.deliveryZones.map((z, i) => (
                  <tr key={z.id} className={i % 2 ? "bg-surface" : ""}>
                    <th scope="row" className="px-5 py-4 text-left font-semibold">{z.label}</th>
                    <td className="px-5 py-4 text-muted-foreground">{z.cities}</td>
                    <td className="tabular px-5 py-4">{z.delay}</td>
                    <td className="tabular px-5 py-4 text-right font-semibold">{z.fee === 0 ? t.cart.deliveryFree : formatPrice(z.fee)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 flex flex-wrap items-center gap-2 text-sm">
            <Truck className="h-4 w-4 text-primary" aria-hidden />Livraison offerte dès <strong className="tabular">{formatPrice(site.freeDeliveryThreshold)}</strong> d'achat.
          </p>
        </section>

        <section className="grid gap-8 lg:grid-cols-2" aria-labelledby="cod">
          <div>
            <SectionTitle eyebrow="Paiement" title="Comment fonctionne le paiement à la livraison ?" id="cod" />
            <ol className="space-y-4">
              {codSteps.map((s, i) => (
                <li key={s} className="flex gap-4">
                  <span className="tabular grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary font-display font-extrabold text-primary-foreground">{i + 1}</span>
                  <p className="pt-1.5">{s}</p>
                </li>
              ))}
            </ol>
          </div>
          <div className="rounded-3xl bg-success-soft p-6 md:p-8">
            <Banknote className="h-10 w-10 text-success" aria-hidden />
            <h3 className="mt-4 text-2xl font-extrabold text-ink">Zéro paiement en ligne</h3>
            <p className="mt-2 text-ink/80">Aucune carte bancaire n'est demandée sur ce site. Paiement en espèces à la réception.</p>
            <ul className="mt-5 space-y-2 text-sm">
              {["Vous vérifiez avant de payer", "Confirmation par téléphone avant l'envoi", "Paiement uniquement à la réception"].map((x) => (
                <li key={x} className="flex gap-2"><CheckCircle2 className="h-5 w-5 shrink-0 text-success" aria-hidden />{x}</li>
              ))}
            </ul>
          </div>
        </section>

        <section aria-labelledby="big">
          <SectionTitle eyebrow="Gros articles" title="Livraison à l'étage, installation et montage" id="big" />
          <div className="grid gap-4 md:grid-cols-3">
            {site.deliveryOptions.map((o) => (
              <div key={o.title} className="rounded-3xl border p-6">
                <PackageCheck className="h-8 w-8 text-primary" aria-hidden />
                <h3 className="mt-3 text-lg font-extrabold text-ink">{o.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{o.text}</p>
              </div>
            ))}
          </div>
        </section>
        <Reassurance />
      </div>
    </>
  );
}
