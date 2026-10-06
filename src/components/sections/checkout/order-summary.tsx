import { Banknote } from "lucide-react";
import type { ReactNode } from "react";
import { ProductThumb } from "@/components/product";
import { site } from "@/config/site";
import { cartTotals, formatPrice } from "@/lib/commerce";
import { useShop } from "@/store/shop";
import { t } from "@/i18n/fr";

/** Totaux du panier pour une zone donnée (frais null = ville non choisie). */
export function Totals({ zone, children }: { zone: string | undefined; children?: ReactNode }) {
  const { items } = useShop();
  const tot = cartTotals(items.map((i) => ({ price: i.product.price, qty: i.line.qty })), zone);
  const zoneLabel = site.deliveryZones.find((z) => z.id === zone)?.label;
  return (
    <dl className="space-y-2 text-sm">
      <div className="flex justify-between"><dt>{t.cart.subtotal}</dt><dd className="tabular font-semibold">{formatPrice(tot.subtotal)}</dd></div>
      <div className="flex justify-between gap-3">
        <dt>{t.cart.delivery}{zoneLabel ? ` · ${zoneLabel}` : ""}</dt>
        <dd className="tabular text-right font-semibold">
          {tot.fee === null ? <span className="font-normal text-muted-foreground">{t.cart.deliveryChooseCity}</span> : tot.fee === 0 ? <span className="text-success">{t.cart.deliveryFree}</span> : formatPrice(tot.fee)}
        </dd>
      </div>
      {children}
      <div className="flex items-baseline justify-between border-t pt-3 text-lg font-extrabold">
        <dt>{t.cart.total}</dt><dd className="tabular text-primary">{formatPrice(tot.total)}</dd>
      </div>
      <p className="text-[11px] text-muted-foreground">Frais de livraison indicatifs, confirmés par notre équipe.</p>
    </dl>
  );
}

export function CodNotice() {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-success-soft p-4 text-success">
      <Banknote className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
      <p className="text-sm font-semibold">{t.checkout.codBox}</p>
    </div>
  );
}

export function OrderSummary({ zone }: { zone: string | undefined }) {
  const { items } = useShop();
  return (
    <div className="rounded-3xl border bg-card p-5 md:p-6">
      <h2 className="font-display text-xl font-extrabold">{t.checkout.summary}</h2>
      <ul className="mt-4 divide-y">
        {items.map(({ line, product }) => (
          <li key={line.slug + (line.variant ?? "")} className="grid grid-cols-[56px_minmax(0,1fr)_auto] items-center gap-3 py-3">
            <div className="relative overflow-hidden rounded-xl border">
              <ProductThumb p={product} />
              <span className="tabular absolute right-0.5 top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-ink px-1 text-[10px] font-bold text-ink-foreground">{line.qty}</span>
            </div>
            <div className="min-w-0">
              <p className="line-clamp-2 text-sm font-semibold leading-snug">{product.name}</p>
              {line.variant && <p className="text-xs text-muted-foreground">{line.variant}</p>}
            </div>
            <span className="tabular text-sm font-bold">{formatPrice(product.price * line.qty)}</span>
          </li>
        ))}
      </ul>
      <div className="mt-4 border-t pt-4"><Totals zone={zone} /></div>
      <div className="mt-4"><CodNotice /></div>
    </div>
  );
}
