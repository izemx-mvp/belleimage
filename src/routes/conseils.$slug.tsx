import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowUpRight, BookOpen, Store } from "lucide-react";
import { Crumbs, WhatsAppIcon } from "@/components/layout";
import { SampleNote, SectionTitle } from "@/components/brand";
import { ProductGrid } from "@/components/product";
import { PostCard, formatDate } from "@/components/sections/shared/post-card";
import { SmartImage } from "@/components/smart-image";
import { site } from "@/config/site";
import { getCategory, getPost, getPosts, getProductsInCategory } from "@/lib/catalogue";
import { track, waLink } from "@/lib/commerce";
import { getImage } from "@/lib/images";
import { breadcrumbLd, pageHead } from "@/lib/seo";
import { t } from "@/i18n/fr";

export const Route = createFileRoute("/conseils/$slug")({
  loader: ({ params }) => {
    if (!getPost(params.slug)) throw notFound();
    return { slug: params.slug };
  },
  head: ({ params }) => {
    const p = getPost(params.slug);
    if (!p) return {};
    const img = getImage(p.image);
    return pageHead({
      title: p.title,
      description: p.excerpt,
      path: `/conseils/${p.slug}`,
      image: p.image,
      type: "article",
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: p.title,
          description: p.excerpt,
          datePublished: p.date,
          author: { "@type": "Organization", name: site.name },
          publisher: { "@type": "Organization", name: site.name },
          ...(img ? { image: `${site.url}${img}` } : {}),
        },
        breadcrumbLd([{ name: t.common.home, path: "/" }, { name: t.nav.advice, path: "/conseils" }, { name: p.title, path: `/conseils/${p.slug}` }]),
      ],
    });
  },
  component: ArticlePage,
});

function ArticlePage() {
  const { slug } = Route.useLoaderData();
  const post = getPost(slug)!;
  const cat = getCategory(post.relatedCategory);
  const products = getProductsInCategory(post.relatedCategory, 4);
  const others = getPosts().filter((p) => p.slug !== post.slug).slice(0, 3);
  const waMessage = `Bonjour Belle Image, j'ai lu votre article « ${post.title} » et j'aimerais un conseil.`;

  return (
    <article>
      <header className="container-x max-w-5xl pt-6">
        <Crumbs
          items={[
            { label: t.common.home, href: <Link to="/" className="hover:text-primary">{t.common.home}</Link> },
            { label: t.nav.advice, href: <Link to="/conseils" className="hover:text-primary">{t.nav.advice}</Link> },
            { label: post.title },
          ]}
        />
        <div className="mx-auto mt-10 max-w-3xl text-center">
          <Link to="/conseils" search={{ cat: post.category }} className="text-sm font-semibold text-primary hover:underline">
            {post.category}
          </Link>
          <h1 className="mt-4 font-display text-[2.1rem] font-extrabold leading-[1.05] tracking-[-0.03em] text-ink md:text-[3.2rem]">
            {post.title}
          </h1>
          <p className="mt-5 text-sm text-muted-foreground">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span className="mx-2 inline-block h-1 w-1 rounded-full bg-border align-middle" aria-hidden />
            {post.readMinutes} min de lecture
          </p>
        </div>
        <SmartImage name={post.image} alt={post.title} icon={BookOpen} aspect="16 / 8" className="mt-10 overflow-hidden rounded-[2rem]" priority />
      </header>

      <div className="container-x grid max-w-5xl gap-12 py-12 md:py-16 lg:grid-cols-[minmax(0,1fr)_17rem] lg:gap-14">
        <div className="min-w-0">
          <p className="text-xl font-medium leading-relaxed text-ink md:text-[1.35rem]">{post.excerpt}</p>
          <div className="mt-8 max-w-[68ch] space-y-7 text-[1.06rem] leading-[1.75] text-ink/85">
            {post.body.map((b, i) => (
              <section key={i}>
                {b.heading && <h2 className="mb-3 text-2xl font-extrabold leading-tight text-ink">{b.heading}</h2>}
                <p>{b.text}</p>
              </section>
            ))}
          </div>
          <p className="mt-10"><SampleNote>Article exemple à compléter</SampleNote></p>
        </div>

        {/* Colonne d'aide : reste visible pendant la lecture sur grand écran */}
        <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start" aria-label="Besoin d'aide">
          <div className="rounded-3xl bg-ink p-6 text-ink-foreground">
            <p className="font-display text-xl font-extrabold leading-tight">Un doute avant d'acheter ?</p>
            <p className="mt-2 text-sm text-ink-muted">Nos conseillers vous répondent sur WhatsApp, 7 jours sur 7.</p>
            <a
              href={waLink(waMessage)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("whatsapp_click", { location: "article_aside", article: post.slug })}
              className="btn btn-whatsapp mt-5 w-full"
            >
              <WhatsAppIcon className="h-4 w-4" />
              {t.common.writeWhatsapp}
            </a>
          </div>
          {cat && (
            <Link
              to="/boutique/$category"
              params={{ category: cat.slug }}
              className="group flex items-center justify-between gap-3 rounded-3xl border p-5 transition-colors hover:border-ink"
            >
              <span>
                <span className="block text-xs text-muted-foreground">Voir les produits</span>
                <span className="block font-display text-lg font-bold text-ink">{cat.name}</span>
              </span>
              <ArrowUpRight className="h-5 w-5 text-primary transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
            </Link>
          )}
          <Link to="/a-propos" className="flex items-center gap-3 rounded-3xl bg-surface p-5 text-sm transition-colors hover:bg-surface-2">
            <Store className="h-5 w-5 shrink-0 text-primary" aria-hidden />
            <span>
              <span className="block font-semibold text-ink">Venir au showroom</span>
              <span className="text-muted-foreground">{site.hours.label}</span>
            </span>
          </Link>
        </aside>
      </div>

      {products.length > 0 && (
        <section className="bg-surface py-16 md:py-20" aria-labelledby="article-products">
          <div className="container-x">
            <SectionTitle
              title="Les produits de l'article"
              id="article-products"
              action={
                cat && (
                  <Link to="/boutique/$category" params={{ category: cat.slug }} className="text-sm font-semibold text-primary hover:underline">
                    {t.common.seeAll}
                  </Link>
                )
              }
            />
            <ProductGrid products={products} />
          </div>
        </section>
      )}

      {others.length > 0 && (
        <section className="container-x py-16 md:py-20" aria-labelledby="more-posts">
          <SectionTitle title="À lire aussi" id="more-posts" />
          <div className="grid gap-x-5 gap-y-8 md:grid-cols-3">
            {others.map((p) => <PostCard key={p.slug} post={p} />)}
          </div>
        </section>
      )}
    </article>
  );
}