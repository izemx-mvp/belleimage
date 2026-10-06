import { Link } from "@tanstack/react-router";
import { Clock, MapPin, Navigation, Phone, Store } from "lucide-react";
import { CountUp, MapEmbed } from "@/components/brand";
import { SmartImage } from "@/components/smart-image";
import { site } from "@/config/site";
import { telLink, track } from "@/lib/commerce";
import { t } from "@/i18n/fr";

/** Chiffres clés avec compteur animé (réutilisé sur l'accueil et À propos). */
export function ShowroomStats({ light = true }: { light?: boolean }) {
  const years = new Date().getFullYear() - site.foundedYear;
  const muted = light ? "text-ink-muted" : "text-muted-foreground";
  return (
    <dl className="grid grid-cols-3 gap-3">
      <div className="flex flex-col">
        <dt className={`order-2 text-xs ${muted}`}>{t.home.statYears}</dt>
        <dd className="order-1 font-display text-3xl font-extrabold text-primary md:text-4xl">
          <CountUp to={years} prefix="+" />
        </dd>
        <dd className={`order-3 text-[11px] ${muted}`}>
          {t.home.statSince} {site.foundedYear}
        </dd>
      </div>
      <div className="flex flex-col">
        <dt className={`order-2 text-xs ${muted}`}>{t.home.statBrands}</dt>
        <dd className="order-1 font-display text-3xl font-extrabold text-primary md:text-4xl">
          <CountUp to={site.brandsCount} prefix="~" />
        </dd>
      </div>
      <div className="flex flex-col">
        <dt className={`order-2 text-xs ${muted}`}>{t.home.statRefs}</dt>
        <dd className="order-1 font-display text-3xl font-extrabold text-primary md:text-4xl">
          <CountUp to={site.referencesCount} prefix="+" />
        </dd>
        <dd className={`order-3 text-[11px] ${muted}`}>{t.home.statRefsNote}</dd>
      </div>
    </dl>
  );
}

export function ShowroomBlock() {
  return (
    <section className="relative overflow-hidden bg-ink py-16 text-ink-foreground md:py-24" aria-labelledby="home-showroom">
      {/* Anneau du logo, rappel discret du hero */}
      <div className="absolute -right-40 -top-40 h-[30rem] w-[30rem] rounded-full border-[3px] border-primary/30" aria-hidden />
      <div className="container-x relative grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-16">
        <div>
          <p className="text-sm font-semibold text-primary">{t.home.showroomEyebrow}</p>
          <h2 id="home-showroom" className="mt-3 text-4xl font-extrabold leading-[1.02] md:text-5xl">
            {t.home.showroomTitle}
          </h2>
          <p className="mt-5 max-w-lg leading-relaxed text-ink-muted">{t.home.showroomText}</p>

          <ul className="mt-8 space-y-4 text-sm">
            <li className="flex gap-3">
              <MapPin className="h-5 w-5 shrink-0 text-primary" aria-hidden />
              {site.address.full}
            </li>
            <li className="flex gap-3">
              <Clock className="h-5 w-5 shrink-0 text-primary" aria-hidden />
              {site.hours.label}
            </li>
            <li className="flex gap-3">
              <Phone className="h-5 w-5 shrink-0 text-primary" aria-hidden />
              <a
                href={telLink}
                onClick={() => track("phone_click", { location: "home_showroom" })}
                className="tabular font-semibold hover:text-primary"
              >
                {site.phone}
              </a>
            </li>
          </ul>

          <div className="mt-10 border-t border-ink-foreground/10 pt-8">
            <ShowroomStats />
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link to="/a-propos" className="btn btn-primary">
              {t.home.showroomCta}
            </Link>
            <a href={site.mapLink} target="_blank" rel="noopener noreferrer" className="btn btn-ghost-light">
              <Navigation className="h-4 w-4" aria-hidden />
              {t.common.directions}
            </a>
          </div>
        </div>

        {/* Mosaïque : une grande photo, deux petites, la carte en bas */}
        <div className="grid grid-cols-2 gap-3">
          <SmartImage name="showroom-1" icon={Store} aspect="16 / 10" className="col-span-2 overflow-hidden rounded-2xl" />
          <SmartImage name="showroom-2" icon={Store} aspect="4 / 3" className="overflow-hidden rounded-2xl" />
          <SmartImage name="showroom-3" icon={Store} aspect="4 / 3" className="overflow-hidden rounded-2xl" />
          <div className="col-span-2 h-56 overflow-hidden rounded-2xl md:h-64">
            <MapEmbed className="min-h-0" />
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Bandeau chiffres : photo du showroom en fond assombri, chiffres clés par-dessus.
 * Remplace ShowroomBlock sur l'accueil (adresse, horaires et itinéraire sont dans "Deux façons d'acheter").
 */
export function ShowroomBand() {
  return (
    <section className="relative isolate overflow-hidden bg-ink py-20 text-ink-foreground md:py-28" aria-labelledby="home-band">
      <div className="absolute inset-0 -z-10 opacity-35">
        <SmartImage name="showroom-1" icon={Store} alt="" className="h-full w-full" />
      </div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/85 to-ink/40" aria-hidden />
      <div aria-hidden className="absolute -bottom-40 -right-40 -z-10 h-[30rem] w-[30rem] rounded-full border-[3px] border-primary/40" />
      <div className="container-x grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-end">
        <div>
          <h2 id="home-band" className="max-w-lg text-3xl font-extrabold leading-[1.05] md:text-[2.75rem]">
            {t.home.showroomTitle}
          </h2>
          <p className="mt-4 max-w-md leading-relaxed text-ink-muted">{t.home.showroomText}</p>
          <Link to="/a-propos" className="btn btn-primary mt-8">{t.home.showroomCta}</Link>
        </div>
        <div className="rounded-[1.75rem] border border-ink-foreground/15 bg-ink/60 p-6 md:p-8">
          <ShowroomStats />
        </div>
      </div>
    </section>
  );
}