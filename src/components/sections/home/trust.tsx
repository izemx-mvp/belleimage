import { Link } from "@tanstack/react-router";
import { ArrowRight, Banknote, ClipboardList, Quote, Sofa } from "lucide-react";
import { SampleNote, SectionTitle, Stars } from "@/components/brand";
import { WhatsAppIcon } from "@/components/layout";
import { SmartImage } from "@/components/smart-image";
import { sampleReviews } from "@/data/reviews";
import { getBrands } from "@/lib/catalogue";
import { track, waLink } from "@/lib/commerce";
import { t } from "@/i18n/fr";

/** Mur de marques : une seule grille à filets (pas de cartes séparées). */
export function BrandsWall() {
  const brands = getBrands();
  return (
    <section className="container-x py-16 md:py-24" aria-labelledby="home-brands">
      <SectionTitle
        title={t.home.brandsTitle}
        id="home-brands"
        action={
          <Link to="/marques" className="text-sm font-semibold text-primary hover:underline">
            {t.home.brandsCta}
          </Link>
        }
      />
      <ul className="grid grid-cols-3 gap-px overflow-hidden rounded-2xl border bg-border sm:grid-cols-5">
        {brands.map((b) => (
          <li key={b.slug} className="bg-background">
            <Link
              to="/marques/$brand"
              params={{ brand: b.slug }}
              className="grid h-20 place-items-center px-2 text-center font-display text-sm font-bold tracking-tight text-ink/35 transition-colors hover:bg-surface hover:text-ink md:h-28 md:text-lg"
            >
              {b.name}
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-muted-foreground">{t.home.brandsNote}</p>
    </section>
  );
}

const stepIcons = [ClipboardList, WhatsAppIcon, Banknote];

/**
 * Commander en 3 étapes : c'est une vraie séquence, d'où la numérotation
 * et le fil pointillé qui relie les étapes (horizontal dès md).
 */
export function HowToOrder() {
  return (
    <section className="bg-surface py-16 md:py-24" aria-labelledby="home-how">
      <div className="container-x grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,2fr)] lg:gap-16">
        <div>
          <h2 id="home-how" className="text-3xl font-extrabold text-ink md:text-4xl">
            {t.home.howTitle}
          </h2>
          <a
            href={waLink(t.whatsappDefault)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("whatsapp_click", { location: "home_how" })}
            className="btn btn-whatsapp mt-6"
          >
            <WhatsAppIcon className="h-5 w-5" />
            {t.common.writeWhatsapp}
          </a>
        </div>

        <ol className="relative grid gap-10 md:grid-cols-3 md:gap-6 md:before:absolute md:before:left-7 md:before:right-[calc((100%_-_3rem)/3_-_1.75rem)] md:before:top-7 md:before:border-t-2 md:before:border-dashed md:before:border-primary/35">
          {t.home.howSteps.map((s, i) => {
            const Icon = stepIcons[i] ?? ClipboardList;
            return (
              <li key={s.title} className="relative flex gap-5 md:block">
                <span className="relative z-10 grid h-14 w-14 shrink-0 place-items-center rounded-full bg-primary font-display text-xl font-extrabold text-primary-foreground shadow-red ring-8 ring-surface">
                  {i + 1}
                </span>
                <div className="md:mt-6">
                  <h3 className="flex items-center gap-2 text-lg font-extrabold text-ink">
                    <Icon className="h-5 w-5 shrink-0 text-primary" aria-hidden />
                    <span className="sr-only">Étape {i + 1} : </span>
                    {s.title}
                  </h3>
                  <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">{s.text}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

/** Un avis mis en avant, deux plus discrets. */
export function Reviews() {
  const [first, ...others] = sampleReviews;
  if (!first) return null;
  return (
    <section className="bg-surface py-16 md:py-24" aria-labelledby="home-reviews">
      <div className="container-x">
        <SectionTitle title={t.home.reviewsTitle} id="home-reviews" />
        <p className="-mt-4 mb-8">
          <SampleNote>{t.home.reviewsNote}</SampleNote>
        </p>
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          <figure className="relative flex flex-col justify-between overflow-hidden rounded-3xl bg-ink p-7 text-ink-foreground md:p-10">
            <Quote className="absolute -right-2 -top-2 h-32 w-32 text-primary/25" aria-hidden />
            <div className="relative">
              <Stars size={18} />
              <blockquote className="mt-6 font-display text-2xl font-bold leading-snug tracking-[-0.01em] md:text-3xl">
                {first.text}
              </blockquote>
            </div>
            <figcaption className="relative mt-8 text-sm">
              <p className="font-semibold">{first.name}</p>
              <p className="text-ink-muted">
                {first.city}, {first.product}
              </p>
            </figcaption>
          </figure>
          <div className="grid gap-4">
            {others.slice(0, 2).map((r) => (
              <figure key={r.name} className="rounded-3xl border bg-background p-6 md:p-7">
                <Stars size={14} />
                <blockquote className="mt-4 text-ink/85">{r.text}</blockquote>
                <figcaption className="mt-5 text-sm">
                  <p className="font-semibold text-ink">{r.name}</p>
                  <p className="text-muted-foreground">
                    {r.city}, {r.product}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/** Bannière ameublement : texte à gauche sur fond clair, image à droite. */
export function FurnitureBanner() {
  return (
    <section className="container-x pb-16 md:pb-24" aria-labelledby="home-furniture">
      <Link
        to="/boutique"
        search={{ pillar: "ameublement" }}
        className="group grid overflow-hidden rounded-3xl bg-surface-2 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]"
      >
        <div className="flex flex-col justify-center p-7 md:p-12">
          <p className="text-sm font-semibold text-primary">{t.home.furnitureEyebrow}</p>
          <h2 id="home-furniture" className="mt-2 max-w-md text-3xl font-extrabold leading-[1.05] text-ink md:text-[2.6rem]">
            {t.home.furnitureTitle}
          </h2>
          <span className="btn btn-ink mt-7 w-fit">
            {t.home.furnitureCta}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
          </span>
        </div>
        <div className="relative min-h-[240px] overflow-hidden md:min-h-[360px]">
          <div className="absolute inset-0">
            <SmartImage
              name="promo-banner-ameublement"
              icon={Sofa}
              className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
          </div>
        </div>
      </Link>
    </section>
  );
}