import { createFileRoute, Link } from "@tanstack/react-router";
import { Phone } from "lucide-react";
import { Crumbs, PageHero, WhatsAppIcon } from "@/components/layout";
import { FaqList, faqLd } from "@/components/sections/shared/faq-list";
import { site } from "@/config/site";
import { faqGroups } from "@/data/faq";
import { telLink, track, waLink } from "@/lib/commerce";
import { breadcrumbLd, pageHead } from "@/lib/seo";
import { t } from "@/i18n/fr";

export const Route = createFileRoute("/faq")({
  head: () =>
    pageHead({
      title: "Questions fréquentes",
      description: "Commande, livraison, paiement à la livraison, garantie et retours : toutes les réponses de Belle Image Kénitra.",
      path: "/faq",
      jsonLd: [faqLd(faqGroups.flatMap((g) => g.items)), breadcrumbLd([{ name: t.common.home, path: "/" }, { name: "FAQ", path: "/faq" }])],
    }),
  component: FaqPage,
});

function FaqPage() {
  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title={t.home.faqTitle}
        intro="Les réponses aux questions les plus posées sur la commande, la livraison, le paiement et la garantie."
        crumbs={<Crumbs items={[{ label: t.common.home, href: <Link to="/" className="hover:text-primary">{t.common.home}</Link> }, { label: "FAQ" }]} />}
      >
        <nav aria-label="Thèmes" className="mt-6 flex flex-wrap gap-2">
          {faqGroups.map((g) => <a key={g.id} href={`#${g.id}`} className="rounded-full bg-background px-4 py-2 text-sm font-semibold shadow-card hover:text-primary">{g.title}</a>)}
        </nav>
      </PageHero>
      <div className="container-x max-w-4xl space-y-12 py-12">
        {faqGroups.map((g) => (
          <section key={g.id} id={g.id} className="scroll-mt-40" aria-labelledby={`${g.id}-title`}>
            <h2 id={`${g.id}-title`} className="mb-4 text-2xl font-extrabold text-ink">{g.title}</h2>
            <FaqList items={g.items} idPrefix={g.id} />
          </section>
        ))}
        <div className="rounded-3xl bg-ink p-6 text-center text-ink-foreground md:p-10">
          <h2 className="text-2xl font-extrabold">Vous ne trouvez pas votre réponse ?</h2>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <a href={waLink(t.whatsappDefault)} target="_blank" rel="noopener noreferrer" onClick={() => track("whatsapp_click", { location: "faq" })} className="btn btn-whatsapp"><WhatsAppIcon className="h-4 w-4" />{t.common.writeWhatsapp}</a>
            <a href={telLink} onClick={() => track("phone_click", { location: "faq" })} className="btn btn-ghost-light"><Phone className="h-4 w-4" aria-hidden />{site.phone}</a>
          </div>
        </div>
      </div>
    </>
  );
}
