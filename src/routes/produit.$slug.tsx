import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";
import { useEffect } from "react";
import { Crumbs } from "@/components/layout";
import { Reassurance, SectionTitle } from "@/components/brand";
import { Price, ProductGrid } from "@/components/product";
import { BuyBox } from "@/components/sections/product/buy-box";
import { Gallery } from "@/components/sections/product/gallery";
import { ProductTabs } from "@/components/sections/product/product-tabs";
import { brandName, getBoughtTogether, getCategory, getProductBySlug, getRelated, getSubcategory } from "@/lib/catalogue";
import { formatPrice, track } from "@/lib/commerce";
import { breadcrumbLd, pageHead, productLd } from "@/lib/seo";
import { useShop } from "@/store/shop";
import { t } from "@/i18n/fr";

export const Route = createFileRoute("/produit/$slug")({
  loader: ({ params }) => {
    const p = getProductBySlug(params.slug);
    if (!p) throw notFound();
    return { slug: p.slug };
  },
  head: ({ params }) => {
    const p = getProductBySlug(params.slug);
    if (!p) return {};
    const c = getCategory(p.category);
    return pageHead({
      title: `${p.name} — ${formatPrice(p.price).replace(/\u00a0/g, " ")}`,
      description: `${p.name} (${p.specLine}) à ${formatPrice(p.price).replace(/\u00a0/g, " ")} chez Belle Image Kénitra. Livraison à domicile, paiement à la livraison, ${p.warranty.toLowerCase()}.`,
      path: `/produit/${p.slug}`,
      image: p.image,
      type: "product",
      jsonLd: [
        productLd(p),
        breadcrumbLd([
          { name: t.common.home, path: "/" },
          { name: t.common.shop, path: "/boutique" },
          ...(c ? [{ name: c.name, path: `/boutique/${c.slug}` }] : []),
          { name: p.name, path: `/produit/${p.slug}` },
        ]),
      ],
    });
  },
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useLoaderData();
  const p = getProductBySlug(slug)!;
  const c = getCategory(p.category);
  const sub = getSubcategory(p.category, p.subcategory);
  const { add } = useShop();
  const related = getRelated(p);
  const together = getBoughtTogether(p);

  useEffect(() => {
    track("view_item", { currency: "MAD", value: p.price, items: [{ item_id: p.slug, item_name: p.name, item_brand: brandName(p.brand), item_category: c?.name, price: p.price }] });
  }, [p.slug]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <div className="container-x pb-28 pt-6 md:pb-10">
        <Crumbs items={[
          { label: t.common.home, href: <Link to="/" className="hover:text-primary">{t.common.home}</Link> },
          ...(c ? [{ label: c.name, href: <Link to="/boutique/$category" params={{ category: c.slug }} className="hover:text-primary">{c.name}</Link> }] : []),
          ...(c && sub ? [{ label: sub.name, href: <Link to="/boutique/$category/$subcategory" params={{ category: c.slug, subcategory: sub.slug }} className="hover:text-primary">{sub.name}</Link> }] : []),
          { label: p.name },
        ]} />

        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-12">
          <Gallery p={p} />
          <BuyBox p={p} />
        </div>

        <ProductTabs p={p} />

        <div className="mt-14"><Reassurance /></div>

        {together.length > 0 && (
          <section className="mt-16" aria-labelledby="together">
            <SectionTitle eyebrow={c?.pillar === "ameublement" ? t.nav.furniture : t.nav.electro} title={t.product.together} />
            <span id="together" className="sr-only">{t.product.together}</span>
            <ProductGrid products={together} className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3" />
          </section>
        )}
        {related.length > 0 && (
          <section className="mt-16" aria-labelledby="related">
            <SectionTitle eyebrow={c?.name} title={t.product.related} action={c && <Link to="/boutique/$category" params={{ category: c.slug }} className="text-sm font-semibold text-primary hover:underline">{t.common.seeAll} →</Link>} />
            <span id="related" className="sr-only">{t.product.related}</span>
            <ProductGrid products={related} />
          </section>
        )}
      </div>

      {/* Barre collante mobile */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 p-3 shadow-lift backdrop-blur-none md:hidden">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs text-muted-foreground">{p.name}</p>
            <Price p={p} size="sm" />
          </div>
          <button type="button" onClick={() => add(p.slug, { from: document.getElementById("product-main-image") })} className="btn btn-primary shrink-0 px-5">
            <ShoppingBag className="h-4 w-4" aria-hidden />{t.cart.addShort}
          </button>
        </div>
      </div>
    </>
  );
}
