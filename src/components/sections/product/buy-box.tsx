import { Link, useNavigate } from "@tanstack/react-router";
import { Banknote, Phone, ShieldCheck, ShoppingBag, Store, Truck, Zap } from "lucide-react";
import { useState } from "react";
import { QtyStepper, WhatsAppIcon } from "@/components/layout";
import { Countdown, Price, StockBadge } from "@/components/product";
import { site } from "@/config/site";
import { brandName, savings, type Product } from "@/lib/catalogue";
import { buildProductMessage, deliveryFee, formatPrice, getZone, telLink, track, waLink } from "@/lib/commerce";
import { useShop } from "@/store/shop";
import { t } from "@/i18n/fr";
import { cn } from "@/lib/utils";

function Options({ label, values, value, onChange }: { label: string; values: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <fieldset>
      <legend className="text-sm font-semibold text-ink">
        {label} <span className="font-normal text-muted-foreground">{value}</span>
      </legend>
      <div className="mt-2.5 flex flex-wrap gap-2">
        {values.map((v) => (
          <label
            key={v}
            className={cn(
              "cursor-pointer rounded-full border-[1.5px] px-4 py-2 text-sm font-medium transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring has-[:focus-visible]:ring-offset-2",
              v === value ? "border-ink bg-ink text-ink-foreground" : "bg-background hover:border-ink",
            )}
          >
            <input type="radio" name={label} value={v} checked={v === value} onChange={() => onChange(v)} className="sr-only" />
            {v}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/** Estimation de livraison selon la ville (zones de la config). */
export function DeliveryEstimate({ price }: { price: number }) {
  const { zone, setZone } = useShop();
  const z = getZone(zone);
  const fee = deliveryFee(zone, price);
  return (
    <div className="flex items-start gap-3">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-background text-primary shadow-card"><Truck className="h-5 w-5" aria-hidden /></span>
      <div className="min-w-0 flex-1">
        <label className="flex flex-wrap items-center gap-2 text-sm font-semibold text-ink">
          {t.product.deliveryTo}
          <select
            value={zone ?? ""}
            onChange={(e) => setZone(e.target.value || undefined)}
            className="cursor-pointer rounded-full border-[1.5px] border-input bg-background px-3 py-1 text-sm font-semibold focus:border-ring focus:outline-none"
          >
            <option value="">{t.cart.deliveryChooseCity}</option>
            {site.deliveryZones.map((zz) => <option key={zz.id} value={zz.id}>{zz.label}</option>)}
          </select>
        </label>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          {z && fee !== null
            ? t.product.deliveryEstimate(z.delay, fee === 0 ? t.cart.deliveryFree : formatPrice(fee))
            : site.deliveryZones.map((zz) => `${zz.label} : ${zz.delay}`).join(", ")}
        </p>
      </div>
    </div>
  );
}

export function BuyBox({ p }: { p: Product }) {
  const { add } = useShop();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [color, setColor] = useState(p.colors?.[0] ?? "");
  const [size, setSize] = useState(p.sizes?.[0] ?? "");
  const variant = [color, size].filter(Boolean).join(", ") || undefined;
  const save = savings(p);

  const orderWhatsapp = () => {
    track("whatsapp_click", { location: "product", item_id: p.slug });
    window.open(waLink(buildProductMessage(p, window.location.href, variant)), "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-w-0">
      {/* Marque, titre, favori */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <Link to="/marques/$brand" params={{ brand: p.brand }} className="inline-flex rounded-full bg-surface px-3 py-1 text-xs font-semibold text-ink transition-colors hover:bg-ink hover:text-ink-foreground">
            {brandName(p.brand)}
          </Link>
          <h1 className="mt-3 font-display text-[1.9rem] font-extrabold leading-[1.05] tracking-[-0.025em] text-ink md:text-[2.6rem]">{p.name}</h1>
          <p className="mt-2 text-muted-foreground">{p.specLine}</p>
        </div>
      </div>

      {/* Bloc prix : la décision se joue ici */}
      <div className="relative mt-6 overflow-hidden rounded-[1.75rem] border-2 border-ink/10 p-5 md:p-6">
        <div aria-hidden className="pointer-events-none absolute -right-14 -top-14 h-36 w-36 rounded-full border-[3px] border-primary/15" />
        <div className="relative flex flex-wrap items-end justify-between gap-3">
          <div>
            <Price p={p} size="lg" />
            {save > 0 && (
              <span className="tabular mt-2 inline-flex rounded-md bg-primary px-2.5 py-1 text-xs font-bold text-primary-foreground">
                {t.product.savings} {formatPrice(save)}
              </span>
            )}
          </div>
          <StockBadge stock={p.stock} />
        </div>
        {p.dealEndsAt && (
          <div className="relative mt-4 flex flex-wrap items-center gap-2 rounded-xl bg-surface px-3 py-2 text-xs font-medium text-ink">
            {t.product.dealEnds}
            <Countdown to={p.dealEndsAt} />
          </div>
        )}
        <p className="relative mt-4 flex items-center gap-2 border-t pt-4 text-sm font-semibold text-ink">
          <Banknote className="h-4 w-4 text-primary" aria-hidden />
          Vous payez à la livraison, aucun paiement en ligne
        </p>
      </div>

      {/* Options */}
      <div className="mt-6 space-y-5">
        {p.colors && p.colors.length > 1 && <Options label={t.product.color} values={p.colors} value={color} onChange={setColor} />}
        {p.sizes && <Options label={t.product.size} values={p.sizes} value={size} onChange={setSize} />}
      </div>

      {/* Actions */}
      <div className="mt-6 flex gap-3">
        <div className="shrink-0">
          <span className="sr-only">{t.product.quantity}</span>
          <div className="[&>div]:h-[52px] [&>div]:px-1.5 [&_button]:h-10 [&_button]:w-10"><QtyStepper value={qty} onChange={(n) => setQty(Math.max(1, Math.min(99, n)))} /></div>
        </div>
        <button
          type="button"
          onClick={() => add(p.slug, { qty, variant, from: document.getElementById("product-main-image") })}
          className="btn btn-primary h-[52px] flex-1 text-base"
        >
          <ShoppingBag className="h-5 w-5" aria-hidden />
          {t.cart.add}
        </button>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => { add(p.slug, { qty, variant, openDrawer: false }); navigate({ to: "/commande" }); }}
          className="btn btn-ink h-12 w-full"
        >
          <Zap className="h-4 w-4" aria-hidden />
          {t.product.orderNow}
        </button>
        <button type="button" onClick={orderWhatsapp} className="btn btn-whatsapp h-12 w-full">
          <WhatsAppIcon className="h-4 w-4" />
          {t.product.orderWhatsapp}
        </button>
      </div>

      {/* Garanties */}
      <div className="mt-6 space-y-4 rounded-[1.75rem] bg-surface p-5">
        <DeliveryEstimate price={p.price} />
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-background text-primary shadow-card"><ShieldCheck className="h-5 w-5" aria-hidden /></span>
          <div>
            <p className="text-sm font-semibold text-ink">{t.product.warranty}</p>
            <p className="text-xs text-muted-foreground">{p.warranty}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-background text-primary shadow-card"><Store className="h-5 w-5" aria-hidden /></span>
          <div>
            <p className="text-sm font-semibold text-ink">À voir au showroom</p>
            <p className="text-xs text-muted-foreground">{site.address.full}, {site.hours.label.toLowerCase()}</p>
          </div>
        </div>
      </div>

      {/* Conseiller */}
      <a
        href={telLink}
        onClick={() => track("phone_click", { location: "product", item_id: p.slug })}
        className="group mt-4 flex items-center gap-4 rounded-[1.75rem] border p-4 transition-colors hover:border-ink"
      >
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-ink text-ink-foreground transition-colors group-hover:bg-primary"><Phone className="h-4 w-4" aria-hidden /></span>
        <span className="min-w-0">
          <span className="block text-sm font-semibold text-ink">Une question sur ce produit ?</span>
          <span className="tabular block text-sm text-muted-foreground">Appelez un conseiller au {site.phone}</span>
        </span>
      </a>
    </div>
  );
}