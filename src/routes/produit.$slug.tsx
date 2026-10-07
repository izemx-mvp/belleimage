import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useEffect } from "react";
import { Crumbs, WhatsAppIcon } from "@/components/layout";
import { SectionTitle } from "@/components/brand";
import { Price, ProductGrid, ProductThumb } from "@/components/product";
import { BuyBox } from "@/components/sections/product/buy-box";
import { Gallery } from "@/components/sections/product/gallery";
import { ProductTabs } from "@/components/sections/product/product-tabs";
import { brandName, getBoughtTogether, getCategory, getProductBySlug, getRelated, getSubcategory } from "@/lib/catalogue";
import { buildProductMessage, formatPrice, track, waLink } from "@/lib/commerce";
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
      title: `${p.name} — ${formatPrice(p.price).replace(/ /g, " ")}`,
      description: `${p.name} (${p.specLine}) à ${formatPrice(p.price).replace(/ /g, " ")} chez Belle Image Kénitra. Livraison à domicile, paiement à la livraison, ${p.warranty.toLowerCase()}.`,
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
      <div className="container-x pb-28 pt-6 md:pb-12">
        <Crumbs items={[
          { label: t.common.home, href: <Link to="/" className="hover:text-primary">{t.common.home}</Link> },
          ...(c ? [{ label: c.name, href: <Link to="/boutique/$category" params={{ category: c.slug }} className="hover:text-primary">{c.name}</Link> }] : []),
          ...(c && sub ? [{ label: sub.name, href: <Link to="/boutique/$category/$subcategory" params={{ category: c.slug, subcategory: sub.slug }} className="hover:text-primary">{sub.name}</Link> }] : []),
          { label: p.name },
        ]} />

        <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-14">
          <Gallery p={p} />
          <BuyBox p={p} />
        </div>

        <ProductTabs p={p} />
      </div>

      {/* Souvent achetés ensemble : sur fond gris pour marquer le passage à la vente additionnelle */}
      {together.length > 0 && (
        <section className="bg-surface py-16 md:py-20" aria-labelledby="together">
          <div className="container-x">
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <h2 id="together" className="text-3xl font-extrabold text-ink md:text-4xl">{t.product.together}</h2>
              <div className="flex items-center gap-2" aria-hidden>
                <span className="h-14 w-14 overflow-hidden rounded-2xl bg-background p-1.5 shadow-card"><ProductThumb p={p} /></span>
                {together.slice(0, 3).map((x) => (
                  <span key={x.slug} className="flex items-center gap-2">
                    <Plus className="h-4 w-4 text-primary" />
                    <span className="h-14 w-14 overflow-hidden rounded-2xl bg-background p-1.5 shadow-card"><ProductThumb p={x} /></span>
                  </span>
                ))}
              </div>
            </div>
            <ProductGrid products={together} className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4" />
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="container-x py-16 md:py-20" aria-labelledby="related">
          <SectionTitle
            title={t.product.related}
            id="related"
            action={c && <Link to="/boutique/$category" params={{ category: c.slug }} className="text-sm font-semibold text-primary hover:underline">{t.common.seeAll}</Link>}
          />
          <ProductGrid products={related} />
        </section>
      )}

      {/* Barre collante mobile */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-background p-3 shadow-lift md:hidden">
        <div className="flex items-center gap-2">
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs text-muted-foreground">{p.name}</p>
            <Price p={p} size="sm" />
          </div>
          <button
            type="button"
            onClick={() => {
              track("whatsapp_click", { location: "product_sticky", item_id: p.slug });
              window.open(waLink(buildProductMessage(p, window.location.href, undefined)), "_blank", "noopener,noreferrer");
            }}
            className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-whatsapp text-primary-foreground"
            aria-label={t.product.orderWhatsapp}
          >
            <WhatsAppIcon className="h-5 w-5" />
          </button>
          <button type="button" onClick={() => add(p.slug, { from: document.getElementById("product-main-image") })} className="btn btn-primary h-12 shrink-0 px-5">
            <Plus className="h-4 w-4" aria-hidden />
            {t.cart.addShort}
          </button>
        </div>
      </div>
    </>
  );
}