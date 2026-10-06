import { Link } from "@tanstack/react-router";
import { Phone } from "lucide-react";
import { SectionTitle, Stagger, Stars } from "@/components/brand";
import { WhatsAppIcon } from "@/components/layout";
import { FaqList } from "@/components/sections/shared/faq-list";
import { PostCard } from "@/components/sections/shared/post-card";
import { site } from "@/config/site";
import { homeFaq } from "@/data/faq";
import { getLatestPosts } from "@/lib/catalogue";
import { telLink, track, waLink } from "@/lib/commerce";
import { t } from "@/i18n/fr";

export function Advice() {
  return (
    <section className="container-x py-16 md:py-24" aria-labelledby="home-advice">
      <SectionTitle
        title={t.home.adviceTitle}
        id="home-advice"
        action={
          <Link to="/conseils" className="text-sm font-semibold text-primary hover:underline">
            {t.common.seeAll}
          </Link>
        }
      />
      <Stagger className="grid gap-4 md:grid-cols-3">
        {getLatestPosts(3).map((p) => (
          <PostCard key={p.slug} post={p} />
        ))}
      </Stagger>
    </section>
  );
}

export function HomeFaq() {
  return (
    <section className="bg-surface py-16 md:py-24" aria-labelledby="home-faq">
      <div className="container-x grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <h2 id="home-faq" className="text-3xl font-extrabold text-ink md:text-4xl">
            {t.home.faqTitle}
          </h2>
          <Link to="/faq" className="btn btn-outline mt-6">
            {t.home.faqCta}
          </Link>
        </div>
        <FaqList items={homeFaq} idPrefix="home-faq" />
      </div>
    </section>
  );
}

export function FinalCta() {
  return (
    <section className="container-x py-16 md:py-24" aria-labelledby="home-final">
      <div className="relative overflow-hidden rounded-[2rem] bg-primary px-6 py-14 text-center text-primary-foreground md:px-12 md:py-20">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full border-[3px] border-primary-foreground/25" aria-hidden />
        <div className="absolute -bottom-32 -right-20 h-96 w-96 rounded-full border-[3px] border-primary-foreground/20" aria-hidden />
        <div className="relative">
          <Stars className="text-primary-foreground" size={16} />
          <h2 id="home-final" className="mx-auto mt-5 max-w-2xl text-3xl font-extrabold leading-[1.05] md:text-5xl">
            {t.home.finalTitle}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-primary-foreground">{t.home.finalText}</p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href={waLink(t.whatsappDefault)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("whatsapp_click", { location: "home_final" })}
              className="btn bg-background px-6 text-ink hover:bg-surface"
            >
              <WhatsAppIcon className="h-5 w-5 text-whatsapp" />
              {t.common.writeWhatsapp}
            </a>
            <a
              href={telLink}
              onClick={() => track("phone_click", { location: "home_final" })}
              className="btn border-[1.5px] border-primary-foreground/40 px-6 text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Phone className="h-4 w-4" aria-hidden />
              <span className="tabular">{site.phone}</span>
            </a>
            <Link to="/promotions" className="btn btn-ink px-6">
              {t.home.finalPromos}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}