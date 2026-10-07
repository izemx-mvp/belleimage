import { Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, Truck } from "lucide-react";
import { WhatsAppIcon } from "@/components/layout";
import { site } from "@/config/site";
import { pillarOf, type Product } from "@/lib/catalogue";
import { formatPrice, track, waLink } from "@/lib/commerce";
import { t } from "@/i18n/fr";

/**
 * Détails du produit, tout visible (pas d'onglets) : plus lisible sur mobile et mieux référencé.
 * Gauche : description + fiche technique. Droite : livraison + garantie.
 * Le nom ProductTabs est conservé pour ne pas toucher aux imports.
 */
export function ProductTabs({ p }: { p: Product }) {
  const furniture = pillarOf(p) === "ameublement";
  const options = site.deliveryOptions.filter((o) => (furniture ? !o.title.includes("électroménager") : !o.title.includes("meubles")));

  return (
    <div className="mt-16 grid gap-10 border-t pt-14 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-14">
      <div className="min-w-0 space-y-12">
        <section aria-labelledby="pd-desc">
          <h2 id="pd-desc" className="text-2xl font-extrabold text-ink md:text-3xl">{t.product.tabs.description}</h2>
          <p className="mt-4 max-w-[68ch] text-[1.05rem] leading-relaxed text-ink/85">{p.description}</p>
          <a
            href={waLink(`Bonjour Belle Image, j'ai une question sur : ${p.name}`)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("whatsapp_click", { location: "product_details", item_id: p.slug })}
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-ink underline decoration-whatsapp decoration-2 underline-offset-4 hover:text-whatsapp"
          >
            <WhatsAppIcon className="h-4 w-4 text-whatsapp" />
            Dimensions, coloris, installation : demandez-nous
          </a>
        </section>

        {p.specs.length > 0 && (
          <section aria-labelledby="pd-specs">
            <h2 id="pd-specs" className="text-2xl font-extrabold text-ink md:text-3xl">{t.product.tabs.specs}</h2>
            <dl className="mt-5 overflow-hidden rounded-[1.5rem] border">
              {p.specs.map(([k, v], i) => (
                <div key={k} className={`grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-4 px-5 py-3.5 text-sm ${i % 2 ? "bg-background" : "bg-surface"}`}>
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="font-semibold text-ink">{v}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}
      </div>

      <aside className="space-y-4" aria-label="Livraison et garantie">
        <section aria-labelledby="pd-delivery" className="rounded-[1.75rem] bg-ink p-6 text-ink-foreground md:p-7">
          <h2 id="pd-delivery" className="flex items-center gap-3 font-display text-xl font-extrabold">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-primary"><Truck className="h-5 w-5" aria-hidden /></span>
            {t.product.tabs.delivery}
          </h2>
          <ul className="mt-5 divide-y divide-ink-foreground/10">
            {site.deliveryZones.map((z) => (
              <li key={z.id} className="flex flex-wrap items-baseline justify-between gap-2 py-3 text-sm">
                <span className="font-semibold">{z.label}</span>
                <span className="tabular text-ink-muted">{z.delay}, <span className="font-semibold text-ink-foreground">{z.fee === 0 ? t.cart.deliveryFree : formatPrice(z.fee)}</span></span>
              </li>
            ))}
          </ul>
          <p className="tabular mt-3 rounded-xl bg-ink-foreground/[0.06] px-3 py-2 text-sm">
            Livraison offerte dès <span className="font-bold text-primary">{formatPrice(site.freeDeliveryThreshold)}</span>
          </p>
          {options.length > 0 && (
            <ul className="mt-4 space-y-2 text-sm text-ink-muted">
              {options.map((o) => (
                <li key={o.title}><span className="font-semibold text-ink-foreground">{o.title}.</span> {o.text}</li>
              ))}
            </ul>
          )}
          <Link to="/livraison-paiement" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold hover:text-primary">
            Tout savoir sur la livraison
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </section>

        <section aria-labelledby="pd-warranty" className="rounded-[1.75rem] border p-6 md:p-7">
          <h2 id="pd-warranty" className="flex items-center gap-3 font-display text-xl font-extrabold text-ink">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-primary-soft text-primary"><ShieldCheck className="h-5 w-5" aria-hidden /></span>
            {t.product.tabs.warranty}
          </h2>
          <p className="mt-4 font-semibold text-ink">{p.warranty}</p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            En cas de problème, contactez-nous par WhatsApp ou au <span className="tabular">{site.phone}</span> avec votre référence de commande : nous organisons la prise en charge.
          </p>
          <Link to="/garantie-sav" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
            Garantie et SAV
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </section>
      </aside>
    </div>
  );
}