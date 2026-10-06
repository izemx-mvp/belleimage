import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { CatalogueView } from "@/components/sections/catalogue/catalogue-view";
import { CataloguePending } from "@/components/sections/catalogue/catalogue-pending";
import type { SetSearch } from "@/components/sections/catalogue/filter-panel";
import { getCategory, getSubcategory } from "@/lib/catalogue";
import { cleanSearch, validateCatalogueSearch } from "@/lib/catalogue-search";
import { breadcrumbLd, pageHead } from "@/lib/seo";
import { t } from "@/i18n/fr";

export const Route = createFileRoute("/boutique/$category/$subcategory")({
  validateSearch: validateCatalogueSearch,
  loader: ({ params }) => {
    if (!getSubcategory(params.category, params.subcategory)) throw notFound();
    return { category: params.category, sub: params.subcategory };
  },
  head: ({ params }) => {
    const c = getCategory(params.category);
    const s = getSubcategory(params.category, params.subcategory);
    if (!c || !s) return {};
    const path = `/boutique/${c.slug}/${s.slug}`;
    return pageHead({
      title: `${s.name} — ${c.name}`,
      description: `${s.name} (${c.name.toLowerCase()}) chez Belle Image Kénitra : comparez les modèles, livraison à domicile et paiement à la livraison.`,
      path,
      image: c.image,
      jsonLd: [breadcrumbLd([
        { name: t.common.home, path: "/" },
        { name: t.common.shop, path: "/boutique" },
        { name: c.name, path: `/boutique/${c.slug}` },
        { name: s.name, path },
      ])],
    });
  },
  pendingComponent: CataloguePending,
  component: SubcategoryPage,
});

function SubcategoryPage() {
  const data = Route.useLoaderData();
  const category = getCategory(data.category)!;
  const sub = getSubcategory(data.category, data.sub)!;
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const setSearch: SetSearch = (patch) => navigate({ search: (prev) => cleanSearch({ ...prev, ...patch }), replace: true, resetScroll: false });
  return (
    <CatalogueView
      key={`${category.slug}/${sub.slug}`}
      search={search}
      setSearch={setSearch}
      category={category}
      sub={sub}
      title={sub.name}
      intro={category.intro}
      image={category.image}
      crumbs={[
        { label: t.common.home, href: <Link to="/" className="hover:text-primary">{t.common.home}</Link> },
        { label: t.common.shop, href: <Link to="/boutique" className="hover:text-primary">{t.common.shop}</Link> },
        { label: category.name, href: <Link to="/boutique/$category" params={{ category: category.slug }} className="hover:text-primary">{category.name}</Link> },
        { label: sub.name },
      ]}
    />
  );
}
