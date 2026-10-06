import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { getProductBySlug, type Product } from "@/lib/catalogue";
import { cartTotals, track } from "@/lib/commerce";

export type CartLine = { slug: string; qty: number; variant?: string | undefined };
export type AddOptions = { qty?: number; variant?: string | undefined; from?: HTMLElement | null; openDrawer?: boolean };

type Shop = {
  /** false pendant le rendu serveur et le premier rendu client (état SSR-safe). */
  hydrated: boolean;
  lines: CartLine[];
  items: { line: CartLine; product: Product }[];
  count: number;
  subtotal: number;
  add: (slug: string, opts?: AddOptions) => void;
  setQty: (slug: string, qty: number, variant?: string) => void;
  remove: (slug: string, variant?: string) => void;
  clear: () => void;
  favs: string[];
  toggleFav: (slug: string) => void;
  zone: string | undefined;
  setZone: (z: string | undefined) => void;
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;
  assistantOpen: boolean;
  setAssistantOpen: (v: boolean) => void;
  bump: number;
  cartIconRef: React.MutableRefObject<HTMLElement | null>;
};

const Ctx = createContext<Shop | null>(null);
const CART_KEY = "bi_cart";
const FAV_KEY = "bi_favs";
const ZONE_KEY = "bi_zone";

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch { /* stockage plein ou désactivé */ }
}

/** Animation « vol vers le panier » : clone de la vignette jusqu'à l'icône panier. */
function flyToCart(from: HTMLElement, to: HTMLElement) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  const a = from.getBoundingClientRect();
  const b = to.getBoundingClientRect();
  if (!a.width || !b.width) return false;
  const ghost = from.cloneNode(true) as HTMLElement;
  Object.assign(ghost.style, {
    position: "fixed", left: `${a.left}px`, top: `${a.top}px`, width: `${a.width}px`, height: `${a.height}px`, margin: "0",
    zIndex: "100", pointerEvents: "none", borderRadius: "16px", overflow: "hidden", background: "white",
    transition: "transform .7s cubic-bezier(.6,-0.1,.3,1), opacity .7s ease",
  });
  document.body.appendChild(ghost);
  requestAnimationFrame(() => {
    const dx = b.left + b.width / 2 - (a.left + a.width / 2);
    const dy = b.top + b.height / 2 - (a.top + a.height / 2);
    ghost.style.transform = `translate(${dx}px, ${dy}px) scale(0.08)`;
    ghost.style.opacity = "0.3";
  });
  setTimeout(() => ghost.remove(), 720);
  return true;
}

const sameLine = (l: CartLine, slug: string, variant?: string) => l.slug === slug && (l.variant ?? "") === (variant ?? "");

export function ShopProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [favs, setFavs] = useState<string[]>([]);
  const [zone, setZone] = useState<string | undefined>(undefined);
  const [hydrated, setHydrated] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [bump, setBump] = useState(0);
  const cartIconRef = useRef<HTMLElement | null>(null);

  // Hydratation client uniquement.
  useEffect(() => {
    const stored = read<CartLine[]>(CART_KEY, []);
    setLines(Array.isArray(stored) ? stored.filter((l) => l && typeof l.slug === "string" && getProductBySlug(l.slug) && l.qty > 0) : []);
    const f = read<string[]>(FAV_KEY, []);
    setFavs(Array.isArray(f) ? f.filter((s) => typeof s === "string") : []);
    const z = read<string | null>(ZONE_KEY, null);
    setZone(typeof z === "string" ? z : undefined);
    setHydrated(true);
  }, []);
  useEffect(() => { if (hydrated) write(CART_KEY, lines); }, [lines, hydrated]);
  useEffect(() => { if (hydrated) write(FAV_KEY, favs); }, [favs, hydrated]);
  useEffect(() => { if (hydrated) write(ZONE_KEY, zone ?? null); }, [zone, hydrated]);

  const add = useCallback((slug: string, opts: AddOptions = {}) => {
    const { qty = 1, variant, from, openDrawer = true } = opts;
    setLines((prev) => {
      const ex = prev.find((l) => sameLine(l, slug, variant));
      if (ex) return prev.map((l) => (sameLine(l, slug, variant) ? { ...l, qty: Math.min(99, l.qty + qty) } : l));
      return [...prev, variant ? { slug, qty, variant } : { slug, qty }];
    });
    const p = getProductBySlug(slug);
    track("add_to_cart", { currency: "MAD", value: (p?.price ?? 0) * qty, items: [{ item_id: slug, item_name: p?.name, price: p?.price, quantity: qty, item_variant: variant }] });
    const flew = from && cartIconRef.current ? flyToCart(from, cartIconRef.current) : false;
    setTimeout(() => {
      setBump((b) => b + 1);
      if (openDrawer) setCartOpen(true);
    }, flew ? 650 : 0);
  }, []);

  const setQty = useCallback((slug: string, qty: number, variant?: string) => {
    setLines((prev) => prev.map((l) => (sameLine(l, slug, variant) ? { ...l, qty: Math.max(1, Math.min(99, qty)) } : l)));
  }, []);
  const remove = useCallback((slug: string, variant?: string) => setLines((prev) => prev.filter((l) => !sameLine(l, slug, variant))), []);
  const clear = useCallback(() => setLines([]), []);
  const toggleFav = useCallback((slug: string) => setFavs((f) => (f.includes(slug) ? f.filter((x) => x !== slug) : [...f, slug])), []);

  const value = useMemo<Shop>(() => {
    const items = lines.flatMap((line) => {
      const product = getProductBySlug(line.slug);
      return product ? [{ line, product }] : [];
    });
    const totals = cartTotals(items.map((i) => ({ price: i.product.price, qty: i.line.qty })));
    return {
      hydrated, lines, items,
      count: totals.count,
      subtotal: totals.subtotal,
      add, setQty, remove, clear, favs, toggleFav, zone, setZone,
      cartOpen, setCartOpen, assistantOpen, setAssistantOpen, bump, cartIconRef,
    };
  }, [hydrated, lines, favs, zone, cartOpen, assistantOpen, bump, add, setQty, remove, clear, toggleFav]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useShop() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useShop must be used within ShopProvider");
  return c;
}
