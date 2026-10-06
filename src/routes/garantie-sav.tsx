import { createFileRoute, Link } from "@tanstack/react-router";
import { Camera, MessageSquare, Phone, RefreshCcw, Wrench } from "lucide-react";
import { Crumbs, PageHero, WhatsAppIcon } from "@/components/layout";
import { SampleNote, SectionTitle } from "@/components/brand";
import { site } from "@/config/site";
import { telLink, track, waLink } from "@/lib/commerce";
import { breadcrumbLd, pageHead } from "@/lib/seo";
import { t } from "@/i18n/fr";

export const Route = createFileRoute("/garantie-sav")({
  head: () =>
    pageHead({
      title: "Garantie & service après-vente",
      description: "Garantie constructeur sur l'électroménager, garantie Belle Image sur l'ameublement et SAV par WhatsApp ou téléphone.",
      path: "/garantie-sav",
      jsonLd: [breadcrumbLd([{ name: t.common.home, path: "/" }, { name: "Garantie & SAV", path: "/garantie-sav" }])],
    }),
  component: WarrantyPage,
});

const steps = [
  { icon: MessageSquare, title: "Contactez-nous", text: "Par WhatsApp ou par téléphone, avec votre référence de commande (BI-…)." },
  { icon: Camera, title: "Décrivez le problème", text: "Une photo ou une courte vidéo nous aide à diagnostiquer plus vite." },
  { icon: Wrench, title: "Prise en charge", text: "Nous organisons l'intervention avec le SAV de la marque ou notre équipe." },
];

function WarrantyPage() {
  return (
    <>
      <PageHero
        eyebrow="Garantie & SAV"
        title="Des produits garantis, une équipe qui vous suit"
        intro="Après l'achat, Belle Image reste votre interlocuteur pour la garantie et le service après-vente."
        crumbs={<Crumbs items={[{ label: t.common.home, href: <Link to="/" className="hover:text-primary">{t.common.home}</Link> }, { label: "Garantie & SAV" }]} />}
      />
      <div className="container-x space-y-16 py-12 md:py-16">
        <section aria-labelledby="table">
          <SectionTitle eyebrow="Garanties" title="Garantie par famille de produits" id="table" />
          <div className="overflow-x-auto rounded-3xl border">
            <table className="w-full min-w-[560px] text-sm">
              <caption className="sr-only">Durées et conditions de garantie</caption>
              <thead className="bg-ink text-left text-ink-foreground">
                <tr><th scope="col" className="px-5 py-4">Famille</th><th scope="col" className="px-5 py-4">Durée</th><th scope="col" className="px-5 py-4">Couverture</th></tr>
              </thead>
              <tbody>
                {site.warranty.table.map((r, i) => (
                  <tr key={r.scope} className={i % 2 ? "bg-surface" : ""}>
                    <th scope="row" className="px-5 py-4 text-left font-semibold">{r.scope}</th>
                    <td className="px-5 py-4">{r.duration}</td>
                    <td className="px-5 py-4 text-muted-foreground">{r.coverage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4"><SampleNote>Tableau à valider par marque et par produit</SampleNote></p>
        </section>

        <section aria-labelledby="sav">
          <SectionTitle eyebrow="SAV" title="Comment faire une demande ?" id="sav" />
          <div className="grid gap-4 md:grid-cols-3">
            {steps.map((s, i) => (
              <div key={s.title} className="rounded-3xl bg-surface p-6">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-background text-primary shadow-card"><s.icon className="h-6 w-6" aria-hidden /></span>
                <h3 className="mt-4 text-lg font-extrabold text-ink">{i + 1}. {s.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a href={waLink("Bonjour Belle Image, j'ai besoin du SAV pour ma commande (réf. BI-…) :")} target="_blank" rel="noopener noreferrer" onClick={() => track("whatsapp_click", { location: "sav" })} className="btn btn-whatsapp"><WhatsAppIcon className="h-4 w-4" />Demande SAV sur WhatsApp</a>
            <a href={telLink} onClick={() => track("phone_click", { location: "sav" })} className="btn btn-outline"><Phone className="h-4 w-4" aria-hidden />{site.phone}</a>
          </div>
        </section>

        <section className="rounded-3xl border p-6 md:p-8" aria-labelledby="returns">
          <RefreshCcw className="h-8 w-8 text-primary" aria-hidden />
          <h2 id="returns" className="mt-3 text-2xl font-extrabold text-ink">Retours et échanges</h2>
          <div className="mt-3 space-y-3 text-ink/85">
            <p>Délai de rétractation, conditions de retour (produit non utilisé, emballage d'origine…), frais de reprise et modalités d'échange : À COMPLÉTER selon la politique Belle Image et la loi n° 31-08 (référence à vérifier).</p>
            <p>Produit endommagé à la livraison : signalez-le immédiatement au livreur et contactez-nous dans les 24 h.</p>
          </div>
          <p className="mt-4"><SampleNote>Politique de retour À COMPLÉTER</SampleNote></p>
        </section>
      </div>
    </>
  );
}
