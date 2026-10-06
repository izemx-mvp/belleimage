import { Link } from "@tanstack/react-router";
import { Crumbs, PageHero } from "@/components/layout";
import { SampleNote } from "@/components/brand";
import type { LegalSection } from "@/data/legal";
import { t } from "@/i18n/fr";

export function LegalPage({ title, intro, sections }: { title: string; intro: string; sections: LegalSection[] }) {
  return (
    <>
      <PageHero
        title={title}
        intro={intro}
        crumbs={<Crumbs items={[{ label: t.common.home, href: <Link to="/" className="hover:text-primary">{t.common.home}</Link> }, { label: title }]} />}
      >
        <p className="mt-4"><SampleNote>Structure à faire valider — champs À COMPLÉTER</SampleNote></p>
      </PageHero>
      <div className="container-x max-w-3xl py-12">
        <nav aria-label="Sommaire" className="mb-10 rounded-2xl bg-surface p-5">
          <p className="mb-2 text-sm font-bold uppercase tracking-wide">Sommaire</p>
          <ol className="grid gap-1 text-sm sm:grid-cols-2">
            {sections.map((s, i) => <li key={s.title}><a href={`#s-${i}`} className="text-muted-foreground hover:text-primary">{s.title}</a></li>)}
          </ol>
        </nav>
        <div className="space-y-10">
          {sections.map((s, i) => (
            <section key={s.title} id={`s-${i}`} className="scroll-mt-40">
              <h2 className="text-xl font-extrabold text-ink md:text-2xl">{s.title}</h2>
              <div className="mt-3 space-y-2 leading-relaxed text-ink/85">{s.paragraphs.map((p) => <p key={p}>{p}</p>)}</div>
            </section>
          ))}
        </div>
        <p className="mt-12 text-sm text-muted-foreground">Dernière mise à jour : À COMPLÉTER</p>
      </div>
    </>
  );
}
