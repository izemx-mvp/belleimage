import { createFileRoute, Link } from "@tanstack/react-router";
import { Crumbs, EmptyState } from "@/components/layout";
import { SkeletonGrid } from "@/components/product";
import { CheckoutForm } from "@/components/sections/checkout/checkout-form";
import { pageHead } from "@/lib/seo";
import { useShop } from "@/store/shop";
import { t } from "@/i18n/fr";

export const Route = createFileRoute("/commande/")({
  head: () => pageHead({ title: t.checkout.title, description: "Finalisez votre commande Belle Image : paiement à la livraison, confirmation par WhatsApp.", path: "/commande", noindex: true }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { hydrated, items } = useShop();
  return (
    <div className="container-x py-8 md:py-12">
      <Crumbs items={[
        { label: t.common.home, href: <Link to="/" className="hover:text-primary">{t.common.home}</Link> },
        { label: t.cart.pageTitle, href: <Link to="/panier" className="hover:text-primary">{t.cart.pageTitle}</Link> },
        { label: t.checkout.title },
      ]} />
      <h1 className="mt-4 text-3xl font-extrabold text-ink md:text-5xl">{t.checkout.title}</h1>
      <p className="mt-2 text-muted-foreground">{t.checkout.intro}</p>
      {!hydrated ? (
        <div className="mt-8"><SkeletonGrid n={2} className="grid gap-4 md:grid-cols-2" /></div>
      ) : items.length === 0 ? (
        <EmptyState title={t.checkout.emptyTitle} text={t.checkout.emptyText} action={<Link to="/boutique" className="btn btn-primary mt-2">{t.cart.discover}</Link>} />
      ) : (
        <CheckoutForm />
      )}
    </div>
  );
}
