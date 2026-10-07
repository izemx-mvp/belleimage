import { Link } from "@tanstack/react-router";
import { ArrowRight, Banknote, ClipboardList, Quote, Sofa, Facebook } from "lucide-react";
import { SectionTitle, Stars } from "@/components/brand";
import { WhatsAppIcon } from "@/components/layout";
import { SmartImage } from "@/components/smart-image";
import { getBrands } from "@/lib/catalogue";
import { track, waLink } from "@/lib/commerce";
import { site } from "@/config/site";
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
      <ul className="grid grid-cols-3 gap-px overflow-hidden rounded-2xl border bg-border sm:grid-cols-4">
        {brands.map((b) => (
          <li key={b.slug} className="bg-background">
            <Link
              to="/marques/$brand"
              params={{ brand: b.slug }}
              aria-label={b.name}
              className="grid h-20 place-items-center px-4 transition-colors hover:bg-surface md:h-28 md:px-8"
            >
              <img src={b.logo} alt={b.name} loading="lazy" className="max-h-9 w-full object-contain opacity-80 grayscale transition hover:opacity-100 hover:grayscale-0 md:max-h-12" />
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

/**
 * Avis clients : renvoi vers la page Facebook du magasin, où se trouvent les vrais avis.
 * (Aucun avis n'est inventé sur le site.)
 */
export function Reviews() {
  return (
    <section className="bg-surface py-16 md:py-24" aria-labelledby="home-reviews">
      <div className="container-x">
        <div className="relative overflow-hidden rounded-3xl bg-ink p-7 text-ink-foreground md:p-12">
          <Quote className="absolute -right-2 -top-2 h-32 w-32 text-primary/25" aria-hidden />
          <div className="relative max-w-2xl">
            <Stars size={18} />
            <h2 id="home-reviews" className="mt-5 text-3xl font-extrabold md:text-4xl">{t.home.reviewsTitle}</h2>
            <p className="mt-3 text-ink-muted">{t.home.reviewsText}</p>
            <a href={site.social.facebook} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-7">
              <Facebook className="h-4 w-4" aria-hidden />{t.home.reviewsCta}
            </a>
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