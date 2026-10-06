import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertCircle, ArrowUpRight, Clock, Mail, MapPin, Navigation, Phone } from "lucide-react";
import { useState } from "react";
import { Crumbs, PageHero, WhatsAppIcon } from "@/components/layout";
import { MapEmbed } from "@/components/brand";
import { site } from "@/config/site";
import { buildContactMessage, isValidMoroccanPhone, telLink, track, waLink } from "@/lib/commerce";
import { breadcrumbLd, pageHead, storeLd } from "@/lib/seo";
import { t } from "@/i18n/fr";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/contact")({
  head: () =>
    pageHead({
      title: "Contact — showroom de Kénitra",
      description: `Contactez Belle Image : ${site.phone}, WhatsApp, showroom ${site.address.full}, ouvert ${site.hours.label}.`,
      path: "/contact",
      jsonLd: [storeLd(), breadcrumbLd([{ name: t.common.home, path: "/" }, { name: t.nav.contact, path: "/contact" }])],
    }),
  component: ContactPage,
});

const subjects = ["Renseignement produit", "Suivi de commande", "Livraison", "Garantie / SAV", "Autre"];

function ContactPage() {
  const [v, setV] = useState({ name: "", phone: "", subject: subjects[0]!, message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const set = (k: keyof typeof v, val: string) => setV((x) => ({ ...x, [k]: val }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (v.name.trim().length < 2) errs["name"] = "Indiquez votre nom.";
    if (v.phone.trim() && !isValidMoroccanPhone(v.phone)) errs["phone"] = t.checkout.errors.phone;
    if (v.message.trim().length < 5) errs["message"] = "Écrivez votre message.";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    track("whatsapp_click", { location: "contact_form", subject: v.subject });
    window.open(waLink(buildContactMessage(v)), "_blank", "noopener,noreferrer");
  };

  const err = (k: string) =>
    errors[k] && (
      <p id={`ct-${k}-error`} className="mt-1.5 flex items-center gap-1 text-xs font-semibold text-destructive">
        <AlertCircle className="h-3.5 w-3.5" aria-hidden />
        {errors[k]}
      </p>
    );
  const aria = (k: string) => ({
    "aria-invalid": Boolean(errors[k]) || undefined,
    "aria-describedby": errors[k] ? `ct-${k}-error` : undefined,
  });

  return (
    <>
      <PageHero
        eyebrow={t.nav.contact}
        title="Parlons de votre projet"
        intro="Une question sur un produit, une commande ou la livraison ? Le plus rapide, c'est WhatsApp."
        crumbs={<Crumbs items={[{ label: t.common.home, href: <Link to="/" className="hover:text-primary">{t.common.home}</Link> }, { label: t.nav.contact }]} />}
      />

      {/* Canaux directs en premier : sur mobile, c'est ce que les gens cherchent */}
      <section className="container-x pt-10" aria-label="Nous joindre directement">
        <ul className="grid gap-3 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <li>
            <a
              href={waLink(t.whatsappDefault)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("whatsapp_click", { location: "contact" })}
              className="group flex h-full items-center gap-4 rounded-3xl bg-whatsapp p-5 text-primary-foreground transition hover:brightness-95 md:p-6"
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-primary-foreground/20">
                <WhatsAppIcon className="h-6 w-6" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium opacity-90">Réponse rapide sur WhatsApp</span>
                <span className="tabular block font-display text-xl font-extrabold">{site.whatsappDisplay}</span>
              </span>
              <ArrowUpRight className="h-5 w-5 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
            </a>
          </li>
          <li>
            <a
              href={telLink}
              onClick={() => track("phone_click", { location: "contact" })}
              className="flex h-full items-center gap-4 rounded-3xl bg-ink p-5 text-ink-foreground transition hover:bg-ink/90 md:p-6"
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-primary">
                <Phone className="h-5 w-5" aria-hidden />
              </span>
              <span className="min-w-0">
                <span className="block text-sm text-ink-muted">Appeler le showroom</span>
                <span className="tabular block font-display text-xl font-extrabold">{site.phone}</span>
              </span>
            </a>
          </li>
          <li>
            <a href={`mailto:${site.email}`} className="flex h-full items-center gap-4 rounded-3xl border p-5 transition hover:border-ink md:p-6">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-surface text-primary">
                <Mail className="h-5 w-5" aria-hidden />
              </span>
              <span className="min-w-0">
                <span className="block text-sm text-muted-foreground">E-mail</span>
                <span className="block break-all font-semibold text-ink">{site.email}</span>
              </span>
            </a>
          </li>
        </ul>
      </section>

      <div className="container-x grid gap-10 py-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-14">
        <form onSubmit={onSubmit} noValidate className="rounded-[2rem] bg-surface p-5 md:p-9" aria-labelledby="ct-title">
          <h2 id="ct-title" className="font-display text-2xl font-extrabold text-ink md:text-3xl">Écrire un message</h2>
          <p className="mt-1 text-sm text-muted-foreground">Votre message s'ouvre dans WhatsApp, prêt à être envoyé.</p>

          <fieldset className="mt-7">
            <legend className="mb-2.5 text-sm font-semibold text-ink">Votre demande concerne</legend>
            <div className="flex flex-wrap gap-2">
              {subjects.map((s) => (
                <label key={s} className="cursor-pointer">
                  <input type="radio" name="ct-subject" value={s} checked={v.subject === s} onChange={() => set("subject", s)} className="peer sr-only" />
                  <span className="inline-flex rounded-full border bg-background px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-ink peer-checked:border-ink peer-checked:bg-ink peer-checked:text-ink-foreground peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring">
                    {s}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="ct-name" className="mb-1.5 block text-sm font-semibold">Nom *</label>
              <input id="ct-name" autoComplete="name" value={v.name} onChange={(e) => set("name", e.target.value)} className={cn("field", errors["name"] && "border-destructive")} {...aria("name")} />
              {err("name")}
            </div>
            <div>
              <label htmlFor="ct-phone" className="mb-1.5 block text-sm font-semibold">Téléphone <span className="font-normal text-muted-foreground">(facultatif)</span></label>
              <input id="ct-phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="06 12 34 56 78" value={v.phone} onChange={(e) => set("phone", e.target.value)} className={cn("field", errors["phone"] && "border-destructive")} {...aria("phone")} />
              {err("phone")}
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="ct-message" className="mb-1.5 block text-sm font-semibold">Message *</label>
              <textarea id="ct-message" rows={5} maxLength={1000} value={v.message} onChange={(e) => set("message", e.target.value)} className={cn("field resize-y", errors["message"] && "border-destructive")} {...aria("message")} />
              <div className="flex justify-between gap-3">
                {err("message") || <span />}
                <span className="tabular mt-1.5 text-xs text-muted-foreground">{v.message.length}/1000</span>
              </div>
            </div>
          </div>
          <button type="submit" className="btn btn-whatsapp mt-6 w-full px-7 py-3.5 sm:w-auto">
            <WhatsAppIcon className="h-4 w-4" />
            Envoyer sur WhatsApp
          </button>
        </form>

        <aside className="space-y-4" aria-label="Le showroom">
          <div className="overflow-hidden rounded-[2rem] border">
            <MapEmbed className="min-h-[280px] rounded-none" />
            <dl className="space-y-5 p-6 text-sm">
              <div className="flex gap-4">
                <MapPin className="h-5 w-5 shrink-0 text-primary" aria-hidden />
                <div><dt className="font-semibold text-ink">Showroom</dt><dd className="mt-0.5 text-muted-foreground">{site.address.full}, {site.address.country}</dd></div>
              </div>
              <div className="flex gap-4">
                <Clock className="h-5 w-5 shrink-0 text-primary" aria-hidden />
                <div><dt className="font-semibold text-ink">Horaires</dt><dd className="mt-0.5 text-muted-foreground">{site.hours.label}</dd></div>
              </div>
            </dl>
            <div className="border-t px-6 py-4">
              <a href={site.mapLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
                <Navigation className="h-4 w-4" aria-hidden />
                {t.common.directions}
              </a>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}