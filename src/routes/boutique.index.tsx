import { createFileRoute, Link } from "@tanstack/react-router";
import { CatalogueView } from "@/components/sections/catalogue/catalogue-view";
import { CataloguePending } from "@/components/sections/catalogue/catalogue-pending";
import type { SetSearch } from "@/components/sections/catalogue/filter-panel";
import { getPillar } from "@/lib/catalogue";
import { cleanSearch, validateCatalogueSearch } from "@/lib/catalogue-search";
import { breadcrumbLd, pageHead } from "@/lib/seo";
import { t } from "@/i18n/fr";

export const Route = createFileRoute("/boutique/")({
  validateSearch: validateCatalogueSearch,
  head: () =>
    pageHead({
      title: "Boutique électroménager & ameublement",
      description: "Tout le catalogue Belle Image : réfrigérateurs, lave-linge, TV, climatisation, salons, chambres… Livraison à domicile et paiement à la livraison.",
      path: "/boutique",
      jsonLd: [breadcrumbLd([{ name: t.common.home, path: "/" }, { name: t.common.shop, path: "/boutique" }])],
    }),
  pendingComponent: CataloguePending,
  component: Boutique,
});

function Boutique() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const setSearch: SetSearch = (patch) => navigate({ search: (prev) => cleanSearch({ ...prev, ...patch }), replace: true, resetScroll: false });
  const pillar = getPillar(search.pillar);
  const title = search.q ? t.search.resultsFor(search.q) : pillar?.name ?? t.catalogue.title;
  const intro = pillar?.intro ?? t.catalogue.intro;
  return (
    <CatalogueView
      search={search}
      setSearch={setSearch}
      title={title}
      intro={intro}
      crumbs={[
        { label: t.common.home, href: <Link to="/" className="hover:text-primary">{t.common.home}</Link> },
        ...(pillar || search.q ? [{ label: t.common.shop, href: <Link to="/boutique" className="hover:text-primary">{t.common.shop}</Link> }] : []),
        { label: pillar?.name ?? (search.q ? t.search.label : t.common.shop) },
      ]}
    />
  );
}
