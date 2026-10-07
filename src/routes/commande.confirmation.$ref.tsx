import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import { Check, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { Reassurance, Stars } from "@/components/brand";
import { site } from "@/config/site";
import { formatPrice, loadOrderRecap, telLink, track, type OrderRecap } from "@/lib/commerce";
import { pageHead } from "@/lib/seo";
import { t } from "@/i18n/fr";

export const Route = createFileRoute("/commande/confirmation/$ref")({
  head: ({ params }) => pageHead({ title: `Commande ${params.ref}`, description: "Confirmation de votre commande Belle Image.", path: `/commande/confirmation/${params.ref}`, noindex: true }),
  component: ConfirmationPage,
});

function ConfirmationPage() {
  const { ref } = Route.useParams();
  const reduce = useReducedMotion();
  // Récapitulatif lu en sessionStorage côté client uniquement.
  const [recap, setRecap] = useState<OrderRecap | null | undefined>(undefined);
  useEffect(() => {
    setRecap(loadOrderRecap(ref));
    window.scrollTo({ top: 0 });
  }, [ref]);

  return (
    <>
    <div className="container-x max-w-3xl py-12 md:py-16">
      <div className="text-center">
        <motion.div
          initial={reduce ? false : { scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
          className="relative mx-auto grid h-28 w-28 place-items-center rounded-full bg-success-soft"
        >
          <motion.span initial={reduce ? false : { scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.25, type: "spring", stiffness: 300, damping: 15 }} className="grid h-16 w-16 place-items-center rounded-full bg-success text-primary-foreground">
            <Check className="h-8 w-8" strokeWidth={3} aria-hidden />
          </motion.span>
        </motion.div>
        <Stars className="mt-6 text-primary" size={14} />
        <h1 className="mt-3 text-3xl font-extrabold text-ink md:text-4xl">{t.confirmation.title}</h1>
        <p className="mt-3 text-sm text-muted-foreground">{t.confirmation.ref}</p>
        <p className="tabular mt-1 inline-block rounded-full bg-surface px-4 py-2 font-display text-xl font-extrabold tracking-wide">{ref}</p>
        <p className="mx-auto mt-5 max-w-lg text-lg font-semibold text-ink">{t.confirmation.text}</p>
        <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
          <a href={telLink} onClick={() => track("phone_click", { location: "confirmation" })} className="btn btn-outline"><Phone className="h-4 w-4" aria-hidden />{t.confirmation.callUs} · {site.phone}</a>
        </div>
      </div>

      <section className="mt-12 rounded-3xl border p-5 md:p-6" aria-labelledby="recap-title">
        <h2 id="recap-title" className="font-display text-xl font-extrabold">{t.confirmation.recap}</h2>
        {recap === undefined ? (
          <div className="mt-4 h-32 animate-pulse rounded-2xl bg-surface" />
        ) : recap === null ? (
          <p className="mt-3 text-sm text-muted-foreground">{t.confirmation.notFound}</p>
        ) : (
          <div className="mt-4 grid gap-6 md:grid-cols-2">
            <div className="text-sm">
              <p className="font-semibold">{recap.customer.name}</p>
              <p className="text-muted-foreground">{recap.customer.phone}</p>
              <p className="mt-2 text-muted-foreground">{recap.customer.address}, {recap.customer.district}, {recap.customer.city}</p>
              {recap.customer.note && <p className="mt-2 text-muted-foreground">Note : {recap.customer.note}</p>}
            </div>
            <div>
              <ul className="space-y-1.5 text-sm">
                {recap.items.map((i, k) => (
                  <li key={k} className="flex justify-between gap-3"><span>{i.qty} × {i.name}{i.variant ? ` (${i.variant})` : ""}</span><span className="tabular shrink-0 font-semibold">{formatPrice(i.price * i.qty)}</span></li>
                ))}
              </ul>
              <dl className="mt-3 space-y-1 border-t pt-3 text-sm">
                <div className="flex justify-between"><dt>{t.cart.subtotal}</dt><dd className="tabular">{formatPrice(recap.subtotal)}</dd></div>
                <div className="flex justify-between"><dt>{t.cart.delivery}</dt><dd className="tabular">{recap.fee === 0 ? t.cart.deliveryFree : formatPrice(recap.fee)}</dd></div>
                <div className="flex justify-between text-base font-extrabold"><dt>{t.cart.total}</dt><dd className="tabular text-primary">{formatPrice(recap.total)}</dd></div>
              </dl>
              <p className="mt-2 text-xs font-semibold text-success">💵 {t.cart.codTitle}</p>
            </div>
          </div>
        )}
      </section>
      <div className="mt-8 text-center"><Link to="/boutique" className="btn btn-primary">{t.confirmation.backShop}</Link></div>
    </div>
    <div className="container-x"><Reassurance /></div>
    </>
  );
}
