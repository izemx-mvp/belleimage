import { Link } from "@tanstack/react-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SampleNote } from "@/components/brand";
import { site } from "@/config/site";
import { pillarOf, type Product } from "@/lib/catalogue";
import { formatPrice } from "@/lib/commerce";
import { t } from "@/i18n/fr";

const trigger = "rounded-full px-4 py-2 text-sm font-semibold data-[state=active]:bg-ink data-[state=active]:text-ink-foreground data-[state=active]:shadow-none";

export function ProductTabs({ p }: { p: Product }) {
  const furniture = pillarOf(p) === "ameublement";
  return (
    <Tabs defaultValue="description" className="mt-14">
      <TabsList className="no-scrollbar h-auto w-full justify-start gap-1 overflow-x-auto rounded-full bg-surface p-1.5">
        <TabsTrigger value="description" className={trigger}>{t.product.tabs.description}</TabsTrigger>
        <TabsTrigger value="specs" className={trigger}>{t.product.tabs.specs}</TabsTrigger>
        <TabsTrigger value="delivery" className={trigger}>{t.product.tabs.delivery}</TabsTrigger>
        <TabsTrigger value="warranty" className={trigger}>{t.product.tabs.warranty}</TabsTrigger>
      </TabsList>
      <div className="mt-6 max-w-3xl leading-relaxed text-ink/85">
        <TabsContent value="description">
          <p>{p.description}</p>
          <p className="mt-4 text-sm text-muted-foreground">Points forts, usages et conseils d'entretien : À COMPLÉTER avec la fiche du fabricant.</p>
        </TabsContent>
        <TabsContent value="specs">
          <table className="w-full overflow-hidden rounded-2xl text-sm">
            <caption className="sr-only">{t.product.tabs.specs}</caption>
            <tbody>
              {p.specs.map(([k, v], i) => (
                <tr key={k} className={i % 2 ? "bg-background" : "bg-surface"}>
                  <th scope="row" className="w-1/2 px-4 py-3 text-left font-semibold">{k}</th>
                  <td className="px-4 py-3">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-3"><SampleNote>{t.product.specsNote}</SampleNote></p>
        </TabsContent>
        <TabsContent value="delivery">
          <ul className="space-y-2">
            {site.deliveryZones.map((z) => (
              <li key={z.id} className="flex flex-wrap justify-between gap-2 border-b py-2 text-sm">
                <span className="font-semibold">{z.label}</span>
                <span className="tabular text-muted-foreground">{z.delay} · {z.fee === 0 ? t.cart.deliveryFree : formatPrice(z.fee)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm">Livraison offerte dès {formatPrice(site.freeDeliveryThreshold)}.</p>
          <ul className="mt-4 space-y-2 text-sm">
            {site.deliveryOptions.filter((o) => (furniture ? !o.title.includes("électroménager") : !o.title.includes("meubles"))).map((o) => (
              <li key={o.title}><span className="font-semibold">{o.title} — </span>{o.text}</li>
            ))}
          </ul>
          <Link to="/livraison-paiement" className="mt-4 inline-block text-sm font-semibold text-primary hover:underline">Tout savoir sur la livraison →</Link>
        </TabsContent>
        <TabsContent value="warranty">
          <p>{p.warranty}.</p>
          <p className="mt-3 text-sm text-muted-foreground">En cas de problème, contactez-nous par WhatsApp ou au {site.phone} avec votre référence de commande : nous organisons la prise en charge.</p>
          <Link to="/garantie-sav" className="mt-4 inline-block text-sm font-semibold text-primary hover:underline">Garantie & SAV →</Link>
        </TabsContent>
      </div>
    </Tabs>
  );
}
