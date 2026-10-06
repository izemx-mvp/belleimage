import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, Clock, MapPin, Navigation } from "lucide-react";
import { WhatsAppIcon } from "@/components/layout";
import { site } from "@/config/site";
import { track, waLink } from "@/lib/commerce";
import { t } from "@/i18n/fr";
import { homeCopy } from "@/i18n/home";

/**
 * Le pont entre la vitrine et la boutique : acheter en ligne (3 étapes, paiement à la livraison)
 * ou au showroom. Les étapes en ligne sont une vraie séquence, d'où la numérotation.
 */
export function WaysToBuy() {
  return (
    <section className="container-x py-16 md:py-24" aria-labelledby="home-ways">
      <div className="mb-10 grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-end">
        <h2 id="home-ways" className="text-3xl font-extrabold leading-[1.05] text-ink md:text-[2.75rem]">
          {homeCopy.waysTitle}
        </h2>
        <p className="max-w-md text-muted-foreground md:justify-self-end">{homeCopy.waysIntro}</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 lg:gap-5">
        {/* En ligne */}
        <div className="relative flex flex-col overflow-hidden rounded-[2rem] bg-ink p-7 text-ink-foreground md:p-10">
          <div aria-hidden className="absolute -right-24 -top-24 h-64 w-64 rounded-full border-[3px] border-primary/40" />
          <div className="relative">
            <p className="text-sm font-semibold text-primary">{homeCopy.online.title}</p>
            <h3 className="mt-2 font-display text-2xl font-extrabold leading-tight md:text-3xl">{homeCopy.online.subtitle}</h3>
          </div>
          <ol className="relative mt-8 flex-1 space-y-6 before:absolute before:bottom-6 before:left-[1.1rem] before:top-6 before:border-l-2 before:border-dashed before:border-primary/40">
            {t.home.howSteps.map((s, i) => (
              <li key={s.title} className="relative flex gap-4">
                <span className="relative z-10 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary font-display text-sm font-extrabold ring-[6px] ring-ink">
                  {i + 1}
                </span>
                <div className="pt-1">
                  <p className="font-bold">
                    <span className="sr-only">Étape {i + 1} : </span>
                    {s.title}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-ink-muted">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="relative mt-9 flex flex-wrap gap-3">
            <Link to="/boutique" className="btn btn-primary">
              {homeCopy.online.cta}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <a
              href={waLink(t.whatsappDefault)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("whatsapp_click", { location: "home_ways" })}
              className="btn btn-ghost-light"
            >
              <WhatsAppIcon className="h-4 w-4" />
              WhatsApp
            </a>
          </div>
        </div>

        {/* Au showroom */}
        <div className="flex flex-col rounded-[2rem] border-2 border-ink/10 bg-background p-7 md:p-10">
          <p className="text-sm font-semibold text-primary">{homeCopy.store.title}</p>
          <h3 className="mt-2 font-display text-2xl font-extrabold leading-tight text-ink md:text-3xl">{homeCopy.store.subtitle}</h3>
          <ul className="mt-8 flex-1 space-y-4">
            {homeCopy.store.points.map((p) => (
              <li key={p} className="flex gap-3">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary-soft text-primary">
                  <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden />
                </span>
                <span className="text-ink/85">{p}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-8 grid gap-4 rounded-2xl bg-surface p-5 text-sm sm:grid-cols-2">
            <div className="flex gap-3">
              <MapPin className="h-5 w-5 shrink-0 text-primary" aria-hidden />
              <div>
                <dt className="font-semibold text-ink">Adresse</dt>
                <dd className="mt-0.5 text-muted-foreground">{site.address.full}</dd>
              </div>
            </div>
            <div className="flex gap-3">
              <Clock className="h-5 w-5 shrink-0 text-primary" aria-hidden />
              <div>
                <dt className="font-semibold text-ink">Horaires</dt>
                <dd className="mt-0.5 text-muted-foreground">{site.hours.label}</dd>
              </div>
            </div>
          </dl>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={site.mapLink} target="_blank" rel="noopener noreferrer" className="btn btn-ink">
              <Navigation className="h-4 w-4" aria-hidden />
              {t.common.directions}
            </a>
            <Link to="/a-propos" className="btn btn-outline">{homeCopy.store.cta}</Link>
          </div>
        </div>
      </div>
    </section>
  );
}