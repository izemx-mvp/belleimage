import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Banknote, MapPin, Package, RotateCcw } from "lucide-react";
import { useState } from "react";
import { EmptyState, WhatsAppIcon } from "@/components/layout";
import { ProductThumb } from "@/components/product";
import { AccountShell, OrderTimeline, StatusBadge, formatOrderDate } from "@/components/sections/account/account-shell";
import { getProductBySlug } from "@/lib/catalogue";
import { formatPrice, track, waLink } from "@/lib/commerce";
import { pageHead } from "@/lib/seo";
import { useAuth } from "@/store/auth";
import { useShop } from "@/store/shop";
import { t } from "@/i18n/fr";

export const Route = createFileRoute("/compte/commandes/$ref")({
  head: ({ params }) => pageHead({ title: t.account.orders.detail(params.ref), description: "Détail de commande (démo).", path: `/compte/commandes/${params.ref}`, noindex: true }),
  component: OrderDetailPage,
});

function OrderDetailPage() {
  const { ref } = Route.useParams();
  const { orders } = useAuth();
  const { add, setCartOpen } = useShop();
  const [missing, setMissing] = useState(false);
  const order = orders.find((o) => o.ref === ref);

  if (!order) {
    return (
      <AccountShell title={t.account.orders.detail(ref)} crumb={t.account.orders.title}>
        <EmptyState title={t.account.orders.notFound} action={<Link to="/compte/commandes" className="btn btn-primary mt-2">{t.account.orders.back}</Link>} />
      </AccountShell>
    );
  }

  // Remet les produits encore au catalogue dans le panier, puis ouvre le tiroir panier.
  const reorder = () => {
    let skipped = false;
    for (const i of order.items) {
      if (i.slug && getProductBySlug(i.slug)) add(i.slug, { qty: i.qty, variant: i.variant, openDrawer: false });
      else skipped = true;
    }
    setMissing(skipped);
    setCartOpen(true);
  };

  return (
    <AccountShell title={t.account.orders.detail(order.ref)} crumb={t.account.orders.title}>
      <Link to="/compte/commandes" className="-mt-2 mb-5 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
        <ArrowLeft className="h-4 w-4" aria-hidden />{t.account.orders.back}
      </Link>
      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
        <StatusBadge status={order.status} />
        <span>{formatOrderDate(order.createdAt)}</span>
      </div>

      <section className="mt-6 rounded-3xl border p-5 md:p-6" aria-labelledby="timeline">
        <h2 id="timeline" className="mb-5 font-display text-lg font-extrabold">{t.account.orders.timeline}</h2>
        <OrderTimeline status={order.status} />
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section className="rounded-3xl border p-5 md:p-6" aria-labelledby="items">
          <h2 id="items" className="font-display text-lg font-extrabold">{t.checkout.summary}</h2>
          <ul className="mt-3 divide-y">
            {order.items.map((i, k) => {
              const p = i.slug ? getProductBySlug(i.slug) : undefined;
              return (
                <li key={k} className="grid grid-cols-[56px_minmax(0,1fr)_auto] items-center gap-3 py-3">
                  <div className="overflow-hidden rounded-xl border">
                    {p ? <ProductThumb p={p} /> : <div className="grid aspect-square place-items-center bg-surface"><Package className="h-5 w-5 text-muted-foreground" aria-hidden /></div>}
                  </div>
                  <div className="min-w-0">
                    {p ? <Link to="/produit/$slug" params={{ slug: p.slug }} className="line-clamp-2 text-sm font-semibold hover:text-primary">{i.name}</Link> : <p className="text-sm font-semibold">{i.name}</p>}
                    <p className="tabular text-xs text-muted-foreground">{i.qty} × {formatPrice(i.price)}{i.variant ? ` · ${i.variant}` : ""}</p>
                  </div>
                  <span className="tabular text-sm font-bold">{formatPrice(i.price * i.qty)}</span>
                </li>
              );
            })}
          </ul>
          <dl className="mt-3 space-y-2 border-t pt-4 text-sm">
            <div className="flex justify-between"><dt>{t.cart.subtotal}</dt><dd className="tabular font-semibold">{formatPrice(order.subtotal)}</dd></div>
            <div className="flex justify-between"><dt>{t.cart.delivery}</dt><dd className="tabular font-semibold">{order.fee === 0 ? t.cart.deliveryFree : formatPrice(order.fee)}</dd></div>
            <div className="flex justify-between border-t pt-3 text-lg font-extrabold"><dt>{t.cart.total}</dt><dd className="tabular text-primary">{formatPrice(order.total)}</dd></div>
          </dl>
        </section>

        <div className="space-y-4">
          <section className="rounded-3xl border p-5" aria-labelledby="addr">
            <h2 id="addr" className="flex items-center gap-2 font-display font-extrabold"><MapPin className="h-4 w-4 text-primary" aria-hidden />{t.account.orders.deliveredTo}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{order.address.address}<br />{order.address.district}, {order.address.city}</p>
          </section>
          <p className="flex items-center gap-3 rounded-2xl bg-success-soft p-4 text-sm font-semibold text-success">
            <Banknote className="h-5 w-5 shrink-0" aria-hidden />{t.cart.codTitle}
          </p>
          <button type="button" onClick={reorder} className="btn btn-primary w-full"><RotateCcw className="h-4 w-4" aria-hidden />{t.account.orders.reorder}</button>
          {missing && <p role="status" className="text-xs text-muted-foreground">{t.account.orders.reorderMissing}</p>}
          <a href={waLink(t.account.orders.contactMessage(order.ref))} target="_blank" rel="noopener noreferrer"
            onClick={() => track("whatsapp_click", { location: "account_order", transaction_id: order.ref })} className="btn btn-whatsapp w-full">
            <WhatsAppIcon className="h-4 w-4" />{t.account.orders.contact}
          </a>
        </div>
      </div>
    </AccountShell>
  );
}
