import { Link } from "@tanstack/react-router";
import { ArrowRight, Refrigerator, Sofa } from "lucide-react";
import { categoryIcons } from "@/components/brand";
import { SmartImage } from "@/components/smart-image";
import type { IconKey } from "@/data/categories";
import { countInCategory, getCategories } from "@/lib/catalogue";
import { cn } from "@/lib/utils";
import { t } from "@/i18n/fr";
import { homeCopy } from "@/i18n/home";

type Pillar = "electromenager" | "ameublement";

/** Rattachement des catégories à leur univers, via l'icône (indépendant des slugs). */
const PILLAR_ICONS: Record<Pillar, IconKey[]> = {
  electromenager: ["fridge", "washer", "oven", "tv", "ac", "blender"],
  ameublement: ["sofa", "bed", "dining", "wardrobe"],
};

function Universe({ pillar, reverse }: { pillar: Pillar; reverse?: boolean }) {
  const copy = homeCopy.universes[pillar];
  const cats = getCategories().filter((c) => PILLAR_ICONS[pillar].includes(c.icon));
  const total = cats.reduce((n, c) => n + countInCategory(c.slug), 0);
  const PillarIcon = pillar === "electromenager" ? Refrigerator : Sofa;

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,2fr)] lg:gap-5">
      {/* Carte de l'univers */}
      <Link
        to="/boutique"
        search={{ pillar }}
        className={cn(
          "group relative flex min-h-[340px] flex-col justify-end overflow-hidden rounded-[2rem] bg-ink p-7 text-ink-foreground md:p-8",
          reverse && "lg:order-2",
        )}
      >
        <div className="absolute inset-0">
          <SmartImage
            name={copy.image}
            alt=""
            icon={PillarIcon}
            className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/0" aria-hidden />
        <div className="relative">
          <p className="tabular text-sm font-medium text-ink-foreground/75">{t.common.products(total)}</p>
          <h3 className="mt-1 font-display text-4xl font-extrabold tracking-[-0.03em] md:text-5xl">{copy.title}</h3>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-foreground/80">{copy.text}</p>
          <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold">
            {copy.cta}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
          </span>
        </div>
      </Link>

      {/* Ses catégories */}
      <ul
        className={cn(
          "grid grid-cols-2 gap-3 sm:gap-4",
          cats.length > 4 ? "md:grid-cols-3" : "md:grid-cols-2",
          reverse && "lg:order-1",
        )}
      >
        {cats.map((c) => {
          const Icon = categoryIcons[c.icon];
          return (
            <li key={c.slug}>
              <Link
                to="/boutique/$category"
                params={{ category: c.slug }}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-background transition-colors hover:border-ink"
              >
                <div className={cn("overflow-hidden bg-surface-2", cats.length > 4 ? "aspect-[4/3]" : "aspect-[16/10]")}>
                  <SmartImage
                    name={c.image}
                    alt={c.name}
                    icon={Icon}
                    className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                  />
                </div>
                <div className="flex flex-1 items-center justify-between gap-2 px-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate font-display text-[0.95rem] font-bold text-ink md:text-base">{c.name}</p>
                    <p className="tabular text-xs text-muted-foreground">{t.common.products(countInCategory(c.slug))}</p>
                  </div>
                  <Icon className="h-5 w-5 shrink-0 text-primary/70 transition-colors group-hover:text-primary" aria-hidden />
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** "Deux univers" : chaque univers a sa carte vitrine + la grille de ses catégories. */
export function ShopByUniverse() {
  return (
    <section className="container-x py-16 md:py-24" aria-labelledby="home-universes">
      <div className="mb-10 grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-end">
        <h2 id="home-universes" className="text-3xl font-extrabold leading-[1.05] text-ink md:text-[2.75rem]">
          {homeCopy.universesTitle}
        </h2>
        <p className="max-w-md text-muted-foreground md:justify-self-end">{homeCopy.universesIntro}</p>
      </div>
      <div className="space-y-5 md:space-y-6">
        <Universe pillar="electromenager" />
        <Universe pillar="ameublement" reverse />
      </div>
    </section>
  );
}

/** Ancien nom conservé pour ne rien casser ailleurs. */
export const ShopByCategory = ShopByUniverse;