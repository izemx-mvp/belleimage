import { Link } from "@tanstack/react-router";
import { ArrowRight, HeartHandshake, Layers, ShieldCheck, Store, Truck } from "lucide-react";
import { SmartImage } from "@/components/smart-image";
import { site } from "@/config/site";
import { homeCopy } from "@/i18n/home";

const serviceIcons = [HeartHandshake, Truck, ShieldCheck, Layers];

/** Présentation de l'entreprise : la partie "vitrine" de l'accueil. */
export function CompanyBlock() {
  const years = new Date().getFullYear() - site.foundedYear;
  return (
    <section className="relative overflow-hidden bg-surface py-16 md:py-24" aria-labelledby="home-company">
      <div className="container-x grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-20">
        {/* Composition photo : grande image + petite image décalée + pastille années */}
        <div className="relative pb-10 pr-10 sm:pb-14 sm:pr-14">
          <div aria-hidden className="absolute -left-10 -top-10 h-56 w-56 rounded-full border-[3px] border-primary/25" />
          <SmartImage name="showroom-2" icon={Store} aspect="4 / 5" className="relative overflow-hidden rounded-[2rem] shadow-lift" />
          <div className="absolute bottom-0 right-0 w-[48%] overflow-hidden rounded-[1.5rem] border-[6px] border-surface shadow-lift">
            <SmartImage name="showroom-3" icon={Store} aspect="1 / 1" />
          </div>
          <div className="absolute left-5 top-5 rounded-2xl bg-background px-4 py-3 shadow-card">
            <p className="tabular font-display text-3xl font-extrabold leading-none text-primary">{years} ans</p>
            <p className="mt-1 text-xs font-medium text-muted-foreground">depuis {site.foundedYear}</p>
          </div>
        </div>

        <div>
          <p className="flex items-center gap-3 text-sm font-semibold text-primary">
            {homeCopy.companyLabel}
            <span lang="ar" dir="rtl" className="font-display text-base text-ink/40">{site.nameAr}</span>
          </p>
          <h2 id="home-company" className="mt-3 text-3xl font-extrabold leading-[1.05] text-ink md:text-[2.75rem]">
            {homeCopy.companyTitle}
          </h2>
          <p className="mt-5 max-w-[60ch] leading-relaxed text-muted-foreground">{homeCopy.companyText}</p>

          <ul className="mt-9 grid gap-x-8 gap-y-6 border-t pt-8 sm:grid-cols-2">
            {homeCopy.services.map((s, i) => {
              const Icon = serviceIcons[i] ?? Store;
              return (
                <li key={s.title} className="flex gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-background text-primary shadow-card">
                    <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                  </span>
                  <div>
                    <h3 className="font-display text-base font-bold text-ink">{s.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
                  </div>
                </li>
              );
            })}
          </ul>

          <Link to="/a-propos" className="btn btn-ink mt-10">
            {homeCopy.companyCta}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}