import { Link } from "@tanstack/react-router";
import { ArrowRight, Banknote, ShieldCheck, Store, Truck } from "lucide-react";
import { useId, type CSSProperties } from "react";
import { Stars, categoryIcons } from "@/components/brand";
import { SmartImage } from "@/components/smart-image";
import { site } from "@/config/site";
import type { IconKey } from "@/data/categories";
import { imageSpec } from "@/data/images";
import { getCategories } from "@/lib/catalogue";
import { getImage } from "@/lib/images";
import { cn } from "@/lib/utils";
import { t } from "@/i18n/fr";
import { homeCopy } from "@/i18n/home";

/** Catégories mises en avant sous les boutons (repérées par leur icône, pas par leur slug). */
const QUICK: IconKey[] = ["fridge", "washer", "tv", "sofa", "bed"];

/** "Équipez votre maison, payez à la livraison" → deux lignes. Sans virgule : une seule ligne. */
function splitTitle(title: string): [string, string] {
  const i = title.indexOf(",");
  if (i < 0) return [title, ""];
  return [title.slice(0, i + 1), title.slice(i + 1).trim()];
}

/** Animation d'entrée CSS (jouée sans attendre l'hydratation). */
function enter(delay: number) {
  return {
    className: "animate-in fade-in slide-in-from-bottom-3 fill-mode-both duration-600",
    style: { animationDelay: `${delay}s` },
  };
}

function HeroImage() {
  const main = getImage("hero-main");
  const mobile = getImage("hero-mobile");
  const alt = imageSpec("hero-main")?.alt ?? "";
  if (!main && !mobile) {
    return <SmartImage name="hero-main" icon={Store} className="h-full w-full" priority />;
  }
  return (
    <picture>
      {mobile && main && <source media="(max-width: 767px)" srcSet={mobile} />}
      <img
        src={main ?? mobile}
        alt={alt}
        width={1600}
        height={1200}
        loading="eager"
        fetchPriority="high"
        decoding="sync"
        className="absolute inset-0 h-full w-full object-cover"
      />
    </picture>
  );
}

/**
 * Le tampon tournant : reprend le cercle rouge du logo comme une étiquette de magasin.
 * C'est l'élément signature de la page, il n'apparaît qu'ici.
 */
function Stamp({ className, style }: { className?: string; style?: CSSProperties }) {
  const pathId = `stamp-${useId().replace(/:/g, "")}`;
  return (
    <div
      aria-hidden
      style={style}
      className={cn(
        "grid h-32 w-32 place-items-center rounded-full bg-primary text-primary-foreground shadow-red md:h-40 md:w-40",
        className,
      )}
    >
      <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full animate-spin-slow motion-reduce:animate-none">
        <defs>
          <path id={pathId} d="M100,100 m-76,0 a76,76 0 1,1 152,0 a76,76 0 1,1 -152,0" />
        </defs>
        <text className="fill-current font-display text-[14.5px] font-bold uppercase">
          <textPath href={`#${pathId}`} textLength="474" lengthAdjust="spacing">
            {t.home.heroStamp}
          </textPath>
        </text>
      </svg>
      <div className="relative grid h-[50%] w-[50%] place-items-center rounded-full border-2 border-primary-foreground/70 text-center">
        <div>
          <Stars className="text-primary-foreground" size={8} />
          <p className="mt-1 font-display text-[11px] font-extrabold leading-tight first-letter:uppercase md:text-xs">
            {t.home.statSince}
            <br />
            {site.foundedYear}
          </p>
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  const [lead, rest] = splitTitle(t.home.heroTitle);
  const cats = getCategories();
  const chips = QUICK.map((k) => cats.find((c) => c.icon === k)).filter(
    (c): c is NonNullable<typeof c> => Boolean(c),
  );

  return (
    <section className="relative overflow-hidden bg-background">
      {/* Grand anneau du logo en filigrane, à droite */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[20rem] top-1/2 hidden h-[60rem] w-[60rem] -translate-y-1/2 rounded-full border-[3px] border-primary/15 lg:block"
      />

      <div className="container-x relative grid items-center gap-14 pb-14 pt-8 md:pt-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16 lg:pb-20 lg:pt-16">
        <div className="min-w-0">
          <p {...enter(0)} className={cn(enter(0).className, "flex flex-wrap items-center gap-x-3 gap-y-1 text-sm")}>
            <span lang="ar" dir="rtl" className="font-display text-base font-bold text-primary">
              {site.nameAr}
            </span>
            <span className="h-4 w-px bg-border" aria-hidden />
            <span className="font-medium text-muted-foreground">{t.home.heroEyebrow}</span>
          </p>

          {/* Titre (LCP) : jamais masqué à l'arrivée */}
          <h1 className="mt-5 font-display text-[2.55rem] font-extrabold leading-[0.98] tracking-[-0.035em] text-ink sm:text-6xl xl:text-[5.1rem]">
            <span className="block">{lead}</span>
            {rest && (
              <span className="block">
                {rest.replace(/\.$/, "")}
                <span className="text-primary">.</span>
              </span>
            )}
          </h1>

          <p {...enter(0.1)} className={cn(enter(0.1).className, "mt-6 max-w-[34rem] text-base leading-relaxed text-muted-foreground md:text-lg")}>
            {t.home.heroText}
          </p>

          <div {...enter(0.18)} className={cn(enter(0.18).className, "mt-8 flex flex-col gap-3 sm:flex-row")}>
            <Link to="/boutique" className="btn btn-primary px-7 py-4">
              {t.nav.allProducts}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link to="/a-propos" className="btn btn-outline px-7 py-4">
              {homeCopy.heroCtaSecondary}
            </Link>
          </div>

          {chips.length > 0 && (
            <nav {...enter(0.26)} aria-label={t.home.heroQuickLabel} className={cn(enter(0.26).className, "mt-10")}>
              <p className="text-sm font-semibold text-ink">{t.home.heroQuickLabel}</p>
              <ul className="no-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:px-0">
                {chips.map((c) => {
                  const Icon = categoryIcons[c.icon];
                  return (
                    <li key={c.slug} className="shrink-0">
                      <Link
                        to="/boutique/$category"
                        params={{ category: c.slug }}
                        className="inline-flex items-center gap-2 rounded-full border bg-background px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:border-ink"
                      >
                        <Icon className="h-4 w-4 text-primary" aria-hidden />
                        {c.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          )}
        </div>

        <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
          <div className="animate-in fade-in zoom-in-95 fill-mode-both duration-700">
            <div className="relative aspect-square overflow-hidden rounded-[2.5rem] bg-surface-2 shadow-lift md:aspect-[4/3]">
              <HeroImage />
              <div className="absolute inset-x-4 bottom-4 flex items-center gap-3 rounded-2xl bg-background px-4 py-3 shadow-lift sm:right-auto">
                <Store className="h-5 w-5 shrink-0 text-primary" aria-hidden />
                <div className="min-w-0">
                  <p className="text-sm font-bold leading-tight text-ink">{site.hours.label}</p>
                  <p className="truncate text-xs text-muted-foreground">{site.address.full}</p>
                </div>
              </div>
            </div>
          </div>
          <Stamp
            className="absolute -left-2 -top-8 animate-in fade-in zoom-in-50 fill-mode-both duration-700 md:-left-10 md:-top-12"
            style={{ animationDelay: "0.35s" }}
          />
        </div>
      </div>
    </section>
  );
}

const reassuranceIcons = [Banknote, Truck, ShieldCheck, Store];

/** Bandeau de réassurance pleine largeur, séparé par des filets (pas de cartes). */
export function HomeReassurance() {
  return (
    <div className="border-y bg-surface">
      <ul className="container-x grid grid-cols-2 lg:grid-cols-4">
        {t.reassurance.map((r, i) => {
          const Icon = reassuranceIcons[i] ?? Store;
          return (
            <li
              key={r.title}
              className="flex items-center gap-3 px-3 py-5 even:border-l [&:nth-child(-n+2)]:border-b lg:border-l lg:px-6 lg:py-6 lg:first:border-l-0 lg:first:pl-0 lg:[&:nth-child(-n+2)]:border-b-0"
            >
              <Icon className="h-6 w-6 shrink-0 text-primary" strokeWidth={1.75} aria-hidden />
              <div className="min-w-0">
                <p className="text-sm font-bold leading-tight text-ink">{r.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{r.text}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}