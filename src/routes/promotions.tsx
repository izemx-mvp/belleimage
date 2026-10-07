import { createFileRoute, Link } from "@tanstack/react-router";
import { Crumbs, EmptyState, PageHero } from "@/components/layout";
import { Reassurance } from "@/components/brand";
import { ProductGrid } from "@/components/product";
import { discount, getPromotions } from "@/lib/catalogue";
import { breadcrumbLd, pageHead } from "@/lib/seo";
import { t } from "@/i18n/fr";

type PromoSort = "remise" | "prix-asc" | "prix-desc";
const sorts: { value: PromoSort; label: string }[] = [
  { value: "remise", label: "Plus grosse remise" },
  { value: "prix-asc", label: "Prix croissant" },
  { value: "prix-desc", label: "Prix décroissant" },
];

export const Route = createFileRoute("/promotions")({
  validateSearch: (raw: Record<string, unknown>): { sort?: PromoSort } =>
    raw["sort"] === "prix-asc" || raw["sort"] === "prix-desc" ? { sort: raw["sort"] } : {},
  head: () =>
    pageHead({
      title: "Promotions électroménager & ameublement",
      description: "Toutes les promotions Belle Image à Kénitra : remises sur l'électroménager et l'ameublement, livraison à domicile et paiement à la livraison.",
      path: "/promotions",
      image: "promo-banner-electromenager",
      jsonLd: [breadcrumbLd([{ name: t.common.home, path: "/" }, { name: t.nav.promos, path: "/promotions" }])],
    }),
  component: PromotionsPage,
});

function PromotionsPage() {
  const { sort = "remise" } = Route.useSearch();
  const navigate = Route.useNavigate();
  const promos = getPromotions();
  const list = sort === "prix-asc" ? [...promos].sort((a, b) => a.price - b.price) : sort === "prix-desc" ? [...promos].sort((a, b) => b.price - a.price) : promos;
  const maxPct = Math.max(0, ...promos.map(discount));
  return (
    <>
      <PageHero
        eyebrow={t.home.promosEyebrow}
        title={t.home.promosTitle}
        intro={`${promos.length} offres en cours, jusqu'à -${maxPct} %. Livraison à domicile et paiement à la livraison.`}
        crumbs={<Crumbs items={[{ label: t.common.home, href: <Link to="/" className="hover:text-primary">{t.common.home}</Link> }, { label: t.nav.promos }]} />}
      >
        <p className="mt-4 text-sm text-muted-foreground">{t.home.promosBannerNote}</p>
      </PageHero>
      <div className="container-x py-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b pb-4">
          <p className="tabular text-sm text-muted-foreground">{t.common.products(list.length)}</p>
          <label className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">{t.catalogue.sort}</span>
            <select value={sort} onChange={(e) => navigate({ search: e.target.value === "remise" ? {} : { sort: e.target.value as PromoSort }, replace: true, resetScroll: false })}
              className="h-10 rounded-full border-[1.5px] border-input bg-background px-3 text-sm font-semibold focus:border-ring focus:outline-none">
              {sorts.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </label>
        </div>
        {list.length ? <ProductGrid key={sort} products={list} priorityCount={2} /> : <EmptyState title={t.catalogue.emptyTitle} />}
        <div className="mt-14"><Reassurance /></div>
      </div>
    </>
  );
}
