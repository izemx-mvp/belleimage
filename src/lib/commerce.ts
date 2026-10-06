import { site } from "@/config/site";

export const formatPrice = (n: number) =>
  `${Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "\u00a0")}\u00a0DH`;

/** Téléphone marocain : 05/06/07 + 8 chiffres, ou +212 / 00212 + 5/6/7 + 8 chiffres. */
export function isValidMoroccanPhone(input: string) {
  const s = input.replace(/[\s.-]/g, "");
  return /^(0[567]\d{8}|(\+212|00212)[567]\d{8})$/.test(s);
}

export function deliveryFee(zoneId: string | undefined, subtotal: number) {
  const zone = site.deliveryZones.find((z) => z.id === zoneId);
  if (!zone) return null;
  if (subtotal >= site.freeDeliveryThreshold) return 0;
  return zone.fee;
}

export function makeOrderRef(date = new Date(), rand = Math.random) {
  const ymd = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
  const code = Array.from({ length: 4 }, () => "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[Math.floor(rand() * 32)]).join("");
  return `BI-${ymd}-${code}`;
}

export const waLink = (text: string) => `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;

export type OrderRecap = {
  ref: string;
  createdAt: string;
  customer: { name: string; phone: string; city: string; address: string; district: string; note?: string };
  items: { name: string; qty: number; price: number; variant?: string }[];
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
    `Livraison : ${o.fee === 0 ? "Offerte / à confirmer" : formatPrice(o.fee)}`,
    `*Total : ${formatPrice(o.total)}*`,
    ``,
    `💵 Paiement à la livraison`,
  ];
  return lines.join("\n");
}

declare global {
  interface Window { dataLayer?: Record<string, unknown>[] }
}
export function track(event: string, data: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...data });
}
