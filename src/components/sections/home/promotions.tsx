import { Link } from "@tanstack/react-router";
import { ArrowRight, Percent } from "lucide-react";
import { useState } from "react";
import { SampleNote, SectionTitle } from "@/components/brand";
import { ProductGrid, ProductRail } from "@/components/product";
import { SmartImage } from "@/components/smart-image";
import { discount, getBestSellers, getPromotions, pillarOf } from "@/lib/catalogue";
import { cn } from "@/lib/utils";
import { t } from "@/i18n/fr";

/** Pastille de prix inclinée, comme les étiquettes promo en magasin. */
function PriceSticker({ value }: { value: number }) {
  return (
    <div className="absolute right-4 top-4 grid h-24 w-24 -rotate-[10deg] place-items-center rounded-full bg-primary text-center text-primary-foreground shadow-red ring-[6px] ring-ink transition-transform duration-500 group-hover:-rotate-[4deg] md:right-8 md:top-8 md:h-28 md:w-28">
      <div>
        <p className="text-[11px] font-semibold leading-none">{t.home.promosUpTo}</p>
        <p className="tabular mt-1 font-display text-3xl font-extrabold leading-none md:text-4xl">-{value}%</p>
      </div>
    </div>
  );
}

export function PromotionsBlock() {
  const promos = getPromotions();
  const electroMax = Math.max(0, ...promos.filter((p) => pillarOf(p) === "electromenager").map(discount));
  const title = electroMax > 0 ? t.home.promosBannerTitle(electroMax) : t.home.promosBannerFallback;
  // Les offres avec compte à rebours d'abord.
  const rail = [...promos.filter((p) => p.dealEndsAt), ...promos.filter((p) => !p.dealEndsAt)].slice(0, 10);

  return (
    <section className="container-x pb-16 md:pb-24" aria-labelledby="home-promos">
      <SectionTitle
        title={t.home.promosTitle}
        id="home-promos"
        action={
          <Link to="/promotions" className="text-sm font-semibold text-primary hover:underline">
            {t.common.seeAll}
          </Link>
        }
      />

      <Link
        to="/promotions"
        className="group mb-10 grid overflow-hidden rounded-3xl bg-ink text-ink-foreground md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]"
      >
        <div className="order-2 flex flex-col justify-center p-7 md:order-1 md:p-12">
          <p className="text-sm font-semibold text-primary">{t.nav.promos}</p>
          <p className="mt-3 max-w-md font-display text-3xl font-extrabold leading-[1.05] tracking-[-0.02em] md:text-[2.6rem]">
            {title}
          </p>
          <p className="mt-3 max-w-sm text-sm text-ink-muted">{t.home.promosBannerNote}</p>
          <span className="mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold">
            {t.nav.promoTileCta}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
          </span>
        </div>
        <div className="relative order-1 min-h-[230px] overflow-hidden md:order-2 md:min-h-[340px]">
          <div className="absolute inset-0">
            <SmartImage
              name="promo-banner-electromenager"
              icon={Percent}
              className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
          </div>
          {electroMax > 0 && <PriceSticker value={electroMax} />}
        </div>
      </Link>

      <ProductRail products={rail} label={t.home.promosTitle} />
    </section>
  );
}

type Pillar = "electromenager" | "ameublement";

export function BestSellers() {
  const [tab, setTab] = useState<Pillar>("electromenager");
  const list = getBestSellers(tab).slice(0, 8);
  const tabs = [
    { id: "electromenager", label: t.nav.electro },
    { id: "ameublement", label: t.nav.furniture },
  ] as const;
  const other = (p: Pillar): Pillar => (p === "electromenager" ? "ameublement" : "electromenager");

  return (
    <section className="py-16 md:py-24" aria-labelledby="home-best">
      <div className="container-x">
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <h2 id="home-best" className="text-3xl font-extrabold text-ink md:text-4xl">
            {t.home.bestTitle}
          </h2>
          <div
            role="tablist"
            aria-label={t.home.bestTitle}
            className="inline-flex w-fit rounded-full border bg-surface p-1"
            onKeyDown={(e) => {
              if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                const next = other(tab);
                setTab(next);
                document.getElementById(`tab-${next}`)?.focus();
              }
            }}
          >
            {tabs.map((x) => (
              <button
                key={x.id}
                type="button"
                role="tab"
                id={`tab-${x.id}`}
                aria-selected={tab === x.id}
                aria-controls="best-panel"
                tabIndex={tab === x.id ? 0 : -1}
                onClick={() => setTab(x.id)}
                className={cn(
                  "rounded-full px-5 py-2.5 text-sm font-semibold transition-colors",
                  tab === x.id ? "bg-ink text-ink-foreground" : "text-ink hover:text-primary",
                )}
              >
                {x.label}
              </button>
            ))}
          </div>
        </div>
        <div id="best-panel" role="tabpanel" aria-labelledby={`tab-${tab}`}>
          <ProductGrid key={tab} products={list} />
        </div>
        <p className="mt-6">
          <SampleNote>{t.catalogue.sampleNote}</SampleNote>
        </p>
      </div>
    </section>
  );
}