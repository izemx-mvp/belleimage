import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { CartLines, Crumbs, EmptyState, FreeDeliveryBar } from "@/components/layout";
import { Reassurance } from "@/components/brand";
import { SkeletonGrid } from "@/components/product";
import { CodNotice, Totals } from "@/components/sections/checkout/order-summary";
import { site } from "@/config/site";
import { pageHead } from "@/lib/seo";
import { useShop } from "@/store/shop";
import { t } from "@/i18n/fr";

export const Route = createFileRoute("/panier")({
  head: () => pageHead({ title: t.cart.pageTitle, description: "Votre panier Belle Image : livraison à domicile et paiement à la livraison.", path: "/panier", noindex: true }),
  component: CartPage,
});

function CartPage() {
  const { hydrated, items, count, subtotal, zone, setZone } = useShop();
  return (
    <div className="container-x py-8 md:py-12">
      <Crumbs items={[{ label: t.common.home, href: <Link to="/" className="hover:text-primary">{t.common.home}</Link> }, { label: t.cart.pageTitle }]} />
      <h1 className="mt-4 text-3xl font-extrabold text-ink md:text-5xl">{t.cart.pageTitle} {hydrated && count > 0 && <span className="tabular text-muted-foreground">({count})</span>}</h1>

      {!hydrated ? (
        <div className="mt-8"><SkeletonGrid n={2} className="grid gap-4 md:grid-cols-2" /></div>
      ) : items.length === 0 ? (
        <EmptyState title={t.cart.empty} text={t.cart.emptyHint} action={<Link to="/boutique" className="btn btn-primary mt-2">{t.cart.discover}</Link>} />
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="rounded-3xl border px-4 md:px-6"><CartLines /></div>
          <aside className="space-y-4 lg:sticky lg:top-36 lg:self-start">
            <div className="rounded-3xl border bg-card p-5 md:p-6">
              <label className="block text-sm font-semibold" htmlFor="cart-zone">{t.cart.estimate}</label>
              <select id="cart-zone" value={zone ?? ""} onChange={(e) => setZone(e.target.value || undefined)} className="field mt-2">
                <option value="">{t.cart.deliveryChooseCity}</option>
                {site.deliveryZones.map((z) => <option key={z.id} value={z.id}>{z.label} — {z.delay}</option>)}
              </select>
              <div className="mt-5"><Totals zone={zone} /></div>
              <div className="mt-4"><FreeDeliveryBar subtotal={subtotal} /></div>
              <Link to="/commande" className="btn btn-primary mt-5 w-full">{t.cart.checkout}<ArrowRight className="h-4 w-4" aria-hidden /></Link>
              <Link to="/boutique" className="btn btn-outline mt-2 w-full">{t.cart.continue}</Link>
            </div>
            <CodNotice />
          </aside>
        </div>
      )}
      <div className="mt-14"><Reassurance /></div>
    </div>
  );
}
