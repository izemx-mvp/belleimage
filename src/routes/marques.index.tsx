import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Crumbs, PageHero } from "@/components/layout";
import { SampleNote, Stagger, staggerItem } from "@/components/brand";
import { getBrands, getProductsByBrand } from "@/lib/catalogue";
import { breadcrumbLd, pageHead } from "@/lib/seo";
import { t } from "@/i18n/fr";

export const Route = createFileRoute("/marques/")({
  head: () =>
    pageHead({
      title: "Nos marques",
      description: "Environ 15 grandes marques d'électroménager et d'ameublement réunies dans le showroom Belle Image à Kénitra.",
      path: "/marques",
      jsonLd: [breadcrumbLd([{ name: t.common.home, path: "/" }, { name: t.nav.brands, path: "/marques" }])],
    }),
  component: BrandsPage,
});

const pillarLabel = { electromenager: t.nav.electro, ameublement: t.nav.furniture, mixte: `${t.nav.electro} & ${t.nav.furniture}` };

function BrandsPage() {
  const brands = getBrands();
  return (
    <>
      <PageHero
        eyebrow={t.home.brandsEyebrow}
        title={t.home.brandsTitle}
        intro="Électroménager et ameublement : nous sélectionnons des marques reconnues et vous conseillons en showroom pour les comparer."
        crumbs={<Crumbs items={[{ label: t.common.home, href: <Link to="/" className="hover:text-primary">{t.common.home}</Link> }, { label: t.nav.brands }]} />}
      />
      <div className="container-x py-10 md:py-14">
        <Stagger className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {brands.map((b) => (
            <motion.div key={b.slug} variants={staggerItem}>
              <Link to="/marques/$brand" params={{ brand: b.slug }} className="group flex h-full flex-col rounded-2xl border bg-card p-4 transition hover:-translate-y-1 hover:shadow-lift">
                <span className="grid h-24 place-items-center rounded-xl bg-surface font-display text-lg font-extrabold uppercase tracking-wider text-ink/40 transition group-hover:text-ink">{b.name}</span>
                <span className="mt-3 text-sm font-semibold text-ink">{b.name}</span>
                <span className="text-xs text-muted-foreground">{pillarLabel[b.pillar]} · {t.common.products(getProductsByBrand(b.slug).length)}</span>
              </Link>
            </motion.div>
          ))}
        </Stagger>
      </div>
    </>
  );
}
