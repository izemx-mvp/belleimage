import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Crumbs, EmptyState, PageHero } from "@/components/layout";
import { SampleNote } from "@/components/brand";
import { ProductGrid } from "@/components/product";
import { getBrand, getProductsByBrand } from "@/lib/catalogue";
import { breadcrumbLd, pageHead } from "@/lib/seo";
import { t } from "@/i18n/fr";

export const Route = createFileRoute("/marques/$brand")({
  loader: ({ params }) => {
    if (!getBrand(params.brand)) throw notFound();
    return { slug: params.brand };
  },
  head: ({ params }) => {
    const b = getBrand(params.brand);
    if (!b) return {};
    return pageHead({
      title: `${b.name} — produits et prix`,
      description: `Produits ${b.name} disponibles chez Belle Image Kénitra : livraison à domicile et paiement à la livraison.`,
      path: `/marques/${b.slug}`,
      jsonLd: [breadcrumbLd([{ name: t.common.home, path: "/" }, { name: t.nav.brands, path: "/marques" }, { name: b.name, path: `/marques/${b.slug}` }])],
    });
  },
  component: BrandPage,
});

function BrandPage() {
  const { slug } = Route.useLoaderData();
  const brand = getBrand(slug)!;
  const products = getProductsByBrand(slug);
  return (
    <>
      <PageHero
        eyebrow={t.nav.brands}
        title={brand.name}
        intro={`Présentation de la marque À COMPLÉTER. ${t.common.products(products.length)} dans le catalogue exemple.`}
        crumbs={<Crumbs items={[
          { label: t.common.home, href: <Link to="/" className="hover:text-primary">{t.common.home}</Link> },
          { label: t.nav.brands, href: <Link to="/marques" className="hover:text-primary">{t.nav.brands}</Link> },
          { label: brand.name },
        ]} />}
      />
      <div className="container-x py-10">
        {products.length ? <ProductGrid products={products} priorityCount={2} /> : <EmptyState title={t.catalogue.emptyTitle} action={<Link to="/marques" className="btn btn-primary mt-2">{t.nav.brands}</Link>} />}
      </div>
    </>
  );
}
