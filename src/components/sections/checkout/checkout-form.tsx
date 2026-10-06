import { Link, useNavigate } from "@tanstack/react-router";
import { AlertCircle, Lock, MapPin, UserCheck } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { WhatsAppIcon } from "@/components/layout";
import { site } from "@/config/site";
import { defaultAddress, orderFromRecap } from "@/lib/account";
import { applyAddress, buildRecap, emptyCheckout, prefillFromAccount, validateCheckout, type CheckoutErrors, type CheckoutValues } from "@/lib/checkout";
import { buildOrderMessage, getZone, saveOrderRecap, track, waLink } from "@/lib/commerce";
import { useAuth } from "@/store/auth";
import { useShop } from "@/store/shop";
import { t } from "@/i18n/fr";
import { cn } from "@/lib/utils";
import { OrderSummary } from "./order-summary";

function Field({ id, label, error, hint, children, className }: { id: string; label: string; error?: string | undefined; hint?: string; children: ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold">{label}</label>
      {children}
      {hint && !error && <p id={`${id}-hint`} className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      {error && <p id={`${id}-error`} className="mt-1 flex items-center gap-1 text-xs font-semibold text-destructive"><AlertCircle className="h-3.5 w-3.5" aria-hidden />{error}</p>}
    </div>
  );
}

const DRAFT_KEY = "bi_checkout_draft";

export function CheckoutForm() {
  const { items, zone, setZone, clear } = useShop();
  const navigate = useNavigate();
  const [v, setV] = useState<CheckoutValues>({ ...emptyCheckout, zone: zone ?? "" });
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);
  const { isLoggedIn, user, addresses, addOrder } = useAuth();
  // Adresse enregistrée sélectionnée ("" = saisie libre).
  const [addrId, setAddrId] = useState("");

  // Brouillon local (client uniquement) : évite de tout ressaisir après un retour arrière.
  useEffect(() => {
    try {
      const d = JSON.parse(sessionStorage.getItem(DRAFT_KEY) || "null") as Partial<CheckoutValues> | null;
      if (d) setV((x) => ({ ...x, ...d, cgv: false, zone: d.zone || x.zone }));
    } catch { /* ignore */ }
    track("begin_checkout", { currency: "MAD", items: items.map((i) => ({ item_id: i.product.slug, quantity: i.line.qty, price: i.product.price })) });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Client connecté : nom, téléphone et adresse par défaut préremplis (sans écraser un brouillon).
  useEffect(() => {
    if (!isLoggedIn || !user) return;
    const def = defaultAddress(addresses);
    setV((x) => {
      const next = prefillFromAccount(x, user, def);
      if (def && next.address === def.address && next.zone === def.zone) setAddrId(def.id);
      if (next.zone && next.zone !== x.zone) setZone(next.zone);
      return next;
    });
  }, [isLoggedIn]); // eslint-disable-line react-hooks/exhaustive-deps

  const chooseAddress = (id: string) => {
    setAddrId(id);
    const a = addresses.find((x) => x.id === id);
    const next = a ? applyAddress(v, a) : { ...v, district: "", address: "" };
    setV(next);
    if (a) setZone(a.zone);
    if (submitted) setErrors(validateCheckout(next));
  };

  const set = <K extends keyof CheckoutValues>(k: K, val: CheckoutValues[K]) => {
    const next = { ...v, [k]: val };
    setV(next);
    if (k === "zone") setZone((val as string) || undefined);
    if (k === "zone" || k === "district" || k === "address") setAddrId("");
    if (submitted) setErrors(validateCheckout(next));
    try { const { cgv: _cgv, ...draft } = next; sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft)); } catch { /* ignore */ }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const errs = validateCheckout(v);
    setErrors(errs);
    if (Object.keys(errs).length) {
      summaryRef.current?.focus();
      return;
    }
    const recap = buildRecap(v, items.map((i) => ({ name: i.product.name, price: i.product.price, qty: i.line.qty, variant: i.line.variant })));
    saveOrderRecap(recap);
    // Connecté : la commande rejoint l'historique du compte avec le statut « Envoyée ».
    if (isLoggedIn) addOrder(orderFromRecap(recap, items.map((i) => i.product.slug)));
    track("order_whatsapp_sent", { transaction_id: recap.ref, value: recap.total, currency: "MAD", shipping: recap.fee });
    // Ouverture synchrone dans le gestionnaire de soumission (évite le blocage des pop-ups).
    window.open(waLink(buildOrderMessage(recap)), "_blank", "noopener,noreferrer");
    try { sessionStorage.removeItem(DRAFT_KEY); } catch { /* ignore */ }
    clear();
    navigate({ to: "/commande/confirmation/$ref", params: { ref: recap.ref } });
  };

  const input = (k: keyof CheckoutValues) => ({
    id: `co-${k}`,
    "aria-invalid": Boolean(errors[k]) || undefined,
    "aria-describedby": errors[k] ? `co-${k}-error` : undefined,
    className: cn("field", errors[k] && "border-destructive"),
  });
  const errCount = Object.keys(errors).length;

  return (
    <form onSubmit={onSubmit} noValidate className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_400px]">
      <div className="space-y-8">
        <div ref={summaryRef} tabIndex={-1} aria-live="assertive" className="outline-none">
          {submitted && errCount > 0 && (
            <p className="flex items-center gap-2 rounded-2xl bg-primary-soft p-4 text-sm font-semibold text-primary-deep"><AlertCircle className="h-4 w-4" aria-hidden />{t.checkout.errors.summary}</p>
          )}
        </div>
        {isLoggedIn && user && (
          <p className="flex items-start gap-2 rounded-2xl bg-surface p-4 text-sm"><UserCheck className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden />{t.account.checkout.loggedAs(user.name)}</p>
        )}
        <fieldset className="rounded-3xl border p-5 md:p-6">
          <legend className="px-2 font-display text-lg font-extrabold">1. {t.checkout.contact}</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="co-name" label={`${t.checkout.name} *`} error={errors.name}>
              <input {...input("name")} autoComplete="name" value={v.name} onChange={(e) => set("name", e.target.value)} required />
            </Field>
            <Field id="co-phone" label={`${t.checkout.phone} *`} error={errors.phone} hint={t.checkout.phoneHint}>
              <input {...input("phone")} type="tel" inputMode="tel" autoComplete="tel" placeholder="06 12 34 56 78" value={v.phone} onChange={(e) => set("phone", e.target.value)} required aria-describedby={errors.phone ? "co-phone-error" : "co-phone-hint"} />
            </Field>
          </div>
        </fieldset>
        <fieldset className="rounded-3xl border p-5 md:p-6">
          <legend className="px-2 font-display text-lg font-extrabold">2. {t.checkout.address}</legend>
          {isLoggedIn && addresses.length > 0 && (
            <div role="radiogroup" aria-label={t.account.checkout.savedAddress} className="mb-5 grid gap-2 sm:grid-cols-2">
              {addresses.map((a) => (
                <label key={a.id} className={cn("flex cursor-pointer items-start gap-3 rounded-2xl border-[1.5px] p-3 text-sm transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring", addrId === a.id ? "border-primary bg-primary-soft/50" : "hover:border-ink")}>
                  <input type="radio" name="saved-address" value={a.id} checked={addrId === a.id} onChange={() => chooseAddress(a.id)} className="mt-1 accent-[var(--primary)]" />
                  <span className="min-w-0">
                    <span className="flex items-center gap-1.5 font-semibold"><MapPin className="h-3.5 w-3.5 text-primary" aria-hidden />{a.label}{a.isDefault && <span className="text-xs font-normal text-muted-foreground">· {t.account.addresses.default}</span>}</span>
                    <span className="block truncate text-xs text-muted-foreground">{a.district}, {getZone(a.zone)?.label ?? a.zone}</span>
                  </span>
                </label>
              ))}
              <label className={cn("flex cursor-pointer items-center gap-3 rounded-2xl border-[1.5px] p-3 text-sm font-semibold transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring", addrId === "" ? "border-primary bg-primary-soft/50" : "hover:border-ink")}>
                <input type="radio" name="saved-address" value="" checked={addrId === ""} onChange={() => chooseAddress("")} className="accent-[var(--primary)]" />
                {t.account.checkout.newAddress}
              </label>
            </div>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="co-zone" label={`${t.checkout.city} *`} error={errors.zone}>
              <select {...input("zone")} value={v.zone} onChange={(e) => set("zone", e.target.value)} required>
                <option value="">{t.checkout.cityPlaceholder}</option>
                {site.deliveryZones.map((z) => <option key={z.id} value={z.id}>{z.label} — {z.delay}</option>)}
              </select>
            </Field>
            <Field id="co-district" label={`${t.checkout.district} *`} error={errors.district}>
              <input {...input("district")} value={v.district} onChange={(e) => set("district", e.target.value)} required />
            </Field>
            <Field id="co-address" label={`${t.checkout.street} *`} error={errors.address} className="sm:col-span-2">
              <input {...input("address")} autoComplete="street-address" placeholder="N°, rue, immeuble…" value={v.address} onChange={(e) => set("address", e.target.value)} required />
            </Field>
            <Field id="co-note" label={t.checkout.note} className="sm:col-span-2">
              <textarea {...input("note")} rows={3} maxLength={400} placeholder={t.checkout.notePlaceholder} value={v.note} onChange={(e) => set("note", e.target.value)} />
            </Field>
          </div>
        </fieldset>
        <div>
          <label className="flex cursor-pointer items-start gap-3 text-sm">
            <input type="checkbox" checked={v.cgv} onChange={(e) => set("cgv", e.target.checked)} aria-invalid={Boolean(errors.cgv) || undefined} aria-describedby={errors.cgv ? "co-cgv-error" : undefined} className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--primary)]" />
            <span>{t.checkout.cgv} (<Link to="/cgv" target="_blank" className="font-semibold text-primary underline">CGV</Link>) *</span>
          </label>
          {errors.cgv && <p id="co-cgv-error" className="mt-1 flex items-center gap-1 text-xs font-semibold text-destructive"><AlertCircle className="h-3.5 w-3.5" aria-hidden />{errors.cgv}</p>}
        </div>
        <div className="hidden lg:block">
          <SubmitBlock />
        </div>
      </div>
      <aside className="space-y-4 lg:sticky lg:top-36 lg:self-start">
        <OrderSummary zone={v.zone || undefined} />
        <div className="lg:hidden"><SubmitBlock /></div>
      </aside>
    </form>
  );
}

function SubmitBlock() {
  return (
    <div className="space-y-3">
      <button type="submit" className="btn btn-whatsapp w-full py-4 text-base">
        <WhatsAppIcon className="h-5 w-5" />{t.checkout.submit}
      </button>
      <p className="flex items-start gap-2 text-xs text-muted-foreground"><Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />{t.checkout.whatsappInfo}</p>
    </div>
  );
}
