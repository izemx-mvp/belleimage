import { createFileRoute, Link } from "@tanstack/react-router";
import { Crumbs, EmptyState, PageHero } from "@/components/layout";
import { ProductGrid, SkeletonGrid } from "@/components/product";
import { AccountShell } from "@/components/sections/account/account-shell";
import { getProductBySlug, type Product } from "@/lib/catalogue";
import { pageHead } from "@/lib/seo";
import { useAuth } from "@/store/auth";
import { useShop } from "@/store/shop";
import { t } from "@/i18n/fr";

export const Route = createFileRoute("/favoris")({
  head: () => pageHead({ title: t.fav.title, description: "Vos produits favoris Belle Image.", path: "/favoris", noindex: true }),
  component: FavoritesPage,
});

function FavoritesList({ grid }: { grid?: string }) {
  const { hydrated, favs } = useShop();
  const products = favs.map(getProductBySlug).filter((p): p is Product => Boolean(p));
  if (!hydrated) return <SkeletonGrid n={4} {...(grid ? { className: grid } : {})} />;
  if (!products.length) {
    return <EmptyState title={t.fav.empty} text={t.fav.emptyText} action={<Link to="/boutique" className="btn btn-primary mt-2">{t.cart.discover}</Link>} />;
  }
  return <ProductGrid products={products} {...(grid ? { className: grid } : {})} />;
}

function FavoritesPage() {
  const { isLoggedIn } = useAuth();
  // Connecté : les favoris s'affichent dans la navigation de l'espace client.
  if (isLoggedIn) {
    return (
      <AccountShell title={t.fav.title} crumb={t.fav.title}>
        <FavoritesList grid="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-3" />
      </AccountShell>
    );
  }
  return (
    <>
      <PageHero
        title={t.fav.title}
        intro={t.fav.intro}
        crumbs={<Crumbs items={[{ label: t.common.home, href: <Link to="/" className="hover:text-primary">{t.common.home}</Link> }, { label: t.fav.title }]} />}
      />
      <div className="container-x py-10"><FavoritesList /></div>
    </>
  );
}
