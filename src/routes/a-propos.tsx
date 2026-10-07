import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, HeartHandshake, MapPin, Navigation, Phone, ShieldCheck, Sparkles, Store } from "lucide-react";
import { Crumbs } from "@/components/layout";
import { MapEmbed, Reveal } from "@/components/brand";
import { ShowroomStats } from "@/components/sections/home/showroom";
import { SmartImage } from "@/components/smart-image";
import { site } from "@/config/site";
import { telLink, track } from "@/lib/commerce";
import { breadcrumbLd, pageHead, storeLd } from "@/lib/seo";
import { t } from "@/i18n/fr";

export const Route = createFileRoute("/a-propos")({
  head: () =>
    pageHead({
      title: "Notre showroom à Kénitra — À propos",
      description: `Belle Image, magasin d'électroménager et d'ameublement à Kénitra depuis ${site.foundedYear}. Showroom ${site.address.full}, ouvert ${site.hours.label}.`,
      path: "/a-propos",
      image: "showroom-1",
      jsonLd: [storeLd(), breadcrumbLd([{ name: t.common.home, path: "/" }, { name: t.nav.showroom, path: "/a-propos" }])],
    }),
  component: AboutPage,
});

const values = [
  { icon: HeartHandshake, title: "Le conseil avant tout", text: "Des conseillers qui prennent le temps de comprendre votre besoin et votre budget." },
  { icon: ShieldCheck, title: "Des produits garantis", text: "Garantie constructeur et accompagnement SAV par notre équipe." },
  { icon: Sparkles, title: "Un large choix", text: `${site.brandsCount} grandes marques et ${site.referencesLabel.toLowerCase()}.` },
  { icon: Store, title: "Un vrai showroom", text: "Voir, toucher, comparer avant d'acheter, 7 jours sur 7." },
];

function AboutPage() {
  const years = new Date().getFullYear() - site.foundedYear;
  const roundYears = Math.floor(years / 5) * 5; // 23 → « plus de 20 ans »
  return (
    <>
      {/* Hero : titre à gauche, grande photo du showroom à droite avec l'anneau du logo */}
      <section className="relative overflow-hidden bg-background">
        <div className="container-x pt-6">
          <Crumbs items={[{ label: t.common.home, href: <Link to="/" className="hover:text-primary">{t.common.home}</Link> }, { label: t.nav.showroom }]} />
        </div>
        <div className="container-x grid items-center gap-12 pb-14 pt-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16 lg:pb-20">
          <div className="min-w-0">
            <p className="flex flex-wrap items-center gap-x-3 text-sm">
              <span lang="ar" dir="rtl" className="font-display text-base font-bold text-primary">{site.nameAr}</span>
              <span className="h-4 w-px bg-border" aria-hidden />
              <span className="font-medium text-muted-foreground">{t.nav.showroom}, depuis {site.foundedYear}</span>
            </p>
            <h1 className="mt-5 font-display text-[2.4rem] font-extrabold leading-[1] tracking-[-0.03em] text-ink sm:text-5xl xl:text-[4rem]">
              L'équipement de la maison à Kénitra<span className="text-primary">.</span>
            </h1>
            <p className="mt-6 max-w-[34rem] text-base leading-relaxed text-muted-foreground md:text-lg">
              Depuis {site.foundedYear}, Belle Image accompagne les familles pour équiper leur maison : électroménager, image et ameublement, dans un grand showroom ouvert 7 jours sur 7.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={site.mapLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary px-6 py-3.5">
                <Navigation className="h-4 w-4" aria-hidden />
                {t.common.directions}
              </a>
              <Link to="/boutique" className="btn btn-ink px-6 py-3.5">{t.nav.allProducts}</Link>
            </div>
          </div>
          <div className="relative">
            <div aria-hidden className="absolute -right-8 -top-8 h-[90%] w-[90%] rounded-full border-[3px] border-primary/25 md:-right-12 md:-top-12" />
            <SmartImage name="showroom-1" icon={Store} aspect="4 / 3" className="relative overflow-hidden rounded-[2.5rem] shadow-lift" priority />
            <div className="absolute -bottom-6 left-4 rounded-2xl bg-background px-5 py-4 shadow-lift md:-left-6">
              <p className="tabular font-display text-3xl font-extrabold leading-none text-primary">{years} ans</p>
              <p className="mt-1 text-xs font-medium text-muted-foreground">au service de Kénitra</p>
            </div>
          </div>
        </div>
      </section>

      {/* Histoire */}
      <section className="border-t bg-surface py-16 md:py-24" aria-labelledby="story">
        <div className="container-x grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
          <Reveal className="grid grid-cols-2 gap-3 self-start">
            <SmartImage name="showroom-2" icon={Store} aspect="3 / 4" className="overflow-hidden rounded-3xl" />
            <SmartImage name="showroom-3" icon={Store} aspect="3 / 4" className="mt-10 overflow-hidden rounded-3xl" />
          </Reveal>
          <div className="lg:pt-6">
            <h2 id="story" className="text-3xl font-extrabold text-ink md:text-4xl">Plus de {roundYears} ans à vos côtés</h2>
            <div className="mt-6 max-w-[62ch] space-y-5 text-[1.05rem] leading-relaxed text-ink/85">
              <p>Belle Image a ouvert ses portes à Kénitra en {site.foundedYear}. Depuis, le magasin a grandi avec ses clients, en élargissant son choix et ses services pour équiper toute la maison.</p>
              <p>Aujourd'hui, notre showroom réunit l'électroménager et l'ameublement : froid, lavage, cuisson, TV, climatisation, salons, chambres, salles à manger et rangement.</p>
              <p className="border-l-[3px] border-primary pl-5 font-display text-xl font-bold leading-snug text-ink">
                Des prix clairs, la livraison à domicile et le paiement à la livraison, pour acheter en toute confiance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Chiffres */}
      <section className="relative overflow-hidden bg-ink py-14 text-ink-foreground md:py-20" aria-label="Chiffres clés">
        <div aria-hidden className="absolute -left-32 -top-40 h-[26rem] w-[26rem] rounded-full border-[3px] border-primary/30" />
        <div className="container-x relative max-w-4xl"><ShowroomStats /></div>
      </section>

      {/* Valeurs : liste à filets, pas de cartes */}
      <section className="container-x py-16 md:py-24" aria-labelledby="values">
        <h2 id="values" className="text-3xl font-extrabold text-ink md:text-4xl">Ce qui nous guide</h2>
        <ul className="mt-10 grid border-t sm:grid-cols-2">
          {values.map((v) => (
            <li key={v.title} className="flex gap-5 border-b py-7 sm:odd:pr-8 sm:even:border-l sm:even:pl-8">
              <v.icon className="mt-1 h-7 w-7 shrink-0 text-primary" strokeWidth={1.75} aria-hidden />
              <div>
                <h3 className="text-xl font-extrabold text-ink">{v.title}</h3>
                <p className="mt-2 max-w-md text-muted-foreground">{v.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Visite */}
      <section className="container-x pb-16 md:pb-24" aria-labelledby="visit">
        <div className="grid overflow-hidden rounded-[2rem] border lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
          <div className="p-7 md:p-10">
            <h2 id="visit" className="text-3xl font-extrabold text-ink">{t.home.showroomTitle}</h2>
            <dl className="mt-8 space-y-6 text-sm">
              <div className="flex gap-4">
                <MapPin className="h-5 w-5 shrink-0 text-primary" aria-hidden />
                <div><dt className="font-semibold text-ink">Adresse</dt><dd className="mt-0.5 text-muted-foreground">{site.address.full}, {site.address.country}</dd></div>
              </div>
              <div className="flex gap-4">
                <Clock className="h-5 w-5 shrink-0 text-primary" aria-hidden />
                <div><dt className="font-semibold text-ink">Horaires</dt><dd className="tabular mt-0.5 text-muted-foreground">{site.hours.days}, {site.hours.open} – {site.hours.close}</dd></div>
              </div>
              <div className="flex gap-4">
                <Phone className="h-5 w-5 shrink-0 text-primary" aria-hidden />
                <div><dt className="font-semibold text-ink">Téléphone</dt><dd className="mt-0.5"><a href={telLink} onClick={() => track("phone_click", { location: "about" })} className="tabular font-semibold text-ink hover:text-primary">{site.phone}</a></dd></div>
              </div>
            </dl>
            <div className="mt-10 flex flex-wrap gap-3">
              <a href={site.mapLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary"><Navigation className="h-4 w-4" aria-hidden />{t.common.directions}</a>
              <Link to="/contact" className="btn btn-outline">{t.nav.contact}</Link>
            </div>
          </div>
          <MapEmbed className="min-h-[360px] rounded-none" />
        </div>
      </section>
    </>
  );
}