// Validation du formulaire de commande et construction du récapitulatif (pur, testable).
import { t } from "@/i18n/fr";
import { cartTotals, getZone, isValidMoroccanPhone, makeOrderRef, type OrderRecap } from "./commerce";

export type CheckoutValues = {
  name: string;
  phone: string;
  zone: string;
  address: string;
  district: string;
  note: string;
  cgv: boolean;
};
export type CheckoutErrors = Partial<Record<keyof CheckoutValues, string>>;

export const emptyCheckout: CheckoutValues = { name: "", phone: "", zone: "", address: "", district: "", note: "", cgv: false };

export function validateCheckout(v: CheckoutValues): CheckoutErrors {
  const e: CheckoutErrors = {};
  if (v.name.trim().length < 3 || !v.name.trim().includes(" ")) e.name = t.checkout.errors.name;
  if (!isValidMoroccanPhone(v.phone)) e.phone = t.checkout.errors.phone;
  if (!getZone(v.zone)) e.zone = t.checkout.errors.city;
  if (v.address.trim().length < 8) e.address = t.checkout.errors.address;
  if (v.district.trim().length < 2) e.district = t.checkout.errors.district;
  if (!v.cgv) e.cgv = t.checkout.errors.cgv;
  return e;
}

export function buildRecap(
  v: CheckoutValues,
  items: { name: string; price: number; qty: number; variant?: string | undefined }[],
  now = new Date(),
  rand = Math.random,
): OrderRecap {
  const tot = cartTotals(items, v.zone);
  return {
    ref: makeOrderRef(now, rand),
    createdAt: now.toISOString(),
    customer: {
      name: v.name.trim(),
      phone: v.phone.trim(),
      city: getZone(v.zone)?.label ?? v.zone,
      address: v.address.trim(),
      district: v.district.trim(),
      note: v.note.trim() || undefined,
    },
    items: items.map((i) => ({ name: i.name, qty: i.qty, price: i.price, variant: i.variant })),
    subtotal: tot.subtotal,
    fee: tot.fee ?? 0,
    total: tot.total,
  };
}

/** Applique une adresse enregistrée de l'espace client au formulaire. */
export function applyAddress(v: CheckoutValues, a: { zone: string; district: string; address: string }): CheckoutValues {
  return { ...v, zone: a.zone, district: a.district, address: a.address };
}

/**
 * Préremplissage pour un client connecté : nom et téléphone du profil, adresse par défaut.
 * Ne remplace jamais une valeur déjà saisie (brouillon en cours).
 */
export function prefillFromAccount(
  v: CheckoutValues,
  profile: { name: string; phone: string },
  address?: { zone: string; district: string; address: string } | undefined,
): CheckoutValues {
  let next: CheckoutValues = { ...v, name: v.name || profile.name, phone: v.phone || profile.phone };
  if (address && !v.address.trim()) next = applyAddress(next, address);
  return next;
}
