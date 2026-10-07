import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, BookOpen } from "lucide-react";
import { Crumbs, EmptyState, PageHero } from "@/components/layout";
import { PostCard, formatDate } from "@/components/sections/shared/post-card";
import { SmartImage } from "@/components/smart-image";
import { postCategories, type PostCategory } from "@/data/posts";
import { getPosts } from "@/lib/catalogue";
import { breadcrumbLd, pageHead } from "@/lib/seo";
import { t } from "@/i18n/fr";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/conseils/")({
  validateSearch: (raw: Record<string, unknown>): { cat?: PostCategory } =>
    postCategories.includes(raw["cat"] as PostCategory) ? { cat: raw["cat"] as PostCategory } : {},
  head: () =>
    pageHead({
      title: "Conseils électroménager & ameublement",
      description: "Guides et conseils Belle Image pour bien choisir et entretenir votre électroménager et vos meubles.",
      path: "/conseils",
      image: "blog-choisir-refrigerateur",
      jsonLd: [breadcrumbLd([{ name: t.common.home, path: "/" }, { name: t.nav.advice, path: "/conseils" }])],
    }),
  component: AdvicePage,
});

type Post = ReturnType<typeof getPosts>[number];

/** Article à la une : grande image à gauche, texte à droite. */
function FeaturedPost({ post }: { post: Post }) {
  return (
    <Link
      to="/conseils/$slug"
      params={{ slug: post.slug }}
      className="group grid overflow-hidden rounded-[2rem] bg-surface lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]"
    >
      <div className="relative overflow-hidden">
        <SmartImage
          name={post.image}
          alt={post.title}
          icon={BookOpen}
          aspect="16 / 10"
          className="h-full transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          priority
        />
      </div>
      <div className="flex flex-col justify-center p-7 md:p-10">
        <p className="text-sm font-semibold text-primary">{post.category}</p>
        <h2 className="mt-3 font-display text-2xl font-extrabold leading-tight tracking-[-0.02em] text-ink md:text-[2.1rem]">
          {post.title}
        </h2>
        <p className="mt-4 line-clamp-3 leading-relaxed text-muted-foreground">{post.excerpt}</p>
        <div className="mt-7 flex items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span className="mx-2 inline-block h-1 w-1 rounded-full bg-border align-middle" aria-hidden />
            {post.readMinutes} min de lecture
          </p>
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-ink text-ink-foreground transition-colors group-hover:bg-primary">
            <ArrowUpRight className="h-5 w-5" aria-hidden />
          </span>
        </div>
      </div>
    </Link>
  );
}

function AdvicePage() {
  const { cat } = Route.useSearch();
  const posts = getPosts().filter((p) => !cat || p.category === cat);
  const [featured, ...rest] = posts;
  const chip = (active: boolean) =>
    cn(
      "shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
      active ? "border-ink bg-ink text-ink-foreground" : "bg-background text-ink hover:border-ink",
    );

  return (
    <>
      <PageHero
        eyebrow={t.nav.advice}
        title={t.home.adviceTitle}
        intro="Nos guides pour choisir l'appareil ou le meuble qui vous correspond, et le garder longtemps."
        crumbs={<Crumbs items={[{ label: t.common.home, href: <Link to="/" className="hover:text-primary">{t.common.home}</Link> }, { label: t.nav.advice }]} />}
      >
      </PageHero>

      <div className="container-x py-10 md:py-14">
        <nav aria-label="Catégories d'articles" className="no-scrollbar -mx-4 mb-10 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:px-0">
          <Link to="/conseils" search={{}} className={chip(!cat)} aria-current={!cat ? "page" : undefined}>
            {t.catalogue.all}
          </Link>
          {postCategories.map((c) => (
            <Link key={c} to="/conseils" search={{ cat: c }} className={chip(cat === c)} aria-current={cat === c ? "page" : undefined}>
              {c}
            </Link>
          ))}
        </nav>

        {featured ? (
          <>
            <FeaturedPost post={featured} />
            {rest.length > 0 && (
              <div className="mt-12">
                <h2 className="mb-6 text-2xl font-extrabold text-ink">Tous les articles</h2>
                <div className="grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
                  {rest.map((p) => <PostCard key={p.slug} post={p} />)}
                </div>
              </div>
            )}
          </>
        ) : (
          <EmptyState title="Aucun article dans cette catégorie pour le moment" />
        )}
      </div>
    </>
  );
}