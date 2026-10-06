import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { CatalogueView } from "@/components/sections/catalogue/catalogue-view";
import { CataloguePending } from "@/components/sections/catalogue/catalogue-pending";
import type { SetSearch } from "@/components/sections/catalogue/filter-panel";
import { getCategory } from "@/lib/catalogue";
import { cleanSearch, validateCatalogueSearch } from "@/lib/catalogue-search";
import { breadcrumbLd, pageHead } from "@/lib/seo";
import { t } from "@/i18n/fr";

export const Route = createFileRoute("/boutique/$category/")({
  validateSearch: validateCatalogueSearch,
  loader: ({ params }) => {
    const category = getCategory(params.category);
    if (!category) throw notFound();
    return { slug: category.slug };
  },
  head: ({ params }) => {
    const c = getCategory(params.category);
    if (!c) return {};
    return pageHead({
      title: `${c.name} à Kénitra — prix et promotions`,
      description: `${c.intro} Achetez vos ${c.name.toLowerCase()} chez Belle Image : livraison à domicile, paiement à la livraison, showroom à Kénitra.`,
      path: `/boutique/${c.slug}`,
      image: c.image,
      jsonLd: [breadcrumbLd([{ name: t.common.home, path: "/" }, { name: t.common.shop, path: "/boutique" }, { name: c.name, path: `/boutique/${c.slug}` }])],
    });
  },
  pendingComponent: CataloguePending,
  component: CategoryPage,
});

function CategoryPage() {
  const { slug } = Route.useLoaderData();
  const category = getCategory(slug)!;
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const setSearch: SetSearch = (patch) => navigate({ search: (prev) => cleanSearch({ ...prev, ...patch }), replace: true, resetScroll: false });
  return (
    <CatalogueView
      key={category.slug}
      search={search}
      setSearch={setSearch}
      category={category}
      title={category.name}
      intro={category.intro}
      image={category.image}
      crumbs={[
        { label: t.common.home, href: <Link to="/" className="hover:text-primary">{t.common.home}</Link> },
        { label: t.common.shop, href: <Link to="/boutique" className="hover:text-primary">{t.common.shop}</Link> },
        { label: category.name },
      ]}
    />
  );
}
