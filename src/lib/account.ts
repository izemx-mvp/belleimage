// Espace client démo : types et règles pures (testables), sans aucun stockage.
import { site } from "@/config/site";
import { getProductBySlug } from "./catalogue";
import { cartTotals, getZone, type OrderRecap } from "./commerce";

export type OrderStatus = "Envoyée" | "Confirmée" | "En livraison" | "Livrée";
export const orderSteps: OrderStatus[] = ["Envoyée", "Confirmée", "En livraison", "Livrée"];

export type Profile = { name: string; phone: string; email: string; city: string };
export type Address = {
  id: string;
  label: string;
  zone: string; // id de zone de livraison (site.deliveryZones)
  district: string;
  address: string;
  isDefault: boolean;
};
export type AccountOrderItem = { slug?: string | undefined; name: string; qty: number; price: number; variant?: string | undefined };
export type AccountOrder = {
  ref: string;
  createdAt: string;
  status: OrderStatus;
  items: AccountOrderItem[];
  address: { city: string; district: string; address: string };
  subtotal: number;
  fee: number;
  total: number;
};
export type AccountData = { profile: Profile; addresses: Address[]; orders: AccountOrder[] };

/** Chiffres uniquement, préfixe +212/00212 ramené à 0 : « +212 6 00… » ≡ « 06 00… ». */
export function normalizePhone(input: string) {
  const d = input.replace(/\D/g, "");
  if (d.startsWith("00212")) return `0${d.slice(5)}`;
  if (d.startsWith("212")) return `0${d.slice(3)}`;
  return d;
}

export function checkCredentials(phone: string, password: string) {
  return normalizePhone(phone) === normalizePhone(site.demoAccount.phone) && password === site.demoAccount.password;
}

export const firstName = (name: string) => name.trim().split(/\s+/)[0] ?? name;

/**
 * Cible de redirection après connexion : uniquement un chemin interne de l'espace client
 * (évite les redirections ouvertes), sinon /compte.
 */
export function safeRedirect(target: unknown) {
  if (typeof target !== "string") return "/compte";
  if (!target.startsWith("/compte") || target.startsWith("//") || target.startsWith("/compte/connexion")) return "/compte";
  return target;
}

/** Règle de protection des routes /compte/* (null = rien à faire). */
export function guardTarget(state: { hydrated: boolean; isLoggedIn: boolean }, href: string) {
  if (!state.hydrated || state.isLoggedIn) return null;
  return { to: "/compte/connexion" as const, search: { redirect: safeRedirect(href) } };
}

/** Commande du compte à partir du récapitulatif envoyé sur WhatsApp. */
export function orderFromRecap(recap: OrderRecap, slugs: (string | undefined)[] = []): AccountOrder {
  return {
    ref: recap.ref,
    createdAt: recap.createdAt,
    status: "Envoyée",
    items: recap.items.map((i, k) => ({ ...i, slug: slugs[k] })),
    address: { city: recap.customer.city, district: recap.customer.district, address: recap.customer.address },
    subtotal: recap.subtotal,
    fee: recap.fee,
    total: recap.total,
  };
}

/** Construit une commande exemple à partir de produits existants (totaux via les helpers commerce). */
export function sampleOrder(ref: string, createdAt: string, status: OrderStatus, lines: { slug: string; qty: number; variant?: string }[], addr: Address): AccountOrder {
  const items = lines.flatMap((l) => {
    const p = getProductBySlug(l.slug);
    return p ? [{ slug: p.slug, name: p.name, qty: l.qty, price: p.price, variant: l.variant }] : [];
  });
  const tot = cartTotals(items, addr.zone);
  return {
    ref,
    createdAt,
    status,
    items,
    address: { city: getZone(addr.zone)?.label ?? addr.zone, district: addr.district, address: addr.address },
    subtotal: tot.subtotal,
    fee: tot.fee ?? 0,
    total: tot.total,
  };
}

export const defaultAddress = (list: Address[]) => list.find((a) => a.isDefault) ?? list[0];

/** Garantit exactement une adresse par défaut (la première si aucune). */
export function normalizeAddresses(list: Address[]): Address[] {
  if (!list.length) return list;
  const idx = Math.max(0, list.findIndex((a) => a.isDefault));
  return list.map((a, i) => ({ ...a, isDefault: i === idx }));
}
