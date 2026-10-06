import { site } from "@/config/site";

/** Format prix marocain : « 4 999 DH » (espaces insécables, chiffres tabulaires côté CSS). */
export const formatPrice = (n: number) =>
  `${Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "\u00a0")}\u00a0DH`;

/** Téléphone marocain : 05/06/07 + 8 chiffres, ou +212 / 00212 + 5/6/7 + 8 chiffres. */
export function isValidMoroccanPhone(input: string) {
  const s = input.replace(/[\s.\-()]/g, "");
  return /^(0[567]\d{8}|(\+212|00212)[567]\d{8})$/.test(s);
}

export const getZone = (zoneId: string | undefined) => site.deliveryZones.find((z) => z.id === zoneId);

/** Frais de livraison pour une zone, `null` si la zone est inconnue. Offerte au-delà du seuil. */
export function deliveryFee(zoneId: string | undefined, subtotal: number) {
  const zone = getZone(zoneId);
  if (!zone) return null;
  if (subtotal >= site.freeDeliveryThreshold) return 0;
  return zone.fee;
}

export type PricedLine = { price: number; qty: number };

/** Totaux du panier : sous-total, frais (null si zone non choisie), total et reste pour la livraison offerte. */
export function cartTotals(lines: PricedLine[], zoneId?: string) {
  const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);
  const count = lines.reduce((s, l) => s + l.qty, 0);
  const fee = deliveryFee(zoneId, subtotal);
  return {
    count,
    subtotal,
    fee,
    total: subtotal + (fee ?? 0),
    toFreeDelivery: Math.max(0, site.freeDeliveryThreshold - subtotal),
  };
}

export function makeOrderRef(date = new Date(), rand = Math.random) {
  const ymd = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const code = Array.from({ length: 4 }, () => alphabet[Math.floor(rand() * alphabet.length)]).join("");
  return `BI-${ymd}-${code}`;
}

export const ORDER_REF_RE = /^BI-\d{8}-[A-Z0-9]{4}$/;

export const waLink = (text: string) => `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;
export const telLink = `tel:${site.phoneIntl}`;

export type OrderRecap = {
  ref: string;
  createdAt: string;
  customer: { name: string; phone: string; city: string; address: string; district: string; note?: string | undefined };
  items: { name: string; qty: number; price: number; variant?: string | undefined }[];
  subtotal: number;
  fee: number;
  total: number;
};

export function buildOrderMessage(o: OrderRecap) {
  const lines = [
    `🛒 *Nouvelle commande Belle Image*`,
    `Réf : *${o.ref}*`,
    ``,
    `👤 *Client*`,
    `Nom : ${o.customer.name}`,
    `Tél : ${o.customer.phone}`,
    `Ville : ${o.customer.city}`,
    `Quartier : ${o.customer.district}`,
    `Adresse : ${o.customer.address}`,
    ...(o.customer.note ? [`Note : ${o.customer.note}`] : []),
    ``,
    `📦 *Articles*`,
    ...o.items.map((i) => `• ${i.qty} × ${i.name}${i.variant ? ` (${i.variant})` : ""} — ${formatPrice(i.price * i.qty)}`),
    ``,
    `Sous-total : ${formatPrice(o.subtotal)}`,
    `Livraison : ${o.fee === 0 ? "Offerte" : formatPrice(o.fee)}`,
    `*Total : ${formatPrice(o.total)}*`,
    ``,
    `💵 Paiement à la livraison`,
  ];
  // Les montants utilisent des espaces insécables : on les remplace pour WhatsApp.
  return lines.join("\n").replace(/\u00a0/g, " ");
}

export function buildProductMessage(p: { name: string; price: number }, url: string, variant?: string) {
  return [
    `Bonjour Belle Image, je souhaite commander :`,
    `• ${p.name}${variant ? ` (${variant})` : ""}`,
    `Prix : ${formatPrice(p.price)}`,
    `Lien : ${url}`,
    ``,
    `Paiement à la livraison. Merci de me confirmer la disponibilité.`,
  ].join("\n").replace(/\u00a0/g, " ");
}

export function buildContactMessage(c: { name: string; phone: string; subject: string; message: string }) {
  return [
    `Bonjour Belle Image,`,
    ``,
    `*Objet : ${c.subject}*`,
    c.message,
    ``,
    `— ${c.name}${c.phone ? ` · ${c.phone}` : ""}`,
  ].join("\n");
}

/* ---------------- Récapitulatif de commande (navigateur uniquement) ---------------- */

const ORDER_KEY = (ref: string) => `bi_order_${ref}`;

/** À appeler uniquement dans un gestionnaire d'événement ou un effet (jamais au rendu). */
export function saveOrderRecap(o: OrderRecap) {
  try {
    sessionStorage.setItem(ORDER_KEY(o.ref), JSON.stringify(o));
  } catch { /* stockage indisponible : la page de confirmation affichera un message neutre */ }
}
export function loadOrderRecap(ref: string): OrderRecap | null {
  try {
    const raw = sessionStorage.getItem(ORDER_KEY(ref));
    return raw ? (JSON.parse(raw) as OrderRecap) : null;
  } catch {
    return null;
  }
}

/* ---------------- dataLayer ---------------- */

declare global {
  interface Window { dataLayer?: Record<string, unknown>[] }
}
export type TrackEvent = "view_item" | "add_to_cart" | "begin_checkout" | "order_whatsapp_sent" | "whatsapp_click" | "phone_click";
export function track(event: TrackEvent, data: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...data });
}
