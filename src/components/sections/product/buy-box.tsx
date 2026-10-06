import { Link, useNavigate } from "@tanstack/react-router";
import { Banknote, ShieldCheck, ShoppingBag, Truck, Zap } from "lucide-react";
import { useState } from "react";
import { QtyStepper, WhatsAppIcon } from "@/components/layout";
import { SampleNote, Stars } from "@/components/brand";
import { Countdown, FavButton, Price, StockBadge } from "@/components/product";
import { site } from "@/config/site";
import { brandName, savings, type Product } from "@/lib/catalogue";
import { buildProductMessage, deliveryFee, formatPrice, getZone, track, waLink } from "@/lib/commerce";
import { useShop } from "@/store/shop";
import { t } from "@/i18n/fr";
import { cn } from "@/lib/utils";

function Options({ label, values, value, onChange }: { label: string; values: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <fieldset>
      <legend className="text-sm font-semibold">{label} : <span className="font-normal text-muted-foreground">{value}</span></legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {values.map((v) => (
          <label key={v} className={cn("cursor-pointer rounded-full border-[1.5px] px-4 py-2 text-sm font-medium transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring", v === value ? "border-ink bg-ink text-ink-foreground" : "hover:border-ink")}>
            <input type="radio" name={label} value={v} checked={v === value} onChange={() => onChange(v)} className="sr-only" />{v}
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
      <Truck className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
      <div className="min-w-0 flex-1">
        <label className="flex flex-wrap items-center gap-2 text-sm font-semibold">
          {t.product.deliveryTo}
          <select value={zone ?? ""} onChange={(e) => setZone(e.target.value || undefined)} className="rounded-full border-[1.5px] border-input bg-background px-3 py-1 text-sm font-semibold focus:border-ring focus:outline-none">
            <option value="">{t.cart.deliveryChooseCity}</option>
            {site.deliveryZones.map((zz) => <option key={zz.id} value={zz.id}>{zz.label}</option>)}
          </select>
        </label>
        <p className="mt-1 text-xs text-muted-foreground">
          {z && fee !== null ? t.product.deliveryEstimate(z.delay, fee === 0 ? t.cart.deliveryFree : formatPrice(fee)) : site.deliveryZones.map((zz) => `${zz.label} : ${zz.delay}`).join(" · ")}
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
  const variant = [color, size].filter(Boolean).join(" · ") || undefined;
  const save = savings(p);

  const orderWhatsapp = () => {
    track("whatsapp_click", { location: "product", item_id: p.slug });
    window.open(waLink(buildProductMessage(p, window.location.href, variant)), "_blank", "noopener,noreferrer");
  };

  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Link to="/marques/$brand" params={{ brand: p.brand }} className="text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-primary">{brandName(p.brand)}</Link>
          <h1 className="mt-1 text-2xl font-extrabold leading-tight text-ink md:text-4xl">{p.name}</h1>
        </div>
        <FavButton slug={p.slug} className="shrink-0 border" />
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5"><Stars className="text-surface-2" size={12} />{t.product.noReviews}</span>
        <span aria-hidden>·</span>
        <span>{p.specLine}</span>
      </div>
      <p className="mt-3"><SampleNote /></p>

      <div className="mt-5 rounded-2xl bg-surface p-5">
        <Price p={p} size="lg" />
        {save > 0 && <p className="tabular mt-1 text-sm font-semibold text-primary-deep">{t.product.savings} {formatPrice(save)}</p>}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <StockBadge stock={p.stock} />
          {p.dealEndsAt && <span className="flex items-center gap-2 text-xs text-muted-foreground">{t.product.dealEnds}<Countdown to={p.dealEndsAt} /></span>}
        </div>
      </div>

      <div className="mt-5 space-y-4">
        {p.colors && p.colors.length > 1 && <Options label={t.product.color} values={p.colors} value={color} onChange={setColor} />}
        {p.sizes && <Options label={t.product.size} values={p.sizes} value={size} onChange={setSize} />}
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold">{t.product.quantity}</span>
          <QtyStepper value={qty} onChange={(n) => setQty(Math.max(1, Math.min(99, n)))} />
        </div>
      </div>

      <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
        <button type="button" onClick={() => add(p.slug, { qty, variant, from: document.getElementById("product-main-image") })} className="btn btn-primary w-full">
          <ShoppingBag className="h-4 w-4" aria-hidden />{t.cart.add}
        </button>
        <button type="button" onClick={() => { add(p.slug, { qty, variant, openDrawer: false }); navigate({ to: "/commande" }); }} className="btn btn-ink w-full">
          <Zap className="h-4 w-4" aria-hidden />{t.product.orderNow}
        </button>
        <button type="button" onClick={orderWhatsapp} className="btn btn-whatsapp w-full sm:col-span-2">
          <WhatsAppIcon className="h-4 w-4" />{t.product.orderWhatsapp}
        </button>
      </div>

      <div className="mt-6 space-y-4 rounded-2xl border p-5">
        <div className="flex items-start gap-3">
          <Banknote className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
          <div><p className="text-sm font-semibold">{t.cart.codTitle}</p><p className="text-xs text-muted-foreground">{t.product.codShort}</p></div>
        </div>
        <DeliveryEstimate price={p.price} />
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
          <div><p className="text-sm font-semibold">{t.product.warranty}</p><p className="text-xs text-muted-foreground">{p.warranty}</p></div>
        </div>
      </div>
    </div>
  );
}
